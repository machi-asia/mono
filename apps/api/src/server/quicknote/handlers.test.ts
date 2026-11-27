import { afterEach, describe, expect, it } from "vitest";
import {
  handleQuicknoteClickupMcp,
  handleQuicknoteGenerate,
  handleQuicknoteGetNotes,
  handleQuicknoteGetRelations,
} from "./handlers";

describe("Quicknote API handlers", () => {
  const originalGeminiKey = process.env.GEMINI_API_KEY;

  afterEach(() => {
    if (originalGeminiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalGeminiKey;
    }
  });

  it("returns 400 when prompt is missing on generate", async () => {
    const req = new Request("http://localhost:3005/quicknote/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "   " }),
    });
    const res = await handleQuicknoteGenerate(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Prompt is required" });
  });

  it("generates deterministic template draft when GEMINI_API_KEY is unset", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new Request("http://localhost:3005/quicknote/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "API Consolidation", existingTitles: ["Vercel Plan"] }),
    });
    const res = await handleQuicknoteGenerate(req);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { title: string; content: string; provider: string };
    expect(data.title).toBe("API Consolidation");
    expect(data.provider).toBe("template");
    expect(data.content).toContain("[[Vercel Plan]]");
  });

  it("returns bridged ClickUp tasks for a query", async () => {
    const req = new Request("http://localhost:3005/quicknote/mcp/clickup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Q4 Launch" }),
    });
    const res = await handleQuicknoteClickupMcp(req);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { source: string; tasks: Array<{ name: string }> };
    expect(data.source).toBe("clickup-bridge");
    expect(data.tasks[0]?.name).toContain("Q4 Launch");
  });

  it("returns guest empty responses for notes and relations without session", async () => {
    const notesRes = await handleQuicknoteGetNotes();
    expect(notesRes.status).toBe(200);
    expect(await notesRes.json()).toEqual({ notes: [], isGuest: true });

    const relRes = await handleQuicknoteGetRelations();
    expect(relRes.status).toBe(200);
    expect(await relRes.json()).toEqual({ relations: [], isGuest: true });
  });
});
