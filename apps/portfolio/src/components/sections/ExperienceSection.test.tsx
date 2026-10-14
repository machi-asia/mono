import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExperienceSection from "./ExperienceSection";
import { workCompanies } from "../../data/experience";

describe("ExperienceSection", () => {
  it("renders work experience companies and role details", () => {
    render(
      <ExperienceSection
        workCompanies={workCompanies}
      />
    );
    expect(screen.getByRole("heading", { name: /Work Experience/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Full Stack Engineering Intern/i).length).toBeGreaterThan(0);
  });
});
