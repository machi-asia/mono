import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextEditor } from "./texteditor";

describe("TextEditor", () => {
  it("renders the contenteditable area", () => {
    render(<TextEditor />);
    expect(screen.getByRole("textbox", { name: "Start typing..." })).toBeInTheDocument();
  });

  it("renders toolbar buttons", () => {
    render(<TextEditor />);
    expect(screen.getByTitle("Bold")).toBeInTheDocument();
    expect(screen.getByTitle("Italic")).toBeInTheDocument();
    expect(screen.getByTitle("Underline")).toBeInTheDocument();
    expect(screen.getByTitle("Bullet list")).toBeInTheDocument();
    expect(screen.getByTitle("Numbered list")).toBeInTheDocument();
  });

  it("uses custom placeholder", () => {
    render(<TextEditor placeholder="Write here..." />);
    expect(screen.getByRole("textbox", { name: "Write here..." })).toBeInTheDocument();
  });

  it("renders with initial HTML value", () => {
    render(<TextEditor value="<p>Hello</p>" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
