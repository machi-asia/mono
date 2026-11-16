import { NextResponse } from "next/server";
import {
  createClient,
  createServiceClient,
  createTokenClient,
  recordAndCheckUsage,
  resolveSafeRoleFromUser,
} from "@mono/database";
import { buildCorsHeaders, extractClientIdentifier, resolveRequestAuth } from "../security/guard";

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

function deriveAuthoritativeReporterHash(userId: string, clientIp: string): string {
  const seed = `reporter::${userId || "guest"}::${clientIp || "unknown"}`;
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const hex2 = (h2 >>> 0).toString(16).padStart(8, "0");
  return `srv_${hex1}${hex2}`;
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

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const supabase = createTokenClient(token);
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token);

    if (userErr || !user) return null;

    if (resolveSafeRoleFromUser(user) === "admin") {
      return { user, supabase };
    }

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
  const corsHeaders = buildCorsHeaders(req, "GET, OPTIONS");
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json(
      { error: "Missing required query parameter: gameId" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const supabase = createClient();
    const { data, error } = await (supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>
    ) => Promise<{ data: unknown; error: { message: string } | null }>)(
      "get_community_overrides",
      { p_game_id: gameId }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handler for POST /itemlist/reports
export async function handleCreateReport(req: Request): Promise<Response> {
  const corsHeaders = buildCorsHeaders(req, "GET, POST, OPTIONS");
  try {
    const body = await req.json();
    const {
      gameId,
      itemId,
      itemName,
      issueType,
      description,
      suggestedFix,
      corrections,
    } = body;

    if (!gameId || !itemId || !itemName || !issueType) {
      return NextResponse.json(
        { error: "Missing required fields: gameId, itemId, itemName, issueType" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Enforce API request quota for report submission
    const auth = await resolveRequestAuth(req);
    const quota = await recordAndCheckUsage({
      userId: auth.userId,
      app: "itemlist",
      metric: "requests",
      amount: 1,
      role: auth.role,
    });

    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded for submitting issue reports.",
          quota: {
            locked: true,
            metric: "requests",
            role: auth.role,
            dailyUsed: quota.dailyCount,
            dailyLimit: quota.dailyLimit,
            monthlyUsed: quota.monthlyCount,
            monthlyLimit: quota.monthlyLimit,
            remaining: 0,
            exceededType: quota.exceededType,
          },
        },
        { status: 429, headers: corsHeaders }
      );
    }

    // Security: ignore client-supplied `reporterHash` so a single user cannot spoof
    // 2 distinct hashes to poison community consensus (`get_community_overrides`).
    const clientIp = extractClientIdentifier(req);
    const assignedReporterHash = deriveAuthoritativeReporterHash(auth.userId, clientIp);

    const consensusKey = generateConsensusKey(itemId, corrections);

    const supabase = auth.supabaseClient || createServiceClient();
    const { data, error } = await (supabase.from("issue_reports") as any)
      .insert([
        {
          game_id: gameId,
          item_id: itemId,
          item_name: itemName,
          issue_type: issueType,
          description: description ? String(description).slice(0, 2000) : null,
          suggested_fix: suggestedFix ? String(suggestedFix).slice(0, 2000) : null,
          reporter_hash: String(assignedReporterHash).slice(0, 128),
          corrections: corrections || {},
          consensus_key: consensusKey,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, report: data },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handler for GET /itemlist/admin/reports
export async function handleAdminGetReports(req: Request): Promise<Response> {
  const corsHeaders = buildCorsHeaders(req, "GET, OPTIONS");
  const admin = await getAdminAuthUser(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const { data, error } = await (admin.supabase.from("issue_reports") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handler for PATCH /itemlist/admin/reports/:id
export async function handleAdminUpdateReport(
  req: Request,
  reportId: string
): Promise<Response> {
  const corsHeaders = buildCorsHeaders(req, "PATCH, OPTIONS");
  const admin = await getAdminAuthUser(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!["pending", "resolved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value: must be 'pending', 'resolved', or 'rejected'" },
        { status: 400, headers: corsHeaders }
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
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, report: data },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
