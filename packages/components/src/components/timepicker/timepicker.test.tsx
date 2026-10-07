import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimePicker } from "./timepicker";

describe("TimePicker", () => {
  it("renders hour and minute values", () => {
    render(<TimePicker value="09:30" />);
    expect((screen.getByLabelText("Hour") as HTMLInputElement).value).toBe("09");
    expect((screen.getByLabelText("Minute") as HTMLInputElement).value).toBe("30");
  });

  it("selects an hour from the dropdown in 24h mode", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="09:00" use24Hour onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText("Hour options"));
    fireEvent.mouseDown(screen.getByText("15"));
    expect(handleChange).toHaveBeenCalledWith("15:00");
  });

  it("selects a minute from the dropdown", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="09:00" onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText("Minute options"));
    fireEvent.mouseDown(screen.getByText("30"));
    expect(handleChange).toHaveBeenCalledWith("09:30");
  });

  it("toggles AM/PM in 12h mode", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="14:00" onChange={handleChange} />);
    fireEvent.click(screen.getByText("AM"));
    expect(handleChange).toHaveBeenCalledWith("02:00");
  });

  it("does not show period in 24h mode", () => {
    render(<TimePicker value="14:00" use24Hour />);
    expect(screen.queryByText("PM")).not.toBeInTheDocument();
    expect(screen.queryByText("AM")).not.toBeInTheDocument();
  });

  it("accepts typed hour in 24h mode", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="09:00" use24Hour onChange={handleChange} />);
    const input = screen.getByLabelText("Hour");
    fireEvent.change(input, { target: { value: "18" } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith("18:00");
  });

  it("accepts typed hour in 12h mode respecting period", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="09:00" onChange={handleChange} />);
    const input = screen.getByLabelText("Hour");
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith("03:00");
  });

  it("accepts typed minute", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="09:00" onChange={handleChange} />);
    const input = screen.getByLabelText("Minute");
    fireEvent.change(input, { target: { value: "45" } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith("09:45");
  });

  it("reverts on an invalid typed value", () => {
    const handleChange = vi.fn();
    render(<TimePicker value="09:00" use24Hour onChange={handleChange} />);
    const input = screen.getByLabelText("Hour");
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.blur(input);
    expect(handleChange).not.toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("09");
  });
});
