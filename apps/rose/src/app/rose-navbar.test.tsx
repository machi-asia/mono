import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RoseNavbar } from "./rose-navbar";
import { MockAuthProvider } from "@mono/auth/mock";

describe("RoseNavbar", () => {
  it("renders the floating brand, controls, and no page links", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const { container } = render(
      <MockAuthProvider state="signed-in">
        <RoseNavbar />
      </MockAuthProvider>
    );

    const roseAiTexts = screen.getAllByText("Rose AI");
    expect(roseAiTexts.length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector(".m-navbar--floating")).toBeInTheDocument();

    // Verify page links are removed
    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Docs" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Calculator" })).not.toBeInTheDocument();

    // Verify header controls are present
    const toggleBtn = screen.getByRole("button", { name: /conversations panel/i });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "rose:toggle-sidebar" }));

    const newChatBtn = screen.getByRole("button", { name: /Start new conversation/i });
    expect(newChatBtn).toBeInTheDocument();
    fireEvent.click(newChatBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "rose:new-conversation" }));

    const clearChatBtn = screen.getByRole("button", { name: /Reset active conversation/i });
    expect(clearChatBtn).toBeInTheDocument();
    fireEvent.click(clearChatBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "rose:clear-conversation" }));

    dispatchSpy.mockRestore();
  });
});
