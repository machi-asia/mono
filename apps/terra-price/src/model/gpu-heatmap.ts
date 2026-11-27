import { PHILIPPINES_BOUNDS } from "../data/catalog";
import {
  computeSpatialBasis,
  encodeFeatures,
  getDefaultModel,
  relu,
  scaleFeatures,
  SPATIAL_FEATURE_COUNT,
  SPATIAL_FEATURE_NAMES,
  type TerraPriceModelData,
} from "./estimator";

export interface SpatialLayer0Precompute {
  wSpatial: Float32Array;
  wLat: Float32Array;
  wLng: Float32Array;
  bias0: Float32Array;
  hiddenSizes: [number, number, number];
  model: TerraPriceModelData;
}

export interface SpatialInputPoint {
  latitude: number;
  longitude: number;
  price: number;
  samples?: number;
}

export interface CalibratedDataPoint {
  latitude: number;
  longitude: number;
  price: number;
  residual: number;
  alpha: number;
  observations: number;
}

export interface UnifiedPredictionOutput {
  predictedPrice: number;
  mlpTrendPrice: number;
  krigingAdjustment: number;
  uncertaintyPhp: number;
  confidencePct: number;
  nearbyMarketCount: number;
}

export interface PriceDomain {
  minPrice: number;
  maxPrice: number;
  midPrice: number;
}

export interface GpuHeatmapRenderOptions {
  commodity: string;
  pricetype: string;
  model?: TerraPriceModelData;
  points?: ReadonlyArray<SpatialInputPoint>;
  width?: number;
  height?: number;
  bounds?: [[number, number], [number, number]];
}

export interface GpuHeatmapRenderResult {
  dataUrl: string;
  minPrice: number;
  maxPrice: number;
  midPrice: number;
  width: number;
  height: number;
  backend: "webgl2" | "cpu-fallback";
  durationMs: number;
}

const MAX_CALIBRATION_POINTS = 256;
export const KRIGING_LENGTH_SCALE_DEG = 0.85;
const COS_CENTER_LAT = Math.cos((12.8 * Math.PI) / 180);
const SQRT3 = Math.sqrt(3);

interface KrigingPosteriorState {
  choleskyL: Float64Array;
  n: number;
  sigmaR: number;
}

const KRIGING_STATE_MAP = new WeakMap<
  ReadonlyArray<CalibratedDataPoint>,
  KrigingPosteriorState
>();

const FALLBACK_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

function isJsdomEnvironment(): boolean {
  return (
    typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent || "")
  );
}

const COLOR_STOPS: ReadonlyArray<{ t: number; rgb: [number, number, number] }> = [
  { t: 0.0, rgb: [22, 163, 74] }, // Green (#16a34a)
  { t: 0.25, rgb: [132, 204, 22] }, // Lime (#84cc16)
  { t: 0.5, rgb: [234, 179, 8] }, // Yellow (#eab308)
  { t: 0.75, rgb: [249, 115, 22] }, // Orange (#f97316)
  { t: 1.0, rgb: [220, 38, 38] }, // Red (#dc2626)
];

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function priceToRgb(
  price: number,
  minPrice: number,
  maxPrice: number
): [number, number, number] {
  const span = Math.max(0.01, maxPrice - minPrice);
  const t = clamp01((price - minPrice) / span);

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const a = COLOR_STOPS[i];
    const b = COLOR_STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const localT = (t - a.t) / (b.t - a.t);
      return [
        Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * localT),
        Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * localT),
        Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * localT),
      ];
    }
  }
  return [...COLOR_STOPS[COLOR_STOPS.length - 1].rgb];
}

export function priceToHex(
  price: number,
  minPrice: number,
  maxPrice: number
): string {
  const [r, g, b] = priceToRgb(price, minPrice, maxPrice);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function toMercatorY(latDeg: number): number {
  const rad = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

export function fromMercatorY(mercY: number): number {
  return (2 * Math.atan(Math.exp(mercY)) - Math.PI / 2) * (180 / Math.PI);
}

/**
 * Evaluates the symmetric positive-definite Matérn-3/2 spatial covariance kernel in degrees
 * adjusted for the Philippines centroid latitude (~12.8°N).
 */
export function matern32Kernel(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  lengthScale = KRIGING_LENGTH_SCALE_DEG
): number {
  const dLat = lat1 - lat2;
  const dLng = (lng1 - lng2) * COS_CENTER_LAT;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const u = (SQRT3 * dist) / lengthScale;
  return (1 + u) * Math.exp(-u);
}

function forwardSolveLower(
  L: Float64Array,
  n: number,
  rhs: Float64Array
): Float64Array {
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let sum = rhs[i];
    const rowOff = i * n;
    for (let k = 0; k < i; k++) {
      sum -= L[rowOff + k] * y[k];
    }
    const diag = L[rowOff + i];
    y[i] = diag > 1e-12 ? sum / diag : 0;
  }
  return y;
}

function solveCholeskyLinearSystem(
  matrixA: Float64Array,
  rhs: Float64Array,
  n: number
): { solution: Float64Array; choleskyL: Float64Array } {
  const L = new Float64Array(n * n);
  let choleskyOk = true;

  for (let i = 0; i < n; i++) {
    const rowOff = i * n;
    for (let j = 0; j <= i; j++) {
      const colOff = j * n;
      let sum = matrixA[rowOff + j];
      for (let k = 0; k < j; k++) {
        sum -= L[rowOff + k] * L[colOff + k];
      }
      if (i === j) {
        if (sum <= 1e-9 || !Number.isFinite(sum)) {
          choleskyOk = false;
          break;
        }
        L[rowOff + j] = Math.sqrt(sum);
      } else {
        L[rowOff + j] = sum / L[colOff + j];
      }
    }
    if (!choleskyOk) break;
  }

  if (!choleskyOk) {
    // Diagonal fallback if covariance matrix is numerically ill-conditioned
    const fallbackAlpha = new Float64Array(n);
    L.fill(0);
    for (let i = 0; i < n; i++) {
      const diag = Math.max(1.04, matrixA[i * n + i]);
      L[i * n + i] = Math.sqrt(diag);
      fallbackAlpha[i] = rhs[i] / diag;
    }
    return { solution: fallbackAlpha, choleskyL: L };
  }

  const z = forwardSolveLower(L, n, rhs);
  const alpha = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = z[i];
    for (let k = i + 1; k < n; k++) {
      sum -= L[k * n + i] * alpha[k];
    }
    const diag = L[i * n + i];
    alpha[i] = diag > 1e-12 ? sum / diag : 0;
  }

  return { solution: alpha, choleskyL: L };
}

/**
 * Folds all non-spatial one-hot commodity & pricetype inputs (and spatial scaler means)
 * into Layer 0's bias vector so every pixel evaluates only the 14 spatial basis features.
 */
export function precomputeSpatialLayer0(
  commodity: string,
  pricetype: string,
  model: TerraPriceModelData = getDefaultModel()
): SpatialLayer0Precompute {
  const cols = model.featureColumns;
  const spatialIdxSet = new Set<number>();
  const spatialIndices = SPATIAL_FEATURE_NAMES.map((name) => {
    const idx = cols.indexOf(name);
    if (idx !== -1) spatialIdxSet.add(idx);
    return idx;
  });

  const encodedConst = encodeFeatures(
    { latitude: 0, longitude: 0, commodity, pricetype },
    cols
  );
  const scaledConst = scaleFeatures(encodedConst, model.scaler);

  const w0 = model.weights[0];
  const b0 = model.biases[0];
  const h0Size = model.layerSizes[1] ?? b0.length;

  const wSpatial = new Float32Array(SPATIAL_FEATURE_COUNT * h0Size);
  const bias0 = new Float32Array(h0Size);

  for (let j = 0; j < h0Size; j++) {
    let bAcc = b0[j] ?? 0;

    for (let s = 0; s < SPATIAL_FEATURE_COUNT; s++) {
      const colIdx = spatialIndices[s];
      if (colIdx === -1) continue;
      const wRaw = w0[colIdx]?.[j] ?? 0;
      const mean = model.scaler.mean[colIdx] ?? 0;
      const scale = model.scaler.scale[colIdx] || 1;
      wSpatial[s * h0Size + j] = wRaw / scale;
      bAcc -= (mean / scale) * wRaw;
    }

    for (let k = 0; k < cols.length; k++) {
      if (spatialIdxSet.has(k)) continue;
      bAcc += scaledConst[k] * (w0[k]?.[j] ?? 0);
    }
    bias0[j] = bAcc;
  }

  return {
    wSpatial,
    wLat: wSpatial.slice(0, h0Size),
    wLng: wSpatial.slice(h0Size, 2 * h0Size),
    bias0,
    hiddenSizes: [
      model.layerSizes[1] ?? 256,
      model.layerSizes[2] ?? 128,
      model.layerSizes[3] ?? 64,
    ],
    model,
  };
}

export function evaluateSpatialFast(
  lat: number,
  lng: number,
  pre: SpatialLayer0Precompute
): number {
  const [n0, n1, n2] = pre.hiddenSizes;
  const { wSpatial, bias0, model } = pre;
  const basis = computeSpatialBasis(lat, lng);

  const h0 = new Float32Array(n0);
  for (let j = 0; j < n0; j++) {
    let z = bias0[j];
    for (let s = 0; s < SPATIAL_FEATURE_COUNT; s++) {
      z += basis[s] * wSpatial[s * n0 + j];
    }
    h0[j] = relu(z);
  }

  const w1 = model.weights[1];
  const b1 = model.biases[1];
  const h1 = new Float32Array(n1);
  for (let j = 0; j < n1; j++) {
    let sum = b1[j] ?? 0;
    for (let i = 0; i < n0; i++) {
      sum += h0[i] * w1[i][j];
    }
    h1[j] = relu(sum);
  }

  const w2 = model.weights[2];
  const b2 = model.biases[2];
  const h2 = new Float32Array(n2);
  for (let j = 0; j < n2; j++) {
    let sum = b2[j] ?? 0;
    for (let i = 0; i < n1; i++) {
      sum += h1[i] * w2[i][j];
    }
    h2[j] = relu(sum);
  }

  const w3 = model.weights[3];
  const b3 = model.biases[3];
  let out = b3[0] ?? 0;
  for (let i = 0; i < n2; i++) {
    out += h2[i] * w3[i][0];
  }
  return Number.isFinite(out) ? Math.max(0, out) : 0;
}

export function buildCalibratedPoints(
  points: ReadonlyArray<SpatialInputPoint>,
  pre: SpatialLayer0Precompute
): CalibratedDataPoint[] {
  const valid = points.filter(
    (pt) =>
      Number.isFinite(pt.latitude) &&
      Number.isFinite(pt.longitude) &&
      Number.isFinite(pt.price)
  );
  const capped =
    valid.length > MAX_CALIBRATION_POINTS
      ? valid.slice(valid.length - MAX_CALIBRATION_POINTS)
      : valid;

  const n = capped.length;
  if (n === 0) return [];

  const residuals = new Float64Array(n);
  const observations = new Array<number>(n);
  let rSqSum = 0;

  for (let i = 0; i < n; i++) {
    const pt = capped[i];
    const mlpPrice = evaluateSpatialFast(pt.latitude, pt.longitude, pre);
    const r = pt.price - mlpPrice;
    residuals[i] = r;
    rSqSum += r * r;
    observations[i] = Math.max(1, pt.samples ?? 1);
  }

  const matrixA = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    const pti = capped[i];
    const nugget = 0.04 + 0.08 / Math.sqrt(observations[i]);
    matrixA[i * n + i] = 1 + nugget;
    for (let j = 0; j < i; j++) {
      const ptj = capped[j];
      const cov = matern32Kernel(
        pti.latitude,
        pti.longitude,
        ptj.latitude,
        ptj.longitude
      );
      matrixA[i * n + j] = cov;
      matrixA[j * n + i] = cov;
    }
  }

  const { solution: alphas, choleskyL } = solveCholeskyLinearSystem(
    matrixA,
    residuals,
    n
  );

  const sigmaR = Math.max(1.5, Math.sqrt(rSqSum / n));
  const result: CalibratedDataPoint[] = capped.map((pt, i) => ({
    latitude: pt.latitude,
    longitude: pt.longitude,
    price: pt.price,
    residual: residuals[i],
    alpha: alphas[i],
    observations: observations[i],
  }));

  KRIGING_STATE_MAP.set(result, { choleskyL, n, sigmaR });
  return result;
}

/**
 * Evaluates Matérn-3/2 Regression Kriging: 14-feature Spatial Fourier MLP trend
 * plus dual Kriging weights α_i · k(x, x_i) from market observations.
 */
export function evaluateCalibratedSpatial(
  lat: number,
  lng: number,
  pre: SpatialLayer0Precompute,
  calibratedPoints: ReadonlyArray<CalibratedDataPoint>
): number {
  const basePrice = evaluateSpatialFast(lat, lng, pre);
  if (calibratedPoints.length === 0) return basePrice;

  let kSum = 0;
  for (const pt of calibratedPoints) {
    const k = matern32Kernel(lat, lng, pt.latitude, pt.longitude);
    const weightAlpha = Number.isFinite(pt.alpha) ? pt.alpha : pt.residual;
    kSum += weightAlpha * k;
  }

  return Math.max(0.01, basePrice + kSum);
}

/**
 * Evaluates the unified Regression Kriging predictor along with Fourier MLP baseline,
 * Kriging spatial adjustment, and posterior Gaussian Process ±₱ uncertainty.
 */
export function predictUnifiedPrice(options: {
  latitude: number;
  longitude: number;
  commodity: string;
  pricetype: string;
  points?: ReadonlyArray<SpatialInputPoint>;
  model?: TerraPriceModelData;
}): UnifiedPredictionOutput {
  const model = options.model ?? getDefaultModel();
  const points = options.points ?? [];
  const pre = precomputeSpatialLayer0(
    options.commodity,
    options.pricetype,
    model
  );
  const calibratedPoints = buildCalibratedPoints(points, pre);
  const mlpTrendPrice = evaluateSpatialFast(
    options.latitude,
    options.longitude,
    pre
  );

  if (calibratedPoints.length === 0) {
    const fallbackUncertainty = Math.max(5.0, 0.08 * mlpTrendPrice);
    return {
      predictedPrice: Math.max(0.01, mlpTrendPrice),
      mlpTrendPrice,
      krigingAdjustment: 0,
      uncertaintyPhp: Math.round(fallbackUncertainty * 100) / 100,
      confidencePct: 55,
      nearbyMarketCount: 0,
    };
  }

  const predictedPrice = evaluateCalibratedSpatial(
    options.latitude,
    options.longitude,
    pre,
    calibratedPoints
  );
  const krigingAdjustment = predictedPrice - mlpTrendPrice;

  const gpState = KRIGING_STATE_MAP.get(calibratedPoints);
  const kVec = new Float64Array(calibratedPoints.length);
  for (let i = 0; i < calibratedPoints.length; i++) {
    kVec[i] = matern32Kernel(
      options.latitude,
      options.longitude,
      calibratedPoints[i].latitude,
      calibratedPoints[i].longitude
    );
  }

  let rho = 1.0;
  let sigmaR = Math.max(1.5, Math.abs(krigingAdjustment));
  if (gpState && gpState.n === calibratedPoints.length) {
    sigmaR = gpState.sigmaR;
    const v = forwardSolveLower(gpState.choleskyL, gpState.n, kVec);
    let vNormSq = 0;
    for (let i = 0; i < v.length; i++) {
      vNormSq += v[i] * v[i];
    }
    rho = Math.sqrt(Math.max(0.04, 1 - vNormSq));
  }

  const uncertaintyPhp = Math.round(sigmaR * rho * 100) / 100;
  const confidencePct = Math.min(
    98,
    Math.max(55, Math.round(100 * (1 - 0.45 * rho)))
  );

  return {
    predictedPrice,
    mlpTrendPrice,
    krigingAdjustment,
    uncertaintyPhp,
    confidencePct,
    nearbyMarketCount: calibratedPoints.length,
  };
}

export function computeSharedPriceDomain(
  points: ReadonlyArray<SpatialInputPoint>,
  fastEval: (lat: number, lng: number) => number,
  bounds: [[number, number], [number, number]] = PHILIPPINES_BOUNDS
): PriceDomain {
  const finitePoints = points.filter((pt) => Number.isFinite(pt.price));

  // Anchor directly to the observed dataset points' price range when >= 2 points exist
  // so both the plotted markers and calibrated GPU surface share the exact same color scale.
  if (finitePoints.length >= 2) {
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = Number.NEGATIVE_INFINITY;
    for (const pt of finitePoints) {
      if (pt.price < minPrice) minPrice = pt.price;
      if (pt.price > maxPrice) maxPrice = pt.price;
    }
    if (maxPrice - minPrice < 1) {
      maxPrice = minPrice + 1;
    }
    return {
      minPrice,
      maxPrice,
      midPrice: (minPrice + maxPrice) / 2,
    };
  }

  const [[minLat, minLng], [maxLat, maxLng]] = bounds;
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = Number.NEGATIVE_INFINITY;

  const gridSteps = 14;
  for (let r = 0; r <= gridSteps; r++) {
    const lat = minLat + ((maxLat - minLat) * r) / gridSteps;
    for (let c = 0; c <= gridSteps; c++) {
      const lng = minLng + ((maxLng - minLng) * c) / gridSteps;
      const p = fastEval(lat, lng);
      if (Number.isFinite(p)) {
        if (p < minPrice) minPrice = p;
        if (p > maxPrice) maxPrice = p;
      }
    }
  }

  for (const pt of finitePoints) {
    if (pt.price < minPrice) minPrice = pt.price;
    if (pt.price > maxPrice) maxPrice = pt.price;
  }

  if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) {
    minPrice = 0;
    maxPrice = 100;
  }

  if (maxPrice - minPrice < 1) {
    maxPrice = minPrice + 1;
  }

  return {
    minPrice,
    maxPrice,
    midPrice: (minPrice + maxPrice) / 2,
  };
}

const VERTEX_SHADER_SRC = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_weights;
uniform float u_mercMinY;
uniform float u_mercMaxY;
uniform float u_minLng;
uniform float u_maxLng;
uniform float u_minPrice;
uniform float u_maxPrice;
uniform int u_numPoints;
out vec4 fragColor;

vec3 priceRamp(float t) {
  vec3 c0 = vec3(22.0, 163.0, 74.0) / 255.0;
  vec3 c1 = vec3(132.0, 204.0, 22.0) / 255.0;
  vec3 c2 = vec3(234.0, 179.0, 8.0) / 255.0;
  vec3 c3 = vec3(249.0, 115.0, 22.0) / 255.0;
  vec3 c4 = vec3(220.0, 38.0, 38.0) / 255.0;
  if (t < 0.25) return mix(c0, c1, t / 0.25);
  if (t < 0.50) return mix(c1, c2, (t - 0.25) / 0.25);
  if (t < 0.75) return mix(c2, c3, (t - 0.50) / 0.25);
  return mix(c3, c4, (t - 0.75) / 0.25);
}

float evalLayer0Neuron(
  int j,
  float lat,
  float lng,
  vec4 sfA,
  vec4 sfB,
  vec4 sfC
) {
  vec4 r0 = texelFetch(u_weights, ivec2(j, 0), 0);
  vec4 r194 = texelFetch(u_weights, ivec2(j, 194), 0);
  vec4 r195 = texelFetch(u_weights, ivec2(j, 195), 0);
  vec4 r196 = texelFetch(u_weights, ivec2(j, 196), 0);
  float z = r0.b + lat * r0.r + lng * r0.g + dot(sfA, r194) + dot(sfB, r195) + dot(sfC, r196);
  return max(0.0, z);
}

void main() {
  float mercY = mix(u_mercMinY, u_mercMaxY, v_uv.y);
  float lat = (2.0 * atan(exp(mercY)) - 1.57079632679) * 57.2957795131;
  float lng = mix(u_minLng, u_maxLng, v_uv.x);

  // 14-feature Spatial Fourier & polynomial basis matching computeSpatialBasis()
  float phi = (lat - 12.7684) / 8.5526;
  float lam = (lng - 121.7375) / 4.8675;
  float piPhi = 3.14159265359 * phi;
  float piLam = 3.14159265359 * lam;
  vec4 sfA = vec4(phi * lam, phi * phi, lam * lam, sin(piPhi));
  vec4 sfB = vec4(cos(piPhi), sin(piLam), cos(piLam), sin(2.0 * piPhi));
  vec4 sfC = vec4(cos(2.0 * piPhi), sin(2.0 * piLam), cos(2.0 * piLam), sin(3.14159265359 * (phi + lam)));

  // Layer 0 (256 neurons packed as 64 vec4 chunks)
  vec4 h0[64];
  for (int g = 0; g < 64; g++) {
    int base = g * 4;
    h0[g] = vec4(
      evalLayer0Neuron(base, lat, lng, sfA, sfB, sfC),
      evalLayer0Neuron(base + 1, lat, lng, sfA, sfB, sfC),
      evalLayer0Neuron(base + 2, lat, lng, sfA, sfB, sfC),
      evalLayer0Neuron(base + 3, lat, lng, sfA, sfB, sfC)
    );
  }

  // Layer 1 (128 neurons packed as 32 vec4 chunks)
  vec4 h1[32];
  for (int g1 = 0; g1 < 32; g1++) {
    vec4 acc = vec4(0.0);
    for (int c = 0; c < 4; c++) {
      int j = g1 * 4 + c;
      float s = texelFetch(u_weights, ivec2(j, 0), 0).a;
      for (int g0 = 0; g0 < 64; g0++) {
        vec4 w = texelFetch(u_weights, ivec2(g0, 1 + j), 0);
        s += dot(h0[g0], w);
      }
      float act = max(0.0, s);
      if (c == 0) acc.x = act;
      else if (c == 1) acc.y = act;
      else if (c == 2) acc.z = act;
      else acc.w = act;
    }
    h1[g1] = acc;
  }

  // Layer 2 (64 neurons) + Layer 3 (1 output)
  float outPrice = texelFetch(u_weights, ivec2(32, 129), 0).b;
  for (int k = 0; k < 64; k++) {
    vec4 meta = texelFetch(u_weights, ivec2(32, 129 + k), 0);
    float s = meta.r;
    for (int g1 = 0; g1 < 32; g1++) {
      vec4 w2 = texelFetch(u_weights, ivec2(g1, 129 + k), 0);
      s += dot(h1[g1], w2);
    }
    outPrice += max(0.0, s) * meta.g;
  }

  outPrice = max(0.0, outPrice);

  // Matérn-3/2 Regression Kriging over Fourier MLP residuals
  if (u_numPoints > 0) {
    float cosLat = 0.975149;
    float kSum = 0.0;
    for (int i = 0; i < 256; i++) {
      if (i >= u_numPoints) break;
      vec4 pt = texelFetch(u_weights, ivec2(i, 193), 0);
      float dLat = lat - pt.r;
      float dLng = (lng - pt.g) * cosLat;
      float dist = sqrt(dLat * dLat + dLng * dLng);
      float u = 1.7320508 * dist / 0.85;
      float k = (1.0 + u) * exp(-u);
      kSum += pt.b * k;
    }
    outPrice = max(0.01, outPrice + kSum);
  }

  float norm = clamp((outPrice - u_minPrice) / max(0.01, u_maxPrice - u_minPrice), 0.0, 1.0);
  fragColor = vec4(priceRamp(norm), 1.0);
}
`;

function packWeightsTexture(
  pre: SpatialLayer0Precompute,
  calibratedPoints: ReadonlyArray<CalibratedDataPoint>
): Float32Array {
  const texWidth = 256;
  const texHeight = 198;
  const data = new Float32Array(texWidth * texHeight * 4);
  const { wSpatial, bias0, model } = pre;
  const w1 = model.weights[1];
  const b1 = model.biases[1];
  const w2 = model.weights[2];
  const b2 = model.biases[2];
  const w3 = model.weights[3];
  const b3 = model.biases[3];

  // Row 0: (wSpatial[0, x], wSpatial[1, x], bias0[x], B1[x])
  for (let x = 0; x < 256; x++) {
    const idx = x * 4;
    data[idx] = wSpatial[x] ?? 0;
    data[idx + 1] = wSpatial[256 + x] ?? 0;
    data[idx + 2] = bias0[x] ?? 0;
    data[idx + 3] = x < 128 ? b1[x] ?? 0 : 0;
  }

  // Rows 1..128: W1 grouped by 4 inputs along x = 0..63
  for (let j = 0; j < 128; j++) {
    const rowOffset = (1 + j) * texWidth * 4;
    for (let g0 = 0; g0 < 64; g0++) {
      const idx = rowOffset + g0 * 4;
      const base = g0 * 4;
      data[idx] = w1[base]?.[j] ?? 0;
      data[idx + 1] = w1[base + 1]?.[j] ?? 0;
      data[idx + 2] = w1[base + 2]?.[j] ?? 0;
      data[idx + 3] = w1[base + 3]?.[j] ?? 0;
    }
  }

  // Rows 129..192: W2 grouped by 4 inputs along x = 0..31, plus meta at x = 32
  for (let k = 0; k < 64; k++) {
    const rowOffset = (129 + k) * texWidth * 4;
    for (let g1 = 0; g1 < 32; g1++) {
      const idx = rowOffset + g1 * 4;
      const base = g1 * 4;
      data[idx] = w2[base]?.[k] ?? 0;
      data[idx + 1] = w2[base + 1]?.[k] ?? 0;
      data[idx + 2] = w2[base + 2]?.[k] ?? 0;
      data[idx + 3] = w2[base + 3]?.[k] ?? 0;
    }
    const metaIdx = rowOffset + 32 * 4;
    data[metaIdx] = b2[k] ?? 0;
    data[metaIdx + 1] = w3[k]?.[0] ?? 0;
    data[metaIdx + 2] = k === 0 ? b3[0] ?? 0 : 0;
    data[metaIdx + 3] = 0;
  }

  // Row 193: Kriging dual points (latitude, longitude, alpha, price)
  const calRowOffset = 193 * texWidth * 4;
  const count = Math.min(calibratedPoints.length, MAX_CALIBRATION_POINTS);
  for (let i = 0; i < count; i++) {
    const pt = calibratedPoints[i];
    const idx = calRowOffset + i * 4;
    data[idx] = pt.latitude;
    data[idx + 1] = pt.longitude;
    data[idx + 2] = pt.alpha;
    data[idx + 3] = pt.price;
  }

  // Rows 194..196: Remaining 12 Spatial Fourier basis weights in Layer 0
  for (let rowPack = 0; rowPack < 3; rowPack++) {
    const texRow = 194 + rowPack;
    const baseFeature = 2 + rowPack * 4;
    const rowOffset = texRow * texWidth * 4;
    for (let x = 0; x < 256; x++) {
      const idx = rowOffset + x * 4;
      data[idx] = wSpatial[baseFeature * 256 + x] ?? 0;
      data[idx + 1] = wSpatial[(baseFeature + 1) * 256 + x] ?? 0;
      data[idx + 2] = wSpatial[(baseFeature + 2) * 256 + x] ?? 0;
      data[idx + 3] = wSpatial[(baseFeature + 3) * 256 + x] ?? 0;
    }
  }

  return data;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function renderWithWebGL2(
  pre: SpatialLayer0Precompute,
  calibratedPoints: ReadonlyArray<CalibratedDataPoint>,
  domain: PriceDomain,
  width: number,
  height: number,
  bounds: [[number, number], [number, number]]
): string | null {
  if (typeof document === "undefined" || isJsdomEnvironment()) return null;

  const [n0, n1, n2] = pre.hiddenSizes;
  if (n0 !== 256 || n1 !== 128 || n2 !== 64) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true,
      antialias: false,
      alpha: true,
    });
  } catch {
    return null;
  }
  if (!gl) return null;

  try {
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vert || !frag) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }

    const texData = packWeightsTexture(pre, calibratedPoints);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      256,
      198,
      0,
      gl.RGBA,
      gl.FLOAT,
      texData
    );

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.viewport(0, 0, width, height);
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const [[minLat, minLng], [maxLat, maxLng]] = bounds;
    gl.uniform1i(gl.getUniformLocation(program, "u_weights"), 0);
    gl.uniform1f(gl.getUniformLocation(program, "u_mercMinY"), toMercatorY(minLat));
    gl.uniform1f(gl.getUniformLocation(program, "u_mercMaxY"), toMercatorY(maxLat));
    gl.uniform1f(gl.getUniformLocation(program, "u_minLng"), minLng);
    gl.uniform1f(gl.getUniformLocation(program, "u_maxLng"), maxLng);
    gl.uniform1f(gl.getUniformLocation(program, "u_minPrice"), domain.minPrice);
    gl.uniform1f(gl.getUniformLocation(program, "u_maxPrice"), domain.maxPrice);
    gl.uniform1i(
      gl.getUniformLocation(program, "u_numPoints"),
      Math.min(calibratedPoints.length, MAX_CALIBRATION_POINTS)
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.finish();

    const dataUrl = canvas.toDataURL("image/png");

    gl.deleteTexture(texture);
    gl.deleteBuffer(quadBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    return dataUrl;
  } catch {
    return null;
  }
}

function renderCpuFallback(
  pre: SpatialLayer0Precompute,
  calibratedPoints: ReadonlyArray<CalibratedDataPoint>,
  domain: PriceDomain,
  width: number,
  height: number,
  bounds: [[number, number], [number, number]]
): string {
  const [[minLat, minLng], [maxLat, maxLng]] = bounds;
  const mercMinY = toMercatorY(minLat);
  const mercMaxY = toMercatorY(maxLat);

  if (typeof document === "undefined" || isJsdomEnvironment()) {
    evaluateCalibratedSpatial(
      (minLat + maxLat) / 2,
      (minLng + maxLng) / 2,
      pre,
      calibratedPoints
    );
    return FALLBACK_PNG_DATA_URL;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return FALLBACK_PNG_DATA_URL;
  }

  const imgData = ctx.createImageData(width, height);
  const buf = imgData.data;

  for (let y = 0; y < height; y++) {
    const v = 1 - (y + 0.5) / height;
    const mercY = mercMinY + (mercMaxY - mercMinY) * v;
    const lat = fromMercatorY(mercY);
    for (let x = 0; x < width; x++) {
      const u = (x + 0.5) / width;
      const lng = minLng + (maxLng - minLng) * u;
      const price = evaluateCalibratedSpatial(lat, lng, pre, calibratedPoints);
      const [r, g, b] = priceToRgb(price, domain.minPrice, domain.maxPrice);
      const idx = (y * width + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

export function renderGpuPredictionHeatmap(
  options: GpuHeatmapRenderOptions
): GpuHeatmapRenderResult {
  const start =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const model = options.model ?? getDefaultModel();
  const bounds = options.bounds ?? PHILIPPINES_BOUNDS;
  const points = options.points ?? [];

  const pre = precomputeSpatialLayer0(
    options.commodity,
    options.pricetype,
    model
  );
  const calibratedPoints = buildCalibratedPoints(points, pre);
  const domain = computeSharedPriceDomain(
    points,
    (lat, lng) => evaluateCalibratedSpatial(lat, lng, pre, calibratedPoints),
    bounds
  );

  const gpuWidth = options.width ?? 320;
  const gpuHeight = options.height ?? 420;

  const gpuUrl = renderWithWebGL2(
    pre,
    calibratedPoints,
    domain,
    gpuWidth,
    gpuHeight,
    bounds
  );
  if (gpuUrl) {
    const end =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    return {
      dataUrl: gpuUrl,
      minPrice: domain.minPrice,
      maxPrice: domain.maxPrice,
      midPrice: domain.midPrice,
      width: gpuWidth,
      height: gpuHeight,
      backend: "webgl2",
      durationMs: Math.max(0, Math.round(end - start)),
    };
  }

  // Compact resolution when CPU fallback runs in environments without WebGL2
  const cpuWidth = Math.min(gpuWidth, 48);
  const cpuHeight = Math.min(gpuHeight, 64);
  const fallbackUrl = renderCpuFallback(
    pre,
    calibratedPoints,
    domain,
    cpuWidth,
    cpuHeight,
    bounds
  );
  const end =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  return {
    dataUrl: fallbackUrl,
    minPrice: domain.minPrice,
    maxPrice: domain.maxPrice,
    midPrice: domain.midPrice,
    width: cpuWidth,
    height: cpuHeight,
    backend: "cpu-fallback",
    durationMs: Math.max(0, Math.round(end - start)),
  };
}
