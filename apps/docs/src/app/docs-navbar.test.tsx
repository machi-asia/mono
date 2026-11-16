import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MockAuthProvider } from "@mono/auth/mock";
import { DocsNavbar } from "./docs-navbar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs",
}));

describe("DocsNavbar", () => {
  it("renders Machi Asia Docs brand and navigation links via AuthNavbar", () => {
    render(
      <MockAuthProvider state="signed-in">
        <DocsNavbar />
      </MockAuthProvider>
    );

    expect(screen.getByText("Machi Asia Docs")).toBeInTheDocument();
    expect(screen.getByText("Docs Wiki")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Presentation")).toBeInTheDocument();
  });
});
