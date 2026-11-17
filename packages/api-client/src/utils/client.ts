import { resolveApiBaseUrl } from "@mono/app-config";
import type {
  AdminDirectoryUser,
  AdminManageUsageRequest,
  AdminManageUsageResponse,
  AdminOverviewResponse,
  AdminRoseConversation,
  AdminSupportTicket,
  AdminUsageRecord,
  AdminUserRole,
  ApiClientConfig,
  ApiQuotaStatus,
  ChatMessage,
  RoseUsageResponse,
  ItemListReportSubmission,
  ItemListCommunityOverride,
  ItemListReportItem,
  TrackUsageRequest,
  TrackUsageResponse,
  UserQuotaSummaryResponse,
  VisitorOriginContext,
} from "../types";

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly quota?: ApiQuotaStatus;

  constructor(message: string, status: number, code = "api_error", quota?: ApiQuotaStatus) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.quota = quota;
  }
}

export class ApiClient {
  private config: ApiClientConfig;
  private quotaStatus: ApiQuotaStatus = { locked: false };

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || getApiBaseUrl(),
      ...config,
    };
  }

  public configure(partial: Partial<ApiClientConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
    };
  }

  public getQuotaStatus(): ApiQuotaStatus {
    return this.quotaStatus;
  }

  public clearQuotaLock(): void {
    this.quotaStatus = { locked: false };
  }

  private async getHeaders(includeJsonContentType = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    if (includeJsonContentType) {
      headers["Content-Type"] = "application/json";
    }
    if (this.config.getAuthToken) {
      const token = await this.config.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private resolveUrl(path: string): string {
    const base = (this.config.baseUrl ?? getApiBaseUrl()).replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  private inspectResponseQuota(res: Response, body?: any): void {
    if (res.status === 401) {
      this.config.onUnauthorized?.();
    }
    if (res.status === 429 || body?.error?.code === "usage_limit_exceeded" || body?.error?.code === "rate_limit_exceeded") {
      const retryHeader = res.headers?.get?.("Retry-After");
      const retryAfterSeconds = retryHeader ? Number.parseInt(retryHeader, 10) : undefined;
      const status: ApiQuotaStatus = {
        locked: true,
        exceededType: body?.usage?.exceededType || body?.quota?.exceededType || "rate_limit",
        retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined,
        message: body?.error?.message || body?.error || "API usage quota limit reached.",
      };
      this.quotaStatus = status;
      this.config.onQuotaLocked?.(status);
    }
  }

  // Rose AI Endpoints
  public rose = {
    chat: async (messagesOrBody: ChatMessage[] | Record<string, unknown>, options: { stream?: boolean } = {}) => {
      const headers = await this.getHeaders();
      const payload = Array.isArray(messagesOrBody)
        ? { messages: messagesOrBody, ...options }
        : { ...messagesOrBody, ...options };
      const res = await fetch(this.resolveUrl("/rose/chat"), {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (res.status === 429 || res.status === 401) {
        this.inspectResponseQuota(res);
      }
      return res;
    },

    getSettings: async () => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/settings"), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    saveSettings: async (payload: Record<string, unknown>) => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/settings"), {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    getUsage: async (): Promise<RoseUsageResponse> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/usage"), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      if (data && data.allowed === false) {
        this.quotaStatus = {
          locked: true,
          exceededType: data.exceededType || "daily",
          message: "Rose AI quota reached.",
        };
      }
      return data;
    },

    transcribe: async (audioBlob: Blob, language?: string): Promise<{ ok?: boolean; text?: string; transcript?: string }> => {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("file", audioBlob, "recording.wav");
      if (language) {
        formData.append("language", language);
      }

      const headers = await this.getHeaders(false);
      const res = await fetch(this.resolveUrl("/rose/transcribe"), {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    getConversations: async (): Promise<{ ok: boolean; userId: string; conversations: AdminRoseConversation[] }> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/conversations"), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    saveConversations: async (
      conversations: unknown[],
      originApp?: string
    ): Promise<{ ok: boolean; count: number; conversations: AdminRoseConversation[] }> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/conversations"), {
        method: "POST",
        headers,
        body: JSON.stringify({ conversations, originApp }),
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    deleteConversation: async (id: string): Promise<{ ok: boolean; deleted: boolean }> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl(`/rose/conversations?id=${encodeURIComponent(id)}`), {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },
  };

  // Realtime Sync Endpoints
  public sync = {
    sendEvents: async (events: any[]) => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/sync/events"), {
        method: "POST",
        headers,
        body: JSON.stringify(events),
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    getRoomInfo: async (roomId: string) => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl(`/sync/rooms?roomId=${encodeURIComponent(roomId)}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },
  };

  // Usage & Telemetry Endpoints
  public usage = {
    getMetrics: async () => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/usage/metrics"), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    getUserQuotaSummary: async (
      metrics?: string[],
      origin?: VisitorOriginContext
    ): Promise<UserQuotaSummaryResponse> => {
      const headers = await this.getHeaders();
      const params = new URLSearchParams({ scope: "user" });
      if (metrics && metrics.length > 0) {
        params.set("metrics", metrics.join(","));
      }
      if (origin?.app) params.set("app", origin.app);
      if (origin?.hostname) params.set("hostname", origin.hostname);
      if (origin?.pathname) params.set("pathname", origin.pathname);
      if (origin?.referrer) params.set("referrer", origin.referrer);
      if (origin?.utmSource) params.set("utmSource", origin.utmSource);

      const res = await fetch(this.resolveUrl(`/usage/metrics?${params.toString()}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    getSnapshot: async (metrics?: string[]): Promise<UserQuotaSummaryResponse> => {
      const headers = await this.getHeaders();
      const query = metrics && metrics.length > 0 ? `?metrics=${encodeURIComponent(metrics.join(","))}` : "";
      const res = await fetch(this.resolveUrl(`/usage/track${query}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    track: async (payload: TrackUsageRequest): Promise<TrackUsageResponse> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/usage/track"), {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },
  };

  // ItemList Endpoints
  public itemlist = {
    getOverrides: async (gameId: string): Promise<ItemListCommunityOverride[]> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl(`/itemlist/overrides?gameId=${encodeURIComponent(gameId)}`), {
        method: "GET",
        headers,
      });
      if (!res.ok) {
        this.inspectResponseQuota(res);
        throw new Error(`Failed to fetch overrides: ${res.statusText}`);
      }
      return res.json();
    },

    submitReport: async (
      payload: ItemListReportSubmission
    ): Promise<{ success: boolean; report?: ItemListReportItem; error?: string }> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/itemlist/reports"), {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      this.inspectResponseQuota(res, data);
      return data;
    },

    admin: {
      getReports: async (): Promise<ItemListReportItem[]> => {
        const headers = await this.getHeaders();
        const res = await fetch(this.resolveUrl("/itemlist/admin/reports"), {
          method: "GET",
          headers,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          this.inspectResponseQuota(res, errData);
          const errMsg = typeof errData.error === "string" ? errData.error : errData?.error?.message;
          throw new Error(errMsg || `Failed to fetch admin reports: ${res.statusText}`);
        }
        return res.json();
      },

      updateReportStatus: async (
        reportId: string,
        status: "pending" | "resolved" | "rejected"
      ): Promise<{ success: boolean; report?: ItemListReportItem; error?: string }> => {
        const headers = await this.getHeaders();
        const res = await fetch(this.resolveUrl(`/itemlist/admin/reports/${encodeURIComponent(reportId)}`), {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        this.inspectResponseQuota(res, data);
        return data;
      },
    },
  };

  // Unified Machi Asia Admin Portal Endpoints
  public admin = {
    getOverview: async (siteId?: string): Promise<AdminOverviewResponse> => {
      const headers = await this.getHeaders();
      const query = siteId && siteId !== "all" ? `?siteId=${encodeURIComponent(siteId)}` : "";
      const res = await fetch(this.resolveUrl(`/admin/overview${query}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to fetch admin overview: ${res.statusText}`);
      }
      return data;
    },

    getUsers: async (siteId?: string): Promise<{ ok: boolean; users: AdminDirectoryUser[] }> => {
      const headers = await this.getHeaders();
      const query = siteId && siteId !== "all" ? `?siteId=${encodeURIComponent(siteId)}` : "";
      const res = await fetch(this.resolveUrl(`/admin/users${query}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to fetch admin users: ${res.statusText}`);
      }
      return data;
    },

    updateUserRole: async (
      userId: string,
      role: AdminUserRole
    ): Promise<{ ok: boolean; userId: string; role: AdminUserRole }> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/admin/users"), {
        method: "PATCH",
        headers,
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to update user role: ${res.statusText}`);
      }
      return data;
    },

    getUsage: async (params?: {
      userId?: string;
      app?: string;
      metric?: string;
    }): Promise<{ ok: boolean; records: AdminUsageRecord[]; systemSummary: Record<string, unknown> }> => {
      const headers = await this.getHeaders();
      const sp = new URLSearchParams();
      if (params?.userId) sp.set("userId", params.userId);
      if (params?.app) sp.set("app", params.app);
      if (params?.metric) sp.set("metric", params.metric);
      const q = sp.toString();
      const res = await fetch(this.resolveUrl(`/admin/usage${q ? `?${q}` : ""}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to fetch admin usage: ${res.statusText}`);
      }
      return data;
    },

    manageUsage: async (payload: AdminManageUsageRequest): Promise<AdminManageUsageResponse> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/admin/usage"), {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to update usage: ${res.statusText}`);
      }
      return data;
    },

    getRoseChats: async (params?: {
      search?: string;
      userId?: string;
      limit?: number;
    }): Promise<{ ok: boolean; conversations: AdminRoseConversation[] }> => {
      const headers = await this.getHeaders();
      const sp = new URLSearchParams();
      if (params?.search) sp.set("search", params.search);
      if (params?.userId) sp.set("userId", params.userId);
      if (params?.limit) sp.set("limit", String(params.limit));
      const q = sp.toString();
      const res = await fetch(this.resolveUrl(`/admin/rose-chats${q ? `?${q}` : ""}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to fetch Rose chats: ${res.statusText}`);
      }
      return data;
    },

    deleteRoseChat: async (
      userId: string,
      conversationId: string
    ): Promise<{ ok: boolean; deleted: boolean }> => {
      const headers = await this.getHeaders();
      const res = await fetch(
        this.resolveUrl(
          `/admin/rose-chats?userId=${encodeURIComponent(userId)}&conversationId=${encodeURIComponent(conversationId)}`
        ),
        {
          method: "DELETE",
          headers,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to delete Rose chat: ${res.statusText}`);
      }
      return data;
    },

    getTickets: async (params?: {
      app?: string;
      status?: string;
    }): Promise<{ ok: boolean; tickets: AdminSupportTicket[] }> => {
      const headers = await this.getHeaders();
      const sp = new URLSearchParams();
      if (params?.app) sp.set("app", params.app);
      if (params?.status) sp.set("status", params.status);
      const q = sp.toString();
      const res = await fetch(this.resolveUrl(`/admin/tickets${q ? `?${q}` : ""}`), {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to fetch tickets: ${res.statusText}`);
      }
      return data;
    },

    updateTicketStatus: async (
      ticketId: string,
      status: "open" | "in_progress" | "resolved" | "closed"
    ): Promise<{ ok: boolean; ticket: AdminSupportTicket }> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/admin/tickets"), {
        method: "PATCH",
        headers,
        body: JSON.stringify({ ticketId, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        this.inspectResponseQuota(res, data);
        throw new Error(data?.error?.message || `Failed to update ticket status: ${res.statusText}`);
      }
      return data;
    },
  };
}

export const defaultApiClient = new ApiClient();
