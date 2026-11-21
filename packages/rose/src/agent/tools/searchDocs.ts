import { resolveAppHref } from "@mono/app-config";
import type { Tool } from "./index";

interface WikiArticleRecord {
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  content?: string;
}

function filterWikiArticles(
  articles: WikiArticleRecord[],
  filters: { query: string; slug: string; category: string; date: string }
): string {
  const slugNeedle = filters.slug.toLowerCase();
  if (slugNeedle) {
    const article = articles.find(
      (a) => typeof a.slug === "string" && a.slug.toLowerCase() === slugNeedle
    );
    if (!article) {
      return JSON.stringify({ error: "Article not found", articles: [] });
    }
    return JSON.stringify({ articles: [article] });
  }

  let results = articles;

  const categoryNeedle = filters.category.toLowerCase();
  if (categoryNeedle) {
    results = results.filter(
      (a) =>
        typeof a.category === "string" &&
        a.category.toLowerCase().includes(categoryNeedle)
    );
  }

  const dateNeedle = filters.date.toLowerCase();
  if (dateNeedle) {
    results = results.filter(
      (a) =>
        (typeof a.updatedAt === "string" &&
          a.updatedAt.toLowerCase().includes(dateNeedle)) ||
        (typeof a.content === "string" &&
          a.content.toLowerCase().includes(dateNeedle))
    );
  }

  const queryNeedle = filters.query.toLowerCase();
  if (queryNeedle) {
    results = results.filter(
      (a) =>
        (typeof a.title === "string" &&
          a.title.toLowerCase().includes(queryNeedle)) ||
        (typeof a.description === "string" &&
          a.description.toLowerCase().includes(queryNeedle)) ||
        (typeof a.content === "string" &&
          a.content.toLowerCase().includes(queryNeedle)) ||
        (Array.isArray(a.tags) &&
          a.tags.some(
            (t) => typeof t === "string" && t.toLowerCase().includes(queryNeedle)
          ))
    );
  }

  return JSON.stringify({
    total: results.length,
    articles: results.slice(0, 8),
  });
}

export const searchDocsTool: Tool = {
  declaration: {
    name: "searchDocs",
    description:
      "Search and read articles, ADRs, dates, architecture docs, and portfolio/education/experience records from the /docs site.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keywords (e.g. 'education', 'architecture', 'admin', 'Redis').",
        },
        slug: {
          type: "string",
          description: "Optional exact article slug to read in full.",
        },
        category: {
          type: "string",
          description: "Optional wiki category filter.",
        },
        date: {
          type: "string",
          description: "Optional date or year-month filter (e.g. '2026-11-17' or '2026-10').",
        },
      },
    },
  },
  async execute(args: Record<string, unknown>): Promise<string> {
    const query = typeof args.query === "string" ? args.query.trim() : "";
    const slug = typeof args.slug === "string" ? args.slug.trim() : "";
    const category = typeof args.category === "string" ? args.category.trim() : "";
    const date = typeof args.date === "string" ? args.date.trim() : "";

    if (!query && !slug && !category && !date) {
      return JSON.stringify({
        error: "Provide at least one of: query, slug, category, or date.",
      });
    }

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (slug) params.set("slug", slug);
    if (category) params.set("category", category);
    if (date) params.set("date", date);

    const url = `${resolveAppHref("docs", "/api/wiki")}?${params.toString()}`;
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        return JSON.stringify({
          error: `Docs API returned ${res.status}`,
          url,
        });
      }
      const data = await res.json();
      if (Array.isArray(data?.articles)) {
        return filterWikiArticles(data.articles as WikiArticleRecord[], {
          query,
          slug,
          category,
          date,
        });
      }
      return JSON.stringify(data);
    } catch (err: unknown) {
      return JSON.stringify({
        error: err instanceof Error ? err.message : "Failed to fetch /docs data",
        url,
      });
    }
  },
};
