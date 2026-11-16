import { describe, it, expect, beforeEach } from "vitest";
import { resetFallbackUsageLedger } from "@mono/database";
import {
  getRoseUsage,
  checkAndIncrementRoseUsage,
  getRoleLimits,
  currentWeek,
  currentDay,
} from "./usage";

describe("@mono/rose usage utilities", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
  });

  it("returns date keys and role limits", () => {
    expect(currentDay()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(currentWeek()).toMatch(/^\d{4}-W\d{2}$/);
    expect(getRoleLimits(["admin"]).role).toBe("admin");
    expect(getRoleLimits(["guest"]).role).toBe("guest");
    expect(getRoleLimits([]).role).toBe("member");
  });

  it("reads and increments Rose usage via the unified @mono/database quota engine", async () => {
    const initial = await getRoseUsage("guest-rose-test", ["guest"], {} as any);
    expect(initial.allowed).toBe(true);
    expect(initial.dailyCount).toBe(0);

    const incremented = await checkAndIncrementRoseUsage("guest-rose-test", ["guest"], {} as any);
    expect(incremented.allowed).toBe(true);
    expect(incremented.dailyCount).toBe(1);
  });
});
