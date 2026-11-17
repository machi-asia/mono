import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ThreeDShowcaseSection from "./ThreeDShowcaseSection";
import { SHOWCASE_3D_MODELS } from "../../data/showcase-media";

describe("ThreeDShowcaseSection", () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
            return setTimeout(() => cb(performance.now()), 16) as unknown as number;
        });
        vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
    });

    it("renders borderless 3D Showcase heading, parallax panels, inverted panel, 4 model tabs, render mode toggles, and stage", () => {
        render(<ThreeDShowcaseSection />);

        expect(screen.getByRole("heading", { name: /3D Showcase/i })).toBeInTheDocument();
        expect(screen.getByTestId("interactive-3d-stage")).toBeInTheDocument();
        expect(screen.getByTestId("three-d-parallax-panel-left")).toBeInTheDocument();
        expect(screen.getByTestId("three-d-parallax-panel-right")).toBeInTheDocument();
        expect(screen.getByTestId("three-d-invert-panel")).toHaveStyle({ mixBlendMode: "difference" });

        for (const model of SHOWCASE_3D_MODELS) {
            expect(screen.getByTestId(`model-tab-${model.id}`)).toHaveTextContent(model.title);
        }

        expect(screen.getByTestId("render-mode-shaded")).toBeInTheDocument();
        expect(screen.getByTestId("render-mode-wireframe")).toBeInTheDocument();
        expect(screen.getByTestId("render-mode-vertex")).toBeInTheDocument();
    });

    it("switches active 3D model preset and description when a model tab is clicked", () => {
        render(<ThreeDShowcaseSection />);

        const secondModel = SHOWCASE_3D_MODELS[1];
        const stage = screen.getByTestId("interactive-3d-stage");

        fireEvent.click(screen.getByTestId(`model-tab-${secondModel.id}`));
        expect(screen.getByTestId(`model-tab-${secondModel.id}`)).toHaveAttribute("aria-selected", "true");
        expect(stage).toHaveAttribute("data-preset", secondModel.preset);
        expect(screen.getByText(secondModel.description)).toBeInTheDocument();
    });

    it("switches render modes between Shaded, Wireframe, and Vertex", () => {
        render(<ThreeDShowcaseSection />);

        const stage = screen.getByTestId("interactive-3d-stage");

        const wireframeBtn = screen.getByTestId("render-mode-wireframe");
        fireEvent.click(wireframeBtn);
        expect(wireframeBtn).toHaveAttribute("aria-pressed", "true");
        expect(stage).toHaveAttribute("data-render-mode", "wireframe");

        const vertexBtn = screen.getByTestId("render-mode-vertex");
        fireEvent.click(vertexBtn);
        expect(vertexBtn).toHaveAttribute("aria-pressed", "true");
        expect(stage).toHaveAttribute("data-render-mode", "vertex");

        const shadedBtn = screen.getByTestId("render-mode-shaded");
        fireEvent.click(shadedBtn);
        expect(shadedBtn).toHaveAttribute("aria-pressed", "true");
        expect(stage).toHaveAttribute("data-render-mode", "shaded");
    });

    it("increments bump count when clicking the 3D stage", () => {
        render(<ThreeDShowcaseSection />);

        const stage = screen.getByTestId("interactive-3d-stage");
        fireEvent.click(stage);
        expect(stage).toHaveAttribute("data-bump-count", "1");
    });
});
