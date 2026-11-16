import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("docs sitemap", () => {
  it("includes presentation and sections routes in sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/components/presentation"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/components/sections"))).toBe(true);
  });
});
