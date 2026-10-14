import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ScrollReveal,
  ScrollStack,
  ScrollHorizontal,
  Parallax,
  ScrollZoom,
  ScrollCurtain,
  ScrollRotate,
  ScrollSplit,
  ScrollDepth,
} from "./index";

describe("Scroll Transitions Suite", () => {
  it("renders ScrollReveal with variant", () => {
    render(<ScrollReveal variant="fade-up" data-testid="reveal">Reveal Item</ScrollReveal>);
    expect(screen.getByTestId("reveal")).toBeInTheDocument();
    expect(screen.getByText("Reveal Item")).toBeInTheDocument();
  });

  it("renders ScrollStack cards", () => {
    render(
      <ScrollStack data-testid="stack">
        <div>Card 1</div>
        <div>Card 2</div>
      </ScrollStack>
    );
    expect(screen.getByTestId("stack")).toBeInTheDocument();
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
  });

  it("renders ScrollHorizontal slides and header", () => {
    render(
      <ScrollHorizontal
        header={<div>Featured Projects Header</div>}
        data-testid="horizontal"
      >
        <div>Slide 1</div>
        <div>Slide 2</div>
      </ScrollHorizontal>
    );
    expect(screen.getByTestId("horizontal")).toBeInTheDocument();
    expect(screen.getByText("Featured Projects Header")).toBeInTheDocument();
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("renders Parallax container", () => {
    render(
      <Parallax speed={0.4} data-testid="parallax">
        <div>Parallax Layer</div>
      </Parallax>
    );
    expect(screen.getByTestId("parallax")).toBeInTheDocument();
    expect(screen.getByText("Parallax Layer")).toBeInTheDocument();
  });

  it("renders ScrollZoom container", () => {
    render(
      <ScrollZoom mode="zoom-in" data-testid="zoom">
        <div>Zoom Content</div>
      </ScrollZoom>
    );
    expect(screen.getByTestId("zoom")).toBeInTheDocument();
    expect(screen.getByText("Zoom Content")).toBeInTheDocument();
  });

  it("renders ScrollCurtain container", () => {
    render(
      <ScrollCurtain curtain={<div>Curtain Label</div>} data-testid="curtain">
        <div>Hidden Content</div>
      </ScrollCurtain>
    );
    expect(screen.getByTestId("curtain")).toBeInTheDocument();
    expect(screen.getByText("Curtain Label")).toBeInTheDocument();
    expect(screen.getByText("Hidden Content")).toBeInTheDocument();
  });

  it("renders ScrollRotate container", () => {
    render(
      <ScrollRotate angle={90} data-testid="rotate">
        <div>Rotating Item</div>
      </ScrollRotate>
    );
    expect(screen.getByTestId("rotate")).toBeInTheDocument();
    expect(screen.getByText("Rotating Item")).toBeInTheDocument();
  });

  it("renders ScrollSplit parting doors", () => {
    render(
      <ScrollSplit panelA={<div>Door Left</div>} panelB={<div>Door Right</div>} data-testid="split">
        <div>Revealed Center</div>
      </ScrollSplit>
    );
    expect(screen.getByTestId("split")).toBeInTheDocument();
    expect(screen.getByText("Door Left")).toBeInTheDocument();
    expect(screen.getByText("Door Right")).toBeInTheDocument();
    expect(screen.getByText("Revealed Center")).toBeInTheDocument();
  });

  it("renders ScrollDepth 3D tunnel layers", () => {
    render(
      <ScrollDepth length={3} data-testid="depth">
        <div>Tunnel 1</div>
        <div>Tunnel 2</div>
      </ScrollDepth>
    );
    expect(screen.getByTestId("depth")).toBeInTheDocument();
    expect(screen.getByText("Tunnel 1")).toBeInTheDocument();
    expect(screen.getByText("Tunnel 2")).toBeInTheDocument();
  });
});
