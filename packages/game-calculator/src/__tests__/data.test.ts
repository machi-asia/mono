import { describe, it, expect } from "vitest";
import { CREATE_DATA, RIMWORLD_DATA } from "../data";
import type { GameItem, Recipe } from "../types/data";

describe("Game Datasets", () => {
  it("validates Create dataset integrity", () => {
    expect(CREATE_DATA.id).toBe("create");
    expect(CREATE_DATA.items.length).toBeGreaterThan(0);
    const seenIds = new Set<string>();
    const duplicateIds: string[] = [];
    for (const item of CREATE_DATA.items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
      if (seenIds.has(item.id)) {
        duplicateIds.push(item.id);
      }
      seenIds.add(item.id);
    }
    expect(duplicateIds).toEqual([]);

    // Verify Sturdy Sheet recipe
    const sturdy = CREATE_DATA.items.find((i: GameItem) => i.id === "sturdy-sheet");
    expect(sturdy).toBeDefined();
    expect(sturdy?.recipes?.length).toBeGreaterThan(0);
    const sturdyValid = sturdy?.recipes?.some((r: Recipe) =>
      r.outputs.some((o) => o.itemId === "sturdy-sheet")
    );
    expect(sturdyValid).toBe(true);

    // Verify Andesite, Brass, Copper, and Train Casings recipes
    const casings = ["andesite-casing", "brass-casing", "copper-casing", "train-casing"];
    for (const cId of casings) {
      const casing = CREATE_DATA.items.find((i: GameItem) => i.id === cId);
      expect(casing).toBeDefined();
      expect(casing?.recipes?.length).toBeGreaterThan(0);
      const casingValid = casing?.recipes?.some((r: Recipe) =>
        r.outputs.some((o) => o.itemId === cId)
      );
      expect(casingValid).toBe(true);
    }

    // Verify Cake and essential vanilla craftables
    const cake = CREATE_DATA.items.find((i: GameItem) => i.id === "cake");
    expect(cake).toBeDefined();
    expect(cake?.recipes?.length).toBeGreaterThan(0);
    const cakeRecipe = cake?.recipes?.find((r: Recipe) => r.method === "Mechanical Crafting");
    expect(cakeRecipe).toBeDefined();
    expect(cakeRecipe?.ingredients.map((ing) => ing.itemId).sort()).toEqual([
      "egg",
      "milk-bucket",
      "sugar",
      "wheat"
    ]);

    const vanillaItems = ["iron-block", "piston", "sticky-piston", "hopper", "shears", "bucket", "bow", "tnt"];
    for (const vId of vanillaItems) {
      const vItem = CREATE_DATA.items.find((i: GameItem) => i.id === vId);
      expect(vItem).toBeDefined();
      expect(vItem?.recipes?.length).toBeGreaterThan(0);
    }

    // Verify Stripped Log and Deployer recipes
    const strippedLog = CREATE_DATA.items.find((i: GameItem) => i.id === "stripped-log");
    expect(strippedLog).toBeDefined();
    expect(strippedLog?.recipes?.some((r: Recipe) => r.buildingRequired === "Deployer")).toBe(true);

    // Verify Sand Paper
    const sandPaper = CREATE_DATA.items.find((i: GameItem) => i.id === "sand-paper");
    expect(sandPaper).toBeDefined();
    expect(sandPaper?.recipes?.length).toBeGreaterThan(0);

    // Verify Rose Quartz and Polished Rose Quartz
    const roseQuartz = CREATE_DATA.items.find((i: GameItem) => i.id === "rose-quartz");
    expect(roseQuartz).toBeDefined();
    expect(roseQuartz?.recipes?.length).toBeGreaterThan(0);

    const polishedRoseQuartz = CREATE_DATA.items.find((i: GameItem) => i.id === "polished-rose-quartz");
    expect(polishedRoseQuartz).toBeDefined();
    expect(polishedRoseQuartz?.recipes?.some((r: Recipe) => r.buildingRequired === "Deployer")).toBe(true);

    // Verify Cobblestone and Basalt Mechanical Drill recipes
    const cobblestone = CREATE_DATA.items.find((i: GameItem) => i.id === "cobblestone");
    expect(cobblestone).toBeDefined();
    const cobbleDrill = cobblestone?.recipes?.find((r: Recipe) => r.buildingRequired === "Mechanical Drill");
    expect(cobbleDrill).toBeDefined();
    expect(cobbleDrill?.processingTimeSeconds).toBe(0.67);
    expect(cobbleDrill?.ingredients.map((ing) => ing.itemId).sort()).toEqual(["lava", "water"]);

    const basalt = CREATE_DATA.items.find((i: GameItem) => i.id === "basalt");
    expect(basalt).toBeDefined();
    const basaltDrill = basalt?.recipes?.find((r: Recipe) => r.buildingRequired === "Mechanical Drill");
    expect(basaltDrill).toBeDefined();
    expect(basaltDrill?.processingTimeSeconds).toBe(0.44);
    expect(basaltDrill?.ingredients.map((ing) => ing.itemId).sort()).toEqual(["blue-ice", "lava", "soul-soil"]);
  });

  it("validates RimWorld dataset integrity", () => {
    expect(RIMWORLD_DATA.id).toBe("rimworld");
    expect(RIMWORLD_DATA.items.length).toBeGreaterThan(0);
    for (const item of RIMWORLD_DATA.items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
    }
  });
});
