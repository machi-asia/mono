import { describe, it, expect, afterEach, vi } from "vitest";
import {
  shouldUseOllamaProvider,
  toOllamaMessages,
  resolveOllamaBaseUrl,
  type OllamaChatMessage,
} from "@mono/rose/agent";

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

describe("Ollama Provider Detection & Message Mapping", () => {
  it("defaults to Ollama when not deployed on Vercel and respects OLLAMA_ENABLED", () => {
    setEnv({ VERCEL_URL: undefined, OLLAMA_ENABLED: undefined });
    expect(shouldUseOllamaProvider()).toBe(true);
    setEnv({ VERCEL_URL: "my-app.vercel.app", OLLAMA_ENABLED: undefined });
    expect(shouldUseOllamaProvider()).toBe(false);
    setEnv({ OLLAMA_BASE_URL: "http://192.168.1.10:11434" });
    expect(resolveOllamaBaseUrl()).toBe("http://192.168.1.10:11434");
  });

  it("flattens Gemini contents to system/user/assistant messages", () => {
    const messages: OllamaChatMessage[] = toOllamaMessages("ROSE system prompt", [
      { role: "user", parts: [{ text: "Hello Rose" }] },
      { role: "model", parts: [{ text: "Hi there!" }] },
    ]);
    expect(messages.length).toBe(3);
    expect(messages[0].role).toBe("system");
    expect(messages[1]).toEqual({ role: "user", content: "Hello Rose" });
    expect(messages[2]).toEqual({ role: "assistant", content: "Hi there!" });
  });
});
