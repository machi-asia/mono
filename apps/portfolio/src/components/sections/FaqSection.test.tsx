import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FaqSection from "./FaqSection";

describe("FaqSection", () => {
  it("renders FAQ section and accordion triggers", () => {
    render(<FaqSection />);
    expect(screen.getByRole("heading", { name: /Frequently Asked Questions/i })).toBeInTheDocument();
  });
});
