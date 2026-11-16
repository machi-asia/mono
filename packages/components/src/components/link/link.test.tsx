import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link, resolveHref, resolveAppHref } from "./link";

describe("Link", () => {
  it("renders with href", () => {
    render(<Link href="/about">About</Link>);
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
  });

  it("applies variant class", () => {
    render(<Link href="/" variant="underline">X</Link>);
    expect(screen.getByRole("link")).toHaveClass("m-link--underline");
  });

  it("opens external links in new tab", () => {
    render(<Link href="https://example.com" external>Ext</Link>);
    const link = screen.getByRole("link", { name: "Ext" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not add target for internal links", () => {
    render(<Link href="/internal">Int</Link>);
    const link = screen.getByRole("link", { name: "Int" });
    expect(link).not.toHaveAttribute("target");
  });

  it("rewrites Machi Asia and ItemList domain URLs to localhost ports when running locally", () => {
    // In jsdom test environment, window.location.hostname is "localhost"
    render(<Link href="https://rose.machi.asia/chat">Rose</Link>);
    const link = screen.getByRole("link", { name: "Rose" });
    expect(link).toHaveAttribute("href", "http://localhost:3004/chat");

    expect(resolveHref("https://calculator.machi-asia.com", { forceLocal: true })).toBe(
      "http://localhost:3001"
    );
    expect(resolveAppHref("docs", "/components", { forceLocal: true })).toBe(
      "http://localhost:3002/components"
    );
  });
});
