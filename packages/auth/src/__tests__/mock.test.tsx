import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGate } from "../auth-gate";
import { SignInModal } from "../sign-in-modal";
import { MockAuthProvider } from "../mock";

function MockChild() {
  return <main>protected content</main>;
}

describe("MockAuthProvider", () => {
  it("renders the sign-in modal in the signed-out state", () => {
    render(
      <MockAuthProvider state="signed-out">
        <AuthGate>
          <MockChild />
        </AuthGate>
      </MockAuthProvider>
    );
    expect(screen.getByRole("dialog", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders children in the signed-in state", () => {
    render(
      <MockAuthProvider state="signed-in">
        <AuthGate>
          <MockChild />
        </AuthGate>
      </MockAuthProvider>
    );
    expect(screen.getByText("protected content")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders gated children for the guest state", () => {
    render(
      <MockAuthProvider state="guest">
        <AuthGate>
          <MockChild />
        </AuthGate>
      </MockAuthProvider>
    );
    expect(screen.getByText("protected content")).toBeInTheDocument();
  });

  it("reports isLoading in the loading state", () => {
    render(
      <MockAuthProvider state="loading">
        <AuthGate>
          <MockChild />
        </AuthGate>
      </MockAuthProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders the SignInModal live against the mock context", () => {
    render(
      <MockAuthProvider state="signed-out">
        <SignInModal />
      </MockAuthProvider>
    );
    expect(screen.getByRole("button", { name: "Continue as Guest" })).toBeInTheDocument();
  });
});
