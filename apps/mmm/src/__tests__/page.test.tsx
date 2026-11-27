import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@mono/auth", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isLoading: false,
    isGuest: true,
    role: "guest",
    signOut: vi.fn(),
    accounts: [],
    switchAccount: vi.fn(),
  }),
  AuthNavbar: ({ brand }: { brand?: ReactNode }) => <nav data-testid="auth-navbar">{brand}</nav>,
  SignInModal: () => <div data-testid="sign-in-modal" />,
}));

import MmmHomePage, { metadata } from "@/app/page";

describe("MMM Page", () => {
  it("exports canonical SEO metadata for mmm.machi.asia", () => {
    expect(metadata.title).toContain("Minecraft Mod Manager");
    expect(metadata.alternates?.canonical).toBe("https://mmm.machi.asia/");
  });

  it("renders the seeded Machi Nexus SMP modpack dashboard", () => {
    render(<MmmHomePage />);
    expect(
      screen.getByRole("heading", { name: "Machi Nexus SMP" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("mod-card-sodium")).toBeInTheDocument();
    expect(screen.getByTestId("mod-card-iris")).toBeInTheDocument();
  });
});
