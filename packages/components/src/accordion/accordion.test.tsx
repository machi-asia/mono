import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Accordion } from "./accordion";

const items = [
  { title: "Section 1", content: <p>Content 1</p> },
  { title: "Section 2", content: <p>Content 2</p> },
];

function contentAttribute(title: string): string | null {
  const trigger = screen.getByText(title);
  const panel = trigger.closest(".m-accordion-item")?.querySelector(".m-accordion-content");
  return panel?.getAttribute("data-open") ?? null;
}

describe("Accordion", () => {
  it("renders all titles", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  it("expands content on click", () => {
    render(<Accordion items={items} />);
    expect(contentAttribute("Section 1")).toBe("false");
    fireEvent.click(screen.getByText("Section 1"));
    expect(contentAttribute("Section 1")).toBe("true");
  });

  it("collapses when clicked again", () => {
    render(<Accordion items={items} />);
    fireEvent.click(screen.getByText("Section 1"));
    expect(contentAttribute("Section 1")).toBe("true");
    fireEvent.click(screen.getByText("Section 1"));
    expect(contentAttribute("Section 1")).toBe("false");
  });

  it("supports defaultOpen", () => {
    render(<Accordion items={items} defaultOpen={[0]} />);
    expect(contentAttribute("Section 1")).toBe("true");
    expect(contentAttribute("Section 2")).toBe("false");
  });

  it("supports multiple open when multiple=true", () => {
    render(<Accordion items={items} multiple />);
    fireEvent.click(screen.getByText("Section 1"));
    fireEvent.click(screen.getByText("Section 2"));
    expect(contentAttribute("Section 1")).toBe("true");
    expect(contentAttribute("Section 2")).toBe("true");
  });
});
