import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarkdownRenderer } from "./markdown";

describe("MarkdownRenderer", () => {
  it("renders standard markdown text, headings, and bold/italic", () => {
    const md = "# Title 1\n\n## Title 2\n\nThis is **bold** and *italic* text.";
    render(<MarkdownRenderer content={md} />);
    expect(screen.getByRole("heading", { level: 1, name: "Title 1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Title 2" })).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
  });

  it("renders Obsidian callouts with title and custom type", () => {
    const md = "> [!tip] Pro Tip\n> Always commit with clear messages.";
    render(<MarkdownRenderer content={md} />);
    expect(screen.getByText("Pro Tip")).toBeInTheDocument();
    expect(screen.getByText("Always commit with clear messages.")).toBeInTheDocument();
  });

  it("renders foldable callouts and toggles collapse", () => {
    const md = "> [!warning]- Hidden Warning\n> This content is initially collapsed.";
    render(<MarkdownRenderer content={md} />);
    expect(screen.getByText("Hidden Warning")).toBeInTheDocument();
    expect(screen.queryByText("This content is initially collapsed.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Hidden Warning"));
    expect(screen.getByText("This content is initially collapsed.")).toBeInTheDocument();
  });

  it("renders Obsidian wikilinks and invokes onWikilinkClick", () => {
    const handleWikilink = vi.fn();
    const md = "Refer to [[Architecture]] or [[Docs/Components|Component Guidelines]].";
    render(<MarkdownRenderer content={md} onWikilinkClick={handleWikilink} />);

    const link1 = screen.getByText("Architecture");
    const link2 = screen.getByText("Component Guidelines");
    expect(link1).toBeInTheDocument();
    expect(link2).toBeInTheDocument();

    fireEvent.click(link2);
    expect(handleWikilink).toHaveBeenCalledWith("Docs/Components", "Component Guidelines");
  });

  it("renders Obsidian tags and invokes onTagClick", () => {
    const handleTag = vi.fn();
    const md = "Categorized under #obsidian/markdown and #frontend.";
    render(<MarkdownRenderer content={md} onTagClick={handleTag} />);

    const tagEl = screen.getByText("obsidian/markdown");
    expect(tagEl).toBeInTheDocument();

    fireEvent.click(tagEl);
    expect(handleTag).toHaveBeenCalledWith("obsidian/markdown");
  });

  it("renders Obsidian highlight marks ==text==", () => {
    const md = "This is ==vital information== to remember.";
    render(<MarkdownRenderer content={md} />);
    const mark = screen.getByText("vital information");
    expect(mark.tagName.toLowerCase()).toBe("mark");
  });

  it("renders strikethrough ~~text~~", () => {
    const md = "This is ~~deprecated code~~ replaced by new version.";
    render(<MarkdownRenderer content={md} />);
    const del = screen.getByText("deprecated code");
    expect(del.tagName.toLowerCase()).toBe("del");
  });

  it("renders task lists and triggers onTaskToggle", () => {
    const handleToggle = vi.fn();
    const md = "- [ ] First task\n- [x] Completed task";
    render(<MarkdownRenderer content={md} onTaskToggle={handleToggle} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();

    fireEvent.click(checkboxes[0]);
    expect(handleToggle).toHaveBeenCalledWith("First task", true);
  });

  it("renders code blocks with language and copy button", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const md = "```typescript\nconst greeting = 'Hello Obsidian';\n```";
    render(<MarkdownRenderer content={md} />);

    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("const greeting = 'Hello Obsidian';")).toBeInTheDocument();

    const copyBtn = screen.getByRole("button", { name: /copy code/i });
    fireEvent.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith("const greeting = 'Hello Obsidian';");
  });

  it("renders GFM tables", () => {
    const md = "| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |";
    render(<MarkdownRenderer content={md} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Cell 1")).toBeInTheDocument();
  });
});
