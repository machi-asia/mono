import { describe, it, expect, vi } from "vitest";
import { GET, runSupabaseKeepalivePing } from "./route";

describe("Supabase Keep-Alive Cron Endpoint", () => {
  it("records a heartbeat via record_keepalive_heartbeat RPC when available", async () => {
    const mockClient = {
      rpc: vi.fn().mockResolvedValue({
        data: "2026-11-09T03:00:00.000Z",
        error: null,
      }),
    };

    const result = await runSupabaseKeepalivePing("unit_test", mockClient);
    expect(result.ok).toBe(true);
    expect(result.source).toBe("unit_test");
    expect(result.pingedAt).toBe("2026-11-09T03:00:00.000Z");
    expect(mockClient.rpc).toHaveBeenCalledWith("record_keepalive_heartbeat", {
      p_source: "unit_test",
    });
  });

  it("falls back to a lightweight user_roles SELECT when RPC returns an error", async () => {
    const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });
    const selectMock = vi.fn().mockReturnValue({ limit: limitMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    const mockClient = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "function not found" },
      }),
      from: fromMock,
    };

    const result = await runSupabaseKeepalivePing("fallback_test", mockClient);
    expect(result.ok).toBe(true);
    expect(fromMock).toHaveBeenCalledWith("user_roles");
  });

  it("returns degraded status when both RPC and fallback SELECT fail", async () => {
    const limitMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "connection refused" } });
    const selectMock = vi.fn().mockReturnValue({ limit: limitMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    const mockClient = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "rpc error" },
      }),
      from: fromMock,
    };

    const result = await runSupabaseKeepalivePing("error_test", mockClient);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("connection refused");
  });

  it("handles GET /cron/supabase-keepalive requests", async () => {
    const req = new Request(
      "http://localhost:3005/cron/supabase-keepalive?source=github_actions"
    );
    const res = await GET(req);
    expect([200, 503]).toContain(res.status);
    const body = await res.json();
    expect(body.job).toBe("supabase-keepalive");
    expect(body.source).toBe("github_actions");
  });
});
