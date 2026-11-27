import { describe, it, expect } from "vitest";
import {
  computeSpatialBasis,
  encodeFeatures,
  getDefaultModel,
  predictFromModel,
  retrainModel,
  scaleFeatures,
  SPATIAL_FEATURE_COUNT,
} from "./estimator";
import { SEED_DATASETS } from "../data/catalog";

describe("TerraPrice TypeScript Spatial Fourier MLP Estimator", () => {
  it("loads the pretrained 89-feature Spatial Fourier MLP (89 -> 256 -> 128 -> 64 -> 1)", () => {
    const model = getDefaultModel();
    expect(model.layerSizes).toEqual([89, 256, 128, 64, 1]);
    expect(model.featureColumns).toHaveLength(89);
    expect(model.weights).toHaveLength(4);
    expect(model.biases).toHaveLength(4);

    const basis = computeSpatialBasis(14.6, 120.98);
    expect(basis).toHaveLength(SPATIAL_FEATURE_COUNT);
    expect(basis.every((v) => Number.isFinite(v))).toBe(true);
  });

  it("predicts modern PHP regional market levels rather than 2000s historical averages", () => {
    const maizeQuezon = predictFromModel({
      latitude: 13.93,
      longitude: 121.61,
      commodity: "Maize (yellow)",
      pricetype: "Retail",
    });
    expect(maizeQuezon).toBeGreaterThan(50);
    expect(maizeQuezon).toBeLessThan(85);

    const riceMetroManila = predictFromModel({
      latitude: 14.6,
      longitude: 120.98,
      commodity: "Rice (regular, milled)",
      pricetype: "Retail",
    });
    expect(riceMetroManila).toBeGreaterThan(38);
    expect(riceMetroManila).toBeLessThan(65);

    const porkCebu = predictFromModel({
      latitude: 10.31,
      longitude: 123.89,
      commodity: "Meat (pork)",
      pricetype: "Retail",
    });
    expect(porkCebu).toBeGreaterThan(250);
    expect(porkCebu).toBeLessThan(420);
  });

  it("encodes and scales lowercase pricetype identically to Title Case", () => {
    const model = getDefaultModel();
    const lower = encodeFeatures(
      {
        latitude: 14.6,
        longitude: 120.98,
        commodity: "Rice (regular, milled)",
        pricetype: "retail",
      },
      model.featureColumns
    );
    const title = encodeFeatures(
      {
        latitude: 14.6,
        longitude: 120.98,
        commodity: "Rice (regular, milled)",
        pricetype: "Retail",
      },
      model.featureColumns
    );
    expect(lower).toEqual(title);
    expect(scaleFeatures(lower, model.scaler)).toHaveLength(89);
  });

  it("retrains the Spatial Fourier MLP with Adam backpropagation and logs epoch metrics", () => {
    const result = retrainModel(
      SEED_DATASETS.slice(0, 25),
      getDefaultModel(),
      18,
      10,
      1
    );
    expect(result.epochsCompleted).toBeGreaterThan(0);
    expect(result.logs.length).toBeGreaterThan(0);
    expect(Number.isFinite(result.finalTrainLoss)).toBe(true);
    expect(Number.isFinite(result.finalValLoss)).toBe(true);

    const nextPrediction = predictFromModel(
      {
        latitude: 14.6,
        longitude: 120.98,
        commodity: "Rice (regular, milled)",
        pricetype: "Retail",
      },
      result.model
    );
    expect(Number.isFinite(nextPrediction)).toBe(true);
    expect(nextPrediction).toBeGreaterThanOrEqual(0);
  });
});
