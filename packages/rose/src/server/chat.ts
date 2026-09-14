import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  runAgentChat,
  runAgentChatStream,
  formatErrorCallout,
  type ChatMessage,
} from "../agent/agentRunner";
import { checkAndIncrementRoseUsage } from "../usage/usage";
import { listMemoryIndexes, getPersonalization } from "@mono/database";
import { createClient as createServerSupabaseClient } from "@mono/database/server";
import { createLangfuseTrace } from "../agent/langfuse";
import { setMemoryToolContext, clearMemoryToolContext } from "../agent/tools/memory-store";
import {
  PERSONALIZATION_CONTEXT_MARKER,
  buildMemoryIndexContext,
  hasMemoryContext,
} from "../agent/memoryContext";
import { createClient } from "@mono/database";

export async function getAuthUser(
  req: Request
): Promise<{ user: any; supabaseClient: any } | null> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token && token !== "mock-access-token") {
      try {
        const supabaseUrl =
          process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey =
          process.env.SUPABASE_SECRET_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY!;

        const supabase = createSupabaseClient(
          supabaseUrl,
          supabaseKey,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );
        const {
          data: { user },
        } = await supabase.auth.getUser(token);
        if (user) return { user, supabaseClient: supabase };
      } catch {
        // ignore
      }
    }
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return { user, supabaseClient: supabase };
  } catch {
    // ignore
  }

  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) {
    return {
      user: { id: headerUserId, roles: [] },
      supabaseClient: createClient(),
    };
  }

  return null;
}

export async function handleRoseChat(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const wantsStream =
      req.headers.get("accept")?.includes("text/event-stream") ||
      body.stream === true ||
      body.stream !== false;

    if (!message) {
      return NextResponse.json(
        { error: { code: "bad_request", message: "A 'message' string is required." } },
        { status: 400 }
      );
    }

    const authResult = await getAuthUser(req);
    const user = authResult?.user;
    const clientOverride = authResult?.supabaseClient;
    const userId = user?.id || "00000000-0000-0000-0000-000000000001";
    const userRoles = (user as any)?.roles || (user?.is_anonymous ? ["guest"] : []);

    const usage = await checkAndIncrementRoseUsage(userId, userRoles, clientOverride);
    if (!usage.allowed) {
      const limitReason =
        usage.exceededType === "daily"
          ? `Daily message quota reached (${usage.dailyCount}/${usage.dailyLimit}).`
          : `Weekly message quota reached (${usage.count}/${usage.limit}).`;

      if (wantsStream) {
        const encoder = new TextEncoder();
        const payload = `data: ${JSON.stringify({
          type: "done",
          text: `> [!warning] Quota Limit Reached\n> ${limitReason}`,
          emotion: "sleeping",
          traces: ["quota_limit"],
          usage,
        })}\n\n`;
        return new Response(encoder.encode(payload), {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
          },
        });
      }

      return NextResponse.json(
        {
          error: { code: "usage_limit_exceeded", message: limitReason },
          text: `> [!warning] Quota Limit Reached\n> ${limitReason}`,
          emotion: "sleeping",
          usage,
        },
        { status: 429 }
      );
    }

    const langfuseTrace = createLangfuseTrace({
      userId,
      sessionId: typeof body.conversationId === "string" ? body.conversationId : undefined,
      input: message,
      tags: ["rose", user?.is_anonymous ? "guest" : "authenticated"],
      metadata: {
        wantsStream,
        roles: userRoles,
      },
    });

    let memoryIndexes: any[] = [];
    let userPersonalization: any = null;
    const dbClient = clientOverride || createClient();

    try {
      memoryIndexes = await listMemoryIndexes(dbClient, { userId });
    } catch (_memErr) {
      // ignore memory retrieval errors gracefully
    }

    try {
      userPersonalization = await getPersonalization(dbClient, userId);
    } catch (_pErr) {
      // ignore personalization retrieval errors gracefully
    }

    setMemoryToolContext(userId, dbClient);

    const contextSections: string[] = [];

    if (userPersonalization) {
      const pItems: string[] = [];
      if (userPersonalization.nickname) {
        pItems.push(`- User's Preferred Nickname/Name: ${userPersonalization.nickname}`);
      }
      if (userPersonalization.tone) {
        pItems.push(`- Desired Tone & Style: ${userPersonalization.tone}`);
      }
      if (userPersonalization.custom_instructions) {
        pItems.push(`- Custom Instructions:\n${userPersonalization.custom_instructions}`);
      }
      if (pItems.length > 0) {
        contextSections.push(`${PERSONALIZATION_CONTEXT_MARKER}\n${pItems.join("\n")}`);
      }
    }

    const memoryIndexContext = buildMemoryIndexContext(memoryIndexes);
    if (memoryIndexContext) {
      contextSections.push(memoryIndexContext);
    }

    const memoryAugmentedHistory: ChatMessage[] = [...history];
    if (contextSections.length > 0) {
      const combinedContext = `${contextSections.join("\n\n")}\n\nStrictly adhere to these personalization rules and user memories across all responses.`;

      const hasSystemContext =
        hasMemoryContext(memoryAugmentedHistory) ||
        memoryAugmentedHistory.some(
          (h) =>
            h.role === "user" &&
            h.parts.some((p) => p.text?.includes(PERSONALIZATION_CONTEXT_MARKER))
        );

      if (!hasSystemContext) {
        memoryAugmentedHistory.unshift({
          role: "user",
          parts: [{ text: combinedContext }],
        });
        memoryAugmentedHistory.unshift({
          role: "model",
          parts: [{ text: "Understood. I have loaded your personalization guidelines and long-term memory indexes into active context. <emotion>happy</emotion>" }],
        });
      }
    }

    if (wantsStream) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const send = (data: any) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          };

          try {
            for await (const event of runAgentChatStream(memoryAugmentedHistory, message, langfuseTrace)) {
              if (event.type === "done") {
                clearMemoryToolContext();
                await langfuseTrace.complete(event.text, {
                  emotion: event.emotion,
                  traces: event.traces,
                });
                send({
                  ...event,
                  usage,
                });
              } else {
                send(event);
              }
            }
          } catch (streamErr: any) {
            clearMemoryToolContext();
            const errorMsg = streamErr?.message || String(streamErr) || "Stream processing failed";
            console.error("[RoseServer] Stream processing error:", errorMsg);
            await langfuseTrace.complete(null, { error: errorMsg });
            send({
              type: "error",
              message: errorMsg,
              text: formatErrorCallout("System Error", errorMsg),
              emotion: "sad",
            });
          } finally {
            clearMemoryToolContext();
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    let result: any;
    try {
      result = await runAgentChat(memoryAugmentedHistory, message, undefined, langfuseTrace);
      await langfuseTrace.complete(result.text, {
        emotion: result.emotion,
        traces: result.traces,
      });
    } catch (chatErr: any) {
      await langfuseTrace.complete(null, { error: chatErr?.message || String(chatErr) });
      throw chatErr;
    } finally {
      clearMemoryToolContext();
    }

    return NextResponse.json({
      text: result.text,
      history: result.history,
      traces: result.traces,
      emotion: result.emotion,
      optionsPayload: result.optionsPayload || null,
      usage,
    });
  } catch (err: unknown) {
    console.error("[RoseServer] Chat error:", err);
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Internal server error occurred.",
        },
        text: "> [!danger] Error Encountered\n> An unexpected server error occurred. Please try again.",
        emotion: "sad",
      },
      { status: 500 }
    );
  }
}