import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("renders text skeleton", () => {
    const { container } = render(<Skeleton variant="text" lines={2} />);
    expect(container.querySelector('[data-mono="skeleton-text"]')).toBeInTheDocument();
  });

  it("renders card skeleton", () => {
    const { container } = render(<Skeleton variant="card" lines={3} />);
    expect(container.querySelector('[data-mono="skeleton-card"]')).toBeInTheDocument();
  });

  it("renders circular skeleton", () => {
    const { container } = render(<Skeleton variant="circle" width={40} height={40} />);
    expect(container.querySelector('.m-skeleton--circular')).toBeInTheDocument();
  });
});
