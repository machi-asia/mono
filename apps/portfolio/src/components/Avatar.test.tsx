import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("renders with fallback initials when src is not provided", () => {
    render(<Avatar fallback="AJ" alt="Angelo" />);
    expect(screen.getByText("AJ")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(<Avatar src="/images/standard-cut-hero.webp" alt="Angelo" fallback="AJ" />);
    const img = screen.getByRole("img", { name: "Angelo" });
    expect(img).toBeInTheDocument();
  });
});
