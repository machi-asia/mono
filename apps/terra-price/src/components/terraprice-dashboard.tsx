"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { SignInModal, useAuth } from "@mono/auth";
import { Button, Card } from "@mono/components";
import { RefreshCw } from "lucide-react";
import {
  CATEGORIES,
  COMMODITIES_BY_CATEGORY,
  PHILIPPINES_MARKET_PRESETS,
  SEED_DATASETS,
  type DatasetEntry,
} from "../data/catalog";
import {
  addDatasetEntry,
  fetchDatasetsPaginated,
  fetchLatestDatasets,
  getCategories,
  getCommoditiesByCategory,
  getCommodityMapPoints,
  isWithinPhilippinesBounds,
  type PaginationMeta,
} from "../lib/dataset-service";
import {
  getDefaultModel,
  retrainModel,
  type PredictionResult,
  type TerraPriceModelData,
  type TrainingLogEntry,
} from "../model/estimator";
import { predictUnifiedPrice } from "../model/gpu-heatmap";
import { PhilippinesMap } from "./philippines-map";

type DashboardTab =
  | "predict"
  | "add-dataset"
  | "all-datasets"
  | "latest-datasets"
  | "model-training";

const PAGE_LIMIT = 50;

function generatePageTokens(
  currentPage: number,
  totalPages: number
): Array<number | "..."> {
  const tokens: Array<number | "..."> = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  if (start > 1) {
    tokens.push(1);
    if (start > 2) tokens.push("...");
  }
  for (let i = start; i <= end; i++) {
    tokens.push(i);
  }
  if (end < totalPages) {
    if (end < totalPages - 1) tokens.push("...");
    tokens.push(totalPages);
  }
  return tokens;
}

export function TerraPriceDashboard() {
  const { user, role, isGuest, signOut } = useAuth();
  const isAdmin = role === "admin";
  const isSignedInMember = Boolean(user && !isGuest);
  const displayName =
    (user?.user_metadata as { username?: string; name?: string } | undefined)
      ?.username ||
    (user?.user_metadata as { username?: string; name?: string } | undefined)
      ?.name ||
    user?.email?.split("@")[0] ||
    "Guest";

  const [activeTab, setActiveTab] = useState<DashboardTab>("predict");
  const [signInOpen, setSignInOpen] = useState(false);

  // Neural Network State
  const [activeModel, setActiveModel] = useState<TerraPriceModelData>(() =>
    getDefaultModel()
  );
  const [modelStatus, setModelStatus] = useState<"Ready" | "Training" | "Updated">(
    "Ready"
  );
  const [trainingStatusText, setTrainingStatusText] = useState<string>("Ready");
  const [trainingLogs, setTrainingLogs] = useState<TrainingLogEntry[]>([]);

  // Local dataset additions
  const [localExtras, setLocalExtras] = useState<DatasetEntry[]>([]);

  // Price Prediction Form State
  const defaultPreset = PHILIPPINES_MARKET_PRESETS[0];
  const [predictLat, setPredictLat] = useState<number | null>(
    defaultPreset?.latitude ?? 14.6
  );
  const [predictLng, setPredictLng] = useState<number | null>(
    defaultPreset?.longitude ?? 120.98
  );
  const [predictLocationLabel, setPredictLocationLabel] = useState<string>(
    defaultPreset?.name ?? "Metro Manila"
  );
  const [predictCategory, setPredictCategory] = useState<string>(
    CATEGORIES[0] ?? "cereals and tubers"
  );
  const [predictCommodity, setPredictCommodity] = useState<string>(
    COMMODITIES_BY_CATEGORY[CATEGORIES[0] ?? "cereals and tubers"]?.[0] ??
      "Rice (regular, milled)"
  );
  const [predictPricetype, setPredictPricetype] = useState<string>("Retail");

  // Add Dataset Form State
  const [datasetLat, setDatasetLat] = useState<number | null>(
    defaultPreset?.latitude ?? 14.6
  );
  const [datasetLng, setDatasetLng] = useState<number | null>(
    defaultPreset?.longitude ?? 120.98
  );
  const [datasetCategory, setDatasetCategory] = useState<string>(
    CATEGORIES[0] ?? "cereals and tubers"
  );
  const [datasetCommodity, setDatasetCommodity] = useState<string>(
    COMMODITIES_BY_CATEGORY[CATEGORIES[0] ?? "cereals and tubers"]?.[0] ??
      "Rice (regular, milled)"
  );
  const [datasetPricetype, setDatasetPricetype] = useState<string>("Retail");
  const [datasetPriceValue, setDatasetPriceValue] = useState<string>("");
  const [datasetSubmitting, setDatasetSubmitting] = useState(false);
  const [datasetFeedback, setDatasetFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Admin Dataset Tables State
  const [allDatasets, setAllDatasets] = useState<DatasetEntry[]>(SEED_DATASETS);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    total_pages: Math.max(1, Math.ceil(SEED_DATASETS.length / PAGE_LIMIT)),
    total_count: SEED_DATASETS.length,
    has_next: SEED_DATASETS.length > PAGE_LIMIT,
    has_prev: false,
    limit: PAGE_LIMIT,
  });
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [latestDatasets, setLatestDatasets] = useState<DatasetEntry[]>(
    SEED_DATASETS.slice(0, 5)
  );
  const [loadingLatest, setLoadingLatest] = useState(false);

  const categories = useMemo(() => getCategories(), []);
  const predictCommodities = useMemo(
    () => getCommoditiesByCategory(predictCategory),
    [predictCategory]
  );
  const datasetCommodities = useMemo(
    () => getCommoditiesByCategory(datasetCategory),
    [datasetCategory]
  );

  const loadAllDatasets = useCallback(
    async (page = 1) => {
      setLoadingDatasets(true);
      try {
        const res = await fetchDatasetsPaginated(page, PAGE_LIMIT, localExtras);
        setAllDatasets(res.datasets);
        setPagination(res.pagination);
      } finally {
        setLoadingDatasets(false);
      }
    },
    [localExtras]
  );

  const loadLatestDatasets = useCallback(async () => {
    setLoadingLatest(true);
    try {
      const res = await fetchLatestDatasets(5, localExtras);
      setLatestDatasets(res.datasets);
    } finally {
      setLoadingLatest(false);
    }
  }, [localExtras]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    const refreshInitial = async () => {
      const [pageRes, latestRes] = await Promise.all([
        fetchDatasetsPaginated(1, PAGE_LIMIT, localExtras),
        fetchLatestDatasets(5, localExtras),
      ]);
      if (cancelled) return;
      setAllDatasets(pageRes.datasets);
      setPagination(pageRes.pagination);
      setLatestDatasets(latestRes.datasets);
    };

    void refreshInitial();

    const interval = setInterval(() => {
      void loadLatestDatasets();
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAdmin, localExtras, loadLatestDatasets]);

  const predictionResult = useMemo<PredictionResult | null>(() => {
    if (
      predictLat === null ||
      predictLng === null ||
      !isWithinPhilippinesBounds(predictLat, predictLng) ||
      !predictCommodity
    ) {
      return null;
    }

    const commodityPoints = getCommodityMapPoints(
      predictCommodity,
      predictPricetype,
      localExtras
    );

    const unified = predictUnifiedPrice({
      latitude: predictLat,
      longitude: predictLng,
      commodity: predictCommodity,
      pricetype: predictPricetype,
      points: commodityPoints,
      model: activeModel,
    });

    return {
      predictedPrice: unified.predictedPrice,
      mlpTrendPrice: unified.mlpTrendPrice,
      krigingAdjustment: unified.krigingAdjustment,
      uncertaintyPhp: unified.uncertaintyPhp,
      confidencePct: unified.confidencePct,
      nearbyMarketCount: unified.nearbyMarketCount,
      latitude: predictLat,
      longitude: predictLng,
      commodity: predictCommodity,
      pricetype: predictPricetype,
      locationLabel: predictLocationLabel,
    };
  }, [
    predictLat,
    predictLng,
    predictCommodity,
    predictPricetype,
    predictLocationLabel,
    localExtras,
    activeModel,
  ]);

  async function handleDatasetSubmit(e: FormEvent) {
    e.preventDefault();
    setDatasetFeedback(null);

    if (
      datasetLat === null ||
      datasetLng === null ||
      !isWithinPhilippinesBounds(datasetLat, datasetLng)
    ) {
      setDatasetFeedback({
        type: "error",
        message: "Please select a location on the map first.",
      });
      return;
    }

    const parsedPrice = Number.parseFloat(datasetPriceValue);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setDatasetFeedback({
        type: "error",
        message: "Please enter a valid price value.",
      });
      return;
    }

    setDatasetSubmitting(true);
    try {
      const res = await addDatasetEntry(
        {
          latitude: datasetLat,
          longitude: datasetLng,
          category: datasetCategory,
          commodity: datasetCommodity,
          pricetype: datasetPricetype,
          price: parsedPrice,
        },
        user?.id ?? null
      );

      if (res.success && res.entry) {
        setLocalExtras((prev) => [res.entry!, ...prev]);
        setLatestDatasets((prev) => [res.entry!, ...prev].slice(0, 5));
        setDatasetPriceValue("");
        setDatasetFeedback({ type: "success", message: res.message });
      } else {
        setDatasetFeedback({ type: "error", message: res.message });
      }
    } finally {
      setDatasetSubmitting(false);
    }
  }

  function handleRetrainModel() {
    setModelStatus("Training");
    setTrainingStatusText("Training in progress...");
    const datasetPool = [...localExtras, ...allDatasets];
    const summary = retrainModel(datasetPool, activeModel, 24, 8, 1);

    setActiveModel(summary.model);
    setTrainingLogs([
      {
        epoch: 0,
        trainLoss: 0,
        valLoss: 0,
        message: `Starting model training on ${datasetPool.length} dataset entries...`,
        type: "info",
      },
      ...summary.logs,
      {
        epoch: summary.epochsCompleted,
        trainLoss: summary.finalTrainLoss,
        valLoss: summary.finalValLoss,
        message: `Model training completed successfully across ${summary.epochsCompleted} epochs!`,
        type: "success",
      },
    ]);
    setTrainingStatusText("Training completed");
    setModelStatus("Updated");
  }

  const pageTokens = useMemo(
    () => generatePageTokens(pagination.current_page, pagination.total_pages),
    [pagination.current_page, pagination.total_pages]
  );

  const startEntry =
    pagination.total_count === 0
      ? 0
      : (pagination.current_page - 1) * PAGE_LIMIT + 1;
  const endEntry = Math.min(
    pagination.current_page * PAGE_LIMIT,
    pagination.total_count
  );

  return (
    <div>
      {/* Original TerraPrice Forest Green Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <Image
              src="/Logo.png"
              alt="TerraPrice logo"
              width={40}
              height={40}
              priority
            />
            <h1>TerraPrice</h1>
          </div>

          <div className="user-info">
            {isAdmin && <span className="admin-badge">Admin</span>}
            <span>Welcome, {displayName}!</span>
            {isSignedInMember ? (
              <button
                type="button"
                className="btn-logout"
                onClick={() => void signOut()}
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                className="btn-logout"
                onClick={() => setSignInOpen(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        {/* Admin Stats Row (from admin.html) */}
        {isAdmin && (
          <div className="admin-stats">
            <Card className="stat-card">
              <h3>Total Datasets</h3>
              <p id="total-datasets">
                {pagination.total_count.toLocaleString()}
              </p>
            </Card>
            <Card className="stat-card">
              <h3>Model Status</h3>
              <p id="model-status" data-testid="model-status">
                {modelStatus}
              </p>
            </Card>
          </div>
        )}

        {/* Original Underline Tabs */}
        <div className="tabs" role="tablist" aria-label="TerraPrice sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "predict"}
            className={`tab-button ${activeTab === "predict" ? "active" : ""}`}
            onClick={() => setActiveTab("predict")}
          >
            Price Prediction
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "add-dataset"}
            className={`tab-button ${activeTab === "add-dataset" ? "active" : ""}`}
            onClick={() => setActiveTab("add-dataset")}
          >
            Add Dataset
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all-datasets"}
                className={`tab-button ${activeTab === "all-datasets" ? "active" : ""}`}
                onClick={() => setActiveTab("all-datasets")}
              >
                All Datasets
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "latest-datasets"}
                className={`tab-button ${activeTab === "latest-datasets" ? "active" : ""}`}
                onClick={() => setActiveTab("latest-datasets")}
              >
                Latest Datasets
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "model-training"}
                className={`tab-button ${activeTab === "model-training" ? "active" : ""}`}
                onClick={() => setActiveTab("model-training")}
              >
                Model Training
              </button>
            </>
          )}
        </div>

        {/* Price Prediction Tab */}
        {activeTab === "predict" && (
          <div id="predict-tab" className="content-grid">
            <PhilippinesMap
              idPrefix="predict"
              title="Select Location on Map"
              latitude={predictLat}
              longitude={predictLng}
              enablePredictionOverlay
              commodity={predictCommodity}
              pricetype={predictPricetype}
              model={activeModel}
              extraDatasets={localExtras}
              onSelectLocation={(lat, lng, label) => {
                setPredictLat(lat);
                setPredictLng(lng);
                setPredictLocationLabel(label ?? "");
              }}
            />

            <Card className="form-section">
              <h3>Prediction Parameters</h3>
              <form id="predict-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="predict-category">Category</label>
                  <select
                    id="predict-category"
                    value={predictCategory}
                    onChange={(e) => {
                      const nextCat = e.target.value;
                      setPredictCategory(nextCat);
                      const nextList = getCommoditiesByCategory(nextCat);
                      setPredictCommodity(nextList[0] ?? "");
                    }}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="predict-commodity">Commodity</label>
                  <select
                    id="predict-commodity"
                    value={predictCommodity}
                    onChange={(e) => setPredictCommodity(e.target.value)}
                    required
                  >
                    {predictCommodities.map((com) => (
                      <option key={com} value={com}>
                        {com}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="predict-pricetype">Price Type</label>
                  <select
                    id="predict-pricetype"
                    value={predictPricetype}
                    onChange={(e) => setPredictPricetype(e.target.value)}
                    required
                  >
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                  </select>
                </div>
              </form>

              {predictionResult && (
                <div
                  id="prediction-result"
                  className="result-section"
                  data-testid="prediction-result"
                >
                  <h4>Prediction Result</h4>
                  <div className="result-card">
                    <p>
                      <strong>Commodity:</strong>{" "}
                      <span>{predictionResult.commodity}</span>
                    </p>
                    <p>
                      <strong>Price Type:</strong>{" "}
                      <span>{predictionResult.pricetype}</span>
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      <span>
                        {predictionResult.locationLabel
                          ? `${predictionResult.locationLabel} (${predictionResult.latitude.toFixed(4)}, ${predictionResult.longitude.toFixed(4)})`
                          : `${predictionResult.latitude.toFixed(4)}, ${predictionResult.longitude.toFixed(4)}`}
                      </span>
                    </p>
                    <p className="tp-predicted-headline">
                      <strong>Predicted Price:</strong>{" "}
                      <span className="tp-predicted-value">
                        ₱{predictionResult.predictedPrice.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Add Dataset Tab */}
        {activeTab === "add-dataset" && (
          <div id="dataset-tab" className="content-grid">
            <PhilippinesMap
              idPrefix="dataset"
              title="Select Location for Dataset"
              latitude={datasetLat}
              longitude={datasetLng}
              onSelectLocation={(lat, lng) => {
                setDatasetLat(lat);
                setDatasetLng(lng);
              }}
            />

            <Card className="form-section">
              <h3>Dataset Entry</h3>

              {!isSignedInMember ? (
                <div className="tp-signin-gate">
                  <p>
                    Anyone can forecast prices, while submitting new market
                    dataset entries requires signing in to your Machi Asia
                    account.
                  </p>
                  <Button
                    type="button"
                    className="btn-primary"
                    onClick={() => setSignInOpen(true)}
                  >
                    Sign in to Submit Dataset
                  </Button>
                </div>
              ) : (
                <>
                  <form id="dataset-form" onSubmit={handleDatasetSubmit}>
                    <div className="form-group">
                      <label htmlFor="dataset-category">Category</label>
                      <select
                        id="dataset-category"
                        value={datasetCategory}
                        onChange={(e) => {
                          const nextCat = e.target.value;
                          setDatasetCategory(nextCat);
                          const nextList = getCommoditiesByCategory(nextCat);
                          setDatasetCommodity(nextList[0] ?? "");
                        }}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dataset-commodity">Commodity</label>
                      <select
                        id="dataset-commodity"
                        value={datasetCommodity}
                        onChange={(e) => setDatasetCommodity(e.target.value)}
                        required
                      >
                        {datasetCommodities.map((com) => (
                          <option key={com} value={com}>
                            {com}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dataset-pricetype">Price Type</label>
                      <select
                        id="dataset-pricetype"
                        value={datasetPricetype}
                        onChange={(e) => setDatasetPricetype(e.target.value)}
                        required
                      >
                        <option value="Retail">Retail</option>
                        <option value="Wholesale">Wholesale</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dataset-value">Price Value (₱)</label>
                      <input
                        id="dataset-value"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter price value"
                        value={datasetPriceValue}
                        onChange={(e) => setDatasetPriceValue(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={datasetSubmitting}
                    >
                      {datasetSubmitting ? "Adding..." : "Add to Dataset"}
                    </Button>
                  </form>

                  {datasetFeedback && (
                    <div id="dataset-result" className="result-section">
                      <div className="result-card">
                        <p
                          role="status"
                          className={
                            datasetFeedback.type === "success"
                              ? "success"
                              : "error"
                          }
                        >
                          {datasetFeedback.message}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* All Datasets Tab (Admin Only) */}
        {isAdmin && activeTab === "all-datasets" && (
          <Card className="admin-panel">
            <div className="section-header">
              <h2>All Datasets</h2>
              <div className="header-controls">
                <span className="pagination-info">
                  Showing {startEntry}-{endEntry} of{" "}
                  {pagination.total_count.toLocaleString()} entries
                </span>
                <button
                  type="button"
                  className="btn-refresh"
                  onClick={() => loadAllDatasets(pagination.current_page)}
                  disabled={loadingDatasets}
                >
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="tp-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Category</th>
                    <th>Commodity</th>
                    <th>Price Type</th>
                    <th>Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {allDatasets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.latitude.toFixed(6)}</td>
                      <td>{row.longitude.toFixed(6)}</td>
                      <td>{row.category}</td>
                      <td>{row.commodity}</td>
                      <td>{row.pricetype}</td>
                      <td>₱{row.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                className="btn-pagination"
                disabled={!pagination.has_prev || loadingDatasets}
                onClick={() => loadAllDatasets(pagination.current_page - 1)}
              >
                ← Previous
              </button>
              <div className="page-numbers">
                {pageTokens.map((token, idx) =>
                  token === "..." ? (
                    <span key={`ellipsis-${idx}`} className="page-ellipsis">
                      ...
                    </span>
                  ) : (
                    <button
                      key={token}
                      type="button"
                      className={`page-number ${token === pagination.current_page ? "active" : ""}`}
                      onClick={() => loadAllDatasets(token)}
                    >
                      {token}
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                className="btn-pagination"
                disabled={!pagination.has_next || loadingDatasets}
                onClick={() => loadAllDatasets(pagination.current_page + 1)}
              >
                Next →
              </button>
            </div>
          </Card>
        )}

        {/* Latest Datasets Tab (Admin Only) */}
        {isAdmin && activeTab === "latest-datasets" && (
          <Card className="admin-panel">
            <div className="section-header">
              <h2>Latest 5 Datasets</h2>
              <button
                type="button"
                className="btn-refresh"
                onClick={loadLatestDatasets}
                disabled={loadingLatest}
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="table-container">
              <table className="tp-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Category</th>
                    <th>Commodity</th>
                    <th>Price Type</th>
                    <th>Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {latestDatasets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.latitude.toFixed(6)}</td>
                      <td>{row.longitude.toFixed(6)}</td>
                      <td>{row.category}</td>
                      <td>{row.commodity}</td>
                      <td>{row.pricetype}</td>
                      <td>₱{row.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Model Training Tab (Admin Only) */}
        {isAdmin && activeTab === "model-training" && (
          <Card className="admin-panel">
            <div className="training-section">
              <h2>Model Training</h2>
              <p className="training-description">
                Retrain the neural network model with the latest dataset entries
                to improve prediction accuracy.
              </p>

              <div className="training-card">
                <div className="training-info">
                  <h3>Current Model Status</h3>
                  <p>
                    Architecture:{" "}
                    <span>{activeModel.layerSizes.join(" → ")}</span>
                  </p>
                  <p>
                    Training status:{" "}
                    <span id="training-status">{trainingStatusText}</span>
                  </p>
                </div>

                <button
                  type="button"
                  id="train-btn"
                  className="btn-train"
                  onClick={handleRetrainModel}
                  disabled={modelStatus === "Training"}
                >
                  Retrain Model
                </button>
              </div>

              {trainingLogs.length > 0 && (
                <div className="training-log" data-testid="training-log">
                  <h4>Training Log</h4>
                  <div className="log-content">
                    {trainingLogs.map((entry, idx) => (
                      <div
                        key={`${entry.epoch}-${idx}`}
                        className={`log-entry ${entry.type}`}
                      >
                        {entry.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </main>

      {signInOpen && (
        <SignInModal
          onClose={() => setSignInOpen(false)}
          title="Sign in to TerraPrice"
          subtitle="Authenticate to submit regional market prices to the Supabase dataset."
        />
      )}
    </div>
  );
}
