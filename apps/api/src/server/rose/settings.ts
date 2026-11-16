import { NextResponse } from "next/server";
import {
  createMemory,
  updateMemoryByIndex,
  deleteMemoryByIndex,
  listMemoryIndexes,
  getPersonalization,
  savePersonalization,
  normalizeImportance,
  recordAndCheckUsage,
  createClient,
} from "@mono/database";
import { resolveRequestAuth } from "../security/guard";

export async function handleRoseSettings(req: Request): Promise<Response> {
  try {
    const auth = await resolveRequestAuth(req);
    const userId = auth.userId;

    // Enforce API request quota on settings endpoint
    const quota = await recordAndCheckUsage({
      userId,
      app: "rose",
      metric: "requests",
      amount: 1,
      role: auth.role,
      clientOverride: auth.supabaseClient,
    });

    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "rate_limit_exceeded",
            message: "Settings API rate limit exceeded.",
          },
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
        { status: 429 }
      );
    }

    const dbClient = auth.supabaseClient || createClient();

    if (req.method === "GET") {
      if (!auth.user && !auth.isAuthenticated) {
        return NextResponse.json({
          memories: [],
          personalization: {
            user_id: userId,
            custom_instructions: "",
            nickname: "",
            tone: "Warm & Helpful",
          },
        });
      }

      const [memories, personalization] = await Promise.all([
        listMemoryIndexes(dbClient, { userId }),
        getPersonalization(dbClient, userId),
      ]);

      return NextResponse.json({
        memories,
        personalization: personalization || {
          user_id: userId,
          custom_instructions: "",
          nickname: "",
          tone: "Warm & Helpful",
        },
      });
    }

    if (req.method === "POST") {
      // Require an authenticated or valid guest session to mutate settings/memories
      if (!auth.user && !auth.isAuthenticated) {
        return NextResponse.json(
          {
            error: {
              code: "unauthorized",
              message: "An active session is required to modify companion settings or memories.",
            },
          },
          { status: 401 }
        );
      }

      const body = await req.json().catch(() => ({}));
      const action = body.action;

      if (action === "save_personalization" || (!action && (body.persona || body.customInstructions !== undefined))) {
        const saved = await savePersonalization(dbClient, {
          userId,
          customInstructions: body.customInstructions,
          nickname: body.nickname,
          tone: body.tone || body.persona,
        });
        return NextResponse.json({ ok: true, personalization: saved });
      }

      if (action === "add_memory") {
        const index = String(body.index || body.category || "").trim();
        const content = String(body.content || body.description || "").trim();
        if (!index || !content) {
          return NextResponse.json(
            {
              error: {
                code: "invalid_memory",
                message: "A memory 'index' and 'description' are required.",
              },
            },
            { status: 400 }
          );
        }
        const created = await createMemory(dbClient, {
          userId,
          category: index,
          content,
          importance: normalizeImportance(body.importance),
        });
        return NextResponse.json({ ok: true, memory: created });
      }

      if (action === "update_memory") {
        const index = String(body.index || body.category || "").trim();
        const content = String(body.content || body.description || "").trim();
        if (!index || !content) {
          return NextResponse.json(
            {
              error: {
                code: "invalid_memory",
                message: "A memory 'index' and 'description' are required.",
              },
            },
            { status: 400 }
          );
        }
        const updated = await updateMemoryByIndex(dbClient, {
          userId,
          category: index,
          content,
          importance: normalizeImportance(body.importance),
          newCategory: body.newIndex || body.new_category,
        });
        return NextResponse.json({ ok: true, memory: updated });
      }

      if (action === "delete_memory") {
        const index = String(body.index || body.category || "").trim();
        if (!index) {
          return NextResponse.json(
            {
              error: {
                code: "invalid_memory",
                message: "A memory 'index' is required.",
              },
            },
            { status: 400 }
          );
        }
        await deleteMemoryByIndex(dbClient, userId, index);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json(
        { error: { code: "invalid_action", message: "Unknown settings action." } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed" } },
      { status: 405 }
    );
  } catch (err: unknown) {
    console.error("[RoseServer] Settings error:", err);
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to handle settings request.",
        },
      },
      { status: 500 }
    );
  }
}
