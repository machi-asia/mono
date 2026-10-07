import { describe, it, expect } from "vitest";
import {
  ROLE_IMAGE_MAX_SIZE_KB,
  ROLE_STORAGE_LIMIT_BYTES,
  ROLE_QUOTAS,
  recordAndCheckUsage,
  getUserUsageSummary,
} from "../usages";

describe("database usages module", () => {
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
    expect(typeof getUserUsageSummary).toBe("function");
  });
});
