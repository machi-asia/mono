import { NextResponse } from "next/server";
import { getRoseUsage } from "./usage-calc";
import { resolveRequestAuth } from "../security/guard";

export async function handleRoseUsage(req: Request): Promise<Response> {
  try {
    const auth = await resolveRequestAuth(req);
    const usage = await getRoseUsage(auth.userId, auth.roles, auth.supabaseClient);
    return NextResponse.json(usage);
  } catch (err: unknown) {
    console.error("[RoseServer] Usage fetch error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to fetch usage metrics." } },
      { status: 500 }
    );
  }
}
