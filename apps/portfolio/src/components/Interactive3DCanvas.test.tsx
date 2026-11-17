import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import Interactive3DCanvasDefault, { Interactive3DCanvas } from "./Interactive3DCanvas";
import type { GeometryPreset3D, RenderMode3D } from "../data/showcase-media";

describe("Interactive3DCanvas", () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  afterEach(() => {
    cleanup();
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    vi.restoreAllMocks();
  });

  it("exports both named and default Interactive3DCanvas components", () => {
    expect(Interactive3DCanvas).toBeDefined();
    expect(Interactive3DCanvasDefault).toBe(Interactive3DCanvas);
  });

  it("renders borderless accessible stage with cursor attribute and bump counter", () => {
    render(<Interactive3DCanvas label="Hero Torus Viewport" />);

    const stage = screen.getByTestId("interactive-3d-stage");
    expect(stage).toBeInTheDocument();
    expect(stage).toHaveAttribute("role", "region");
    expect(stage).toHaveAttribute("aria-label", "Hero Torus Viewport");
    expect(stage).toHaveAttribute("data-cursor", "BUMP / DRAG");
    expect(stage).toHaveAttribute("data-preset", "torus-knot");
    expect(stage).toHaveAttribute("data-render-mode", "shaded");
    expect(stage).toHaveAttribute("data-bump-count", "0");
  });

  it("triggers click-bump impulse callback and increments bump count", () => {
    const onBump = vi.fn();
    render(<Interactive3DCanvas onBump={onBump} />);

    const stage = screen.getByTestId("interactive-3d-stage");
    fireEvent.click(stage);
    expect(onBump).toHaveBeenCalledTimes(1);
    expect(onBump).toHaveBeenLastCalledWith(1);
    expect(stage).toHaveAttribute("data-bump-count", "1");

    fireEvent.click(stage);
    expect(onBump).toHaveBeenCalledTimes(2);
    expect(onBump).toHaveBeenLastCalledWith(2);
    expect(stage).toHaveAttribute("data-bump-count", "2");
  });

  it("supports keyboard Enter and Space to trigger bump", () => {
    const onBump = vi.fn();
    render(<Interactive3DCanvas onBump={onBump} />);

    const stage = screen.getByTestId("interactive-3d-stage");
    fireEvent.keyDown(stage, { key: "Enter" });
    fireEvent.keyDown(stage, { key: " " });

    expect(onBump).toHaveBeenCalledTimes(2);
    expect(stage).toHaveAttribute("data-bump-count", "2");
  });

  it("suppresses bump after a long pointer drag orbit", () => {
    const onBump = vi.fn();
    render(<Interactive3DCanvas onBump={onBump} />);

    const stage = screen.getByTestId("interactive-3d-stage");
    fireEvent.pointerDown(stage, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(stage, { clientX: 150, clientY: 130, pointerId: 1 });
    fireEvent.pointerUp(stage, { clientX: 150, clientY: 130, pointerId: 1 });
    fireEvent.click(stage);

    expect(onBump).not.toHaveBeenCalled();
    expect(stage).toHaveAttribute("data-bump-count", "0");

    fireEvent.click(stage);
    expect(onBump).toHaveBeenCalledWith(1);
  });

  it("supports all 4 geometry presets and all 3 render modes", () => {
    const presets: GeometryPreset3D[] = [
      "torus-knot",
      "icosahedron-core",
      "octahedron-lattice",
      "cyber-gyroid",
    ];
    const modes: RenderMode3D[] = ["shaded", "wireframe", "vertex"];

    for (const preset of presets) {
      for (const renderMode of modes) {
        const { unmount } = render(
          <Interactive3DCanvas
            preset={preset}
            renderMode={renderMode}
            modelUrl="/models/sample.glb"
            height={360}
            scrollWeight={1.2}
          />
        );

        const stage = screen.getByTestId("interactive-3d-stage");
        expect(stage).toHaveAttribute("data-preset", preset);
        expect(stage).toHaveAttribute("data-render-mode", renderMode);
        unmount();
      }
    }
  });

  it("handles window scroll events and null 2d canvas context safely", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

    render(<Interactive3DCanvas scrollWeight={1.5} />);
    fireEvent.scroll(window, { target: { scrollY: 420 } });

    expect(screen.getByTestId("interactive-3d-stage")).toBeInTheDocument();
  });
});
