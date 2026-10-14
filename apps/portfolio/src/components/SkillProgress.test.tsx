import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkillProgress from "./SkillProgress";

describe("SkillProgress", () => {
  it("renders skill name and calculated level", () => {
    render(<SkillProgress name="TypeScript" years={5} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Expert")).toBeInTheDocument();
  });
});
