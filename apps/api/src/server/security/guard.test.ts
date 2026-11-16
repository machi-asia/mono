import { describe, it, expect, beforeEach } from "vitest";
import { resetFallbackUsageLedger } from "@mono/database";
import {
  buildCorsHeaders,
  extractClientIdentifier,
  resolveRequestAuth,
  withApiGuard,
} from "./guard";

describe("API Security Guard & Quota Locking", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
  });

  it("extracts deterministic client IP identifiers for guests", () => {
    const req = new Request("http://localhost:3005/rose/chat", {
      headers: { "x-forwarded-for": "203.0.113.42, 10.0.0.1" },
    });
    expect(extractClientIdentifier(req)).toBe("ip:203.0.113.42");
  });

  it("validates CORS origins against allowlist", () => {
    const allowedReq = new Request("http://localhost:3005/health", {
      headers: { origin: "https://rose.machi.asia" },
    });
    expect(buildCorsHeaders(allowedReq)["Access-Control-Allow-Origin"]).toBe(
      "https://rose.machi.asia"
    );
    expect(buildCorsHeaders(allowedReq)["Access-Control-Allow-Headers"]).toContain("X-User-Id");

    const blockedReq = new Request("http://localhost:3005/health", {
      headers: { origin: "https://evil-attacker.example.com" },
    });
    expect(buildCorsHeaders(blockedReq)["Access-Control-Allow-Origin"]).toBe(
      "https://machi.asia"
    );
  });

  it("rejects x-user-id header spoofing in production mode", async () => {
    const prevNodeEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = "production";
    try {
      const req = new Request("http://localhost:3005/rose/chat", {
        headers: {
          "x-user-id": "spoofed-admin-uuid",
          "x-forwarded-for": "198.51.100.7",
        },
      });
      const auth = await resolveRequestAuth(req);
      expect(auth.userId).toBe("ip:198.51.100.7");
      expect(auth.role).toBe("guest");
      expect(auth.isAuthenticated).toBe(false);
    } finally {
      (process.env as any).NODE_ENV = prevNodeEnv;
    }
  });

  it("locks API route with HTTP 429 when request quota is exceeded", async () => {
    const makeReq = () =>
      new Request("http://localhost:3005/test", {
        method: "POST",
        headers: { "x-forwarded-for": "192.0.2.99" },
      });

    // Exhaust guest daily request limit (50) in a single cost-50 call
    const first = await withApiGuard(
      makeReq(),
      { endpoint: "/test", app: "api", metric: "requests", cost: 50 },
      async () => new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    expect(first.status).toBe(200);

    // Next call must be locked with 429
    const second = await withApiGuard(
      makeReq(),
      { endpoint: "/test", app: "api", metric: "requests", cost: 1 },
      async () => new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    expect(second.status).toBe(429);
    const body = await second.json();
    expect(body.error.code).toBe("rate_limit_exceeded");
    expect(body.quota.locked).toBe(true);
  });
});
