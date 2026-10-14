import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dialog from "./Dialog";

describe("Dialog", () => {
  it("renders dialog when open is true", () => {
    const handleOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={handleOpenChange} title="Modal Title">
        <p>Modal content</p>
      </Dialog>
    );
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not render when open is false", () => {
    render(
      <Dialog open={false} onOpenChange={vi.fn()} title="Hidden Title">
        <p>Hidden content</p>
      </Dialog>
    );
    expect(screen.queryByText("Hidden Title")).not.toBeInTheDocument();
  });
});
