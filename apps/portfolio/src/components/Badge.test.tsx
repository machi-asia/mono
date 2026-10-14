import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders badge children and variant classes", () => {
    const { container } = render(<Badge variant="default" size="sm">Available</Badge>);
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(container.querySelector(".badge-default")).toBeInTheDocument();
  });
});
