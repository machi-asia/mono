import { describe, it, expect } from "vitest";
import { extractEmotion, ROSE_EMOTIONS } from "./roseEmotions";
import { getToolByName, TOOLS } from "./tools";
import { askQuestionTool } from "./tools/askQuestion";
import { webSearchTool } from "./tools/webSearch";
import { getAgentCommandCategories } from "./commandRegistry";

describe("Rose Agent Core", () => {
  describe("Emotion Extraction", () => {
    it("extracts valid emotion and strips emotion tags", () => {
      const input = "Here is the answer you requested!\n\n<emotion>bright</emotion>";
      const result = extractEmotion(input);
      expect(result.emotion).toBe("bright");
      expect(result.cleanText).toBe("Here is the answer you requested!");
    });

    it("defaults to happy when no emotion is provided", () => {
      const input = "A simple response without tags.";
      const result = extractEmotion(input);
      expect(result.emotion).toBe("happy");
      expect(result.cleanText).toBe("A simple response without tags.");
    });

    it("handles all standard emotions", () => {
      const emotions = ["happy", "bright", "coding", "confused", "researching", "sad", "sleeping", "surprised", "thinking"];
      emotions.forEach((emo) => {
        expect(ROSE_EMOTIONS[emo]).toBeDefined();
        const res = extractEmotion(`Hello <emotion>${emo}</emotion>`);
        expect(res.emotion).toBe(emo);
      });
    });
  });

  describe("Tools", () => {
    it("registers webSearch, askQuestion, and remember tools", () => {
      expect(TOOLS.length).toBe(3);
      expect(getToolByName("webSearch")).toBeDefined();
      expect(getToolByName("askQuestion")).toBeDefined();
      expect(getToolByName("remember")).toBeDefined();
      expect(getToolByName("rememberTool")).toBeDefined();
      expect(getToolByName("nonExistentTool")).toBeUndefined();
    });

    it("remember executes and returns structured success json", async () => {
      const { rememberTool } = await import("./tools/remember");
      const res = await rememberTool.execute({
        content: "User prefers Next.js with TypeScript",
        category: "preference",
        importance: "high",
      });
      const parsed = JSON.parse(res);
      expect(parsed.success).toBe(true);
      expect(parsed.memory).toBeDefined();
      expect(parsed.memory.content).toBe("User prefers Next.js with TypeScript");
      expect(parsed.memory.category).toBe("preference");
      expect(parsed.memory.importance).toBe("high");
    });

    it("remember validates missing content parameter", async () => {
      const { rememberTool } = await import("./tools/remember");
      const res = await rememberTool.execute({});
      const parsed = JSON.parse(res);
      expect(parsed.error).toBeDefined();
    });

    it("askQuestion executes and produces interactive payload", async () => {
      const res = await askQuestionTool.execute({
        question: "Which topic would you like to explore?",
        options: ["TypeScript", "Next.js", "AI Agents"],
        allowMultiple: true,
      });
      const parsed = JSON.parse(res);
      expect(parsed.type).toBe("interactive_options");
      expect(parsed.question).toBe("Which topic would you like to explore?");
      expect(parsed.options).toEqual(["TypeScript", "Next.js", "AI Agents"]);
      expect(parsed.allowMultiple).toBe(true);
    });

    it("webSearch validates missing query", async () => {
      const res = await webSearchTool.execute({});
      const parsed = JSON.parse(res);
      expect(parsed.error).toBeDefined();
    });
  });

  describe("Command Registry", () => {
    it("returns default slash command categories", () => {
      const categories = getAgentCommandCategories();
      expect(categories.some((c) => c.command === "/web")).toBe(true);
      expect(categories.some((c) => c.command === "/picker")).toBe(true);
      expect(categories.some((c) => c.command === "/tools")).toBe(true);
    });
  });

  describe("Langfuse Observability", () => {
    it("creates disabled trace when keys are not configured", async () => {
      const { createLangfuseTrace } = await import("./langfuse");
      const trace = createLangfuseTrace({ userId: "u123", input: "test message" }, { publicKey: "", secretKey: "" });
      expect(trace.isEnabled()).toBe(false);
      const genId = trace.startGeneration("gemini", "gemini-2.0-flash", "test");
      expect(genId).toBeDefined();
      trace.endGeneration(genId, "test output");
      const spanId = trace.startSpan("tool-webSearch", { query: "test" });
      trace.endSpan(spanId, "{}");
      expect(() => trace.complete("final response")).not.toThrow();
    });

    it("creates active trace when keys are configured", async () => {
      const { createLangfuseTrace } = await import("./langfuse");
      const trace = createLangfuseTrace(
        { userId: "u123", sessionId: "sess-1", input: "hello" },
        { publicKey: "pk-test", secretKey: "sk-test", baseUrl: "https://test.langfuse.com" }
      );
      expect(trace.isEnabled()).toBe(true);
      expect(trace.traceId).toContain("rose-trace-");
    });
  });

  describe("Tool Call Extraction from Output Text", () => {
    it("catches and extracts askQuestion JSON tool call and strips from text", async () => {
      const { extractToolCallsFromText } = await import("./agentRunner");
      const rawText = `Here is a summary of the options.

\`\`\`json
{
  "action": "askQuestion",
  "action_input": {
    "question": "Which framework do you prefer?",
    "options": ["Next.js", "Remix", "Astro"],
    "allowMultiple": false
  }
}
\`\`\``;
      const result = extractToolCallsFromText(rawText);
      expect(result.cleanText).toBe("Here is a summary of the options.");
      expect(result.toolCalls.length).toBe(1);
      expect(result.toolCalls[0].name).toBe("askQuestion");
      expect(result.optionsPayload).toBeDefined();
      expect(result.optionsPayload?.question).toBe("Which framework do you prefer?");
      expect(result.optionsPayload?.options).toEqual(["Next.js", "Remix", "Astro"]);
      expect(result.optionsPayload?.allowMultiple).toBe(false);
    });

    it("catches and extracts webSearch JSON tool call and strips from text", async () => {
      const { extractToolCallsFromText } = await import("./agentRunner");
      const rawText = `I will look that up for you.\n\n\`\`\`json\n{\n  "action": "webSearch",\n  "action_input": {\n    "query": "Next.js 15 features"\n  }\n}\n\`\`\``;
      const result = extractToolCallsFromText(rawText);
      expect(result.cleanText).toBe("I will look that up for you.");
      expect(result.toolCalls.length).toBe(1);
      expect(result.toolCalls[0].name).toBe("webSearch");
      expect(result.toolCalls[0].args).toEqual({ query: "Next.js 15 features" });
    });

    it("catches and extracts remember JSON tool call and strips from text", async () => {
      const { extractToolCallsFromText } = await import("./agentRunner");
      const rawText = `I will keep that in mind for future conversations.\n\n\`\`\`json\n{\n  "action": "remember",\n  "action_input": {\n    "content": "User prefers dark mode and gold accents",\n    "category": "preference",\n    "importance": "high"\n  }\n}\n\`\`\``;
      const result = extractToolCallsFromText(rawText);
      expect(result.cleanText).toBe("I will keep that in mind for future conversations.");
      expect(result.toolCalls.length).toBe(1);
      expect(result.toolCalls[0].name).toBe("remember");
      expect(result.toolCalls[0].args).toEqual({
        content: "User prefers dark mode and gold accents",
        category: "preference",
        importance: "high",
      });
    });

    it("handles inline json with name and parameters", async () => {
      const { extractToolCallsFromText } = await import("./agentRunner");
      const rawText = `Let's decide on next steps: {"name": "askQuestion", "parameters": {"question": "Continue?", "options": ["Yes", "No"]}}`;
      const result = extractToolCallsFromText(rawText);
      expect(result.cleanText).toBe("Let's decide on next steps:");
      expect(result.toolCalls.length).toBe(1);
      expect(result.toolCalls[0].name).toBe("askQuestion");
      expect(result.optionsPayload?.question).toBe("Continue?");
      expect(result.optionsPayload?.options).toEqual(["Yes", "No"]);
    });

    it("returns plain text unchanged when no tool call JSON is present", async () => {
      const { extractToolCallsFromText } = await import("./agentRunner");
      const rawText = "Just normal conversational response.";
      const result = extractToolCallsFromText(rawText);
      expect(result.cleanText).toBe("Just normal conversational response.");
      expect(result.toolCalls).toEqual([]);
      expect(result.optionsPayload).toBeUndefined();
    });
  });
});
