import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { MockAuthProvider } from "@mono/auth/mock";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Home", () => {
  it("renders the heading and Rose AI interface", () => {
    render(
      <MockAuthProvider state="signed-in">
        <Home />
      </MockAuthProvider>
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Rose");
    expect(screen.getByText("Custom AI agent application")).toBeInTheDocument();
  });
});
