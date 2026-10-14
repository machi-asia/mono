import { describe, it, expect, vi } from "vitest";
import { handleGetOverrides, handleCreateReport, generateConsensusKey } from "./handlers";

describe("itemlist API handlers", () => {
  describe("generateConsensusKey", () => {
    it("generates deterministic key from corrections regardless of order", () => {
      const key1 = generateConsensusKey("cogwheel", {
        recipeMethod: "crafting",
        outputAmount: 1,
        speedRpm: 64,
      });

      const key2 = generateConsensusKey("cogwheel", {
        speedRpm: 64,
        outputAmount: 1,
        recipeMethod: "crafting",
      });

      expect(key1).toBe(key2);
      expect(key1).toContain("cogwheel::");
      expect(key1).toContain('"method":"crafting"');
    });
  });

  describe("handleGetOverrides", () => {
    it("returns 400 if gameId is omitted", async () => {
      const req = new Request("http://localhost:3005/itemlist/overrides");
      const res = await handleGetOverrides(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toContain("Missing required query parameter: gameId");
    });
  });

  describe("handleCreateReport", () => {
    it("validates required payload properties", async () => {
      const req = new Request("http://localhost:3005/itemlist/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: "create" }),
      });
      const res = await handleCreateReport(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toContain("Missing required fields");
    });
  });
});
