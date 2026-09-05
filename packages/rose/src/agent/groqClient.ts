export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqStreamChunk {
  textChunk?: string;
  finishReason?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export function parseGroqErrorText(status: number, rawText: string): string {
  if (!rawText) return `HTTP ${status}`;
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.error?.message) {
      return parsed.error.message.trim();
    }
    if (parsed.message) {
      return parsed.message.trim();
    }
  } catch {
    // not JSON
  }
  return rawText.trim();
}

export async function callGroqWithUsage(
  messages: GroqMessage[],
  temperature = 0.5
): Promise<{ content: string; usage?: { input: number; output: number; total: number } }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in server environment variables.");
  }

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const rawError = await response.text().catch(() => "");
    const errorMsg = parseGroqErrorText(response.status, rawError);
    throw new Error(`Groq API Error (${response.status}): ${errorMsg}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || "",
    usage: data.usage
      ? {
          input: data.usage.prompt_tokens,
          output: data.usage.completion_tokens,
          total: data.usage.total_tokens,
        }
      : undefined,
  };
}

export async function callGroq(
  messages: GroqMessage[],
  temperature = 0.5
): Promise<string> {
  const result = await callGroqWithUsage(messages, temperature);
  return result.content;
}

export async function* callGroqStream(
  messages: GroqMessage[],
  temperature = 0.5
): AsyncGenerator<GroqStreamChunk> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in server environment variables.");
  }

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 4096,
      stream: true,
      stream_options: {
        include_usage: true,
      },
    }),
  });

  if (!response.ok) {
    const rawError = await response.text().catch(() => "");
    const errorMsg = parseGroqErrorText(response.status, rawError);
    throw new Error(`Groq API Error (${response.status}): ${errorMsg}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Groq API response body stream reader unavailable");
  }

  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) continue;

        if (trimmed === "data: [DONE]") {
          return;
        }

        if (trimmed.startsWith("data: ")) {
          const jsonStr = trimmed.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.usage) {
              yield { usage: parsed.usage };
            }
            const delta = parsed.choices?.[0]?.delta;
            if (delta?.content) {
              yield { textChunk: delta.content };
            }
            const finishReason = parsed.choices?.[0]?.finish_reason;
            if (finishReason) {
              yield { finishReason };
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function buildGroqToolPrompt(
  toolResults: Array<{ name: string; args: Record<string, unknown>; outputJson: string }>,
  userMessage: string
): GroqMessage[] {
  const systemPrompt = `You are "Rose", an intelligent, empathetic, and highly capable AI assistant.
You are synthesizing tool processing results for the user.
The user asked: "${userMessage}".
The main agent called one or more tools, and the outputs were captured as structured JSON.

Your Task:
- Carefully inspect and analyze the structured tool output JSON provided below.
- Synthesize, explain, and format a complete, helpful, and accurate response directly addressing the user's inquiry.
- Use rich Obsidian-flavored Markdown (headings, callout notes > [!note], > [!tip], > [!info], bold/highlight text ==key term==, markdown links, code blocks, or tables where appropriate).
- If additional tool actions or interactive questions are helpful, you may emit tool calls or structured actions.
- Conclude your response with an emotion tag <emotion>EMOTION_NAME</emotion> on the last line. Choose strictly from: happy, bright, coding, confused, researching, sad, sleeping, surprised, thinking.`;

  const toolPayloadFormatted = toolResults
    .map(
      (t, i) =>
        `### Tool Call [${i + 1}]: ${t.name}\n**Input Arguments:**\n\`\`\`json\n${JSON.stringify(t.args, null, 2)}\n\`\`\`\n**Output JSON:**\n\`\`\`json\n${t.outputJson}\n\`\`\``
    )
    .join("\n\n");

  const userContent = `Here are the tool outputs in JSON format:\n\n${toolPayloadFormatted}\n\nPlease process this data and provide the final synthesized response to the user.`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];
}
