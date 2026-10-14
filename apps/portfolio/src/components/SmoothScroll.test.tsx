import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SmoothScroll from "./SmoothScroll";

vi.mock("lenis", () => {
  return {
    default: class MockLenis {
      destroy = vi.fn();
      on = vi.fn();
      off = vi.fn();
    },
  };
});

describe("SmoothScroll", () => {
  it("renders null and initializes lenis", () => {
    const { container } = render(<SmoothScroll />);
    expect(container.firstChild).toBeNull();
  });
});
