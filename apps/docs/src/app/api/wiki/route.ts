import { NextResponse } from "next/server";
import { wikiArticles } from "../../../data/wiki-articles";

export const dynamic = "force-static";

export async function GET(req?: Request) {
  const isStaticExport =
    process.env.STATIC_EXPORT === "true" ||
    process.env.CAPACITOR_BUILD === "true";

  let searchParams = new URLSearchParams();
  if (!isStaticExport && req) {
    try {
      searchParams = new URL(req.url, "http://localhost").searchParams;
    } catch {
      searchParams = new URLSearchParams();
    }
  }
  const slug = searchParams.get("slug")?.trim().toLowerCase();
  const q = searchParams.get("q")?.trim().toLowerCase();
  const category = searchParams.get("category")?.trim().toLowerCase();
  const date = searchParams.get("date")?.trim().toLowerCase();

  if (slug) {
    const article = wikiArticles.find((a) => a.slug.toLowerCase() === slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found", articles: [] }, { status: 404 });
    }
    return NextResponse.json({ articles: [article] });
  }

  let results = wikiArticles;

  if (category) {
    results = results.filter((a) => a.category.toLowerCase().includes(category));
  }

  if (date) {
    results = results.filter(
      (a) =>
        a.updatedAt.toLowerCase().includes(date) ||
        a.content.toLowerCase().includes(date)
    );
  }

  if (q) {
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const hasFilters = Boolean(q || category || date);
  const selected = hasFilters ? results.slice(0, 8) : results;

  return NextResponse.json({
    total: results.length,
    articles: selected.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      category: a.category,
      updatedAt: a.updatedAt,
      author: a.author,
      tags: a.tags,
      content: a.content.slice(0, 3000),
    })),
  });
}
