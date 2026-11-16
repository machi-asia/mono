import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PresentationTestingPage from "./page";

describe("PresentationTestingPage", () => {
  it("renders all 7 Framer Motion presentation sections and interactive sandbox controls", () => {
    render(<PresentationTestingPage />);

    expect(
      screen.getByRole("heading", { name: /Presentation Transitions Playground/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /1\. PresentationPinnedSection/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /2\. PresentationHorizontal/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /3\. PresentationZoom/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /4\. PresentationCardStack/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /5\. PresentationSplit/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /6\. PresentationParallax/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /7\. PresentationPopOutCard/i })
    ).toBeInTheDocument();

    const springBtn = screen.getByRole("button", { name: /Smooth \(useSpring\)/i });
    fireEvent.click(springBtn);
    expect(screen.getByRole("button", { name: /Raw \(1:1 Scroll\)/i })).toBeInTheDocument();

    const zoomSelect = screen.getByLabelText(/Zoom Mode:/i);
    fireEvent.change(zoomSelect, { target: { value: "zoom-in" } });
    expect(zoomSelect).toHaveValue("zoom-in");
  });
});
