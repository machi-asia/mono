import type { GeminiContent, GeminiStreamChunk } from "./geminiClient";
import type { GroqMessage, GroqStreamChunk } from "./groqClient";

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const OLLAMA_DEFAULT_BASE_URL = "http://localhost:11434";
const OLLAMA_DEFAULT_MODEL = "qwen2.5:3b";
const OLLAMA_REQUEST_TIMEOUT_MS = 180_000;
const OLLAMA_CONNECT_TIMEOUT_MS = 10_000;
const OLLAMA_STREAM_IDLE_TIMEOUT_MS = 60_000;

const TOOL_EMIT_HINT = `
Tool Calling Format (CRITICAL):
When you need to use one of the tools listed above (webSearch, askQuestion, learn, recall, remember, forget), do NOT describe it in prose. Instead, output the tool call as a standalone JSON block using the "action"/"action_input" pair, without surrounding explanation:

\`\`\`json
{"action": "webSearch", "action_input": {"query": "latest Next.js release"}}
\`\`\`

Then wait for the tool result before continuing your final response.
Each tool may be called at most once per user turn. After you receive a tool_response for a tool, immediately produce your final answer using that result — never request the same tool twice, never echo a tool call you already made, and never propose additional tools unless the user explicitly asks.`;
const MAX_OLLAMA_HISTORY_CHARS = 24_000;

let cachedModelPromise: Promise<string> | null = null;
let cachedBaseUrl = "";

export function shouldUseOllamaProvider(): boolean {
  const flag = (process.env.OLLAMA_ENABLED || "auto").trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return !process.env.VERCEL_URL;
}

export function resolveOllamaBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL?.trim() || OLLAMA_DEFAULT_BASE_URL;
}

async function detectOllamaModel(baseUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/tags`, {
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        const models: Array<{ name?: string; model?: string }> = data.models || [];
        const qwen = models.find((m) =>
          String(m.name || m.model || "").toLowerCase().includes("qwen")
        );
        const name = qwen?.name || qwen?.model;
        if (name) {
          return name;
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  } catch (err: any) {
    console.warn(`[OllamaClient] Failed to auto-detect model from ${baseUrl}: ${err?.message || err}`);
  }

  const explicit = process.env.OLLAMA_MODEL?.trim();
  if (explicit) {
    return explicit;
  }

  return OLLAMA_DEFAULT_MODEL;
}

export async function getOllamaModelLabel(): Promise<string> {
  const baseUrl = resolveOllamaBaseUrl();
  if (!cachedModelPromise || cachedBaseUrl !== baseUrl) {
    cachedBaseUrl = baseUrl;
    cachedModelPromise = detectOllamaModel(baseUrl);
  }
  return cachedModelPromise;
}

function safeStringify(value: unknown): string {
  try {
    return typeof value === "string" ? value : JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

export function toOllamaMessages(
  systemInstruction: string,
  contents: GeminiContent[]
): OllamaChatMessage[] {
  const messages: OllamaChatMessage[] = [{ role: "system", content: systemInstruction + TOOL_EMIT_HINT }];

  for (const content of contents) {
    let role: "user" | "assistant" = content.role === "model" ? "assistant" : "user";
    const lines: string[] = [];

    for (const part of content.parts) {
      if (typeof part.text === "string" && part.text.trim()) {
        lines.push(part.text.trim());
      } else if (part.functionCall) {
        lines.push(`tool_call ${part.functionCall.name}(${safeStringify(part.functionCall.args)})`);
      } else if (part.functionResponse) {
        const raw = (part.functionResponse.response as any)?.content;
        const payload = typeof raw === "string" ? raw : part.functionResponse.response;
        lines.push(`tool_response(${part.functionResponse.name}): ${safeStringify(payload)}`);
      }
    }

    if (content.role === "tool" && lines.length > 0) {
      role = "user";
    }

    if (lines.length > 0) {
      const merged = { role, content: lines.join("\n\n") };
      const prev = messages[messages.length - 1];
      if (prev && prev.role === merged.role) {
        prev.content = `${prev.content}\n\n${merged.content}`;
      } else {
        messages.push(merged);
      }
    }
  }

  return trimOllamaMessages(messages);
}

function trimOllamaMessages(messages: OllamaChatMessage[]): OllamaChatMessage[] {
  const total = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (total <= MAX_OLLAMA_HISTORY_CHARS || messages.length <= 1) {
    return messages;
  }

  const system = messages[0];
  const firstUserIndex = messages.findIndex((m) => m.role === "user");
  const head: OllamaChatMessage[] = firstUserIndex > 0 ? [messages[firstUserIndex]] : [];

  const tail: OllamaChatMessage[] = [];
  let length = head.reduce((sum, m) => sum + m.content.length, 0);
  for (let i = messages.length - 1; i >= 0; i--) {
    if (i === firstUserIndex) continue;
    const m = messages[i];
    if (tail.length > 0 && length + m.content.length > MAX_OLLAMA_HISTORY_CHARS) {
      break;
    }
    tail.push(m);
    length += m.content.length;
  }
  tail.reverse();

  return [system, ...head, ...tail];
}

function buildOllamaRequest(
  model: string,
  messages: OllamaChatMessage[],
  stream: boolean
): Record<string, unknown> {
  return {
    model,
    messages,
    stream,
    keep_alive: "10m",
    options: {
      temperature: 0.7,
      num_predict: 4096,
      num_ctx: 4096,
    },
  };
}

function toUsage(promptTokens?: number, evalTokens?: number) {
  if (promptTokens == null) return undefined;
  const input = promptTokens;
  const output = evalTokens || 0;
  return { input, output, total: input + output };
}

export async function callOllamaChat(
  systemInstruction: string,
  contents: GeminiContent[]
): Promise<{ candidates: Array<{ content: { parts: Array<{ text: string }> } }> }> {
  const baseUrl = resolveOllamaBaseUrl();
  const model = await getOllamaModelLabel();
  const messages = toOllamaMessages(systemInstruction, contents);

  const res = await withTimeout(
    fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOllamaRequest(model, messages, false)),
    }),
    OLLAMA_REQUEST_TIMEOUT_MS,
    "Ollama chat"
  );

  if (!res.ok) {
    const rawError = await res.text().catch(() => "");
    throw new Error(`Ollama API Error (${res.status}): ${rawError || "Ollama request failed."}`);
  }

  const data = await res.json();
  const text = data?.message?.content || "";
  return { candidates: [{ content: { parts: [{ text }] } }] };
}

export async function* callOllamaStream(
  systemInstruction: string,
  contents: GeminiContent[]
): AsyncGenerator<GeminiStreamChunk> {
  const baseUrl = resolveOllamaBaseUrl();
  const model = await getOllamaModelLabel();
  const messages = toOllamaMessages(systemInstruction, contents);

  const res = await withTimeout(
    fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOllamaRequest(model, messages, true)),
    }),
    OLLAMA_CONNECT_TIMEOUT_MS,
    "Ollama stream connect"
  );

  if (!res.ok || !res.body) {
    const rawError = !res.ok ? await res.text().catch(() => "") : "";
    throw new Error(`Ollama API Error (${res.status}): ${rawError || "Ollama stream unavailable."}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let promptTokens: number | undefined;
  let evalTokens: number | undefined;

  try {
    while (true) {
      const { done, value } = await withTimeout(
        reader.read(),
        OLLAMA_STREAM_IDLE_TIMEOUT_MS,
        "Ollama stream"
      );
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let parsed: any;
        try {
          parsed = JSON.parse(trimmed);
        } catch {
          continue;
        }

        if (parsed.error) {
          throw new Error(typeof parsed.error === "string" ? parsed.error : "Ollama stream error.");
        }

        if (parsed.prompt_eval_count != null) promptTokens = parsed.prompt_eval_count;
        if (parsed.eval_count != null) evalTokens = parsed.eval_count;

        const deltaText = parsed.message?.content;
        if (deltaText) {
          yield { textChunk: deltaText, rawCandidate: parsed };
        }

        if (parsed.done) {
          if (parsed.prompt_eval_count != null) promptTokens = parsed.prompt_eval_count;
          if (parsed.eval_count != null) evalTokens = parsed.eval_count;
          if (promptTokens != null) {
            yield {
              usageMetadata: {
                promptTokenCount: promptTokens,
                candidatesTokenCount: evalTokens || 0,
                totalTokenCount: promptTokens + (evalTokens || 0),
              },
              rawCandidate: parsed,
            };
          }
          yield { finishReason: "stop", rawCandidate: parsed };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function callOllamaMessagesChat(
  messages: GroqMessage[],
  temperature = 0.5
): Promise<{ content: string; usage?: { input: number; output: number; total: number } }> {
  const baseUrl = resolveOllamaBaseUrl();
  const model = await getOllamaModelLabel();
  const chatMessages: OllamaChatMessage[] = messages.map((m) => ({ role: m.role, content: m.content }));

  const res = await withTimeout(
    fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...buildOllamaRequest(model, chatMessages, false),
        options: { temperature, num_predict: 4096 },
      }),
    }),
    OLLAMA_REQUEST_TIMEOUT_MS,
    "Ollama messages chat"
  );

  if (!res.ok) {
    const rawError = await res.text().catch(() => "");
    throw new Error(`Ollama API Error (${res.status}): ${rawError || "Ollama request failed."}`);
  }

  const data = await res.json();
  return {
    content: data?.message?.content || "",
    usage: toUsage(data?.prompt_eval_count, data?.eval_count),
  };
}

export async function* callOllamaMessagesStream(
  messages: GroqMessage[],
  temperature = 0.5
): AsyncGenerator<GroqStreamChunk> {
  const baseUrl = resolveOllamaBaseUrl();
  const model = await getOllamaModelLabel();
  const chatMessages: OllamaChatMessage[] = messages.map((m) => ({ role: m.role, content: m.content }));

  const res = await withTimeout(
    fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...buildOllamaRequest(model, chatMessages, true),
        options: { temperature, num_predict: 4096 },
      }),
    }),
    OLLAMA_CONNECT_TIMEOUT_MS,
    "Ollama messages stream connect"
  );

  if (!res.ok || !res.body) {
    const rawError = !res.ok ? await res.text().catch(() => "") : "";
    throw new Error(`Ollama API Error (${res.status}): ${rawError || "Ollama stream unavailable."}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let promptTokens: number | undefined;
  let evalTokens: number | undefined;

  try {
    while (true) {
      const { done, value } = await withTimeout(
        reader.read(),
        OLLAMA_STREAM_IDLE_TIMEOUT_MS,
        "Ollama stream"
      );
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let parsed: any;
        try {
          parsed = JSON.parse(trimmed);
        } catch {
          continue;
        }

        if (parsed.error) {
          throw new Error(typeof parsed.error === "string" ? parsed.error : "Ollama stream error.");
        }

        if (parsed.prompt_eval_count != null) promptTokens = parsed.prompt_eval_count;
        if (parsed.eval_count != null) evalTokens = parsed.eval_count;

        const deltaText = parsed.message?.content;
        if (deltaText) {
          yield { textChunk: deltaText };
        }

        if (parsed.done) {
          const usage = toUsage(promptTokens, evalTokens);
          if (usage) {
            yield {
              usage: {
                prompt_tokens: usage.input,
                completion_tokens: usage.output,
                total_tokens: usage.total,
              },
            };
          }
          yield { finishReason: "stop" };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}