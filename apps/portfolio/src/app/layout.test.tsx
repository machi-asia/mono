import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout, { metadata } from "./layout";

vi.mock("lenis", () => {
  return {
    default: class MockLenis {
      destroy = vi.fn();
      on = vi.fn();
      off = vi.fn();
    },
  };
});

describe("RootLayout", () => {
  it("defines metadata properly", () => {
    expect(metadata.title).toContain("Angelo Justine D. Kamachi");
  });

  it("renders layout structure", () => {
    const { container } = render(
      <RootLayout>
        <span data-testid="child-node">Child Content</span>
      </RootLayout>
    );
    expect(screen.getByTestId("child-node")).toBeInTheDocument();
    expect(container).toBeDefined();
  });
});
