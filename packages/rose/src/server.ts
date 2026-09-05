import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  runAgentChat,
  runAgentChatStream,
  formatErrorCallout,
  type ChatMessage,
} from "./agent/agentRunner";
import { checkAndIncrementRoseUsage, getRoseUsage } from "./usage/usage";
import {
  createClient,
  listMemories,
  saveMemory,
  updateMemory,
  deleteMemory,
  getPersonalization,
  savePersonalization,
} from "@mono/database";
import { createClient as createServerSupabaseClient } from "@mono/database/server";
import { createLangfuseTrace } from "./agent/langfuse";
import { setRememberToolContext, clearRememberToolContext } from "./agent/tools/remember";

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

    // Retrieve user's stored long-term memories and personalization
    let userMemories: any[] = [];
    let userPersonalization: any = null;
    const dbClient = clientOverride || createClient();

    try {
      userMemories = await listMemories(dbClient, { userId, limit: 20 });
    } catch (_memErr) {
      // ignore memory retrieval errors gracefully
    }

    try {
      userPersonalization = await getPersonalization(dbClient, userId);
    } catch (_pErr) {
      // ignore personalization retrieval errors gracefully
    }

    setRememberToolContext(userId, dbClient);

    // Build context sections to steer all prompts
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
        contextSections.push(`[Context: User Personalization & Preferences]\n${pItems.join("\n")}`);
      }
    }

    if (userMemories.length > 0) {
      const memoryBullets = userMemories
        .map((m) => `- [${m.category || "memory"}]: ${m.content}`)
        .join("\n");
      contextSections.push(`[Context: Long-Term User Memories & Knowledge]\n${memoryBullets}`);
    }

    const memoryAugmentedHistory: ChatMessage[] = [...history];
    if (contextSections.length > 0) {
      const combinedContext = `${contextSections.join("\n\n")}\n\nStrictly adhere to these personalization rules and user memories across all responses.`;
      
      const hasSystemContext = memoryAugmentedHistory.some(
        (h) =>
          h.role === "user" &&
          h.parts.some(
            (p) =>
              p.text?.includes("[Context: User Personalization & Preferences]") ||
              p.text?.includes("[Context: Long-Term User Memories & Knowledge]") ||
              p.text?.includes("[Context: Long-Term User Memories & Preferences]")
          )
      );

      if (!hasSystemContext) {
        memoryAugmentedHistory.unshift({
          role: "user",
          parts: [{ text: combinedContext }],
        });
        memoryAugmentedHistory.unshift({
          role: "model",
          parts: [{ text: "Understood. I have loaded your personalization guidelines and long-term memories into active context. <emotion>happy</emotion>" }],
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
                clearRememberToolContext();
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
            clearRememberToolContext();
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
            clearRememberToolContext();
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
      clearRememberToolContext();
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

export async function handleRoseSettings(req: Request): Promise<Response> {
  try {
    const authResult = await getAuthUser(req);
    const user = authResult?.user;
    const clientOverride = authResult?.supabaseClient;
    const userId = user?.id || "00000000-0000-0000-0000-000000000001";
    const dbClient = clientOverride || createClient();

    if (req.method === "GET") {
      const [memories, personalization] = await Promise.all([
        listMemories(dbClient, { userId, limit: 100 }),
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
        const newMemory = await saveMemory(dbClient, {
          userId,
          content: body.content,
          category: body.category,
          importance: body.importance,
        });
        return NextResponse.json({ ok: true, memory: newMemory });
      }

      if (action === "update_memory") {
        const updated = await updateMemory(dbClient, {
          id: Number(body.id),
          userId,
          content: body.content,
          category: body.category,
          importance: body.importance,
        });
        return NextResponse.json({ ok: true, memory: updated });
      }

      if (action === "delete_memory") {
        await deleteMemory(dbClient, {
          id: Number(body.id),
          userId,
        });
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

/**
 * Handles speech-to-text audio transcription requests using faster-whisper-ts.
 * Accepts multipart/form-data with an 'audio' file or base64 JSON payload.
 * Gracefully reports unsupported native platform/missing model if native CTranslate2
 * binary is unavailable, prompting client fallback to Web Speech API.
 */
export async function handleRoseTranscribe(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed. Use POST." } },
      { status: 405 }
    );
  }

  try {
    let audioBuffer: Buffer | null = null;
    let language: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("audio");
      language = (formData.get("language") as string) || undefined;

      if (audioFile && typeof audioFile === "object" && "arrayBuffer" in audioFile) {
        const arrayBuf = await (audioFile as Blob).arrayBuffer();
        audioBuffer = Buffer.from(arrayBuf);
      }
    } else if (contentType.includes("application/json")) {
      const json = await req.json().catch(() => ({}));
      language = json.language;
      if (json.audioBase64 && typeof json.audioBase64 === "string") {
        audioBuffer = Buffer.from(json.audioBase64, "base64");
      }
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return NextResponse.json(
        { error: { code: "bad_request", message: "Audio payload is required." } },
        { status: 400 }
      );
    }

    // Attempt to transcribe using faster-whisper-ts
    try {
      const fasterWhisper = await import("faster-whisper-ts");
      const { WhisperModel } = fasterWhisper;

      if (typeof WhisperModel === "function") {
        const modelPath = process.env.FASTER_WHISPER_MODEL_PATH || "tiny.en";
        const device = process.env.FASTER_WHISPER_DEVICE || "cpu";
        const computeType = process.env.FASTER_WHISPER_COMPUTE_TYPE || "int8";

        const model = new WhisperModel(modelPath, device, 0, computeType);

        const [segments] = await model.transcribe(
          audioBuffer,
          {},
          language as any,
          "transcribe"
        );

        const transcriptText = Array.isArray(segments)
          ? segments.map((s: any) => s.text).join(" ").trim()
          : "";

        return NextResponse.json({
          ok: true,
          transcript: transcriptText,
          provider: "faster-whisper",
        });
      }
    } catch (whisperErr: any) {
      console.warn(
        "[RoseTranscribe] faster-whisper-ts unavailable or error, reporting fallback:",
        whisperErr?.message || whisperErr
      );
      return NextResponse.json(
        {
          ok: false,
          fallbackToClient: true,
          error: {
            code: "whisper_unavailable",
            message:
              whisperErr instanceof Error
                ? whisperErr.message
                : "faster-whisper-ts native engine is currently unavailable in this environment.",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        fallbackToClient: true,
        error: {
          code: "whisper_unavailable",
          message: "faster-whisper-ts could not be initialized.",
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[RoseTranscribe] Unexpected error:", err);
    return NextResponse.json(
      {
        error: {
          code: "transcription_error",
          message: err instanceof Error ? err.message : "Failed to process audio transcription.",
        },
      },
      { status: 500 }
    );
  }
}
