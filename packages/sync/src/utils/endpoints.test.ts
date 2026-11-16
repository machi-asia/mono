import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSyncEventsUrl, getSyncRoomsUrl } from "./endpoints";

describe("sync endpoints", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("resolves default sync endpoints with production options", () => {
    expect(getSyncEventsUrl({ forceLocal: false })).toBe("https://api.machi.asia/sync/events");
    expect(getSyncRoomsUrl({ forceLocal: false })).toBe("https://api.machi.asia/sync/rooms");
  });

  it("resolves local development endpoints with forceLocal: true", () => {
    expect(getSyncEventsUrl({ forceLocal: true })).toBe("http://localhost:3005/sync/events");
    expect(getSyncRoomsUrl({ forceLocal: true })).toBe("http://localhost:3005/sync/rooms");
  });

  it("resolves custom API_SERVICE_URL endpoint", () => {
    process.env.API_SERVICE_URL = "https://custom-api.machi.asia";

    expect(getSyncEventsUrl({ forceLocal: false })).toBe("https://custom-api.machi.asia/sync/events");
    expect(getSyncRoomsUrl({ forceLocal: false })).toBe("https://custom-api.machi.asia/sync/rooms");
  });
});
