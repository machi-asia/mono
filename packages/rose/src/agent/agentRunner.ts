import { callGemini, callGeminiStream, type GeminiContent, type GeminiPart, type GeminiToolDeclaration } from "./geminiClient";
import { callGroq, callGroqStream, callGroqWithUsage, buildGroqToolPrompt } from "./groqClient";
import { TOOLS, getToolByName } from "./tools";
import { ROSE_EMOTIONS, extractEmotion } from "./roseEmotions";
import { RoseLangfuseTrace } from "./langfuse";

export { ROSE_EMOTIONS, extractEmotion };

export interface ParsedErrorInfo {
  code?: string | number;
  status?: string;
  message: string;
  rawDetails?: string;
}

export function parseErrorDetails(errorInput: unknown): ParsedErrorInfo {
  if (!errorInput) {
    return { message: "An unknown error occurred." };
  }

  const rawStr =
    typeof errorInput === "string"
      ? errorInput
      : (errorInput as any)?.message || JSON.stringify(errorInput);

  // Check if string contains JSON substring
  const jsonMatch = rawStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error) {
        const errObj = parsed.error;
        return {
          code: errObj.code || (rawStr.match(/\((\d{3})\)/) ? RegExp.$1 : undefined),
          status: errObj.status,
          message: errObj.message || "An unexpected error was returned by the AI provider.",
          rawDetails: JSON.stringify(parsed, null, 2),
        };
      }
      if (parsed.message) {
        return {
          code: parsed.code || parsed.status,
          status: parsed.status,
          message: parsed.message,
          rawDetails: JSON.stringify(parsed, null, 2),
        };
      }
    } catch {
      // ignore
    }
  }

  // Check for HTTP / Status code in plain string
  const statusMatch = rawStr.match(/(?:Error|HTTP)\s*(?:\((\d+)\)|:\s*(\d{3}))/i);
  const code = statusMatch ? statusMatch[1] || statusMatch[2] : undefined;
  const statusStrMatch = rawStr.match(/\[([A-Z_]{4,})\]/);
  const status = statusStrMatch ? statusStrMatch[1] : undefined;

  let cleanMsg = rawStr;
  if (statusStrMatch) {
    cleanMsg = cleanMsg.replace(/\[[A-Z_]{4,}\]\s*/, "");
  }
  if (statusMatch) {
    cleanMsg = cleanMsg.replace(/^.*?(?:Error|HTTP).*?:\s*/i, "");
  }

  return {
    code,
    status,
    message: cleanMsg.trim() || rawStr.trim(),
    rawDetails: rawStr.length > 80 ? rawStr.trim() : undefined,
  };
}

export function formatErrorCallout(
  title: string,
  details: unknown,
  footer = "Error has been sent to admin for logging, we apologies for the issue"
): string {
  const parsed = parseErrorDetails(details);
  const lines: string[] = [];

  // 1. Separate Code & Status Badges
  if (parsed.code || parsed.status) {
    const badges = [
      parsed.code ? `**Code:** \`${parsed.code}\`` : null,
      parsed.status ? `**Status:** \`${parsed.status}\`` : null,
    ]
      .filter(Boolean)
      .join("  •  ");
    lines.push(`> ${badges}`);
    lines.push(`>`);
  }

  // 2. Separate Message paragraph (ensuring multi-line text is fully quoted)
  const messageLines = parsed.message.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < messageLines.length; i++) {
    const mLine = messageLines[i];
    if (i === 0) {
      lines.push(`> **Message:** ${mLine}`);
    } else {
      lines.push(mLine.trim() ? `> ${mLine}` : `>`);
    }
  }

  // 3. Separate Accordion for Raw Details
  if (parsed.rawDetails && parsed.rawDetails !== parsed.message) {
    lines.push(`>`);
    lines.push(`> > [!bug]- View Diagnostic Details`);
    const isJson = parsed.rawDetails.startsWith("{") || parsed.rawDetails.startsWith("[");
    const lang = isJson ? "json" : "text";
    lines.push(`> > \`\`\`${lang}`);
    for (const rawLine of parsed.rawDetails.replace(/\r\n/g, "\n").split("\n")) {
      lines.push(`> > ${rawLine}`);
    }
    lines.push(`> > \`\`\``);
  }

  // 4. Footer Note
  if (footer) {
    lines.push(`>`);
    for (const fLine of footer.replace(/\r\n/g, "\n").split("\n")) {
      lines.push(fLine.trim() ? `> ${fLine}` : `>`);
    }
  }

  return `> [!danger] ${title}\n${lines.join("\n")} <emotion>sad</emotion>`;
}

const TOOL_LABEL_MAP: Record<string, string> = {
  webSearch: "searching the web",
  askQuestion: "prompting choices",
  remember: "saving to memory",
  rememberTool: "saving to memory",
};

export interface ExtractedToolCall {
  name: string;
  args: Record<string, unknown>;
}

export function extractToolCallsFromText(rawText: string): {
  cleanText: string;
  toolCalls: ExtractedToolCall[];
  optionsPayload?: RunAgentResult["optionsPayload"];
} {
  if (!rawText) return { cleanText: "", toolCalls: [] };

  let text = rawText;
  const toolCalls: ExtractedToolCall[] = [];
  let optionsPayload: RunAgentResult["optionsPayload"] = undefined;

  const handleToolCandidate = (parsed: any) => {
    if (!parsed || typeof parsed !== "object") return;
    const name = parsed.action || parsed.name || parsed.tool || parsed.function;
    if (typeof name !== "string") return;

    let args: Record<string, unknown> = {};
    if (parsed.action_input && typeof parsed.action_input === "object") {
      args = parsed.action_input;
    } else if (parsed.parameters && typeof parsed.parameters === "object") {
      args = parsed.parameters;
    } else if (parsed.args && typeof parsed.args === "object") {
      args = parsed.args;
    } else if (parsed.arguments && typeof parsed.arguments === "object") {
      args = parsed.arguments;
    } else {
      const { action, name: _n, tool, function: _f, ...rest } = parsed;
      args = rest;
    }

    toolCalls.push({ name, args });

    if (name === "askQuestion") {
      const q = (args as any).question;
      const opts = (args as any).options;
      if (q && Array.isArray(opts)) {
        optionsPayload = {
          question: String(q).trim(),
          options: opts.map((opt: unknown) => String(opt).trim()).filter(Boolean),
          allowMultiple: Boolean((args as any).allowMultiple),
        };
      }
    }
  };

  // 1. Match markdown code fences ```json ... ``` or ``` ... ``` containing tool action signatures
  const fenceRegex = /```(?:json)?\s*([\s\S]*?"(?:action|name|tool|function)"\s*:\s*"[^"]+"[\s\S]*?)```/gi;
  text = text.replace(fenceRegex, (_match, innerJson) => {
    const trimmed = innerJson.trim();
    try {
      const parsed = JSON.parse(trimmed);
      handleToolCandidate(parsed);
      return "";
    } catch {
      // Fallback regex parsing for malformed askQuestion or webSearch
      const nameMatch = trimmed.match(/"(?:action|name|tool|function)"\s*:\s*"([^"]+)"/);
      if (nameMatch) {
        const toolName = nameMatch[1];
        if (toolName === "askQuestion") {
          const qMatch = trimmed.match(/"question"\s*:\s*"([^"]+)"/);
          const optsMatch = trimmed.match(/"options"\s*:\s*\[([\s\S]*?)\]/);
          if (qMatch && optsMatch) {
            const question = qMatch[1];
            const options = Array.from(optsMatch[1].matchAll(/"([^"]+)"/g)).map((m: any) => m[1]);
            if (options.length > 0) {
              const allowMultiple = /"allowMultiple"\s*:\s*true/i.test(trimmed);
              optionsPayload = { question, options, allowMultiple };
              toolCalls.push({ name: "askQuestion", args: { question, options, allowMultiple } });
              return "";
            }
          }
        } else if (toolName === "webSearch") {
          const qMatch = trimmed.match(/"query"\s*:\s*"([^"]+)"/);
          if (qMatch) {
            toolCalls.push({ name: "webSearch", args: { query: qMatch[1] } });
            return "";
          }
        } else if (toolName === "remember" || toolName === "rememberTool") {
          const cMatch = trimmed.match(/"content"\s*:\s*"([^"]+)"/);
          if (cMatch) {
            const catMatch = trimmed.match(/"category"\s*:\s*"([^"]+)"/);
            const impMatch = trimmed.match(/"importance"\s*:\s*"([^"]+)"/);
            toolCalls.push({
              name: "remember",
              args: {
                content: cMatch[1],
                category: catMatch ? catMatch[1] : undefined,
                importance: impMatch ? impMatch[1] : undefined,
              },
            });
            return "";
          }
        }
      }
    }
    return _match;
  });

  // 2. Balanced brace scanner for standalone JSON objects in text
  let searchIdx = 0;
  while (searchIdx < text.length) {
    const keyMatch = text.slice(searchIdx).match(/"(?:action|name|tool|function)"\s*:\s*"([^"]+)"/);
    if (!keyMatch || keyMatch.index === undefined) break;

    const absoluteKeyIdx = searchIdx + keyMatch.index;
    const openBraceIndex = text.lastIndexOf("{", absoluteKeyIdx);
    if (openBraceIndex === -1) {
      searchIdx = absoluteKeyIdx + keyMatch[0].length;
      continue;
    }

    let depth = 0;
    let closeBraceIndex = -1;
    let inString = false;
    let escape = false;

    for (let i = openBraceIndex; i < text.length; i++) {
      const char = text[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === "\\") {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === "{") depth++;
        else if (char === "}") {
          depth--;
          if (depth === 0) {
            closeBraceIndex = i;
            break;
          }
        }
      }
    }

    if (closeBraceIndex !== -1) {
      const candidateJson = text.substring(openBraceIndex, closeBraceIndex + 1);
      let consumed = false;
      try {
        const parsed = JSON.parse(candidateJson);
        handleToolCandidate(parsed);
        text = text.substring(0, openBraceIndex) + text.substring(closeBraceIndex + 1);
        searchIdx = openBraceIndex;
        consumed = true;
      } catch {
        const toolName = keyMatch[1];
        if (toolName === "askQuestion") {
          const qMatch = candidateJson.match(/"question"\s*:\s*"([^"]+)"/);
          const optsMatch = candidateJson.match(/"options"\s*:\s*\[([\s\S]*?)\]/);
          if (qMatch && optsMatch) {
            const question = qMatch[1];
            const options = Array.from(optsMatch[1].matchAll(/"([^"]+)"/g)).map((m: any) => m[1]);
            if (options.length > 0) {
              const allowMultiple = /"allowMultiple"\s*:\s*true/i.test(candidateJson);
              if (!optionsPayload) {
                optionsPayload = { question, options, allowMultiple };
              }
              toolCalls.push({ name: "askQuestion", args: { question, options, allowMultiple } });
              text = text.substring(0, openBraceIndex) + text.substring(closeBraceIndex + 1);
              searchIdx = openBraceIndex;
              consumed = true;
            }
          }
        } else if (toolName === "remember" || toolName === "rememberTool") {
          const cMatch = candidateJson.match(/"content"\s*:\s*"([^"]+)"/);
          if (cMatch) {
            const catMatch = candidateJson.match(/"category"\s*:\s*"([^"]+)"/);
            const impMatch = candidateJson.match(/"importance"\s*:\s*"([^"]+)"/);
            toolCalls.push({
              name: "remember",
              args: {
                content: cMatch[1],
                category: catMatch ? catMatch[1] : undefined,
                importance: impMatch ? impMatch[1] : undefined,
              },
            });
            text = text.substring(0, openBraceIndex) + text.substring(closeBraceIndex + 1);
            searchIdx = openBraceIndex;
            consumed = true;
          }
        }
      }
      if (!consumed) {
        searchIdx = closeBraceIndex + 1;
      }
    } else {
      searchIdx = absoluteKeyIdx + keyMatch[0].length;
    }
  }

  return {
    cleanText: text.trim(),
    toolCalls,
    optionsPayload,
  };
}

export type AgentStreamEvent =
  | { type: "trace"; trace: string; tool?: string; description?: string; emotion?: string }
  | { type: "delta"; text: string }
  | {
      type: "done";
      text: string;
      emotion: string;
      traces: string[];
      optionsPayload?: RunAgentResult["optionsPayload"];
      history: ChatMessage[];
    }
  | { type: "error"; message: string; text?: string; emotion?: string };

export function sanitizeHistory(history: ChatMessage[]): GeminiContent[] {
  const sanitized: GeminiContent[] = [];

  for (const msg of history) {
    if (!msg || !msg.parts || msg.parts.length === 0) continue;

    const textParts: string[] = [];
    for (const part of msg.parts) {
      if (typeof part.text === "string" && part.text.trim()) {
        textParts.push(part.text.trim());
      } else if (part.functionResponse) {
        const rawContent = part.functionResponse.response?.content;
        let formattedContent = typeof rawContent === "string" ? rawContent : JSON.stringify(part.functionResponse.response);
        try {
          const parsed = typeof rawContent === "string" ? JSON.parse(rawContent) : part.functionResponse.response;
          if (Array.isArray(parsed?.results)) {
            formattedContent = `Web Search Results for "${parsed.query || ""}":\n` +
              parsed.results.map((r: any, idx: number) => `${idx + 1}. ${r.title} (${r.url})\n   ${r.snippet}`).join("\n");
          }
        } catch {
          // ignore
        }
        textParts.push(formattedContent);
      }
    }

    if (textParts.length === 0) continue;

    const role: "user" | "model" = msg.role === "tool" || msg.role === "user" ? "user" : "model";
    const combinedText = textParts.join("\n\n");

    const prev = sanitized[sanitized.length - 1];
    if (prev && prev.role === role) {
      const prevText = prev.parts[0]?.text || "";
      prev.parts = [{ text: `${prevText}\n\n${combinedText}` }];
    } else {
      sanitized.push({
        role,
        parts: [{ text: combinedText }],
      });
    }
  }

  while (sanitized.length > 0 && sanitized[0].role !== "user") {
    sanitized.shift();
  }

  return sanitized;
}

export function toCleanHistory(history: ChatMessage[]): ChatMessage[] {
  const clean: ChatMessage[] = [];
  for (const msg of history) {
    if (!msg || !msg.parts) continue;
    const textParts = msg.parts
      .map((p) => (typeof p.text === "string" ? p.text.trim() : ""))
      .filter((t) => Boolean(t) && !t.startsWith("[Rose used tool"));
    if (textParts.length > 0 && (msg.role === "user" || msg.role === "model")) {
      clean.push({
        role: msg.role,
        parts: [{ text: textParts.join("\n\n") }],
      });
    }
  }
  return clean;
}

export async function* runAgentChatStream(
  history: ChatMessage[],
  newMessageText: string,
  trace?: RoseLangfuseTrace
): AsyncGenerator<AgentStreamEvent> {
  const traces: string[] = [];
  const addTrace = (label: string) => {
    traces.push(label);
  };

  addTrace("thinking");
  yield {
    type: "trace",
    trace: "thinking",
    description: "Thinking",
    emotion: "thinking",
  };

  const activeHistory: ChatMessage[] = [...history];
  if (newMessageText) {
    activeHistory.push({
      role: "user",
      parts: [{ text: newMessageText }],
    });
  }

  const toolDeclarations: GeminiToolDeclaration[] = TOOLS.map(
    (t) => t.declaration as GeminiToolDeclaration
  );

  let loopCount = 0;
  const maxLoops = 8;
  let accumulatedText = "";
  let optionsPayload: RunAgentResult["optionsPayload"] = undefined;
  let lastErrorMessage = "";

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    const fallbackText = formatErrorCallout(
      "Configuration Error",
      "Missing `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in server environment variables. Please configure this key in `.env.local`.",
      "Error has been sent to admin for logging, we apologies for the issue"
    );
    const { cleanText, emotion } = extractEmotion(fallbackText);
    yield {
      type: "done",
      text: cleanText,
      emotion: emotion || "sad",
      traces,
      history: activeHistory,
    };
    return;
  }

  while (loopCount < maxLoops) {
    loopCount++;

    const currentTurnFunctionCalls: Array<{ name: string; args: Record<string, unknown> }> = [];
    let currentTurnText = "";

    const geminiInputPrompt = [
      { role: "system", content: ROSE_SYSTEM_INSTRUCTION },
      ...activeHistory.map((m) => ({
        role: m.role,
        content: m.parts.map((p) => p.text || JSON.stringify(p.functionCall || p.functionResponse || "")).join("\n"),
      })),
    ];

    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const geminiGenId = trace?.startGeneration(
      `gemini-orchestrator-turn-${loopCount}`,
      geminiModel,
      geminiInputPrompt,
      { systemInstruction: ROSE_SYSTEM_INSTRUCTION }
    );

    let geminiUsage: { input?: number; output?: number; total?: number } | undefined = undefined;

    try {
      const sanitizedContents = sanitizeHistory(activeHistory);
      for await (const chunk of callGeminiStream(
        ROSE_SYSTEM_INSTRUCTION,
        sanitizedContents,
        toolDeclarations
      )) {
        if (chunk.usageMetadata) {
          geminiUsage = {
            input: chunk.usageMetadata.promptTokenCount,
            output: chunk.usageMetadata.candidatesTokenCount,
            total: chunk.usageMetadata.totalTokenCount,
          };
        }
        if (chunk.functionCall) {
          currentTurnFunctionCalls.push(chunk.functionCall);
        }
        if (chunk.textChunk) {
          currentTurnText += chunk.textChunk;
          accumulatedText += chunk.textChunk;
          yield { type: "delta", text: chunk.textChunk };
        }
      }
      if (geminiGenId) {
        const generationOutput = currentTurnFunctionCalls.length > 0
          ? {
              toolCalls: currentTurnFunctionCalls.map((fc) => ({
                name: fc.name,
                arguments: fc.args,
              })),
              text: currentTurnText || undefined,
            }
          : currentTurnText;

        trace?.endGeneration(
          geminiGenId,
          generationOutput,
          undefined,
          false,
          geminiUsage
        );
      }
    } catch (streamErr: any) {
      lastErrorMessage = streamErr?.message || String(streamErr);
      if (geminiGenId) {
        trace?.endGeneration(geminiGenId, null, lastErrorMessage, true);
      }
      console.error("[AgentRunner] Stream error:", lastErrorMessage);
      break;
    }

    if (currentTurnFunctionCalls.length === 0 && currentTurnText.trim()) {
      const extracted = extractToolCallsFromText(currentTurnText);
      if (extracted.toolCalls.length > 0) {
        for (const tc of extracted.toolCalls) {
          currentTurnFunctionCalls.push({
            name: tc.name,
            args: tc.args,
          });
        }
        if (extracted.optionsPayload && !optionsPayload) {
          optionsPayload = extracted.optionsPayload;
        }
      }
    }

    if (currentTurnFunctionCalls.length > 0) {
      activeHistory.push({
        role: "model",
        parts: currentTurnFunctionCalls.map((fc) => ({ functionCall: fc })),
      });

      const functionResponseParts: any[] = [];

      for (const fc of currentTurnFunctionCalls) {
        const fnName = fc.name;
        const fnArgs = fc.args || {};
        let toolDescription = "Searching the web";
        let toolEmotion = "researching";

        if (fnName === "webSearch") {
          const q = (fnArgs as any)?.query;
          toolDescription = q ? `Searching the web for "${q}"` : "Searching the web";
          toolEmotion = "researching";
        } else if (fnName === "askQuestion") {
          toolDescription = "Formulating options";
          toolEmotion = "thinking";
        } else if (fnName === "remember" || fnName === "rememberTool") {
          const c = (fnArgs as any)?.content;
          toolDescription = c ? `Remembering: "${c.slice(0, 40)}${c.length > 40 ? "..." : ""}"` : "Saving to long-term memory";
          toolEmotion = "bright";
        } else {
          toolDescription = `Executing ${fnName}`;
          toolEmotion = "thinking";
        }

        addTrace(toolDescription);
        yield {
          type: "trace",
          trace: toolDescription,
          tool: fnName,
          description: toolDescription,
          emotion: toolEmotion,
        };

        const toolSpanId = trace?.startSpan(`tool-${fnName}`, fnArgs);
        const toolObj = getToolByName(fnName);
        let resultJsonString: string;

        if (toolObj) {
          try {
            resultJsonString = await toolObj.execute(fnArgs);
            if (toolSpanId) trace?.endSpan(toolSpanId, resultJsonString);
          } catch (err: any) {
            resultJsonString = JSON.stringify({ error: err?.message || "Tool execution failed" });
            if (toolSpanId) trace?.endSpan(toolSpanId, resultJsonString, err?.message, true);
          }
        } else {
          resultJsonString = JSON.stringify({ error: `Tool '${fnName}' is not registered` });
          if (toolSpanId) trace?.endSpan(toolSpanId, resultJsonString, "Tool not found", true);
        }

        if (fnName === "askQuestion") {
          try {
            const parsed = JSON.parse(resultJsonString);
            if (parsed.question && Array.isArray(parsed.options)) {
              optionsPayload = {
                question: parsed.question,
                options: parsed.options,
                allowMultiple: Boolean(parsed.allowMultiple),
              };
            }
          } catch {
            // ignore
          }
        }

        functionResponseParts.push({
          functionResponse: {
            name: fnName,
            response: { content: resultJsonString },
          },
        });
      }

      // Capture all executed tools in structured format for Groq processing
      const executedToolResults = currentTurnFunctionCalls.map((fc, idx) => ({
        name: fc.name,
        args: fc.args || {},
        outputJson: (functionResponseParts[idx]?.functionResponse?.response?.content as string) || "{}",
      }));

      // If tools were called, Groq processes the structured JSON output
      const groqApiKey = process.env.GROQ_API_KEY;
      let synthesizedText = "";

      if (groqApiKey && executedToolResults.length > 0) {
        addTrace("processing with Groq");
        yield {
          type: "trace",
          trace: "processing with Groq",
          description: "Processing tool data with Groq",
          emotion: "thinking",
        };

        const groqModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
        const groqMessages = buildGroqToolPrompt(executedToolResults, newMessageText || "Analyze tool results");
        const groqGenId = trace?.startGeneration(
          "groq-tool-synthesis",
          groqModel,
          groqMessages,
          { toolCallCount: executedToolResults.length }
        );
        let groqUsage: { input?: number; output?: number; total?: number } | undefined = undefined;

        try {
          for await (const chunk of callGroqStream(groqMessages)) {
            if (chunk.usage) {
              groqUsage = {
                input: chunk.usage.prompt_tokens,
                output: chunk.usage.completion_tokens,
                total: chunk.usage.total_tokens,
              };
            }
            if (chunk.textChunk) {
              synthesizedText += chunk.textChunk;
              accumulatedText += chunk.textChunk;
              yield { type: "delta", text: chunk.textChunk };
            }
          }
          if (groqGenId) trace?.endGeneration(groqGenId, synthesizedText, undefined, false, groqUsage);
        } catch (groqErr: any) {
          console.error("[AgentRunner] Groq stream error:", groqErr);
          if (groqGenId) trace?.endGeneration(groqGenId, null, groqErr?.message, true);
        }
      }

      // Fallback synthesis if Groq unavailable or returned empty
      if (!synthesizedText.trim() && executedToolResults.length > 0) {
        const webSearchPart = functionResponseParts.find((p) => p.functionResponse?.name === "webSearch");
        if (webSearchPart) {
          let resultsText = "";
          try {
            const raw = webSearchPart.functionResponse.response?.content;
            const parsed = typeof raw === "string" ? JSON.parse(raw) : webSearchPart.functionResponse.response;
            if (Array.isArray(parsed?.results) && parsed.results.length > 0) {
              resultsText = parsed.results
                .map(
                  (r: any, idx: number) =>
                    `Source [${idx + 1}]: "${r.title || "Page"}" (${r.url})\nDetails: ${r.snippet}`
                )
                .join("\n\n");
            }
          } catch {
            // ignore
          }

          const followUpInstruction = `I have performed a real-time web search for you. Here are the search findings:

${resultsText || "No search results returned."}

---
Task:
Carefully analyze and understand these search findings. Provide a brief, well-structured, and documented summary answering the user's inquiry: "${newMessageText}".
- Highlight key facts, historical background, official names, and dates.
- Cite and link to the relevant sources where appropriate using Markdown links.
- Format with Obsidian Markdown (headings, callout notes, highlights).
- End with <emotion>bright</emotion> or <emotion>researching</emotion>.`;

          activeHistory.push({
            role: "user",
            parts: [{ text: followUpInstruction }],
          });

          addTrace("synthesizing findings");
          yield {
            type: "trace",
            trace: "synthesizing findings",
            description: "Synthesizing findings",
            emotion: "thinking",
          };

          const sanitized = sanitizeHistory(activeHistory);
          try {
            for await (const chunk of callGeminiStream(
              ROSE_SYSTEM_INSTRUCTION,
              sanitized
            )) {
              if (chunk.textChunk) {
                synthesizedText += chunk.textChunk;
                accumulatedText += chunk.textChunk;
                yield { type: "delta", text: chunk.textChunk };
              }
            }
          } catch (synthErr: any) {
            lastErrorMessage = synthErr?.message || String(synthErr);
            console.error("[AgentRunner] Synthesis stream error:", lastErrorMessage);
          }
        }
      }

      if (synthesizedText.trim()) {
        const { cleanText: textNoTools, toolCalls: synthToolCalls, optionsPayload: parsedOpts } = extractToolCallsFromText(synthesizedText);
        if (parsedOpts && !optionsPayload) {
          optionsPayload = parsedOpts;
        }

        // If Groq synthesis emitted further tool calls, loop to execute them
        if (synthToolCalls.length > 0 && loopCount < maxLoops) {
          activeHistory.push({
            role: "model",
            parts: [{ text: synthesizedText }],
          });
          continue;
        }

        const { cleanText, emotion } = extractEmotion(textNoTools);
        activeHistory.push({
          role: "model",
          parts: [{ text: cleanText }],
        });

        yield {
          type: "done",
          text: cleanText,
          emotion: emotion || "bright",
          traces,
          optionsPayload,
          history: toCleanHistory(activeHistory),
        };
        return;
      }

      if (optionsPayload) {
        activeHistory.push({
          role: "model",
          parts: [{ text: optionsPayload.question }],
        });

        yield {
          type: "done",
          text: optionsPayload.question,
          emotion: "happy",
          traces,
          optionsPayload,
          history: toCleanHistory(activeHistory),
        };
        return;
      }

      continue;
    }

    if (currentTurnText) {
      activeHistory.push({
        role: "model",
        parts: [{ text: currentTurnText }],
      });
      break;
    }

    break;
  }

  if (!accumulatedText.trim()) {
    const errorDetails =
      lastErrorMessage || "The AI model returned an empty response. Please check your connection or API configuration.";
    const errorFallback = formatErrorCallout("System Error", errorDetails);
    const { cleanText, emotion } = extractEmotion(errorFallback);
    yield {
      type: "done",
      text: cleanText,
      emotion: emotion || "sad",
      traces,
      optionsPayload,
      history: toCleanHistory(activeHistory),
    };
    return;
  }

  const { cleanText: accNoTools, optionsPayload: parsedOpts } = extractToolCallsFromText(accumulatedText);
  if (parsedOpts && !optionsPayload) {
    optionsPayload = parsedOpts;
  }
  const { cleanText, emotion } = extractEmotion(accNoTools);

  if (cleanText) {
    activeHistory.push({
      role: "model",
      parts: [{ text: cleanText }],
    });
  }

  yield {
    type: "done",
    text: cleanText,
    emotion: emotion || "happy",
    traces,
    optionsPayload,
    history: toCleanHistory(activeHistory),
  };
}

export const ROSE_SYSTEM_INSTRUCTION = `You are "Rose", an intelligent, versatile, warm, and highly capable general-purpose AI assistant and companion.

Your Objectives:
1. Provide accurate, thoughtful, well-structured, and helpful answers across a wide range of topics (technology, research, coding, writing, problem solving, analysis, and daily assistance).
2. Maintain a friendly, empathetic, and professional persona.
3. Use your tools when appropriate:
   - 'webSearch': Use to look up real-time information, latest news, live documentation, or verified facts.
   - 'askQuestion': MANDATORY — use whenever you want to offer the user a list of choices, follow-up topics, or clarifying options. ALWAYS call 'askQuestion' instead of listing choices in plain markdown, so that interactive clickable buttons render directly in the chat UI.
   - 'remember': MANDATORY — use whenever the user shares key personal preferences, instructions to recall later, project background, or facts they want you to remember. Calling 'remember' commits the information into persistent long-term storage so you recall it across sessions.

Formatting Rules (CRITICAL — Always Use Rich Markdown):
The chat interface is powered by an Obsidian-flavored MarkdownRenderer from @mono/components. ALWAYS structure your responses with rich, expressive Markdown using the formatting options below:

1. Headings:
   - Use # H1 for main topic titles, ## H2 for sections, ### H3 for subsections, and #### H4 for details.

2. Obsidian Callouts / Admonitions:
   - Use callout boxes to emphasize notes, tips, warnings, summaries, or quotes:
     > [!note] Note Title
     > Note content here.
     
     > [!tip] Tip Title
     > Helpful advice or recommendation.
     
     > [!info] Information
     > Relevant factual details or context.
     
     > [!important] Important Notice
     > Crucial requirements or instructions.
     
     > [!warning] Warning
     > Things to watch out for or potential pitfalls.
     
     > [!caution] Caution
     > High risk warnings.
     
     > [!danger] Danger
     > Critical error alerts.
     
     > [!example] Example
     > Concrete code or conceptual examples.
     
     > [!success] Success / Completed
     > Validation, positive outcomes, or completed actions.
     
     > [!abstract] Summary / TL;DR
     > Concise recap of lengthy topics.
     
     > [!question] FAQ / Question
     > Explanations of common questions.

   - Foldable Callouts: Append '+' (open by default) or '-' (closed by default) to create expandable sections:
     > [!tip]+ Expandable Deep Dive
     > Clickable accordion content.

3. Code Blocks:
   - Specify the exact language identifier on fenced blocks:
     \`\`\`typescript
     function example(): string {
       return "Hello!";
     }
     \`\`\`

4. Tables:
   - Use standard GFM pipe tables for structured comparisons and matrices:
     | Feature | Description | Status |
     |---|---|---|
     | Web Search | Real-time live web query | Active |
     | Options Picker | Interactive UI buttons | Active |

5. Highlights & Strikethrough:
   - Use ==highlighted key terms== for visual emphasis.
   - Use ~~strikethrough text~~ for deprecated or changed concepts.

6. Wikilinks & Tags:
   - Use [[Concept Title]] or [[Target|Alias]] for cross references.
   - Use #topic or #category/subcategory for taxonomy badges.

7. Interactive Task Lists & Bullets:
   - Use - [ ] or - [x] for actionable checklists.
   - Use - or 1. for organized bulleted or numbered breakdowns.

8. Footnotes & Inline Code:
   - Use [^1] and [^1]: Note for citations or definitions.
   - Use \`inline code\` for identifiers, paths, functions, and commands.

Emotion Output Rule:
At the very end of your final response, append an emotion tag in the format <emotion>EMOTION_NAME</emotion>.
You MUST select EMOTION_NAME strictly from:
- happy (warm, friendly, helpful tone)
- bright (enthusiastic, insightful, creative ideas)
- coding (programming, technical architecture, debugging)
- confused (ambiguity, clarifying questions)
- researching (search queries, deep fact analysis)
- sad (unable to fulfill request, error)
- sleeping (idle, session sign-off, goodnight)
- surprised (unexpected discovery, milestone)
- thinking (complex reasoning, multi-step problem solving)

Example final line of output:
<emotion>happy</emotion>`;

export interface ChatMessage {
  role: "user" | "model" | "tool";
  parts: Array<{
    text?: string;
    functionCall?: {
      name: string;
      args: any;
    };
    functionResponse?: {
      name: string;
      response: any;
    };
  }>;
}

export interface RunAgentResult {
  text: string;
  history: ChatMessage[];
  traces: string[];
  optionsPayload?: {
    question: string;
    options: string[];
    allowMultiple?: boolean;
  };
  emotion?: string;
}

export async function runAgentChat(
  history: ChatMessage[],
  newMessageText: string,
  onTrace?: (trace: string, emotion?: string) => void,
  trace?: RoseLangfuseTrace
): Promise<RunAgentResult> {
  const traces: string[] = [];

  const addTrace = (label: string, emotion?: string) => {
    traces.push(label);
    onTrace?.(label, emotion);
  };

  addTrace("thinking", "thinking");

  let optionsPayload: RunAgentResult["optionsPayload"] = undefined;

  const activeHistory: ChatMessage[] = [...history];

  if (newMessageText) {
    activeHistory.push({
      role: "user",
      parts: [{ text: newMessageText }],
    });
  }

  const toolDeclarations: GeminiToolDeclaration[] = TOOLS.map((t) => t.declaration as GeminiToolDeclaration);

  let loopCount = 0;
  const maxLoops = 8;

  while (loopCount < maxLoops) {
    loopCount++;

    const sanitizedContents = sanitizeHistory(activeHistory);
    const geminiInputPrompt = [
      { role: "system", content: ROSE_SYSTEM_INSTRUCTION },
      ...activeHistory.map((m) => ({
        role: m.role,
        content: m.parts.map((p) => p.text || JSON.stringify(p.functionCall || p.functionResponse || "")).join("\n"),
      })),
    ];

    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const geminiGenId = trace?.startGeneration(
      `gemini-orchestrator-turn-${loopCount}`,
      geminiModel,
      geminiInputPrompt,
      { systemInstruction: ROSE_SYSTEM_INSTRUCTION }
    );

    const responseJson = await callGemini(
      ROSE_SYSTEM_INSTRUCTION,
      sanitizedContents,
      toolDeclarations
    );

    if (geminiGenId) {
      const candidate = responseJson?.candidates?.[0];
      const modelParts = candidate?.content?.parts || [];
      const functionCalls = modelParts
        .filter((p: any) => p.functionCall)
        .map((p: any) => ({ name: p.functionCall.name, arguments: p.functionCall.args }));

      const textOutput = modelParts
        .map((p: any) => p.text || "")
        .filter(Boolean)
        .join("\n");

      const generationOutput = functionCalls.length > 0
        ? { toolCalls: functionCalls, text: textOutput || undefined }
        : textOutput || responseJson;

      const usageMeta = responseJson?.usageMetadata;
      const usage = usageMeta
        ? {
            input: usageMeta.promptTokenCount,
            output: usageMeta.candidatesTokenCount,
            total: usageMeta.totalTokenCount,
          }
        : undefined;

      trace?.endGeneration(
        geminiGenId,
        generationOutput,
        undefined,
        !responseJson,
        usage
      );
    }

    if (!responseJson) {
      addTrace("researching");
      const fallbackText = formatErrorCallout(
        "Configuration Error",
        "Missing `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in server environment variables. Please configure this key in `.env.local`.",
        "Error has been sent to admin for logging, we apologies for the issue"
      );
      const { cleanText, emotion } = extractEmotion(fallbackText);
      return {
        text: cleanText,
        history: activeHistory,
        traces,
        emotion,
      };
    }

    const candidate = responseJson.candidates?.[0];
    if (!candidate) {
      addTrace("researching");
      const blockReason = responseJson.promptFeedback?.blockReason;
      const fallbackText = blockReason
        ? `I could not fulfill this request due to content safety policies (${blockReason}). <emotion>confused</emotion>`
        : "I did not receive a valid response from the AI. Please try again. <emotion>confused</emotion>";
      const { cleanText, emotion } = extractEmotion(fallbackText);
      return {
        text: cleanText,
        history: activeHistory,
        traces,
        emotion,
      };
    }

    const modelContent = candidate.content;
    if (!modelContent || !modelContent.parts || modelContent.parts.length === 0) {
      addTrace("researching");
      const { cleanText, emotion } = extractEmotion(
        "I was unable to complete the response. Please try rephrasing your message. <emotion>confused</emotion>"
      );
      return {
        text: cleanText,
        history: activeHistory,
        traces,
        emotion,
      };
    }

    const modelMessage: ChatMessage = {
      role: "model",
      parts: modelContent.parts,
    };
    activeHistory.push(modelMessage);

    let toolCallParts = modelContent.parts.filter((p: any) => p.functionCall);

    if (toolCallParts.length === 0) {
      const textParts = modelContent.parts
        .map((p: any) => p.text || "")
        .filter(Boolean)
        .join("\n");
      if (textParts.trim()) {
        const extracted = extractToolCallsFromText(textParts);
        if (extracted.toolCalls.length > 0) {
          toolCallParts = extracted.toolCalls.map((tc) => ({
            functionCall: {
              name: tc.name,
              args: tc.args,
            },
          }));
          if (extracted.optionsPayload && !optionsPayload) {
            optionsPayload = extracted.optionsPayload;
          }
        }
      }
    }

    if (toolCallParts.length > 0) {
      addTrace("coding");
      const functionResponseParts: any[] = [];

      for (const part of toolCallParts) {
        const fnName = part.functionCall.name;
        const fnArgs = part.functionCall.args || {};

        let toolDescription = "Searching the web";
        let toolEmotion = "researching";

        if (fnName === "webSearch") {
          const q = (fnArgs as any)?.query;
          toolDescription = q ? `Searching the web for "${q}"` : "Searching the web";
          toolEmotion = "researching";
        } else if (fnName === "askQuestion") {
          toolDescription = "Formulating options";
          toolEmotion = "thinking";
        } else if (fnName === "remember" || fnName === "rememberTool") {
          const c = (fnArgs as any)?.content;
          toolDescription = c ? `Remembering: "${c.slice(0, 40)}${c.length > 40 ? "..." : ""}"` : "Saving to long-term memory";
          toolEmotion = "bright";
        } else {
          toolDescription = `Executing ${fnName}`;
          toolEmotion = "thinking";
        }

        addTrace(toolDescription, toolEmotion);

        const toolSpanId = trace?.startSpan(`tool-${fnName}`, fnArgs);
        const toolObj = getToolByName(fnName);
        let resultJsonString: string;

        if (toolObj) {
          try {
            resultJsonString = await toolObj.execute(fnArgs);
            if (toolSpanId) trace?.endSpan(toolSpanId, resultJsonString);
          } catch (err: any) {
            resultJsonString = JSON.stringify({ error: err?.message || "Tool execution failed" });
            if (toolSpanId) trace?.endSpan(toolSpanId, resultJsonString, err?.message, true);
          }
        } else {
          resultJsonString = JSON.stringify({ error: `Tool '${fnName}' is not registered` });
          if (toolSpanId) trace?.endSpan(toolSpanId, resultJsonString, "Tool not found", true);
        }

        if (fnName === "askQuestion") {
          try {
            const parsed = JSON.parse(resultJsonString);
            if (parsed.question && Array.isArray(parsed.options)) {
              optionsPayload = {
                question: parsed.question,
                options: parsed.options,
                allowMultiple: Boolean(parsed.allowMultiple),
              };
            }
          } catch {
            // ignore
          }
        }

        functionResponseParts.push({
          functionResponse: {
            name: fnName,
            response: { content: resultJsonString },
          },
        });
      }

      // Capture executed tools in structured format for Groq
      const executedToolResults = toolCallParts.map((p: any, idx: number) => ({
        name: p.functionCall.name,
        args: p.functionCall.args || {},
        outputJson: (functionResponseParts[idx]?.functionResponse?.response?.content as string) || "{}",
      }));

      const groqApiKey = process.env.GROQ_API_KEY;
      let synthText = "";

      if (groqApiKey && executedToolResults.length > 0) {
        addTrace("processing with Groq", "thinking");
        const groqModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
        const groqMessages = buildGroqToolPrompt(executedToolResults, newMessageText || "Analyze tool results");
        const groqGenId = trace?.startGeneration(
          "groq-tool-synthesis",
          groqModel,
          groqMessages,
          { toolCallCount: executedToolResults.length }
        );
        try {
          const groqRes = await callGroqWithUsage(groqMessages);
          synthText = groqRes.content;
          if (groqGenId) trace?.endGeneration(groqGenId, synthText, undefined, false, groqRes.usage);
        } catch (groqErr: any) {
          console.error("[AgentRunner] Groq call error:", groqErr);
          if (groqGenId) trace?.endGeneration(groqGenId, null, groqErr?.message, true);
        }
      }

      // Fallback synthesis if Groq unavailable or returned empty
      if (!synthText.trim() && executedToolResults.length > 0) {
        const webSearchPart = functionResponseParts.find((p) => p.functionResponse?.name === "webSearch");
        if (webSearchPart) {
          let resultsText = "";
          try {
            const raw = webSearchPart.functionResponse.response?.content;
            const parsed = typeof raw === "string" ? JSON.parse(raw) : webSearchPart.functionResponse.response;
            if (Array.isArray(parsed?.results) && parsed.results.length > 0) {
              resultsText = parsed.results
                .map(
                  (r: any, idx: number) =>
                    `Source [${idx + 1}]: "${r.title || "Page"}" (${r.url})\nDetails: ${r.snippet}`
                )
                .join("\n\n");
            }
          } catch {
            // ignore
          }

          const followUpInstruction = `I have performed a real-time web search for you. Here are the search findings:

${resultsText || "No search results returned."}

---
Task:
Carefully analyze and understand these search findings. Provide a brief, well-structured, and documented summary answering the user's inquiry: "${newMessageText}".
- Highlight key facts, historical background, official names, and dates.
- Cite and link to the relevant sources where appropriate using Markdown links.
- Format with Obsidian Markdown (headings, callout notes, highlights).
- End with <emotion>bright</emotion> or <emotion>researching</emotion>.`;

          activeHistory.push({
            role: "user",
            parts: [{ text: followUpInstruction }],
          });

          addTrace("synthesizing findings", "thinking");
          const sanitized = sanitizeHistory(activeHistory);
          try {
            const synthResponse = await callGemini(ROSE_SYSTEM_INSTRUCTION, sanitized);
            const synthCandidate = synthResponse?.candidates?.[0];
            const synthPart = synthCandidate?.content?.parts?.find((p: any) => p.text);
            synthText = synthPart?.text || "";
          } catch {
            // ignore
          }
        }
      }

      if (synthText.trim()) {
        const { cleanText: synthNoTools, toolCalls: synthToolCalls, optionsPayload: parsedOpts } = extractToolCallsFromText(synthText);
        if (parsedOpts && !optionsPayload) {
          optionsPayload = parsedOpts;
        }

        // If Groq synthesis emitted further tool calls, loop to execute them
        if (synthToolCalls.length > 0 && loopCount < maxLoops) {
          activeHistory.push({
            role: "model",
            parts: [{ text: synthText }],
          });
          continue;
        }

        const { cleanText, emotion } = extractEmotion(synthNoTools);
        activeHistory.push({
          role: "model",
          parts: [{ text: cleanText }],
        });

        return {
          text: cleanText,
          history: toCleanHistory(activeHistory),
          traces,
          optionsPayload,
          emotion: emotion || "bright",
        };
      }

      if (optionsPayload) {
        activeHistory.push({
          role: "model",
          parts: [{ text: optionsPayload.question }],
        });
        addTrace("researching");
        return {
          text: optionsPayload.question,
          history: toCleanHistory(activeHistory),
          traces,
          optionsPayload,
          emotion: "happy",
        };
      }

      continue;
    }

    addTrace("researching");
    const finalPart = modelContent.parts.find((p: any) => p.text);
    const textOutput = finalPart?.text || "No response generated.";
    const { cleanText: outNoTools, optionsPayload: parsedOpts } = extractToolCallsFromText(textOutput);
    if (parsedOpts && !optionsPayload) {
      optionsPayload = parsedOpts;
    }
    const { cleanText, emotion } = extractEmotion(outNoTools);

    if (cleanText) {
      activeHistory.push({
        role: "model",
        parts: [{ text: cleanText }],
      });
    }

    return {
      text: cleanText,
      history: toCleanHistory(activeHistory),
      traces,
      optionsPayload,
      emotion,
    };
  }

  addTrace("researching");
  const lastModelMsg = activeHistory.filter((m) => m.role === "model").pop();
  const lastText =
    lastModelMsg?.parts?.find((p) => p.text)?.text || "Completed conversation turn.";
  const { cleanText: lastNoTools, optionsPayload: parsedOpts } = extractToolCallsFromText(lastText);
  if (parsedOpts && !optionsPayload) {
    optionsPayload = parsedOpts;
  }
  const { cleanText, emotion } = extractEmotion(lastNoTools);

  return {
    text: cleanText,
    history: toCleanHistory(activeHistory),
    traces,
    optionsPayload,
    emotion,
  };
}
