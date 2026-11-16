import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PresentationTestingPage, { metadata } from "./page";

describe("PresentationTestingPage route", () => {
  it("exports valid SEO metadata and renders the presentation playground", () => {
    expect(metadata.title).toBe("Framer Motion Presentation Suite");
    render(<PresentationTestingPage />);
    expect(
      screen.getByRole("heading", { name: /Presentation Transitions Playground/i })
    ).toBeInTheDocument();
  });
});
