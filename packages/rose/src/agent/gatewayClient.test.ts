import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatOpenAiMessages,
  formatOpenAiTools,
  parseGatewayErrorText,
  getAiGatewayApiKey,
  getAiGatewayModel,
  callAiGateway,
  callAiGatewayStream,
  DEFAULT_GATEWAY_URL,
  DEFAULT_GATEWAY_MODEL,
} from "./gatewayClient";

describe("Vercel AI Gateway Client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("Configuration & Environment Helpers", () => {
    it("reads AI_GATEWAY_API_KEY with priority", () => {
      process.env.AI_GATEWAY_API_KEY = "test-gateway-key";
      process.env.GEMINI_API_KEY = "test-gemini-key";
      expect(getAiGatewayApiKey()).toBe("test-gateway-key");
    });

    it("falls back to GEMINI_API_KEY if AI_GATEWAY_API_KEY is unset", () => {
      delete process.env.AI_GATEWAY_API_KEY;
      delete process.env.VERCEL_AI_GATEWAY_API_KEY;
      process.env.GEMINI_API_KEY = "legacy-gemini-key";
      expect(getAiGatewayApiKey()).toBe("legacy-gemini-key");
    });

    it("resolves default AI Gateway model", () => {
      delete process.env.AI_GATEWAY_MODEL;
      delete process.env.GEMINI_MODEL;
      expect(getAiGatewayModel()).toBe(DEFAULT_GATEWAY_MODEL);
    });

    it("respects custom AI_GATEWAY_MODEL env", () => {
      process.env.AI_GATEWAY_MODEL = "anthropic/claude-3-5-sonnet";
      expect(getAiGatewayModel()).toBe("anthropic/claude-3-5-sonnet");
    });
  });

  describe("Message & Tool Formatting", () => {
    it("formats system instruction and user/model history correctly", () => {
      const messages = formatOpenAiMessages("You are Rose.", [
        { role: "user", parts: [{ text: "Hello!" }] },
        { role: "model", parts: [{ text: "Hi there!" }] },
      ]);

      expect(messages).toEqual([
        { role: "system", content: "You are Rose." },
        { role: "user", content: "Hello!" },
        { role: "assistant", content: "Hi there!" },
      ]);
    });

    it("formats assistant tool calls properly", () => {
      const messages = formatOpenAiMessages("You are Rose.", [
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: "webSearch",
                args: { query: "Next.js 15" },
              },
            },
          ],
        },
      ]);

      expect(messages[1].role).toBe("assistant");
      expect(messages[1].tool_calls).toBeDefined();
      expect(messages[1].tool_calls?.[0].function.name).toBe("webSearch");
    });

    it("formats tool response messages properly", () => {
      const messages = formatOpenAiMessages("You are Rose.", [
        {
          role: "tool",
          parts: [
            {
              functionResponse: {
                name: "webSearch",
                response: { results: ["Search hit 1"] },
              },
            },
          ],
        },
      ]);

      expect(messages[1].role).toBe("tool");
      expect(messages[1].name).toBe("webSearch");
      expect(messages[1].content).toContain("Search hit 1");
    });

    it("formats tool declarations for OpenAI-compatible schema", () => {
      const tools = formatOpenAiTools([
        {
          name: "webSearch",
          description: "Search the web",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" },
            },
            required: ["query"],
          },
        },
      ]);

      expect(tools).toHaveLength(1);
      expect(tools?.[0].type).toBe("function");
      expect(tools?.[0].function.name).toBe("webSearch");
      expect(tools?.[0].function.parameters.required).toEqual(["query"]);
    });
  });

  describe("Error Parsing", () => {
    it("extracts error message from OpenAI-compatible JSON error body", () => {
      const jsonError = JSON.stringify({
        error: {
          message: "Invalid API key provided",
          code: "invalid_api_key",
        },
      });
      const parsed = parseGatewayErrorText(401, jsonError);
      expect(parsed).toBe("[invalid_api_key] Invalid API key provided");
    });

    it("falls back to raw HTTP status if empty", () => {
      expect(parseGatewayErrorText(500, "")).toBe("HTTP 500");
    });
  });

  describe("callAiGateway non-streaming", () => {
    it("throws error when API key is missing", async () => {
      delete process.env.AI_GATEWAY_API_KEY;
      delete process.env.VERCEL_AI_GATEWAY_API_KEY;
      delete process.env.GEMINI_API_KEY;
      delete process.env.GOOGLE_API_KEY;

      await expect(
        callAiGateway("System prompt", [{ role: "user", parts: [{ text: "Hi" }] }])
      ).rejects.toThrow(/Missing AI_GATEWAY_API_KEY/i);
    });

    it("sends request and parses response successfully", async () => {
      process.env.AI_GATEWAY_API_KEY = "test-key";
      const mockResponse = {
        id: "chatcmpl-123",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Hello from Vercel AI Gateway!",
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 15,
          completion_tokens: 25,
          total_tokens: 40,
        },
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const res = await callAiGateway("System prompt", [
        { role: "user", parts: [{ text: "Hello" }] },
      ]);

      expect(res.candidates[0].content.parts[0].text).toBe(
        "Hello from Vercel AI Gateway!"
      );
      expect(res.usageMetadata.totalTokenCount).toBe(40);
    });
  });

  describe("callAiGatewayStream streaming", () => {
    it("streams text chunks and handles completion", async () => {
      process.env.AI_GATEWAY_API_KEY = "test-key";

      const ssePayload = [
        `data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n`,
        `data: {"choices":[{"delta":{"content":" world!"}}],"usage":{"prompt_tokens":10,"completion_tokens":5,"total_tokens":15}}\n\n`,
        `data: {"choices":[{"finish_reason":"stop"}]}\n\n`,
        `data: [DONE]\n\n`,
      ].join("");

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(ssePayload));
          controller.close();
        },
      });

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        body: readableStream,
      } as any);

      const stream = callAiGatewayStream("System prompt", [
        { role: "user", parts: [{ text: "Hello" }] },
      ]);

      const chunks: string[] = [];
      let totalTokens = 0;
      for await (const chunk of stream) {
        if (chunk.textChunk) {
          chunks.push(chunk.textChunk);
        }
        if (chunk.usageMetadata?.totalTokenCount) {
          totalTokens = chunk.usageMetadata.totalTokenCount;
        }
      }

      expect(chunks.join("")).toBe("Hello world!");
      expect(totalTokens).toBe(15);
    });
  });
});
