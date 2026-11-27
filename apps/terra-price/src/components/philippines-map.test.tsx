import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PhilippinesMap } from "./philippines-map";

const imageOverlayMock = {
  addTo: vi.fn(),
  setUrl: vi.fn(),
  setOpacity: vi.fn(),
  remove: vi.fn(),
};
imageOverlayMock.addTo.mockImplementation(() => imageOverlayMock);

const layerGroupMock = {
  addTo: vi.fn(),
  addLayer: vi.fn(),
  clearLayers: vi.fn(),
  remove: vi.fn(),
};
layerGroupMock.addTo.mockImplementation(() => layerGroupMock);

const markerMock = {
  setLatLng: vi.fn(),
  bindTooltip: vi.fn(),
  bringToFront: vi.fn(),
  addTo: vi.fn(),
};
markerMock.addTo.mockImplementation(() => markerMock);

vi.mock("leaflet", () => {
  const mapInstance = {
    on: vi.fn(),
    setView: vi.fn(),
    getZoom: () => 6,
    remove: vi.fn(),
  };
  return {
    default: {
      map: vi.fn(() => mapInstance),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      circleMarker: vi.fn(() => markerMock),
      imageOverlay: vi.fn(() => imageOverlayMock),
      layerGroup: vi.fn(() => layerGroupMock),
    },
  };
});

describe("PhilippinesMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    imageOverlayMock.addTo.mockImplementation(() => imageOverlayMock);
    layerGroupMock.addTo.mockImplementation(() => layerGroupMock);
    markerMock.addTo.mockImplementation(() => markerMock);
  });

  it("renders regional market presets and updates location on preset click", () => {
    const onSelect = vi.fn();
    render(
      <PhilippinesMap
        idPrefix="predict"
        title="Select Location on Map"
        latitude={14.6}
        longitude={120.98}
        onSelectLocation={onSelect}
      />
    );

    expect(screen.getByText("Select Location on Map")).toBeInTheDocument();
    expect(screen.getByTestId("predict-map-canvas")).toBeInTheDocument();
    expect(screen.queryByTestId("prediction-overlay-panel")).not.toBeInTheDocument();

    const cebuBtn = screen.getByRole("button", { name: /Cebu City/i });
    fireEvent.click(cebuBtn);
    expect(onSelect).toHaveBeenCalledWith(10.31, 123.89, "Cebu City");
  });

  it("validates Philippines bounds on manual coordinate input", () => {
    const onSelect = vi.fn();
    render(
      <PhilippinesMap
        idPrefix="dataset"
        title="Select Location for Dataset"
        latitude={14.6}
        longitude={120.98}
        onSelectLocation={onSelect}
      />
    );

    const latInput = screen.getByLabelText("dataset latitude");
    fireEvent.change(latInput, { target: { value: "45.0" } });
    fireEvent.blur(latInput);

    expect(screen.getByRole("alert")).toHaveTextContent(
      /Coordinates must be inside the Philippines/i
    );
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.change(latInput, { target: { value: "7.18" } });
    const lngInput = screen.getByLabelText("dataset longitude");
    fireEvent.change(lngInput, { target: { value: "125.44" } });
    fireEvent.blur(lngInput);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith(7.18, 125.44);
  });

  it("renders GPU heatmap overlay, dataset points, opacity slider, and price legend when enabled", async () => {
    const L = (await import("leaflet")).default;

    render(
      <PhilippinesMap
        idPrefix="predict"
        title="Select Location on Map"
        latitude={14.6}
        longitude={120.98}
        enablePredictionOverlay
        commodity="Rice (regular, milled)"
        pricetype="Retail"
        onSelectLocation={vi.fn()}
      />
    );

    expect(screen.getByTestId("prediction-overlay-panel")).toBeInTheDocument();
    expect(screen.getByTestId("price-color-legend")).toHaveTextContent(
      /Price Range — Rice \(regular, milled\)/i
    );
    const heatmapBtn = screen.getByRole("button", { name: /Price Heatmap/i });
    const locationsBtn = screen.getByRole("button", {
      name: /Market Locations/i,
    });
    expect(heatmapBtn).toHaveAttribute("aria-pressed", "true");
    expect(heatmapBtn).toHaveAttribute("data-active", "true");
    expect(locationsBtn).toHaveAttribute("aria-pressed", "true");
    expect(locationsBtn).toHaveAttribute("data-active", "true");
    expect(screen.queryByTestId("gpu-backend-badge")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(L.imageOverlay).toHaveBeenCalledTimes(1);
      expect(L.layerGroup).toHaveBeenCalledTimes(1);
      expect(layerGroupMock.addLayer).toHaveBeenCalled();
    });

    const slider = screen.getByLabelText("Prediction overlay opacity");
    fireEvent.change(slider, { target: { value: "0.75" } });
    expect(imageOverlayMock.setOpacity).toHaveBeenCalledWith(0.75);

    fireEvent.click(heatmapBtn);
    expect(heatmapBtn).toHaveAttribute("aria-pressed", "false");
    expect(heatmapBtn).toHaveAttribute("data-active", "false");
    expect(imageOverlayMock.setOpacity).toHaveBeenCalledWith(0);

    fireEvent.click(locationsBtn);
    expect(locationsBtn).toHaveAttribute("aria-pressed", "false");
    expect(locationsBtn).toHaveAttribute("data-active", "false");
    expect(layerGroupMock.remove).toHaveBeenCalled();
  });
});
