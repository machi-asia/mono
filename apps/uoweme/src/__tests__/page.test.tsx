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

import UOweMeHomePage, { metadata } from "@/app/page";

describe("U Owe Me Page", () => {
  it("exports canonical SEO metadata for uoweme.machi.asia", () => {
    expect(metadata.title).toContain("U Owe Me");
    expect(metadata.alternates?.canonical).toBe("https://uoweme.machi.asia/");
  });

  it("renders seeded ledger summary and allows logging a new IOU entry", () => {
    render(<UOweMeHomePage />);

    expect(screen.getByText("Peer IOU Ledger")).toBeInTheDocument();
    expect(screen.getByTestId("contact-balance-table")).toBeInTheDocument();
    expect(screen.getByText("Alyssa Reyes")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Log Expense \/ IOU/i }));
    fireEvent.change(screen.getByPlaceholderText(/Contact name/i), {
      target: { value: "Kenji Sato" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Reason \/ receipt memo/i), {
      target: { value: "Takoyaki run" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Entry/i }));

    expect(screen.getByText("Kenji Sato")).toBeInTheDocument();
  });
});
