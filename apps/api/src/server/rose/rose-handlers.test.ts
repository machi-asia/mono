import { describe, it, expect, beforeEach } from "vitest";
import { resetFallbackUsageLedger } from "@mono/database";
import { handleRoseUsage } from "./usage";
import { handleRoseSettings } from "./settings";
import { handleRoseTranscribe } from "./transcribe";
import { handleRoseChat, getAuthUser } from "./chat";
import { getRoseUsage, checkAndIncrementRoseUsage } from "./usage-calc";

describe("apps/api Rose Server Handlers & Quota Enforcement", () => {
  beforeEach(() => {
    resetFallbackUsageLedger();
  });

  it("reads and increments Rose usage via usage-calc re-exports", async () => {
    const u1 = await getRoseUsage("test-rose-api-user", ["guest"]);
    expect(u1.allowed).toBe(true);
    expect(u1.dailyCount).toBe(0);

    const u2 = await checkAndIncrementRoseUsage("test-rose-api-user", ["guest"]);
    expect(u2.allowed).toBe(true);
    expect(u2.dailyCount).toBe(1);
  });

  it("handles GET /rose/usage and returns usage envelope", async () => {
    const req = new Request("http://localhost:3005/rose/usage", {
      headers: { "x-user-id": "test-usage-route-user" },
    });
    const res = await handleRoseUsage(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.allowed).toBe(true);
    expect(typeof json.dailyLimit).toBe("number");
  });

  it("enforces authentication on POST /rose/settings while allowing GET", async () => {
    const getReq = new Request("http://localhost:3005/rose/settings", {
      method: "GET",
      headers: { "x-forwarded-for": "198.51.100.12" },
    });
    const getRes = await handleRoseSettings(getReq);
    expect(getRes.status).toBe(200);

    const unauthPost = new Request("http://localhost:3005/rose/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.12" },
      body: JSON.stringify({ action: "save_personalization", nickname: "Hacker" }),
    });
    const postRes = await handleRoseSettings(unauthPost);
    expect(postRes.status).toBe(401);
  });

  it("validates audio payload on POST /rose/transcribe", async () => {
    const req = new Request("http://localhost:3005/rose/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": "test-transcribe-user" },
      body: JSON.stringify({}),
    });
    const res = await handleRoseTranscribe(req);
    expect(res.status).toBe(400);
  });

  it("validates required message on POST /rose/chat and resolves test user via getAuthUser", async () => {
    const req = new Request("http://localhost:3005/rose/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": "test-chat-user" },
      body: JSON.stringify({ message: "" }),
    });
    const auth = await getAuthUser(req);
    expect(auth?.user?.id).toBe("test-chat-user");

    const res = await handleRoseChat(req);
    expect(res.status).toBe(400);
  });
});
