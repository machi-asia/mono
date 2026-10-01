import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "../app/page";
import PortfolioPage from "../app/portfolio/page";

afterEach(() => {
  cleanup();
});

// Mock auth hook with partial original mock
vi.mock("@mono/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mono/auth")>();
  return {
    ...actual,
    useAuth: () => ({
      user: { email: "tester@machi-asia.com", user_metadata: { name: "Test User" } },
      signOut: vi.fn(),
    }),
    AccountSettings: () => null,
  };
});

describe("Machi Asia Landing Page", () => {
  it("renders the hero heading and main products", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Modern Applications/i);
    expect(
      screen.getByRole("heading", { level: 3, name: "Game Production Calculator" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Rose AI" })
    ).toBeInTheDocument();
  });

  it("renders subscription pricing options", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Subscription Upgrades/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Pro Builder")).toBeInTheDocument();
    expect(screen.getByText("Studio / Team")).toBeInTheDocument();
  });
});

describe("Portfolio Landing Page", () => {
  it("renders portfolio hero and projects", () => {
    render(<PortfolioPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Building Software with Elegance & Precision/i
    );
    expect(screen.getByText(/Featured Works & Case Studies/i)).toBeInTheDocument();
    expect(screen.getByText("Technical Expertise")).toBeInTheDocument();
  });
});
