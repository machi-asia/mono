import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGate } from "../auth-gate";

const mockUseAuth = vi.fn();

vi.mock("../provider", () => ({
  useAuth: () => mockUseAuth(),
}));

function MockChild() {
  return <main>protected content</main>;
}

describe("AuthGate", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("shows a loading state while the session is loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      isLoading: true,
      isGuest: false,
    });
    render(
      <AuthGate>
        <MockChild />
      </AuthGate>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("shows the sign-in modal when there is no user", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      isGuest: false,
    });
    render(
      <AuthGate>
        <MockChild />
      </AuthGate>
    );
    expect(screen.getByRole("dialog", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders children when a user is signed in", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1" },
      session: { user: { id: "1" } },
      isLoading: false,
      isGuest: true,
    });
    render(
      <AuthGate>
        <MockChild />
      </AuthGate>
    );
    expect(screen.getByText("protected content")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
