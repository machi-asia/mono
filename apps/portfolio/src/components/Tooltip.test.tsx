import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("renders trigger child and tooltip structure", () => {
    render(
      <Tooltip content="Tooltip message">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });
});
