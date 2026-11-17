import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FeaturedWorksSection from "./FeaturedWorksSection";
import { featuredWorks } from "../../data/featured-works";

describe("FeaturedWorksSection", () => {
  it("renders featured works heading, subtitle, and all works inside PresentationPopOutCard carousel", () => {
    const { container } = render(
      <FeaturedWorksSection featuredWorks={featuredWorks} />
    );

    expect(
      screen.getByRole("heading", { name: /Featured Works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Showcase of my best projects with video demos/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();

    const popoutCards = container.querySelectorAll(
      '[data-mono="presentation-popout-card"]'
    );
    expect(popoutCards).toHaveLength(featuredWorks.length);

    for (const work of featuredWorks) {
      expect(screen.getByText(work.title)).toBeInTheDocument();
    }
  });

  it("opens inspection dialog with expanded video and View Project link when a pop-out card is clicked", () => {
    const { container } = render(
      <FeaturedWorksSection featuredWorks={featuredWorks} />
    );

    const popoutCards = container.querySelectorAll(
      '[data-mono="presentation-popout-card"]'
    );
    fireEvent.click(popoutCards[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const expandedVideo = dialog.querySelector("video.featured-video-expanded");
    expect(expandedVideo).toBeInTheDocument();
    expect(expandedVideo).toHaveAttribute("src", featuredWorks[0].videoUrl);

    const viewLinks = screen.getAllByRole("link", { name: /View Project/i });
    expect(viewLinks.some((link) => link.getAttribute("href") === featuredWorks[0].link)).toBe(
      true
    );
  });
});
