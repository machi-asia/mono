import type { GameItem } from "@mono/game-calculator";
import { RAW_ITEM_ICONS } from "./raw-item-icons";

function getIcon(name: string, fallbackSlug: string): string {
  if (RAW_ITEM_ICONS[name]) return RAW_ITEM_ICONS[name];
  if (fallbackSlug.startsWith("http") || fallbackSlug.startsWith("/")) return fallbackSlug;
  return `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${fallbackSlug}.png`;
}

function getBlockIcon(name: string, fallbackSlug: string): string {
  if (RAW_ITEM_ICONS[name]) return RAW_ITEM_ICONS[name];
  if (fallbackSlug.startsWith("http") || fallbackSlug.startsWith("/")) return fallbackSlug;
  return `/items/${fallbackSlug}.png`;
}

export const VANILLA_CRAFTING_ITEMS: GameItem[] = [
  // --- Basic Materials & Smelted Metals (Fan + Lava) ---
  {
    id: "iron-ingot",
    name: "Iron Ingot",
    category: "Materials & Resources",
    icon: getIcon("Iron Ingot", "iron_ingot"),
    description: "Versatile metal ingot. Smelted with Encased Fan + Lava (Bulk Blasting) or crafted with Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-raw-iron",
        name: "Bulk Blasting (from Raw Iron)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-iron", itemName: "Raw Iron", amount: 1 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-fan-blasting-iron-ore",
        name: "Bulk Blasting (from Iron Ore)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "iron-ore", itemName: "Iron Ore", amount: 1 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-iron-ingot-crafter-nuggets",
        name: "Mechanical Crafter - Iron Ingot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-nugget", itemName: "Iron Nugget", amount: 9 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "copper-ingot",
    name: "Copper Ingot",
    category: "Materials & Resources",
    icon: getIcon("Copper Ingot", "copper_ingot"),
    description: "Conductor metal. Smelted with Encased Fan + Lava or crafted from Block of Copper.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-raw-copper",
        name: "Bulk Blasting (from Raw Copper)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-copper", itemName: "Raw Copper", amount: 1 }],
        outputs: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-fan-blasting-copper-ore",
        name: "Bulk Blasting (from Copper Ore)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "copper-ore", itemName: "Copper Ore", amount: 1 }],
        outputs: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-copper-ingot-crafter-nuggets",
        name: "Mechanical Crafter - Copper Ingot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "copper-nugget", itemName: "Copper Nugget", amount: 9 }],
        outputs: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "zinc-ingot",
    name: "Zinc Ingot",
    category: "Materials & Resources",
    icon: getIcon("Zinc Ingot", "iron_ingot"),
    description: "Essential component for Andesite Alloy and Brass.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-fan-blasting-raw-zinc",
        name: "Bulk Blasting (from Raw Zinc)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-zinc", itemName: "Raw Zinc", amount: 1 }],
        outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-fan-blasting-zinc-ore",
        name: "Bulk Blasting (from Zinc Ore)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "zinc-ore", itemName: "Zinc Ore", amount: 1 }],
        outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-zinc-ingot-crafter-nuggets",
        name: "Mechanical Crafter - Zinc Ingot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "zinc-nugget", itemName: "Zinc Nugget", amount: 9 }],
        outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "block-of-iron",
    name: "Block of Iron",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Iron", "iron_block"),
    description: "Solid block of iron crafted with 9 Iron Ingots in a Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-block-of-iron-crafter",
        name: "Mechanical Crafter - Block of Iron",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 9 }],
        outputs: [{ itemId: "block-of-iron", itemName: "Block of Iron", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "stick",
    name: "Stick",
    category: "Components & Tools",
    icon: getIcon("Stick", "stick"),
    description: "Basic crafting wooden stick crafted with planks in a Mechanical Crafter or Saw.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stick-crafter-planks",
        name: "Mechanical Crafter - Stick",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "any-planks", itemName: "Any Planks", amount: 2 }],
        outputs: [{ itemId: "stick", itemName: "Stick", amount: 4 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "crafting-table",
    name: "Crafting Table",
    category: "Building & Decoration",
    icon: getBlockIcon("Crafting Table", "crafting_table"),
    description: "Standard crafting table made from 4 wooden planks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-crafting-table-crafter",
        name: "Mechanical Crafter - Crafting Table",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "any-planks", itemName: "Any Planks", amount: 4 }],
        outputs: [{ itemId: "crafting-table", itemName: "Crafting Table", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "chest",
    name: "Chest",
    category: "Logistics & Fluids",
    icon: getBlockIcon("Chest", "chest"),
    description: "Single storage container crafted from 8 wooden planks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-chest-crafter",
        name: "Mechanical Crafter - Chest",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "any-planks", itemName: "Any Planks", amount: 8 }],
        outputs: [{ itemId: "chest", itemName: "Chest", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "barrel",
    name: "Barrel",
    category: "Logistics & Fluids",
    icon: getBlockIcon("Barrel", "barrel_top"),
    description: "Compact storage block crafted from planks and wooden slabs.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-barrel-crafter",
        name: "Mechanical Crafter - Barrel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "any-planks", itemName: "Any Planks", amount: 6 },
          { itemId: "any-wood-slab", itemName: "Any Wood Slab", amount: 2 }
        ],
        outputs: [{ itemId: "barrel", itemName: "Barrel", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "furnace",
    name: "Furnace",
    category: "Building & Decoration",
    icon: getBlockIcon("Furnace", "furnace_front"),
    description: "Cobblestone furnace crafted in a Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-furnace-crafter",
        name: "Mechanical Crafter - Furnace",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "cobblestone", itemName: "Cobblestone", amount: 8 }],
        outputs: [{ itemId: "furnace", itemName: "Furnace", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "iron-bars",
    name: "Iron Bars",
    category: "Building & Decoration",
    icon: getBlockIcon("Iron Bars", "iron_bars"),
    description: "Metal bars crafted from 6 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-bars-crafter",
        name: "Mechanical Crafter - Iron Bars",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 6 }],
        outputs: [{ itemId: "iron-bars", itemName: "Iron Bars", amount: 16 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "hopper",
    name: "Hopper",
    category: "Logistics & Fluids",
    icon: getIcon("Hopper", "hopper"),
    description: "Item funnel and transfer device crafted from 5 Iron Ingots and a Chest.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-hopper-crafter",
        name: "Mechanical Crafter - Hopper",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 5 },
          { itemId: "chest", itemName: "Chest", amount: 1 }
        ],
        outputs: [{ itemId: "hopper", itemName: "Hopper", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "piston",
    name: "Piston",
    category: "Redstone & Displays",
    icon: getBlockIcon("Piston", "piston_top"),
    description: "Redstone mechanical pusher crafted in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-piston-crafter",
        name: "Mechanical Crafter - Piston",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "any-planks", itemName: "Any Planks", amount: 3 },
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 4 },
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 }
        ],
        outputs: [{ itemId: "piston", itemName: "Piston", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "observer",
    name: "Observer",
    category: "Redstone & Displays",
    icon: getBlockIcon("Observer", "observer_front"),
    description: "Block update detector crafted from Cobblestone, Redstone Dust, and Nether Quartz.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-observer-crafter",
        name: "Mechanical Crafter - Observer",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 6 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 2 },
          { itemId: "nether-quartz", itemName: "Nether Quartz", amount: 1 }
        ],
        outputs: [{ itemId: "observer", itemName: "Observer", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-torch",
    name: "Redstone Torch",
    category: "Redstone & Displays",
    icon: getIcon("Redstone Torch", "redstone_torch"),
    description: "Constant redstone power source crafted from Redstone Dust and a Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-torch-crafter",
        name: "Mechanical Crafter - Redstone Torch",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "redstone-torch", itemName: "Redstone Torch", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-repeater",
    name: "Redstone Repeater",
    category: "Redstone & Displays",
    icon: getIcon("Redstone Repeater", "repeater"),
    description: "Signal booster and delay circuit component.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-repeater-crafter",
        name: "Mechanical Crafter - Redstone Repeater",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "redstone-torch", itemName: "Redstone Torch", amount: 2 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 },
          { itemId: "any-stone", itemName: "Any Stone", amount: 3 }
        ],
        outputs: [{ itemId: "redstone-repeater", itemName: "Redstone Repeater", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-comparator",
    name: "Redstone Comparator",
    category: "Redstone & Displays",
    icon: getIcon("Redstone Comparator", "comparator"),
    description: "Analyzes container fullness and compares signal strengths.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-comparator-crafter",
        name: "Mechanical Crafter - Redstone Comparator",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "redstone-torch", itemName: "Redstone Torch", amount: 3 },
          { itemId: "nether-quartz", itemName: "Nether Quartz", amount: 1 },
          { itemId: "any-stone", itemName: "Any Stone", amount: 3 }
        ],
        outputs: [{ itemId: "redstone-comparator", itemName: "Redstone Comparator", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "compass",
    name: "Compass",
    category: "Components & Tools",
    icon: getIcon("Compass", "compass_16"),
    description: "Navigation instrument crafted from 4 Iron Ingots and 1 Redstone Dust.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-compass-crafter",
        name: "Mechanical Crafter - Compass",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 4 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 }
        ],
        outputs: [{ itemId: "compass", itemName: "Compass", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "clock",
    name: "Clock",
    category: "Components & Tools",
    icon: getIcon("Clock", "clock_16"),
    description: "Timekeeping tool crafted from 4 Gold Ingots and 1 Redstone Dust.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-clock-crafter",
        name: "Mechanical Crafter - Clock",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 4 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 }
        ],
        outputs: [{ itemId: "clock", itemName: "Clock", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "lever",
    name: "Lever",
    category: "Redstone & Displays",
    icon: getIcon("Lever", "lever"),
    description: "Switch toggled by hand crafted from a Stick and Cobblestone.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-lever-crafter",
        name: "Mechanical Crafter - Lever",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "stick", itemName: "Stick", amount: 1 },
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 1 }
        ],
        outputs: [{ itemId: "lever", itemName: "Lever", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "dried-kelp",
    name: "Dried Kelp",
    category: "Food & Farming",
    icon: getIcon("Dried Kelp", "dried_kelp"),
    description: "Smoked kelp food and crafting resource made via Bulk Smoking (Encased Fan + Campfire).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-kelp",
        name: "Bulk Smoking (from Kelp)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "kelp", itemName: "Kelp", amount: 1 }],
        outputs: [{ itemId: "dried-kelp", itemName: "Dried Kelp", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "dried-kelp-block",
    name: "Dried Kelp Block",
    category: "Building & Decoration",
    icon: getBlockIcon("Dried Kelp Block", "dried_kelp_top"),
    description: "Compact block of 9 Dried Kelp crafted with a Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-dried-kelp-block-crafter",
        name: "Mechanical Crafter - Dried Kelp Block",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "dried-kelp", itemName: "Dried Kelp", amount: 9 }],
        outputs: [{ itemId: "dried-kelp-block", itemName: "Dried Kelp Block", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },

  // --- Cooked Foods (Bulk Smoking with Encased Fan + Campfire) ---
  {
    id: "cooked-beef",
    name: "Cooked Beef",
    category: "Food & Farming",
    icon: getIcon("Cooked Beef", "cooked_beef"),
    description: "Steak cooked with Encased Fan + Campfire (Bulk Smoking).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-beef",
        name: "Bulk Smoking (from Raw Beef)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-beef", itemName: "Raw Beef", amount: 1 }],
        outputs: [{ itemId: "cooked-beef", itemName: "Cooked Beef", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-porkchop",
    name: "Cooked Porkchop",
    category: "Food & Farming",
    icon: getIcon("Cooked Porkchop", "cooked_porkchop"),
    description: "Tender porkchop cooked with Encased Fan + Campfire (Bulk Smoking).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-porkchop",
        name: "Bulk Smoking (from Raw Porkchop)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-porkchop", itemName: "Raw Porkchop", amount: 1 }],
        outputs: [{ itemId: "cooked-porkchop", itemName: "Cooked Porkchop", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-chicken",
    name: "Cooked Chicken",
    category: "Food & Farming",
    icon: getIcon("Cooked Chicken", "cooked_chicken"),
    description: "Cooked chicken produced with Encased Fan + Campfire (Bulk Smoking).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-chicken",
        name: "Bulk Smoking (from Raw Chicken)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-chicken", itemName: "Raw Chicken", amount: 1 }],
        outputs: [{ itemId: "cooked-chicken", itemName: "Cooked Chicken", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-mutton",
    name: "Cooked Mutton",
    category: "Food & Farming",
    icon: getIcon("Cooked Mutton", "cooked_mutton"),
    description: "Cooked mutton smoked via Encased Fan + Campfire.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-mutton",
        name: "Bulk Smoking (from Raw Mutton)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-mutton", itemName: "Raw Mutton", amount: 1 }],
        outputs: [{ itemId: "cooked-mutton", itemName: "Cooked Mutton", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-salmon",
    name: "Cooked Salmon",
    category: "Food & Farming",
    icon: getIcon("Cooked Salmon", "cooked_salmon"),
    description: "Smoked salmon prepared with Encased Fan + Campfire.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-salmon",
        name: "Bulk Smoking (from Raw Salmon)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-salmon", itemName: "Raw Salmon", amount: 1 }],
        outputs: [{ itemId: "cooked-salmon", itemName: "Cooked Salmon", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-cod",
    name: "Cooked Cod",
    category: "Food & Farming",
    icon: getIcon("Cooked Cod", "cooked_cod"),
    description: "Smoked cod prepared with Encased Fan + Campfire.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-cod",
        name: "Bulk Smoking (from Raw Cod)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-cod", itemName: "Raw Cod", amount: 1 }],
        outputs: [{ itemId: "cooked-cod", itemName: "Cooked Cod", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "baked-potato",
    name: "Baked Potato",
    category: "Food & Farming",
    icon: getIcon("Baked Potato", "baked_potato"),
    description: "Potato roasted via Bulk Smoking (Encased Fan + Campfire).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-potato",
        name: "Bulk Smoking (from Potato)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "potato", itemName: "Potato", amount: 1 }],
        outputs: [{ itemId: "baked-potato", itemName: "Baked Potato", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "bread",
    name: "Bread",
    category: "Food & Farming",
    icon: getIcon("Bread", "bread"),
    description: "Smoked from Dough with Encased Fan + Campfire, or crafted from 3 Wheat in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-dough",
        name: "Bulk Smoking (from Dough)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "dough", itemName: "Dough", amount: 1 }],
        outputs: [{ itemId: "bread", itemName: "Bread", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-bread-crafter-wheat",
        name: "Mechanical Crafter - Bread",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "wheat", itemName: "Wheat", amount: 3 }],
        outputs: [{ itemId: "bread", itemName: "Bread", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "golden-apple",
    name: "Golden Apple",
    category: "Food & Farming",
    icon: getIcon("Golden Apple", "golden_apple"),
    description: "Infused golden apple crafted in Mechanical Crafter from 8 Gold Ingots and an Apple.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-apple-crafter",
        name: "Mechanical Crafter - Golden Apple",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 8 },
          { itemId: "apple", itemName: "Apple", amount: 1 }
        ],
        outputs: [{ itemId: "golden-apple", itemName: "Golden Apple", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "golden-carrot",
    name: "Golden Carrot",
    category: "Food & Farming",
    icon: getIcon("Golden Carrot", "golden_carrot"),
    description: "Nutritious golden carrot crafted in Mechanical Crafter from 8 Gold Nuggets and a Carrot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-carrot-crafter",
        name: "Mechanical Crafter - Golden Carrot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-nugget", itemName: "Gold Nugget", amount: 8 },
          { itemId: "carrot", itemName: "Carrot", amount: 1 }
        ],
        outputs: [{ itemId: "golden-carrot", itemName: "Golden Carrot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "glistering-melon-slice",
    name: "Glistering Melon Slice",
    category: "Food & Farming",
    icon: getIcon("Glistering Melon Slice", "glistering_melon_slice"),
    description: "Brewing ingredient crafted from 8 Gold Nuggets and a Melon Slice in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-glistering-melon-crafter",
        name: "Mechanical Crafter - Glistering Melon",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-nugget", itemName: "Gold Nugget", amount: 8 },
          { itemId: "melon-slice", itemName: "Melon Slice", amount: 1 }
        ],
        outputs: [{ itemId: "glistering-melon-slice", itemName: "Glistering Melon Slice", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "pumpkin-pie",
    name: "Pumpkin Pie",
    category: "Food & Farming",
    icon: getIcon("Pumpkin Pie", "pumpkin_pie"),
    description: "Pastry crafted from Pumpkin, Sugar, and an Egg in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-pumpkin-pie-crafter",
        name: "Mechanical Crafter - Pumpkin Pie",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "pumpkin", itemName: "Pumpkin", amount: 1 },
          { itemId: "sugar", itemName: "Sugar", amount: 1 },
          { itemId: "egg", itemName: "Egg", amount: 1 }
        ],
        outputs: [{ itemId: "pumpkin-pie", itemName: "Pumpkin Pie", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cookie",
    name: "Cookie",
    category: "Food & Farming",
    icon: getIcon("Cookie", "cookie"),
    description: "Baked sweet treat crafted from Wheat and Cocoa Beans in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-cookie-crafter",
        name: "Mechanical Crafter - Cookie",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "wheat", itemName: "Wheat", amount: 2 },
          { itemId: "cocoa-beans", itemName: "Cocoa Beans", amount: 1 }
        ],
        outputs: [{ itemId: "cookie", itemName: "Cookie", amount: 8 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cake",
    name: "Cake",
    category: "Food & Farming",
    icon: getIcon("Cake", "cake"),
    description: "Multi-slice celebratory dessert block. Automated in a Mechanical Crafter using 3 Milk Buckets, 2 Sugar, 1 Egg, and 3 Wheat.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-cake-crafter",
        name: "Mechanical Crafter - Cake",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "milk-bucket", itemName: "Milk Bucket", amount: 3 },
          { itemId: "sugar", itemName: "Sugar", amount: 2 },
          { itemId: "egg", itemName: "Egg", amount: 1 },
          { itemId: "wheat", itemName: "Wheat", amount: 3 }
        ],
        outputs: [{ itemId: "cake", itemName: "Cake", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },

  // --- Vanilla Compression Storage Blocks (Mechanical Crafter) ---
  {
    id: "iron-block",
    name: "Block of Iron",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Iron", "iron_block"),
    description: "Solid block of iron crafted in Mechanical Crafter from 9 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-block-crafter",
        name: "Mechanical Crafter - Block of Iron",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 9 }],
        outputs: [{ itemId: "iron-block", itemName: "Block of Iron", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "gold-block",
    name: "Block of Gold",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Gold", "gold_block"),
    description: "Solid block of gold crafted in Mechanical Crafter from 9 Gold Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-gold-block-crafter",
        name: "Mechanical Crafter - Block of Gold",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "gold-ingot", itemName: "Gold Ingot", amount: 9 }],
        outputs: [{ itemId: "gold-block", itemName: "Block of Gold", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "copper-block",
    name: "Block of Copper",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Copper", "copper_block"),
    description: "Solid block of copper crafted in Mechanical Crafter from 9 Copper Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-copper-block-crafter",
        name: "Mechanical Crafter - Block of Copper",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 9 }],
        outputs: [{ itemId: "copper-block", itemName: "Block of Copper", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "diamond-block",
    name: "Block of Diamond",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Diamond", "diamond_block"),
    description: "Solid block of diamond crafted in Mechanical Crafter from 9 Diamonds.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-block-crafter",
        name: "Mechanical Crafter - Block of Diamond",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "diamond", itemName: "Diamond", amount: 9 }],
        outputs: [{ itemId: "diamond-block", itemName: "Block of Diamond", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-block",
    name: "Block of Redstone",
    category: "Redstone & Displays",
    icon: getBlockIcon("Block of Redstone", "redstone_block"),
    description: "Constant redstone power source block crafted from 9 Redstone Dust in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-block-crafter",
        name: "Mechanical Crafter - Block of Redstone",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "redstone", itemName: "Redstone", amount: 9 }],
        outputs: [{ itemId: "redstone-block", itemName: "Block of Redstone", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "lapis-block",
    name: "Block of Lapis Lazuli",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Lapis Lazuli", "lapis_block"),
    description: "Solid block of lapis lazuli crafted in Mechanical Crafter from 9 Lapis Lazuli.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-lapis-block-crafter",
        name: "Mechanical Crafter - Block of Lapis Lazuli",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "lapis-lazuli", itemName: "Lapis Lazuli", amount: 9 }],
        outputs: [{ itemId: "lapis-block", itemName: "Block of Lapis Lazuli", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "coal-block",
    name: "Block of Coal",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Coal", "coal_block"),
    description: "High-density fuel block crafted from 9 Coal in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-coal-block-crafter",
        name: "Mechanical Crafter - Block of Coal",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "coal", itemName: "Coal", amount: 9 }],
        outputs: [{ itemId: "coal-block", itemName: "Block of Coal", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },

  // --- Vanilla Redstone & Utility Automation Machines ---
  {
    id: "sticky-piston",
    name: "Sticky Piston",
    category: "Redstone & Displays",
    icon: getBlockIcon("Sticky Piston", "piston_top"),
    description: "Piston that pushes and pulls blocks. Crafted in Mechanical Crafter from a Piston and a Slimeball.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-sticky-piston-crafter",
        name: "Mechanical Crafter - Sticky Piston",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "piston", itemName: "Piston", amount: 1 },
          { itemId: "slimeball", itemName: "Slimeball", amount: 1 }
        ],
        outputs: [{ itemId: "sticky-piston", itemName: "Sticky Piston", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "dispenser",
    name: "Dispenser",
    category: "Redstone & Displays",
    icon: getBlockIcon("Dispenser", "dispenser_front"),
    description: "Redstone mechanism block that ejects items or shoots arrows. Crafted from 7 Cobblestone, a Bow, and 1 Redstone.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-dispenser-crafter",
        name: "Mechanical Crafter - Dispenser",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 7 },
          { itemId: "bow", itemName: "Bow", amount: 1 },
          { itemId: "redstone", itemName: "Redstone", amount: 1 }
        ],
        outputs: [{ itemId: "dispenser", itemName: "Dispenser", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "dropper",
    name: "Dropper",
    category: "Redstone & Displays",
    icon: getBlockIcon("Dropper", "dropper_front"),
    description: "Redstone mechanism block that drops items into containers or the world. Crafted from 7 Cobblestone and 1 Redstone.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-dropper-crafter",
        name: "Mechanical Crafter - Dropper",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 7 },
          { itemId: "redstone", itemName: "Redstone", amount: 1 }
        ],
        outputs: [{ itemId: "dropper", itemName: "Dropper", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "tnt",
    name: "TNT",
    category: "Components & Tools",
    icon: getBlockIcon("TNT", "tnt_side"),
    description: "Explosive block crafted from 5 Gunpowder and 4 Sand in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-tnt-crafter",
        name: "Mechanical Crafter - TNT",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gunpowder", itemName: "Gunpowder", amount: 5 },
          { itemId: "sand", itemName: "Sand", amount: 4 }
        ],
        outputs: [{ itemId: "tnt", itemName: "TNT", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cauldron",
    name: "Cauldron",
    category: "Logistics & Fluids",
    icon: getBlockIcon("Cauldron", "cauldron_side"),
    description: "Fluid holding vessel crafted from 7 Iron Ingots in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-cauldron-crafter",
        name: "Mechanical Crafter - Cauldron",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 7 }],
        outputs: [{ itemId: "cauldron", itemName: "Cauldron", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "anvil",
    name: "Anvil",
    category: "Components & Tools",
    icon: getBlockIcon("Anvil", "anvil"),
    description: "Heavy block for repairing and naming items. Crafted from 3 Blocks of Iron and 4 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-anvil-crafter",
        name: "Mechanical Crafter - Anvil",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-block", itemName: "Block of Iron", amount: 3 },
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 4 }
        ],
        outputs: [{ itemId: "anvil", itemName: "Anvil", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "shears",
    name: "Shears",
    category: "Components & Tools",
    icon: getIcon("Shears", "shears"),
    description: "Cutting tool crafted from 2 Iron Ingots in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-shears-crafter",
        name: "Mechanical Crafter - Shears",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 2 }],
        outputs: [{ itemId: "shears", itemName: "Shears", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "bucket",
    name: "Bucket",
    category: "Logistics & Fluids",
    icon: getIcon("Bucket", "bucket"),
    description: "Vessel for transporting liquids. Crafted from 3 Iron Ingots in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-bucket-crafter",
        name: "Mechanical Crafter - Bucket",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 3 }],
        outputs: [{ itemId: "bucket", itemName: "Bucket", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "flint-and-steel",
    name: "Flint and Steel",
    category: "Components & Tools",
    icon: getIcon("Flint and Steel", "flint_and_steel"),
    description: "Fire starter crafted from 1 Iron Ingot and 1 Flint in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-flint-and-steel-crafter",
        name: "Mechanical Crafter - Flint and Steel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 },
          { itemId: "flint", itemName: "Flint", amount: 1 }
        ],
        outputs: [{ itemId: "flint-and-steel", itemName: "Flint and Steel", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "bow",
    name: "Bow",
    category: "Components & Tools",
    icon: getIcon("Bow", "bow"),
    description: "Ranged weapon crafted from 3 Sticks and 3 String in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-bow-crafter",
        name: "Mechanical Crafter - Bow",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "stick", itemName: "Stick", amount: 3 },
          { itemId: "string", itemName: "String", amount: 3 }
        ],
        outputs: [{ itemId: "bow", itemName: "Bow", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "arrow",
    name: "Arrow",
    category: "Components & Tools",
    icon: getIcon("Arrow", "arrow"),
    description: "Ammunition crafted from 1 Flint, 1 Stick, and 1 Feather in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-arrow-crafter",
        name: "Mechanical Crafter - Arrow",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "flint", itemName: "Flint", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 1 },
          { itemId: "feather", itemName: "Feather", amount: 1 }
        ],
        outputs: [{ itemId: "arrow", itemName: "Arrow", amount: 4 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "firework-rocket",
    name: "Firework Rocket",
    category: "Components & Tools",
    icon: getIcon("Firework Rocket", "firework_rocket"),
    description: "Pyrotechnic flight booster crafted from 1 Gunpowder and 1 Paper in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-firework-rocket-crafter",
        name: "Mechanical Crafter - Firework Rocket",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gunpowder", itemName: "Gunpowder", amount: 1 },
          { itemId: "paper", itemName: "Paper", amount: 1 }
        ],
        outputs: [{ itemId: "firework-rocket", itemName: "Firework Rocket", amount: 3 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "lead",
    name: "Lead",
    category: "Components & Tools",
    icon: getIcon("Lead", "lead"),
    description: "Leash for creatures crafted from 4 String and 1 Slimeball in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-lead-crafter",
        name: "Mechanical Crafter - Lead",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "string", itemName: "String", amount: 4 },
          { itemId: "slimeball", itemName: "Slimeball", amount: 1 }
        ],
        outputs: [{ itemId: "lead", itemName: "Lead", amount: 2 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "smooth-stone",
    name: "Smooth Stone",
    category: "Materials & Resources",
    icon: getBlockIcon("Smooth Stone", "smooth_stone"),
    description: "Smelted stone processed via Bulk Blasting (Encased Fan + Lava).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-stone",
        name: "Bulk Blasting (from Stone)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "any-stone", itemName: "Any Stone", amount: 1 }],
        outputs: [{ itemId: "smooth-stone", itemName: "Smooth Stone", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "stone",
    name: "Stone",
    category: "Materials & Resources",
    icon: getBlockIcon("Stone", "stone"),
    description: "Refined rock smelted from Cobblestone via Bulk Blasting (Encased Fan + Lava).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-cobblestone",
        name: "Bulk Blasting (from Cobblestone)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "cobblestone", itemName: "Cobblestone", amount: 1 }],
        outputs: [{ itemId: "stone", itemName: "Stone", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "charcoal",
    name: "Charcoal",
    category: "Materials & Resources",
    icon: getIcon("Charcoal", "charcoal"),
    description: "Combustible lump produced by Bulk Blasting wood logs with Encased Fan + Lava.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-logs",
        name: "Bulk Blasting (from Any Log)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "any-log", itemName: "Any Log", amount: 1 }],
        outputs: [{ itemId: "charcoal", itemName: "Charcoal", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },

  // --- Specific Create Casings ---
  {
    id: "andesite-casing",
    name: "Andesite Casing",
    category: "Kinetics & Contraptions",
    icon: RAW_ITEM_ICONS["Andesite Casing"] || getBlockIcon("Andesite Casing", "andesite_casing"),
    description: "Structural casing used for standard kinetic components. Created by applying Andesite Alloy to stripped logs or stripped wood using a Deployer or manual click.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-andesite-casing-log",
        name: "Deployer (from Stripped Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-log", itemName: "Stripped Log", amount: 1 },
          { itemId: "andesite-alloy", itemName: "Andesite Alloy", amount: 1 }
        ],
        outputs: [{ itemId: "andesite-casing", itemName: "Andesite Casing", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-deploying-andesite-casing-wood",
        name: "Deployer (from Stripped Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 },
          { itemId: "andesite-alloy", itemName: "Andesite Alloy", amount: 1 }
        ],
        outputs: [{ itemId: "andesite-casing", itemName: "Andesite Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "brass-casing",
    name: "Brass Casing",
    category: "Kinetics & Contraptions",
    icon: RAW_ITEM_ICONS["Brass Casing"] || getBlockIcon("Brass Casing", "brass_casing"),
    description: "High-tier structural casing for smart automation and sequenced mechanisms. Created by applying a Brass Ingot to stripped logs or stripped wood using a Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-brass-casing-log",
        name: "Deployer (from Stripped Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-log", itemName: "Stripped Log", amount: 1 },
          { itemId: "brass-ingot", itemName: "Brass Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "brass-casing", itemName: "Brass Casing", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-deploying-brass-casing-wood",
        name: "Deployer (from Stripped Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 },
          { itemId: "brass-ingot", itemName: "Brass Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "brass-casing", itemName: "Brass Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "copper-casing",
    name: "Copper Casing",
    category: "Logistics & Fluids",
    icon: RAW_ITEM_ICONS["Copper Casing"] || getBlockIcon("Copper Casing", "copper_casing"),
    description: "Corrosion-resistant structural casing for fluid pumps, spouts, and tanks. Created by applying a Copper Ingot to stripped logs or stripped wood using a Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-copper-casing-log",
        name: "Deployer (from Stripped Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-log", itemName: "Stripped Log", amount: 1 },
          { itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "copper-casing", itemName: "Copper Casing", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-deploying-copper-casing-wood",
        name: "Deployer (from Stripped Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 },
          { itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "copper-casing", itemName: "Copper Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "train-casing",
    name: "Train Casing",
    category: "Trains & Rail",
    icon: RAW_ITEM_ICONS["Train Casing"] || getBlockIcon("Train Casing", "train_casing"),
    description: "Heavy reinforced casing for train stations, train controls, and train signals. Created by applying Sturdy Sheet to Brass Casing using a Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-train-casing",
        name: "Deployer (from Brass Casing)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "brass-casing", itemName: "Brass Casing", amount: 1 },
          { itemId: "sturdy-sheet", itemName: "Sturdy Sheet", amount: 1 }
        ],
        outputs: [{ itemId: "train-casing", itemName: "Train Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "stripped-log",
    name: "Stripped Log",
    category: "Materials & Resources",
    icon: "/items/stripped_oak_log.png",
    description: "Stripped wood log processed using an axe in a Deployer or Mechanical Saw.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-deploying-stripped-log",
        name: "Deployer (from Oak Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "oak-log", itemName: "Oak Log", amount: 1 },
          { itemId: "iron-axe", itemName: "Iron Axe", amount: 1 }
        ],
        outputs: [{ itemId: "stripped-log", itemName: "Stripped Log", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-saw-stripped-log",
        name: "Mechanical Saw - Stripped Log",
        method: "Sawing",
        buildingRequired: "Mechanical Saw",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "any-log", itemName: "Any Log", amount: 1 }],
        outputs: [{ itemId: "stripped-log", itemName: "Stripped Log", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "stripped-wood",
    name: "Stripped Wood",
    category: "Materials & Resources",
    icon: "/items/stripped_oak_wood__ud__je1_be1.png",
    description: "Stripped wood with 6-sided bark stripped using an axe in a Deployer.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-deploying-stripped-wood",
        name: "Deployer (from Oak Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "oak-wood", itemName: "Oak Wood", amount: 1 },
          { itemId: "iron-axe", itemName: "Iron Axe", amount: 1 }
        ],
        outputs: [{ itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "sand-paper",
    name: "Sand Paper",
    category: "Tools & Equipment",
    icon: "/items/sand_paper.png",
    description: "Used for polishing items such as Rose Quartz, either manually or via Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-crafting-sand-paper",
        name: "Crafting - Sand Paper",
        method: "Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        ingredients: [
          { itemId: "paper", itemName: "Paper", amount: 1 },
          { itemId: "sand", itemName: "Sand", amount: 1 }
        ],
        outputs: [{ itemId: "sand-paper", itemName: "Sand Paper", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    category: "Materials & Resources",
    icon: "/items/rose_quartz.png",
    description: "Crystalline composite formed by crafting Nether Quartz with Redstone Dust, or mixing them.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-crafting-rose-quartz",
        name: "Crafting - Rose Quartz",
        method: "Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        ingredients: [
          { itemId: "nether-quartz", itemName: "Nether Quartz", amount: 1 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 8 }
        ],
        outputs: [{ itemId: "rose-quartz", itemName: "Rose Quartz", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-mixing-rose-quartz",
        name: "Mechanical Mixer - Rose Quartz",
        method: "Mixing",
        buildingRequired: "Mechanical Mixer",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "nether-quartz", itemName: "Nether Quartz", amount: 1 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 4 }
        ],
        outputs: [{ itemId: "rose-quartz", itemName: "Rose Quartz", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "polished-rose-quartz",
    name: "Polished Rose Quartz",
    category: "Materials & Resources",
    icon: "/items/polished_rose_quartz.png",
    description: "Rose Quartz polished with Sand Paper using a Deployer, essential for Electron Tubes.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-polished-rose-quartz",
        name: "Deployer (Polishing Rose Quartz)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "rose-quartz", itemName: "Rose Quartz", amount: 1 },
          { itemId: "sand-paper", itemName: "Sand Paper", amount: 1 }
        ],
        outputs: [{ itemId: "polished-rose-quartz", itemName: "Polished Rose Quartz", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "basalt",
    name: "Basalt",
    category: "Materials & Resources",
    icon: "/items/basalt.png",
    description: "Igneous rock generated when lava flows above soul soil adjacent to blue ice, broken continuously by a Mechanical Drill.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-mechanical-drill-basalt-gen",
        name: "Mechanical Drill (Basalt Generator)",
        method: "Drilling",
        buildingRequired: "Mechanical Drill",
        processingTimeSeconds: 0.44,
        speedRpm: 128,
        ingredients: [
          { itemId: "blue-ice", itemName: "Blue Ice", amount: 1 },
          { itemId: "lava", itemName: "Lava", amount: 1 },
          { itemId: "soul-soil", itemName: "Soul Soil", amount: 1 }
        ],
        outputs: [{ itemId: "basalt", itemName: "Basalt", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  }
,
  // ==========================================
  // --- Vanilla Tools, Weapons & Armor ---
  // ==========================================

  // --- Wooden Tools ---
  {
    id: "wooden-sword",
    name: "Wooden Sword",
    category: "Combat & Defense",
    icon: getIcon("Wooden Sword", "wooden_sword"),
    description: "Basic melee weapon crafted with 2 Planks and 1 Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-wooden-sword-crafter",
        name: "Mechanical Crafter - Wooden Sword",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "oak-planks", itemName: "Oak Planks", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "wooden-sword", itemName: "Wooden Sword", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "wooden-pickaxe",
    name: "Wooden Pickaxe",
    category: "Tools & Equipment",
    icon: getIcon("Wooden Pickaxe", "wooden_pickaxe"),
    description: "Basic mining tool crafted with 3 Planks and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-wooden-pickaxe-crafter",
        name: "Mechanical Crafter - Wooden Pickaxe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "oak-planks", itemName: "Oak Planks", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "wooden-pickaxe", itemName: "Wooden Pickaxe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "wooden-axe",
    name: "Wooden Axe",
    category: "Tools & Equipment",
    icon: getIcon("Wooden Axe", "wooden_axe"),
    description: "Basic wood-cutting tool crafted with 3 Planks and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-wooden-axe-crafter",
        name: "Mechanical Crafter - Wooden Axe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "oak-planks", itemName: "Oak Planks", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "wooden-axe", itemName: "Wooden Axe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "wooden-shovel",
    name: "Wooden Shovel",
    category: "Tools & Equipment",
    icon: getIcon("Wooden Shovel", "wooden_shovel"),
    description: "Basic digging tool crafted with 1 Plank and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-wooden-shovel-crafter",
        name: "Mechanical Crafter - Wooden Shovel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "oak-planks", itemName: "Oak Planks", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "wooden-shovel", itemName: "Wooden Shovel", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "wooden-hoe",
    name: "Wooden Hoe",
    category: "Tools & Equipment",
    icon: getIcon("Wooden Hoe", "wooden_hoe"),
    description: "Basic tilling tool crafted with 2 Planks and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-wooden-hoe-crafter",
        name: "Mechanical Crafter - Wooden Hoe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "oak-planks", itemName: "Oak Planks", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "wooden-hoe", itemName: "Wooden Hoe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Stone Tools ---
  {
    id: "stone-sword",
    name: "Stone Sword",
    category: "Combat & Defense",
    icon: getIcon("Stone Sword", "stone_sword"),
    description: "Durable melee weapon crafted with 2 Cobblestone and 1 Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stone-sword-crafter",
        name: "Mechanical Crafter - Stone Sword",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "stone-sword", itemName: "Stone Sword", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "stone-pickaxe",
    name: "Stone Pickaxe",
    category: "Tools & Equipment",
    icon: getIcon("Stone Pickaxe", "stone_pickaxe"),
    description: "Durable mining tool crafted with 3 Cobblestone and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stone-pickaxe-crafter",
        name: "Mechanical Crafter - Stone Pickaxe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "stone-pickaxe", itemName: "Stone Pickaxe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "stone-axe",
    name: "Stone Axe",
    category: "Tools & Equipment",
    icon: getIcon("Stone Axe", "stone_axe"),
    description: "Durable wood-cutting tool crafted with 3 Cobblestone and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stone-axe-crafter",
        name: "Mechanical Crafter - Stone Axe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "stone-axe", itemName: "Stone Axe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "stone-shovel",
    name: "Stone Shovel",
    category: "Tools & Equipment",
    icon: getIcon("Stone Shovel", "stone_shovel"),
    description: "Durable digging tool crafted with 1 Cobblestone and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stone-shovel-crafter",
        name: "Mechanical Crafter - Stone Shovel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "stone-shovel", itemName: "Stone Shovel", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "stone-hoe",
    name: "Stone Hoe",
    category: "Tools & Equipment",
    icon: getIcon("Stone Hoe", "stone_hoe"),
    description: "Durable tilling tool crafted with 2 Cobblestone and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stone-hoe-crafter",
        name: "Mechanical Crafter - Stone Hoe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "stone-hoe", itemName: "Stone Hoe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Iron Tools ---
  {
    id: "iron-sword",
    name: "Iron Sword",
    category: "Combat & Defense",
    icon: getIcon("Iron Sword", "iron_sword"),
    description: "Versatile combat weapon crafted with 2 Iron Ingots and 1 Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-sword-crafter",
        name: "Mechanical Crafter - Iron Sword",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "iron-sword", itemName: "Iron Sword", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-pickaxe",
    name: "Iron Pickaxe",
    category: "Tools & Equipment",
    icon: getIcon("Iron Pickaxe", "iron_pickaxe"),
    description: "Essential mining tool capable of breaking gold, redstone, and diamond ore.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-pickaxe-crafter",
        name: "Mechanical Crafter - Iron Pickaxe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "iron-pickaxe", itemName: "Iron Pickaxe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-axe",
    name: "Iron Axe",
    category: "Tools & Equipment",
    icon: getIcon("Iron Axe", "iron_axe"),
    description: "Efficient wood-chopping and stripping tool, essential for Deployers and log stripping.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-axe-crafter",
        name: "Mechanical Crafter - Iron Axe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "iron-axe", itemName: "Iron Axe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-shovel",
    name: "Iron Shovel",
    category: "Tools & Equipment",
    icon: getIcon("Iron Shovel", "iron_shovel"),
    description: "Fast dirt and gravel digging tool crafted with 1 Iron Ingot and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-shovel-crafter",
        name: "Mechanical Crafter - Iron Shovel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "iron-shovel", itemName: "Iron Shovel", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-hoe",
    name: "Iron Hoe",
    category: "Tools & Equipment",
    icon: getIcon("Iron Hoe", "iron_hoe"),
    description: "Agricultural tool crafted with 2 Iron Ingots and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-hoe-crafter",
        name: "Mechanical Crafter - Iron Hoe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "iron-hoe", itemName: "Iron Hoe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Golden Tools ---
  {
    id: "golden-sword",
    name: "Golden Sword",
    category: "Combat & Defense",
    icon: getIcon("Golden Sword", "golden_sword"),
    description: "Fast but low-durability weapon crafted with 2 Gold Ingots and 1 Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-sword-crafter",
        name: "Mechanical Crafter - Golden Sword",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "golden-sword", itemName: "Golden Sword", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-pickaxe",
    name: "Golden Pickaxe",
    category: "Tools & Equipment",
    icon: getIcon("Golden Pickaxe", "golden_pickaxe"),
    description: "Fastest mining speed tool crafted with 3 Gold Ingots and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-pickaxe-crafter",
        name: "Mechanical Crafter - Golden Pickaxe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "golden-pickaxe", itemName: "Golden Pickaxe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-axe",
    name: "Golden Axe",
    category: "Tools & Equipment",
    icon: getIcon("Golden Axe", "golden_axe"),
    description: "Extremely fast woodchopping tool crafted with 3 Gold Ingots and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-axe-crafter",
        name: "Mechanical Crafter - Golden Axe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "golden-axe", itemName: "Golden Axe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-shovel",
    name: "Golden Shovel",
    category: "Tools & Equipment",
    icon: getIcon("Golden Shovel", "golden_shovel"),
    description: "Rapid digging shovel crafted with 1 Gold Ingot and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-shovel-crafter",
        name: "Mechanical Crafter - Golden Shovel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "golden-shovel", itemName: "Golden Shovel", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-hoe",
    name: "Golden Hoe",
    category: "Tools & Equipment",
    icon: getIcon("Golden Hoe", "golden_hoe"),
    description: "Agricultural hoe crafted with 2 Gold Ingots and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-hoe-crafter",
        name: "Mechanical Crafter - Golden Hoe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "golden-hoe", itemName: "Golden Hoe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Diamond Tools ---
  {
    id: "diamond-sword",
    name: "Diamond Sword",
    category: "Combat & Defense",
    icon: getIcon("Diamond Sword", "diamond_sword"),
    description: "High-damage combat weapon crafted with 2 Diamonds and 1 Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-sword-crafter",
        name: "Mechanical Crafter - Diamond Sword",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond", itemName: "Diamond", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "diamond-sword", itemName: "Diamond Sword", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-pickaxe",
    name: "Diamond Pickaxe",
    category: "Tools & Equipment",
    icon: getIcon("Diamond Pickaxe", "diamond_pickaxe"),
    description: "High-durability pickaxe capable of mining Obsidian and Ancient Debris.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-pickaxe-crafter",
        name: "Mechanical Crafter - Diamond Pickaxe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond", itemName: "Diamond", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "diamond-pickaxe", itemName: "Diamond Pickaxe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-axe",
    name: "Diamond Axe",
    category: "Tools & Equipment",
    icon: getIcon("Diamond Axe", "diamond_axe"),
    description: "Heavy damage and swift wood chopping axe crafted with 3 Diamonds and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-axe-crafter",
        name: "Mechanical Crafter - Diamond Axe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond", itemName: "Diamond", amount: 3 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "diamond-axe", itemName: "Diamond Axe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-shovel",
    name: "Diamond Shovel",
    category: "Tools & Equipment",
    icon: getIcon("Diamond Shovel", "diamond_shovel"),
    description: "Durable digging tool crafted with 1 Diamond and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-shovel-crafter",
        name: "Mechanical Crafter - Diamond Shovel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond", itemName: "Diamond", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "diamond-shovel", itemName: "Diamond Shovel", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-hoe",
    name: "Diamond Hoe",
    category: "Tools & Equipment",
    icon: getIcon("Diamond Hoe", "diamond_hoe"),
    description: "High-durability farming hoe crafted with 2 Diamonds and 2 Sticks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-hoe-crafter",
        name: "Mechanical Crafter - Diamond Hoe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond", itemName: "Diamond", amount: 2 },
          { itemId: "stick", itemName: "Stick", amount: 2 }
        ],
        outputs: [{ itemId: "diamond-hoe", itemName: "Diamond Hoe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Netherite Tools ---
  {
    id: "netherite-sword",
    name: "Netherite Sword",
    category: "Combat & Defense",
    icon: getIcon("Netherite Sword", "netherite_sword"),
    description: "Ultimate melee weapon upgraded from a Diamond Sword with a Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-sword-upgrade",
        name: "Smithing Upgrade - Netherite Sword",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-sword", itemName: "Diamond Sword", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-sword", itemName: "Netherite Sword", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-pickaxe",
    name: "Netherite Pickaxe",
    category: "Tools & Equipment",
    icon: getIcon("Netherite Pickaxe", "netherite_pickaxe"),
    description: "Supreme mining tool upgraded from a Diamond Pickaxe with a Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-pickaxe-upgrade",
        name: "Smithing Upgrade - Netherite Pickaxe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-pickaxe", itemName: "Diamond Pickaxe", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-pickaxe", itemName: "Netherite Pickaxe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-axe",
    name: "Netherite Axe",
    category: "Tools & Equipment",
    icon: getIcon("Netherite Axe", "netherite_axe"),
    description: "Supreme axe upgraded from a Diamond Axe with a Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-axe-upgrade",
        name: "Smithing Upgrade - Netherite Axe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-axe", itemName: "Diamond Axe", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-axe", itemName: "Netherite Axe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-shovel",
    name: "Netherite Shovel",
    category: "Tools & Equipment",
    icon: getIcon("Netherite Shovel", "netherite_shovel"),
    description: "Supreme shovel upgraded from a Diamond Shovel with a Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-shovel-upgrade",
        name: "Smithing Upgrade - Netherite Shovel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-shovel", itemName: "Diamond Shovel", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-shovel", itemName: "Netherite Shovel", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-hoe",
    name: "Netherite Hoe",
    category: "Tools & Equipment",
    icon: getIcon("Netherite Hoe", "netherite_hoe"),
    description: "Supreme hoe upgraded from a Diamond Hoe with a Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-hoe-upgrade",
        name: "Smithing Upgrade - Netherite Hoe",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-hoe", itemName: "Diamond Hoe", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-hoe", itemName: "Netherite Hoe", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Leather Armor ---
  {
    id: "leather-helmet",
    name: "Leather Helmet",
    category: "Armor & Apparel",
    icon: getIcon("Leather Helmet", "leather_helmet"),
    description: "Basic protective headwear crafted with 5 Leather.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-leather-helmet-crafter",
        name: "Mechanical Crafter - Leather Helmet",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "leather", itemName: "Leather", amount: 5 }],
        outputs: [{ itemId: "leather-helmet", itemName: "Leather Helmet", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "leather-chestplate",
    name: "Leather Tunic",
    category: "Armor & Apparel",
    icon: getIcon("Leather Tunic", "leather_chestplate"),
    description: "Basic protective body armor crafted with 8 Leather.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-leather-chestplate-crafter",
        name: "Mechanical Crafter - Leather Tunic",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "leather", itemName: "Leather", amount: 8 }],
        outputs: [{ itemId: "leather-chestplate", itemName: "Leather Tunic", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "leather-leggings",
    name: "Leather Pants",
    category: "Armor & Apparel",
    icon: getIcon("Leather Pants", "leather_leggings"),
    description: "Basic protective leg armor crafted with 7 Leather.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-leather-leggings-crafter",
        name: "Mechanical Crafter - Leather Pants",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "leather", itemName: "Leather", amount: 7 }],
        outputs: [{ itemId: "leather-leggings", itemName: "Leather Pants", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "leather-boots",
    name: "Leather Boots",
    category: "Armor & Apparel",
    icon: getIcon("Leather Boots", "leather_boots"),
    description: "Protective footwear crafted with 4 Leather, prevents sinking in Powder Snow.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-leather-boots-crafter",
        name: "Mechanical Crafter - Leather Boots",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "leather", itemName: "Leather", amount: 4 }],
        outputs: [{ itemId: "leather-boots", itemName: "Leather Boots", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Iron Armor ---
  {
    id: "iron-helmet",
    name: "Iron Helmet",
    category: "Armor & Apparel",
    icon: getIcon("Iron Helmet", "iron_helmet"),
    description: "Standard protective helmet crafted with 5 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-helmet-crafter",
        name: "Mechanical Crafter - Iron Helmet",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 5 }],
        outputs: [{ itemId: "iron-helmet", itemName: "Iron Helmet", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-chestplate",
    name: "Iron Chestplate",
    category: "Armor & Apparel",
    icon: getIcon("Iron Chestplate", "iron_chestplate"),
    description: "Heavy iron body armor crafted with 8 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-chestplate-crafter",
        name: "Mechanical Crafter - Iron Chestplate",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 8 }],
        outputs: [{ itemId: "iron-chestplate", itemName: "Iron Chestplate", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-leggings",
    name: "Iron Leggings",
    category: "Armor & Apparel",
    icon: getIcon("Iron Leggings", "iron_leggings"),
    description: "Protective iron leg armor crafted with 7 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-leggings-crafter",
        name: "Mechanical Crafter - Iron Leggings",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 7 }],
        outputs: [{ itemId: "iron-leggings", itemName: "Iron Leggings", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "iron-boots",
    name: "Iron Boots",
    category: "Armor & Apparel",
    icon: getIcon("Iron Boots", "iron_boots"),
    description: "Durable protective footwear crafted with 4 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-boots-crafter",
        name: "Mechanical Crafter - Iron Boots",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 4 }],
        outputs: [{ itemId: "iron-boots", itemName: "Iron Boots", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Golden Armor ---
  {
    id: "golden-helmet",
    name: "Golden Helmet",
    category: "Armor & Apparel",
    icon: getIcon("Golden Helmet", "golden_helmet"),
    description: "Gilded helmet crafted with 5 Gold Ingots, pacifies Piglins in the Nether.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-helmet-crafter",
        name: "Mechanical Crafter - Golden Helmet",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "gold-ingot", itemName: "Gold Ingot", amount: 5 }],
        outputs: [{ itemId: "golden-helmet", itemName: "Golden Helmet", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-chestplate",
    name: "Golden Chestplate",
    category: "Armor & Apparel",
    icon: getIcon("Golden Chestplate", "golden_chestplate"),
    description: "Gilded body armor crafted with 8 Gold Ingots, pacifies Piglins in the Nether.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-chestplate-crafter",
        name: "Mechanical Crafter - Golden Chestplate",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "gold-ingot", itemName: "Gold Ingot", amount: 8 }],
        outputs: [{ itemId: "golden-chestplate", itemName: "Golden Chestplate", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-leggings",
    name: "Golden Leggings",
    category: "Armor & Apparel",
    icon: getIcon("Golden Leggings", "golden_leggings"),
    description: "Gilded leg armor crafted with 7 Gold Ingots, pacifies Piglins in the Nether.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-leggings-crafter",
        name: "Mechanical Crafter - Golden Leggings",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "gold-ingot", itemName: "Gold Ingot", amount: 7 }],
        outputs: [{ itemId: "golden-leggings", itemName: "Golden Leggings", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "golden-boots",
    name: "Golden Boots",
    category: "Armor & Apparel",
    icon: getIcon("Golden Boots", "golden_boots"),
    description: "Gilded footwear crafted with 4 Gold Ingots, pacifies Piglins in the Nether.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-boots-crafter",
        name: "Mechanical Crafter - Golden Boots",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "gold-ingot", itemName: "Gold Ingot", amount: 4 }],
        outputs: [{ itemId: "golden-boots", itemName: "Golden Boots", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Diamond Armor ---
  {
    id: "diamond-helmet",
    name: "Diamond Helmet",
    category: "Armor & Apparel",
    icon: getIcon("Diamond Helmet", "diamond_helmet"),
    description: "High-tier protective helmet crafted with 5 Diamonds.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-helmet-crafter",
        name: "Mechanical Crafter - Diamond Helmet",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "diamond", itemName: "Diamond", amount: 5 }],
        outputs: [{ itemId: "diamond-helmet", itemName: "Diamond Helmet", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-chestplate",
    name: "Diamond Chestplate",
    category: "Armor & Apparel",
    icon: getIcon("Diamond Chestplate", "diamond_chestplate"),
    description: "High-tier heavy chestplate crafted with 8 Diamonds.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-chestplate-crafter",
        name: "Mechanical Crafter - Diamond Chestplate",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "diamond", itemName: "Diamond", amount: 8 }],
        outputs: [{ itemId: "diamond-chestplate", itemName: "Diamond Chestplate", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-leggings",
    name: "Diamond Leggings",
    category: "Armor & Apparel",
    icon: getIcon("Diamond Leggings", "diamond_leggings"),
    description: "High-tier protective leggings crafted with 7 Diamonds.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-leggings-crafter",
        name: "Mechanical Crafter - Diamond Leggings",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "diamond", itemName: "Diamond", amount: 7 }],
        outputs: [{ itemId: "diamond-leggings", itemName: "Diamond Leggings", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "diamond-boots",
    name: "Diamond Boots",
    category: "Armor & Apparel",
    icon: getIcon("Diamond Boots", "diamond_boots"),
    description: "High-tier protective boots crafted with 4 Diamonds.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-diamond-boots-crafter",
        name: "Mechanical Crafter - Diamond Boots",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "diamond", itemName: "Diamond", amount: 4 }],
        outputs: [{ itemId: "diamond-boots", itemName: "Diamond Boots", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Netherite Armor ---
  {
    id: "netherite-helmet",
    name: "Netherite Helmet",
    category: "Armor & Apparel",
    icon: getIcon("Netherite Helmet", "netherite_helmet"),
    description: "Supreme armor helmet with knockback resistance, upgraded with Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-helmet-upgrade",
        name: "Smithing Upgrade - Netherite Helmet",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-helmet", itemName: "Diamond Helmet", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-helmet", itemName: "Netherite Helmet", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-chestplate",
    name: "Netherite Chestplate",
    category: "Armor & Apparel",
    icon: getIcon("Netherite Chestplate", "netherite_chestplate"),
    description: "Supreme armor chestplate with knockback resistance, upgraded with Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-chestplate-upgrade",
        name: "Smithing Upgrade - Netherite Chestplate",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-chestplate", itemName: "Diamond Chestplate", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-chestplate", itemName: "Netherite Chestplate", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-leggings",
    name: "Netherite Leggings",
    category: "Armor & Apparel",
    icon: getIcon("Netherite Leggings", "netherite_leggings"),
    description: "Supreme armor leggings with knockback resistance, upgraded with Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-leggings-upgrade",
        name: "Smithing Upgrade - Netherite Leggings",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-leggings", itemName: "Diamond Leggings", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-leggings", itemName: "Netherite Leggings", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "netherite-boots",
    name: "Netherite Boots",
    category: "Armor & Apparel",
    icon: getIcon("Netherite Boots", "netherite_boots"),
    description: "Supreme armor boots with knockback resistance, upgraded with Netherite Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-netherite-boots-upgrade",
        name: "Smithing Upgrade - Netherite Boots",
        method: "Mechanical Crafter",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 3,
        speedRpm: 64,
        ingredients: [
          { itemId: "diamond-boots", itemName: "Diamond Boots", amount: 1 },
          { itemId: "netherite-ingot", itemName: "Netherite Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "netherite-boots", itemName: "Netherite Boots", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },

  // --- Specialty Armor & Combat Gear ---
  {
    id: "turtle-helmet",
    name: "Turtle Shell",
    category: "Armor & Apparel",
    icon: getIcon("Turtle Shell", "turtle_helmet"),
    description: "Headwear crafted with 5 Scutes that grants the Water Breathing status effect.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-turtle-helmet-crafter",
        name: "Mechanical Crafter - Turtle Shell",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [{ itemId: "scute", itemName: "Scute", amount: 5 }],
        outputs: [{ itemId: "turtle-helmet", itemName: "Turtle Shell", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "shield",
    name: "Shield",
    category: "Combat & Defense",
    icon: getIcon("Shield", "shield"),
    description: "Defensive blocking shield crafted with 6 Planks and 1 Iron Ingot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-shield-crafter",
        name: "Mechanical Crafter - Shield",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "oak-planks", itemName: "Oak Planks", amount: 6 },
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "shield", itemName: "Shield", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "crossbow",
    name: "Crossbow",
    category: "Combat & Defense",
    icon: getIcon("Crossbow", "crossbow_standby"),
    description: "Powerful ranged weapon crafted with 3 Sticks, 2 Strings, 1 Iron Ingot, and 1 Tripwire Hook.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-crossbow-crafter",
        name: "Mechanical Crafter - Crossbow",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "stick", itemName: "Stick", amount: 3 },
          { itemId: "string", itemName: "String", amount: 2 },
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 },
          { itemId: "tripwire-hook", itemName: "Tripwire Hook", amount: 1 }
        ],
        outputs: [{ itemId: "crossbow", itemName: "Crossbow", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "fishing-rod",
    name: "Fishing Rod",
    category: "Tools & Equipment",
    icon: getIcon("Fishing Rod", "fishing_rod"),
    description: "Tool for catching fish and junk from bodies of water, crafted with 3 Sticks and 2 Strings.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fishing-rod-crafter",
        name: "Mechanical Crafter - Fishing Rod",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "stick", itemName: "Stick", amount: 3 },
          { itemId: "string", itemName: "String", amount: 2 }
        ],
        outputs: [{ itemId: "fishing-rod", itemName: "Fishing Rod", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "spyglass",
    name: "Spyglass",
    category: "Tools & Equipment",
    icon: getIcon("Spyglass", "spyglass"),
    description: "Handheld telescopic lens crafted with 2 Copper Ingots and 1 Amethyst Shard.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-spyglass-crafter",
        name: "Mechanical Crafter - Spyglass",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "copper-ingot", itemName: "Copper Ingot", amount: 2 },
          { itemId: "amethyst-shard", itemName: "Amethyst Shard", amount: 1 }
        ],
        outputs: [{ itemId: "spyglass", itemName: "Spyglass", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  },
  {
    id: "brush",
    name: "Brush",
    category: "Tools & Equipment",
    icon: getIcon("Brush", "brush"),
    description: "Archaeology tool used for excavating suspicious sand and gravel.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-brush-crafter",
        name: "Mechanical Crafter - Brush",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 2,
        speedRpm: 64,
        ingredients: [
          { itemId: "feather", itemName: "Feather", amount: 1 },
          { itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "brush", itemName: "Brush", amount: 1 }],
        sourceMod: "Vanilla"
      }
    ]
  }

];
