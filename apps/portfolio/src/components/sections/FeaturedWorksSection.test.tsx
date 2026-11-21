import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FeaturedWorksSection from "./FeaturedWorksSection";
import { featuredWorks } from "../../data/featured-works";

describe("FeaturedWorksSection", () => {
  it("renders featured works heading, subtitle, and all works inside standard carousel cards", () => {
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

    // PresentationPopOutCard is no longer used
    expect(
      container.querySelectorAll('[data-mono="presentation-popout-card"]')
    ).toHaveLength(0);

    const cards = container.querySelectorAll(".featured-card");
    expect(cards).toHaveLength(featuredWorks.length);

    for (const work of featuredWorks) {
      expect(screen.getByTestId(`featured-card-${work.id}`)).toBeInTheDocument();
      expect(screen.getByText(work.title)).toBeInTheDocument();
      expect(
        screen.getByText(work.description.split("\n\n")[0])
      ).toBeInTheDocument();
      for (const tag of work.tags) {
        expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
      }
    }

    const viewLinks = screen.getAllByRole("link", { name: /View Project/i });
    const worksWithLinks = featuredWorks.filter((w) => Boolean(w.link));
    expect(viewLinks).toHaveLength(worksWithLinks.length);
    for (const work of worksWithLinks) {
      expect(
        viewLinks.some((link) => link.getAttribute("href") === work.link)
      ).toBe(true);
    }
  });

  it("renders always-playing muted looping videos without click-to-expand overlay or dialog", () => {
    const { container } = render(
      <FeaturedWorksSection featuredWorks={featuredWorks} />
    );

    expect(screen.queryByText(/Click to expand/i)).not.toBeInTheDocument();
    expect(container.querySelector(".featured-video-overlay")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const videos = container.querySelectorAll("video.featured-video");
    expect(videos).toHaveLength(featuredWorks.length);

    videos.forEach((video, idx) => {
      const videoEl = video as HTMLVideoElement;
      expect(videoEl).toHaveAttribute("src", featuredWorks[idx].videoUrl);
      expect(videoEl).toHaveAttribute("autoplay");
      expect(videoEl).toHaveAttribute("loop");
      expect(videoEl).toHaveAttribute("playsinline");
      expect(videoEl.muted).toBe(true);
    });
  });
});
