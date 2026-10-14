import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExperienceDiagram from "./ExperienceDiagrams";

describe("ExperienceDiagrams", () => {
  it("renders business-tools diagram correctly", () => {
    const { container } = render(<ExperienceDiagram type="business-tools" variant="compact" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders redis-sessions diagram correctly", () => {
    const { container } = render(<ExperienceDiagram type="redis-sessions" variant="detailed" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
