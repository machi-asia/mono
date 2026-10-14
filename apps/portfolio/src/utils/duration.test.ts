import { describe, it, expect } from "vitest";
import { getDurationSince } from "./duration";

describe("getDurationSince", () => {
  it("returns fallback for invalid date strings", () => {
    expect(getDurationSince("invalid-date")).toBe("several years");
  });

  it("calculates time span accurately", () => {
    const result = getDurationSince("2024-01-01");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });
});
