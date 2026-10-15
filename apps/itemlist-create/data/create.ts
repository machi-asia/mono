import type { GameDataset } from "@mono/game-calculator";
import { VANILLA_CRAFTING_ITEMS } from "./vanilla-crafting";

export const CREATE_DATA: GameDataset = {
  "id": "create",
  "name": "Create",
  "tagline": "Build kinetic contraptions, rotational power networks, and automated multi-step assembly lines.",
  "homeUrl": "https://itemlist.online",
  "items": [
{
    "id": "adjustable-chain-gearshift",
    "name": "Adjustable Chain Gearshift",
    "category": "Kinetics & Contraptions",
    "icon": "/items/adjustable_chain_gearshift.png",
    "description": "The Adjustable Chain Gearshift functions similarly to Encased Chain Drive, but can change the speed of the output when powered with redstone.",
    "recipes": [
      {
        "id": "recipe-adjustable-chain-gearshift-crafter-0",
        "name": "Mechanical Crafter - Adjustable Chain Gearshift",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "encased-chain-drive",
            "itemName": "Encased Chain Drive",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "adjustable-chain-gearshift",
            "itemName": "Adjustable Chain Gearshift",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "analog-lever",
    "name": "Analog Lever",
    "category": "Redstone & Displays",
    "icon": "/items/analog_lever.png",
    "description": "The Analog Lever is used to emit a variable signal via player input.",
    "recipes": [
      {
        "id": "recipe-analog-lever-crafter-0",
        "name": "Mechanical Crafter - Analog Lever",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "stick",
            "itemName": "Stick",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "analog-lever",
            "itemName": "Analog Lever",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-analog-lever-crafting-wiki-1",
        "name": "Mechanical Crafter - Analog Lever",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "stick",
            "itemName": "Stick",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "analog-lever",
            "itemName": "Analog Lever",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "andesite",
    "name": "Andesite",
    "category": "Materials & Resources",
    "icon": "/items/andesite.png",
    "description": "Cut Andesite Slab.png|Cut Slab",
    "recipes": [
      {
        "id": "recipe-andesite-crafter-0",
        "name": "Mechanical Crafter - Andesite",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "diorite",
            "itemName": "Diorite",
            "amount": 1
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Vanilla"
      },
      {
        "id": "recipe-press-andesite-11",
        "name": "Mechanical Press (Compacting) (from Flint)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 2
          },
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          },
          {
            "itemId": "lava",
            "itemName": "Lava",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "andesite-funnel",
    "name": "Andesite Funnel",
    "category": "Logistics & Fluids",
    "icon": "/items/andesite_funnel.png",
    "description": "Andesite Belt Funnel.png|Belt",
    "recipes": [
      {
        "id": "recipe-andesite-funnel-crafter-0",
        "name": "Mechanical Crafter - Andesite Funnel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-funnel",
            "itemName": "Andesite Funnel",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "andesite-tunnel",
    "name": "Andesite Tunnel",
    "category": "Logistics & Fluids",
    "icon": "/items/andesite_tunnel.png",
    "description": "A decorative Tunnel for Mechanical Belts.",
    "recipes": [
      {
        "id": "recipe-andesite-tunnel-crafter-0",
        "name": "Mechanical Crafter - Andesite Tunnel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-tunnel",
            "itemName": "Andesite Tunnel",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "asurine",
    "name": "Asurine",
    "category": "Materials & Resources",
    "icon": "/items/asurine.png",
    "description": "Polished Cut Asurine.png|Polished Cut",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "basin",
    "name": "Basin",
    "category": "Automation Machines",
    "icon": "/items/basin.png",
    "description": "The Basin is a block that holds items and fluids used in Packing, Compacting, and Mixing recipes. A basin can also function as an interaction point in fluid systems as fluids can be placed in or removed from a Basin directly by a player. In a survival game, a basin's most significant function is creating Brass, which is essential for the creation of most advanced components.",
    "recipes": [
      {
        "id": "recipe-basin-crafter-0",
        "name": "Mechanical Crafter - Basin",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 5
          }
        ],
        "outputs": [
          {
            "itemId": "basin",
            "itemName": "Basin",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-basin-crafting-wiki-1",
        "name": "Mechanical Crafter - Basin",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "basin",
            "itemName": "Basin",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "blaze-burner",
    "name": "Blaze Burner",
    "category": "Automation Machines",
    "icon": "/items/empty_blaze_burner.png",
    "description": "File:Empty Blaze Burner.png|Empty",
    "recipes": [
      {
        "id": "recipe-blaze-burner-crafting-wiki-1",
        "name": "Mechanical Crafter - Blaze Burner",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "empty-blaze-burner",
            "itemName": "Empty Blaze Burner",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blaze-burner",
            "itemName": "Blaze Burner",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "block-of-andesite-alloy",
    "name": "Block of Andesite Alloy",
    "category": "Materials & Resources",
    "icon": "/items/block_of_andesite_alloy.png",
    "description": "Block of Andesite Alloy is a decorative storage block for Andesite Alloy.",
    "recipes": [
      {
        "id": "recipe-block-of-andesite-alloy-crafter-0",
        "name": "Mechanical Crafter - Block of Andesite Alloy",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 9
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-andesite-alloy",
            "itemName": "Block of Andesite Alloy",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-block-of-andesite-alloy-crafting-wiki-2",
        "name": "Mechanical Crafter - Block of Andesite Alloy",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-andesite-alloy",
            "itemName": "Block of Andesite Alloy",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-block-of-andesite-alloy-compacting-wiki-3",
        "name": "Mechanical Press - Block of Andesite Alloy",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-andesite-alloy",
            "itemName": "Block of Andesite Alloy",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "block-of-brass",
    "name": "Block of Brass",
    "category": "Materials & Resources",
    "icon": "/items/block_of_brass.png",
    "description": "The Block of Brass is a metal block. It can be crafted with 9 Brass Ingots. It can be used to form the base of a beacon pyramid.",
    "recipes": [
      {
        "id": "recipe-block-of-brass-crafter-0",
        "name": "Mechanical Crafter - Block of Brass",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 9
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-brass",
            "itemName": "Block of Brass",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "block-of-copper",
    "name": "Block of Copper",
    "category": "Materials & Resources",
    "icon": "/items/block_of_copper_1.png",
    "description": "This article is about the block. For the ore, see Copper Ore. For other forms of copper, see Copper.",
    "recipes": [
      {
        "id": "recipe-block-of-copper-crafter-0",
        "name": "Mechanical Crafter - Block of Copper",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 9
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-copper",
            "itemName": "Block of Copper",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "block-of-experience",
    "name": "Block of Experience",
    "category": "Materials & Resources",
    "icon": "/items/block_of_experience.png",
    "description": "Block of Experience is a decorative storage block for Nuggets of Experience. It also can be used as a beacon base.",
    "recipes": [
      {
        "id": "recipe-block-of-experience-crafter-0",
        "name": "Mechanical Crafter - Block of Experience",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-experience",
            "itemName": "Block of Experience",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-block-of-experience-crafting-wiki-2",
        "name": "Mechanical Crafter - Block of Experience",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-experience",
            "itemName": "Block of Experience",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "block-of-industrial-iron",
    "name": "Block of Industrial Iron",
    "category": "Materials & Resources",
    "icon": "/items/block_of_industrial_iron.png",
    "description": "Block_of_Weathered_Iron.png|Weathered Iron</gallery>}}",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "block-of-zinc",
    "name": "Block of Zinc",
    "category": "Materials & Resources",
    "icon": "/items/block_of_zinc.png",
    "description": "This article is about the block. For the ore, see Zinc Ore. For other forms of zinc, see Zinc.",
    "recipes": [
      {
        "id": "recipe-block-of-zinc-crafter-0",
        "name": "Mechanical Crafter - Block of Zinc",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "zinc-ingot",
            "itemName": "Zinc Ingot",
            "amount": 9
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-zinc",
            "itemName": "Block of Zinc",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-block-of-zinc-crafting-wiki-1",
        "name": "Mechanical Crafter - Block of Zinc",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "zinc-ingot",
            "itemName": "Zinc Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "block-of-zinc",
            "itemName": "Block of Zinc",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "bracket",
    "name": "Bracket",
    "category": "Building & Decoration",
    "icon": "/items/metal_bracket.png",
    "description": "Metal Bracket.png|Metal",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "brass-funnel",
    "name": "Brass Funnel",
    "category": "Logistics & Fluids",
    "icon": "/items/brass_funnel.png",
    "description": "Brass Belt Funnel.png|Belt",
    "recipes": [
      {
        "id": "recipe-brass-funnel-crafter-0",
        "name": "Mechanical Crafter - Brass Funnel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 1
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brass-funnel",
            "itemName": "Brass Funnel",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "brass-tunnel",
    "name": "Brass Tunnel",
    "category": "Logistics & Fluids",
    "icon": "/items/brass_tunnel.png",
    "description": "A Brass Tunnel is a machine that can only be placed on Mechanical Belts. It can be decorative or it can be used to split, sort, or combine streams of items fed by belts.",
    "recipes": [
      {
        "id": "recipe-brass-tunnel-crafter-0",
        "name": "Mechanical Crafter - Brass Tunnel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 2
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "brass-tunnel",
            "itemName": "Brass Tunnel",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-brass-tunnel-crafting-wiki-1",
        "name": "Mechanical Crafter - Brass Tunnel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 1
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brass-tunnel",
            "itemName": "Brass Tunnel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "calcite",
    "name": "Calcite",
    "category": "Materials & Resources",
    "icon": "/items/calcite.png",
    "description": "Polished Cut Calcite.png|Polished Cut",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cardboard",
    "name": "Cardboard",
    "category": "Components & Tools",
    "icon": "/items/block_of_cardboard_1.png",
    "description": "Block of Cardboard.png|Unbound",
    "recipes": [
      {
        "id": "recipe-cardboard-crafter-0",
        "name": "Mechanical Crafter - Cardboard",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-cardboard-bound-block-of-cardboard",
            "itemName": "Block of Cardboard;Bound Block of Cardboard",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 4
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-cardboard-pressing-wiki-6",
        "name": "Mechanical Press - Cardboard",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "pulp",
            "itemName": "Pulp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-cardboard-crafting-wiki-7",
        "name": "Mechanical Crafter - Cardboard",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-cardboard",
            "itemName": "Block of Cardboard",
            "amount": 1
          },
          {
            "itemId": "bound-block-of-cardboard",
            "itemName": "Bound Block of Cardboard",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cardboard-package",
    "name": "Cardboard Package",
    "category": "Logistics & Fluids",
    "icon": "/items/cardboard_package_10x8.png",
    "description": "Cardboard package 10x8.png|Small",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cart-assembler",
    "name": "Cart Assembler",
    "category": "Kinetics & Contraptions",
    "icon": "/items/cart_assembler.png",
    "description": "The Cart Assembler can attach a Contraption to  that pass through it when supplied with a  signal.",
    "recipes": [
      {
        "id": "recipe-cart-assembler-crafter-0",
        "name": "Mechanical Crafter - Cart Assembler",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          },
          {
            "itemId": "log",
            "itemName": "Log",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "cart-assembler",
            "itemName": "Cart Assembler",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "casing",
    "name": "Casing",
    "category": "Kinetics & Contraptions",
    "icon": "/items/andesite_casing_1.png",
    "description": "Casings are structural blocks used to encase shafts, gears, and automation contraptions. Created by applying material plates or ingots onto stripped logs or wood.",
    "recipes": [
      {
        "id": "recipe-casing-andesite-deployer",
        "name": "Deployer (from Stripped Log)",
        "method": "Manual Application",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "stripped-log",
            "itemName": "Stripped Log",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "casing",
            "itemName": "Casing",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-casing-andesite-wood",
        "name": "Deployer (from Stripped Wood)",
        "method": "Manual Application",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "stripped-wood",
            "itemName": "Stripped Wood",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "casing",
            "itemName": "Casing",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-casing-brass",
        "name": "Deployer (from Brass Ingot)",
        "method": "Manual Application",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "stripped-log",
            "itemName": "Stripped Log",
            "amount": 1
          },
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "casing",
            "itemName": "Casing",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-casing-copper",
        "name": "Deployer (from Copper Ingot)",
        "method": "Manual Application",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "stripped-log",
            "itemName": "Stripped Log",
            "amount": 1
          },
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "casing",
            "itemName": "Casing",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-casing-train",
        "name": "Deployer (from Sturdy Sheet)",
        "method": "Manual Application",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "sturdy-sheet",
            "itemName": "Sturdy Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "casing",
            "itemName": "Casing",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "chain-conveyor",
    "name": "Chain Conveyor",
    "category": "Logistics & Fluids",
    "icon": "/items/chain_conveyor.png",
    "description": "The Chain Conveyor is used to transport Cardboard Packages. It has a secondary use of transferring rotational force across open spaces that aren't perfectly horizontal, vertical or on a 45° slope (where a Mechanical Belt would normally be used)",
    "recipes": [
      {
        "id": "recipe-chain-conveyor-crafter-0",
        "name": "Mechanical Crafter - Chain Conveyor",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 4
          },
          {
            "itemId": "large-cogwheel",
            "itemName": "Large Cogwheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "chain-conveyor",
            "itemName": "Chain Conveyor",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-chain-conveyor-crafting-wiki-1",
        "name": "Mechanical Crafter - Chain Conveyor",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "large-cogwheel",
            "itemName": "Large Cogwheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "chain-conveyor",
            "itemName": "Chain Conveyor",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "chute",
    "name": "Chute",
    "category": "Logistics & Fluids",
    "icon": "/items/chute.png",
    "description": "Smart Chute.png|Smart Chute",
    "recipes": [
      {
        "id": "recipe-chute-crafter-0",
        "name": "Mechanical Crafter - Chute",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 2
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "chute",
            "itemName": "Chute",
            "amount": 4
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-chute-crafting-wiki-2",
        "name": "Mechanical Crafter - Chute",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "chute",
            "itemName": "Chute",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "clipboard",
    "name": "Clipboard",
    "category": "Components & Tools",
    "icon": "/items/clipboard_block.png",
    "description": "A Clipboard can be used to copy and paste a block's settings, keep track of a Schematicannon's checklist, or another written checklist.",
    "recipes": [
      {
        "id": "recipe-clipboard-crafter-0",
        "name": "Mechanical Crafter - Clipboard",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "paper",
            "itemName": "Paper",
            "amount": 1
          },
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clipboard",
            "itemName": "Clipboard",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-clipboard-crafting-wiki-1",
        "name": "Mechanical Crafter - Clipboard",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "paper",
            "itemName": "Paper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clipboard",
            "itemName": "Clipboard",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "clockwork-bearing",
    "name": "Clockwork Bearing",
    "category": "Kinetics & Contraptions",
    "icon": "/items/clockwork_bearing.png",
    "description": "The Clockwork Bearing is an advanced version of the Mechanical Bearing for rotating up to two clock hands according to the current in-game time.",
    "recipes": [
      {
        "id": "recipe-clockwork-bearing-crafter-0",
        "name": "Mechanical Crafter - Clockwork Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clockwork-bearing",
            "itemName": "Clockwork Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-clockwork-bearing-crafting-wiki-1",
        "name": "Mechanical Crafter - Clockwork Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clockwork-bearing",
            "itemName": "Clockwork Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-casing-crafter-30",
        "name": "Mechanical Crafter - Clockwork Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clockwork-bearing",
            "itemName": "Clockwork Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "clutch",
    "name": "Clutch",
    "category": "Kinetics & Contraptions",
    "icon": "/items/clutch.png",
    "description": "The Clutch stops outgoing rotation when a redstone signal is applied.",
    "recipes": [
      {
        "id": "recipe-clutch-crafter-0",
        "name": "Mechanical Crafter - Clutch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clutch",
            "itemName": "Clutch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-clutch-crafting-wiki-1",
        "name": "Mechanical Crafter - Clutch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clutch",
            "itemName": "Clutch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cogwheel",
    "name": "Cogwheel",
    "category": "Kinetics & Contraptions",
    "icon": "/items/cogwheel__block_.png",
    "description": "Cogwheel (block).png|Small",
    "recipes": [
      {
        "id": "recipe-cogwheel-crafter-0",
        "name": "Mechanical Crafter - Cogwheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "contraption-controls",
    "name": "Contraption Controls",
    "category": "Kinetics & Contraptions",
    "icon": "/items/contraption_controls.png",
    "description": "Contraption Controls are used to control Contraption Actors.",
    "recipes": [
      {
        "id": "recipe-contraption-controls-crafter-0",
        "name": "Mechanical Crafter - Contraption Controls",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wood-button",
            "itemName": "Wood Button",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "contraption-controls",
            "itemName": "Contraption Controls",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-contraption-controls-crafting-wiki-1",
        "name": "Mechanical Crafter - Contraption Controls",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-button",
            "itemName": "Oak Button",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "contraption-controls",
            "itemName": "Contraption Controls",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-casing-crafter-22",
        "name": "Mechanical Crafter - Contraption Controls",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "stone-button-any-wood-button",
            "itemName": "Stone Button;Any Wood Button",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "contraption-controls",
            "itemName": "Contraption Controls",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "controller-rail",
    "name": "Controller Rail",
    "category": "Trains & Rail",
    "icon": "/items/controller_rail.png",
    "description": "Controller Rails are used to control the speed of s or Minecart Contraptions.",
    "recipes": [
      {
        "id": "recipe-controller-rail-crafter-0",
        "name": "Mechanical Crafter - Controller Rail",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 6
          },
          {
            "itemId": "stick",
            "itemName": "Stick",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "controller-rail",
            "itemName": "Controller Rail",
            "amount": 6
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-controller-rail-crafting-wiki-1",
        "name": "Mechanical Crafter - Controller Rail",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "controller-rail",
            "itemName": "Controller Rail",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "crafting-blueprint",
    "name": "Crafting Blueprint",
    "category": "Components & Tools",
    "icon": "/items/crafting_blueprint_entity.png",
    "description": "Crafting Blueprint is a block much like a  that can be used to save crafting recipes and auto craft them easily.",
    "recipes": [
      {
        "id": "recipe-crafter-blueprint-crafting-0",
        "name": "Mechanical Crafter - Crafting Blueprint",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "painting",
            "itemName": "Painting",
            "amount": 1
          },
          {
            "itemId": "crafting-table",
            "itemName": "Crafting Table",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crafting-blueprint",
            "itemName": "Crafting Blueprint",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "creative-crate",
    "name": "Creative Crate",
    "category": "Logistics & Fluids",
    "icon": "/items/creative_crate.png",
    "description": "The Creative Crate is a creative-only block that can output the item in the filter slot (located on the top), infinitely. It will also act as a trash can when items are input to it, accepting and deleting the item. Although unobtainable in survival, it can be mined. Items can be extracted via a funnel, hopper or other item extracting components.",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "creative-fluid-tank",
    "name": "Creative Fluid Tank",
    "category": "Logistics & Fluids",
    "icon": "/items/creative_fluid_tank.png",
    "description": "A Creative-exclusive block that acts as an infinite source of the fluid it contains.",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "creative-motor",
    "name": "Creative Motor",
    "category": "Kinetics & Contraptions",
    "icon": "/items/creative_motor.png",
    "description": "The Creative Motor is a block used for power generation.",
    "recipes": [
      {
        "id": "recipe-creative-motor-crafter-0",
        "name": "Mechanical Crafter - Creative Motor",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 2
          },
          {
            "itemId": "chorus-chrome",
            "itemName": "Chorus Chrome",
            "amount": 1
          },
          {
            "itemId": "block-of-iron",
            "itemName": "Block of Iron",
            "amount": 2
          },
          {
            "itemId": "obsidian",
            "itemName": "Obsidian",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "creative-motor",
            "itemName": "Creative Motor",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "crimsite",
    "name": "Crimsite",
    "category": "Materials & Resources",
    "icon": "/items/crimsite.png",
    "description": "Polished Cut Crimsite.png|Polished Cut",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "crushing-wheel",
    "name": "Crushing Wheel",
    "category": "Automation Machines",
    "icon": "/items/crushing_wheel.png",
    "description": "Crushing Wheels are the more advanced version of the Millstone. It applies Crushing recipes to any items inserted from the direction they are spinning away from.",
    "recipes": [
      {
        "id": "recipe-crushing-wheel-crafter-0",
        "name": "Mechanical Crafter - Crushing Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 16
          },
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 4
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushing-wheel",
            "itemName": "Crushing Wheel",
            "amount": 2
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cuckoo-clock",
    "name": "Cuckoo Clock",
    "category": "Components & Tools",
    "icon": "/items/cuckoo_clock.png",
    "description": "The Cuckoo Clock is a block that displays in-game time.",
    "recipes": [
      {
        "id": "recipe-cuckoo-clock-crafter-0",
        "name": "Mechanical Crafter - Cuckoo Clock",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "clock",
            "itemName": "Clock",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cuckoo-clock",
            "itemName": "Cuckoo Clock",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-cuckoo-clock-crafting-wiki-1",
        "name": "Mechanical Crafter - Cuckoo Clock",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cuckoo-clock",
            "itemName": "Cuckoo Clock",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "deepslate",
    "name": "Deepslate",
    "category": "Materials & Resources",
    "icon": "/items/deepslate_1.png",
    "description": "Alongside vanilla generation,  generates in layers between Y -30 and 70 in the following patterns:",
    "recipes": [
      {
        "id": "recipe-crushing-lapis-lazuli-ore-31",
        "name": "Crushing Wheels (from Lapis Lazuli Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli-ore",
            "itemName": "Lapis Lazuli Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 12
          },
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "deepslate",
            "itemName": "Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "deployer",
    "name": "Deployer",
    "category": "Automation Machines",
    "icon": "/items/deployer.png",
    "description": "The Deployer simulates player actions on blocks or entities exactly 2 blocks away from it. It can simulate a left or a right click, holding or without holding an item.",
    "recipes": [
      {
        "id": "recipe-deployer-crafter-0",
        "name": "Mechanical Crafter - Deployer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "brass-hand",
            "itemName": "Brass Hand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "deployer",
            "itemName": "Deployer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "depot",
    "name": "Depot",
    "category": "Logistics & Fluids",
    "icon": "/items/depot.png",
    "description": "The Depot is used as an interaction point for machines such as the Mechanical Arm.",
    "recipes": [
      {
        "id": "recipe-depot-crafter-0",
        "name": "Mechanical Crafter - Depot",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "depot",
            "itemName": "Depot",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "diorite",
    "name": "Diorite",
    "category": "Materials & Resources",
    "icon": "/items/diorite.png",
    "description": "Polished Diorite.png|Polished",
    "recipes": [
      {
        "id": "recipe-press-diorite-12",
        "name": "Mechanical Press (Compacting) (from Flint)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 2
          },
          {
            "itemId": "calcite",
            "itemName": "Calcite",
            "amount": 1
          },
          {
            "itemId": "lava",
            "itemName": "Lava",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diorite",
            "itemName": "Diorite",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "display-board",
    "name": "Display Board",
    "category": "Redstone & Displays",
    "icon": "/items/display_board.png",
    "description": "Display Boards are a scalable alternative to the .",
    "recipes": [
      {
        "id": "recipe-display-board-crafter-0",
        "name": "Mechanical Crafter - Display Board",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "display-board",
            "itemName": "Display Board",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-display-board-crafting-wiki-1",
        "name": "Mechanical Crafter - Display Board",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "display-board",
            "itemName": "Display Board",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "display-link",
    "name": "Display Link",
    "category": "Redstone & Displays",
    "icon": "/items/display_link.png",
    "description": "A Display Link is used to get information from a block and send it to blocks that can display it.",
    "recipes": [
      {
        "id": "recipe-display-link-crafter-0",
        "name": "Mechanical Crafter - Display Link",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "transmitter",
            "itemName": "Transmitter",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "display-link",
            "itemName": "Display Link",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "elevator-pulley",
    "name": "Elevator Pulley",
    "category": "Kinetics & Contraptions",
    "icon": "/items/elevator_pulley.png",
    "description": "An Elevator Pulley is a Contraption useful for creating multi-floor elevators easily.",
    "recipes": [
      {
        "id": "recipe-elevator-pulley-crafter-0",
        "name": "Mechanical Crafter - Elevator Pulley",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "dried-kelp-block",
            "itemName": "Dried Kelp Block",
            "amount": 1
          },
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "elevator-pulley",
            "itemName": "Elevator Pulley",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-elevator-pulley-crafting-wiki-1",
        "name": "Mechanical Crafter - Elevator Pulley",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "dried-kelp-block",
            "itemName": "Dried Kelp Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "elevator-pulley",
            "itemName": "Elevator Pulley",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "encased-chain-drive",
    "name": "Encased Chain Drive",
    "category": "Kinetics & Contraptions",
    "icon": "/items/encased_chain_drive.png",
    "description": "The Encased Chain Drive is a block that can transfer rotation much like the Mechanical Belt.",
    "recipes": [
      {
        "id": "recipe-encased-chain-drive-crafter-iron",
        "name": "Mechanical Crafter - Encased Chain Drive (from Iron Nugget)",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 3
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-chain-drive",
            "itemName": "Encased Chain Drive",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-encased-chain-drive-crafter-zinc",
        "name": "Mechanical Crafter - Encased Chain Drive (from Zinc Nugget)",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 3
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-chain-drive",
            "itemName": "Encased Chain Drive",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-encased-chain-drive-crafting-wiki-2",
        "name": "Mechanical Crafter - Encased Chain Drive",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-chain-drive",
            "itemName": "Encased Chain Drive",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-encased-chain-drive-crafting-wiki-3",
        "name": "Mechanical Crafter - Encased Chain Drive",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-chain-drive",
            "itemName": "Encased Chain Drive",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "encased-fan",
    "name": "Encased Fan",
    "category": "Automation Machines",
    "icon": "/items/encased_fan.png",
    "description": "The Encased Fan is a mechanical component that can create air streams. Encased Fans are used for moving entities, vertical transport of items and Bulk Item Processing.",
    "recipes": [
      {
        "id": "recipe-encased-fan-crafter-0",
        "name": "Mechanical Crafter - Encased Fan",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "propeller",
            "itemName": "Propeller",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-fan",
            "itemName": "Encased Fan",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-encased-fan-bulk-blasting-wiki-1",
        "name": "Encased Fan - Encased Fan",
        "method": "Bulk Blasting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "propeller",
            "itemName": "Propeller",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-fan",
            "itemName": "Encased Fan",
            "amount": 1
          }
        ],
        "speedRpm": 128,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-encased-fan-bulk-blasting-wiki-2",
        "name": "Encased Fan - Encased Fan",
        "method": "Bulk Blasting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "propeller",
            "itemName": "Propeller",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "encased-fan",
            "itemName": "Encased Fan",
            "amount": 1
          }
        ],
        "speedRpm": 128,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "factory-gauge",
    "name": "Factory Gauge",
    "category": "Redstone & Displays",
    "icon": "/items/factory_gauge.png",
    "description": "The Factory Gauge is used to send requests through a Logistics Network to maintain an amount of an item in the linked storage.",
    "recipes": [
      {
        "id": "recipe-factory-gauge-crafter-0",
        "name": "Mechanical Crafter - Factory Gauge",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "stock-link",
            "itemName": "Stock Link",
            "amount": 1
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "factory-gauge",
            "itemName": "Factory Gauge",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "fluid-pipe",
    "name": "Fluid Pipe",
    "category": "Logistics & Fluids",
    "icon": "/items/fluid_pipe.png",
    "description": "Fluid Pipes are blocks used to  transport and deal with fluids.",
    "recipes": [
      {
        "id": "recipe-fluid-pipe-crafter-0",
        "name": "Mechanical Crafter - Fluid Pipe",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-sheet",
            "itemName": "Copper Sheet",
            "amount": 2
          },
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "fluid-pipe",
            "itemName": "Fluid Pipe",
            "amount": 4
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "fluid-tank",
    "name": "Fluid Tank",
    "category": "Logistics & Fluids",
    "icon": "/items/fluid_tank.png",
    "description": "The Fluid Tank is a fluid storage mechanism that can store up to 8 buckets (displayed as 8,000 mB in-game) of fluid per block.",
    "recipes": [
      {
        "id": "recipe-fluid-tank-crafter-0",
        "name": "Mechanical Crafter - Fluid Tank",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-sheet",
            "itemName": "Copper Sheet",
            "amount": 2
          },
          {
            "itemId": "barrel",
            "itemName": "Barrel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "fluid-tank",
            "itemName": "Fluid Tank",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "fluid-valve",
    "name": "Fluid Valve",
    "category": "Logistics & Fluids",
    "icon": "/items/fluid_valve.png",
    "description": "Fluid valves can be used to close or open the flow in a pipe. Fluid Valves can be switched between open and closed by providing Rotational Force to the side. This is often done with a Valve Handle or Gearshift. A set of directional arrows on the side of the valve will also rotate to indicate whether the valve is open or closed.",
    "recipes": [
      {
        "id": "recipe-fluid-valve-crafter-0",
        "name": "Mechanical Crafter - Fluid Valve",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "fluid-pipe",
            "itemName": "Fluid Pipe",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "fluid-valve",
            "itemName": "Fluid Valve",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "flywheel",
    "name": "Flywheel",
    "category": "Kinetics & Contraptions",
    "icon": "/items/flywheel.png",
    "description": "The Flywheel is a legacy block that was repurposed to a decorative block. It is 3x3 in size, but only needs 1 block to be placed, similar to the Water Wheel. {{Block",
    "recipes": [
      {
        "id": "recipe-flywheel-crafter-0",
        "name": "Mechanical Crafter - Flywheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 8
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flywheel",
            "itemName": "Flywheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-flywheel-crafting-wiki-1",
        "name": "Mechanical Crafter - Flywheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flywheel",
            "itemName": "Flywheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "framed-glass",
    "name": "Framed Glass",
    "category": "Building & Decoration",
    "icon": "/items/framed_glass.png",
    "description": "Framed Glass.png|Framed",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "framed-glass-trapdoor",
    "name": "Framed Glass Trapdoor",
    "category": "Building & Decoration",
    "icon": "/items/framed_glass_trapdoor.png",
    "description": "The Framed Glass Trapdoor is a transparent trapdoor.",
    "recipes": [
      {
        "id": "recipe-framed-glass-trapdoor-crafter-0",
        "name": "Mechanical Crafter - Framed Glass Trapdoor",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wood-trapdoor",
            "itemName": "Wood Trapdoor",
            "amount": 1
          },
          {
            "itemId": "framed-glass",
            "itemName": "Framed Glass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "framed-glass-trapdoor",
            "itemName": "Framed Glass Trapdoor",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "gantry-carriage",
    "name": "Gantry Carriage",
    "category": "Kinetics & Contraptions",
    "icon": "/items/gantry_carriage.png",
    "description": "Gantry Carriage.png|Carriage",
    "recipes": [
      {
        "id": "recipe-gantry-carriage-crafter-0",
        "name": "Mechanical Crafter - Gantry Carriage",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gantry-carriage",
            "itemName": "Gantry Carriage",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-gantry-carriage-crafting-wiki-2",
        "name": "Mechanical Crafter - Gantry Carriage",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gantry-carriage",
            "itemName": "Gantry Carriage",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "gearbox",
    "name": "Gearbox",
    "category": "Kinetics & Contraptions",
    "icon": "/items/gearbox.png",
    "description": "Vertical Gearbox.png|Vertical</gallery>",
    "recipes": [
      {
        "id": "recipe-gearbox-crafter-0",
        "name": "Mechanical Crafter - Gearbox",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 4
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gearbox",
            "itemName": "Gearbox",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-gearbox-crafting-wiki-2",
        "name": "Mechanical Crafter - Gearbox",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gearbox",
            "itemName": "Gearbox",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "gearshift",
    "name": "Gearshift",
    "category": "Kinetics & Contraptions",
    "icon": "/items/gearshift.png",
    "description": "The Gearshift reverses outgoing Rotational Force when a  signal is applied.",
    "recipes": [
      {
        "id": "recipe-gearshift-crafter-0",
        "name": "Mechanical Crafter - Gearshift",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gearshift",
            "itemName": "Gearshift",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-gearshift-crafting-wiki-1",
        "name": "Mechanical Crafter - Gearshift",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gearshift",
            "itemName": "Gearshift",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "granite",
    "name": "Granite",
    "category": "Materials & Resources",
    "icon": "/items/granite.png",
    "description": "Polished Granite.png|Polished",
    "recipes": [
      {
        "id": "recipe-press-granite-13",
        "name": "Mechanical Press (Compacting) (from Flint)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 2
          },
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          },
          {
            "itemId": "lava",
            "itemName": "Lava",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "granite",
            "itemName": "Granite",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "hand-crank",
    "name": "Hand Crank",
    "category": "Kinetics & Contraptions",
    "icon": "/items/hand_crank.png",
    "description": "The Hand Crank generates a small amount of Rotational Force through player interaction.",
    "recipes": [
      {
        "id": "recipe-hand-crank-crafter-0",
        "name": "Mechanical Crafter - Hand Crank",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 3
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "hand-crank",
            "itemName": "Hand Crank",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "haunted-bell",
    "name": "Haunted Bell",
    "category": "Redstone & Displays",
    "icon": "/items/haunted_bell.png",
    "description": "The Haunted Bell is a block that highlights mob spawnable spots when held or rang.",
    "recipes": [
      {
        "id": "recipe-fan-haunting-peculiar-bell-20",
        "name": "Bulk Haunting (from Peculiar Bell)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "peculiar-bell",
            "itemName": "Peculiar Bell",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "haunted-bell",
            "itemName": "Haunted Bell",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "hose-pulley",
    "name": "Hose Pulley",
    "category": "Logistics & Fluids",
    "icon": "/items/hose_pulley.png",
    "description": "The Hose Pulley lets down a hose that can drain bodies of liquids.",
    "recipes": [
      {
        "id": "recipe-hose-pulley-crafter-0",
        "name": "Mechanical Crafter - Hose Pulley",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-casing",
            "itemName": "Copper Casing",
            "amount": 1
          },
          {
            "itemId": "dried-kelp-block",
            "itemName": "Dried Kelp Block",
            "amount": 1
          },
          {
            "itemId": "copper-sheet",
            "itemName": "Copper Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "hose-pulley",
            "itemName": "Hose Pulley",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-hose-pulley-crafting-wiki-1",
        "name": "Mechanical Crafter - Hose Pulley",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-casing",
            "itemName": "Copper Casing",
            "amount": 1
          },
          {
            "itemId": "dried-kelp-block",
            "itemName": "Dried Kelp Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "hose-pulley",
            "itemName": "Hose Pulley",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "item-drain",
    "name": "Item Drain",
    "category": "Logistics & Fluids",
    "icon": "/items/item_drain.png",
    "description": "The Item Drain drains fluid from items such as buckets and bottles inserted onto it.",
    "recipes": [
      {
        "id": "recipe-item-drain-crafter-0",
        "name": "Mechanical Crafter - Item Drain",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-bars",
            "itemName": "Iron Bars",
            "amount": 1
          },
          {
            "itemId": "copper-casing",
            "itemName": "Copper Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "item-drain",
            "itemName": "Item Drain",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "item-hatch",
    "name": "Item Hatch",
    "category": "Logistics & Fluids",
    "icon": "/items/item_hatch.png",
    "description": "The Item Hatch is used to deposit a player’s inventory into storage.",
    "recipes": [
      {
        "id": "recipe-item-hatch-crafter-0",
        "name": "Mechanical Crafter - Item Hatch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "iron-trapdoor",
            "itemName": "Iron Trapdoor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "item-hatch",
            "itemName": "Item Hatch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "item-vault",
    "name": "Item Vault",
    "category": "Logistics & Fluids",
    "icon": "/items/item_vault.png",
    "description": "By default, each Item Vault block has a storage space of 20 stacks, and this can be changed in the Config. Items cannot be added or removed by the player, but by components such as Chutes, Funnels, and Item Hatches.",
    "recipes": [
      {
        "id": "recipe-item-vault-crafter-0",
        "name": "Mechanical Crafter - Item Vault",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 2
          },
          {
            "itemId": "barrel",
            "itemName": "Barrel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "item-vault",
            "itemName": "Item Vault",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-item-vault-crafting-wiki-1",
        "name": "Mechanical Crafter - Item Vault",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "barrel",
            "itemName": "Barrel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "item-vault",
            "itemName": "Item Vault",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "large-water-wheel",
    "name": "Large Water Wheel",
    "category": "Kinetics & Contraptions",
    "icon": "/items/large_water_wheel.png",
    "description": "The Large Water Wheel is a bigger version of the Water Wheel.",
    "recipes": [
      {
        "id": "recipe-large-water-wheel-crafter-0",
        "name": "Mechanical Crafter - Large Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 8
          },
          {
            "itemId": "water-wheel",
            "itemName": "Water Wheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "large-water-wheel",
            "itemName": "Large Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-large-water-wheel-crafting-wiki-1",
        "name": "Mechanical Crafter - Large Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          },
          {
            "itemId": "water-wheel",
            "itemName": "Water Wheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "large-water-wheel",
            "itemName": "Large Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-large-water-wheel-crafting-wiki-2",
        "name": "Mechanical Crafter - Large Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "large-water-wheel",
            "itemName": "Large Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "limestone",
    "name": "Limestone",
    "category": "Materials & Resources",
    "icon": "/items/limestone.png",
    "description": "Cut Limestone.png|Cut",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "linear-chassis",
    "name": "Linear Chassis",
    "category": "Kinetics & Contraptions",
    "icon": "/items/linear_chassis_1.png",
    "description": "The Linear Chassis is one method of connecting up Contraptions.",
    "recipes": [
      {
        "id": "recipe-linear-chassis-crafter-0",
        "name": "Mechanical Crafter - Linear Chassis",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          },
          {
            "itemId": "log",
            "itemName": "Log",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "linear-chassis",
            "itemName": "Linear Chassis",
            "amount": 3
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-arm",
    "name": "Mechanical Arm",
    "category": "Automation Machines",
    "icon": "/items/mechanical_arm.png",
    "description": "The Mechanical Arm is a block used to transfer items.",
    "recipes": [
      {
        "id": "recipe-mechanical-arm-crafter-0",
        "name": "Mechanical Crafter - Mechanical Arm",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 3
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-arm",
            "itemName": "Mechanical Arm",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-arm-crafting-wiki-1",
        "name": "Mechanical Crafter - Mechanical Arm",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-arm",
            "itemName": "Mechanical Arm",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-bearing",
    "name": "Mechanical Bearing",
    "category": "Kinetics & Contraptions",
    "icon": "/items/mechanical_bearing.png",
    "description": "The Mechanical Bearing is used to create and rotate Contraptions.",
    "recipes": [
      {
        "id": "recipe-mechanical-bearing-crafter-0",
        "name": "Mechanical Crafter - Mechanical Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-bearing",
            "itemName": "Mechanical Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-bearing-crafting-wiki-1",
        "name": "Mechanical Crafter - Mechanical Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-bearing",
            "itemName": "Mechanical Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-belt",
    "name": "Mechanical Belt",
    "category": "Logistics & Fluids",
    "icon": "/items/mechanical_belt_block.png",
    "description": "Mechanical Belt Block.png|Belt",
    "recipes": [
      {
        "id": "recipe-mechanical-belt-crafter-0",
        "name": "Mechanical Crafter - Mechanical Belt",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 6
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-belt",
            "itemName": "Mechanical Belt",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-belt-crafting-wiki-1",
        "name": "Mechanical Crafter - Mechanical Belt",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-belt",
            "itemName": "Mechanical Belt",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-crafter",
    "name": "Mechanical Crafter",
    "category": "Automation Machines",
    "icon": "/items/mechanical_crafter.png",
    "description": "Mechanical Crafters are machines that can automatically craft items.",
    "recipes": [
      {
        "id": "recipe-mechanical-crafter-crafter-0",
        "name": "Mechanical Crafter - Mechanical Crafter",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "crafting-table",
            "itemName": "Crafting Table",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-crafter",
            "itemName": "Mechanical Crafter",
            "amount": 3
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-drill",
    "name": "Mechanical Drill",
    "category": "Automation Machines",
    "icon": "/items/mechanical_drill.png",
    "description": "The Mechanical Drill is a block used to break blocks.",
    "recipes": [
      {
        "id": "recipe-mechanical-drill-crafter-0",
        "name": "Mechanical Crafter - Mechanical Drill",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 3
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-drill",
            "itemName": "Mechanical Drill",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-drill-crafting-wiki-1",
        "name": "Mechanical Crafter - Mechanical Drill",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-drill",
            "itemName": "Mechanical Drill",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-drill-crafting-wiki-2",
        "name": "Mechanical Crafter - Mechanical Drill",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-drill",
            "itemName": "Mechanical Drill",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-harvester",
    "name": "Mechanical Harvester",
    "category": "Automation Machines",
    "icon": "/items/mechanical_harvester.png",
    "description": "The Mechanical Harvester is a component used on Contraptions to harvest crops.",
    "recipes": [
      {
        "id": "recipe-mechanical-harvester-crafter-0",
        "name": "Mechanical Crafter - Mechanical Harvester",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 4
          },
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 2
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-harvester",
            "itemName": "Mechanical Harvester",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-harvester-crafting-wiki-1",
        "name": "Mechanical Crafter - Mechanical Harvester",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "iron-sheet",
            "itemName": "iron sheet",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-harvester",
            "itemName": "Mechanical Harvester",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-mixer",
    "name": "Mechanical Mixer",
    "category": "Automation Machines",
    "icon": "/items/mechanical_mixer.png",
    "description": "The Mechanical Mixer is a mechanical component that applies Mixing recipes and shapeless Crafting recipes to items in Basins.",
    "recipes": [
      {
        "id": "recipe-mechanical-mixer-crafter-0",
        "name": "Mechanical Crafter - Mechanical Mixer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "whisk",
            "itemName": "Whisk",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-mixer",
            "itemName": "Mechanical Mixer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-mixer-mixing-wiki-1",
        "name": "Mechanical Mixer - Mechanical Mixer",
        "method": "Mixing",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 3,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "whisk",
            "itemName": "Whisk",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-mixer",
            "itemName": "Mechanical Mixer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-piston",
    "name": "Mechanical Piston",
    "category": "Kinetics & Contraptions",
    "icon": "/items/mechanical_piston.png",
    "description": "The Mechanical Piston is a piston that can push Contraptions when powered with Rotational Power.",
    "recipes": [
      {
        "id": "recipe-mechanical-piston-crafter-0",
        "name": "Mechanical Crafter - Mechanical Piston",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "piston-extension-pole",
            "itemName": "Piston Extension Pole",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-piston",
            "itemName": "Mechanical Piston",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-piston-crafting-wiki-3",
        "name": "Mechanical Crafter - Mechanical Piston",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-piston",
            "itemName": "Mechanical Piston",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-plough",
    "name": "Mechanical Plough",
    "category": "Automation Machines",
    "icon": "/items/mechanical_plough.png",
    "description": "The Mechanical Plough is a Movement Actor used to break non-collidable blocks and fling entities.",
    "recipes": [
      {
        "id": "recipe-mechanical-plough-crafter-0",
        "name": "Mechanical Crafter - Mechanical Plough",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 3
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 3
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-plough",
            "itemName": "Mechanical Plough",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-plough-crafting-wiki-1",
        "name": "Mechanical Crafter - Mechanical Plough",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-plough",
            "itemName": "Mechanical Plough",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-press",
    "name": "Mechanical Press",
    "category": "Automation Machines",
    "icon": "/items/mechanical_press.png",
    "description": "The Mechanical Press is a mechanical component that applies Pressing, Packing, and Compacting recipes to items below it. It is an important early-game item, as it is used to press Ingots into Sheets, which are important ingredients for higher-level components.",
    "recipes": [
      {
        "id": "recipe-mechanical-press-crafter-0",
        "name": "Mechanical Crafter - Mechanical Press",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "block-of-iron",
            "itemName": "Block of Iron",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-press",
            "itemName": "Mechanical Press",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-press-pressing-wiki-1",
        "name": "Mechanical Press - Mechanical Press",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "block-of-iron",
            "itemName": "Block of Iron",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-press",
            "itemName": "Mechanical Press",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-press-pressing-wiki-3",
        "name": "Mechanical Press - Mechanical Press",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "block-of-iron",
            "itemName": "Block of Iron",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-press",
            "itemName": "Mechanical Press",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-press-pressing-wiki-4",
        "name": "Mechanical Press - Mechanical Press",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-press",
            "itemName": "Mechanical Press",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-pump",
    "name": "Mechanical Pump",
    "category": "Logistics & Fluids",
    "icon": "/items/mechanical_pump.png",
    "description": "Mechanical Pumps (MPs) have a maximum range of 16 blocks (configurable) on either side, though this does not seem to apply to pipes themselves. You may however have up to 30 pipes between pumps. Mechanical Pumps will move fluid in only one direction at a time.",
    "recipes": [
      {
        "id": "recipe-mechanical-pump-crafter-0",
        "name": "Mechanical Crafter - Mechanical Pump",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "fluid-pipe",
            "itemName": "Fluid Pipe",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-pump",
            "itemName": "Mechanical Pump",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-roller",
    "name": "Mechanical Roller",
    "category": "Automation Machines",
    "icon": "/items/mechanical_roller.png",
    "description": "The Mechanical Roller can be used on Contraptions to clear and pave a path.",
    "recipes": [
      {
        "id": "recipe-mechanical-roller-crafter-0",
        "name": "Mechanical Crafter - Mechanical Roller",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "crushing-wheel",
            "itemName": "Crushing Wheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-roller",
            "itemName": "Mechanical Roller",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "mechanical-saw",
    "name": "Mechanical Saw",
    "category": "Automation Machines",
    "icon": "/items/mechanical_saw.png",
    "description": "Mechanical Saws are powered through rotational force, and when placed down facing to the side they will automatically chop down wood blocks in front of them. When chopping down a tree or giant mushroom, it will automatically destroy the entire tree by only destroying the bottom-most block. Blocks tagged as TREE_ATTACHMENTS will also be broken if found on the tree.",
    "recipes": [
      {
        "id": "recipe-mechanical-saw-crafter-0",
        "name": "Mechanical Crafter - Mechanical Saw",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 3
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-saw",
            "itemName": "Mechanical Saw",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mechanical-saw-sawing-wiki-1",
        "name": "Mechanical Saw - Mechanical Saw",
        "method": "Sawing",
        "buildingRequired": "Mechanical Saw",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "mechanical-saw",
            "itemName": "Mechanical Saw",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "metal-girder",
    "name": "Metal Girder",
    "category": "Building & Decoration",
    "icon": "/items/metal_girder.png",
    "description": "Metal Girders are a decorative block.",
    "recipes": [
      {
        "id": "recipe-metal-girder-crafter-0",
        "name": "Mechanical Crafter - Metal Girder",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 3
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "metal-girder",
            "itemName": "Metal Girder",
            "amount": 8
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-metal-girder-crafting-wiki-1",
        "name": "Mechanical Crafter - Metal Girder",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "metal-girder",
            "itemName": "Metal Girder",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "millstone",
    "name": "Millstone",
    "category": "Automation Machines",
    "icon": "/items/millstone.png",
    "description": "The Millstone is a more basic equivalent of the Crushing Wheels, and is most likely the first of the two that the Player will construct. It is capable of applying milling recipes to any valid items inserted from above.",
    "recipes": [
      {
        "id": "recipe-millstone-crafter-0",
        "name": "Mechanical Crafter - Millstone",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "millstone",
            "itemName": "Millstone",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-millstone-milling-wiki-1",
        "name": "Millstone - Millstone",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "millstone",
            "itemName": "Millstone",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "nixie-tube",
    "name": "Nixie Tube",
    "category": "Redstone & Displays",
    "icon": "/items/nixie_tube.png",
    "description": "The Nixie Tube is a block that can display text or numbers.",
    "recipes": [
      {
        "id": "recipe-nixie-tube-crafter-0",
        "name": "Mechanical Crafter - Nixie Tube",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "nixie-tube",
            "itemName": "Nixie Tube",
            "amount": 4
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-nixie-tube-crafting-wiki-1",
        "name": "Mechanical Crafter - Nixie Tube",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nixie-tube",
            "itemName": "Nixie Tube",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-nixie-tube-mechanical-crafting-wiki-2",
        "name": "Mechanical Crafter - Nixie Tube",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nixie-tube",
            "itemName": "Nixie Tube",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "nozzle",
    "name": "Nozzle",
    "category": "Automation Machines",
    "icon": "/items/nozzle.png",
    "description": "A Nozzle distributes the effect of an Encased Fan in all directions.",
    "recipes": [
      {
        "id": "recipe-nozzle-crafter-0",
        "name": "Mechanical Crafter - Nozzle",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 4
          },
          {
            "itemId": "wool",
            "itemName": "Wool",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nozzle",
            "itemName": "Nozzle",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "ochrum",
    "name": "Ochrum",
    "category": "Materials & Resources",
    "icon": "/items/ochrum.png",
    "description": "Polished Cut Ochrum.png|Polished Cut",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "package-frogport",
    "name": "Package Frogport",
    "category": "Logistics & Fluids",
    "icon": "/items/package_frogport.png",
    "description": "Package Frogports are used to move Cardboard Packages from and to Chain Conveyors.",
    "recipes": [
      {
        "id": "recipe-package-frogport-crafter-0",
        "name": "Mechanical Crafter - Package Frogport",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "slimeball",
            "itemName": "Slimeball",
            "amount": 1
          },
          {
            "itemId": "item-vault",
            "itemName": "Item Vault",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "package-frogport",
            "itemName": "Package Frogport",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-package-frogport-crafting-wiki-1",
        "name": "Mechanical Crafter - Package Frogport",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "slimeball",
            "itemName": "Slimeball",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "package-frogport",
            "itemName": "Package Frogport",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "packager",
    "name": "Packager",
    "category": "Logistics & Fluids",
    "icon": "/items/packager.png",
    "description": "The Packager is used to extract items from an attached storage block and place them in Cardboard Packages allowing the items to be transported, stored, or used as a set. Packagers can also extract items from cardboard packages and insert them into the attached storage.",
    "recipes": [
      {
        "id": "recipe-packager-crafter-0",
        "name": "Mechanical Crafter - Packager",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 4
          },
          {
            "itemId": "block-of-cardboard",
            "itemName": "Block of Cardboard",
            "amount": 1
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "packager",
            "itemName": "Packager",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-packager-crafter-1",
        "name": "Mechanical Crafter - Packager",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "re-packager",
            "itemName": "Re-Packager",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "packager",
            "itemName": "Packager",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "peculiar-bell",
    "name": "Peculiar Bell",
    "category": "Redstone & Displays",
    "icon": "/items/peculiar_bell.png",
    "description": "The Peculiar Bell is a decorative block that is also used to create the Haunted Bell.",
    "recipes": [
      {
        "id": "recipe-peculiar-bell-crafter-0",
        "name": "Mechanical Crafter - Peculiar Bell",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-brass",
            "itemName": "Block of Brass",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "peculiar-bell",
            "itemName": "Peculiar Bell",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "piston-extension-pole",
    "name": "Piston Extension Pole",
    "category": "Kinetics & Contraptions",
    "icon": "/items/piston_extension_pole.png",
    "description": "The Piston Extension Pole is an extension for the Mechanical Piston",
    "recipes": [
      {
        "id": "recipe-piston-extension-pole-crafter-0",
        "name": "Mechanical Crafter - Piston Extension Pole",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 2
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "piston-extension-pole",
            "itemName": "Piston Extension Pole",
            "amount": 8
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "placard",
    "name": "Placard",
    "category": "Building & Decoration",
    "icon": "/items/placard.png",
    "description": "The Placard is a decorative block used to display items. It can be considered Create's counterpart to the vanilla Item Frame.",
    "recipes": [
      {
        "id": "recipe-placard-crafter-0",
        "name": "Mechanical Crafter - Placard",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "item-frame",
            "itemName": "Item Frame",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "placard",
            "itemName": "Placard",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "planks",
    "name": "Planks",
    "category": "Building & Decoration",
    "icon": "/items/oak_planks_1.png",
    "description": "Spruce_Planks.png|Spruce",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "portable-fluid-interface",
    "name": "Portable Fluid Interface",
    "category": "Logistics & Fluids",
    "icon": "/items/portable_fluid_interface.png",
    "description": "The Portable Fluid Interface is the fluid version of the Portable Storage Interface. It is used to insert or extract from the fluid inventory of a Contraption.",
    "recipes": [
      {
        "id": "recipe-portable-fluid-interface-crafter-0",
        "name": "Mechanical Crafter - Portable Fluid Interface",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-casing",
            "itemName": "Copper Casing",
            "amount": 1
          },
          {
            "itemId": "chute",
            "itemName": "Chute",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "portable-fluid-interface",
            "itemName": "Portable Fluid Interface",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "portable-storage-interface",
    "name": "Portable Storage Interface",
    "category": "Logistics & Fluids",
    "icon": "/items/portable_storage_interface.png",
    "description": "The Portable Storage Interface is a block that allows Item Transporters to directly interact with Contraption inventories.",
    "recipes": [
      {
        "id": "recipe-portable-storage-interface-crafter-0",
        "name": "Mechanical Crafter - Portable Storage Interface",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "chute",
            "itemName": "Chute",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "portable-storage-interface",
            "itemName": "Portable Storage Interface",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "postbox",
    "name": "Postbox",
    "category": "Logistics & Fluids",
    "icon": "/items/white_postbox.png",
    "description": "White Postbox.png|White",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "powered-latch",
    "name": "Powered Latch",
    "category": "Redstone & Displays",
    "icon": "/items/powered_latch.png",
    "description": "The Powered Latch emits a redstone signal that can be toggled on or off by other signals.",
    "recipes": [
      {
        "id": "recipe-powered-latch-crafter-0",
        "name": "Mechanical Crafter - Powered Latch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-torch",
            "itemName": "Redstone Torch",
            "amount": 1
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 2
          },
          {
            "itemId": "lever",
            "itemName": "Lever",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "powered-latch",
            "itemName": "Powered Latch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "powered-toggle-latch",
    "name": "Powered Toggle Latch",
    "category": "Redstone & Displays",
    "icon": "/items/powered_toggle_latch.png",
    "description": "The Powered Latch emits a redstone signal that can be toggled on or off.",
    "recipes": [
      {
        "id": "recipe-powered-toggle-latch-crafter-0",
        "name": "Mechanical Crafter - Powered Toggle Latch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-torch",
            "itemName": "Redstone Torch",
            "amount": 1
          },
          {
            "itemId": "lever",
            "itemName": "Lever",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "powered-toggle-latch",
            "itemName": "Powered Toggle Latch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "pulse-extender",
    "name": "Pulse Extender",
    "category": "Redstone & Displays",
    "icon": "/items/pulse_extender.png",
    "description": "When powered, extends a redstone pulse for a specified time, much like a . The time can be set in its Value Settings Screen accessed by holding right-click. It can be set to extend a signal for 2 ticks up to 60 minutes. The settings can also be copied and pasted onto other extenders or Pulse Repeaters by using a Clipboard.",
    "recipes": [
      {
        "id": "recipe-pulse-extender-crafter-0",
        "name": "Mechanical Crafter - Pulse Extender",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-torch",
            "itemName": "Redstone Torch",
            "amount": 2
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "pulse-extender",
            "itemName": "Pulse Extender",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "pulse-repeater",
    "name": "Pulse Repeater",
    "category": "Redstone & Displays",
    "icon": "/items/pulse_repeater.png",
    "description": "Sends a pulse after delaying for a specified time.",
    "recipes": [
      {
        "id": "recipe-pulse-repeater-crafter-0",
        "name": "Mechanical Crafter - Pulse Repeater",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          },
          {
            "itemId": "redstone-torch",
            "itemName": "Redstone Torch",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "pulse-repeater",
            "itemName": "Pulse Repeater",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "pulse-timer",
    "name": "Pulse Timer",
    "category": "Redstone & Displays",
    "icon": "/items/pulse_timer.png",
    "description": "The Pulse Timer is used to pulse repeatedly at a set interval.",
    "recipes": [
      {
        "id": "recipe-pulse-timer-crafter-0",
        "name": "Mechanical Crafter - Pulse Timer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "amethyst-shard",
            "itemName": "Amethyst Shard",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          },
          {
            "itemId": "redstone-torch",
            "itemName": "Redstone Torch",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 3
          }
        ],
        "outputs": [
          {
            "itemId": "pulse-timer",
            "itemName": "Pulse Timer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-pulse-timer-crafting-wiki-1",
        "name": "Mechanical Crafter - Pulse Timer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "amethyst-shard",
            "itemName": "Amethyst Shard",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pulse-timer",
            "itemName": "Pulse Timer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "radial-chassis",
    "name": "Radial Chassis",
    "category": "Kinetics & Contraptions",
    "icon": "/items/radial_chassis.png",
    "description": "The Radial Chassis is a block used to connect Contraptions.",
    "recipes": [
      {
        "id": "recipe-radial-chassis-crafter-0",
        "name": "Mechanical Crafter - Radial Chassis",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "log",
            "itemName": "Log",
            "amount": 3
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "radial-chassis",
            "itemName": "Radial Chassis",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "re-packager",
    "name": "Re-Packager",
    "category": "Logistics & Fluids",
    "icon": "/items/re-packager.png",
    "description": "The Re-Packager is used to merge multiple Cardboard Packages that contain one recipe for a Mechanical Crafter.",
    "recipes": [
      {
        "id": "recipe-re-packager-crafter-0",
        "name": "Mechanical Crafter - Re-Packager",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "packager",
            "itemName": "Packager",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "re-packager",
            "itemName": "Re-Packager",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "redstone-contact",
    "name": "Redstone Contact",
    "category": "Redstone & Displays",
    "icon": "/items/redstone_contact.png",
    "description": "Redstone Contacts allow Contraptions to convey redstone signals or activate Redstone Circuits.",
    "recipes": [
      {
        "id": "recipe-redstone-contact-crafter-0",
        "name": "Mechanical Crafter - Redstone Contact",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 5
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-contact",
            "itemName": "Redstone Contact",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-redstone-contact-crafting-wiki-1",
        "name": "Mechanical Crafter - Redstone Contact",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-contact",
            "itemName": "Redstone Contact",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "redstone-link",
    "name": "Redstone Link",
    "category": "Redstone & Displays",
    "icon": "/items/redstone_link.png",
    "description": "The Redstone Link is used to send and receive redstone signals to other links.",
    "recipes": [
      {
        "id": "recipe-redstone-link-crafter-0",
        "name": "Mechanical Crafter - Redstone Link",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "transmitter",
            "itemName": "Transmitter",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-link",
            "itemName": "Redstone Link",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "redstone-requester",
    "name": "Redstone Requester",
    "category": "Redstone & Displays",
    "icon": "/items/redstone_requester.png",
    "description": "The Redstone Requester is used to request Cardboard Packages from linked Packagers.",
    "recipes": [
      {
        "id": "recipe-redstone-requester-crafter-0",
        "name": "Mechanical Crafter - Redstone Requester",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          },
          {
            "itemId": "stock-link",
            "itemName": "Stock Link",
            "amount": 1
          },
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-requester",
            "itemName": "Redstone Requester",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "rope-pulley",
    "name": "Rope Pulley",
    "category": "Kinetics & Contraptions",
    "icon": "/items/rope_pulley.png",
    "description": "The Rope Pulley creates Contraptions much like a Mechanical Piston, but in only one direction and without the need for Piston Extension Poles.",
    "recipes": [
      {
        "id": "recipe-rope-pulley-crafter-0",
        "name": "Mechanical Crafter - Rope Pulley",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "wool",
            "itemName": "Wool",
            "amount": 1
          },
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "rope-pulley",
            "itemName": "Rope Pulley",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-rope-pulley-crafting-wiki-1",
        "name": "Mechanical Crafter - Rope Pulley",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "wool",
            "itemName": "Wool",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "rope-pulley",
            "itemName": "Rope Pulley",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "rose-quartz-block",
    "name": "Rose Quartz Block",
    "category": "Building & Decoration",
    "icon": "/items/rose_quartz_block.png",
    "description": "Rose Quartz Block.png|Block",
    "recipes": [
      {
        "id": "recipe-rose-quartz-block-crafting-wiki-1",
        "name": "Mechanical Crafter - Rose Quartz Block",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "rose-quartz",
            "itemName": "Rose Quartz",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "rose-quartz-block",
            "itemName": "Rose Quartz Block",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "rose-quartz-lamp",
    "name": "Rose Quartz Lamp",
    "category": "Redstone & Displays",
    "icon": "/items/rose_quartz_lamp.png",
    "description": "The lamp can be activated with a redstone pulse. They will continue to emit a redstone signal afterwards. If multiple Rose Quartz Lamps are adjacent, activating one lamp will turn off other lamps up to 16 blocks away. They will emit a  signal depending on how far away the comparator is to the active lamp.",
    "recipes": [
      {
        "id": "recipe-rose-quartz-lamp-crafter-0",
        "name": "Mechanical Crafter - Rose Quartz Lamp",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "polished-rose-quartz",
            "itemName": "Polished Rose Quartz",
            "amount": 1
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          },
          {
            "itemId": "zinc-ingot",
            "itemName": "Zinc Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "rose-quartz-lamp",
            "itemName": "Rose Quartz Lamp",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-rose-quartz-lamp-crafting-wiki-1",
        "name": "Mechanical Crafter - Rose Quartz Lamp",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "polished-rose-quartz",
            "itemName": "Polished Rose Quartz",
            "amount": 1
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "rose-quartz-lamp",
            "itemName": "Rose Quartz Lamp",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "rotation-speed-controller",
    "name": "Rotation Speed Controller",
    "category": "Kinetics & Contraptions",
    "icon": "/items/rotation_speed_controller.png",
    "description": "The Rotation Speed Controller is a mechanical component that allows the player to precisely control rotational speed.",
    "recipes": [
      {
        "id": "recipe-rotation-speed-controller-crafter-0",
        "name": "Mechanical Crafter - Rotation Speed Controller",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "rotation-speed-controller",
            "itemName": "Rotation Speed Controller",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "schematicannon",
    "name": "Schematicannon",
    "category": "Automation Machines",
    "icon": "/items/schematicannon.png",
    "description": "Schematicannon.png|Schematicannon",
    "recipes": [
      {
        "id": "recipe-schematicannon-crafter-0",
        "name": "Mechanical Crafter - Schematicannon",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-iron",
            "itemName": "Block of Iron",
            "amount": 2
          },
          {
            "itemId": "log",
            "itemName": "Log",
            "amount": 2
          },
          {
            "itemId": "smooth-stone",
            "itemName": "Smooth Stone",
            "amount": 2
          },
          {
            "itemId": "dispenser",
            "itemName": "Dispenser",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "schematicannon",
            "itemName": "Schematicannon",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "scorchia",
    "name": "Scorchia",
    "category": "Materials & Resources",
    "icon": "/items/scorchia.png",
    "description": "Cut Scorchia Slab.png|Cut Slab",
    "recipes": [
      {
        "id": "recipe-scorchia-crafter-0",
        "name": "Mechanical Crafter - Scorchia",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "scoria",
            "itemName": "Scoria",
            "amount": 8
          },
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "scorchia",
            "itemName": "Scorchia",
            "amount": 8
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "scoria",
    "name": "Scoria",
    "category": "Materials & Resources",
    "icon": "/items/scoria.png",
    "description": "Cut Scoria Slab.png|Cut Slab",
    "recipes": [
      {
        "id": "recipe-scoria-crafting-wiki-1",
        "name": "Mechanical Crafter - Scoria",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "soul-sand",
            "itemName": "Soul Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "scoria",
            "itemName": "Scoria",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "seat",
    "name": "Seat",
    "category": "Building & Decoration",
    "icon": "/items/white_seat.png",
    "description": "Orange Seat.png|Orange",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sequenced-gearshift",
    "name": "Sequenced Gearshift",
    "category": "Kinetics & Contraptions",
    "icon": "/items/sequenced_gearshift.png",
    "description": "The Sequenced Gearshift allows finer control over Rotational power, allowing multiple changes to the rotation over a period of time.",
    "recipes": [
      {
        "id": "recipe-sequenced-gearshift-crafter-0",
        "name": "Mechanical Crafter - Sequenced Gearshift",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sequenced-gearshift",
            "itemName": "Sequenced Gearshift",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "shaft",
    "name": "Shaft",
    "category": "Kinetics & Contraptions",
    "icon": "/items/shaft.png",
    "description": "The shaft is a basic mechanical component in Create. A shaft can be used to connect two mechanical components such that the rotation of one rotates the other, and shafts serve as the only blocks upon which Mechanical Belts can be placed.",
    "recipes": [
      {
        "id": "recipe-shaft-crafter-0",
        "name": "Mechanical Crafter - Shaft",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 8
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-saw-shaft-2",
        "name": "Mechanical Saw - Shaft (from Andesite Alloy)",
        "method": "Sawing",
        "buildingRequired": "Mechanical Saw",
        "processingTimeSeconds": 1,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 6
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-shaft-crafting-wiki-2",
        "name": "Mechanical Crafter - Shaft",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sliding-door",
    "name": "Sliding Door",
    "category": "Building & Decoration",
    "icon": "/items/andesite_door_block.png",
    "description": "Sliding Doors are s with special functions on Contraptions.",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "smart-fluid-pipe",
    "name": "Smart Fluid Pipe",
    "category": "Logistics & Fluids",
    "icon": "/items/smart_fluid_pipe.png",
    "description": "Smart Fluid Pipes can be used to allow only a certain liquid to pass through them. This can be set by placing a bucket or bottle of the liquid in the Filter slot on the pipe.",
    "recipes": [
      {
        "id": "recipe-smart-fluid-pipe-crafter-0",
        "name": "Mechanical Crafter - Smart Fluid Pipe",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          },
          {
            "itemId": "fluid-pipe",
            "itemName": "Fluid Pipe",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "smart-fluid-pipe",
            "itemName": "Smart Fluid Pipe",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "smart-observer",
    "name": "Smart Observer",
    "category": "Redstone & Displays",
    "icon": "/items/smart_observer.png",
    "description": "The Smart Observer is a machine that emits a redstone signal dependent on the block or items inside a container in front of it.",
    "recipes": [
      {
        "id": "recipe-smart-observer-crafter-0",
        "name": "Mechanical Crafter - Smart Observer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "observer",
            "itemName": "Observer",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "smart-observer",
            "itemName": "Smart Observer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "speedometer",
    "name": "Speedometer",
    "category": "Kinetics & Contraptions",
    "icon": "/items/speedometer.png",
    "description": "The Speedometer measures the speed of Rotational Force.",
    "recipes": [
      {
        "id": "recipe-speedometer-crafter-0",
        "name": "Mechanical Crafter - Speedometer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "stressometer",
            "itemName": "Stressometer",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "speedometer",
            "itemName": "Speedometer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-speedometer-crafting-wiki-1",
        "name": "Mechanical Crafter - Speedometer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          },
          {
            "itemId": "compass",
            "itemName": "Compass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "speedometer",
            "itemName": "Speedometer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "spout",
    "name": "Spout",
    "category": "Logistics & Fluids",
    "icon": "/items/spout.png",
    "description": "The Spout is a block used for filling liquid containers such as bottles or buckets, or crafting with liquids.",
    "recipes": [
      {
        "id": "recipe-spout-crafter-0",
        "name": "Mechanical Crafter - Spout",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-casing",
            "itemName": "Copper Casing",
            "amount": 1
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "spout",
            "itemName": "Spout",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-spout-spout-filling-wiki-1",
        "name": "Spout - Spout",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "copper-casing",
            "itemName": "Copper Casing",
            "amount": 1
          },
          {
            "itemId": "kelp",
            "itemName": "Kelp",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "spout",
            "itemName": "Spout",
            "amount": 1
          }
        ],
        "speedRpm": 0,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "steam-engine",
    "name": "Steam Engine",
    "category": "Trains & Rail",
    "icon": "/items/steam_engine.png",
    "description": "The Steam Engine is a block that provides Rotational Force. It outputs the highest Stress Unit (SU) capacity of all the survival-mode power-generating blocks. It converts the pressure caused by heating  in a Fluid Tank into Rotational Force, allowing for large scale item production and multiple contraptions to be powered.",
    "recipes": [
      {
        "id": "recipe-steam-engine-crafter-0",
        "name": "Mechanical Crafter - Steam Engine",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "copper-block",
            "itemName": "Copper Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "steam-engine",
            "itemName": "Steam Engine",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-steam-engine-crafting-wiki-1",
        "name": "Mechanical Crafter - Steam Engine",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "block-of-copper",
            "itemName": "Block of Copper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "steam-engine",
            "itemName": "Steam Engine",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "steam-whistle",
    "name": "Steam Whistle",
    "category": "Trains & Rail",
    "icon": "/items/steam_whistle.png",
    "description": "The Steam Whistle is a musical block activated by redstone.",
    "recipes": [
      {
        "id": "recipe-steam-whistle-crafter-0",
        "name": "Mechanical Crafter - Steam Whistle",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "steam-whistle",
            "itemName": "Steam Whistle",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sticker",
    "name": "Sticker",
    "category": "Kinetics & Contraptions",
    "icon": "/items/sticker.png",
    "description": "The Sticker is used to stick and unstick things to moving Contraptions.",
    "recipes": [
      {
        "id": "recipe-sticker-crafter-0",
        "name": "Mechanical Crafter - Sticker",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          },
          {
            "itemId": "slimeball",
            "itemName": "Slimeball",
            "amount": 1
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 2
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sticker",
            "itemName": "Sticker",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "stock-link",
    "name": "Stock Link",
    "category": "Logistics & Fluids",
    "icon": "/items/stock_link.png",
    "description": "A Stock Link exposes a storage system to a Logistics Network, transmitting an inventory list to each of the other devices on the same network. The stock link also receives requests to extract inventory and passes the list on to an attached Packager to execute.",
    "recipes": [
      {
        "id": "recipe-stock-link-crafter-0",
        "name": "Mechanical Crafter - Stock Link",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "transmitter",
            "itemName": "Transmitter",
            "amount": 1
          },
          {
            "itemId": "item-vault",
            "itemName": "Item Vault",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "stock-link",
            "itemName": "Stock Link",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "stock-ticker",
    "name": "Stock Ticker",
    "category": "Logistics & Fluids",
    "icon": "/items/stock_ticker.png",
    "description": "A Stock Ticker is used to request items from a Logistics Network.",
    "recipes": [
      {
        "id": "recipe-stock-ticker-crafter-0",
        "name": "Mechanical Crafter - Stock Ticker",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "glass",
            "itemName": "Glass",
            "amount": 1
          },
          {
            "itemId": "stock-link",
            "itemName": "Stock Link",
            "amount": 1
          },
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "stock-ticker",
            "itemName": "Stock Ticker",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-stock-ticker-crafting-wiki-1",
        "name": "Mechanical Crafter - Stock Ticker",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "glass",
            "itemName": "Glass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "stock-ticker",
            "itemName": "Stock Ticker",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "stressometer",
    "name": "Stressometer",
    "category": "Kinetics & Contraptions",
    "icon": "/items/stressometer.png",
    "description": "The Stressometer is used to measure the amount of Stress on a Shaft. This stress is the \"load\" of the system.",
    "recipes": [
      {
        "id": "recipe-stressometer-crafter-1",
        "name": "Mechanical Crafter - Stressometer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "speedometer",
            "itemName": "Speedometer",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "stressometer",
            "itemName": "Stressometer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "table-cloth",
    "name": "Table Cloth",
    "category": "Building & Decoration",
    "icon": "/items/red_table_cloth.png",
    "description": "Red Table Cloth.png|Red",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "threshold-switch",
    "name": "Threshold Switch",
    "category": "Redstone & Displays",
    "icon": "/items/threshold_switch.png",
    "description": "The Threshold Switch measures how full an inventory is and can emit a  signal at adjustable thresholds.",
    "recipes": [
      {
        "id": "recipe-threshold-switch-crafter-0",
        "name": "Mechanical Crafter - Threshold Switch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "redstone-comparator",
            "itemName": "Redstone Comparator",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "threshold-switch",
            "itemName": "Threshold Switch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-threshold-switch-crafting-wiki-1",
        "name": "Mechanical Crafter - Threshold Switch",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "comparator",
            "itemName": "Comparator",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "threshold-switch",
            "itemName": "Threshold Switch",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "tiled-glass",
    "name": "Tiled Glass",
    "category": "Building & Decoration",
    "icon": "/items/tiled_glass.png",
    "description": "Tiled Glass is a decorative variant of",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "toolbox",
    "name": "Toolbox",
    "category": "Logistics & Fluids",
    "icon": "/items/brown_toolbox_1.png",
    "description": "Brown Toolbox.png|Brown",
    "recipes": [
      {
        "id": "recipe-toolbox-crafting-wiki-2",
        "name": "Mechanical Crafter - Toolbox",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "chest",
            "itemName": "Chest",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "toolbox",
            "itemName": "Toolbox",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "train-controls",
    "name": "Train Controls",
    "category": "Trains & Rail",
    "icon": "/items/train_controls.png",
    "description": "Train Controls are required in the creation of Trains.",
    "recipes": [
      {
        "id": "recipe-train-controls-crafter-0",
        "name": "Mechanical Crafter - Train Controls",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "lever",
            "itemName": "Lever",
            "amount": 1
          },
          {
            "itemId": "train-casing",
            "itemName": "Train Casing",
            "amount": 1
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-controls",
            "itemName": "Train Controls",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-train-controls-crafting-wiki-1",
        "name": "Mechanical Crafter - Train Controls",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "lever",
            "itemName": "Lever",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-controls",
            "itemName": "Train Controls",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "train-observer",
    "name": "Train Observer",
    "category": "Trains & Rail",
    "icon": "/items/train_observer.png",
    "description": "The Train Observer is used to detect passing Trains.",
    "recipes": [
      {
        "id": "recipe-train-observer-crafter-0",
        "name": "Mechanical Crafter - Train Observer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "train-casing",
            "itemName": "Train Casing",
            "amount": 1
          },
          {
            "itemId": "wood-pressure-plate-stone-pressure-plate-polished-blackstone-pressure-plate-light-weighted-pressure-plate-heavy-weighted-pressure-plate",
            "itemName": "Wood Pressure Plate;Stone Pressure Plate;Polished Blackstone Pressure Plate;Light Weighted Pressure Plate;Heavy Weighted Pressure Plate",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-observer",
            "itemName": "Train Observer",
            "amount": 2
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-train-observer-crafting-wiki-1",
        "name": "Mechanical Crafter - Train Observer",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "train-casing",
            "itemName": "Train Casing",
            "amount": 1
          },
          {
            "itemId": "pressure-plate",
            "itemName": "Pressure Plate",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-observer",
            "itemName": "Train Observer",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "train-signal",
    "name": "Train Signal",
    "category": "Trains & Rail",
    "icon": "/items/train_signal.png",
    "description": "Train Signals are used to control the flow of Trains not driven by players.",
    "recipes": [
      {
        "id": "recipe-train-signal-crafter-0",
        "name": "Mechanical Crafter - Train Signal",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "train-casing",
            "itemName": "Train Casing",
            "amount": 1
          },
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-signal",
            "itemName": "Train Signal",
            "amount": 4
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "train-station",
    "name": "Train Station",
    "category": "Trains & Rail",
    "icon": "/items/train_station.png",
    "description": "Train Stations are used to create, disassemble, and guide Trains.",
    "recipes": [
      {
        "id": "recipe-train-station-crafter-0",
        "name": "Mechanical Crafter - Train Station",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "train-casing",
            "itemName": "Train Casing",
            "amount": 1
          },
          {
            "itemId": "compass",
            "itemName": "Compass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-station",
            "itemName": "Train Station",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "train-track",
    "name": "Train Track",
    "category": "Trains & Rail",
    "icon": "/items/track_block.png",
    "description": "Train Tracks are special blocks used to support Trains.",
    "recipes": [
      {
        "id": "recipe-sequenced-train-track",
        "name": "Sequenced Assembly - Train Track",
        "method": "Sequenced Assembly",
        "buildingRequired": "Deployer Loop",
        "processingTimeSeconds": 4,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "stone-slab",
            "itemName": "Stone Slab",
            "amount": 1
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "train-track",
            "itemName": "Train Track",
            "amount": 2
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-train-track-crafting-wiki-1",
        "name": "Mechanical Crafter - Train Track",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "stone-slab",
            "itemName": "Stone Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-track",
            "itemName": "Train Track",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "train-trapdoor",
    "name": "Train Trapdoor",
    "category": "Trains & Rail",
    "icon": "/items/train_trapdoor.png",
    "description": "A  resembling Train Casing.",
    "recipes": [
      {
        "id": "recipe-train-trapdoor-crafter-0",
        "name": "Mechanical Crafter - Train Trapdoor",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wood-trapdoor",
            "itemName": "Wood Trapdoor",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-trapdoor",
            "itemName": "Train Trapdoor",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-train-trapdoor-crafting-wiki-1",
        "name": "Mechanical Crafter - Train Trapdoor",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-trapdoor",
            "itemName": "Wooden Trapdoor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "train-trapdoor",
            "itemName": "Train Trapdoor",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "tuff",
    "name": "Tuff",
    "category": "Materials & Resources",
    "icon": "/items/tuff.png",
    "description": "Tuff Stairs (N).png|Stairs",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "turntable",
    "name": "Turntable",
    "category": "Kinetics & Contraptions",
    "icon": "/items/turntable.png",
    "description": "The Turntable is a block which can rotate .",
    "recipes": [
      {
        "id": "recipe-turntable-crafter-0",
        "name": "Mechanical Crafter - Turntable",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "turntable",
            "itemName": "Turntable",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-turntable-crafting-wiki-1",
        "name": "Mechanical Crafter - Turntable",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "turntable",
            "itemName": "Turntable",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "valve-handle",
    "name": "Valve Handle",
    "category": "Kinetics & Contraptions",
    "icon": "/items/copper_valve_handle.png",
    "description": "Copper Valve Handle.png|Copper",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "veridium",
    "name": "Veridium",
    "category": "Materials & Resources",
    "icon": "/items/veridium.png",
    "description": "Cut Veridium Slab.png|Cut Slab",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "water-wheel",
    "name": "Water Wheel",
    "category": "Kinetics & Contraptions",
    "icon": "/items/water_wheel.png",
    "description": "Water_Wheel.png|Spruce",
    "recipes": [
      {
        "id": "recipe-water-wheel-crafter-0",
        "name": "Mechanical Crafter - Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 8
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "water-wheel",
            "itemName": "Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-water-wheel-crafting-wiki-2",
        "name": "Mechanical Crafter - Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "water-wheel",
            "itemName": "Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-water-wheel-crafting-wiki-3",
        "name": "Mechanical Crafter - Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "water-wheel",
            "itemName": "Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-water-wheel-crafting-wiki-4",
        "name": "Mechanical Crafter - Water Wheel",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "oak-planks",
            "itemName": "Oak Planks",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "water-wheel",
            "itemName": "Water Wheel",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "weighted-ejector",
    "name": "Weighted Ejector",
    "category": "Logistics & Fluids",
    "icon": "/items/weighted_ejector.png",
    "description": "The Weighted Ejector flings items and entities to a targeted block up to 32 blocks away.",
    "recipes": [
      {
        "id": "recipe-weighted-ejector-crafter-0",
        "name": "Mechanical Crafter - Weighted Ejector",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "depot",
            "itemName": "Depot",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "weighted-ejector",
            "itemName": "Weighted Ejector",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "windmill-bearing",
    "name": "Windmill Bearing",
    "category": "Kinetics & Contraptions",
    "icon": "/items/windmill_bearing.png",
    "description": "The Windmill Bearing is a block used to create Windmills for power generation.",
    "recipes": [
      {
        "id": "recipe-windmill-bearing-crafter-0",
        "name": "Mechanical Crafter - Windmill Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "windmill-bearing",
            "itemName": "Windmill Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-windmill-bearing-crafting-wiki-1",
        "name": "Mechanical Crafter - Windmill Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "windmill-bearing",
            "itemName": "Windmill Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-windmill-bearing-crafting-wiki-2",
        "name": "Mechanical Crafter - Windmill Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "turntable",
            "itemName": "Turntable",
            "amount": 1
          },
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "windmill-bearing",
            "itemName": "Windmill Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "windmill-sail",
    "name": "Windmill Sail",
    "category": "Kinetics & Contraptions",
    "icon": "/items/white_sail_block.png",
    "description": "White_Sail Block.png|White Sail",
    "recipes": [
      {
        "id": "recipe-windmill-sail-crafting-wiki-3",
        "name": "Mechanical Crafter - Windmill Sail",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wool",
            "itemName": "Wool",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "windmill-sail",
            "itemName": "Windmill Sail",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-windmill-sail-crafting-wiki-4",
        "name": "Mechanical Crafter - Windmill Sail",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "windmill-sail-frame",
            "itemName": "Windmill Sail Frame",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "windmill-sail",
            "itemName": "Windmill Sail",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "window",
    "name": "Window",
    "category": "Building & Decoration",
    "icon": "/items/oak_window_1.png",
    "description": "Spruce_Window.png|Spruce",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "zinc-ore",
    "name": "Zinc Ore",
    "category": "Materials & Resources",
    "icon": "/items/zinc_ore.png",
    "description": "Deepslate Zinc Ore.png|Deepslate",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "brass-hand",
    "name": "Brass Hand",
    "category": "Components & Tools",
    "icon": "/items/brass_hand.png",
    "description": "The Brass Hand is an item that is only used in crafting recipes.",
    "recipes": [
      {
        "id": "recipe-brass-hand-crafter-0",
        "name": "Mechanical Crafter - Brass Hand",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 4
          }
        ],
        "outputs": [
          {
            "itemId": "brass-hand",
            "itemName": "Brass Hand",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-brass-hand-crafting-wiki-3",
        "name": "Mechanical Crafter - Brass Hand",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brass-hand",
            "itemName": "Brass Hand",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "electron-tube",
    "name": "Electron Tube",
    "category": "Components & Tools",
    "icon": "/items/electron_tube.png",
    "description": "The Electron Tube is an item that is only used in crafting recipes.",
    "recipes": [
      {
        "id": "recipe-electron-tube-crafter-0",
        "name": "Mechanical Crafter - Electron Tube",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "polished-rose-quartz",
            "itemName": "Polished Rose Quartz",
            "amount": 1
          },
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "electron-tube",
            "itemName": "Electron Tube",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "precision-mechanism",
    "name": "Precision Mechanism",
    "category": "Components & Tools",
    "icon": "/items/precision_mechanism.png",
    "description": "The Precision Mechanism is one of many Crafting Components.",
    "recipes": [
      {
        "id": "recipe-sequenced-precision-mechanism",
        "name": "Sequenced Assembly - Precision Mechanism",
        "method": "Sequenced Assembly",
        "buildingRequired": "Deployer Loop",
        "processingTimeSeconds": 6,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "large-cogwheel",
            "itemName": "Large Cogwheel",
            "amount": 1
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-precision-mechanism-crafting-wiki-1",
        "name": "Mechanical Crafter - Precision Mechanism",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "large-cogwheel",
            "itemName": "Large Cogwheel",
            "amount": 1
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sturdy-sheet",
    "name": "Sturdy Sheet",
    "category": "Components & Tools",
    "icon": "/items/sturdy_sheet_1.png",
    "description": "Sturdy Sheets are a crafting component.",
    "recipes": [
      {
        "id": "recipe-sequenced-sturdy-sheet-0",
        "name": "Sequenced Assembly (from Powdered Obsidian & Lava)",
        "method": "Sequenced Assembly",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 4,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "powdered-obsidian",
            "itemName": "Powdered Obsidian",
            "amount": 1
          },
          {
            "itemId": "lava-bucket",
            "itemName": "Lava Bucket",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sturdy-sheet",
            "itemName": "Sturdy Sheet",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-sturdy-sheet-crafting-wiki-2",
        "name": "Mechanical Crafter - Sturdy Sheet",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "powdered-obsidian",
            "itemName": "Powdered Obsidian",
            "amount": 1
          },
          {
            "itemId": "mb-of-lava",
            "itemName": "mB of Lava",
            "amount": 500
          }
        ],
        "outputs": [
          {
            "itemId": "sturdy-sheet",
            "itemName": "Sturdy Sheet",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "transmitter",
    "name": "Transmitter",
    "category": "Components & Tools",
    "icon": "/items/transmitter.png",
    "description": "The Transmitter is a crafting component used to craft link blocks.",
    "recipes": [
      {
        "id": "recipe-transmitter-crafter-0",
        "name": "Mechanical Crafter - Transmitter",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "lightning-rod",
            "itemName": "Lightning Rod",
            "amount": 1
          },
          {
            "itemId": "copper-sheet",
            "itemName": "Copper Sheet",
            "amount": 3
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "transmitter",
            "itemName": "Transmitter",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-transmitter-crafting-wiki-1",
        "name": "Mechanical Crafter - Transmitter",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "lightning-rod",
            "itemName": "Lightning Rod",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "transmitter",
            "itemName": "Transmitter",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "potato-cannon",
    "name": "Potato Cannon",
    "category": "Components & Tools",
    "icon": "/items/potato_cannon.png",
    "description": "The Potato Cannon is a projectile weapon that uses various food items as ammunition.",
    "recipes": [
      {
        "id": "recipe-potato-cannon-crafter-0",
        "name": "Mechanical Crafter - Potato Cannon",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          },
          {
            "itemId": "fluid-pipe",
            "itemName": "Fluid Pipe",
            "amount": 3
          },
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "potato-cannon",
            "itemName": "Potato Cannon",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-potato-cannon-crafting-wiki-1",
        "name": "Mechanical Crafter - Potato Cannon",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          },
          {
            "itemId": "fluid-pipe",
            "itemName": "Fluid Pipe",
            "amount": 1
          },
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "potato-cannon",
            "itemName": "Potato Cannon",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "magenta-dye",
    "name": "Magenta Dye",
    "category": "Building & Decoration",
    "icon": "/items/magenta_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-allium-0",
        "name": "Crushing Wheels (from Allium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "allium",
            "itemName": "Allium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 2
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 2,
            "chance": 10
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-lilac-57",
        "name": "Crushing Wheels (from Lilac)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lilac",
            "itemName": "Lilac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-peony-66",
        "name": "Crushing Wheels (from Peony)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "peony",
            "itemName": "Peony",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-allium-0",
        "name": "Millstone (from Allium)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "allium",
            "itemName": "Allium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 2
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 2,
            "chance": 10
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-lilac-24",
        "name": "Millstone (from Lilac)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "lilac",
            "itemName": "Lilac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-peony-28",
        "name": "Millstone (from Peony)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "peony",
            "itemName": "Peony",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "purple-dye",
    "name": "Purple Dye",
    "category": "Building & Decoration",
    "icon": "/items/purple_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-allium-0",
        "name": "Crushing Wheels (from Allium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "allium",
            "itemName": "Allium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 2
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 2,
            "chance": 10
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-lilac-57",
        "name": "Crushing Wheels (from Lilac)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lilac",
            "itemName": "Lilac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-allium-0",
        "name": "Millstone (from Allium)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "allium",
            "itemName": "Allium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 2
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 2,
            "chance": 10
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-lilac-24",
        "name": "Millstone (from Lilac)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "lilac",
            "itemName": "Lilac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "pink-dye",
    "name": "Pink Dye",
    "category": "Building & Decoration",
    "icon": "/items/pink_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-allium-0",
        "name": "Crushing Wheels (from Allium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "allium",
            "itemName": "Allium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 2
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 2,
            "chance": 10
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-peony-66",
        "name": "Crushing Wheels (from Peony)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "peony",
            "itemName": "Peony",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-pink-tulip-67",
        "name": "Crushing Wheels (from Pink Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "pink-tulip",
            "itemName": "Pink Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-allium-0",
        "name": "Millstone (from Allium)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "allium",
            "itemName": "Allium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 2
          },
          {
            "itemId": "purple-dye",
            "itemName": "Purple Dye",
            "amount": 2,
            "chance": 10
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-peony-28",
        "name": "Millstone (from Peony)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "peony",
            "itemName": "Peony",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 3
          },
          {
            "itemId": "magenta-dye",
            "itemName": "Magenta Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-pink-tulip-29",
        "name": "Millstone (from Pink Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "pink-tulip",
            "itemName": "Pink Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "amethyst-shard",
    "name": "Amethyst Shard",
    "category": "Materials & Resources",
    "icon": "/items/amethyst_shard_je2_be1.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-amethyst-cluster-1",
        "name": "Crushing Wheels (from Amethyst Cluster)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "amethyst-cluster",
            "itemName": "Amethyst Cluster",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "amethyst-shard",
            "itemName": "Amethyst Shard",
            "amount": 7
          },
          {
            "itemId": "amethyst-shard",
            "itemName": "Amethyst Shard",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-block-of-amethyst-7",
        "name": "Crushing Wheels (from Block of Amethyst)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-amethyst",
            "itemName": "Block of Amethyst",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "amethyst-shard",
            "itemName": "Amethyst Shard",
            "amount": 3
          },
          {
            "itemId": "amethyst-shard",
            "itemName": "Amethyst Shard",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cobblestone",
    "name": "Cobblestone",
    "category": "Materials & Resources",
    "icon": "/items/cobblestone_je5_be3.png",
    "description": "Produced by Create automation machines (Mechanical Drill generator, Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-mechanical-drill-cobblestone-gen",
        "name": "Mechanical Drill (Cobblestone Generator)",
        "method": "Drilling",
        "buildingRequired": "Mechanical Drill",
        "processingTimeSeconds": 0.67,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "water",
            "itemName": "Water",
            "amount": 1
          },
          {
            "itemId": "lava",
            "itemName": "Lava",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-andesite-2",
        "name": "Crushing Wheels (from Andesite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-coal-ore-20",
        "name": "Crushing Wheels (from Coal Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "coal-ore",
            "itemName": "Coal Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          },
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-copper-ore-23",
        "name": "Crushing Wheels (from Copper Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "copper-ore",
            "itemName": "Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 5
          },
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-diamond-ore-41",
        "name": "Crushing Wheels (from Diamond Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diamond-ore",
            "itemName": "Diamond Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-emerald-ore-44",
        "name": "Crushing Wheels (from Emerald Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "emerald-ore",
            "itemName": "Emerald Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1
          },
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-gold-ore-47",
        "name": "Crushing Wheels (from Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gold-ore",
            "itemName": "Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-iron-ore-53",
        "name": "Crushing Wheels (from Iron Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "iron-ore",
            "itemName": "Iron Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-lapis-lazuli-ore-55",
        "name": "Crushing Wheels (from Lapis Lazuli Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli-ore",
            "itemName": "Lapis Lazuli Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 10
          },
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-redstone-ore-75",
        "name": "Crushing Wheels (from Redstone Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "redstone-ore",
            "itemName": "Redstone Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 6
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-zinc-ore-90",
        "name": "Crushing Wheels (from Zinc Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "zinc-ore",
            "itemName": "Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-andesite-1",
        "name": "Millstone (from Andesite)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "crushed-zinc-ore",
    "name": "Crushed Zinc Ore",
    "category": "Materials & Resources",
    "icon": "/items/crushed_zinc_ore.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-asurine-3",
        "name": "Crushing Wheels (from Asurine)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "asurine",
            "itemName": "Asurine",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 30
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 30
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-block-of-raw-zinc-10",
        "name": "Crushing Wheels (from Block of Raw Zinc)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-raw-zinc",
            "itemName": "Block of Raw Zinc",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 9
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-zinc-ore-33",
        "name": "Crushing Wheels (from Deepslate Zinc Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-zinc-ore",
            "itemName": "Deepslate Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 2
          },
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-asurine-34",
        "name": "Crushing Wheels (from Cut Asurine)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-asurine",
            "itemName": "Cut Asurine",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 30
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 30
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-zinc-73",
        "name": "Crushing Wheels (from Raw Zinc)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-zinc",
            "itemName": "Raw Zinc",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-zinc-ore-90",
        "name": "Crushing Wheels (from Zinc Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "zinc-ore",
            "itemName": "Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "zinc-nugget",
    "name": "Zinc Nugget",
    "category": "Materials & Resources",
    "icon": "/items/zinc_nugget.png",
    "description": "Produced by Create automation machines (Crushing, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-crushing-asurine-3",
        "name": "Crushing Wheels (from Asurine)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "asurine",
            "itemName": "Asurine",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 30
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 30
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-asurine-34",
        "name": "Crushing Wheels (from Cut Asurine)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-asurine",
            "itemName": "Cut Asurine",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 30
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 30
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-tuff-38",
        "name": "Crushing Wheels (from Cut Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-tuff",
            "itemName": "Cut Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-tuff-84",
        "name": "Crushing Wheels (from Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "tuff",
            "itemName": "Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-crushed-zinc-ore-4",
        "name": "Bulk Washing (from Crushed Zinc Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 9
          },
          {
            "itemId": "gunpowder",
            "itemName": "Gunpowder",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-zinc-nugget-crafting-wiki-5",
        "name": "Mechanical Crafter - Zinc Nugget",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "zinc-ingot",
            "itemName": "Zinc Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "light-gray-dye",
    "name": "Light Gray Dye",
    "category": "Building & Decoration",
    "icon": "/items/light_gray_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-azure-bluet-4",
        "name": "Crushing Wheels (from Azure Bluet)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "azure-bluet",
            "itemName": "Azure Bluet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-blue-orchid-11",
        "name": "Crushing Wheels (from Blue Orchid)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "blue-orchid",
            "itemName": "Blue Orchid",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-blue-dye",
            "itemName": "Light Blue Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-bone-meal-13",
        "name": "Crushing Wheels (from Bone Meal)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.3,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-oxeye-daisy-65",
        "name": "Crushing Wheels (from Oxeye Daisy)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "oxeye-daisy",
            "itemName": "Oxeye Daisy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-azure-bluet-2",
        "name": "Millstone (from Azure Bluet)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "azure-bluet",
            "itemName": "Azure Bluet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-blue-orchid-4",
        "name": "Millstone (from Blue Orchid)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "blue-orchid",
            "itemName": "Blue Orchid",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-blue-dye",
            "itemName": "Light Blue Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-bone-meal-6",
        "name": "Millstone (from Bone Meal)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-oxeye-daisy-27",
        "name": "Millstone (from Oxeye Daisy)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "oxeye-daisy",
            "itemName": "Oxeye Daisy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "white-dye",
    "name": "White Dye",
    "category": "Building & Decoration",
    "icon": "/items/white_dye_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-azure-bluet-4",
        "name": "Crushing Wheels (from Azure Bluet)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "azure-bluet",
            "itemName": "Azure Bluet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-bone-12",
        "name": "Crushing Wheels (from Bone)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "bone",
            "itemName": "Bone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-bone-meal-13",
        "name": "Crushing Wheels (from Bone Meal)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.3,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-lily-of-the-valley-58",
        "name": "Crushing Wheels (from Lily of the Valley)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lily-of-the-valley",
            "itemName": "Lily of the Valley",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-oxeye-daisy-65",
        "name": "Crushing Wheels (from Oxeye Daisy)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "oxeye-daisy",
            "itemName": "Oxeye Daisy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-white-tulip-87",
        "name": "Crushing Wheels (from White Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "white-tulip",
            "itemName": "White Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-azure-bluet-2",
        "name": "Millstone (from Azure Bluet)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "azure-bluet",
            "itemName": "Azure Bluet",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-bone-5",
        "name": "Millstone (from Bone)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "bone",
            "itemName": "Bone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-bone-meal-6",
        "name": "Millstone (from Bone Meal)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-lily-of-the-valley-25",
        "name": "Millstone (from Lily of the Valley)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "lily-of-the-valley",
            "itemName": "Lily of the Valley",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-oxeye-daisy-27",
        "name": "Millstone (from Oxeye Daisy)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "oxeye-daisy",
            "itemName": "Oxeye Daisy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-white-tulip-41",
        "name": "Millstone (from White Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "white-tulip",
            "itemName": "White Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "red-dye",
    "name": "Red Dye",
    "category": "Building & Decoration",
    "icon": "/items/red_dye_je4_be4.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-beetroot-5",
        "name": "Crushing Wheels (from Beetroot)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.3,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "beetroot",
            "itemName": "Beetroot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "beetroot-seeds",
            "itemName": "Beetroot Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-poppy-68",
        "name": "Crushing Wheels (from Poppy)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "poppy",
            "itemName": "Poppy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-red-tulip-74",
        "name": "Crushing Wheels (from Red Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "red-tulip",
            "itemName": "Red Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-rose-bush-76",
        "name": "Crushing Wheels (from Rose Bush)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "rose-bush",
            "itemName": "Rose Bush",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 3
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          },
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-beetroot-3",
        "name": "Millstone (from Beetroot)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "beetroot",
            "itemName": "Beetroot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "beetroot-seeds",
            "itemName": "Beetroot Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-poppy-30",
        "name": "Millstone (from Poppy)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "poppy",
            "itemName": "Poppy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-red-tulip-31",
        "name": "Millstone (from Red Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "red-tulip",
            "itemName": "Red Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-rose-bush-32",
        "name": "Millstone (from Rose Bush)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "rose-bush",
            "itemName": "Rose Bush",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 3
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          },
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "beetroot-seeds",
    "name": "Beetroot Seeds",
    "category": "Food & Farming",
    "icon": "/items/beetroot_seeds_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-beetroot-5",
        "name": "Crushing Wheels (from Beetroot)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.3,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "beetroot",
            "itemName": "Beetroot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "beetroot-seeds",
            "itemName": "Beetroot Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-beetroot-3",
        "name": "Millstone (from Beetroot)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "beetroot",
            "itemName": "Beetroot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "beetroot-seeds",
            "itemName": "Beetroot Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "blaze-powder",
    "name": "Blaze Powder",
    "category": "Materials & Resources",
    "icon": "/items/blaze_powder_je2_be1.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-blaze-rod-6",
        "name": "Crushing Wheels (from Blaze Rod)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "blaze-rod",
            "itemName": "Blaze Rod",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blaze-powder",
            "itemName": "Blaze Powder",
            "amount": 3
          },
          {
            "itemId": "blaze-powder",
            "itemName": "Blaze Powder",
            "amount": 3,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "crushed-copper-ore",
    "name": "Crushed Copper Ore",
    "category": "Materials & Resources",
    "icon": "/items/crushed_copper_ore.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-block-of-raw-copper-8",
        "name": "Crushing Wheels (from Block of Raw Copper)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-raw-copper",
            "itemName": "Block of Raw Copper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 9
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-copper-ore-23",
        "name": "Crushing Wheels (from Copper Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "copper-ore",
            "itemName": "Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 5
          },
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-copper-ore-27",
        "name": "Crushing Wheels (from Deepslate Copper Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-copper-ore",
            "itemName": "Deepslate Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 7
          },
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-veridium-39",
        "name": "Crushing Wheels (from Cut Veridium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-veridium",
            "itemName": "Cut Veridium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 80
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 80
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-copper-70",
        "name": "Crushing Wheels (from Raw Copper)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-copper",
            "itemName": "Raw Copper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-veridium-85",
        "name": "Crushing Wheels (from Veridium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "veridium",
            "itemName": "Veridium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 80
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 80
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "nugget-of-experience",
    "name": "Nugget of Experience",
    "category": "Materials & Resources",
    "icon": "/items/nugget_of_experience.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-block-of-raw-copper-8",
        "name": "Crushing Wheels (from Block of Raw Copper)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-raw-copper",
            "itemName": "Block of Raw Copper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 9
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-block-of-raw-gold-9",
        "name": "Crushing Wheels (from Block of Raw Gold)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-raw-gold",
            "itemName": "Block of Raw Gold",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 9
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-block-of-raw-zinc-10",
        "name": "Crushing Wheels (from Block of Raw Zinc)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-raw-zinc",
            "itemName": "Block of Raw Zinc",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 9
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-coal-ore-20",
        "name": "Crushing Wheels (from Coal Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "coal-ore",
            "itemName": "Coal Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          },
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-copper-ore-23",
        "name": "Crushing Wheels (from Copper Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "copper-ore",
            "itemName": "Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 5
          },
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-coal-ore-26",
        "name": "Crushing Wheels (from Deepslate Coal Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-coal-ore",
            "itemName": "Deepslate Coal Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          },
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-copper-ore-27",
        "name": "Crushing Wheels (from Deepslate Copper Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-copper-ore",
            "itemName": "Deepslate Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 7
          },
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-diamond-ore-28",
        "name": "Crushing Wheels (from Deepslate Diamond Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.15,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-diamond-ore",
            "itemName": "Deepslate Diamond Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 2
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-emerald-ore-29",
        "name": "Crushing Wheels (from Deepslate Emerald Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.15,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-emerald-ore",
            "itemName": "Deepslate Emerald Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 2
          },
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-gold-ore-30",
        "name": "Crushing Wheels (from Deepslate Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-gold-ore",
            "itemName": "Deepslate Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 2
          },
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-lapis-lazuli-ore-31",
        "name": "Crushing Wheels (from Lapis Lazuli Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli-ore",
            "itemName": "Lapis Lazuli Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 12
          },
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "deepslate",
            "itemName": "Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-redstone-ore-32",
        "name": "Crushing Wheels (from Deepslate Redstone Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-redstone-ore",
            "itemName": "Deepslate Redstone Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 7
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-zinc-ore-33",
        "name": "Crushing Wheels (from Deepslate Zinc Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-zinc-ore",
            "itemName": "Deepslate Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 2
          },
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-diamond-ore-41",
        "name": "Crushing Wheels (from Diamond Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diamond-ore",
            "itemName": "Diamond Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-emerald-ore-44",
        "name": "Crushing Wheels (from Emerald Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "emerald-ore",
            "itemName": "Emerald Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1
          },
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-gold-ore-47",
        "name": "Crushing Wheels (from Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gold-ore",
            "itemName": "Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-iron-ore-53",
        "name": "Crushing Wheels (from Iron Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "iron-ore",
            "itemName": "Iron Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-nether-gold-ore-60",
        "name": "Crushing Wheels (from Nether Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "nether-gold-ore",
            "itemName": "Nether Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 18
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "netherrack",
            "itemName": "Netherrack",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-copper-70",
        "name": "Crushing Wheels (from Raw Copper)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-copper",
            "itemName": "Raw Copper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-gold-71",
        "name": "Crushing Wheels (from Raw Gold)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-gold",
            "itemName": "Raw Gold",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-iron-72",
        "name": "Crushing Wheels (from Raw Iron)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-iron",
            "itemName": "Raw Iron",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-zinc-73",
        "name": "Crushing Wheels (from Raw Zinc)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-zinc",
            "itemName": "Raw Zinc",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-redstone-ore-75",
        "name": "Crushing Wheels (from Redstone Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "redstone-ore",
            "itemName": "Redstone Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 6
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-zinc-ore-90",
        "name": "Crushing Wheels (from Zinc Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "zinc-ore",
            "itemName": "Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-nugget-of-experience-crafting-wiki-25",
        "name": "Mechanical Crafter - Nugget of Experience",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-experience",
            "itemName": "Block of Experience",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "crushed-gold-ore",
    "name": "Crushed Gold Ore",
    "category": "Materials & Resources",
    "icon": "/items/crushed_gold_ore.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-block-of-raw-gold-9",
        "name": "Crushing Wheels (from Block of Raw Gold)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "block-of-raw-gold",
            "itemName": "Block of Raw Gold",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 9
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 9,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-gold-ore-30",
        "name": "Crushing Wheels (from Deepslate Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-gold-ore",
            "itemName": "Deepslate Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 2
          },
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-ochrum-37",
        "name": "Crushing Wheels (from Cut Ochrum)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-ochrum",
            "itemName": "Cut Ochrum",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 20
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-gold-ore-47",
        "name": "Crushing Wheels (from Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gold-ore",
            "itemName": "Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-ochrum-63",
        "name": "Crushing Wheels (from Ochrum)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "ochrum",
            "itemName": "Ochrum",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 20
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-gold-71",
        "name": "Crushing Wheels (from Raw Gold)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-gold",
            "itemName": "Raw Gold",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "light-blue-dye",
    "name": "Light Blue Dye",
    "category": "Building & Decoration",
    "icon": "/items/light_blue_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-blue-orchid-11",
        "name": "Crushing Wheels (from Blue Orchid)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "blue-orchid",
            "itemName": "Blue Orchid",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-blue-dye",
            "itemName": "Light Blue Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-blue-orchid-4",
        "name": "Millstone (from Blue Orchid)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "blue-orchid",
            "itemName": "Blue Orchid",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-blue-dye",
            "itemName": "Light Blue Dye",
            "amount": 2
          },
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "bone-meal",
    "name": "Bone Meal",
    "category": "Materials & Resources",
    "icon": "/items/bone_meal_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-bone-12",
        "name": "Crushing Wheels (from Bone)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "bone",
            "itemName": "Bone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-calcite-15",
        "name": "Crushing Wheels (from Calcite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "calcite",
            "itemName": "Calcite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-bone-5",
        "name": "Millstone (from Bone)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "bone",
            "itemName": "Bone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 3,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-calcite-8",
        "name": "Millstone (from Calcite)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "calcite",
            "itemName": "Calcite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bone-meal",
            "itemName": "Bone Meal",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "green-dye",
    "name": "Green Dye",
    "category": "Building & Decoration",
    "icon": "/items/green_dye_je4_be4.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-cactus-14",
        "name": "Crushing Wheels (from Cactus)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cactus",
            "itemName": "Cactus",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-fern-45",
        "name": "Crushing Wheels (from Fern)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "fern",
            "itemName": "Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-large-fern-56",
        "name": "Crushing Wheels (from Large Fern)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "large-fern",
            "itemName": "Large Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-poppy-68",
        "name": "Crushing Wheels (from Poppy)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "poppy",
            "itemName": "Poppy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-rose-bush-76",
        "name": "Crushing Wheels (from Rose Bush)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "rose-bush",
            "itemName": "Rose Bush",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 3
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          },
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-sea-pickle-79",
        "name": "Crushing Wheels (from Sea Pickle)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sea-pickle",
            "itemName": "Sea Pickle",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-cactus-7",
        "name": "Millstone (from Cactus)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "cactus",
            "itemName": "Cactus",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-fern-17",
        "name": "Millstone (from Fern)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "fern",
            "itemName": "Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-large-fern-23",
        "name": "Millstone (from Large Fern)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "large-fern",
            "itemName": "Large Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-poppy-30",
        "name": "Millstone (from Poppy)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "poppy",
            "itemName": "Poppy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-rose-bush-32",
        "name": "Millstone (from Rose Bush)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "rose-bush",
            "itemName": "Rose Bush",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 3
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 5
          },
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-sea-pickle-35",
        "name": "Millstone (from Sea Pickle)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "sea-pickle",
            "itemName": "Sea Pickle",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "black-dye",
    "name": "Black Dye",
    "category": "Building & Decoration",
    "icon": "/items/black_dye_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-charcoal-16",
        "name": "Crushing Wheels (from Charcoal)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "charcoal",
            "itemName": "Charcoal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-coal-19",
        "name": "Crushing Wheels (from Coal)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-ink-sac-52",
        "name": "Crushing Wheels (from Ink Sac)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "ink-sac",
            "itemName": "Ink Sac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 2
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-wither-rose-88",
        "name": "Crushing Wheels (from Wither Rose)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "wither-rose",
            "itemName": "Wither Rose",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 2
          },
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-charcoal-9",
        "name": "Millstone (from Charcoal)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "charcoal",
            "itemName": "Charcoal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-coal-11",
        "name": "Millstone (from Coal)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-ink-sac-21",
        "name": "Millstone (from Ink Sac)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "ink-sac",
            "itemName": "Ink Sac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 2
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-wither-rose-42",
        "name": "Millstone (from Wither Rose)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "wither-rose",
            "itemName": "Wither Rose",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 2
          },
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "gray-dye",
    "name": "Gray Dye",
    "category": "Building & Decoration",
    "icon": "/items/gray_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-charcoal-16",
        "name": "Crushing Wheels (from Charcoal)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "charcoal",
            "itemName": "Charcoal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-coal-19",
        "name": "Crushing Wheels (from Coal)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-ink-sac-52",
        "name": "Crushing Wheels (from Ink Sac)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "ink-sac",
            "itemName": "Ink Sac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 2
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-charcoal-9",
        "name": "Millstone (from Charcoal)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "charcoal",
            "itemName": "Charcoal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-coal-11",
        "name": "Millstone (from Coal)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 1
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-ink-sac-21",
        "name": "Millstone (from Ink Sac)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "ink-sac",
            "itemName": "Ink Sac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "black-dye",
            "itemName": "Black Dye",
            "amount": 2
          },
          {
            "itemId": "gray-dye",
            "itemName": "Gray Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "clay-ball",
    "name": "Clay Ball",
    "category": "Materials & Resources",
    "icon": "/items/clay_ball_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-crushing-clay-17",
        "name": "Crushing Wheels (from Clay)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "clay",
            "itemName": "Clay",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 3
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-dripstone-block-43",
        "name": "Crushing Wheels (from Dripstone Block)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "dripstone-block",
            "itemName": "Dripstone Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-gravel-51",
        "name": "Crushing Wheels (from Gravel)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          },
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-clay-10",
        "name": "Millstone (from Clay)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "clay",
            "itemName": "Clay",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 3
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-dripstone-block-16",
        "name": "Millstone (from Dripstone Block)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "dripstone-block",
            "itemName": "Dripstone Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-crushed-copper-ore-2",
        "name": "Bulk Washing (from Crushed Copper Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 9
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-sand-11",
        "name": "Bulk Washing (from Sand)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "crushed-iron-ore",
    "name": "Crushed Iron Ore",
    "category": "Materials & Resources",
    "icon": "/items/crushed_iron_ore.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-crimsite-18",
        "name": "Crushing Wheels (from Crimsite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crimsite",
            "itemName": "Crimsite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 40
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 40
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-crimsite-35",
        "name": "Crushing Wheels (from Cut Crimsite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-crimsite",
            "itemName": "Cut Crimsite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 40
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 40
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-iron-ore-53",
        "name": "Crushing Wheels (from Iron Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "iron-ore",
            "itemName": "Iron Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          },
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-raw-iron-72",
        "name": "Crushing Wheels (from Raw Iron)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "raw-iron",
            "itemName": "Raw Iron",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "iron-nugget",
    "name": "Iron Nugget",
    "category": "Materials & Resources",
    "icon": "/items/iron_nugget_je1_be1.png",
    "description": "Produced by Create automation machines (Crushing, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-crushing-crimsite-18",
        "name": "Crushing Wheels (from Crimsite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crimsite",
            "itemName": "Crimsite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 40
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 40
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-crimsite-35",
        "name": "Crushing Wheels (from Cut Crimsite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-crimsite",
            "itemName": "Cut Crimsite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1,
            "chance": 40
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 40
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-tuff-38",
        "name": "Crushing Wheels (from Cut Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-tuff",
            "itemName": "Cut Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-tuff-84",
        "name": "Crushing Wheels (from Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "tuff",
            "itemName": "Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-crushed-iron-ore-1",
        "name": "Bulk Washing (from Crushed Iron Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 9
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-gravel-7",
        "name": "Bulk Washing (from Gravel)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 12.5
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "coal",
    "name": "Coal",
    "category": "Materials & Resources",
    "icon": "/items/coal_je4_be3.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-coal-ore-20",
        "name": "Crushing Wheels (from Coal Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "coal-ore",
            "itemName": "Coal Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          },
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-coal-ore-26",
        "name": "Crushing Wheels (from Deepslate Coal Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-coal-ore",
            "itemName": "Deepslate Coal Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          },
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "gravel",
    "name": "Gravel",
    "category": "Materials & Resources",
    "icon": "/items/gravel_je5_be4.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-cobblestone-21",
        "name": "Crushing Wheels (from Cobblestone)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-cobblestone-12",
        "name": "Millstone (from Cobblestone)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "brown-dye",
    "name": "Brown Dye",
    "category": "Building & Decoration",
    "icon": "/items/brown_dye_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-cocoa-beans-22",
        "name": "Crushing Wheels (from Cocoa Beans)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.3,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cocoa-beans",
            "itemName": "Cocoa Beans",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brown-dye",
            "itemName": "Brown Dye",
            "amount": 2
          },
          {
            "itemId": "brown-dye",
            "itemName": "Brown Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-cocoa-beans-13",
        "name": "Millstone (from Cocoa Beans)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "cocoa-beans",
            "itemName": "Cocoa Beans",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brown-dye",
            "itemName": "Brown Dye",
            "amount": 2
          },
          {
            "itemId": "brown-dye",
            "itemName": "Brown Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "blue-dye",
    "name": "Blue Dye",
    "category": "Building & Decoration",
    "icon": "/items/blue_dye_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-cornflower-24",
        "name": "Crushing Wheels (from Cornflower)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cornflower",
            "itemName": "Cornflower",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blue-dye",
            "itemName": "Blue Dye",
            "amount": 2
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-lapis-lazuli-54",
        "name": "Crushing Wheels (from Lapis Lazuli)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blue-dye",
            "itemName": "Blue Dye",
            "amount": 2
          },
          {
            "itemId": "blue-dye",
            "itemName": "Blue Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-cornflower-14",
        "name": "Millstone (from Cornflower)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "cornflower",
            "itemName": "Cornflower",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blue-dye",
            "itemName": "Blue Dye",
            "amount": 2
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-lapis-lazuli-22",
        "name": "Millstone (from Lapis Lazuli)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blue-dye",
            "itemName": "Blue Dye",
            "amount": 2
          },
          {
            "itemId": "blue-dye",
            "itemName": "Blue Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "yellow-dye",
    "name": "Yellow Dye",
    "category": "Building & Decoration",
    "icon": "/items/yellow_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-dandelion-25",
        "name": "Crushing Wheels (from Dandelion)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "dandelion",
            "itemName": "Dandelion",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 2
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-oxeye-daisy-65",
        "name": "Crushing Wheels (from Oxeye Daisy)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "oxeye-daisy",
            "itemName": "Oxeye Daisy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-sunflower-81",
        "name": "Crushing Wheels (from Sunflower)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sunflower",
            "itemName": "Sunflower",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 3
          },
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-dandelion-15",
        "name": "Millstone (from Dandelion)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "dandelion",
            "itemName": "Dandelion",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 2
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-oxeye-daisy-27",
        "name": "Millstone (from Oxeye Daisy)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "oxeye-daisy",
            "itemName": "Oxeye Daisy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "light-gray-dye",
            "itemName": "Light Gray Dye",
            "amount": 2
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-sunflower-37",
        "name": "Millstone (from Sunflower)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "sunflower",
            "itemName": "Sunflower",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 3
          },
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cobbled-deepslate",
    "name": "Cobbled Deepslate",
    "category": "Materials & Resources",
    "icon": "/items/cobbled_deepslate.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-deepslate-coal-ore-26",
        "name": "Crushing Wheels (from Deepslate Coal Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-coal-ore",
            "itemName": "Deepslate Coal Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1
          },
          {
            "itemId": "coal",
            "itemName": "Coal",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-copper-ore-27",
        "name": "Crushing Wheels (from Deepslate Copper Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-copper-ore",
            "itemName": "Deepslate Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 7
          },
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-diamond-ore-28",
        "name": "Crushing Wheels (from Deepslate Diamond Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.15,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-diamond-ore",
            "itemName": "Deepslate Diamond Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 2
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-emerald-ore-29",
        "name": "Crushing Wheels (from Deepslate Emerald Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.15,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-emerald-ore",
            "itemName": "Deepslate Emerald Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 2
          },
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-gold-ore-30",
        "name": "Crushing Wheels (from Deepslate Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-gold-ore",
            "itemName": "Deepslate Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 2
          },
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-redstone-ore-32",
        "name": "Crushing Wheels (from Deepslate Redstone Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-redstone-ore",
            "itemName": "Deepslate Redstone Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 7
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-deepslate-zinc-ore-33",
        "name": "Crushing Wheels (from Deepslate Zinc Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-zinc-ore",
            "itemName": "Deepslate Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 2
          },
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "diamond",
    "name": "Diamond",
    "category": "Materials & Resources",
    "icon": "/items/diamond_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-deepslate-diamond-ore-28",
        "name": "Crushing Wheels (from Deepslate Diamond Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.15,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-diamond-ore",
            "itemName": "Deepslate Diamond Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 2
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-diamond-ore-41",
        "name": "Crushing Wheels (from Diamond Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diamond-ore",
            "itemName": "Diamond Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-diamond-horse-armor-40",
        "name": "Crushing Wheels (from Diamond Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diamond-horse-armor",
            "itemName": "Diamond Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 3,
            "chance": 10
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "emerald",
    "name": "Emerald",
    "category": "Materials & Resources",
    "icon": "/items/emerald_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-deepslate-emerald-ore-29",
        "name": "Crushing Wheels (from Deepslate Emerald Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.15,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-emerald-ore",
            "itemName": "Deepslate Emerald Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 2
          },
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-emerald-ore-44",
        "name": "Crushing Wheels (from Emerald Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "emerald-ore",
            "itemName": "Emerald Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1
          },
          {
            "itemId": "emerald",
            "itemName": "Emerald",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "lapis-lazuli",
    "name": "Lapis Lazuli",
    "category": "Materials & Resources",
    "icon": "/items/lapis_lazuli_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-lapis-lazuli-ore-31",
        "name": "Crushing Wheels (from Lapis Lazuli Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli-ore",
            "itemName": "Lapis Lazuli Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 12
          },
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "deepslate",
            "itemName": "Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "redstone-dust",
    "name": "Redstone Dust",
    "category": "Redstone & Displays",
    "icon": "/items/redstone_dust_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Bulk Washing, Spout Filling).",
    "recipes": [
      {
        "id": "recipe-crushing-deepslate-redstone-ore-32",
        "name": "Crushing Wheels (from Deepslate Redstone Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "deepslate-redstone-ore",
            "itemName": "Deepslate Redstone Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 7
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobbled-deepslate",
            "itemName": "Cobbled Deepslate",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-redstone-ore-75",
        "name": "Crushing Wheels (from Redstone Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "redstone-ore",
            "itemName": "Redstone Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 6
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-crushed-iron-ore-1",
        "name": "Bulk Washing (from Crushed Iron Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-iron-ore",
            "itemName": "Crushed Iron Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 9
          },
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1,
            "chance": 75
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-spout-redstone-dust-3",
        "name": "Spout (Filling) - Redstone Dust",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1
          },
          {
            "itemId": "25mb-of-potion-of-strength",
            "itemName": "25mB of Potion of Strength",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "redstone-dust",
            "itemName": "Redstone Dust",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "nether-quartz",
    "name": "Nether Quartz",
    "category": "Materials & Resources",
    "icon": "/items/nether_quartz_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-crushing-cut-diorite-36",
        "name": "Crushing Wheels (from Cut Diorite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-diorite",
            "itemName": "Cut Diorite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-diorite-42",
        "name": "Crushing Wheels (from Diorite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diorite",
            "itemName": "Diorite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-prismarine-crystals-69",
        "name": "Crushing Wheels (from Prismarine Crystals)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "prismarine-crystals",
            "itemName": "Prismarine Crystals",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 1
          },
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "glowstone-dust",
            "itemName": "Glowstone Dust",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-crushed-gold-ore-3",
        "name": "Bulk Washing (from Crushed Gold Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 9
          },
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-soul-sand-12",
        "name": "Bulk Washing (from Soul Sand)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "soul-sand",
            "itemName": "Soul Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 4,
            "chance": 12.5
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 2
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "gold-nugget",
    "name": "Gold Nugget",
    "category": "Materials & Resources",
    "icon": "/items/gold_nugget_je3_be2.png",
    "description": "Produced by Create automation machines (Crushing, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-crushed-gold-ore-3",
        "name": "Bulk Washing (from Crushed Gold Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 9
          },
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-red-sand-10",
        "name": "Bulk Washing (from Red Sand)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 3,
            "chance": 12.5
          },
          {
            "itemId": "dead-bush",
            "itemName": "Dead Bush",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-ochrum-37",
        "name": "Crushing Wheels (from Cut Ochrum)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-ochrum",
            "itemName": "Cut Ochrum",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 20
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-tuff-38",
        "name": "Crushing Wheels (from Cut Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-tuff",
            "itemName": "Cut Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-nether-gold-ore-60",
        "name": "Crushing Wheels (from Nether Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "nether-gold-ore",
            "itemName": "Nether Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 18
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "netherrack",
            "itemName": "Netherrack",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-ochrum-63",
        "name": "Crushing Wheels (from Ochrum)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "ochrum",
            "itemName": "Ochrum",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-gold-ore",
            "itemName": "Crushed Gold Ore",
            "amount": 1,
            "chance": 20
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 20
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-tuff-84",
        "name": "Crushing Wheels (from Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "tuff",
            "itemName": "Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-soul-sand-12",
        "name": "Bulk Washing (from Soul Sand)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "soul-sand",
            "itemName": "Soul Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 4,
            "chance": 12.5
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 2
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-golden-horse-armor-48",
        "name": "Crushing Wheels (from Golden Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "golden-horse-armor",
            "itemName": "Golden Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 8,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "flint",
    "name": "Flint",
    "category": "Materials & Resources",
    "icon": "/items/flint_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-crushing-cut-tuff-38",
        "name": "Crushing Wheels (from Cut Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-tuff",
            "itemName": "Cut Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-gravel-51",
        "name": "Crushing Wheels (from Gravel)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          },
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-tuff-84",
        "name": "Crushing Wheels (from Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "tuff",
            "itemName": "Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-gravel-20",
        "name": "Millstone (from Gravel)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-gravel-7",
        "name": "Bulk Washing (from Gravel)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 12.5
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "copper-nugget",
    "name": "Copper Nugget",
    "category": "Materials & Resources",
    "icon": "/items/copper_nugget_je1_be1.png",
    "description": "Produced by Create automation machines (Crushing, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-crushing-cut-tuff-38",
        "name": "Crushing Wheels (from Cut Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-tuff",
            "itemName": "Cut Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-cut-veridium-39",
        "name": "Crushing Wheels (from Cut Veridium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cut-veridium",
            "itemName": "Cut Veridium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 80
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 80
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-tuff-84",
        "name": "Crushing Wheels (from Tuff)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "tuff",
            "itemName": "Tuff",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-veridium-85",
        "name": "Crushing Wheels (from Veridium)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "veridium",
            "itemName": "Veridium",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1,
            "chance": 80
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1,
            "chance": 80
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-crushed-copper-ore-2",
        "name": "Bulk Washing (from Crushed Copper Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-copper-ore",
            "itemName": "Crushed Copper Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 9
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "leather",
    "name": "Leather",
    "category": "Materials & Resources",
    "icon": "/items/leather_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-diamond-horse-armor-40",
        "name": "Crushing Wheels (from Diamond Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diamond-horse-armor",
            "itemName": "Diamond Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 3,
            "chance": 10
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-golden-horse-armor-48",
        "name": "Crushing Wheels (from Golden Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "golden-horse-armor",
            "itemName": "Golden Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 8,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-saddle-77",
        "name": "Crushing Wheels (from Saddle)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "saddle",
            "itemName": "Saddle",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-saddle-33",
        "name": "Millstone (from Saddle)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "saddle",
            "itemName": "Saddle",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "string",
    "name": "String",
    "category": "Materials & Resources",
    "icon": "/items/string_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-any-wool-89",
        "name": "Crushing Wheels (from Any Wool)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "wool",
            "itemName": "Wool",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-any-wool-43",
        "name": "Millstone (from Any Wool)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "wool",
            "itemName": "Wool",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-diamond-horse-armor-40",
        "name": "Crushing Wheels (from Diamond Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "diamond-horse-armor",
            "itemName": "Diamond Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 1
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "diamond",
            "itemName": "Diamond",
            "amount": 3,
            "chance": 10
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-golden-horse-armor-48",
        "name": "Crushing Wheels (from Golden Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "golden-horse-armor",
            "itemName": "Golden Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 8,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "wheat-seeds",
    "name": "Wheat Seeds",
    "category": "Food & Farming",
    "icon": "/items/wheat_seeds_je1_be1.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-wheat-86",
        "name": "Crushing Wheels (from Wheat)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "wheat",
            "itemName": "Wheat",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          },
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-wheat-40",
        "name": "Millstone (from Wheat)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "wheat",
            "itemName": "Wheat",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          },
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-fern-45",
        "name": "Crushing Wheels (from Fern)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "fern",
            "itemName": "Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-grass-50",
        "name": "Crushing Wheels (from Grass)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "grass",
            "itemName": "Grass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-large-fern-56",
        "name": "Crushing Wheels (from Large Fern)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "large-fern",
            "itemName": "Large Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-tall-grass-82",
        "name": "Crushing Wheels (from Tall Grass)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "tall-grass",
            "itemName": "Tall Grass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-fern-17",
        "name": "Millstone (from Fern)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "fern",
            "itemName": "Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-grass-19",
        "name": "Millstone (from Grass)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "grass",
            "itemName": "Grass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-large-fern-23",
        "name": "Millstone (from Large Fern)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "large-fern",
            "itemName": "Large Fern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 50
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-tall-grass-38",
        "name": "Millstone (from Tall Grass)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "tall-grass",
            "itemName": "Tall Grass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "glowstone-dust",
    "name": "Glowstone Dust",
    "category": "Materials & Resources",
    "icon": "/items/glowstone_dust_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Spout Filling).",
    "recipes": [
      {
        "id": "recipe-crushing-glowstone-46",
        "name": "Crushing Wheels (from Glowstone)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "glowstone",
            "itemName": "Glowstone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "glowstone-dust",
            "itemName": "Glowstone Dust",
            "amount": 3
          },
          {
            "itemId": "glowstone-dust",
            "itemName": "Glowstone Dust",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-prismarine-crystals-69",
        "name": "Crushing Wheels (from Prismarine Crystals)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "prismarine-crystals",
            "itemName": "Prismarine Crystals",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 1
          },
          {
            "itemId": "nether-quartz",
            "itemName": "Nether Quartz",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "glowstone-dust",
            "itemName": "Glowstone Dust",
            "amount": 2,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-spout-glowstone-dust-2",
        "name": "Spout (Filling) - Glowstone Dust",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1
          },
          {
            "itemId": "25mb-of-potion-of-night-vision",
            "itemName": "25mB of Potion of Night Vision",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "glowstone-dust",
            "itemName": "Glowstone Dust",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "gold-ingot",
    "name": "Gold Ingot",
    "category": "Materials & Resources",
    "icon": "/items/gold_ingot_je4_be2.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-golden-horse-armor-48",
        "name": "Crushing Wheels (from Golden Horse Armor)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "golden-horse-armor",
            "itemName": "Golden Horse Armor",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2
          },
          {
            "itemId": "leather",
            "itemName": "Leather",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 2,
            "chance": 50
          },
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 8,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "red-sand",
    "name": "Red Sand",
    "category": "Materials & Resources",
    "icon": "/items/red_sand_je3_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-terracotta-83",
        "name": "Crushing Wheels (from Terracotta)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "terracotta",
            "itemName": "Terracotta",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-terracotta-39",
        "name": "Millstone (from Terracotta)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "terracotta",
            "itemName": "Terracotta",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-granite-49",
        "name": "Crushing Wheels (from Granite)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.95,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "granite",
            "itemName": "Granite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-granite-18",
        "name": "Millstone (from Granite)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "granite",
            "itemName": "Granite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sand",
    "name": "Sand",
    "category": "Materials & Resources",
    "icon": "/items/sand_je5_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-gravel-51",
        "name": "Crushing Wheels (from Gravel)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "gravel",
            "itemName": "Gravel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          },
          {
            "itemId": "flint",
            "itemName": "Flint",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "clay-ball",
            "itemName": "Clay Ball",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-sandstone-78",
        "name": "Crushing Wheels (from Sandstone)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sandstone",
            "itemName": "Sandstone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-sandstone-34",
        "name": "Millstone (from Sandstone)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "sandstone",
            "itemName": "Sandstone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "lime-dye",
    "name": "Lime Dye",
    "category": "Building & Decoration",
    "icon": "/items/lime_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-lily-of-the-valley-58",
        "name": "Crushing Wheels (from Lily of the Valley)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lily-of-the-valley",
            "itemName": "Lily of the Valley",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-orange-tulip-64",
        "name": "Crushing Wheels (from Orange Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "orange-tulip",
            "itemName": "Orange Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-pink-tulip-67",
        "name": "Crushing Wheels (from Pink Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "pink-tulip",
            "itemName": "Pink Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-red-tulip-74",
        "name": "Crushing Wheels (from Red Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "red-tulip",
            "itemName": "Red Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-sea-pickle-79",
        "name": "Crushing Wheels (from Sea Pickle)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sea-pickle",
            "itemName": "Sea Pickle",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-white-tulip-87",
        "name": "Crushing Wheels (from White Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "white-tulip",
            "itemName": "White Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-lily-of-the-valley-25",
        "name": "Millstone (from Lily of the Valley)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "lily-of-the-valley",
            "itemName": "Lily of the Valley",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          },
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-orange-tulip-26",
        "name": "Millstone (from Orange Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "orange-tulip",
            "itemName": "Orange Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-pink-tulip-29",
        "name": "Millstone (from Pink Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "pink-tulip",
            "itemName": "Pink Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "pink-dye",
            "itemName": "Pink Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-red-tulip-31",
        "name": "Millstone (from Red Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "red-tulip",
            "itemName": "Red Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "red-dye",
            "itemName": "Red Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-sea-pickle-35",
        "name": "Millstone (from Sea Pickle)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "sea-pickle",
            "itemName": "Sea Pickle",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 2
          },
          {
            "itemId": "green-dye",
            "itemName": "Green Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-white-tulip-41",
        "name": "Millstone (from White Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "white-tulip",
            "itemName": "White Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-dye",
            "itemName": "White Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cinder-flour",
    "name": "Cinder Flour",
    "category": "Materials & Resources",
    "icon": "/items/cinder_flour.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-netherrack-59",
        "name": "Crushing Wheels (from Netherrack)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "netherrack",
            "itemName": "Netherrack",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1
          },
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1,
            "chance": 50
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-cinder-flour-crafting-wiki-1",
        "name": "Mechanical Crafter - Cinder Flour",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "netherrack",
            "itemName": "Netherrack",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "netherrack",
    "name": "Netherrack",
    "category": "Materials & Resources",
    "icon": "/items/netherrack_je4_be2.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-nether-gold-ore-60",
        "name": "Crushing Wheels (from Nether Gold Ore)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 1.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "nether-gold-ore",
            "itemName": "Nether Gold Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 18
          },
          {
            "itemId": "nugget-of-experience",
            "itemName": "Nugget of Experience",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "netherrack",
            "itemName": "Netherrack",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "nether-wart",
    "name": "Nether Wart",
    "category": "Materials & Resources",
    "icon": "/items/nether_wart__item__je2_be1.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-nether-wart-block-61",
        "name": "Crushing Wheels (from Nether Wart Block)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "nether-wart-block",
            "itemName": "Nether Wart Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-wart",
            "itemName": "Nether Wart",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "powdered-obsidian",
    "name": "Powdered Obsidian",
    "category": "Materials & Resources",
    "icon": "/items/powdered_obsidian_1.png",
    "description": "Produced by Create automation machines (Crushing).",
    "recipes": [
      {
        "id": "recipe-crushing-obsidian-62",
        "name": "Crushing Wheels (from Obsidian)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 2.4,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "obsidian",
            "itemName": "Obsidian",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "powdered-obsidian",
            "itemName": "Powdered Obsidian",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-powdered-obsidian-crafting-wiki-1",
        "name": "Mechanical Crafter - Powdered Obsidian",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "obsidian",
            "itemName": "Obsidian",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "powdered-obsidian",
            "itemName": "Powdered Obsidian",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "obsidian",
    "name": "Obsidian",
    "category": "Materials & Resources",
    "icon": "/items/obsidian_je3_be2.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-magma-block-9",
        "name": "Bulk Washing (from Magma Block)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "magma-block",
            "itemName": "Magma Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "obsidian",
            "itemName": "Obsidian",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "orange-dye",
    "name": "Orange Dye",
    "category": "Building & Decoration",
    "icon": "/items/orange_dye_je3_be3.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-crushing-orange-tulip-64",
        "name": "Crushing Wheels (from Orange Tulip)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "orange-tulip",
            "itemName": "Orange Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-sunflower-81",
        "name": "Crushing Wheels (from Sunflower)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.45,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sunflower",
            "itemName": "Sunflower",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 3
          },
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-orange-tulip-26",
        "name": "Millstone (from Orange Tulip)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "orange-tulip",
            "itemName": "Orange Tulip",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 2
          },
          {
            "itemId": "lime-dye",
            "itemName": "Lime Dye",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-milling-sunflower-37",
        "name": "Millstone (from Sunflower)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "sunflower",
            "itemName": "Sunflower",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 3
          },
          {
            "itemId": "orange-dye",
            "itemName": "Orange Dye",
            "amount": 1,
            "chance": 25
          },
          {
            "itemId": "yellow-dye",
            "itemName": "Yellow Dye",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sugar",
    "name": "Sugar",
    "category": "Food & Farming",
    "icon": "/items/sugar_je2_be2.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-milling-sugar-cane-36",
        "name": "Millstone (from Sugar Cane)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "sugar-cane",
            "itemName": "Sugar Cane",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 2
          },
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-sugar-cane-80",
        "name": "Crushing Wheels (from Sugar Cane)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.2,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sugar-cane",
            "itemName": "Sugar Cane",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 2
          },
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 1,
            "chance": 10
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-sugar-crafter",
        "name": "Mechanical Crafter - Sugar",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "sugar-cane",
            "itemName": "Sugar Cane",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "wheat-flour",
    "name": "Wheat Flour",
    "category": "Food & Farming",
    "icon": "/items/wheat_flour.png",
    "description": "Produced by Create automation machines (Crushing, Milling).",
    "recipes": [
      {
        "id": "recipe-milling-wheat-40",
        "name": "Millstone (from Wheat)",
        "method": "Milling",
        "buildingRequired": "Millstone",
        "processingTimeSeconds": 5,
        "speedRpm": 32,
        "ingredients": [
          {
            "itemId": "wheat",
            "itemName": "Wheat",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          },
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crushing-wheat-86",
        "name": "Crushing Wheels (from Wheat)",
        "method": "Crushing",
        "buildingRequired": "Crushing Wheel",
        "processingTimeSeconds": 0.7,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "wheat",
            "itemName": "Wheat",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          },
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 2,
            "chance": 25
          },
          {
            "itemId": "wheat-seeds",
            "itemName": "Wheat Seeds",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "iron-sheet",
    "name": "Iron Sheet",
    "category": "Materials & Resources",
    "icon": "/items/iron_sheet.png",
    "description": "Produced by Create automation machines (Pressing).",
    "recipes": [
      {
        "id": "recipe-press-iron-sheet-0",
        "name": "Mechanical Press (Pressing) (from Iron Ingot)",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-iron-sheet-crafting-wiki-1",
        "name": "Mechanical Crafter - Iron Sheet",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-ingot",
            "itemName": "Iron Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "golden-sheet",
    "name": "Golden Sheet",
    "category": "Materials & Resources",
    "icon": "/items/golden_sheet.png",
    "description": "Produced by Create automation machines (Pressing).",
    "recipes": [
      {
        "id": "recipe-press-golden-sheet-1",
        "name": "Mechanical Press (Pressing) (from Gold Ingot)",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-golden-sheet-crafting-wiki-1",
        "name": "Mechanical Crafter - Golden Sheet",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "copper-sheet",
    "name": "Copper Sheet",
    "category": "Materials & Resources",
    "icon": "/items/copper_sheet.png",
    "description": "Produced by Create automation machines (Pressing).",
    "recipes": [
      {
        "id": "recipe-press-copper-sheet-2",
        "name": "Mechanical Press (Pressing) (from Copper Ingot)",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "copper-sheet",
            "itemName": "Copper Sheet",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "brass-sheet",
    "name": "Brass Sheet",
    "category": "Materials & Resources",
    "icon": "/items/brass_sheet.png",
    "description": "Produced by Create automation machines (Pressing).",
    "recipes": [
      {
        "id": "recipe-press-brass-sheet-3",
        "name": "Mechanical Press (Pressing) (from Brass Ingot)",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "paper",
    "name": "Paper",
    "category": "Materials & Resources",
    "icon": "/items/paper_je2_be2.png",
    "description": "Produced by Create automation machines (Pressing).",
    "recipes": [
      {
        "id": "recipe-press-paper-4",
        "name": "Mechanical Press (Pressing) (from Sugar Cane)",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "sugar-cane",
            "itemName": "Sugar Cane",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "paper",
            "itemName": "Paper",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "grass-path",
    "name": "Grass Path",
    "category": "Materials & Resources",
    "icon": "/items/dirt_path_je4_be3.png",
    "description": "Produced by Create automation machines (Pressing).",
    "recipes": [
      {
        "id": "recipe-press-grass-path-5",
        "name": "Mechanical Press (Pressing) (from Dirt)",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "dirt",
            "itemName": "Dirt",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "grass-path",
            "itemName": "Grass Path",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "white-wool",
    "name": "White Wool",
    "category": "Building & Decoration",
    "icon": "/items/white_wool_je2_be2.png",
    "description": "Produced by Create automation machines (Packing, Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-press-white-wool-6",
        "name": "Mechanical Press (Packing) (from String)",
        "method": "Packing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "string",
            "itemName": "String",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-wool",
            "itemName": "White Wool",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-fan-washing-orange-wool-14",
        "name": "Bulk Washing (from Orange Wool)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "orange-wool",
            "itemName": "Orange Wool",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "white-wool",
            "itemName": "White Wool",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "slime-block",
    "name": "Slime Block",
    "category": "Materials & Resources",
    "icon": "/items/slime_block_je2_be3.png",
    "description": "Produced by Create automation machines (Packing).",
    "recipes": [
      {
        "id": "recipe-press-slime-block-7",
        "name": "Mechanical Press (Packing) (from Slimeball)",
        "method": "Packing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "slimeball",
            "itemName": "Slimeball",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "slime-block",
            "itemName": "Slime Block",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "honey-block",
    "name": "Honey Block",
    "category": "Fluids",
    "icon": "/items/honey_block_je1_be2.png",
    "description": "Produced by Create automation machines (Compacting).",
    "recipes": [
      {
        "id": "recipe-press-honey-block-8",
        "name": "Mechanical Press (Compacting) (from 1000mB of Honey)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "1000mb-of-honey",
            "itemName": "1000mB of Honey",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "honey-block",
            "itemName": "Honey Block",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "blaze-cake-base",
    "name": "Blaze Cake Base",
    "category": "Food & Farming",
    "icon": "/items/blaze_cake_base.png",
    "description": "Produced by Create automation machines (Compacting).",
    "recipes": [
      {
        "id": "recipe-press-blaze-cake-base-9",
        "name": "Mechanical Press (Compacting) (from Egg)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "egg",
            "itemName": "Egg",
            "amount": 1
          },
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 1
          },
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blaze-cake-base",
            "itemName": "Blaze Cake Base",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-blaze-cake-base-crafting-wiki-1",
        "name": "Mechanical Crafter - Blaze Cake Base",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "egg",
            "itemName": "Egg",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blaze-cake-base",
            "itemName": "Blaze Cake Base",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "bar-of-chocolate",
    "name": "Bar of Chocolate",
    "category": "Food & Farming",
    "icon": "/items/bar_of_chocolate.png",
    "description": "Produced by Create automation machines (Compacting).",
    "recipes": [
      {
        "id": "recipe-press-bar-of-chocolate-10",
        "name": "Mechanical Press (Compacting) (from 250mB of Chocolate)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "250mb-of-chocolate",
            "itemName": "250mB of Chocolate",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "bar-of-chocolate",
            "itemName": "Bar of Chocolate",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-bar-of-chocolate-pressing-wiki-1",
        "name": "Mechanical Press - Bar of Chocolate",
        "method": "Pressing",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 2,
        "ingredients": [
          {
            "itemId": "mb-of-chocolate",
            "itemName": "mB of Chocolate",
            "amount": 250
          }
        ],
        "outputs": [
          {
            "itemId": "bar-of-chocolate",
            "itemName": "Bar of Chocolate",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "ice",
    "name": "Ice",
    "category": "Materials & Resources",
    "icon": "/items/ice_je4_be6.png",
    "description": "Produced by Create automation machines (Compacting).",
    "recipes": [
      {
        "id": "recipe-press-ice-14",
        "name": "Mechanical Press (Compacting) (from Snow Block)",
        "method": "Compacting",
        "buildingRequired": "Mechanical Press",
        "processingTimeSeconds": 1.5,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "snow-block",
            "itemName": "Snow Block",
            "amount": 9
          }
        ],
        "outputs": [
          {
            "itemId": "ice",
            "itemName": "Ice",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "netherite-ingot",
    "name": "Netherite Ingot",
    "category": "Materials & Resources",
    "icon": "/items/netherite_ingot_je1_be2.png",
    "description": "Produced by Create automation machines (Mixing).",
    "recipes": [
      {
        "id": "recipe-mixer-netherite-ingot-0",
        "name": "Mechanical Mixer - Netherite Ingot (from Netherite Scrap)",
        "method": "Mixing",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "netherite-scrap",
            "itemName": "Netherite Scrap",
            "amount": 4
          },
          {
            "itemId": "gold-ingot",
            "itemName": "Gold Ingot",
            "amount": 4
          }
        ],
        "outputs": [
          {
            "itemId": "netherite-ingot",
            "itemName": "Netherite Ingot",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "andesite-alloy",
    "name": "Andesite Alloy",
    "category": "Materials & Resources",
    "icon": "/items/andesite_alloy.png",
    "description": "Produced by Create automation machines (Mixing).",
    "recipes": [
      {
        "id": "recipe-mixer-andesite-alloy-1",
        "name": "Mechanical Mixer - Andesite Alloy (from Andesite & Iron Nugget)",
        "method": "Mixing",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mixer-andesite-alloy-2",
        "name": "Mechanical Mixer - Andesite Alloy (from Andesite & Zinc Nugget)",
        "method": "Mixing",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crafting-andesite-alloy-iron",
        "name": "Mechanical Crafter - Andesite Alloy (from Iron Nugget)",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 2
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-crafting-andesite-alloy-zinc",
        "name": "Mechanical Crafter - Andesite Alloy (from Zinc Nugget)",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 2
          },
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-andesite-alloy-crafting-wiki-6",
        "name": "Mechanical Crafter - Andesite Alloy",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 1
          },
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-andesite-alloy-crafting-wiki-5",
        "name": "Mechanical Crafter - Andesite Alloy",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite",
            "itemName": "Andesite",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-andesite-alloy-crafting-wiki-4",
        "name": "Mechanical Crafter - Andesite Alloy",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-andesite-alloy",
            "itemName": "Block of Andesite Alloy",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "brass-ingot",
    "name": "Brass Ingot",
    "category": "Materials & Resources",
    "icon": "/items/brass_ingot.png",
    "description": "Produced by Create automation machines (Mixing (Heated)).",
    "recipes": [
      {
        "id": "recipe-mixer-brass-ingot-3",
        "name": "Mechanical Mixer - Brass Ingot (from Copper Ingot)",
        "method": "Mixing (Heated)",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "copper-ingot",
            "itemName": "Copper Ingot",
            "amount": 1
          },
          {
            "itemId": "zinc-ingot",
            "itemName": "Zinc Ingot",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 2
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-block-of-brass-crafter-1",
        "name": "Mechanical Crafter - Block of Brass",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "block-of-brass",
            "itemName": "Block of Brass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "brass-ingot",
            "itemName": "Brass Ingot",
            "amount": 9
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "500mb-of-builder-s-tea",
    "name": "500mB of Builder's Tea",
    "category": "Fluids",
    "icon": "/items/builder_s_tea.png",
    "description": "Produced by Create automation machines (Mixing (Heated)).",
    "recipes": [
      {
        "id": "recipe-mixer-500mb-of-builder-s-tea-4",
        "name": "Mechanical Mixer - 500mB of Builder's Tea (from Any Leaves)",
        "method": "Mixing (Heated)",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "leaves",
            "itemName": "Leaves",
            "amount": 1
          },
          {
            "itemId": "250mb-of-water",
            "itemName": "250mB of Water",
            "amount": 1
          },
          {
            "itemId": "250mb-of-milk",
            "itemName": "250mB of Milk",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "500mb-of-builder-s-tea",
            "itemName": "500mB of Builder's Tea",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "250mb-of-chocolate",
    "name": "250mB of Chocolate",
    "category": "Fluids",
    "icon": "/items/cocoa_beans_je4_be3.png",
    "description": "Produced by Create automation machines (Mixing (Heated)).",
    "recipes": [
      {
        "id": "recipe-mixer-250mb-of-chocolate-5",
        "name": "Mechanical Mixer - 250mB of Chocolate (from Sugar)",
        "method": "Mixing (Heated)",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 1
          },
          {
            "itemId": "cocoa-beans",
            "itemName": "Cocoa Beans",
            "amount": 1
          },
          {
            "itemId": "250mb-of-milk",
            "itemName": "250mB of Milk",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "250mb-of-chocolate",
            "itemName": "250mB of Chocolate",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-mixer-250mb-of-chocolate-6",
        "name": "Mechanical Mixer - 250mB of Chocolate (from Bar of Chocolate)",
        "method": "Mixing (Heated)",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "bar-of-chocolate",
            "itemName": "Bar of Chocolate",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "250mb-of-chocolate",
            "itemName": "250mB of Chocolate",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-250mb-of-chocolate-crafting-wiki-2",
        "name": "Mechanical Crafter - 250mB of Chocolate",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "sugar",
            "itemName": "Sugar",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "250mb-of-chocolate",
            "itemName": "250mB of Chocolate",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "1000mb-of-honey",
    "name": "1000mB of Honey",
    "category": "Fluids",
    "icon": "/items/honey.png",
    "description": "Produced by Create automation machines (Mixing (Heated)).",
    "recipes": [
      {
        "id": "recipe-mixer-1000mb-of-honey-7",
        "name": "Mechanical Mixer - 1000mB of Honey (from Honey Block)",
        "method": "Mixing (Heated)",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "honey-block",
            "itemName": "Honey Block",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "1000mb-of-honey",
            "itemName": "1000mB of Honey",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "lava",
    "name": "Lava",
    "category": "Fluids",
    "icon": "/items/lava_je19.gif",
    "description": "Produced by Create automation machines (Mixing (Super-Heated)).",
    "recipes": [
      {
        "id": "recipe-mixer-50mb-of-lava-8",
        "name": "Mechanical Mixer - 50mB of Lava (from Any Cobblestone)",
        "method": "Mixing (Super-Heated)",
        "buildingRequired": "Mechanical Mixer",
        "processingTimeSeconds": 2,
        "speedRpm": 64,
        "ingredients": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "lava",
            "itemName": "Lava",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "any-stripped-wood",
    "name": "Any Stripped Wood",
    "category": "Materials & Resources",
    "icon": "/items/stripped_oak_wood__ud__je1_be1.png",
    "description": "Produced by Create automation machines (Sawing).",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "any-planks",
    "name": "Any Planks",
    "category": "Building & Decoration",
    "icon": "/items/oak_planks_2.png",
    "description": "Produced by Create automation machines (Sawing).",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "any-concrete",
    "name": "Any Concrete",
    "category": "Materials & Resources",
    "icon": "/items/white_concrete.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [],
    "sourceMod": "Create Mod"
  },
  {
    "id": "gunpowder",
    "name": "Gunpowder",
    "category": "Materials & Resources",
    "icon": "/items/gunpowder_je2_be2.png",
    "description": "Produced by Create automation machines (Bulk Washing, Spout Filling).",
    "recipes": [
      {
        "id": "recipe-fan-washing-crushed-zinc-ore-4",
        "name": "Bulk Washing (from Crushed Zinc Ore)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "crushed-zinc-ore",
            "itemName": "Crushed Zinc Ore",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "zinc-nugget",
            "itemName": "Zinc Nugget",
            "amount": 9
          },
          {
            "itemId": "gunpowder",
            "itemName": "Gunpowder",
            "amount": 1,
            "chance": 25
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-spout-gunpowder-4",
        "name": "Spout (Filling) - Gunpowder",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "cinder-flour",
            "itemName": "Cinder Flour",
            "amount": 1
          },
          {
            "itemId": "25mb-of-potion-of-instant-damage",
            "itemName": "25mB of Potion of Instant Damage",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gunpowder",
            "itemName": "Gunpowder",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "glass",
    "name": "Glass",
    "category": "Building & Decoration",
    "icon": "/items/glass_je4.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-any-stained-glass-5",
        "name": "Bulk Washing (from Any Stained Glass)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "stained-glass",
            "itemName": "Stained Glass",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "glass",
            "itemName": "Glass",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "glass-pane",
    "name": "Glass Pane",
    "category": "Building & Decoration",
    "icon": "/items/glass_pane__ew__je12.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-any-stained-glass-pane-6",
        "name": "Bulk Washing (from Any Stained Glass Pane)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "stained-glass-pane",
            "itemName": "Stained Glass Pane",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "glass-pane",
            "itemName": "Glass Pane",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "packed-ice",
    "name": "Packed Ice",
    "category": "Materials & Resources",
    "icon": "/items/packed_ice_je2_be3.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-ice-8",
        "name": "Bulk Washing (from Ice)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "ice",
            "itemName": "Ice",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "packed-ice",
            "itemName": "Packed Ice",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "dead-bush",
    "name": "Dead Bush",
    "category": "Materials & Resources",
    "icon": "/items/dead_bush_je6_be4.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-red-sand-10",
        "name": "Bulk Washing (from Red Sand)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "red-sand",
            "itemName": "Red Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gold-nugget",
            "itemName": "Gold Nugget",
            "amount": 3,
            "chance": 12.5
          },
          {
            "itemId": "dead-bush",
            "itemName": "Dead Bush",
            "amount": 1,
            "chance": 5
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "dough",
    "name": "Dough",
    "category": "Food & Farming",
    "icon": "/items/dough.png",
    "description": "Produced by Create automation machines (Bulk Washing).",
    "recipes": [
      {
        "id": "recipe-fan-washing-wheat-flour-13",
        "name": "Bulk Washing (from Wheat Flour)",
        "method": "Bulk Washing",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "dough",
            "itemName": "Dough",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-dough-crafting-wiki-1",
        "name": "Mechanical Crafter - Dough",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          },
          {
            "itemId": "mb-of-water",
            "itemName": "mB of Water",
            "amount": 1000
          }
        ],
        "outputs": [
          {
            "itemId": "dough",
            "itemName": "Dough",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-dough-crafting-wiki-2",
        "name": "Mechanical Crafter - Dough",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wheat-flour",
            "itemName": "Wheat Flour",
            "amount": 1
          },
          {
            "itemId": "water-bucket",
            "itemName": "Water Bucket",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "dough",
            "itemName": "Dough",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-dough-crafting-wiki-3",
        "name": "Mechanical Crafter - Dough",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "water-bucket",
            "itemName": "Water Bucket",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "dough",
            "itemName": "Dough",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "prismarine-shard",
    "name": "Prismarine Shard",
    "category": "Materials & Resources",
    "icon": "/items/prismarine_shard_je2_be2.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-lapis-lazuli-15",
        "name": "Bulk Haunting (from Lapis Lazuli)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "prismarine-shard",
            "itemName": "Prismarine Shard",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "prismarine-crystals",
            "itemName": "Prismarine Crystals",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "prismarine-crystals",
    "name": "Prismarine Crystals",
    "category": "Materials & Resources",
    "icon": "/items/prismarine_crystals_je2_be2.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-lapis-lazuli-15",
        "name": "Bulk Haunting (from Lapis Lazuli)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lapis-lazuli",
            "itemName": "Lapis Lazuli",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "prismarine-shard",
            "itemName": "Prismarine Shard",
            "amount": 1,
            "chance": 75
          },
          {
            "itemId": "prismarine-crystals",
            "itemName": "Prismarine Crystals",
            "amount": 1,
            "chance": 12
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "crimson-fungus",
    "name": "Crimson Fungus",
    "category": "Materials & Resources",
    "icon": "/items/crimson_fungus_je1_be1.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-red-mushroom-16",
        "name": "Bulk Haunting (from Red Mushroom)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "red-mushroom",
            "itemName": "Red Mushroom",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "crimson-fungus",
            "itemName": "Crimson Fungus",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "warped-fungus",
    "name": "Warped Fungus",
    "category": "Materials & Resources",
    "icon": "/items/warped_fungus_je1_be1.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-brown-mushroom-17",
        "name": "Bulk Haunting (from Brown Mushroom)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "brown-mushroom",
            "itemName": "Brown Mushroom",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "warped-fungus",
            "itemName": "Warped Fungus",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "poisonous-potato",
    "name": "Poisonous Potato",
    "category": "Food & Farming",
    "icon": "/items/poisonous_potato_je3_be2.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-potato-18",
        "name": "Bulk Haunting (from Potato)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "potato",
            "itemName": "Potato",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "poisonous-potato",
            "itemName": "Poisonous Potato",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "nether-brick",
    "name": "Nether Brick",
    "category": "Building & Decoration",
    "icon": "/items/nether_brick_je2_be2.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-brick-19",
        "name": "Bulk Haunting (from Brick)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "brick",
            "itemName": "Brick",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "nether-brick",
            "itemName": "Nether Brick",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "soul-campfire",
    "name": "Soul Campfire",
    "category": "Building & Decoration",
    "icon": "/items/soul_campfire_je1_be1.gif",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-campfire-21",
        "name": "Bulk Haunting (from Campfire)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "campfire",
            "itemName": "Campfire",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "soul-campfire",
            "itemName": "Soul Campfire",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "soul-soil",
    "name": "Soul Soil",
    "category": "Materials & Resources",
    "icon": "/items/soul_soil_je1_be1.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-dirt-22",
        "name": "Bulk Haunting (from Dirt)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "dirt",
            "itemName": "Dirt",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "soul-soil",
            "itemName": "Soul Soil",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "soul-lantern",
    "name": "Soul Lantern",
    "category": "Building & Decoration",
    "icon": "/items/soul_lantern_je2_be1.gif",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-lantern-23",
        "name": "Bulk Haunting (from Lantern)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "lantern",
            "itemName": "Lantern",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "soul-lantern",
            "itemName": "Soul Lantern",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "soul-sand",
    "name": "Soul Sand",
    "category": "Materials & Resources",
    "icon": "/items/soul_sand_je2_be2.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-sand-24",
        "name": "Bulk Haunting (from Sand)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sand",
            "itemName": "Sand",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "soul-sand",
            "itemName": "Soul Sand",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Vanilla"
  },
  {
    "id": "glow-berries",
    "name": "Glow Berries",
    "category": "Food & Farming",
    "icon": "/items/glow_berries_je1_be1.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-sweet-berries-25",
        "name": "Bulk Haunting (from Sweet Berries)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "sweet-berries",
            "itemName": "Sweet Berries",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "glow-berries",
            "itemName": "Glow Berries",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "blackstone",
    "name": "Blackstone",
    "category": "Materials & Resources",
    "icon": "/items/blackstone_je3_be2.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-cobblestone-26",
        "name": "Bulk Haunting (from Cobblestone)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "cobblestone",
            "itemName": "Cobblestone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blackstone",
            "itemName": "Blackstone",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "glow-ink-sac",
    "name": "Glow Ink Sac",
    "category": "Materials & Resources",
    "icon": "/items/glow_ink_sac_je1_be1.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-ink-sac-27",
        "name": "Bulk Haunting (from Ink Sac)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "ink-sac",
            "itemName": "Ink Sac",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "glow-ink-sac",
            "itemName": "Glow Ink Sac",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "soul-torch",
    "name": "Soul Torch",
    "category": "Building & Decoration",
    "icon": "/items/soul_torch.gif",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-torch-28",
        "name": "Bulk Haunting (from Torch)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "torch",
            "itemName": "Torch",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "soul-torch",
            "itemName": "Soul Torch",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "infested-stone-infested-stone-bricks-infested-mossy-stone-bricks-infested-cracked-stone-bricks-infested-chiseled-stone-bricks-infested-deepslate",
    "name": "Infested Stone;Infested Stone Bricks;Infested Mossy Stone Bricks;Infested Cracked Stone Bricks;Infested Chiseled Stone Bricks;Infested Deepslate",
    "category": "Building & Decoration",
    "icon": "/items/stone_je5_be3.png",
    "description": "Produced by Create automation machines (Bulk Haunting).",
    "recipes": [
      {
        "id": "recipe-fan-haunting-stone-29",
        "name": "Bulk Haunting (from Stone)",
        "method": "Bulk Haunting",
        "buildingRequired": "Encased Fan",
        "processingTimeSeconds": 7.5,
        "speedRpm": 128,
        "ingredients": [
          {
            "itemId": "stone",
            "itemName": "Stone",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "infested-stone-infested-stone-bricks-infested-mossy-stone-bricks-infested-cracked-stone-bricks-infested-chiseled-stone-bricks-infested-deepslate",
            "itemName": "Infested Stone;Infested Stone Bricks;Infested Mossy Stone Bricks;Infested Cracked Stone Bricks;Infested Chiseled Stone Bricks;Infested Deepslate",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "grass-block",
    "name": "Grass Block",
    "category": "Materials & Resources",
    "icon": "/items/grass_block_je7_be6.png",
    "description": "Produced by Create automation machines (Spout Filling).",
    "recipes": [
      {
        "id": "recipe-spout-grass-block-0",
        "name": "Spout (Filling) - Grass Block",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "dirt",
            "itemName": "Dirt",
            "amount": 1
          },
          {
            "itemId": "500mb-of-water",
            "itemName": "500mB of Water",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "grass-block",
            "itemName": "Grass Block",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "blaze-cake",
    "name": "Blaze Cake",
    "category": "Food & Farming",
    "icon": "/items/blaze_cake.png",
    "description": "Produced by Create automation machines (Spout Filling).",
    "recipes": [
      {
        "id": "recipe-spout-blaze-cake-1",
        "name": "Spout (Filling) - Blaze Cake",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "blaze-cake-base",
            "itemName": "Blaze Cake Base",
            "amount": 1
          },
          {
            "itemId": "lava",
            "itemName": "Lava",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "blaze-cake",
            "itemName": "Blaze Cake",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "sweet-roll",
    "name": "Sweet Roll",
    "category": "Food & Farming",
    "icon": "/items/sweet_roll.png",
    "description": "Produced by Create automation machines (Spout Filling).",
    "recipes": [
      {
        "id": "recipe-spout-sweet-roll-5",
        "name": "Spout (Filling) - Sweet Roll",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "bread",
            "itemName": "Bread",
            "amount": 1
          },
          {
            "itemId": "250mb-of-milk",
            "itemName": "250mB of Milk",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "sweet-roll",
            "itemName": "Sweet Roll",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "chocolate-glazed-berries",
    "name": "Chocolate Glazed Berries",
    "category": "Food & Farming",
    "icon": "/items/chocolate_glazed_berries.png",
    "description": "Produced by Create automation machines (Spout Filling).",
    "recipes": [
      {
        "id": "recipe-spout-chocolate-glazed-berries-6",
        "name": "Spout (Filling) - Chocolate Glazed Berries",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "sweet-berries",
            "itemName": "Sweet Berries",
            "amount": 1
          },
          {
            "itemId": "250mb-of-chocolate",
            "itemName": "250mB of Chocolate",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "chocolate-glazed-berries",
            "itemName": "Chocolate Glazed Berries",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      },
      {
        "id": "recipe-chocolate-glazed-berries-crafting-wiki-1",
        "name": "Mechanical Crafter - Chocolate Glazed Berries",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "sweet-berries",
            "itemName": "Sweet Berries",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "chocolate-glazed-berries",
            "itemName": "Chocolate Glazed Berries",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "honeyed-apple",
    "name": "Honeyed Apple",
    "category": "Food & Farming",
    "icon": "/items/honeyed_apple.png",
    "description": "Produced by Create automation machines (Spout Filling).",
    "recipes": [
      {
        "id": "recipe-spout-honeyed-apple-7",
        "name": "Spout (Filling) - Honeyed Apple",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "apple",
            "itemName": "Apple",
            "amount": 1
          },
          {
            "itemId": "250mb-of-honey",
            "itemName": "250mB of Honey",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "honeyed-apple",
            "itemName": "Honeyed Apple",
            "amount": 1
          }
        ],
        "sourceMod": "Create Mod"
      }
    ],
    "sourceMod": "Create Mod"
  },
  {
    "id": "cardboard-sword",
    "name": "Cardboard Sword",
    "category": "Equipment & Utilities",
    "icon": "/items/cardboard_sword.png",
    "description": "A variant of sword crafted from Cardboard. Deals little damage to standard mobs but is highly effective against arthropods with heavy knockback.",
    "sourceMod": "Create Mod",
    "recipes": [
      {
        "id": "recipe-cardboard-sword-crafting",
        "name": "Mechanical Crafter - Cardboard Sword",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 2
          },
          {
            "itemId": "stick",
            "itemName": "Stick",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard-sword",
            "itemName": "Cardboard Sword",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ]
  },
  {
    "id": "cardboard-helmet",
    "name": "Cardboard Helmet",
    "category": "Equipment & Utilities",
    "icon": "/items/cardboard_helmet.png",
    "description": "Wearable equipment made from Cardboard for stealth and style.",
    "sourceMod": "Create Mod",
    "recipes": [
      {
        "id": "recipe-cardboard-helmet-crafting",
        "name": "Mechanical Crafter - Cardboard Helmet",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 5
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard-helmet",
            "itemName": "Cardboard Helmet",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ]
  },
  {
    "id": "cardboard-chestplate",
    "name": "Cardboard Chestplate",
    "category": "Equipment & Utilities",
    "icon": "/items/cardboard_chestplate.png",
    "description": "Wearable body armor made from Cardboard.",
    "sourceMod": "Create Mod",
    "recipes": [
      {
        "id": "recipe-cardboard-chestplate-crafting",
        "name": "Mechanical Crafter - Cardboard Chestplate",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 8
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard-chestplate",
            "itemName": "Cardboard Chestplate",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ]
  },
  {
    "id": "cardboard-leggings",
    "name": "Cardboard Leggings",
    "category": "Equipment & Utilities",
    "icon": "/items/cardboard_leggings.png",
    "description": "Wearable leggings made from Cardboard.",
    "sourceMod": "Create Mod",
    "recipes": [
      {
        "id": "recipe-cardboard-leggings-crafting",
        "name": "Mechanical Crafter - Cardboard Leggings",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 7
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard-leggings",
            "itemName": "Cardboard Leggings",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ]
  },
  {
    "id": "cardboard-boots",
    "name": "Cardboard Boots",
    "category": "Equipment & Utilities",
    "icon": "/items/cardboard_boots.png",
    "description": "Wearable boots made from Cardboard.",
    "sourceMod": "Create Mod",
    "recipes": [
      {
        "id": "recipe-cardboard-boots-crafting",
        "name": "Mechanical Crafter - Cardboard Boots",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "cardboard",
            "itemName": "Cardboard",
            "amount": 4
          }
        ],
        "outputs": [
          {
            "itemId": "cardboard-boots",
            "itemName": "Cardboard Boots",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Mod"
      }
    ]
  },
  {
    "id": "diesel-engine",
    "name": "Diesel Engine",
    "category": "Kinetic Generators",
    "icon": "/items/diesel_engine.png",
    "description": "Powerful kinetic generator from Create: Diesel Generators that consumes biodiesel or crude fuels to produce immense rotational force.",
    "sourceMod": "Create: Diesel Generators",
    "recipes": [
      {
        "id": "recipe-diesel-engine-crafting",
        "name": "Mechanical Crafter - Diesel Engine",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "flint-and-steel",
            "itemName": "Flint and Steel",
            "amount": 1
          },
          {
            "itemId": "engine-piston",
            "itemName": "Engine Piston",
            "amount": 2
          },
          {
            "itemId": "block-of-brass",
            "itemName": "Block of Brass",
            "amount": 1
          },
          {
            "itemId": "fluid-tank",
            "itemName": "Fluid Tank",
            "amount": 1
          },
          {
            "itemId": "polished-blackstone-slab",
            "itemName": "Polished Blackstone Slab",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "diesel-engine",
            "itemName": "Diesel Engine",
            "amount": 1
          }
        ],
        "speedRpm": 128,
        "sourceMod": "Create: Diesel Generators"
      }
    ]
  },
  {
    "id": "modular-diesel-engine",
    "name": "Modular Diesel Engine",
    "category": "Kinetic Generators",
    "icon": "/items/modular_diesel_engine.png",
    "description": "Expandable multi-block diesel generator module from Create: Diesel Generators.",
    "sourceMod": "Create: Diesel Generators",
    "recipes": [
      {
        "id": "recipe-modular-diesel-engine-crafting",
        "name": "Mechanical Crafter - Modular Diesel Engine",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 2
          },
          {
            "itemId": "diesel-engine",
            "itemName": "Diesel Engine",
            "amount": 1
          },
          {
            "itemId": "polished-blackstone-slab",
            "itemName": "Polished Blackstone Slab",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "modular-diesel-engine",
            "itemName": "Modular Diesel Engine",
            "amount": 1
          }
        ],
        "speedRpm": 128,
        "sourceMod": "Create: Diesel Generators"
      }
    ]
  },
  {
    "id": "huge-diesel-engine",
    "name": "Huge Diesel Engine",
    "category": "Kinetic Generators",
    "icon": "/items/huge_diesel_engine.png",
    "description": "Industrial heavy-duty multi-cylinder combustion power plant from Create: Diesel Generators.",
    "sourceMod": "Create: Diesel Generators",
    "recipes": [
      {
        "id": "recipe-huge-diesel-engine-crafting",
        "name": "Mechanical Crafter - Huge Diesel Engine",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 1
          },
          {
            "itemId": "flint-and-steel",
            "itemName": "Flint and Steel",
            "amount": 1
          },
          {
            "itemId": "brass-sheet",
            "itemName": "Brass Sheet",
            "amount": 1
          },
          {
            "itemId": "steam-engine",
            "itemName": "Steam Engine",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "huge-diesel-engine",
            "itemName": "Huge Diesel Engine",
            "amount": 1
          }
        ],
        "speedRpm": 256,
        "sourceMod": "Create: Diesel Generators"
      }
    ]
  },
  {
    "id": "engine-assembly",
    "name": "Engine Assembly",
    "category": "Precision & Mechanism Components",
    "icon": "/items/engine_assembly.png",
    "description": "Precision mechanical assembly required to construct vehicle and combustion engines in Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-engine-assembly-sequenced",
        "name": "Sequenced Assembly - Engine Assembly",
        "method": "Sequenced Assembly",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 12,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 2
          }
        ],
        "outputs": [
          {
            "itemId": "engine-assembly",
            "itemName": "Engine Assembly",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "portable-engine",
    "name": "Portable Engine",
    "category": "Kinetic Generators",
    "icon": "/items/portable_engine.png",
    "description": "Compact fuel-driven combustion generator for portable and mobile kinetic devices in Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-portable-engine-crafting",
        "name": "Mechanical Crafter - Portable Engine",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "engine-assembly",
            "itemName": "Engine Assembly",
            "amount": 1
          },
          {
            "itemId": "blast-furnace",
            "itemName": "Blast Furnace",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "portable-engine",
            "itemName": "Portable Engine",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "modular-accumulator",
    "name": "Modular Accumulator",
    "category": "Energy & Electricity",
    "icon": "/items/modular_accumulator.png",
    "description": "Multi-block Forge Energy electrical battery storage from Create Crafts & Additions.",
    "sourceMod": "Create Crafts & Additions",
    "recipes": [
      {
        "id": "recipe-modular-accumulator-crafting",
        "name": "Mechanical Crafter - Modular Accumulator",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "copper-rod",
            "itemName": "Copper Rod",
            "amount": 1
          },
          {
            "itemId": "capacitor",
            "itemName": "Capacitor",
            "amount": 2
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          },
          {
            "itemId": "electrum-wire",
            "itemName": "Electrum Wire",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "modular-accumulator",
            "itemName": "Modular Accumulator",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create Crafts & Additions"
      }
    ]
  },
  {
    "id": "calculation-mechanism",
    "name": "Calculation Mechanism",
    "category": "Precision & Mechanism Components",
    "icon": "/items/calculation_mechanism.png",
    "description": "Advanced logical computational mechanism from Create: Dreams and Desires.",
    "sourceMod": "Create: Dreams and Desires",
    "recipes": [
      {
        "id": "recipe-calculation-mechanism-sequenced",
        "name": "Sequenced Assembly - Calculation Mechanism",
        "method": "Sequenced Assembly",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 15,
        "ingredients": [
          {
            "itemId": "integrated-circuit",
            "itemName": "Integrated Circuit",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "copper-nugget",
            "itemName": "Copper Nugget",
            "amount": 1
          },
          {
            "itemId": "iron-nugget",
            "itemName": "Iron Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "calculation-mechanism",
            "itemName": "Calculation Mechanism",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Dreams and Desires"
      }
    ]
  },
  {
    "id": "gyroscopic-mechanism",
    "name": "Gyroscopic Mechanism",
    "category": "Precision & Mechanism Components",
    "icon": "/items/gyroscopic_mechanism.png",
    "description": "Stabilizing navigation mechanism from Create: Aeronautics for aircraft and physics contraptions.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-gyroscopic-mechanism-sequenced",
        "name": "Sequenced Assembly - Gyroscopic Mechanism",
        "method": "Sequenced Assembly",
        "buildingRequired": "Deployer",
        "processingTimeSeconds": 15,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "brass-nugget",
            "itemName": "Brass Nugget",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "gyroscopic-mechanism",
            "itemName": "Gyroscopic Mechanism",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "honey-glue",
    "name": "Honey Glue",
    "category": "Equipment & Utilities",
    "icon": "/items/honey_glue.png",
    "description": "Extended schematic-style adhesive tool from Create: Compressed Creativity.",
    "sourceMod": "Create: Compressed Creativity",
    "recipes": [
      {
        "id": "recipe-honey-glue-spout",
        "name": "Spout (Filling) - Honey Glue",
        "method": "Spout Filling",
        "buildingRequired": "Spout",
        "processingTimeSeconds": 1,
        "ingredients": [
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "honey",
            "itemName": "Honey (500mB)",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "honey-glue",
            "itemName": "Honey Glue",
            "amount": 1
          }
        ],
        "speedRpm": 0,
        "sourceMod": "Create: Compressed Creativity"
      }
    ]
  },
  {
    "id": "physics-assembler",
    "name": "Physics Assembler",
    "category": "Kinetics & Contraptions",
    "icon": "/items/physics_assembler.png",
    "description": "Assembles connected contraption blocks into fully interactive physics entities in Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-physics-assembler-crafting",
        "name": "Mechanical Crafter - Physics Assembler",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "lever",
            "itemName": "Lever",
            "amount": 1
          },
          {
            "itemId": "andesite-alloy",
            "itemName": "Andesite Alloy",
            "amount": 2
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "physics-assembler",
            "itemName": "Physics Assembler",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "coaster-cart",
    "name": "Coaster Cart",
    "category": "Logistics & Transit",
    "icon": "/items/coaster_cart.png",
    "description": "High-speed track passenger and freight cart from Create: Coasters Simulated.",
    "sourceMod": "Create: Coasters Simulated",
    "recipes": [
      {
        "id": "recipe-coaster-cart-crafting",
        "name": "Mechanical Crafter - Coaster Cart",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "dried-kelp",
            "itemName": "Dried Kelp",
            "amount": 4
          },
          {
            "itemId": "block-of-industrial-iron",
            "itemName": "Block of Industrial Iron",
            "amount": 1
          },
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "coaster-cart",
            "itemName": "Coaster Cart",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Coasters Simulated"
      }
    ]
  },
  {
    "id": "torsion-spring",
    "name": "Torsion Spring",
    "category": "Kinetics & Contraptions",
    "icon": "/items/torsion_spring.png",
    "description": "Rotational kinetic accumulator and spring mechanism from Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-torsion-spring-crafting",
        "name": "Mechanical Crafter - Torsion Spring",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "shaft",
            "itemName": "Shaft",
            "amount": 1
          },
          {
            "itemId": "spring",
            "itemName": "Spring",
            "amount": 1
          },
          {
            "itemId": "andesite-casing",
            "itemName": "Andesite Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "torsion-spring",
            "itemName": "Torsion Spring",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "propeller-bearing",
    "name": "Propeller Bearing",
    "category": "Kinetics & Contraptions",
    "icon": "/items/propeller_bearing.png",
    "description": "High-speed bearing designed for rotating aircraft and airship propellers in Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-propeller-bearing-crafting",
        "name": "Mechanical Crafter - Propeller Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "iron-sheet",
            "itemName": "Iron Sheet",
            "amount": 1
          },
          {
            "itemId": "brass-casing",
            "itemName": "Brass Casing",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "propeller-bearing",
            "itemName": "Propeller Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 128,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "swivel-bearing",
    "name": "Swivel Bearing",
    "category": "Kinetics & Contraptions",
    "icon": "/items/swivel_bearing.png",
    "description": "Freely pivoting rotation mount for airship rudders and directional thrusters in Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-swivel-bearing-crafting",
        "name": "Mechanical Crafter - Swivel Bearing",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "wooden-slab",
            "itemName": "Wooden Slab",
            "amount": 1
          },
          {
            "itemId": "block-of-industrial-iron",
            "itemName": "Block of Industrial Iron",
            "amount": 1
          },
          {
            "itemId": "cogwheel",
            "itemName": "Cogwheel",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "swivel-bearing",
            "itemName": "Swivel Bearing",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "steam-vent",
    "name": "Steam Vent",
    "category": "Kinetics & Contraptions",
    "icon": "/items/steam_vent.png",
    "description": "Directs buoyant heated air into airship envelopes in Create: Aeronautics.",
    "sourceMod": "Create: Aeronautics",
    "recipes": [
      {
        "id": "recipe-steam-vent-crafting",
        "name": "Mechanical Crafter - Steam Vent",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 1
          },
          {
            "itemId": "block-of-copper",
            "itemName": "Block of Copper",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "steam-vent",
            "itemName": "Steam Vent",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Aeronautics"
      }
    ]
  },
  {
    "id": "fireclay",
    "name": "Fireclay",
    "category": "Materials & Resources",
    "icon": "/items/fireclay.png",
    "description": "Heat-resistant refractory clay block used to manufacture blast furnace and casting chambers in Create: The Factory Must Grow.",
    "sourceMod": "Create: The Factory Must Grow",
    "recipes": [
      {
        "id": "recipe-fireclay-crafting",
        "name": "Mechanical Crafter - Fireclay",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 4,
        "ingredients": [
          {
            "itemId": "fireclay-ball",
            "itemName": "Fireclay Ball",
            "amount": 4
          }
        ],
        "outputs": [
          {
            "itemId": "fireclay",
            "itemName": "Fireclay",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: The Factory Must Grow"
      }
    ]
  },
  {
    "id": "linked-typewriter",
    "name": "Linked Typewriter",
    "category": "Redstone & Displays",
    "icon": "/items/linked_typewriter.png",
    "description": "Mechanical keyboard terminal from Create: Connected that broadcasts typed text over Redstone Link networks to Display Boards.",
    "sourceMod": "Create: Connected",
    "recipes": [
      {
        "id": "recipe-linked-typewriter-crafter",
        "name": "Mechanical Crafter - Linked Typewriter",
        "method": "Mechanical Crafting",
        "buildingRequired": "Mechanical Crafter",
        "processingTimeSeconds": 6,
        "ingredients": [
          {
            "itemId": "stone-button",
            "itemName": "Button",
            "amount": 9
          },
          {
            "itemId": "transmitter",
            "itemName": "Transmitter",
            "amount": 1
          },
          {
            "itemId": "golden-sheet",
            "itemName": "Golden Sheet",
            "amount": 2
          },
          {
            "itemId": "precision-mechanism",
            "itemName": "Precision Mechanism",
            "amount": 1
          }
        ],
        "outputs": [
          {
            "itemId": "linked-typewriter",
            "itemName": "Linked Typewriter",
            "amount": 1
          }
        ],
        "speedRpm": 64,
        "sourceMod": "Create: Connected"
      }
    ]
  },
  ...VANILLA_CRAFTING_ITEMS
  ]
};