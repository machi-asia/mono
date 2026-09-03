import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Popup } from "./popup";

afterEach(() => {
  vi.useRealTimers();
});

describe("Popup", () => {
  it("shows content when trigger is clicked", () => {
    render(
      <Popup trigger={<button type="button">Open</button>}>
        <p>Popup content</p>
      </Popup>
    );
    expect(screen.queryByText("Popup content")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Popup content")).toBeInTheDocument();
  });

  it("closes when clicking outside", () => {
    vi.useFakeTimers();
    render(
      <div>
        <Popup trigger={<button type="button">Open</button>}>
          <p>Content</p>
        </Popup>
        <p>Outside</p>
      </div>
    );
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Content")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText("Outside"));
    expect(screen.getByText("Content")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });
});
