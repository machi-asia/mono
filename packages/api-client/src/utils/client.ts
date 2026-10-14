import type {
  ApiClientConfig,
  ChatMessage,
  RoseUsageResponse,
  ItemListReportCorrections,
  ItemListReportSubmission,
  ItemListCommunityOverride,
  ItemListReportItem,
} from "../types";

export function getApiBaseUrl(): string {
  const env = typeof globalThis !== "undefined" ? (globalThis as Record<string, unknown>).process as { env?: Record<string, string | undefined> } | undefined : undefined;
  if (env && env.env) {
    const url = env.env.API_SERVICE_URL || env.env.NEXT_PUBLIC_API_URL;
    if (url) {
      return url.replace(/\/$/, "");
    }
  }
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:3005";
    }
  }
  return "https://api.machi.asia";
}

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || getApiBaseUrl(),
      ...config,
    };
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.config.getAuthToken) {
      const token = await this.config.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private resolveUrl(path: string): string {
    const base = this.config.baseUrl || "";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  // Rose AI Endpoints
  public rose = {
    chat: async (messages: ChatMessage[], options: { stream?: boolean } = {}) => {
      const headers = await this.getHeaders();
      return fetch(this.resolveUrl("/rose/chat"), {
        method: "POST",
        headers,
        body: JSON.stringify({ messages, ...options }),
      });
    },

    getSettings: async () => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/settings"), {
        method: "GET",
        headers,
      });
      return res.json();
    },

    getUsage: async (): Promise<RoseUsageResponse> => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl("/rose/usage"), {
        method: "GET",
        headers,
      });
      return res.json();
    },

    transcribe: async (audioBlob: Blob): Promise<{ text: string }> => {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      const token = this.config.getAuthToken ? await this.config.getAuthToken() : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(this.resolveUrl("/rose/transcribe"), {
        method: "POST",
        headers,
        body: formData,
      });
      return res.json();
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
      return res.json();
    },

    getRoomInfo: async (roomId: string) => {
      const headers = await this.getHeaders();
      const res = await fetch(this.resolveUrl(`/sync/rooms?roomId=${encodeURIComponent(roomId)}`), {
        method: "GET",
        headers,
      });
      return res.json();
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
      return res.json();
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
      return res.json();
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
          throw new Error(errData.error || `Failed to fetch admin reports: ${res.statusText}`);
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
        return res.json();
      },
    },
  };
}

export const defaultApiClient = new ApiClient();
