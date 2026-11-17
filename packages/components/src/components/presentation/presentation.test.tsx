import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  PresentationDeck,
  PresentationPinnedSection,
  PresentationHorizontal,
  PresentationZoom,
  PresentationCardStack,
  PresentationSplit,
  PresentationParallax,
  PresentationPopOutCard,
} from "./index";

describe("Framer Motion Presentation Suite", () => {
  it("renders PresentationDeck with progress bar and section nav dots", () => {
    const scrollIntoViewMock = vi.fn();
    const targetDiv = document.createElement("div");
    targetDiv.id = "sec-1";
    targetDiv.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(targetDiv);

    render(
      <PresentationDeck
        data-testid="deck"
        sections={[
          { id: "sec-1", label: "Pinned Section" },
          { id: "sec-2", label: "Horizontal Section" },
        ]}
      >
        <div>Deck Body</div>
      </PresentationDeck>
    );

    expect(screen.getByTestId("deck")).toBeInTheDocument();
    expect(screen.getByTestId("presentation-progress-bar")).toBeInTheDocument();
    expect(screen.getByText("Deck Body")).toBeInTheDocument();

    const navBtn = screen.getByLabelText("Jump to Pinned Section");
    fireEvent.click(navBtn);
    expect(scrollIntoViewMock).toHaveBeenCalled();

    document.body.removeChild(targetDiv);
  });

  it("renders PresentationPinnedSection with background and sequential steps", () => {
    render(
      <PresentationPinnedSection
        data-testid="pinned"
        background={<div>Locked Background Layer</div>}
        header={<div>Pinned Header</div>}
        steps={[
          {
            id: "s1",
            badge: "Step 01",
            title: "First Locked Step",
            description: "Description for step 1",
            visual: <div>Visual 1</div>,
          },
          {
            id: "s2",
            badge: "Step 02",
            title: "Second Locked Step",
            description: "Description for step 2",
          },
        ]}
      />
    );

    expect(screen.getByTestId("pinned")).toBeInTheDocument();
    expect(screen.getByText("Locked Background Layer")).toBeInTheDocument();
    expect(screen.getByText("Pinned Header")).toBeInTheDocument();
    expect(screen.getByText("First Locked Step")).toBeInTheDocument();
    expect(screen.getByText("Second Locked Step")).toBeInTheDocument();
  });

  it("renders PresentationHorizontal slides and header", () => {
    render(
      <PresentationHorizontal
        data-testid="horizontal"
        header={<div>Horizontal Gallery Header</div>}
      >
        <div>Horizontal Slide A</div>
        <div>Horizontal Slide B</div>
        <div>Horizontal Slide C</div>
      </PresentationHorizontal>
    );

    expect(screen.getByTestId("horizontal")).toBeInTheDocument();
    expect(screen.getByText("Horizontal Gallery Header")).toBeInTheDocument();
    expect(screen.getByText("Horizontal Slide A")).toBeInTheDocument();
    expect(screen.getByText("Horizontal Slide B")).toBeInTheDocument();
    expect(screen.getByText("Horizontal Slide C")).toBeInTheDocument();
  });

  it("renders PresentationZoom with portal mode and overlay", () => {
    render(
      <PresentationZoom
        data-testid="zoom"
        mode="portal"
        backdrop={<div>Portal Backdrop</div>}
        overlay={<div>Portal Revealed Overlay</div>}
      >
        <div>Zoom Frame Target</div>
      </PresentationZoom>
    );

    expect(screen.getByTestId("zoom")).toBeInTheDocument();
    expect(screen.getByText("Portal Backdrop")).toBeInTheDocument();
    expect(screen.getByText("Zoom Frame Target")).toBeInTheDocument();
    expect(screen.getByText("Portal Revealed Overlay")).toBeInTheDocument();
  });

  it("renders PresentationCardStack cards", () => {
    render(
      <PresentationCardStack data-testid="stack" smooth={false}>
        <div>Stack Card Alpha</div>
        <div>Stack Card Beta</div>
      </PresentationCardStack>
    );

    expect(screen.getByTestId("stack")).toBeInTheDocument();
    expect(screen.getByText("Stack Card Alpha")).toBeInTheDocument();
    expect(screen.getByText("Stack Card Beta")).toBeInTheDocument();
  });

  it("renders PresentationSplit shutter panels and revealed content", () => {
    render(
      <PresentationSplit
        data-testid="split"
        direction="horizontal"
        panelA={<div>Shutter Left</div>}
        panelB={<div>Shutter Right</div>}
      >
        <div>Center Stage Reveal</div>
      </PresentationSplit>
    );

    expect(screen.getByTestId("split")).toBeInTheDocument();
    expect(screen.getByText("Shutter Left")).toBeInTheDocument();
    expect(screen.getByText("Shutter Right")).toBeInTheDocument();
    expect(screen.getByText("Center Stage Reveal")).toBeInTheDocument();
  });

  it("renders PresentationParallax with multi-depth layers", () => {
    render(
      <PresentationParallax
        data-testid="parallax"
        layers={[
          { id: "bg", speed: -0.4, content: <div>Deep Starfield</div> },
          { id: "mid", speed: 0.3, scale: [0.95, 1.05], content: <div>Floating Nebula</div> },
        ]}
      >
        <div>Foreground Anchor</div>
      </PresentationParallax>
    );

    expect(screen.getByTestId("parallax")).toBeInTheDocument();
    expect(screen.getByText("Deep Starfield")).toBeInTheDocument();
    expect(screen.getByText("Floating Nebula")).toBeInTheDocument();
    expect(screen.getByText("Foreground Anchor")).toBeInTheDocument();
  });

  it("renders PresentationPopOutCard with two-halves layout (top image, bottom text and badge)", () => {
    render(
      <PresentationPopOutCard
        data-testid="popout"
        imageSrc="/images/popout-camera-sample.png"
        imageAlt="Triple Camera System"
        badge="Camera Innovation"
        title="Triple Camera Array"
        description="Out-of-bounds optical lens stack"
      >
        <div>Extra Card Action</div>
      </PresentationPopOutCard>
    );

    const card = screen.getByTestId("popout");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("Camera Innovation")).toBeInTheDocument();
    expect(screen.getByText("Triple Camera Array")).toBeInTheDocument();
    expect(screen.getByText("Out-of-bounds optical lens stack")).toBeInTheDocument();
    expect(screen.getByText("Extra Card Action")).toBeInTheDocument();

    const img = screen.getByAltText("Triple Camera System");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/popout-camera-sample.png");
    expect(img).toHaveStyle({ objectPosition: "center bottom" });

    const portalStage = card.querySelector(".mono-pres-popout-portal-stage");
    expect(portalStage).toBeInTheDocument();
    expect(portalStage).toHaveStyle({ marginBottom: "-8%" });
  });

  it("renders custom media node and preserves consumer mouse handlers in PresentationPopOutCard", () => {
    const onMouseLeave = vi.fn();

    render(
      <PresentationPopOutCard
        data-testid="popout-media"
        media={<div data-testid="custom-media">Custom Video Stage</div>}
        title="Custom Media Card"
        description="Supports video and interactive media overlays"
        onMouseLeave={onMouseLeave}
      />
    );

    const card = screen.getByTestId("popout-media");
    expect(screen.getByTestId("custom-media")).toBeInTheDocument();
    expect(screen.getByText("Custom Video Stage")).toBeInTheDocument();

    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });
    fireEvent.mouseLeave(card);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });
});
