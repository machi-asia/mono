import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { UnderDevelopmentModal } from "./under-development-modal";

afterEach(() => {
  cleanup();
});

describe("UnderDevelopmentModal", () => {
  it("renders open by default with the under-development message and portfolio link", () => {
    render(<UnderDevelopmentModal />);

    const dialog = screen.getByRole("dialog", { name: /Under Development/i });
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByText(
        /It appears this page is still under development\. If you wish to find my portfolio, please click the button below\./i
      )
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /portfolio\.machi\.asia/i });
    expect(link).toHaveAttribute("href", "https://portfolio.machi.asia");
  });

  it("closes when clicking the close button", () => {
    render(<UnderDevelopmentModal />);

    fireEvent.click(screen.getByRole("button", { name: /Close modal/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when pressing Escape", () => {
    render(<UnderDevelopmentModal />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when clicking the backdrop, but stays open when clicking the dialog", () => {
    const { container } = render(<UnderDevelopmentModal />);

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = container.querySelector(".machi-modal-backdrop");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
