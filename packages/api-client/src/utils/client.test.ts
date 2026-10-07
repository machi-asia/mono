import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient, defaultApiClient } from "./client";

describe("ApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("instantiates default client", () => {
    expect(defaultApiClient).toBeInstanceOf(ApiClient);
  });

  it("calls rose.getSettings with correct headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ persona: "friendly" }),
    });
    global.fetch = mockFetch;

    const client = new ApiClient({
      baseUrl: "http://localhost:3005",
      getAuthToken: () => "test-token",
    });

    const res = await client.rose.getSettings();
    expect(res).toEqual({ persona: "friendly" });
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/rose/settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    });
  });

  it("calls sync.sendEvents with correct payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, count: 1 }),
    });
    global.fetch = mockFetch;

    const client = new ApiClient({ baseUrl: "http://localhost:3005" });
    const res = await client.sync.sendEvents([{ roomId: "r1", type: "input" }]);

    expect(res).toEqual({ success: true, count: 1 });
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/sync/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ roomId: "r1", type: "input" }]),
    });
  });

  it("calls usage.getMetrics", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: "healthy", totalRequests: 10 }),
    });
    global.fetch = mockFetch;

    const client = new ApiClient({ baseUrl: "http://localhost:3005" });
    const res = await client.usage.getMetrics();

    expect(res).toEqual({ status: "healthy", totalRequests: 10 });
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/usage/metrics", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });
});
