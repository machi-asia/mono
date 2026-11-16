import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MarkdownRenderer } from "./markdown";

describe("MarkdownRenderer", () => {
  it("keeps safe link schemes and neutralizes dangerous ones (file://, javascript:) when clicked", () => {
    const md = "[Local](file:///D:/Repositories/secret) [Danger](javascript:alert(1)) [Web](https://example.com)";
    render(<MarkdownRenderer content={md} />);
    expect(screen.getByText("Web")).toHaveAttribute("href", "https://example.com");
    expect(screen.getByText("Local")).toHaveAttribute("href", "#");
    expect(screen.getByText("Danger")).toHaveAttribute("href", "#");
  });
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
    expect(screen.getByText("const")).toHaveClass("m-token-keyword");
    expect(screen.getByText("'Hello Obsidian'")).toHaveClass("m-token-string");

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

  it("safely handles partially typed or streaming table rows without freezing", () => {
    const partial1 = "| Aspect | Details";
    const { unmount } = render(<MarkdownRenderer content={partial1} />);
    expect(screen.getByText(/Aspect/)).toBeInTheDocument();
    unmount();

    const partial2 = "| Aspect | Details |\n|-------";
    render(<MarkdownRenderer content={partial2} />);
    expect(screen.getByText(/Aspect/)).toBeInTheDocument();
  });

  it("renders embedded markdown images with captions and responsive styles", () => {
    const md = "![Campus Building](https://example.com/building.jpg)";
    render(<MarkdownRenderer content={md} />);
    const img = screen.getByRole("img", { name: "Campus Building" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("https%3A%2F%2Fexample.com%2Fbuilding.jpg");
    expect(img).toHaveAttribute("crossorigin", "anonymous");
    expect(img).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(screen.getByText("Campus Building")).toHaveClass("m-md-image-caption");
  });

  it("sorts table columns ascending, descending, and resets on third click", () => {
    const md = [
      "| Model | Price |",
      "| --- | --- |",
      "| Tesla | $96.8B |",
      "| BYD | $60.2B |",
      "| Rivian | $5.1B |",
    ].join("\n");

    render(<MarkdownRenderer content={md} />);

    const getRowModels = () =>
      Array.from(document.querySelectorAll("tbody tr")).map(
        (tr) => tr.querySelector("td")?.textContent
      );

    expect(getRowModels()).toEqual(["Tesla", "BYD", "Rivian"]);

    const priceHeaderBtn = screen.getByRole("button", { name: /Sort by Price/i });
    fireEvent.click(priceHeaderBtn);
    expect(getRowModels()).toEqual(["Rivian", "BYD", "Tesla"]);

    fireEvent.click(priceHeaderBtn);
    expect(getRowModels()).toEqual(["Tesla", "BYD", "Rivian"]);

    fireEvent.click(priceHeaderBtn);
    expect(getRowModels()).toEqual(["Tesla", "BYD", "Rivian"]);
  });

  it("opens and closes image lightbox on click and Escape", () => {
    const md = "![Campus Building](https://example.com/building.jpg)";
    render(<MarkdownRenderer content={md} />);

    const img = screen.getByRole("img", { name: "Campus Building" });
    fireEvent.click(img);

    const dialog = screen.getByRole("dialog", { name: "Campus Building" });
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("generates heading slug IDs and copies section link on anchor click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<MarkdownRenderer content="## Market Share & Sales" />);
    const heading = document.getElementById("market-share-sales");
    expect(heading).toBeInTheDocument();

    const anchorBtn = screen.getByRole("button", { name: /Copy link to Market Share & Sales/i });
    fireEvent.click(anchorBtn);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("#market-share-sales"));
  });

  it("renders markdown links as pills and shows site preview on hover", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          title: "MotorTrend Complete Comparison",
          description: "Detailed EV comparison.",
          publisher: "motortrend.com",
        },
      }),
    } as any);

    try {
      render(<MarkdownRenderer content="[MotorTrend](https://www.motortrend.com/compare)" />);
      const link = screen.getByRole("link", { name: /MotorTrend/i });
      expect(link).toHaveClass("m-md-link-pill");

      const wrap = link.closest(".m-md-link-wrap")!;
      fireEvent.mouseEnter(wrap);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByText("motortrend.com")).toBeInTheDocument();
    } finally {
      fetchSpy.mockRestore();
      vi.useRealTimers();
    }
  });
});

describe("MarkdownRenderer math formulas", () => {
  it("renders inline and block LaTeX formulas using KaTeX", () => {
    const md = [
      "Einstein wrote $E = mc^2$ and \\(a^2 + b^2 = c^2\\).",
      "",
      "$$",
      "\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      "$$",
    ].join("\n");

    const { container } = render(<MarkdownRenderer content={md} />);
    expect(container.querySelectorAll(".m-md-math-inline")).toHaveLength(2);
    expect(container.querySelector(".m-md-math-block")).toBeInTheDocument();
    expect(container.querySelectorAll(".katex")).toHaveLength(3);
  });
});

describe("MarkdownRenderer charts", () => {
  it("renders bar, line, area, pie, and donut charts from ```chart blocks", () => {
    const chartTypes = ["bar", "line", "area", "pie", "donut"] as const;
    for (const type of chartTypes) {
      const md = [
        "```chart",
        JSON.stringify({
          type,
          title: `${type} Chart`,
          data: [
            { label: "Q1", value: 40 },
            { label: "Q2", value: 75 },
            { label: "Q3", value: 55 },
          ],
        }),
        "```",
      ].join("\n");

      const { container, unmount } = render(<MarkdownRenderer content={md} />);
      expect(container.querySelector(".m-md-chart")).toBeInTheDocument();
      expect(container.querySelector(".m-md-chart-title")?.textContent).toBe(`${type} Chart`);
      expect(container.querySelectorAll(".m-md-chart-legend-item")).toHaveLength(3);
      unmount();
    }
  });
});
