"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@mono/components";
import { Eye, Layers, Navigation } from "lucide-react";
import {
  PHILIPPINES_BOUNDS,
  PHILIPPINES_CENTER,
  PHILIPPINES_MARKET_PRESETS,
  type DatasetEntry,
} from "../data/catalog";
import {
  getCommodityMapPoints,
  isWithinPhilippinesBounds,
} from "../lib/dataset-service";
import { getDefaultModel, type TerraPriceModelData } from "../model/estimator";
import {
  buildCalibratedPoints,
  computeSharedPriceDomain,
  evaluateCalibratedSpatial,
  precomputeSpatialLayer0,
  priceToHex,
  renderGpuPredictionHeatmap,
} from "../model/gpu-heatmap";

export interface PhilippinesMapProps {
  idPrefix: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  onSelectLocation: (lat: number, lng: number, label?: string) => void;
  enablePredictionOverlay?: boolean;
  commodity?: string;
  pricetype?: string;
  model?: TerraPriceModelData;
  extraDatasets?: DatasetEntry[];
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const EMPTY_EXTRA_DATASETS: DatasetEntry[] = [];

async function loadLeaflet(): Promise<typeof import("leaflet")> {
  const mod = await import("leaflet");
  const candidate = (mod as unknown as { default?: typeof import("leaflet") })
    .default;
  return candidate ?? mod;
}

export function PhilippinesMap({
  idPrefix,
  title,
  latitude,
  longitude,
  onSelectLocation,
  enablePredictionOverlay = false,
  commodity = "",
  pricetype = "Retail",
  model,
  extraDatasets = EMPTY_EXTRA_DATASETS,
}: PhilippinesMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").CircleMarker | null>(null);
  const imageOverlayRef = useRef<import("leaflet").ImageOverlay | null>(null);
  const pointsLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectLocation);
  onSelectRef.current = onSelectLocation;

  const [mapReady, setMapReady] = useState(false);
  const [boundsWarning, setBoundsWarning] = useState<string | null>(null);
  const [latOverride, setLatOverride] = useState<string | null>(null);
  const [lngOverride, setLngOverride] = useState<string | null>(null);

  // Overlay Controls State (Price Prediction map only)
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showDatasetPoints, setShowDatasetPoints] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.55);

  const showHeatmapRef = useRef(showHeatmap);
  showHeatmapRef.current = showHeatmap;
  const showPointsRef = useRef(showDatasetPoints);
  showPointsRef.current = showDatasetPoints;
  const opacityRef = useRef(heatmapOpacity);
  opacityRef.current = heatmapOpacity;

  const latDraft =
    latOverride ?? (latitude !== null ? latitude.toFixed(6) : "");
  const lngDraft =
    lngOverride ?? (longitude !== null ? longitude.toFixed(6) : "");

  const resolvedModel = useMemo(() => model ?? getDefaultModel(), [model]);

  const datasetPoints = useMemo(() => {
    if (!enablePredictionOverlay || !commodity) return [];
    return getCommodityMapPoints(commodity, pricetype, extraDatasets);
  }, [enablePredictionOverlay, commodity, pricetype, extraDatasets]);

  const spatialPrecompute = useMemo(() => {
    if (!enablePredictionOverlay || !commodity) return null;
    return precomputeSpatialLayer0(commodity, pricetype, resolvedModel);
  }, [enablePredictionOverlay, commodity, pricetype, resolvedModel]);

  const calibratedPoints = useMemo(() => {
    if (!spatialPrecompute) return [];
    return buildCalibratedPoints(datasetPoints, spatialPrecompute);
  }, [datasetPoints, spatialPrecompute]);

  const priceDomain = useMemo(() => {
    if (!spatialPrecompute) return null;
    return computeSharedPriceDomain(
      datasetPoints,
      (lat, lng) =>
        evaluateCalibratedSpatial(lat, lng, spatialPrecompute, calibratedPoints),
      PHILIPPINES_BOUNDS
    );
  }, [datasetPoints, spatialPrecompute, calibratedPoints]);

  // Initialize Leaflet map once on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !el || mapRef.current) return;

        const map = L.map(el, {
          center:
            latitude !== null && longitude !== null
              ? [latitude, longitude]
              : PHILIPPINES_CENTER,
          zoom: latitude !== null && longitude !== null ? 8 : 6,
          maxBounds: PHILIPPINES_BOUNDS,
          maxBoundsViscosity: 1.0,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        map.on("click", (event: import("leaflet").LeafletMouseEvent) => {
          const lat = event.latlng.lat;
          const lng = event.latlng.lng;
          if (isWithinPhilippinesBounds(lat, lng)) {
            setBoundsWarning(null);
            setLatOverride(null);
            setLngOverride(null);
            onSelectRef.current(
              Number(lat.toFixed(6)),
              Number(lng.toFixed(6))
            );
          } else {
            setBoundsWarning("Please click only within the Philippines.");
          }
        });

        mapRef.current = map;

        if (latitude !== null && longitude !== null) {
          markerRef.current = L.circleMarker([latitude, longitude], {
            radius: 8,
            color: "#1f3d2a",
            fillColor: "#2d5a3d",
            fillOpacity: 0.95,
            weight: 2.5,
          }).addTo(map);
        }

        setMapReady(true);
      })
      .catch(() => {
        // Non-browser / test fallback if Leaflet canvas is unavailable
      });

    return () => {
      cancelled = true;
      if (imageOverlayRef.current) {
        imageOverlayRef.current.remove();
        imageOverlayRef.current = null;
      }
      if (pointsLayerRef.current) {
        pointsLayerRef.current.remove();
        pointsLayerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // Initialize map once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update clicked selection marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || latitude === null || longitude === null) return;

    loadLeaflet()
      .then((L) => {
        if (!mapRef.current) return;
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else {
          markerRef.current = L.circleMarker([latitude, longitude], {
            radius: 8,
            color: "#1f3d2a",
            fillColor: "#2d5a3d",
            fillOpacity: 0.95,
            weight: 2.5,
          }).addTo(map);
        }
        markerRef.current.bringToFront?.();
        map.setView([latitude, longitude], Math.max(map.getZoom(), 8));
      })
      .catch(() => {
        // Ignore in headless environments
      });
  }, [latitude, longitude]);

  // Render price heatmap + market locations ONCE when commodity/pricetype/model/dataset changes
  useEffect(() => {
    if (
      !enablePredictionOverlay ||
      !commodity ||
      !spatialPrecompute ||
      !priceDomain ||
      !mapReady ||
      !mapRef.current
    ) {
      return;
    }

    let cancelled = false;

    const renderOverlay = async () => {
      const rendered = renderGpuPredictionHeatmap({
        commodity,
        pricetype,
        model: resolvedModel,
        points: datasetPoints,
        bounds: PHILIPPINES_BOUNDS,
      });

      if (cancelled || !mapRef.current) return;

      try {
        const L = await loadLeaflet();
        if (cancelled || !mapRef.current) return;
        const map = mapRef.current;

        const targetOpacity = showHeatmapRef.current ? opacityRef.current : 0;
        if (imageOverlayRef.current) {
          imageOverlayRef.current.setUrl(rendered.dataUrl);
          imageOverlayRef.current.setOpacity(targetOpacity);
        } else if (typeof L.imageOverlay === "function") {
          imageOverlayRef.current = L.imageOverlay(
            rendered.dataUrl,
            PHILIPPINES_BOUNDS,
            {
              opacity: targetOpacity,
              interactive: false,
            }
          ).addTo(map);
        }

        if (typeof L.layerGroup === "function") {
          if (!pointsLayerRef.current) {
            pointsLayerRef.current = L.layerGroup();
          } else {
            pointsLayerRef.current.clearLayers?.();
          }

          const layerGroup = pointsLayerRef.current;
          for (const pt of datasetPoints) {
            const fillColor = priceToHex(
              pt.price,
              rendered.minPrice,
              rendered.maxPrice
            );
            const calibratedAtPoint = evaluateCalibratedSpatial(
              pt.latitude,
              pt.longitude,
              spatialPrecompute,
              calibratedPoints
            );
            const marker = L.circleMarker([pt.latitude, pt.longitude], {
              radius: 5.5,
              fillColor,
              color: "#ffffff",
              weight: 1.75,
              fillOpacity: 0.95,
            });
            marker.bindTooltip?.(
              `<strong>${escapeHtml(pt.market)}</strong> (${escapeHtml(pt.pricetype)})<br/>Market Price: <strong>₱${pt.price.toFixed(2)}</strong><br/>Predicted: <strong>₱${calibratedAtPoint.toFixed(2)}</strong>`,
              { direction: "top" }
            );
            layerGroup.addLayer?.(marker);
          }

          if (showPointsRef.current) {
            layerGroup.addTo?.(map);
          } else {
            layerGroup.remove?.();
          }
        }

        markerRef.current?.bringToFront?.();
      } catch {
        // Ignore Leaflet layer failures in mocked/headless environments
      }
    };

    void renderOverlay();

    return () => {
      cancelled = true;
    };
  }, [
    enablePredictionOverlay,
    commodity,
    pricetype,
    resolvedModel,
    datasetPoints,
    calibratedPoints,
    spatialPrecompute,
    priceDomain,
    mapReady,
  ]);

  // Toggle heatmap visibility / opacity directly without re-running the GPU shader
  useEffect(() => {
    if (!imageOverlayRef.current) return;
    imageOverlayRef.current.setOpacity?.(showHeatmap ? heatmapOpacity : 0);
  }, [showHeatmap, heatmapOpacity]);

  // Toggle dataset scatter points directly without re-running the GPU shader
  useEffect(() => {
    const map = mapRef.current;
    const group = pointsLayerRef.current;
    if (!map || !group) return;
    if (showDatasetPoints) {
      group.addTo?.(map);
      markerRef.current?.bringToFront?.();
    } else {
      group.remove?.();
    }
  }, [showDatasetPoints]);

  function handleApplyManualCoords() {
    const parsedLat = Number.parseFloat(latDraft);
    const parsedLng = Number.parseFloat(lngDraft);
    if (!isWithinPhilippinesBounds(parsedLat, parsedLng)) {
      setBoundsWarning(
        "Coordinates must be inside the Philippines (lat 4.2158–21.321, lng 116.87–126.605)."
      );
      return;
    }
    setBoundsWarning(null);
    setLatOverride(null);
    setLngOverride(null);
    onSelectLocation(
      Number(parsedLat.toFixed(6)),
      Number(parsedLng.toFixed(6))
    );
  }

  return (
    <Card className="map-section">
      <h3>{title}</h3>

      <div
        className="tp-map-presets"
        role="group"
        aria-label={`${title} regional presets`}
      >
        {PHILIPPINES_MARKET_PRESETS.map((preset) => {
          const isActive =
            latitude !== null &&
            longitude !== null &&
            Math.abs(latitude - preset.latitude) < 0.001 &&
            Math.abs(longitude - preset.longitude) < 0.001;

          return (
            <button
              key={preset.id}
              type="button"
              className="tp-preset-btn"
              data-active={isActive ? "true" : "false"}
              onClick={() => {
                setBoundsWarning(null);
                setLatOverride(null);
                setLngOverride(null);
                onSelectLocation(preset.latitude, preset.longitude, preset.name);
              }}
            >
              <Navigation size={12} />
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        id={`${idPrefix}-map`}
        data-testid={`${idPrefix}-map-canvas`}
        className="map"
      />

      {enablePredictionOverlay && commodity && priceDomain && (
        <div
          className="tp-overlay-panel"
          data-testid="prediction-overlay-panel"
        >
          <div className="tp-overlay-controls">
            <div className="tp-overlay-toggles">
              <button
                type="button"
                className="tp-toggle-chip"
                data-active={showHeatmap ? "true" : "false"}
                aria-pressed={showHeatmap}
                onClick={() => setShowHeatmap((prev) => !prev)}
              >
                <Layers size={13} />
                <span>Price Heatmap</span>
              </button>

              <button
                type="button"
                className="tp-toggle-chip"
                data-active={showDatasetPoints ? "true" : "false"}
                aria-pressed={showDatasetPoints}
                onClick={() => setShowDatasetPoints((prev) => !prev)}
              >
                <Eye size={13} />
                <span>Market Locations</span>
              </button>
            </div>

            <label className="tp-opacity-control">
              <span>Opacity {Math.round(heatmapOpacity * 100)}%</span>
              <input
                aria-label="Prediction overlay opacity"
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={heatmapOpacity}
                onChange={(e) =>
                  setHeatmapOpacity(Number.parseFloat(e.target.value))
                }
              />
            </label>
          </div>

          <div className="tp-legend-bar" data-testid="price-color-legend">
            <div className="tp-legend-header">
              <span>
                Price Range — <strong>{commodity}</strong> ({pricetype})
              </span>
            </div>
            <div className="tp-legend-gradient" />
            <div className="tp-legend-labels">
              <span>₱{priceDomain.minPrice.toFixed(2)}</span>
              <span>₱{priceDomain.midPrice.toFixed(2)}</span>
              <span>₱{priceDomain.maxPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {boundsWarning && (
        <div role="alert" className="tp-warning">
          {boundsWarning}
        </div>
      )}

      <div className="tp-coord-inputs">
        <label>
          <span className="tp-coord-label">Latitude</span>
          <input
            aria-label={`${idPrefix} latitude`}
            className="tp-coord-input"
            type="number"
            step="0.0001"
            min={4.2158}
            max={21.321}
            value={latDraft}
            placeholder="e.g. 14.6000"
            onChange={(e) => setLatOverride(e.target.value)}
            onBlur={handleApplyManualCoords}
          />
        </label>
        <label>
          <span className="tp-coord-label">Longitude</span>
          <input
            aria-label={`${idPrefix} longitude`}
            className="tp-coord-input"
            type="number"
            step="0.0001"
            min={116.87}
            max={126.605}
            value={lngDraft}
            placeholder="e.g. 120.9800"
            onChange={(e) => setLngOverride(e.target.value)}
            onBlur={handleApplyManualCoords}
          />
        </label>
      </div>
    </Card>
  );
}
