import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Button variant="secondary">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("m-btn--secondary");
  });

  it("applies size class", () => {
    render(<Button size="lg">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("m-btn--lg");
  });

  it("disables when disabled prop is true", () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables and shows spinner when loading", () => {
    render(<Button loading>X</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("m-btn--loading");
    expect(btn.querySelector(".m-btn-spinner")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>X</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>X</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
