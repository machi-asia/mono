import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Input from "./Input";

describe("Input", () => {
  it("renders input and handles change events", () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Enter your name" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(input, { target: { value: "Angelo" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies error class when error is true", () => {
    const { container } = render(<Input error placeholder="Error field" />);
    expect(container.querySelector(".input-field-error")).toBeInTheDocument();
  });
});
