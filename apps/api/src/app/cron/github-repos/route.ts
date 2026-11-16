import { NextResponse } from "next/server";
import { createServiceClient } from "@mono/database";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

const GITHUB_USER = "kamachi-dev";
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;

export interface GithubSyncResult {
  ok: boolean;
  count: number;
  updatedAt: string;
  error?: string;
}

export async function syncGithubReposToSupabase(
  clientOverride?: any
): Promise<GithubSyncResult> {
  const updatedAt = new Date().toISOString();

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "machi-asia-portfolio-cron",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(GITHUB_REPOS_URL, { headers });
    if (!res.ok) {
      return {
        ok: false,
        count: 0,
        updatedAt,
        error: `GitHub API returned ${res.status}`,
      };
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      return {
        ok: false,
        count: 0,
        updatedAt,
        error: "GitHub API did not return an array",
      };
    }

    const supabase = clientOverride ?? createServiceClient();
    const { error } = await supabase.from("portfolio_github_cache").upsert(
      {
        id: GITHUB_USER,
        repos,
        updated_at: updatedAt,
      },
      { onConflict: "id" }
    );

    if (error) {
      return {
        ok: false,
        count: 0,
        updatedAt,
        error: error.message,
      };
    }

    return {
      ok: true,
      count: repos.length,
      updatedAt,
    };
  } catch (err) {
    return {
      ok: false,
      count: 0,
      updatedAt,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function GET(req: Request) {
  return withApiGuard(req, { endpoint: "/cron/github-repos" }, async () => {
    const result = await syncGithubReposToSupabase();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  });
}

export function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}
