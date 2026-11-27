import { describe, it, expect } from "vitest";
import { predictFromModel } from "./estimator";
import {
  buildCalibratedPoints,
  computeSharedPriceDomain,
  evaluateCalibratedSpatial,
  evaluateSpatialFast,
  fromMercatorY,
  matern32Kernel,
  precomputeSpatialLayer0,
  predictUnifiedPrice,
  priceToHex,
  priceToRgb,
  renderGpuPredictionHeatmap,
  toMercatorY,
} from "./gpu-heatmap";

describe("gpu-heatmap", () => {
  it("folds non-spatial one-hot features identically to predictFromModel", () => {
    const samples = [
      { lat: 14.6, lng: 120.98, commodity: "Rice (regular, milled)", pricetype: "Retail" },
      { lat: 10.31, lng: 123.89, commodity: "Meat (pork)", pricetype: "Wholesale" },
      { lat: 7.07, lng: 125.61, commodity: "Tomatoes", pricetype: "Retail" },
    ];

    for (const s of samples) {
      const pre = precomputeSpatialLayer0(s.commodity, s.pricetype);
      const fast = evaluateSpatialFast(s.lat, s.lng, pre);
      const exact = predictFromModel({
        latitude: s.lat,
        longitude: s.lng,
        commodity: s.commodity,
        pricetype: s.pricetype,
      });
      expect(fast).toBeCloseTo(exact, 4);
    }
  });

  it("maps price ranges accurately along the Green -> Yellow -> Red ramp", () => {
    expect(priceToRgb(20, 20, 100)).toEqual([22, 163, 74]);
    expect(priceToHex(20, 20, 100)).toBe("#16a34a");
    expect(priceToRgb(60, 20, 100)).toEqual([234, 179, 8]);
    expect(priceToHex(60, 20, 100)).toBe("#eab308");
    expect(priceToRgb(100, 20, 100)).toEqual([220, 38, 38]);
    expect(priceToHex(100, 20, 100)).toBe("#dc2626");
  });

  it("inverts Web Mercator Y coordinates accurately", () => {
    for (const lat of [4.2158, 12.8797, 21.321]) {
      expect(fromMercatorY(toMercatorY(lat))).toBeCloseTo(lat, 6);
    }
  });

  it("evaluates Matérn-3/2 kernel cleanly and matches evaluateCalibratedSpatial with predictUnifiedPrice", () => {
    expect(matern32Kernel(14.6, 120.98, 14.6, 120.98)).toBe(1);
    expect(matern32Kernel(14.6, 120.98, 14.0, 121.0)).toBeGreaterThan(
      matern32Kernel(14.6, 120.98, 10.31, 123.89)
    );

    const pre = precomputeSpatialLayer0("Maize (yellow)", "Retail");
    const samplePoints = [
      { latitude: 14.6, longitude: 120.98, price: 48.0, samples: 12 }, // Metro Manila
      { latitude: 13.93, longitude: 121.61, price: 69.38, samples: 40 }, // Quezon
      { latitude: 13.75, longitude: 121.05, price: 32.0, samples: 25 }, // Batangas
    ];

    const calibrated = buildCalibratedPoints(samplePoints, pre);
    expect(calibrated).toHaveLength(3);
    expect(calibrated.every((pt) => Number.isFinite(pt.alpha))).toBe(true);

    // Near Quezon, Matérn-3/2 Regression Kriging moves close to 69.38
    const nearQuezon = evaluateCalibratedSpatial(13.93, 121.61, pre, calibrated);
    expect(nearQuezon).toBeGreaterThan(64);
    expect(nearQuezon).toBeLessThan(72);

    // Near Batangas, Matérn-3/2 Regression Kriging tracks down toward 32
    const nearBatangas = evaluateCalibratedSpatial(13.75, 121.05, pre, calibrated);
    expect(nearBatangas).toBeGreaterThan(28);
    expect(nearBatangas).toBeLessThan(40);

    // Unified predictor matches evaluateCalibratedSpatial 100% and computes valid GP uncertainty
    const unified = predictUnifiedPrice({
      latitude: 13.93,
      longitude: 121.61,
      commodity: "Maize (yellow)",
      pricetype: "Retail",
      points: samplePoints,
    });
    expect(unified.predictedPrice).toBeCloseTo(nearQuezon, 5);
    expect(unified.mlpTrendPrice).toBeCloseTo(
      evaluateSpatialFast(13.93, 121.61, pre),
      5
    );
    expect(unified.krigingAdjustment).toBeCloseTo(
      unified.predictedPrice - unified.mlpTrendPrice,
      5
    );
    expect(unified.uncertaintyPhp).toBeGreaterThan(0);
    expect(unified.confidencePct).toBeGreaterThanOrEqual(55);
    expect(unified.confidencePct).toBeLessThanOrEqual(98);
    expect(unified.nearbyMarketCount).toBe(3);

    // When >= 2 points exist, shared domain anchors exactly to [min(points), max(points)]
    const domain = computeSharedPriceDomain(
      samplePoints,
      (lat, lng) => evaluateCalibratedSpatial(lat, lng, pre, calibrated)
    );
    expect(domain.minPrice).toBe(32);
    expect(domain.maxPrice).toBe(69.38);
    expect(domain.midPrice).toBeCloseTo(50.69, 4);

    const rendered = renderGpuPredictionHeatmap({
      commodity: "Maize (yellow)",
      pricetype: "Retail",
      points: samplePoints,
      width: 32,
      height: 40,
    });

    expect(rendered.dataUrl.startsWith("data:image/png;base64,")).toBe(true);
    expect(rendered.minPrice).toBe(32);
    expect(rendered.maxPrice).toBe(69.38);
    expect(["webgl2", "cpu-fallback"]).toContain(rendered.backend);
  });
});
