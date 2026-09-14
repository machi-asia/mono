import { describe, it, expect, afterEach, vi } from "vitest";
import {
  shouldUseOllamaProvider,
  toOllamaMessages,
  resolveOllamaBaseUrl,
  type OllamaChatMessage,
} from "./ollamaClient";

const ENV_KEYS = ["VERCEL_URL", "OLLAMA_ENABLED", "OLLAMA_BASE_URL", "OLLAMA_MODEL"];

function setEnv(values: Record<string, string | undefined>) {
  for (const key of ENV_KEYS) {
    if (key in values) {
      if (values[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = values[key];
      }
    }
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const key of ENV_KEYS) delete process.env[key];
});

describe("Ollama Provider Detection", () => {
  it("defaults to Ollama when not deployed on Vercel (no VERCEL_URL)", () => {
    setEnv({ VERCEL_URL: undefined, OLLAMA_ENABLED: undefined });
    expect(shouldUseOllamaProvider()).toBe(true);
  });

  it("uses cloud providers when deployed on Vercel (VERCEL_URL set)", () => {
    setEnv({ VERCEL_URL: "my-app.vercel.app", OLLAMA_ENABLED: undefined });
    expect(shouldUseOllamaProvider()).toBe(false);
  });

  it("OLLAMA_ENABLED=true forces Ollama even on Vercel", () => {
    setEnv({ VERCEL_URL: "my-app.vercel.app", OLLAMA_ENABLED: "true" });
    expect(shouldUseOllamaProvider()).toBe(true);
  });

  it("OLLAMA_ENABLED=false forces cloud even in local dev", () => {
    setEnv({ VERCEL_URL: undefined, OLLAMA_ENABLED: "false" });
    expect(shouldUseOllamaProvider()).toBe(false);
  });

  it("OLLAMA_ENABLED=auto behaves like the default", () => {
    setEnv({ VERCEL_URL: "my-app.vercel.app", OLLAMA_ENABLED: "auto" });
    expect(shouldUseOllamaProvider()).toBe(false);
    setEnv({ VERCEL_URL: undefined, OLLAMA_ENABLED: "auto" });
    expect(shouldUseOllamaProvider()).toBe(true);
  });

  it("resolves the base URL from env with a localhost fallback", () => {
    setEnv({ OLLAMA_BASE_URL: "http://192.168.1.10:11434" });
    expect(resolveOllamaBaseUrl()).toBe("http://192.168.1.10:11434");
    setEnv({ OLLAMA_BASE_URL: undefined });
    expect(resolveOllamaBaseUrl()).toBe("http://localhost:11434");
  });
});

describe("Ollama Message Mapping", () => {
  it("flattens Gemini contents to system/user/assistant messages and appends the tool-call hint", () => {
    const messages = toOllamaMessages("ROSE system prompt", [
      { role: "user", parts: [{ text: "Hello Rose" }] },
      { role: "model", parts: [{ text: "Hi there!" }] },
    ]);

    expect(messages.length).toBe(3);
    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("ROSE system prompt");
    expect(messages[0].content).toContain("action_input");
    expect(messages[1]).toEqual({ role: "user", content: "Hello Rose" });
    expect(messages[2]).toEqual({ role: "assistant", content: "Hi there!" });
  });

  it("flattens functionCall and functionResponse parts into text", () => {
    const messages: OllamaChatMessage[] = toOllamaMessages("sys", [
      {
        role: "user",
        parts: [{ text: "Look something up" }],
      },
      {
        role: "model",
        parts: [{ functionCall: { name: "webSearch", args: { query: "Next.js" } } }],
      },
      {
        role: "tool",
        parts: [
          {
            functionResponse: {
              name: "webSearch",
              response: { content: JSON.stringify({ results: [1, 2] }) },
            },
          },
        ],
      },
    ]);

    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
    expect(messages[1].content).toBe("Look something up");
    expect(messages[2].role).toBe("assistant");
    expect(messages[2].content).toContain("tool_call webSearch(");
    expect(messages[2].content).toContain('"query":"Next.js"');
    expect(messages[3].role).toBe("user");
    expect(messages[3].content).toContain("tool_response(webSearch):");
    expect(messages[3].content).toContain('"results":[1,2]');
  });

  it("merges consecutive same-role messages", () => {
    const messages = toOllamaMessages("sys", [
      { role: "tool", parts: [{ functionResponse: { name: "learn", response: { content: "ok" } } }] },
      { role: "user", parts: [{ text: "Great, thanks" }] },
    ]);

    expect(messages.length).toBe(2);
    expect(messages[1].role).toBe("user");
    expect(messages[1].content).toContain("tool_response(learn):");
    expect(messages[1].content).toContain("Great, thanks");
  });

  it("skips empty content parts", () => {
    const messages = toOllamaMessages("sys", [
      { role: "user", parts: [{ text: "" }, { text: "only this" }] },
    ]);
    expect(messages.length).toBe(2);
    expect(messages[1].content).toBe("only this");
  });

  it("trims oversized history while keeping system, first user message, and recent turns", () => {
    const contents: any[] = [{ role: "user", parts: [{ text: "My original question" }] }];
    for (let i = 0; i < 10; i++) {
      contents.push({
        role: "model",
        parts: [{ text: `prose turn ${i}` }],
      });
      contents.push({
        role: "tool",
        parts: [
          {
            functionResponse: {
              name: "webSearch",
              response: { content: `x`.repeat(4000) },
            },
          },
        ],
      });
    }
    contents.push({ role: "model", parts: [{ text: "final answer" }] });

    const messages = toOllamaMessages("sys", contents);
    expect(messages[0].role).toBe("system");
    expect(messages.some((m) => m.content.includes("My original question"))).toBe(true);
    expect(messages[messages.length - 1].content).toBe("final answer");
    expect(messages.length).toBeLessThan(contents.length);
  });
});