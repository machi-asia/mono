import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders footer with contact button and triggers callback", () => {
    const handleContact = vi.fn();
    render(<Footer onContactOpen={handleContact} />);
    expect(screen.getByText("Let's Work Together")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Start a Conversation" });
    fireEvent.click(btn);
    expect(handleContact).toHaveBeenCalled();
  });
});
