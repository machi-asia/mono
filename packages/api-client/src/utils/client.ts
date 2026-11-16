import { resolveApiBaseUrl } from "@mono/app-config";
import type {
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

    getUserQuotaSummary: async (metrics?: string[]): Promise<UserQuotaSummaryResponse> => {
      const headers = await this.getHeaders();
      const query = metrics && metrics.length > 0 ? `&metrics=${encodeURIComponent(metrics.join(","))}` : "";
      const res = await fetch(this.resolveUrl(`/usage/metrics?scope=user${query}`), {
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
}

export const defaultApiClient = new ApiClient();
