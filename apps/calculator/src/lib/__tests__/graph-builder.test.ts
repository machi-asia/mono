import { describe, it, expect } from "vitest";
import { calculateRecipeGraph } from "../graph-builder";
import { parseGameDatasetXml } from "../../data/xml-parser";
import lrlXml from "../../data/lrl/items.xml";
import type { ProductionRequest } from "../../types/graph";

describe("graph-builder", () => {
  const dataset = parseGameDatasetXml(lrlXml);

  it("calculates recipe graph for Boardwalk Plank", () => {
    const requests: ProductionRequest[] = [
      { itemId: "boardwalk-plank", targetQuantityPerMinute: 60 },
    ];

    const result = calculateRecipeGraph(dataset.items, requests);
    expect(result.nodes.length).toBeGreaterThan(1);
    expect(result.edges.length).toBeGreaterThan(0);

    const plankNode = result.nodes.find((n) => n.id === "node-boardwalk-plank");
    expect(plankNode).toBeDefined();
    expect(plankNode?.data.outputPerMinute).toBe(60);
    expect(plankNode?.data.isRequested).toBe(true);
    expect(plankNode?.data.building).toBe("Assembler (level 2)");
    // Boardwalk plank throughput is 10/min (or 6s processing time) -> 60/10 = 6 machines
    expect(plankNode?.data.buildingCount).toBe(6);

    // Wood ingredient requirement: 2 wood per plank -> 120 Wood / min
    const woodNode = result.nodes.find((n) => n.id === "node-wood");
    expect(woodNode).toBeDefined();
    expect(woodNode?.data.outputPerMinute).toBe(120);

    // Iron Plate ingredient requirement: 1 iron plate per plank -> 60 Iron Plate / min
    const ironPlateNode = result.nodes.find((n) => n.id === "node-iron-plate");
    expect(ironPlateNode).toBeDefined();
    expect(ironPlateNode?.data.outputPerMinute).toBe(60);
  });

  it("handles multiple requests and sums shared ingredient nodes", () => {
    const requests: ProductionRequest[] = [
      { itemId: "boardwalk-plank", targetQuantityPerMinute: 30 },
      { itemId: "roof-tile", targetQuantityPerMinute: 45 },
    ];

    const result = calculateRecipeGraph(dataset.items, requests);
    expect(result.nodes.length).toBeGreaterThan(2);

    const plankNode = result.nodes.find((n) => n.id === "node-boardwalk-plank");
    const tileNode = result.nodes.find((n) => n.id === "node-roof-tile");
    expect(plankNode?.data.isRequested).toBe(true);
    expect(tileNode?.data.isRequested).toBe(true);
  });

  it("safely handles cycle recipes without infinite loop", () => {
    const cyclicItemA = {
      id: "cycle-a",
      name: "Cycle A",
      category: "Test",
      icon: "A",
      description: "Test",
      recipe: {
        id: "r-a",
        name: "R A",
        buildingRequired: "Bench",
        processingTimeSeconds: 1,
        ingredients: [{ itemId: "cycle-b", itemName: "Cycle B", amount: 1 }],
        outputs: [{ itemId: "cycle-a", itemName: "Cycle A", amount: 1 }],
      },
    };
    const cyclicItemB = {
      id: "cycle-b",
      name: "Cycle B",
      category: "Test",
      icon: "B",
      description: "Test",
      recipe: {
        id: "r-b",
        name: "R B",
        buildingRequired: "Bench",
        processingTimeSeconds: 1,
        ingredients: [{ itemId: "cycle-a", itemName: "Cycle A", amount: 1 }],
        outputs: [{ itemId: "cycle-b", itemName: "Cycle B", amount: 1 }],
      },
    };

    const result = calculateRecipeGraph([cyclicItemA, cyclicItemB], [
      { itemId: "cycle-a", targetQuantityPerMinute: 10 },
    ]);
    expect(result.nodes.length).toBe(2);
    expect(result.edges.length).toBe(2);
  });
});
