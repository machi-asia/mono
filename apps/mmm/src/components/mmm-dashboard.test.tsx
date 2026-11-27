import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

import { MmmDashboard } from "./mmm-dashboard";

describe("MmmDashboard", () => {
  it("filters mods by search query and switches to changelog timeline", () => {
    render(<MmmDashboard />);

    const search = screen.getByPlaceholderText(/Filter mods by name/i);
    fireEvent.change(search, { target: { value: "Lithium" } });

    expect(screen.getByTestId("mod-card-lithium")).toBeInTheDocument();
    expect(screen.queryByTestId("mod-card-sodium")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Changelog/i }));
    expect(screen.getByTestId("mod-history-timeline")).toBeInTheDocument();
  });

  it("opens Modrinth catalog modal and creates a new sandbox org", () => {
    render(<MmmDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /Browse Modrinth/i }));
    expect(screen.getByRole("dialog", { name: /Browse Modrinth Catalog/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Close modal/i }));

    fireEvent.click(screen.getByRole("button", { name: /New Organization/i }));
    const orgInput = screen.getByPlaceholderText(/Create SMP Season 4/i);
    fireEvent.change(orgInput, { target: { value: "Skyblock Lab" } });
    fireEvent.click(screen.getByRole("button", { name: /Create Modpack/i }));

    expect(
      screen.getByRole("heading", { name: "Skyblock Lab" })
    ).toBeInTheDocument();
  });
});
