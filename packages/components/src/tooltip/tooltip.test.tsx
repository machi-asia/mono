import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  it("shows content on hover", () => {
    render(
      <Tooltip content="Hint text">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Hover me" }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hint text");
  });

  it("hides content on mouse leave", async () => {
    render(
      <Tooltip content="Hint">
        <button type="button">X</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("applies position class", () => {
    render(
      <Tooltip content="T" position="bottom">
        <button type="button">X</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toHaveClass("m-tooltip--bottom");
  });
});
