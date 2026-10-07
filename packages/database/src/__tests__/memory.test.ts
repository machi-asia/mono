import { describe, it, expect } from "vitest";
import { normalizeCategory, normalizeImportance } from "../memory";

describe("database memory module", () => {
  it("normalizes categories correctly", () => {
    expect(normalizeCategory("  PORTFOLIO  ")).toBe("portfolio");
    expect(normalizeCategory("Preferences")).toBe("preferences");
    expect(normalizeCategory("")).toBe("general");
    expect(normalizeCategory(null)).toBe("general");
  });

  it("normalizes importance scores into valid ranges", () => {
    expect(normalizeImportance("low")).toBe("low");
    expect(normalizeImportance("medium")).toBe("medium");
    expect(normalizeImportance("high")).toBe("high");
    expect(normalizeImportance("  HIGH  ")).toBe("high");
    expect(normalizeImportance("invalid")).toBe("medium");
    expect(normalizeImportance(null)).toBe("medium");
  });
});
