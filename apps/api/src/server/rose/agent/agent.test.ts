import { describe, it, expect, beforeEach } from "vitest";
import {
  extractEmotion,
  ROSE_EMOTIONS,
  getToolByName,
  TOOLS,
  getAgentCommandCategories,
  memoryDbResetForTests,
  setMemoryToolContext,
  createLangfuseTrace,
  extractToolCallsFromText,
} from "@mono/rose/agent";

describe("apps/api Rose Agent Integration (delegated to @mono/rose/agent)", () => {
  beforeEach(() => {
    memoryDbResetForTests();
    setMemoryToolContext("test-user-memory-store");
  });

  it("re-exports emotion extraction, tools, command registry, langfuse, and tool call parser", async () => {
    const res = extractEmotion("Hello <emotion>bright</emotion>");
    expect(res.emotion).toBe("bright");
    expect(ROSE_EMOTIONS.bright).toBeDefined();

    expect(TOOLS.length).toBe(7);
    expect(getToolByName("webSearch")).toBeDefined();
    expect(getToolByName("searchDocs")).toBeDefined();
    expect(getAgentCommandCategories().some((c) => c.command === "/web")).toBe(true);

    const trace = createLangfuseTrace({ userId: "u1", input: "hi" }, { publicKey: "", secretKey: "" });
    expect(trace.isEnabled()).toBe(false);

    const extracted = extractToolCallsFromText(
      `Let's search: {"name": "webSearch", "parameters": {"query": "Vitest"}}`
    );
    expect(extracted.toolCalls.length).toBe(1);
    expect(extracted.toolCalls[0].name).toBe("webSearch");
  });
});
