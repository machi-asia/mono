import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "./datepicker";

describe("DatePicker", () => {
  it("renders the current month and year", () => {
    render(<DatePicker />);
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    expect(screen.getByText(new RegExp(`${month} ${now.getFullYear()}`))).toBeInTheDocument();
  });

  it("navigates to next month", () => {
    render(<DatePicker value="2026-01-15" />);
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(screen.getByText(/February 2026/)).toBeInTheDocument();
  });

  it("navigates to previous month", () => {
    render(<DatePicker value="2026-03-15" />);
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(screen.getByText(/February 2026/)).toBeInTheDocument();
  });

  it("calls onChange when a day is clicked", () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-06-01" onChange={handleChange} />);
    fireEvent.click(screen.getByText("15"));
    expect(handleChange).toHaveBeenCalledWith("2026-06-15");
  });

  it("disables days outside min/max range", () => {
    render(<DatePicker value="2026-06-15" min="2026-06-10" max="2026-06-20" />);
    expect(screen.getByText("9")).toBeDisabled();
    expect(screen.getByText("21")).toBeDisabled();
    expect(screen.getByText("15")).not.toBeDisabled();
  });

  it("accepts a typed date", () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-06-01" onChange={handleChange} />);
    const input = screen.getByLabelText("Date");
    fireEvent.change(input, { target: { value: "2026-12-25" } });
    expect(handleChange).toHaveBeenCalledWith("2026-12-25");
    expect(screen.getByText(/December 2026/)).toBeInTheDocument();
  });

  it("ignores an invalid typed date", () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-06-01" onChange={handleChange} />);
    const input = screen.getByLabelText("Date");
    fireEvent.change(input, { target: { value: "2026-13-99" } });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
