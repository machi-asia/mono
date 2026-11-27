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

import NotesHomePage, { metadata } from "@/app/page";

describe("Machi Notes Page", () => {
  it("exports canonical SEO metadata for notes.machi.asia", () => {
    expect(metadata.title).toContain("Machi Notes");
    expect(metadata.alternates?.canonical).toBe("https://notes.machi.asia/");
  });

  it("renders seeded notes workspace, live preview, and switches to graph view", () => {
    render(<NotesHomePage />);

    expect(screen.getByTestId("note-tree-list")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Architecture Hub")).toBeInTheDocument();
    expect(screen.getByTestId("note-markdown-preview")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Knowledge Graph$/i }));
    expect(screen.getByTestId("note-graph-view")).toBeInTheDocument();
  });
});
