import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FetchBoundary from "./FetchBoundary";

describe("FetchBoundary", () => {
  it("renders loading state when loading is true", () => {
    const { container } = render(
      <FetchBoundary loading={true}>
        <div>Loaded Content</div>
      </FetchBoundary>
    );
    expect(screen.queryByText("Loaded Content")).not.toBeInTheDocument();
    expect(container.querySelector('[data-mono="skeleton-card"]')).toBeInTheDocument();
  });

  it("renders children when not loading", () => {
    render(
      <FetchBoundary loading={false}>
        <div>Loaded Content</div>
      </FetchBoundary>
    );
    expect(screen.getByText("Loaded Content")).toBeInTheDocument();
  });
});
