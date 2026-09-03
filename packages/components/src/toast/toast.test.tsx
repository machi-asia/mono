import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "./toast";

function TestTrigger() {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast("success", "Saved!")}>
      trigger
    </button>
  );
}

describe("Toast", () => {
  it("shows a toast when triggered", () => {
    render(
      <ToastProvider>
        <TestTrigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("dismisses a toast on click", () => {
    render(
      <ToastProvider>
        <TestTrigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Saved!")).not.toBeInTheDocument();
  });

  it("throws when useToast is used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow("useToast must be used within a ToastProvider");
    spy.mockRestore();
  });
});
