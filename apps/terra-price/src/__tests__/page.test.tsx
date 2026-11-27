import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MockAuthProvider } from "@mono/auth/mock";
import HomePage from "../app/page";

vi.mock("leaflet", () => {
  const mapInstance = {
    on: vi.fn(),
    setView: vi.fn(),
    getZoom: () => 6,
    remove: vi.fn(),
  };
  const markerInstance = {
    setLatLng: vi.fn(),
    bindTooltip: vi.fn(),
    bringToFront: vi.fn(),
    addTo: vi.fn(),
  };
  markerInstance.addTo.mockImplementation(() => markerInstance);

  const imageOverlayInstance = {
    addTo: vi.fn(),
    setUrl: vi.fn(),
    setOpacity: vi.fn(),
    remove: vi.fn(),
  };
  imageOverlayInstance.addTo.mockImplementation(() => imageOverlayInstance);

  const layerGroupInstance = {
    addTo: vi.fn(),
    addLayer: vi.fn(),
    clearLayers: vi.fn(),
    remove: vi.fn(),
  };
  layerGroupInstance.addTo.mockImplementation(() => layerGroupInstance);

  return {
    default: {
      map: vi.fn(() => mapInstance),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      circleMarker: vi.fn(() => markerInstance),
      imageOverlay: vi.fn(() => imageOverlayInstance),
      layerGroup: vi.fn(() => layerGroupInstance),
    },
  };
});

let mockRole: "guest" | "member" | "admin" = "guest";

vi.mock("@mono/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mono/auth")>();
  return {
    ...actual,
    createClient: () => {
      throw new Error("Mock offline fallback");
    },
    useAuth: () => ({
      user:
        mockRole === "guest"
          ? null
          : { id: "user-123", email: "user@machi.asia" },
      role: mockRole,
      isGuest: mockRole === "guest",
      isLoading: false,
      accounts: [],
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithGithub: vi.fn(),
      signInAsGuest: vi.fn(),
      switchAccount: vi.fn(),
      removeAccount: vi.fn(),
      signOut: vi.fn(),
      refreshRole: vi.fn(),
    }),
  };
});

describe("TerraPrice HomePage", () => {
  beforeEach(() => {
    mockRole = "guest";
  });

  afterEach(() => {
    cleanup();
  });

  it("allows guests to predict commodity prices while gating dataset submission and hiding admin tabs", () => {
    render(
      <MockAuthProvider state="guest">
        <HomePage />
      </MockAuthProvider>
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /TerraPrice/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: /Price Prediction/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Add Dataset/i })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /All Datasets/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /Model Training/i })).not.toBeInTheDocument();

    expect(screen.getByTestId("prediction-overlay-panel")).toBeInTheDocument();
    expect(screen.getByTestId("price-color-legend")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Predict Price/i })
    ).not.toBeInTheDocument();

    const resultCard = screen.getByTestId("prediction-result");
    expect(resultCard).toBeInTheDocument();
    expect(resultCard.textContent).toMatch(/Predicted Price:/);
    expect(resultCard.textContent).toMatch(/₱\d+\.\d{2}/);
    expect(resultCard.textContent).not.toMatch(/Fourier MLP|Kriging|GP Spatial/i);

    fireEvent.click(screen.getByRole("button", { name: /Cebu City/i }));
    expect(screen.getByTestId("prediction-result")).toHaveTextContent(
      /Cebu City/i
    );

    // Guests see sign-in prompt on Add Dataset tab
    fireEvent.click(screen.getByRole("tab", { name: /Add Dataset/i }));
    expect(
      screen.getByRole("button", { name: /Sign in to Submit Dataset/i })
    ).toBeInTheDocument();
    expect(screen.queryByTestId("prediction-overlay-panel")).not.toBeInTheDocument();
  });

  it("allows signed-in members to submit new dataset entries", async () => {
    mockRole = "member";
    render(
      <MockAuthProvider state="signed-in">
        <HomePage />
      </MockAuthProvider>
    );

    fireEvent.click(screen.getByRole("tab", { name: /Add Dataset/i }));
    expect(screen.queryByTestId("prediction-overlay-panel")).not.toBeInTheDocument();
    const priceInput = screen.getByLabelText(/Price Value/i);
    fireEvent.change(priceInput, { target: { value: "52.50" } });
    fireEvent.click(screen.getByRole("button", { name: /Add to Dataset/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/Dataset entry/i);
    });
  });

  it("unlocks All Datasets, Latest Datasets, and Model Training tabs for admin users", async () => {
    mockRole = "admin";
    render(
      <MockAuthProvider state="signed-in">
        <HomePage />
      </MockAuthProvider>
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /All Datasets/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Latest Datasets/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Model Training/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /All Datasets/i }));
    expect(screen.getByRole("heading", { name: /All Datasets/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Latest Datasets/i }));
    expect(
      screen.getByRole("heading", { name: /Latest 5 Datasets/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Model Training/i }));
    fireEvent.click(screen.getByRole("button", { name: /Retrain Model/i }));

    expect(screen.getByTestId("model-status")).toHaveTextContent("Updated");
    expect(screen.getByTestId("training-log")).toHaveTextContent(
      /Model training completed successfully/i
    );
  });
});
