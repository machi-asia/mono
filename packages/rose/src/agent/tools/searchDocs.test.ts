import { describe, it, expect, vi, afterEach } from "vitest";
import { searchDocsTool } from "./searchDocs";

const STATIC_CATALOG = {
  total: 10,
  articles: [
    {
      slug: "standard-wiki-reporting",
      title: "Standard: Mandatory Wiki Reporting",
      description: "Wiki documentation policy",
      category: "Standards & Guidelines",
      updatedAt: "2026-10-03",
      author: "Machi Asia Architecture Guild",
      tags: ["standards", "wiki"],
      content: "Every significant change MUST be reported in the Documentation Wiki.",
    },
    {
      slug: "account-roles-and-usage-monitoring",
      title: "Architecture & Auth: User Roles",
      description: "Role-based access control and quotas",
      category: "Architecture & Core",
      updatedAt: "2026-10-06",
      author: "Machi Asia Engineering",
      tags: ["auth", "supabase", "redis"],
      content: "Machi Asia enforces role-based access control across apps.",
    },
    ...Array.from({ length: 8 }, (_, idx) => ({
      slug: `architecture-extra-${idx + 1}`,
      title: `Architecture Extra ${idx + 1}`,
      description: "Supplemental architecture record",
      category: "Architecture & Core",
      updatedAt: "2026-11-17",
      author: "Machi Asia Engineering",
      tags: ["architecture"],
      content: `Supplemental details for architecture note ${idx + 1}.`,
    })),
  ],
};

describe("searchDocsTool", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns validation error when no parameters are provided", async () => {
    const raw = await searchDocsTool.execute({});
    const parsed = JSON.parse(raw);
    expect(parsed.error).toMatch(/Provide at least one/i);
  });

  it("filters static unfiltered catalog responses by query, slug, category, and date", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        json: async () => STATIC_CATALOG,
      } as Response;
    });

    const queryRes = JSON.parse(await searchDocsTool.execute({ query: "Redis" }));
    expect(queryRes.total).toBe(1);
    expect(queryRes.articles[0].slug).toBe("account-roles-and-usage-monitoring");

    const slugRes = JSON.parse(
      await searchDocsTool.execute({ slug: "STANDARD-WIKI-REPORTING" })
    );
    expect(slugRes.articles).toHaveLength(1);
    expect(slugRes.articles[0].slug).toBe("standard-wiki-reporting");

    const missingSlugRes = JSON.parse(
      await searchDocsTool.execute({ slug: "unknown-slug" })
    );
    expect(missingSlugRes.error).toBe("Article not found");
    expect(missingSlugRes.articles).toEqual([]);

    const catRes = JSON.parse(
      await searchDocsTool.execute({ category: "Architecture & Core" })
    );
    expect(catRes.total).toBe(9);
    expect(catRes.articles).toHaveLength(8);

    const dateRes = JSON.parse(
      await searchDocsTool.execute({ date: "2026-11-17" })
    );
    expect(dateRes.total).toBe(8);
    expect(dateRes.articles).toHaveLength(8);

    expect(fetchSpy).toHaveBeenCalled();
  });

  it("handles non-200 HTTP responses and network failures", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response);

    const httpErr = JSON.parse(
      await searchDocsTool.execute({ query: "architecture" })
    );
    expect(httpErr.error).toBe("Docs API returned 503");
    expect(httpErr.url).toContain("/api/wiki");

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network down"));
    const netErr = JSON.parse(
      await searchDocsTool.execute({ query: "architecture" })
    );
    expect(netErr.error).toBe("Network down");
    expect(netErr.url).toContain("/api/wiki");
  });
});
