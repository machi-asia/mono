import { NextResponse } from "next/server";
import { getRoseUsage } from "../usage/usage";
import { getAuthUser } from "./chat";

export async function handleRoseUsage(req: Request): Promise<Response> {
  try {
    const authResult = await getAuthUser(req);
    const user = authResult?.user;
    const clientOverride = authResult?.supabaseClient;
    const userId = user?.id || "00000000-0000-0000-0000-000000000001";
    const userRoles = (user as any)?.roles || (user?.is_anonymous ? ["guest"] : []);

    const usage = await getRoseUsage(userId, userRoles, clientOverride);
    return NextResponse.json(usage);
  } catch (err: unknown) {
    console.error("[RoseServer] Usage fetch error:", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to fetch usage metrics." } },
      { status: 500 }
    );
  }
}