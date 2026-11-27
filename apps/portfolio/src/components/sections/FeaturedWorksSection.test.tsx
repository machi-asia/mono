import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import FeaturedWorksSection from "./FeaturedWorksSection";
import { featuredWorks } from "../../data/featured-works";

describe("FeaturedWorksSection", () => {
  afterEach(() => {
    cleanup();
  });
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

    expect(
      featuredWorks.find((w) => w.title === "TerraPrice")
    ).toMatchObject({
      videoUrl: "/videos/TerraPrice.mp4",
      link: "https://terraprice.machi.asia",
    });
    expect(featuredWorks.find((w) => w.title === "ItemList")).toMatchObject({
      videoUrl: "/videos/ItemList.mp4",
      link: "https://itemlist.online",
    });
    expect(
      featuredWorks.find((w) => w.title === "Smarter Home")
    ).toMatchObject({
      videoUrl: "/videos/SmarterHome.mp4",
      link: "https://github.com/kamachi-dev/smarter-home",
    });
    expect(featuredWorks.find((w) => w.title === "MMM")).toMatchObject({
      videoUrl: "/videos/MMM.mp4",
      link: "https://mmm.machi.asia",
    });
    expect(
      featuredWorks.find((w) => w.title === "Machi Notes")
    ).toMatchObject({
      videoUrl: "/videos/Notes.mp4",
      link: "https://notes.machi.asia",
    });
    expect(featuredWorks.find((w) => w.title === "U Owe Me")).toMatchObject({
      videoUrl: "/videos/UOweMe.mp4",
      link: "https://uoweme.machi.asia",
    });
    expect(featuredWorks.find((w) => w.title === "Rose AI")).toMatchObject({
      videoUrl: "/videos/Rose.mp4",
      link: "https://rose.machi.asia",
    });
  });

  it("renders always-playing muted looping preview videos on carousel cards without click-to-expand overlay", () => {
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

  it("opens modal with expanded video and in-depth markdown explanation when clicking a card, and closes via Close button", () => {
    render(<FeaturedWorksSection featuredWorks={featuredWorks} />);

    const targetWork = featuredWorks.find((w) => w.title === "TerraPrice")!;
    const card = screen.getByTestId(`featured-card-${targetWork.id}`);

    fireEvent.click(card);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: targetWork.title })
    ).toBeInTheDocument();

    const expandedVideo = dialog.querySelector(
      "video.featured-video-expanded"
    ) as HTMLVideoElement;
    expect(expandedVideo).toBeInTheDocument();
    expect(expandedVideo).toHaveAttribute("src", targetWork.videoUrl);
    expect(expandedVideo).toHaveAttribute("controls");
    expect(expandedVideo).toHaveAttribute("autoplay");
    expect(expandedVideo).toHaveAttribute("loop");
    expect(expandedVideo).toHaveAttribute("playsinline");

    // In-depth explanation rendered via MarkdownRenderer
    expect(
      within(dialog).getByText(/Overview & Architecture/i)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Hybrid Spatial AI/i)
    ).toBeInTheDocument();

    // Close button dismisses the modal
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens modal on Enter/Space keydown on a card and stops propagation when clicking View Project link", () => {
    render(<FeaturedWorksSection featuredWorks={featuredWorks} />);

    const firstWork = featuredWorks[0];
    const card = screen.getByTestId(`featured-card-${firstWork.id}`);
    const cardLink = within(card).getByRole("link", { name: /View Project/i });

    fireEvent.click(cardLink);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(card, { key: "Enter" });
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: firstWork.title })
    ).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(card, { key: " " });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
