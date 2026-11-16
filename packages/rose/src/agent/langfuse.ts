import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";

export interface LangfuseConfig {
  publicKey?: string;
  secretKey?: string;
  baseUrl?: string;
}

export interface TraceOptions {
  name?: string;
  userId?: string;
  sessionId?: string;
  environment?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  input?: unknown;
}

export interface UsageDetails {
  input?: number;
  output?: number;
  total?: number;
}

export type ObservationType =
  | "generation"
  | "span"
  | "tool"
  | "agent"
  | "retriever"
  | "event"
  | "chain";

export interface GenerationRecord {
  id: string;
  name: string;
  model: string;
  startTime: string;
  endTime?: string;
  parentObservationId?: string;
  promptName?: string;
  promptVersion?: number;
  input: unknown;
  output?: unknown;
  metadata?: Record<string, unknown>;
  usage?: UsageDetails;
  level?: "DEFAULT" | "ERROR" | "WARNING";
  statusMessage?: string;
}

export interface SpanRecord {
  id: string;
  name: string;
  type: ObservationType;
  startTime: string;
  endTime?: string;
  parentObservationId?: string;
  input: unknown;
  output?: unknown;
  metadata?: Record<string, unknown>;
  level?: "DEFAULT" | "ERROR" | "WARNING";
  statusMessage?: string;
}

function hexBytes(n: number): string {
  return randomBytes(n).toString("hex");
}

function toUnixNano(isoDateOrMs: string | number): string {
  const ms = typeof isoDateOrMs === "number" ? isoDateOrMs : new Date(isoDateOrMs).getTime();
  return (BigInt(ms) * BigInt(1000000)).toString();
}

function safeJsonString(val: unknown): string {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val;
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export class RoseLangfuseTrace {
  public readonly traceId: string; // 32 hex chars for OTLP compliance
  public readonly rootSpanId: string; // 16 hex chars
  private readonly config: LangfuseConfig;
  private readonly startTime: string;
  private readonly environment: string;
  private readonly traceName: string;
  private endTime?: string;
  private input: unknown;
  private output?: unknown;
  private userId?: string;
  private sessionId?: string;
  private metadata: Record<string, unknown> = {};
  private tags: string[] = [];
  private generations: GenerationRecord[] = [];
  private spans: SpanRecord[] = [];

  constructor(options: TraceOptions, config?: LangfuseConfig) {
    this.traceId = hexBytes(16);
    this.rootSpanId = hexBytes(8);
    this.startTime = new Date().toISOString();
    this.traceName = options.name || "rose-turn";
    this.userId = options.userId;
    this.sessionId = options.sessionId;
    this.environment = options.environment || process.env.NODE_ENV || "development";
    this.metadata = options.metadata || {};
    this.tags = options.tags || ["rose"];
    this.input = options.input;

    this.config = {
      publicKey: config?.publicKey || process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: config?.secretKey || process.env.LANGFUSE_SECRET_KEY,
      baseUrl: (
        config?.baseUrl ||
        process.env.LANGFUSE_BASE_URL ||
        process.env.LANGFUSE_HOST ||
        process.env.LANGFUSE_BASEURL ||
        "https://cloud.langfuse.com"
      ).replace(/\/$/, ""),
    };
  }

  public isEnabled(): boolean {
    return Boolean(this.config.publicKey && this.config.secretKey);
  }

  public startGeneration(
    name: string,
    model: string,
    input: unknown,
    metadata?: Record<string, unknown>,
    parentObservationId?: string,
    promptOptions?: { promptName?: string; promptVersion?: number }
  ): string {
    const id = hexBytes(8);
    this.generations.push({
      id,
      name,
      model,
      startTime: new Date().toISOString(),
      parentObservationId: parentObservationId || this.rootSpanId,
      promptName: promptOptions?.promptName,
      promptVersion: promptOptions?.promptVersion,
      input,
      metadata,
    });
    return id;
  }

  public endGeneration(
    id: string,
    output: unknown,
    statusMessage?: string,
    isError = false,
    usage?: UsageDetails
  ): void {
    const gen = this.generations.find((g) => g.id === id);
    if (gen) {
      gen.endTime = new Date().toISOString();
      gen.output = output;
      if (usage) gen.usage = usage;
      if (statusMessage) gen.statusMessage = statusMessage;
      if (isError) gen.level = "ERROR";
    }
  }

  public startSpan(
    name: string,
    input: unknown,
    metadata?: Record<string, unknown>,
    parentObservationId?: string,
    type: ObservationType = "span"
  ): string {
    const id = hexBytes(8);
    // If name begins with 'tool-', default type to 'tool'
    const actualType = type === "span" && name.startsWith("tool-") ? "tool" : type;
    this.spans.push({
      id,
      name,
      type: actualType,
      startTime: new Date().toISOString(),
      parentObservationId: parentObservationId || this.rootSpanId,
      input,
      metadata,
    });
    return id;
  }

  public startToolObservation(
    toolName: string,
    args: unknown,
    metadata?: Record<string, unknown>,
    parentObservationId?: string
  ): string {
    return this.startSpan(
      `tool-${toolName}`,
      args,
      { ...metadata, "gen_ai.tool.name": toolName },
      parentObservationId,
      "tool"
    );
  }

  public endSpan(id: string, output: unknown, statusMessage?: string, isError = false): void {
    const span = this.spans.find((s) => s.id === id);
    if (span) {
      span.endTime = new Date().toISOString();
      span.output = output;
      if (statusMessage) span.statusMessage = statusMessage;
      if (isError) span.level = "ERROR";
    }
  }

  public async complete(output: unknown, additionalMetadata?: Record<string, unknown>): Promise<void> {
    this.endTime = new Date().toISOString();
    this.output = output;
    if (additionalMetadata) {
      this.metadata = { ...this.metadata, ...additionalMetadata };
    }

    if (this.isEnabled()) {
      try {
        await this.flush();
      } catch (err: any) {
        console.warn("[Langfuse] Ingestion background error:", err?.message || err);
      }
    }
  }

  public async flush(): Promise<void> {
    if (!this.isEnabled()) return;

    const rootStartTimeNano = toUnixNano(this.startTime);
    const rootEndTimeNano = toUnixNano(this.endTime || new Date().toISOString());

    const rootSpanAttributes: Array<{ key: string; value: any }> = [
      { key: "langfuse.trace.name", value: { stringValue: this.traceName } },
      { key: "langfuse.observation.type", value: { stringValue: "agent" } },
    ];

    if (this.userId) {
      rootSpanAttributes.push({ key: "user.id", value: { stringValue: this.userId } });
    }
    if (this.sessionId) {
      rootSpanAttributes.push({ key: "session.id", value: { stringValue: this.sessionId } });
    }
    if (this.tags.length > 0) {
      rootSpanAttributes.push({ key: "langfuse.trace.tags", value: { stringValue: this.tags.join(",") } });
    }
    if (this.input !== undefined) {
      rootSpanAttributes.push({
        key: "langfuse.observation.input",
        value: { stringValue: safeJsonString(this.input) },
      });
    }
    if (this.output !== undefined) {
      rootSpanAttributes.push({
        key: "langfuse.observation.output",
        value: { stringValue: safeJsonString(this.output) },
      });
    }
    if (this.metadata && Object.keys(this.metadata).length > 0) {
      rootSpanAttributes.push({
        key: "langfuse.trace.metadata",
        value: { stringValue: safeJsonString(this.metadata) },
      });
    }

    const otelSpans: any[] = [
      {
        traceId: this.traceId,
        spanId: this.rootSpanId,
        name: this.traceName,
        kind: 1, // SPAN_KIND_INTERNAL
        startTimeUnixNano: rootStartTimeNano,
        endTimeUnixNano: rootEndTimeNano,
        attributes: rootSpanAttributes,
      },
    ];

    // Generations
    for (const gen of this.generations) {
      const genAttrs: Array<{ key: string; value: any }> = [
        { key: "langfuse.observation.type", value: { stringValue: "generation" } },
        { key: "gen_ai.request.model", value: { stringValue: gen.model } },
        { key: "langfuse.generation.model", value: { stringValue: gen.model } },
      ];

      if (gen.promptName) {
        genAttrs.push({ key: "langfuse.prompt.name", value: { stringValue: gen.promptName } });
      }
      if (gen.promptVersion) {
        genAttrs.push({ key: "langfuse.prompt.version", value: { intValue: gen.promptVersion } });
      }
      if (gen.input !== undefined) {
        genAttrs.push({
          key: "langfuse.observation.input",
          value: { stringValue: safeJsonString(gen.input) },
        });
      }
      if (gen.output !== undefined) {
        genAttrs.push({
          key: "langfuse.observation.output",
          value: { stringValue: safeJsonString(gen.output) },
        });
      }
      if (gen.usage) {
        if (typeof gen.usage.input === "number") {
          genAttrs.push({ key: "gen_ai.usage.input_tokens", value: { intValue: gen.usage.input } });
        }
        if (typeof gen.usage.output === "number") {
          genAttrs.push({ key: "gen_ai.usage.output_tokens", value: { intValue: gen.usage.output } });
        }
      }
      if (gen.metadata && Object.keys(gen.metadata).length > 0) {
        genAttrs.push({
          key: "langfuse.observation.metadata",
          value: { stringValue: safeJsonString(gen.metadata) },
        });
      }
      if (gen.statusMessage) {
        genAttrs.push({
          key: "langfuse.observation.statusMessage",
          value: { stringValue: gen.statusMessage },
        });
      }

      otelSpans.push({
        traceId: this.traceId,
        spanId: gen.id,
        parentSpanId: gen.parentObservationId || this.rootSpanId,
        name: gen.name,
        kind: 1,
        startTimeUnixNano: toUnixNano(gen.startTime),
        endTimeUnixNano: toUnixNano(gen.endTime || gen.startTime),
        attributes: genAttrs,
        status: gen.level === "ERROR" ? { code: 2, message: gen.statusMessage || "Error" } : { code: 1 },
      });
    }

    // Spans and Tool Observations
    for (const span of this.spans) {
      const spanAttrs: Array<{ key: string; value: any }> = [
        { key: "langfuse.observation.type", value: { stringValue: span.type } },
      ];

      if (span.type === "tool") {
        const cleanToolName = span.name.replace(/^tool-/, "");
        spanAttrs.push({ key: "gen_ai.tool.name", value: { stringValue: cleanToolName } });
      }
      if (span.input !== undefined) {
        spanAttrs.push({
          key: "langfuse.observation.input",
          value: { stringValue: safeJsonString(span.input) },
        });
      }
      if (span.output !== undefined) {
        spanAttrs.push({
          key: "langfuse.observation.output",
          value: { stringValue: safeJsonString(span.output) },
        });
      }
      if (span.metadata && Object.keys(span.metadata).length > 0) {
        spanAttrs.push({
          key: "langfuse.observation.metadata",
          value: { stringValue: safeJsonString(span.metadata) },
        });
      }
      if (span.statusMessage) {
        spanAttrs.push({
          key: "langfuse.observation.statusMessage",
          value: { stringValue: span.statusMessage },
        });
      }

      otelSpans.push({
        traceId: this.traceId,
        spanId: span.id,
        parentSpanId: span.parentObservationId || this.rootSpanId,
        name: span.name,
        kind: 1,
        startTimeUnixNano: toUnixNano(span.startTime),
        endTimeUnixNano: toUnixNano(span.endTime || span.startTime),
        attributes: spanAttrs,
        status: span.level === "ERROR" ? { code: 2, message: span.statusMessage || "Error" } : { code: 1 },
      });
    }

    const otelPayload = {
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: "service.name", value: { stringValue: "rose-ai" } },
              { key: "service.version", value: { stringValue: "1.0.0" } },
              { key: "deployment.environment", value: { stringValue: this.environment } },
            ],
          },
          scopeSpans: [
            {
              scope: { name: "rose-agent", version: "1.0.0" },
              spans: otelSpans,
            },
          ],
        },
      ],
    };

    const authHeader = `Basic ${Buffer.from(
      `${this.config.publicKey}:${this.config.secretKey}`
    ).toString("base64")}`;

    const url = `${this.config.baseUrl}/api/public/otel/v1/traces`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "x-langfuse-ingestion-version": "4",
        },
        body: JSON.stringify(otelPayload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`[Langfuse] OTel Ingestion error status ${res.status}: ${text}`);
      }
    } catch (fetchErr) {
      console.warn("[Langfuse] Network error sending trace:", fetchErr);
    }
  }
}

export function createLangfuseTrace(options: TraceOptions, config?: LangfuseConfig): RoseLangfuseTrace {
  return new RoseLangfuseTrace(options, config);
}
