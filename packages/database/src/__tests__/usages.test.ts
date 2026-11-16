import { describe, it, expect, beforeEach } from "vitest";
import {
  ROLE_IMAGE_MAX_SIZE_KB,
  ROLE_STORAGE_LIMIT_BYTES,
  ROLE_QUOTAS,
  USAGE_METRICS_REGISTRY,
  registerUsageMetric,
  getMetricDefinition,
  listRegisteredMetrics,
  getRoleQuotaForMetric,
  isRoleAtLeast,
  recordAndCheckUsage,
  getUserUsageStatus,
  getUserUsageSummary,
  getRoseUsage,
  checkAndIncrementRoseUsage,
  resetFallbackUsageLedger,
} from "../usages";

describe("database usages module", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
  });

  it("defines accurate image size constraints per role", () => {
    expect(ROLE_IMAGE_MAX_SIZE_KB.guest).toBe(2);
    expect(ROLE_IMAGE_MAX_SIZE_KB.member).toBe(20);
    expect(ROLE_IMAGE_MAX_SIZE_KB.pro).toBe(10240);
    expect(ROLE_IMAGE_MAX_SIZE_KB.admin).toBe(Infinity);
  });

  it("defines accurate storage limit bytes per role", () => {
    expect(ROLE_STORAGE_LIMIT_BYTES.guest).toBe(1 * 1024 * 1024);
    expect(ROLE_STORAGE_LIMIT_BYTES.member).toBe(5 * 1024 * 1024);
    expect(ROLE_STORAGE_LIMIT_BYTES.pro).toBe(1024 * 1024 * 1024);
  });

  it("defines role quotas for all roles and metrics", () => {
    const roles = ["guest", "member", "pro", "admin"] as const;
    const metrics = ["requests", "ai_tokens", "turns", "storage_bytes"] as const;

    for (const role of roles) {
      for (const metric of metrics) {
        expect(ROLE_QUOTAS[role][metric]).toBeDefined();
        expect(ROLE_QUOTAS[role][metric].daily).toBeGreaterThan(0);
        expect(ROLE_QUOTAS[role][metric].monthly).toBeGreaterThan(0);
      }
    }
  });

  it("exports recordAndCheckUsage and getUserUsageSummary functions", () => {
    expect(typeof recordAndCheckUsage).toBe("function");
    expect(typeof getUserUsageStatus).toBe("function");
    expect(typeof getUserUsageSummary).toBe("function");
    expect(typeof getRoseUsage).toBe("function");
    expect(typeof checkAndIncrementRoseUsage).toBe("function");
  });

  it("enforces strict quota lock when daily limit is exceeded in fallback ledger", async () => {
    const mockClient = {
      rpc: async () => ({ data: null, error: { message: "offline" } }),
    } as any;

    const r1 = await recordAndCheckUsage({
      userId: "guest-ip-1.2.3.4",
      app: "rose",
      metric: "turns",
      amount: 1,
      role: "guest",
      dailyLimitOverride: 2,
      monthlyLimitOverride: 10,
      clientOverride: mockClient,
    });
    expect(r1.allowed).toBe(true);
    expect(r1.dailyCount).toBe(1);
    expect(r1.remaining).toBe(1);

    const r2 = await recordAndCheckUsage({
      userId: "guest-ip-1.2.3.4",
      app: "rose",
      metric: "turns",
      amount: 1,
      role: "guest",
      dailyLimitOverride: 2,
      monthlyLimitOverride: 10,
      clientOverride: mockClient,
    });
    expect(r2.allowed).toBe(true);
    expect(r2.dailyCount).toBe(2);
    expect(r2.remaining).toBe(0);

    // 3rd call must be locked!
    const r3 = await recordAndCheckUsage({
      userId: "guest-ip-1.2.3.4",
      app: "rose",
      metric: "turns",
      amount: 1,
      role: "guest",
      dailyLimitOverride: 2,
      monthlyLimitOverride: 10,
      clientOverride: mockClient,
    });
    expect(r3.allowed).toBe(false);
    expect(r3.exceededType).toBe("daily");
    expect(r3.remaining).toBe(0);
  });

  it("supports dynamic metric registration and custom component metric tracking", async () => {
    expect(listRegisteredMetrics().length).toBeGreaterThanOrEqual(6);
    expect(USAGE_METRICS_REGISTRY.has("blueprint_exports")).toBe(true);

    registerUsageMetric({
      metric: "arena_spawns",
      label: "Arena Boss Spawns",
      unit: "spawns",
      defaultApp: "hells-forge",
      minRole: "member",
      quotas: {
        guest: { daily: 0, monthly: 0 },
        member: { daily: 3, monthly: 30 },
        pro: { daily: 50, monthly: 500 },
        admin: { daily: 10_000, monthly: 100_000 },
      },
    });

    const def = getMetricDefinition("arena_spawns");
    expect(def.label).toBe("Arena Boss Spawns");
    expect(getRoleQuotaForMetric("member", "arena_spawns").daily).toBe(3);

    // Guest is blocked by minRole: "member"
    const guestAttempt = await recordAndCheckUsage({
      userId: "guest-user",
      metric: "arena_spawns",
      role: "guest",
      amount: 1,
    });
    expect(guestAttempt.allowed).toBe(false);
    expect(guestAttempt.exceededType).toBe("role");

    // Member is allowed up to 3 times
    const memberAttempt = await recordAndCheckUsage({
      userId: "member-user",
      metric: "arena_spawns",
      role: "member",
      amount: 2,
    });
    expect(memberAttempt.allowed).toBe(true);
    expect(memberAttempt.dailyCount).toBe(2);
    expect(memberAttempt.remaining).toBe(1);

    // Unregistered ad-hoc metric also synthesizes defaults cleanly
    const adHocDef = getMetricDefinition("custom_widget_clicks");
    expect(adHocDef.label).toBe("Custom Widget Clicks");
    expect(adHocDef.quotas.member.daily).toBeGreaterThan(0);
    expect(isRoleAtLeast("pro", "member")).toBe(true);
    expect(isRoleAtLeast("guest", "member")).toBe(false);
  });

  it("rejects negative usage increments so users can never decrement or reset usage", async () => {
    await expect(
      recordAndCheckUsage({
        userId: "malicious-user",
        metric: "turns",
        amount: -10,
        role: "member",
      })
    ).rejects.toThrow(/Invalid negative usage increment/);
  });
});
