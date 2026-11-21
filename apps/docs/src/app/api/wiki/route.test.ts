import { describe, it, expect } from "vitest";
import { dynamic, GET } from "./route";
import { wikiArticles } from "../../../data/wiki-articles";

describe("/api/wiki route", () => {
  it("configures dynamic as force-static for static export builds", () => {
    expect(dynamic).toBe("force-static");
  });

  it("returns all mapped wiki articles when called without filter params", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.total).toBe(wikiArticles.length);
    expect(data.articles).toHaveLength(wikiArticles.length);
  });

  it("returns matching article by slug and 404 when missing", async () => {
    const targetSlug = wikiArticles[0].slug;
    const foundRes = await GET(
      new Request(`http://localhost/api/wiki?slug=${encodeURIComponent(targetSlug)}`)
    );
    expect(foundRes.status).toBe(200);
    const foundData = await foundRes.json();
    expect(foundData.articles).toHaveLength(1);
    expect(foundData.articles[0].slug).toBe(targetSlug);

    const missingRes = await GET(
      new Request("http://localhost/api/wiki?slug=does-not-exist-xyz")
    );
    expect(missingRes.status).toBe(404);
    const missingData = await missingRes.json();
    expect(missingData.error).toBe("Article not found");
    expect(missingData.articles).toEqual([]);
  });

  it("filters articles by q, category, and date query params", async () => {
    const sample = wikiArticles[0];

    const qRes = await GET(
      new Request(`http://localhost/api/wiki?q=${encodeURIComponent(sample.title)}`)
    );
    expect(qRes.status).toBe(200);
    const qData = await qRes.json();
    expect(qData.articles.some((a: { slug: string }) => a.slug === sample.slug)).toBe(true);
    expect(qData.articles.length).toBeLessThanOrEqual(8);

    const catRes = await GET(
      new Request(`http://localhost/api/wiki?category=${encodeURIComponent(sample.category)}`)
    );
    expect(catRes.status).toBe(200);
    const catData = await catRes.json();
    expect(catData.articles.length).toBeGreaterThan(0);
    expect(
      catData.articles.every((a: { category: string }) =>
        a.category.toLowerCase().includes(sample.category.toLowerCase())
      )
    ).toBe(true);

    const dateRes = await GET(
      new Request(`http://localhost/api/wiki?date=${encodeURIComponent(sample.updatedAt)}`)
    );
    expect(dateRes.status).toBe(200);
    const dateData = await dateRes.json();
    expect(dateData.articles.some((a: { slug: string }) => a.slug === sample.slug)).toBe(true);
  });

  it("returns all articles safely when req.url throws under static export proxy", async () => {
    const proxiedReq = {
      get url(): string {
        throw new Error('Route /api/wiki with `dynamic = "error"` couldn\'t be rendered statically because it used `request.url`.');
      },
    } as unknown as Request;

    const res = await GET(proxiedReq);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total).toBe(wikiArticles.length);
    expect(data.articles).toHaveLength(wikiArticles.length);
  });
});
