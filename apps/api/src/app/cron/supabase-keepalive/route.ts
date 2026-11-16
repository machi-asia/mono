import { NextResponse } from "next/server";
import { createServiceClient } from "@mono/database";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export interface KeepalivePingResult {
  ok: boolean;
  source: string;
  pingedAt: string;
  latencyMs: number;
  error?: string;
}

export async function runSupabaseKeepalivePing(
  source = "api_cron",
  clientOverride?: any
): Promise<KeepalivePingResult> {
  const start = Date.now();
  const fallbackNow = new Date().toISOString();

  try {
    const supabase = clientOverride ?? createServiceClient();

    // 1. Call the record_keepalive_heartbeat RPC to write a heartbeat row
    const { data: rpcTime, error: rpcError } = await supabase.rpc(
      "record_keepalive_heartbeat",
      { p_source: source }
    );

    if (!rpcError && rpcTime) {
      return {
        ok: true,
        source,
        pingedAt: String(rpcTime),
        latencyMs: Date.now() - start,
      };
    }

    // 2. Fallback: lightweight SELECT against user_roles so Supabase registers REST + DB activity
    const { error: selectError } = await supabase
      .from("user_roles")
      .select("user_id")
      .limit(1);

    if (selectError) {
      return {
        ok: false,
        source,
        pingedAt: fallbackNow,
        latencyMs: Date.now() - start,
        error: selectError.message,
      };
    }

    return {
      ok: true,
      source,
      pingedAt: fallbackNow,
      latencyMs: Date.now() - start,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      source,
      pingedAt: fallbackNow,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : "Keep-alive ping failed",
    };
  }
}

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/cron/supabase-keepalive", app: "api" },
    async () => {
      const url = new URL(req.url);
      const source = url.searchParams.get("source") || "vercel_cron";
      const result = await runSupabaseKeepalivePing(source);

      return NextResponse.json(
        {
          status: result.ok ? "ok" : "degraded",
          service: "@mono/api",
          job: "supabase-keepalive",
          ...result,
        },
        { status: result.ok ? 200 : 503 }
      );
    }
  );
}

export async function POST(req: Request) {
  return GET(req);
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, OPTIONS");
}
