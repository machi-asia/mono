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
  startTime: string;
  endTime?: string;
  parentObservationId?: string;
  input: unknown;
  output?: unknown;
  metadata?: Record<string, unknown>;
  level?: "DEFAULT" | "ERROR" | "WARNING";
  statusMessage?: string;
}

export class RoseLangfuseTrace {
  public readonly traceId: string;
  private readonly config: LangfuseConfig;
  private readonly startTime: string;
  private readonly environment: string;
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
    this.traceId = `rose-trace-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.startTime = new Date().toISOString();
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
    const id = `gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.generations.push({
      id,
      name,
      model,
      startTime: new Date().toISOString(),
      parentObservationId,
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
    parentObservationId?: string
  ): string {
    const id = `span-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.spans.push({
      id,
      name,
      startTime: new Date().toISOString(),
      parentObservationId,
      input,
      metadata,
    });
    return id;
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

    const events: any[] = [
      {
        id: `evt-trace-${this.traceId}`,
        type: "trace-create",
        timestamp: this.startTime,
        body: {
          id: this.traceId,
          name: "rose-turn",
          userId: this.userId,
          sessionId: this.sessionId,
          environment: this.environment,
          release: "0.17.0",
          version: "1.0.0",
          metadata: this.metadata,
          tags: this.tags,
          input: this.input,
          output: this.output,
          timestamp: this.startTime,
        },
      },
    ];

    for (const gen of this.generations) {
      events.push({
        id: `evt-${gen.id}`,
        type: "generation-create",
        timestamp: gen.startTime,
        body: {
          id: gen.id,
          traceId: this.traceId,
          parentObservationId: gen.parentObservationId,
          name: gen.name,
          model: gen.model,
          promptName: gen.promptName,
          promptVersion: gen.promptVersion,
          environment: this.environment,
          startTime: gen.startTime,
          endTime: gen.endTime,
          input: gen.input,
          output: gen.output,
          metadata: gen.metadata,
          usage: gen.usage
            ? {
                input: gen.usage.input || 0,
                output: gen.usage.output || 0,
                total: gen.usage.total || (gen.usage.input || 0) + (gen.usage.output || 0),
              }
            : undefined,
          level: gen.level || "DEFAULT",
          statusMessage: gen.statusMessage,
        },
      });
    }

    for (const span of this.spans) {
      events.push({
        id: `evt-${span.id}`,
        type: "span-create",
        timestamp: span.startTime,
        body: {
          id: span.id,
          traceId: this.traceId,
          parentObservationId: span.parentObservationId,
          name: span.name,
          environment: this.environment,
          startTime: span.startTime,
          endTime: span.endTime,
          input: span.input,
          output: span.output,
          metadata: span.metadata,
          level: span.level || "DEFAULT",
          statusMessage: span.statusMessage,
        },
      });
    }

    const authHeader = `Basic ${Buffer.from(
      `${this.config.publicKey}:${this.config.secretKey}`
    ).toString("base64")}`;

    const url = `${this.config.baseUrl}/api/public/ingestion`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ batch: events }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`[Langfuse] Ingestion error status ${res.status}: ${text}`);
      }
    } catch (fetchErr) {
      console.warn("[Langfuse] Network error sending trace:", fetchErr);
    }
  }
}

export function createLangfuseTrace(options: TraceOptions, config?: LangfuseConfig): RoseLangfuseTrace {
  return new RoseLangfuseTrace(options, config);
}
