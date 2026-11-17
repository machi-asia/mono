import { describe, it, expect, beforeEach } from "vitest";
import {
  resetFallbackUsageLedger,
  resetFallbackVisitorSessions,
  listVisitorSessions,
} from "@mono/database";
import {
  recordApiCall,
  getSystemUsageSummary,
  handleUsageMetricsRoute,
  handleUsageTrackRoute,
} from "./tracker";

describe("API Usage Tracker & Quota Metrics Route", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
    resetFallbackVisitorSessions();
  });

  it("records API telemetry and returns global system usage with quota matrix", async () => {
    recordApiCall("/health", "GET", 10, false);
    const summary = await getSystemUsageSummary();
    expect(summary.status).toBe("healthy");
    expect(summary.quotas.guest.requests.daily).toBe(50);
    expect(summary.quotas.pro.ai_tokens.monthly).toBe(30_000_000);
  });

  it("returns per-user multi-metric quota status when ?scope=user is requested", async () => {
    const req = new Request("http://localhost:3005/usage/metrics?scope=user", {
      headers: { "x-user-id": "user-metrics-test" },
    });
    const res = await handleUsageMetricsRoute(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe("user-metrics-test");
    expect(body.metrics.requests).toBeDefined();
    expect(body.metrics.turns).toBeDefined();
    expect(body.metrics.ai_tokens).toBeDefined();
    expect(body.metrics.storage_bytes).toBeDefined();
    expect(body.metrics.blueprint_exports).toBeDefined();
    expect(body.quotas.requests).toBeDefined();
  });

  it("tracks and enforces arbitrary component metrics via handleUsageTrackRoute", async () => {
    // Guest quota for blueprint_exports is 5 daily
    const postReq1 = new Request("http://localhost:3005/usage/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "user-track-test",
        "x-test-role": "guest",
      },
      body: JSON.stringify({
        metric: "blueprint_exports",
        amount: 4,
      }),
    });
    const res1 = await handleUsageTrackRoute(postReq1);
    expect(res1.status).toBe(200);
    const body1 = await res1.json();
    expect(body1.ok).toBe(true);
    expect(body1.quota.dailyUsed).toBe(4);
    expect(body1.quota.dailyLimit).toBe(5);
    expect(body1.quota.remaining).toBe(1);

    // Exceeding limit returns 429
    const postReq2 = new Request("http://localhost:3005/usage/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "user-track-test",
        "x-test-role": "guest",
      },
      body: JSON.stringify({
        metric: "blueprint_exports",
        amount: 2,
      }),
    });
    const res2 = await handleUsageTrackRoute(postReq2);
    expect(res2.status).toBe(429);
    const body2 = await res2.json();
    expect(body2.allowed).toBe(false);
    expect(body2.quota.locked).toBe(true);
  });

  it("blocks non-admin clients from inflating their quota via dailyLimitOverride or negative amounts", async () => {
    // Attempt to inflate guest limit from 5 to 999999
    const spoofReq = new Request("http://localhost:3005/usage/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "attacker-guest",
        "x-test-role": "guest",
      },
      body: JSON.stringify({
        metric: "blueprint_exports",
        amount: 10,
        dailyLimitOverride: 999999,
        monthlyLimitOverride: 999999,
      }),
    });
    const spoofRes = await handleUsageTrackRoute(spoofReq);
    expect(spoofRes.status).toBe(429);
    const spoofBody = await spoofRes.json();
    expect(spoofBody.allowed).toBe(false);
    expect(spoofBody.quota.dailyLimit).toBe(5);

    // Attempt to pass negative amount to decrement usage
    const negReq = new Request("http://localhost:3005/usage/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "attacker-guest",
        "x-test-role": "guest",
      },
      body: JSON.stringify({
        metric: "blueprint_exports",
        amount: -5,
      }),
    });
    const negRes = await handleUsageTrackRoute(negReq);
    expect(negRes.status).toBe(400);
    const negBody = await negRes.json();
    expect(negBody.error.code).toBe("bad_request");
  });

  it("records visitor origin, Vercel geo, and parsed UA when scope=user is requested", async () => {
    const req = new Request(
      "http://localhost:3005/usage/metrics?scope=user&app=calculator&pathname=%2Frecipes&referrer=https%3A%2F%2Fgoogle.com",
      {
        headers: {
          "x-user-id": "visitor-geo-user",
          "x-test-role": "guest",
          "x-vercel-ip-country": "JP",
          "x-vercel-ip-country-region": "13",
          "x-vercel-ip-city": "Tokyo",
          "x-forwarded-for": "198.51.100.77",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
        },
      }
    );

    const res = await handleUsageMetricsRoute(req);
    expect(res.status).toBe(200);

    const sessions = await listVisitorSessions({ app: "calculator" });
    expect(sessions.length).toBe(1);
    expect(sessions[0].visitor_id).toBe("visitor-geo-user");
    expect(sessions[0].country).toBe("JP");
    expect(sessions[0].city).toBe("Tokyo");
    expect(sessions[0].referrer).toBe("https://google.com");
    expect(sessions[0].device_type).toBe("desktop");
    expect(sessions[0].browser).toContain("Chrome");
  });
});
