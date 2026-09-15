import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import HomePage from "../app/page";
import { MockAuthProvider } from "@mono/auth/mock";

afterEach(() => {
  cleanup();
});

describe("HomePage (Game Directory Overview)", () => {
  it("renders the directory header and all supported games with image previews", () => {
    render(
      <MockAuthProvider state="signed-in">
        <HomePage />
      </MockAuthProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /Game Production Calculator/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Multi-Game Production Suite/i)).toBeInTheDocument();

    // Verify all game titles are displayed as links
    expect(screen.getByRole("heading", { level: 2, name: "Little Rocket Lab" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Vanilla Furniture Expanded - Factory" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Satisfactory" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Factorio" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Minecraft" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Dyson Sphere Program" })).toBeInTheDocument();

    // Check link hrefs
    expect(screen.getByRole("link", { name: /Open calculator for Little Rocket Lab/i })).toHaveAttribute("href", "/lrl");
    expect(screen.getByRole("link", { name: /Open calculator for Vanilla Furniture Expanded/i })).toHaveAttribute("href", "/vfe-factory");
  });
});