export interface GeminiPart {
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

export interface GeminiContent {
  role: "user" | "model" | "tool";
  parts: GeminiPart[];
}

export interface GeminiToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface GeminiStreamChunk {
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

function parseGeminiErrorText(status: number, rawText: string): string {
  if (!rawText) return `HTTP ${status}`;
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.error?.message) {
      const codeStr = parsed.error.status ? `[${parsed.error.status}] ` : "";
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

export async function callGemini(
  systemInstruction: string,
  contents: GeminiContent[],
  tools?: GeminiToolDeclaration[]
): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.warn("[GeminiClient] No GEMINI_API_KEY found in server environment variables.");
    throw new Error("Missing GEMINI_API_KEY (or GOOGLE_API_KEY) in server environment variables.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody: Record<string, unknown> = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  if (tools && tools.length > 0) {
    requestBody.tools = [
      {
        function_declarations: tools,
      },
    ];
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      const parsedMsg = parseGeminiErrorText(res.status, errorText);
      console.error(`[GeminiClient] API Error ${res.status}:`, parsedMsg);
      throw new Error(`Google Gemini API Error (${res.status}): ${parsedMsg}`);
    }

    return await res.json();
  } catch (err) {
    console.error("[GeminiClient] Network/Fetch Error:", err);
    throw err;
  }
}

export async function* callGeminiStream(
  systemInstruction: string,
  contents: GeminiContent[],
  tools?: GeminiToolDeclaration[]
): AsyncGenerator<GeminiStreamChunk> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.warn("[GeminiClient] No GEMINI_API_KEY found in server environment variables.");
    throw new Error("Missing GEMINI_API_KEY (or GOOGLE_API_KEY) in server environment variables.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const requestBody: Record<string, unknown> = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  if (tools && tools.length > 0) {
    requestBody.tools = [
      {
        function_declarations: tools,
      },
    ];
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok || !res.body) {
      const errorText = await res.text().catch(() => "");
      const parsedMsg = parseGeminiErrorText(res.status, errorText);
      console.error(`[GeminiClient] Streaming API Error ${res.status}:`, parsedMsg);
      throw new Error(`Google Gemini Streaming API Error (${res.status}): ${parsedMsg}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

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
          const candidate = parsed.candidates?.[0];
          if (!candidate) continue;

          const parts = candidate.content?.parts || [];
          for (const part of parts) {
            if (part.text) {
              yield { textChunk: part.text, rawCandidate: candidate };
            }
            if (part.functionCall) {
              yield { functionCall: part.functionCall, rawCandidate: candidate };
            }
          }

          if (parsed.usageMetadata) {
            yield { usageMetadata: parsed.usageMetadata, rawCandidate: candidate };
          }

          if (candidate.finishReason) {
            yield { finishReason: candidate.finishReason, rawCandidate: candidate };
          }
        } catch (err) {
          console.warn("[GeminiClient] Error parsing stream chunk:", err);
        }
      }
    }
  } catch (err) {
    console.error("[GeminiClient] Stream Network Error:", err);
    throw err;
  }
}
