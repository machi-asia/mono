import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

const links = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer copyright="2026 Machi Asia" />);
    expect(screen.getByText("2026 Machi Asia")).toBeInTheDocument();
  });

  it("renders footer links", () => {
    render(<Footer links={links} />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("renders children in the extra slot", () => {
    render(<Footer><p>Custom content</p></Footer>);
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });
});
