import { describe, it, expect } from "vitest";
import { parseGameDatasetXml } from "../xml-parser";
import lrlXml from "../lrl/items.xml";
import minecraftXml from "../minecraft/items.xml";
import satisfactoryXml from "../satisfactory/items.xml";
import factorioXml from "../factorio/items.xml";
import dysonSphereProgramXml from "../dyson-sphere-program/items.xml";

describe("xml-parser", () => {
  it("parses lrl items.xml with 71 items and image icons", () => {
    const dataset = parseGameDatasetXml(lrlXml);
    expect(dataset.id).toBe("lrl");
    expect(dataset.name).toBe("Little Rocket Lab");
    expect(dataset.items).toHaveLength(71);

    const plank = dataset.items.find((i) => i.name === "Boardwalk Plank");
    expect(plank).toBeDefined();
    expect(plank?.category).toBe("Repairs");
    expect(plank?.icon).toBe("/lrl/items/Boardwalk_Plank.png");
    expect(plank?.recipe?.buildingRequired).toBe("Assembler (level 2)");
    expect(plank?.recipe?.processingTimeSeconds).toBe(6);
    expect(plank?.lastUpdated).toBe("2026-09-15");
  });

  it("parses minecraft items.xml with recipes and items", () => {
    const dataset = parseGameDatasetXml(minecraftXml);
    expect(dataset.id).toBe("minecraft");
    expect(dataset.name).toBe("Minecraft");
    expect(dataset.items.length).toBeGreaterThan(0);

    const pickaxe = dataset.items.find((i) => i.id === "iron-pickaxe");
    expect(pickaxe).toBeDefined();
    expect(pickaxe?.name).toBe("Iron Pickaxe");
    expect(pickaxe?.category).toBe("Tools");
    expect(pickaxe?.lastUpdated).toBe("2026-09-15");
    expect(pickaxe?.recipe).toBeDefined();
    expect(pickaxe?.recipe?.buildingRequired).toBe("Crafting Table");
    expect(pickaxe?.recipe?.ingredients).toHaveLength(2);
  });

  it("parses all game datasets consistently", () => {
    const datasets = [
      parseGameDatasetXml(lrlXml),
      parseGameDatasetXml(satisfactoryXml),
      parseGameDatasetXml(factorioXml),
      parseGameDatasetXml(minecraftXml),
      parseGameDatasetXml(dysonSphereProgramXml),
    ];

    expect(datasets.map((d) => d.id)).toEqual([
      "lrl",
      "satisfactory",
      "factorio",
      "minecraft",
      "dyson-sphere-program",
    ]);

    for (const d of datasets) {
      expect(d.name.length).toBeGreaterThan(0);
      expect(d.items.length).toBeGreaterThan(0);
      for (const item of d.items) {
        expect(item.id.length).toBeGreaterThan(0);
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.lastUpdated?.length).toBeGreaterThan(0);
      }
    }
  });
});
