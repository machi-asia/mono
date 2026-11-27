import pretrainedJson from "./pretrained-weights.json";
import type { DatasetEntry } from "../data/catalog";

export interface ModelScaler {
  mean: number[];
  scale: number[];
}

export interface TerraPriceModelData {
  layerSizes: number[];
  learningRate: number;
  featureColumns: string[];
  scaler: ModelScaler;
  weights: number[][][];
  biases: number[][];
}

export interface PredictionInput {
  latitude: number;
  longitude: number;
  commodity: string;
  pricetype: string;
}

export const SPATIAL_FEATURE_NAMES = [
  "latitude",
  "longitude",
  "spatial_lat_lng",
  "spatial_lat_sq",
  "spatial_lng_sq",
  "fourier_sin_lat_1",
  "fourier_cos_lat_1",
  "fourier_sin_lng_1",
  "fourier_cos_lng_1",
  "fourier_sin_lat_2",
  "fourier_cos_lat_2",
  "fourier_sin_lng_2",
  "fourier_cos_lng_2",
  "fourier_diag_1",
] as const;

export const SPATIAL_FEATURE_COUNT = SPATIAL_FEATURE_NAMES.length;

export interface PredictionResult {
  predictedPrice: number;
  mlpTrendPrice: number;
  krigingAdjustment: number;
  uncertaintyPhp: number;
  confidencePct: number;
  nearbyMarketCount: number;
  latitude: number;
  longitude: number;
  commodity: string;
  pricetype: string;
  locationLabel: string;
}

/**
 * Computes the 14 normalized spatial coordinate, quadratic interaction, and multi-frequency
 * Fourier basis features for a location inside the Philippines.
 */
export function computeSpatialBasis(
  latitude: number,
  longitude: number
): number[] {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const phi = (lat - 12.7684) / 8.5526;
  const lam = (lng - 121.7375) / 4.8675;
  const piPhi = Math.PI * phi;
  const piLam = Math.PI * lam;

  return [
    lat,
    lng,
    phi * lam,
    phi * phi,
    lam * lam,
    Math.sin(piPhi),
    Math.cos(piPhi),
    Math.sin(piLam),
    Math.cos(piLam),
    Math.sin(2 * piPhi),
    Math.cos(2 * piPhi),
    Math.sin(2 * piLam),
    Math.cos(2 * piLam),
    Math.sin(Math.PI * (phi + lam)),
  ];
}

export interface TrainingLogEntry {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  message: string;
  type: "info" | "success" | "error";
}

export interface TrainingSummary {
  model: TerraPriceModelData;
  logs: TrainingLogEntry[];
  finalTrainLoss: number;
  finalValLoss: number;
  epochsCompleted: number;
}

export function getDefaultModel(): TerraPriceModelData {
  const raw = pretrainedJson as TerraPriceModelData;
  return cloneModel(raw);
}

export function cloneModel(model: TerraPriceModelData): TerraPriceModelData {
  return {
    layerSizes: [...model.layerSizes],
    learningRate: model.learningRate,
    featureColumns: [...model.featureColumns],
    scaler: {
      mean: [...model.scaler.mean],
      scale: [...model.scaler.scale],
    },
    weights: model.weights.map((layer) => layer.map((row) => [...row])),
    biases: model.biases.map((bias) => [...bias]),
  };
}

export function toTitleCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function relu(x: number): number {
  return x > 0 ? x : 0;
}

export function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0;
}

export function encodeFeatures(
  input: PredictionInput,
  featureColumns: string[]
): number[] {
  const vec = new Array<number>(featureColumns.length).fill(0);
  const basis = computeSpatialBasis(input.latitude, input.longitude);

  for (let i = 0; i < SPATIAL_FEATURE_NAMES.length; i++) {
    const idx = featureColumns.indexOf(SPATIAL_FEATURE_NAMES[i]);
    if (idx !== -1) {
      vec[idx] = basis[i];
    }
  }

  const commodityCol = `commodity_${input.commodity}`;
  const comIdx = featureColumns.indexOf(commodityCol);
  if (comIdx !== -1) vec[comIdx] = 1;

  const pricetypeCol = `pricetype_${toTitleCase(input.pricetype)}`;
  const ptIdx = featureColumns.indexOf(pricetypeCol);
  if (ptIdx !== -1) vec[ptIdx] = 1;

  return vec;
}

export function scaleFeatures(
  rawFeatures: number[],
  scaler: ModelScaler
): number[] {
  return rawFeatures.map((value, i) => {
    const mean = scaler.mean[i] ?? 0;
    const scale = scaler.scale[i] ?? 1;
    return scale === 0 ? value - mean : (value - mean) / scale;
  });
}

function matMulAddBias(
  input: number[][],
  weights: number[][],
  bias: number[]
): number[][] {
  const rows = input.length;
  const cols = weights[0]?.length ?? 0;
  const inner = weights.length;
  const output: number[][] = new Array(rows);

  for (let r = 0; r < rows; r++) {
    const row = new Array<number>(cols);
    const inRow = input[r];
    for (let c = 0; c < cols; c++) {
      let sum = bias[c] ?? 0;
      for (let k = 0; k < inner; k++) {
        sum += inRow[k] * weights[k][c];
      }
      row[c] = sum;
    }
    output[r] = row;
  }

  return output;
}

export function forwardFeed(
  X: number[][],
  model: TerraPriceModelData
): { outs: number[][][]; rawOuts: number[][][] } {
  const outs: number[][][] = [X];
  const rawOuts: number[][][] = [];
  const lastLayer = model.weights.length - 1;

  for (let i = 0; i < lastLayer; i++) {
    const raw = matMulAddBias(outs[i], model.weights[i], model.biases[i]);
    const activated = raw.map((row) => row.map(relu));
    rawOuts.push(raw);
    outs.push(activated);
  }

  const rawFinal = matMulAddBias(
    outs[lastLayer],
    model.weights[lastLayer],
    model.biases[lastLayer]
  );
  rawOuts.push(rawFinal);
  outs.push(rawFinal);

  return { outs, rawOuts };
}

function clip(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function meanSquaredError(predictions: number[][], targets: number[]): number {
  if (targets.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < targets.length; i++) {
    const diff = (predictions[i]?.[0] ?? 0) - targets[i];
    total += diff * diff;
  }
  return total / targets.length;
}

interface AdamOptimizerState {
  t: number;
  mW: number[][][];
  vW: number[][][];
  mB: number[][];
  vB: number[][];
}

function createAdamState(model: TerraPriceModelData): AdamOptimizerState {
  return {
    t: 0,
    mW: model.weights.map((layer) =>
      layer.map((row) => new Array<number>(row.length).fill(0))
    ),
    vW: model.weights.map((layer) =>
      layer.map((row) => new Array<number>(row.length).fill(0))
    ),
    mB: model.biases.map((b) => new Array<number>(b.length).fill(0)),
    vB: model.biases.map((b) => new Array<number>(b.length).fill(0)),
  };
}

export function backwardPropagation(
  outs: number[][][],
  rawOuts: number[][][],
  yTrain: number[],
  model: TerraPriceModelData,
  adam?: AdamOptimizerState
): void {
  const m = yTrain.length;
  if (m === 0) return;

  const numWeightLayers = model.weights.length;
  const wAdj: number[][][] = new Array(numWeightLayers);
  const bAdj: number[][] = new Array(numWeightLayers);

  // Output layer error (outs[last] - yTrain)
  let error: number[][] = outs[outs.length - 1].map((row, idx) => [
    row[0] - yTrain[idx],
  ]);

  const computeGradients = (prevOut: number[][], err: number[][]) => {
    const inFeatures = prevOut[0]?.length ?? 0;
    const outFeatures = err[0]?.length ?? 0;
    const wGrad: number[][] = Array.from({ length: inFeatures }, () =>
      new Array<number>(outFeatures).fill(0)
    );
    const bGrad = new Array<number>(outFeatures).fill(0);

    for (let r = 0; r < m; r++) {
      const prevRow = prevOut[r];
      const errRow = err[r];
      for (let c = 0; c < outFeatures; c++) {
        const eVal = errRow[c];
        bGrad[c] += eVal / m;
        for (let k = 0; k < inFeatures; k++) {
          wGrad[k][c] += (prevRow[k] * eVal) / m;
        }
      }
    }

    for (let k = 0; k < inFeatures; k++) {
      for (let c = 0; c < outFeatures; c++) {
        wGrad[k][c] = clip(wGrad[k][c], -0.5, 0.5);
      }
    }
    for (let c = 0; c < outFeatures; c++) {
      bGrad[c] = clip(bGrad[c], -0.5, 0.5);
    }

    return { wGrad, bGrad };
  };

  const lastGrads = computeGradients(outs[outs.length - 2], error);
  wAdj[numWeightLayers - 1] = lastGrads.wGrad;
  bAdj[numWeightLayers - 1] = lastGrads.bGrad;

  for (let i = model.layerSizes.length - 2; i >= 1; i--) {
    const weightMat = model.weights[i];
    const hiddenDim = weightMat.length;
    const nextDim = weightMat[0]?.length ?? 0;
    const rawLayer = rawOuts[i - 1];

    const nextError: number[][] = new Array(m);
    for (let r = 0; r < m; r++) {
      const eRow = error[r];
      const rawRow = rawLayer[r];
      const outRow = new Array<number>(hiddenDim);
      for (let h = 0; h < hiddenDim; h++) {
        let sum = 0;
        const wRow = weightMat[h];
        for (let c = 0; c < nextDim; c++) {
          sum += eRow[c] * wRow[c];
        }
        outRow[h] = sum * reluDerivative(rawRow[h]);
      }
      nextError[r] = outRow;
    }

    error = nextError;
    const grads = computeGradients(outs[i - 1], error);
    wAdj[i - 1] = grads.wGrad;
    bAdj[i - 1] = grads.bGrad;
  }

  if (adam) {
    const beta1 = 0.9;
    const beta2 = 0.999;
    const eps = 1e-8;
    adam.t += 1;
    const biasCorr1 = 1 - Math.pow(beta1, adam.t);
    const biasCorr2 = 1 - Math.pow(beta2, adam.t);

    for (let l = 0; l < numWeightLayers; l++) {
      const wMat = model.weights[l];
      const wGrad = wAdj[l];
      const mwMat = adam.mW[l];
      const vwMat = adam.vW[l];
      for (let r = 0; r < wMat.length; r++) {
        for (let c = 0; c < wMat[r].length; c++) {
          const g = wGrad[r][c];
          mwMat[r][c] = beta1 * mwMat[r][c] + (1 - beta1) * g;
          vwMat[r][c] = beta2 * vwMat[r][c] + (1 - beta2) * g * g;
          const mHat = mwMat[r][c] / biasCorr1;
          const vHat = vwMat[r][c] / biasCorr2;
          wMat[r][c] -= (model.learningRate * mHat) / (Math.sqrt(vHat) + eps);
        }
      }

      const bVec = model.biases[l];
      const bGrad = bAdj[l];
      const mbVec = adam.mB[l];
      const vbVec = adam.vB[l];
      for (let c = 0; c < bVec.length; c++) {
        const g = bGrad[c];
        mbVec[c] = beta1 * mbVec[c] + (1 - beta1) * g;
        vbVec[c] = beta2 * vbVec[c] + (1 - beta2) * g * g;
        const mHat = mbVec[c] / biasCorr1;
        const vHat = vbVec[c] / biasCorr2;
        bVec[c] -= (model.learningRate * mHat) / (Math.sqrt(vHat) + eps);
      }
    }
    return;
  }

  for (let l = 0; l < numWeightLayers; l++) {
    const wMat = model.weights[l];
    const wGrad = wAdj[l];
    for (let r = 0; r < wMat.length; r++) {
      for (let c = 0; c < wMat[r].length; c++) {
        wMat[r][c] -= model.learningRate * wGrad[r][c];
      }
    }
    const bVec = model.biases[l];
    const bGrad = bAdj[l];
    for (let c = 0; c < bVec.length; c++) {
      bVec[c] -= model.learningRate * bGrad[c];
    }
  }
}

export function predictFromModel(
  input: PredictionInput,
  model: TerraPriceModelData = getDefaultModel()
): number {
  if (Number.isNaN(Number(input.latitude)) || Number.isNaN(Number(input.longitude))) {
    throw new Error("Invalid latitude or longitude");
  }

  const encoded = encodeFeatures(input, model.featureColumns);
  const scaled = scaleFeatures(encoded, model.scaler);
  const { outs } = forwardFeed([scaled], model);
  const rawPrice = outs[outs.length - 1][0]?.[0] ?? 0;
  return Number.isFinite(rawPrice) ? Math.max(0, rawPrice) : 0;
}

export function retrainModel(
  entries: DatasetEntry[],
  baseModel: TerraPriceModelData = getDefaultModel(),
  epochs = 30,
  patience = 8,
  tol = 1
): TrainingSummary {
  const model = cloneModel(baseModel);

  const validEntries = entries.filter(
    (e) =>
      Number.isFinite(Number(e.latitude)) &&
      Number.isFinite(Number(e.longitude)) &&
      Number.isFinite(Number(e.price))
  );

  if (validEntries.length === 0) {
    return {
      model,
      logs: [
        {
          epoch: 0,
          trainLoss: 0,
          valLoss: 0,
          message: "No valid dataset rows available for training.",
          type: "error",
        },
      ],
      finalTrainLoss: 0,
      finalValLoss: 0,
      epochsCompleted: 0,
    };
  }

  const XAll = validEntries.map((entry) =>
    scaleFeatures(
      encodeFeatures(
        {
          latitude: Number(entry.latitude),
          longitude: Number(entry.longitude),
          commodity: entry.commodity,
          pricetype: entry.pricetype,
        },
        model.featureColumns
      ),
      model.scaler
    )
  );
  const yAll = validEntries.map((entry) => Number(entry.price));

  // Deterministic 80/20 train/validation split
  const XTrain: number[][] = [];
  const yTrain: number[] = [];
  const XVal: number[][] = [];
  const yVal: number[] = [];

  for (let i = 0; i < validEntries.length; i++) {
    if (validEntries.length >= 5 && i % 5 === 4) {
      XVal.push(XAll[i]);
      yVal.push(yAll[i]);
    } else {
      XTrain.push(XAll[i]);
      yTrain.push(yAll[i]);
    }
  }

  if (XVal.length === 0) {
    XVal.push(...XTrain);
    yVal.push(...yTrain);
  }

  let bestValLoss = Number.POSITIVE_INFINITY;
  let patienceCounter = 0;
  let bestWeights: number[][][] | null = null;
  let bestBiases: number[][] | null = null;
  let finalTrainLoss = 0;
  let finalValLoss = 0;
  let epochsCompleted = 0;
  const logs: TrainingLogEntry[] = [];
  const logInterval = Math.max(1, Math.floor(epochs / 6));
  const adamState = createAdamState(model);

  for (let epoch = 0; epoch < epochs; epoch++) {
    const { outs, rawOuts } = forwardFeed(XTrain, model);
    backwardPropagation(outs, rawOuts, yTrain, model, adamState);
    epochsCompleted = epoch + 1;

    if (epoch % logInterval === 0 || epoch === epochs - 1) {
      const trainLoss = meanSquaredError(outs[outs.length - 1], yTrain);
      const valResult = forwardFeed(XVal, model);
      const valLoss = meanSquaredError(
        valResult.outs[valResult.outs.length - 1],
        yVal
      );

      finalTrainLoss = trainLoss;
      finalValLoss = valLoss;

      logs.push({
        epoch,
        trainLoss,
        valLoss,
        message: `Epoch ${String(epoch).padStart(3, " ")} | Train Loss: ${trainLoss.toFixed(4)} | Val Loss: ${valLoss.toFixed(4)}`,
        type: "info",
      });

      if (valLoss < bestValLoss + tol) {
        bestValLoss = valLoss;
        patienceCounter = 0;
        bestWeights = model.weights.map((layer) => layer.map((row) => [...row]));
        bestBiases = model.biases.map((b) => [...b]);
      } else {
        patienceCounter += 1;
      }

      if (patienceCounter >= patience) {
        logs.push({
          epoch,
          trainLoss,
          valLoss,
          message: `Early stopping at epoch ${epoch} (patience: ${patience})`,
          type: "success",
        });
        if (bestWeights && bestBiases) {
          model.weights = bestWeights;
          model.biases = bestBiases;
        }
        break;
      }
    }
  }

  return {
    model,
    logs,
    finalTrainLoss,
    finalValLoss,
    epochsCompleted,
  };
}
