import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRoseApiBasePath, getRoseTranscribeEndpoint } from "./endpoints";

describe("rose endpoints", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("resolves default rose endpoints with production options", () => {
    expect(getRoseApiBasePath({ forceLocal: false })).toBe("https://api.machi.asia/rose");
    expect(getRoseTranscribeEndpoint({ forceLocal: false })).toBe("https://api.machi.asia/rose/transcribe");
  });

  it("resolves local development endpoints with forceLocal: true", () => {
    expect(getRoseApiBasePath({ forceLocal: true })).toBe("http://localhost:3005/rose");
    expect(getRoseTranscribeEndpoint({ forceLocal: true })).toBe("http://localhost:3005/rose/transcribe");
  });

  it("resolves custom API_SERVICE_URL endpoint", () => {
    process.env.API_SERVICE_URL = "https://custom-api.machi.asia";

    expect(getRoseApiBasePath({ forceLocal: false })).toBe("https://custom-api.machi.asia/rose");
    expect(getRoseTranscribeEndpoint({ forceLocal: false })).toBe("https://custom-api.machi.asia/rose/transcribe");
  });
});
