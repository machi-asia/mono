import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeroSection from "./HeroSection";
import { certificatesData } from "../../data/certificates";
import { workCompanies } from "../../data/experience";

describe("HeroSection", () => {
  it("renders hero introduction and name", () => {
    render(
      <HeroSection
        onContactOpen={vi.fn()}
        repos={[]}
        certificates={certificatesData}
        workCompanies={workCompanies}
      />
    );
    expect(screen.getByText("Angelo Justine D. Kamachi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get in Touch" })).toBeInTheDocument();
  });
});
