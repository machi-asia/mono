import { NextResponse } from "next/server";
import { createClient } from "@mono/database";
import type { Database } from "@mono/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface ReportCorrections {
  recipeMethod?: string;
  machineRequired?: string;
  outputAmount?: number;
  ingredients?: Array<{ name: string; amount: number }>;
  processingTimeSeconds?: number;
  speedRpm?: number;
  intendedItemsPerMin?: number;
  iconUrl?: string;
}

export interface IssueReportSubmission {
  gameId: string;
  itemId: string;
  itemName: string;
  issueType: string;
  description?: string;
  suggestedFix?: string;
  corrections?: ReportCorrections;
}

export interface CommunityOverride {
  game_id: string;
  item_id: string;
  item_name: string;
  issue_type: string;
  corrections: ReportCorrections;
  reporter_count: number;
}

export function generateConsensusKey(itemId: string, corrections: ReportCorrections = {}): string {
  const norm: Record<string, unknown> = {};

  if (corrections.recipeMethod) norm.method = corrections.recipeMethod.trim().toLowerCase();
  if (corrections.machineRequired) norm.machine = corrections.machineRequired.trim().toLowerCase();
  if (corrections.outputAmount !== undefined) norm.out = Number(corrections.outputAmount);
  if (corrections.processingTimeSeconds !== undefined) norm.time = Number(corrections.processingTimeSeconds);
  if (corrections.speedRpm !== undefined) norm.rpm = Number(corrections.speedRpm);
  if (corrections.iconUrl) norm.icon = corrections.iconUrl.trim();

  if (corrections.ingredients && corrections.ingredients.length > 0) {
    norm.ings = corrections.ingredients
      .map((i) => `${i.name.trim().toLowerCase()}:${Number(i.amount)}`)
      .sort();
  }

  return `${itemId}::${JSON.stringify(norm)}`;
}

export async function getAdminAuthUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  if (!token) return null;

  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zyatzdkapdqngwyhiqqn.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_xwwMB4HT0zXrWgEhPN63yA_xBNK00YR";

    const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token);

    if (userErr || !user) return null;

    // Check if user is admin via RPC is_admin or user_roles table
    const { data: isAdminRpc } = await supabase.rpc("is_admin");
    if (isAdminRpc) {
      return { user, supabase };
    }

    const { data: roleRow } = await (supabase.from("user_roles") as any)
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleRow?.role === "admin") {
      return { user, supabase };
    }

    return null;
  } catch {
    return null;
  }
}

// Handler for GET /itemlist/overrides?gameId=...
export async function handleGetOverrides(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json(
      { error: "Missing required query parameter: gameId" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const supabase = createClient();
    const { data, error } = await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>)("get_community_overrides", {
      p_game_id: gameId,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// Handler for POST /itemlist/reports
export async function handleCreateReport(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { gameId, itemId, itemName, issueType, description, suggestedFix, corrections, reporterHash } = body;

    if (!gameId || !itemId || !itemName || !issueType) {
      return NextResponse.json(
        { error: "Missing required fields: gameId, itemId, itemName, issueType" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const assignedReporterHash =
      reporterHash ||
      req.headers.get("x-forwarded-for") ||
      "anon_" + Math.random().toString(36).substring(2);

    const consensusKey = generateConsensusKey(itemId, corrections);

    const supabase = createClient();
    const { data, error } = await (supabase.from("issue_reports") as any).insert([
      {
        game_id: gameId,
        item_id: itemId,
        item_name: itemName,
        issue_type: issueType,
        description: description || null,
        suggested_fix: suggestedFix || null,
        reporter_hash: assignedReporterHash,
        corrections: corrections || {},
        consensus_key: consensusKey,
      },
    ]).select().single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, report: data },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// Handler for GET /itemlist/admin/reports
export async function handleAdminGetReports(req: Request): Promise<Response> {
  const admin = await getAdminAuthUser(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required" },
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const { data, error } = await (admin.supabase.from("issue_reports") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// Handler for PATCH /itemlist/admin/reports/:id
export async function handleAdminUpdateReport(req: Request, reportId: string): Promise<Response> {
  const admin = await getAdminAuthUser(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required" },
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!["pending", "resolved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value: must be 'pending', 'resolved', or 'rejected'" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const { data, error } = await (admin.supabase.from("issue_reports") as any)
      .update({ status })
      .eq("id", reportId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, report: data },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
