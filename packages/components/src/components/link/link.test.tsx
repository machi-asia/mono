import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "./link";

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
});
