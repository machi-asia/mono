import type { ApiClientConfig, ChatMessage, RoseUsageResponse } from "../types";

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return "";
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
}

export const defaultApiClient = new ApiClient();
