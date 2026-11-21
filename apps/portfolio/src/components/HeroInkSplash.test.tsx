import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

const { mockStart, mockStop, mockSetConfig, mockSplatAtLocation, mockTogglePause } = vi.hoisted(() => ({
    mockStart: vi.fn(),
    mockStop: vi.fn(),
    mockSetConfig: vi.fn(),
    mockSplatAtLocation: vi.fn(),
    mockTogglePause: vi.fn(),
}));

vi.mock("webgl-fluid-enhanced", () => ({
    default: vi.fn().mockImplementation(function MockWebGLFluidEnhanced() {
        return {
            start: mockStart,
            stop: mockStop,
            setConfig: mockSetConfig,
            splatAtLocation: mockSplatAtLocation,
            togglePause: mockTogglePause,
        };
    }),
}));

import HeroInkSplash from "./HeroInkSplash";

describe("HeroInkSplash", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("initializes webgl-fluid-enhanced with transparent ink config and emits expanding splats", () => {
        const { unmount } = render(<HeroInkSplash />);

        const splash = screen.getByTestId("hero-ink-splash");
        expect(splash).toBeInTheDocument();
        expect(splash).toHaveAttribute("aria-hidden", "true");
        expect(splash).toHaveClass("centra-hero-ink-splash");
        expect(screen.getByTestId("hero-ink-canvas")).toBeInTheDocument();

        const silhouette = screen.getByTestId("hero-ink-silhouette");
        expect(silhouette).toBeInTheDocument();
        expect(silhouette).toHaveAttribute("src", "/images/hero-ink-silhouette.png");
        expect(silhouette).toHaveClass("centra-hero-ink-silhouette");

        expect(mockSetConfig).toHaveBeenCalledWith(
            expect.objectContaining({
                backgroundColor: "#020203",
                transparent: false,
                colorful: false,
                shading: true,
            })
        );
        expect(mockStart).toHaveBeenCalledTimes(1);
        expect(mockSplatAtLocation).toHaveBeenCalled();

        unmount();
        expect(mockStop).toHaveBeenCalledTimes(1);
    });
});
