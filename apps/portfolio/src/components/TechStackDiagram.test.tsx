import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TechStackDiagram from "./TechStackDiagram";
import { techStackNodes } from "../data/tech-stack";

describe("TechStackDiagram", () => {
  it("renders svg architecture diagram with nodes", () => {
    const activeCategories = new Set(techStackNodes.map((n) => n.category));
    const { getByTestId } = render(
      <TechStackDiagram
        activeCategories={activeCategories}
        hoveredTech={null}
        setHoveredTech={() => {}}
        selectedTech={null}
        onSelectTech={() => {}}
      />
    );
    expect(getByTestId("techstack-diagram-svg")).toBeInTheDocument();
  });
});
