import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncGithubReposToSupabase } from "./route";

describe("github-repos cron", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches GitHub repos and upserts them into portfolio_github_cache", async () => {
    const mockRepos = [{ id: 1, name: "mono" }, { id: 2, name: "SAMS-Plus" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockRepos,
      })
    );

    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    const mockSupabase = {
      from: vi.fn().mockReturnValue({ upsert: upsertMock }),
    };

    const result = await syncGithubReposToSupabase(mockSupabase);

    expect(result.ok).toBe(true);
    expect(result.count).toBe(2);
    expect(mockSupabase.from).toHaveBeenCalledWith("portfolio_github_cache");
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "kamachi-dev",
        repos: mockRepos,
      }),
      { onConflict: "id" }
    );
  });

  it("returns ok: false when GitHub API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      })
    );

    const result = await syncGithubReposToSupabase({});
    expect(result.ok).toBe(false);
    expect(result.error).toContain("403");
  });
});
