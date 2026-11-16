import { NextResponse } from "next/server";
import { recordAndCheckUsage } from "@mono/database";
import { resolveRequestAuth } from "../security/guard";

const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25 MB max audio payload

/**
 * Handles speech-to-text audio transcription requests using faster-whisper-ts.
 * Accepts multipart/form-data with an 'audio' or 'file' field, or a base64 JSON payload.
 * Enforces API request quotas and payload size bounds.
 */
export async function handleRoseTranscribe(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed. Use POST." } },
      { status: 405 }
    );
  }

  try {
    const auth = await resolveRequestAuth(req);
    const quota = await recordAndCheckUsage({
      userId: auth.userId,
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
            message: "Audio transcription rate limit exceeded.",
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

    let audioBuffer: Buffer | null = null;
    let language: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("audio") || formData.get("file");
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

    if (audioBuffer.length > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        {
          error: {
            code: "payload_too_large",
            message: "Audio payload exceeds maximum allowed size of 25 MB.",
          },
        },
        { status: 413 }
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
          text: transcriptText,
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
          message:
            err instanceof Error ? err.message : "Failed to process audio transcription.",
        },
      },
      { status: 500 }
    );
  }
}
