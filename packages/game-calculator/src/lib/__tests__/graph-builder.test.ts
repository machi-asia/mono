import { describe, it, expect } from "vitest";
import { calculateRecipeGraph } from "../graph-builder";
import type { GameItem } from "../../types/data";

const MOCK_ITEMS: GameItem[] = [
  {
    id: "iron-ore",
    name: "Iron Ore",
    category: "Raw",
    icon: "🪨",
    description: "Raw iron ore",
    recipes: [],
  },
  {
    id: "iron-ingot",
    name: "Iron Ingot",
    category: "Ingots",
    icon: "🧱",
    description: "Smelted iron ingot",
    recipes: [
      {
        id: "recipe-smelt-iron",
        name: "Smelt Iron Ingot",
        buildingRequired: "Furnace",
        processingTimeSeconds: 2,
        ingredients: [{ itemId: "iron-ore", itemName: "Iron Ore", amount: 1 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
      },
    ],
  },
  {
    id: "iron-sheet",
    name: "Iron Sheet",
    category: "Sheets",
    icon: "⚙️",
    description: "Pressed iron sheet",
    recipes: [
      {
        id: "recipe-press-sheet",
        name: "Press Iron Sheet",
        buildingRequired: "Press",
        processingTimeSeconds: 1,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        outputs: [{ itemId: "iron-sheet", itemName: "Iron Sheet", amount: 1 }],
      },
    ],
  },
];

describe("calculateRecipeGraph", () => {
  it("calculates correct machine counts and raw ingredients for a single tier", () => {
    const result = calculateRecipeGraph(MOCK_ITEMS, [
      { itemId: "iron-ingot", targetQuantityPerMinute: 60 },
    ]);

    expect(result.nodes).toHaveLength(2); // iron-ingot and iron-ore
    expect(result.totalBuildings["Furnace"]).toBe(2); // 60/min with 2s processing (30/min per machine) -> 2 machines
    expect(result.rawIngredients).toHaveLength(1);
    expect(result.rawIngredients[0]?.itemName).toBe("Iron Ore");
    expect(result.rawIngredients[0]?.requiredPerMinute).toBe(60);
  });

  it("calculates multi-tier dependencies correctly", () => {
    const result = calculateRecipeGraph(MOCK_ITEMS, [
      { itemId: "iron-sheet", targetQuantityPerMinute: 60 },
    ]);

    expect(result.nodes).toHaveLength(3); // iron-sheet, iron-ingot, iron-ore
    expect(result.totalBuildings["Press"]).toBe(1);
    expect(result.totalBuildings["Furnace"]).toBe(2);
    expect(result.totalBuildings["Mechanical Belt"]).toBeGreaterThan(0);
    expect(result.edges.length).toBeGreaterThan(0);
    expect(result.edges[0]?.type).toBe("conveyorBelt");
    expect(result.edges[0]?.data?.belts).toBeDefined();
    expect(result.rawIngredients[0]?.requiredPerMinute).toBe(60);
  });

  it("handles alternative multi-choice ingredients and switching candidates", () => {
    const itemsWithChoice: GameItem[] = [
      ...MOCK_ITEMS,
      {
        id: "zinc-ore",
        name: "Zinc Ore",
        category: "Raw",
        icon: "🪨",
        description: "Raw zinc ore",
        recipes: [],
      },
      {
        id: "zinc-ingot",
        name: "Zinc Ingot",
        category: "Ingots",
        icon: "⚪",
        description: "Smelted zinc ingot",
        recipes: [
          {
            id: "recipe-smelt-zinc",
            name: "Smelt Zinc Ingot",
            buildingRequired: "Furnace",
            processingTimeSeconds: 2,
            ingredients: [{ itemId: "zinc-ore", itemName: "Zinc Ore", amount: 1 }],
            outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
          },
        ],
      },
      {
        id: "compound-machine",
        name: "Compound Machine",
        category: "Machines",
        icon: "⚡",
        description: "Machine requiring iron or zinc",
        recipes: [
          {
            id: "recipe-compound-machine",
            name: "Craft Compound Machine",
            buildingRequired: "Crafter",
            processingTimeSeconds: 1,
            ingredients: [
              { itemId: "iron-zinc-choice", itemName: "Iron Ingot;Zinc Ingot", amount: 1 },
            ],
            outputs: [{ itemId: "compound-machine", itemName: "Compound Machine", amount: 1 }],
          },
        ],
      },
    ];

    // Default choice without override selects Iron Ingot
    const defaultResult = calculateRecipeGraph(itemsWithChoice, [
      { itemId: "compound-machine", targetQuantityPerMinute: 60 },
    ]);
    const ironNode = defaultResult.nodes.find((n) => n.id === "node-iron-ingot");
    expect(ironNode).toBeDefined();
    expect(ironNode?.data.candidateOptions).toHaveLength(2);
    expect(ironNode?.data.candidateOptions?.map((o) => o.name)).toEqual(["Iron Ingot", "Zinc Ingot"]);
    expect(defaultResult.nodes.some((n) => n.id === "node-zinc-ingot")).toBe(false);

    // Override choice to Zinc Ingot
    const zincResult = calculateRecipeGraph(
      itemsWithChoice,
      [{ itemId: "compound-machine", targetQuantityPerMinute: 60 }],
      undefined,
      { "iron-zinc-choice": "zinc-ingot" }
    );
    const zincNode = zincResult.nodes.find((n) => n.id === "node-zinc-ingot");
    expect(zincNode).toBeDefined();
    expect(zincResult.nodes.some((n) => n.id === "node-iron-ingot")).toBe(false);
    expect(zincResult.rawIngredients.some((r) => r.itemName === "Zinc Ore")).toBe(true);
  });

  it("marks a node as raw input and terminates upstream recipe expansion when included in rawInputs", () => {
    // Normal graph: iron-sheet -> iron-ingot -> iron-ore (3 tiers, 3 nodes)
    const normalResult = calculateRecipeGraph(MOCK_ITEMS, [
      { itemId: "iron-sheet", targetQuantityPerMinute: 60 },
    ]);
    expect(normalResult.nodes).toHaveLength(3);
    expect(normalResult.nodes.map((n) => n.id)).toEqual(
      expect.arrayContaining(["node-iron-sheet", "node-iron-ingot", "node-iron-ore"])
    );

    // In the normal graph, iron-ore has no recipes so it should automatically be marked isRawInput: true
    const ironOreNode = normalResult.nodes.find((n) => n.id === "node-iron-ore");
    expect(ironOreNode?.data.isRawInput).toBe(true);

    // Setting iron-ingot as raw input should terminate its upstream recipes (so no iron-ore node)
    const rawResult = calculateRecipeGraph(
      MOCK_ITEMS,
      [{ itemId: "iron-sheet", targetQuantityPerMinute: 60 }],
      undefined,
      undefined,
      new Set(["iron-ingot"])
    );

    expect(rawResult.nodes).toHaveLength(2); // iron-sheet and iron-ingot
    expect(rawResult.nodes.some((n) => n.id === "node-iron-ore")).toBe(false);

    const ironIngotNode = rawResult.nodes.find((n) => n.id === "node-iron-ingot");
    expect(ironIngotNode?.data.isRawInput).toBe(true);
    // Raw ingredients list should now list Iron Ingot as a raw input
    expect(rawResult.rawIngredients.some((r) => r.itemName === "Iron Ingot")).toBe(true);
    expect(rawResult.rawIngredients.some((r) => r.itemName === "Iron Ore")).toBe(false);
  });

  it("unifies mB fluid quantities (e.g. 100mB of Lava) with the base fluid item", () => {
    const fluidItems: GameItem[] = [
      {
        id: "lava",
        name: "Lava",
        category: "Fluids",
        icon: "🔥",
        description: "Lava",
        recipes: [],
      },
      {
        id: "andesite-alloy",
        name: "Andesite Alloy",
        category: "Alloys",
        icon: "⚙️",
        description: "Alloy",
        recipes: [
          {
            id: "recipe-alloy-lava",
            name: "Mix Andesite with Lava",
            buildingRequired: "Mixer",
            processingTimeSeconds: 1,
            ingredients: [
              { itemId: "100mb-of-lava", itemName: "100mB of Lava", amount: 1 },
            ],
            outputs: [{ itemId: "andesite-alloy", itemName: "Andesite Alloy", amount: 1 }],
          },
        ],
      },
      {
        id: "basalt",
        name: "Basalt",
        category: "Blocks",
        icon: "🪨",
        description: "Basalt",
        recipes: [
          {
            id: "recipe-drill-basalt",
            name: "Drill Basalt",
            buildingRequired: "Drill",
            processingTimeSeconds: 1,
            ingredients: [
              { itemId: "lava", itemName: "Lava", amount: 1 },
            ],
            outputs: [{ itemId: "basalt", itemName: "Basalt", amount: 1 }],
          },
        ],
      },
    ];

    const result = calculateRecipeGraph(fluidItems, [
      { itemId: "andesite-alloy", targetQuantityPerMinute: 60 },
      { itemId: "basalt", targetQuantityPerMinute: 60 },
    ]);

    // Both recipes require lava - one referenced "100mB of Lava" and one referenced "Lava".
    // They should merge into a single "node-lava" node rather than two separate nodes.
    const lavaNodes = result.nodes.filter((n) => n.id === "node-lava");
    expect(lavaNodes).toHaveLength(1);
    expect(result.nodes.some((n) => n.id.includes("100mb-of-lava"))).toBe(false);
    expect(result.rawIngredients.filter((r) => r.itemId === "lava" || r.itemName === "Lava")).toHaveLength(1);
  });
});


