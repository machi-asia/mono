import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import Button from "./Button";

describe("Button", () => {
  afterEach(cleanup);

  it("renders button and triggers onClick", () => {
    const handleClick = vi.fn();
    render(<Button variant="primary" onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when loading is true", () => {
    render(<Button variant="primary" loading>Submit</Button>);
    const btn = screen.getByRole("button", { name: /submit/i });
    expect(btn).toBeDisabled();
  });
});
