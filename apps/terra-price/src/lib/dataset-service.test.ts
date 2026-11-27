import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCategories,
  getCommoditiesByCategory,
  getCommodityMapPoints,
  isWithinPhilippinesBounds,
  fetchDatasetsPaginated,
  fetchLatestDatasets,
  addDatasetEntry,
} from "./dataset-service";

vi.mock("@mono/auth", () => ({
  createClient: () => {
    throw new Error("Mock offline fallback");
  },
}));

describe("dataset-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns sorted categories and category-filtered commodities", () => {
    const categories = getCategories();
    expect(categories).toContain("cereals and tubers");
    expect(categories).toContain("vegetables and fruits");

    const cereals = getCommoditiesByCategory("cereals and tubers");
    expect(cereals).toContain("Rice (regular, milled)");
    expect(getCommoditiesByCategory("unknown-category")).toEqual([]);
  });

  it("validates Philippines geographic bounds accurately", () => {
    expect(isWithinPhilippinesBounds(14.6, 120.98)).toBe(true); // Metro Manila
    expect(isWithinPhilippinesBounds(7.18, 125.44)).toBe(true); // Davao
    expect(isWithinPhilippinesBounds(35.67, 139.65)).toBe(false); // Tokyo
    expect(isWithinPhilippinesBounds(Number.NaN, 120.98)).toBe(false);
  });

  it("paginates and lists latest fallback datasets when Supabase is unavailable", async () => {
    const page1 = await fetchDatasetsPaginated(1, 50);
    expect(page1.source).toBe("fallback");
    expect(page1.datasets).toHaveLength(50);
    expect(page1.pagination.total_count).toBe(60);
    expect(page1.pagination.total_pages).toBe(2);
    expect(page1.pagination.has_next).toBe(true);

    const latest = await fetchLatestDatasets(5);
    expect(latest.datasets).toHaveLength(5);
  });

  it("validates bounds and records dataset entries gracefully", async () => {
    const outOfBounds = await addDatasetEntry({
      latitude: 40.71,
      longitude: -74.0,
      category: "cereals and tubers",
      commodity: "Rice (regular, milled)",
      pricetype: "Retail",
      price: 45,
    });
    expect(outOfBounds.success).toBe(false);

    const valid = await addDatasetEntry(
      {
        latitude: 14.6,
        longitude: 120.98,
        category: "cereals and tubers",
        commodity: "Rice (regular, milled)",
        pricetype: "retail",
        price: 45.5,
      },
      "user-1"
    );
    expect(valid.success).toBe(true);
    expect(valid.entry?.pricetype).toBe("Retail");
    expect(valid.entry?.price).toBe(45.5);
  });

  it("returns historical commodity map points and merges new entries", () => {
    const retailPoints = getCommodityMapPoints("Rice (regular, milled)", "Retail");
    expect(retailPoints.length).toBeGreaterThan(20);
    expect(retailPoints.every((p) => p.pricetype === "Retail")).toBe(true);

    const withExtra = getCommodityMapPoints("Rice (regular, milled)", "Retail", [
      {
        id: 9999,
        latitude: 14.55,
        longitude: 121.02,
        category: "cereals and tubers",
        commodity: "Rice (regular, milled)",
        pricetype: "Retail",
        price: 58.25,
      },
    ]);
    expect(withExtra).toHaveLength(retailPoints.length + 1);
    expect(withExtra.some((p) => p.price === 58.25 && p.market === "Community Entry")).toBe(
      true
    );
  });
});
