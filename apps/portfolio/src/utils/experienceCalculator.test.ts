import { describe, it, expect } from "vitest";
import { calculateTotalExperience, formatExperience } from "./experienceCalculator";

describe("experienceCalculator", () => {
  it("calculates total experience from periods array", () => {
    const periods = ["June 2024 - Present"];
    const result = calculateTotalExperience(periods);
    expect(result).toBeDefined();
    expect(result.years).toBeGreaterThanOrEqual(0);
    expect(result.months).toBeGreaterThanOrEqual(0);
  });

  it("formats experience in human-readable format", () => {
    expect(formatExperience(2, 6)).toBe("2 yrs 6 mos");
    expect(formatExperience(1, 0)).toBe("1 yr");
    expect(formatExperience(0, 8)).toBe("8 mos");
  });
});
