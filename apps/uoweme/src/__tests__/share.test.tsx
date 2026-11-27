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

import ShareRootPage from "@/app/share/page";

describe("U Owe Me Share Page", () => {
  it("renders settlement statement decoded from URL query parameters", () => {
    render(<ShareRootPage />);
    expect(screen.getByText("Settlement Statement")).toBeInTheDocument();
    expect(screen.getByText(/Alyssa Reyes owes/i)).toBeInTheDocument();
    expect(screen.getByText("₱1,030.00")).toBeInTheDocument();
  });
});
