import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkillsSection from "./SkillsSection";

describe("SkillsSection", () => {
  it("renders skills section and tabs", () => {
    render(<SkillsSection />);
    expect(screen.getByRole("heading", { name: /My Skills/i })).toBeInTheDocument();
  });
});
