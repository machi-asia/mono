import { NextResponse } from "next/server";
import {
  createMemory,
  updateMemoryByIndex,
  deleteMemoryByIndex,
  listMemoryIndexes,
  getPersonalization,
  savePersonalization,
  normalizeImportance,
  createClient,
} from "@mono/database";
import { getAuthUser } from "./chat";

export async function handleRoseSettings(req: Request): Promise<Response> {
  try {
    const authResult = await getAuthUser(req);
    const user = authResult?.user;
    const clientOverride = authResult?.supabaseClient;
    const userId = user?.id || "00000000-0000-0000-0000-000000000001";
    const dbClient = clientOverride || createClient();

    if (req.method === "GET") {
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
      const body = await req.json().catch(() => ({}));
      const action = body.action;

      if (action === "save_personalization") {
        const saved = await savePersonalization(dbClient, {
          userId,
          customInstructions: body.customInstructions,
          nickname: body.nickname,
          tone: body.tone,
        });
        return NextResponse.json({ ok: true, personalization: saved });
      }

      if (action === "add_memory") {
        const index = String(body.index || body.category || "").trim();
        const content = String(body.content || body.description || "").trim();
        if (!index || !content) {
          return NextResponse.json(
            { error: { code: "invalid_memory", message: "A memory 'index' and 'description' are required." } },
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
            { error: { code: "invalid_memory", message: "A memory 'index' and 'description' are required." } },
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
            { error: { code: "invalid_memory", message: "A memory 'index' is required." } },
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