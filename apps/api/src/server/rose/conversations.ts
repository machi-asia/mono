import { NextResponse } from "next/server";
import { resolveRequestAuth } from "../security/guard";
import { getRoseChatStore, type StoredRoseConversation } from "./chat-store";

export async function handleRoseConversations(req: Request): Promise<Response> {
  try {
    const auth = await resolveRequestAuth(req);
    const store = await getRoseChatStore();
    const userId = auth.userId;

    if (req.method === "GET") {
      const conversations = await store.getUserConversations(userId);
      return NextResponse.json({
        ok: true,
        userId,
        conversations,
      });
    }

    if (req.method === "POST" || req.method === "PUT") {
      const body = (await req.json().catch(() => ({}))) as {
        conversations?: StoredRoseConversation[];
        originApp?: string;
      };

      if (!Array.isArray(body.conversations)) {
        return NextResponse.json(
          { error: { code: "bad_request", message: "An array of 'conversations' is required." } },
          { status: 400 }
        );
      }

      const meta = {
        email: (auth.user?.email as string | undefined) ?? null,
        name:
          (auth.user?.user_metadata?.full_name as string | undefined) ||
          (auth.user?.user_metadata?.name as string | undefined) ||
          (auth.isAnonymous ? "Guest" : (auth.user?.email as string | undefined)?.split("@")[0] || "User"),
        isGuest: auth.isAnonymous,
        role: auth.role,
        originApp: typeof body.originApp === "string" ? body.originApp : "rose",
      };

      await store.saveUserConversations(userId, body.conversations, meta);
      const saved = await store.getUserConversations(userId);
      return NextResponse.json({
        ok: true,
        count: saved.length,
        conversations: saved,
      });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      let id = url.searchParams.get("id");
      if (!id) {
        const body = (await req.json().catch(() => ({}))) as { id?: string };
        id = body.id || null;
      }

      if (!id) {
        return NextResponse.json(
          { error: { code: "bad_request", message: "Conversation 'id' is required." } },
          { status: 400 }
        );
      }

      const deleted = await store.deleteConversation(userId, id);
      return NextResponse.json({ ok: true, deleted });
    }

    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed" } },
      { status: 405 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to handle Rose conversations",
        },
      },
      { status: 500 }
    );
  }
}
