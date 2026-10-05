import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";
import {
  getAllArticles,
  getArticleBySlug,
  searchArticles,
  getArticlesByCategory,
} from "../data/wiki-articles";
import { parseTocFromMarkdown, slugify } from "../utils/wiki-utils";

describe("Documentation Wiki", () => {
  it("renders the wiki home headline", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Developer Knowledge Wiki/i })
    ).toBeInTheDocument();
  });

  it("renders search input and category chips", () => {
    render(<HomePage />);
    expect(
      screen.getByPlaceholderText(/Search documentation/i)
    ).toBeInTheDocument();
    expect(screen.getByText("All Articles")).toBeInTheDocument();
    expect(screen.getAllByText("Architecture & Core").length).toBeGreaterThan(0);
  });

  it("provides comprehensive articles data", () => {
    const articles = getAllArticles();
    expect(articles.length).toBeGreaterThan(10);

    const arch = getArticleBySlug("architecture");
    expect(arch).toBeDefined();
    expect(arch?.title).toContain("System Architecture");

    const searchResults = searchArticles("supabase");
    expect(searchResults.length).toBeGreaterThan(0);

    const adrs = getArticlesByCategory("Architecture Decisions (ADR)");
    expect(adrs.length).toBeGreaterThan(5);
  });

  it("parses TOC headings correctly", () => {
    const md = "## Overview\nSome text\n### Workspace Layout\nMore text\n## Concurrency";
    const toc = parseTocFromMarkdown(md);
    expect(toc).toEqual([
      { title: "Overview", level: 2, id: "overview" },
      { title: "Workspace Layout", level: 3, id: "workspace-layout" },
      { title: "Concurrency", level: 2, id: "concurrency" },
    ]);
  });

  it("slugifies text correctly", () => {
    expect(slugify("Hello World & Universe!")).toBe("hello-world-universe");
  });
});
