import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SignInModal } from "./sign-in-modal";
import { MockAuthProvider } from "../mock/mock";

describe("SignInModal", () => {
  it("renders all sign in options and guest button", () => {
    render(
      <MockAuthProvider state="signed-out">
        <SignInModal />
      </MockAuthProvider>
    );

    expect(screen.getByRole("heading", { name: "Welcome to Machi Asia" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue with GitHub" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue as Guest" })).toBeInTheDocument();
  });

  it("toggles between sign in and sign up modes", () => {
    render(
      <MockAuthProvider state="signed-out">
        <SignInModal />
      </MockAuthProvider>
    );

    const toggleBtn = screen.getByRole("button", { name: "Don't have an account? Register" });
    fireEvent.click(toggleBtn);

    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Already have an account? Sign in" })).toBeInTheDocument();
  });

  it("renders close button and invokes onClose callback", () => {
    const handleClose = vi.fn();
    render(
      <MockAuthProvider state="signed-out">
        <SignInModal onClose={handleClose} />
      </MockAuthProvider>
    );

    const closeBtn = screen.getByRole("button", { name: "Close" });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
