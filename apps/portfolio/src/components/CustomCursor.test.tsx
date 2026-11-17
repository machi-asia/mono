import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import CustomCursorDefault, { CustomCursor } from "./CustomCursor";

describe("CustomCursor", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it("exports both named and default CustomCursor components", () => {
    expect(CustomCursor).toBeDefined();
    expect(CustomCursorDefault).toBe(CustomCursor);
  });

  it("renders default 14px reticle with difference blend mode and invert backdrop filter", () => {
    render(<CustomCursor />);

    const cursor = screen.getByTestId("custom-cursor");
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveAttribute("data-active", "false");
    expect(cursor).toHaveAttribute("data-size", "14");
    expect(cursor.style.position).toBe("fixed");
    expect(cursor.style.pointerEvents).toBe("none");
    expect(cursor.style.mixBlendMode).toBe("difference");
    expect(
      cursor.style.backdropFilter || cursor.style.getPropertyValue("backdrop-filter")
    ).toBe("invert(1)");
  });

  it("morphs into an 84px lens and shows uppercase data-cursor label on pointermove", () => {
    render(
      <div>
        <CustomCursor />
        <div data-cursor="drag 3d" data-testid="drag-zone">
          <span>Inner Target</span>
        </div>
        <div data-cursor-invert="true" data-testid="invert-zone">
          Invert Area
        </div>
        <div data-testid="neutral-zone">Neutral Area</div>
      </div>
    );

    const cursor = screen.getByTestId("custom-cursor");

    // Hover nested child inside [data-cursor="drag 3d"]
    fireEvent.pointerMove(screen.getByText("Inner Target"), {
      clientX: 160,
      clientY: 220,
    });

    expect(cursor).toHaveAttribute("data-active", "true");
    expect(cursor).toHaveAttribute("data-size", "84");
    expect(screen.getByTestId("custom-cursor-label")).toHaveTextContent("DRAG 3D");

    // Hover [data-cursor-invert]
    fireEvent.pointerMove(screen.getByTestId("invert-zone"), {
      clientX: 280,
      clientY: 300,
    });

    expect(cursor).toHaveAttribute("data-active", "true");
    expect(cursor).toHaveAttribute("data-size", "84");
    expect(screen.getByTestId("custom-cursor-label")).toHaveTextContent("INVERT");

    // Move back to neutral surface
    fireEvent.pointerMove(screen.getByTestId("neutral-zone"), {
      clientX: 50,
      clientY: 50,
    });

    expect(cursor).toHaveAttribute("data-active", "false");
    expect(cursor).toHaveAttribute("data-size", "14");
    expect(screen.queryByTestId("custom-cursor-label")).not.toBeInTheDocument();
  });

  it("disables cleanly when pointer is coarse", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("pointer: coarse"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<CustomCursor />);
    expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
  });

  it("guards missing window.matchMedia safely", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: undefined,
    });

    render(<CustomCursor />);
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
  });
});
