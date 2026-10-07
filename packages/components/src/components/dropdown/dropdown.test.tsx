import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dropdown } from "./dropdown";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry", disabled: true },
];

describe("Dropdown", () => {
  it("renders placeholder when no value is selected", () => {
    render(<Dropdown items={items} />);
    expect(screen.getByRole("button")).toHaveTextContent("Select...");
  });

  it("shows selected item label", () => {
    render(<Dropdown items={items} value="banana" />);
    expect(screen.getByRole("button")).toHaveTextContent("Banana");
  });

  it("opens menu on click and shows items", () => {
    render(<Dropdown items={items} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onChange when an item is clicked", () => {
    const handleChange = vi.fn();
    render(<Dropdown items={items} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Apple"));
    expect(handleChange).toHaveBeenCalledWith("apple");
  });

  it("does not fire onChange for disabled items", () => {
    const handleChange = vi.fn();
    render(<Dropdown items={items} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Cherry"));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
