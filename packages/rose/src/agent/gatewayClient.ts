export interface GatewayPart {
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
  functionResponse?: {
    name: string;
    response: Record<string, unknown>;
  };
}

export interface GatewayContent {
  role: "user" | "model" | "tool" | "system" | "assistant";
  parts: GatewayPart[];
}

export interface GatewayToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface GatewayStreamChunk {
  textChunk?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
  finishReason?: string;
  rawCandidate?: unknown;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

// Backwards-compatible type aliases
export type GeminiPart = GatewayPart;
export type GeminiContent = GatewayContent;
export type GeminiToolDeclaration = GatewayToolDeclaration;
export type GeminiStreamChunk = GatewayStreamChunk;

export const DEFAULT_GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
export const DEFAULT_GATEWAY_MODEL = "openai/gpt-6-astra";

export function getAiGatewayApiKey(): string | undefined {
  return (
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_AI_GATEWAY_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}

export function getAiGatewayModel(): string {
  return (
    process.env.AI_GATEWAY_MODEL ||
    process.env.GEMINI_MODEL ||
    DEFAULT_GATEWAY_MODEL
  );
}

export function parseGatewayErrorText(status: number, rawText: string): string {
  if (!rawText) return `HTTP ${status}`;
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.error?.message) {
      const codeStr = parsed.error.code ? `[${parsed.error.code}] ` : "";
      return `${codeStr}${parsed.error.message.trim()}`;
    }
    if (parsed.message) {
      return parsed.message.trim();
    }
  } catch {
    // not JSON
  }
  return rawText.trim();
}

export function formatOpenAiMessages(
  systemInstruction: string,
  contents: GatewayContent[]
): Array<{ role: string; content?: string | null; tool_calls?: any[]; tool_call_id?: string; name?: string }> {
  const messages: Array<{
    role: string;
    content?: string | null;
    tool_calls?: any[];
    tool_call_id?: string;
    name?: string;
  }> = [];

  if (systemInstruction && systemInstruction.trim()) {
    messages.push({
      role: "system",
      content: systemInstruction.trim(),
    });
  }

  for (const item of contents) {
    const role = item.role === "model" ? "assistant" : item.role;

    if (role === "tool") {
      for (const part of item.parts) {
        if (part.functionResponse) {
          messages.push({
            role: "tool",
            tool_call_id: `call_${part.functionResponse.name}`,
            name: part.functionResponse.name,
            content: JSON.stringify(part.functionResponse.response),
          });
        } else if (part.text) {
          messages.push({
            role: "user",
            content: part.text,
          });
        }
      }
      continue;
    }

    const textParts = item.parts.filter((p) => p.text).map((p) => p.text).join("\n");
    const funcCalls = item.parts
      .filter((p) => p.functionCall)
      .map((p, idx) => ({
        id: `call_${p.functionCall!.name}_${idx}`,
        type: "function",
        function: {
          name: p.functionCall!.name,
          arguments: JSON.stringify(p.functionCall!.args || {}),
        },
      }));

    if (role === "assistant") {
      messages.push({
        role: "assistant",
        content: textParts || (funcCalls.length > 0 ? null : ""),
        tool_calls: funcCalls.length > 0 ? funcCalls : undefined,
      });
    } else {
      messages.push({
        role: role === "system" ? "system" : "user",
        content: textParts || "",
      });
    }
  }

  return messages;
}

export function formatOpenAiTools(
  tools?: GatewayToolDeclaration[]
): Array<{ type: "function"; function: { name: string; description: string; parameters: Record<string, unknown> } }> | undefined {
  if (!tools || tools.length === 0) return undefined;
  return tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: (t.parameters || { type: "object", properties: {} }) as Record<string, unknown>,
    },
  }));
}

export async function callAiGateway(
  systemInstruction: string,
  contents: GatewayContent[],
  tools?: GatewayToolDeclaration[]
): Promise<any> {
  const apiKey = getAiGatewayApiKey();
  if (!apiKey) {
    console.warn("[AiGatewayClient] No AI_GATEWAY_API_KEY found in server environment variables.");
    throw new Error("Missing AI_GATEWAY_API_KEY in server environment variables.");
  }

  const model = getAiGatewayModel();
  const url = process.env.AI_GATEWAY_URL || DEFAULT_GATEWAY_URL;

  const requestBody: Record<string, unknown> = {
    model,
    messages: formatOpenAiMessages(systemInstruction, contents),
    temperature: 0.7,
    max_tokens: 4096,
  };

  const formattedTools = formatOpenAiTools(tools);
  if (formattedTools && formattedTools.length > 0) {
    requestBody.tools = formattedTools;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      const parsedMsg = parseGatewayErrorText(res.status, errorText);
      console.error(`[AiGatewayClient] API Error ${res.status}:`, parsedMsg);
      throw new Error(`Vercel AI Gateway API Error (${res.status}): ${parsedMsg}`);
    }

    const data: any = await res.json();
    const choice = data.choices?.[0];
    const message = choice?.message;
    const parts: GatewayPart[] = [];

    if (message?.content) {
      parts.push({ text: message.content });
    }

    if (message?.tool_calls && Array.isArray(message.tool_calls)) {
      for (const tc of message.tool_calls) {
        let args: Record<string, unknown> = {};
        try {
          args = typeof tc.function?.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function?.arguments || {};
        } catch {
          args = {};
        }
        parts.push({
          functionCall: {
            name: tc.function?.name || "",
            args,
          },
        });
      }
    }

    const usageMeta = data.usage
      ? {
          promptTokenCount: data.usage.prompt_tokens,
          candidatesTokenCount: data.usage.completion_tokens,
          totalTokenCount: data.usage.total_tokens,
        }
      : undefined;

    return {
      candidates: [
        {
          content: {
            role: "model",
            parts,
          },
          finishReason: choice?.finish_reason,
        },
      ],
      usageMetadata: usageMeta,
      raw: data,
    };
  } catch (err) {
    console.error("[AiGatewayClient] Network/Fetch Error:", err);
    throw err;
  }
}

export async function* callAiGatewayStream(
  systemInstruction: string,
  contents: GatewayContent[],
  tools?: GatewayToolDeclaration[]
): AsyncGenerator<GatewayStreamChunk> {
  const apiKey = getAiGatewayApiKey();
  if (!apiKey) {
    console.warn("[AiGatewayClient] No AI_GATEWAY_API_KEY found in server environment variables.");
    throw new Error("Missing AI_GATEWAY_API_KEY in server environment variables.");
  }

  const model = getAiGatewayModel();
  const url = process.env.AI_GATEWAY_URL || DEFAULT_GATEWAY_URL;

  const requestBody: Record<string, unknown> = {
    model,
    messages: formatOpenAiMessages(systemInstruction, contents),
    temperature: 0.7,
    max_tokens: 4096,
    stream: true,
    stream_options: {
      include_usage: true,
    },
  };

  const formattedTools = formatOpenAiTools(tools);
  if (formattedTools && formattedTools.length > 0) {
    requestBody.tools = formattedTools;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok || !res.body) {
      const errorText = await res.text().catch(() => "");
      const parsedMsg = parseGatewayErrorText(res.status, errorText);
      console.error(`[AiGatewayClient] Streaming API Error ${res.status}:`, parsedMsg);
      throw new Error(`Vercel AI Gateway Streaming API Error (${res.status}): ${parsedMsg}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const pendingToolCalls: Map<number, { name: string; argsJson: string }> = new Map();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith("data:")) continue;

        const dataStr = line.slice(5).trim();
        if (!dataStr || dataStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(dataStr);
          const choice = parsed.choices?.[0];
          const delta = choice?.delta;

          if (delta?.content) {
            yield { textChunk: delta.content, rawCandidate: parsed };
          }

          if (delta?.tool_calls && Array.isArray(delta.tool_calls)) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              const existing = pendingToolCalls.get(idx) || { name: "", argsJson: "" };
              if (tc.function?.name) {
                existing.name = tc.function.name;
              }
              if (tc.function?.arguments) {
                existing.argsJson += tc.function.arguments;
              }
              pendingToolCalls.set(idx, existing);
            }
          }

          if (parsed.usage) {
            yield {
              usageMetadata: {
                promptTokenCount: parsed.usage.prompt_tokens,
                candidatesTokenCount: parsed.usage.completion_tokens,
                totalTokenCount: parsed.usage.total_tokens,
              },
              rawCandidate: parsed,
            };
          }

          if (choice?.finish_reason) {
            if (pendingToolCalls.size > 0) {
              for (const [, toolCall] of pendingToolCalls.entries()) {
                let parsedArgs: Record<string, unknown> = {};
                try {
                  parsedArgs = toolCall.argsJson ? JSON.parse(toolCall.argsJson) : {};
                } catch {
                  parsedArgs = {};
                }
                yield {
                  functionCall: {
                    name: toolCall.name,
                    args: parsedArgs,
                  },
                  rawCandidate: parsed,
                };
              }
              pendingToolCalls.clear();
            }

            yield { finishReason: choice.finish_reason, rawCandidate: parsed };
          }
        } catch (err) {
          console.warn("[AiGatewayClient] Error parsing stream chunk:", err);
        }
      }
    }

    if (pendingToolCalls.size > 0) {
      for (const [, toolCall] of pendingToolCalls.entries()) {
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = toolCall.argsJson ? JSON.parse(toolCall.argsJson) : {};
        } catch {
          parsedArgs = {};
        }
        yield {
          functionCall: {
            name: toolCall.name,
            args: parsedArgs,
          },
        };
      }
      pendingToolCalls.clear();
    }
  } catch (err) {
    console.error("[AiGatewayClient] Stream Network Error:", err);
    throw err;
  }
}

// Backwards-compatible aliases for legacy imports
export const callGemini = callAiGateway;
export const callGeminiStream = callAiGatewayStream;
