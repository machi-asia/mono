import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient, defaultApiClient, getApiBaseUrl } from "./client";

describe("ApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.API_SERVICE_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it("instantiates default client", () => {
    expect(defaultApiClient).toBeInstanceOf(ApiClient);
  });

  it("resolves base URL prioritizing API_SERVICE_URL then NEXT_PUBLIC_API_URL", () => {
    expect(getApiBaseUrl()).toBe("https://api.machi.asia");

    process.env.NEXT_PUBLIC_API_URL = "https://api.machi.asia/";
    expect(getApiBaseUrl()).toBe("https://api.machi.asia");

    process.env.API_SERVICE_URL = "http://internal-api:3005/";
    expect(getApiBaseUrl()).toBe("http://internal-api:3005");
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

  it("calls itemlist.getOverrides with gameId", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ item_id: "cogwheel", reporter_count: 3 }]),
    });
    global.fetch = mockFetch;

    const client = new ApiClient({ baseUrl: "http://localhost:3005" });
    const res = await client.itemlist.getOverrides("create");

    expect(res).toEqual([{ item_id: "cogwheel", reporter_count: 3 }]);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/itemlist/overrides?gameId=create", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("calls itemlist.submitReport with payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    const client = new ApiClient({ baseUrl: "http://localhost:3005" });
    const payload = {
      gameId: "create",
      itemId: "cogwheel",
      itemName: "Cogwheel",
      issueType: "recipe_wrong",
    };
    const res = await client.itemlist.submitReport(payload);

    expect(res).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/itemlist/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });

  it("calls itemlist.admin.getReports and updateReportStatus with auth headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: "rep1", status: "pending" }]),
    });
    global.fetch = mockFetch;

    const client = new ApiClient({
      baseUrl: "http://localhost:3005",
      getAuthToken: () => "admin-token",
    });

    const reports = await client.itemlist.admin.getReports();
    expect(reports).toEqual([{ id: "rep1", status: "pending" }]);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/itemlist/admin/reports", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin-token",
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const updateRes = await client.itemlist.admin.updateReportStatus("rep1", "resolved");
    expect(updateRes).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3005/itemlist/admin/reports/rep1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin-token",
      },
      body: JSON.stringify({ status: "resolved" }),
    });
  });
});
