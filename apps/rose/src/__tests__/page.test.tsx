import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { MockAuthProvider } from "@mono/auth/mock";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Home", () => {
  it("renders the Rose AI interface with input and conversation area", () => {
    const { container } = render(
      <MockAuthProvider state="signed-in">
        <Home />
      </MockAuthProvider>
    );
    expect(container.querySelector(".m-rose-chat-container")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message Rose/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send message/i })).toBeInTheDocument();
  });
});
