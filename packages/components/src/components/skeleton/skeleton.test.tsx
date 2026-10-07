import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
  SkeletonCard,
} from "./skeleton";

describe("Skeleton components", () => {
  it("renders default text skeleton with proper attributes", () => {
    render(<Skeleton data-testid="skel-default" />);
    const el = screen.getByTestId("skel-default");
    expect(el).toBeDefined();
    expect(el.className).toContain("m-skeleton");
    expect(el.className).toContain("m-skeleton--text");
    expect(el.className).toContain("m-skeleton--pulse");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-busy")).toBe("true");
  });

  it("renders with custom variant and animation", () => {
    render(
      <Skeleton
        variant="circular"
        animation="wave"
        width={48}
        height={48}
        data-testid="skel-custom"
      />
    );
    const el = screen.getByTestId("skel-custom");
    expect(el.className).toContain("m-skeleton--circular");
    expect(el.className).toContain("m-skeleton--wave");
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
  });

  it("renders multiple skeleton elements when count > 1", () => {
    render(<Skeleton count={4} data-testid="skel-item" />);
    const group = screen.getByRole("status");
    expect(group.className).toContain("m-skeleton-group");
    const items = screen.getAllByTestId("skel-item");
    expect(items).toHaveLength(4);
  });

  it("renders SkeletonText with specified line count and varying last line width", () => {
    render(<SkeletonText lines={4} lastLineWidth="40%" />);
    const group = screen.getByRole("status");
    expect(group.getAttribute("data-mono")).toBe("skeleton-text");
    const skeletons = group.querySelectorAll(".m-skeleton--text");
    expect(skeletons).toHaveLength(4);
    expect((skeletons[3] as HTMLElement).style.width).toBe("40%");
  });

  it("renders SkeletonCircle with size", () => {
    render(<SkeletonCircle size={56} />);
    const circle = screen.getByRole("status");
    expect(circle.className).toContain("m-skeleton--circular");
    expect(circle.style.width).toBe("56px");
    expect(circle.style.height).toBe("56px");
  });

  it("renders SkeletonButton with sizes", () => {
    render(<SkeletonButton size="lg" width={150} />);
    const btn = screen.getByRole("status");
    expect(btn.className).toContain("m-skeleton-button--lg");
    expect(btn.style.width).toBe("150px");
  });

  it("renders SkeletonCard with image, header, avatar, and actions", () => {
    render(
      <SkeletonCard
        hasImage
        hasHeader
        hasAvatar
        lines={2}
        hasActions
      />
    );
    const card = screen.getByRole("status");
    expect(card.getAttribute("data-mono")).toBe("skeleton-card");
    expect(card.querySelector(".m-skeleton-card-header")).toBeDefined();
    expect(card.querySelector(".m-skeleton-card-body")).toBeDefined();
    expect(card.querySelector(".m-skeleton-card-actions")).toBeDefined();
  });
});
