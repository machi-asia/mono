import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CREATE_DATA_PATH = path.join(ROOT, 'apps', 'itemlist-create', 'data', 'create.ts');

const content = fs.readFileSync(CREATE_DATA_PATH, 'utf8');

const addonItems = [
  {
    id: 'diesel-engine',
    name: 'Diesel Engine',
    category: 'Kinetic Generators',
    icon: '/items/diesel_engine.png',
    description: 'Powerful kinetic generator from Create: Diesel Generators that consumes biodiesel or crude fuels to produce immense rotational force.',
    sourceMod: 'Create: Diesel Generators',
    recipes: [
      {
        id: 'recipe-diesel-engine-crafting',
        name: 'Crafting Table - Diesel Engine',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'flint-and-steel', itemName: 'Flint and Steel', amount: 1 },
          { itemId: 'engine-piston', itemName: 'Engine Piston', amount: 2 },
          { itemId: 'block-of-brass', itemName: 'Block of Brass', amount: 1 },
          { itemId: 'fluid-tank', itemName: 'Fluid Tank', amount: 1 },
          { itemId: 'polished-blackstone-slab', itemName: 'Polished Blackstone Slab', amount: 2 }
        ],
        outputs: [{ itemId: 'diesel-engine', itemName: 'Diesel Engine', amount: 1 }],
        speedRpm: 128,
        sourceMod: 'Create: Diesel Generators'
      }
    ]
  },
  {
    id: 'modular-diesel-engine',
    name: 'Modular Diesel Engine',
    category: 'Kinetic Generators',
    icon: '/items/modular_diesel_engine.png',
    description: 'Expandable multi-block diesel generator module from Create: Diesel Generators.',
    sourceMod: 'Create: Diesel Generators',
    recipes: [
      {
        id: 'recipe-modular-diesel-engine-crafting',
        name: 'Crafting Table - Modular Diesel Engine',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'andesite-alloy', itemName: 'Andesite Alloy', amount: 1 },
          { itemId: 'brass-sheet', itemName: 'Brass Sheet', amount: 2 },
          { itemId: 'diesel-engine', itemName: 'Diesel Engine', amount: 1 },
          { itemId: 'polished-blackstone-slab', itemName: 'Polished Blackstone Slab', amount: 1 }
        ],
        outputs: [{ itemId: 'modular-diesel-engine', itemName: 'Modular Diesel Engine', amount: 1 }],
        speedRpm: 128,
        sourceMod: 'Create: Diesel Generators'
      }
    ]
  },
  {
    id: 'huge-diesel-engine',
    name: 'Huge Diesel Engine',
    category: 'Kinetic Generators',
    icon: '/items/huge_diesel_engine.png',
    description: 'Industrial heavy-duty multi-cylinder combustion power plant from Create: Diesel Generators.',
    sourceMod: 'Create: Diesel Generators',
    recipes: [
      {
        id: 'recipe-huge-diesel-engine-crafting',
        name: 'Crafting Table - Huge Diesel Engine',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'andesite-alloy', itemName: 'Andesite Alloy', amount: 1 },
          { itemId: 'flint-and-steel', itemName: 'Flint and Steel', amount: 1 },
          { itemId: 'brass-sheet', itemName: 'Brass Sheet', amount: 1 },
          { itemId: 'steam-engine', itemName: 'Steam Engine', amount: 1 }
        ],
        outputs: [{ itemId: 'huge-diesel-engine', itemName: 'Huge Diesel Engine', amount: 1 }],
        speedRpm: 256,
        sourceMod: 'Create: Diesel Generators'
      }
    ]
  },
  {
    id: 'engine-assembly',
    name: 'Engine Assembly',
    category: 'Precision & Mechanism Components',
    icon: '/items/engine_assembly.png',
    description: 'Precision mechanical assembly required to construct vehicle and combustion engines in Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-engine-assembly-sequenced',
        name: 'Sequenced Assembly - Engine Assembly',
        method: 'Sequenced Assembly',
        buildingRequired: 'Deployer',
        processingTimeSeconds: 12,
        ingredients: [
          { itemId: 'iron-sheet', itemName: 'Iron Sheet', amount: 1 },
          { itemId: 'iron-nugget', itemName: 'Iron Nugget', amount: 2 }
        ],
        outputs: [{ itemId: 'engine-assembly', itemName: 'Engine Assembly', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'portable-engine',
    name: 'Portable Engine',
    category: 'Kinetic Generators',
    icon: '/items/portable_engine.png',
    description: 'Compact fuel-driven combustion generator for portable and mobile kinetic devices in Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-portable-engine-crafting',
        name: 'Crafting Table - Portable Engine',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'iron-sheet', itemName: 'Iron Sheet', amount: 1 },
          { itemId: 'engine-assembly', itemName: 'Engine Assembly', amount: 1 },
          { itemId: 'blast-furnace', itemName: 'Blast Furnace', amount: 1 }
        ],
        outputs: [{ itemId: 'portable-engine', itemName: 'Portable Engine', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'modular-accumulator',
    name: 'Modular Accumulator',
    category: 'Energy & Electricity',
    icon: '/items/modular_accumulator.png',
    description: 'Multi-block Forge Energy electrical battery storage from Create Crafts & Additions.',
    sourceMod: 'Create Crafts & Additions',
    recipes: [
      {
        id: 'recipe-modular-accumulator-crafting',
        name: 'Crafting Table - Modular Accumulator',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'copper-rod', itemName: 'Copper Rod', amount: 1 },
          { itemId: 'capacitor', itemName: 'Capacitor', amount: 2 },
          { itemId: 'brass-casing', itemName: 'Brass Casing', amount: 1 },
          { itemId: 'electrum-wire', itemName: 'Electrum Wire', amount: 1 }
        ],
        outputs: [{ itemId: 'modular-accumulator', itemName: 'Modular Accumulator', amount: 1 }],
        speedRpm: 0,
        sourceMod: 'Create Crafts & Additions'
      }
    ]
  },
  {
    id: 'calculation-mechanism',
    name: 'Calculation Mechanism',
    category: 'Precision & Mechanism Components',
    icon: '/items/calculation_mechanism.png',
    description: 'Advanced logical computational mechanism from Create: Dreams and Desires.',
    sourceMod: 'Create: Dreams and Desires',
    recipes: [
      {
        id: 'recipe-calculation-mechanism-sequenced',
        name: 'Sequenced Assembly - Calculation Mechanism',
        method: 'Sequenced Assembly',
        buildingRequired: 'Deployer',
        processingTimeSeconds: 15,
        ingredients: [
          { itemId: 'integrated-circuit', itemName: 'Integrated Circuit', amount: 1 },
          { itemId: 'cogwheel', itemName: 'Cogwheel', amount: 1 },
          { itemId: 'copper-nugget', itemName: 'Copper Nugget', amount: 1 },
          { itemId: 'iron-nugget', itemName: 'Iron Nugget', amount: 1 }
        ],
        outputs: [{ itemId: 'calculation-mechanism', itemName: 'Calculation Mechanism', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Dreams and Desires'
      }
    ]
  },
  {
    id: 'gyroscopic-mechanism',
    name: 'Gyroscopic Mechanism',
    category: 'Precision & Mechanism Components',
    icon: '/items/gyroscopic_mechanism.png',
    description: 'Stabilizing navigation mechanism from Create: Aeronautics for aircraft and physics contraptions.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-gyroscopic-mechanism-sequenced',
        name: 'Sequenced Assembly - Gyroscopic Mechanism',
        method: 'Sequenced Assembly',
        buildingRequired: 'Deployer',
        processingTimeSeconds: 15,
        ingredients: [
          { itemId: 'iron-sheet', itemName: 'Iron Sheet', amount: 1 },
          { itemId: 'cogwheel', itemName: 'Cogwheel', amount: 1 },
          { itemId: 'shaft', itemName: 'Shaft', amount: 1 },
          { itemId: 'brass-nugget', itemName: 'Brass Nugget', amount: 1 }
        ],
        outputs: [{ itemId: 'gyroscopic-mechanism', itemName: 'Gyroscopic Mechanism', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'honey-glue',
    name: 'Honey Glue',
    category: 'Equipment & Utilities',
    icon: '/items/honey_glue.png',
    description: 'Extended schematic-style adhesive tool from Create: Compressed Creativity.',
    sourceMod: 'Create: Compressed Creativity',
    recipes: [
      {
        id: 'recipe-honey-glue-spout',
        name: 'Spout (Filling) - Honey Glue',
        method: 'Spout Filling',
        buildingRequired: 'Spout',
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: 'iron-sheet', itemName: 'Iron Sheet', amount: 1 },
          { itemId: 'honey', itemName: 'Honey (500mB)', amount: 1 }
        ],
        outputs: [{ itemId: 'honey-glue', itemName: 'Honey Glue', amount: 1 }],
        speedRpm: 0,
        sourceMod: 'Create: Compressed Creativity'
      }
    ]
  },
  {
    id: 'physics-assembler',
    name: 'Physics Assembler',
    category: 'Kinetics & Contraptions',
    icon: '/items/physics_assembler.png',
    description: 'Assembles connected contraption blocks into fully interactive physics entities in Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-physics-assembler-crafting',
        name: 'Crafting Table - Physics Assembler',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'lever', itemName: 'Lever', amount: 1 },
          { itemId: 'andesite-alloy', itemName: 'Andesite Alloy', amount: 2 },
          { itemId: 'andesite-casing', itemName: 'Andesite Casing', amount: 1 }
        ],
        outputs: [{ itemId: 'physics-assembler', itemName: 'Physics Assembler', amount: 1 }],
        speedRpm: 0,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'coaster-cart',
    name: 'Coaster Cart',
    category: 'Logistics & Transit',
    icon: '/items/coaster_cart.png',
    description: 'High-speed track passenger and freight cart from Create: Coasters Simulated.',
    sourceMod: 'Create: Coasters Simulated',
    recipes: [
      {
        id: 'recipe-coaster-cart-crafting',
        name: 'Crafting Table - Coaster Cart',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'wooden-slab', itemName: 'Wooden Slab', amount: 1 },
          { itemId: 'dried-kelp', itemName: 'Dried Kelp', amount: 4 },
          { itemId: 'block-of-industrial-iron', itemName: 'Block of Industrial Iron', amount: 1 },
          { itemId: 'shaft', itemName: 'Shaft', amount: 1 }
        ],
        outputs: [{ itemId: 'coaster-cart', itemName: 'Coaster Cart', amount: 1 }],
        speedRpm: 0,
        sourceMod: 'Create: Coasters Simulated'
      }
    ]
  },
  {
    id: 'torsion-spring',
    name: 'Torsion Spring',
    category: 'Kinetics & Contraptions',
    icon: '/items/torsion_spring.png',
    description: 'Rotational kinetic accumulator and spring mechanism from Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-torsion-spring-crafting',
        name: 'Crafting Table - Torsion Spring',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'shaft', itemName: 'Shaft', amount: 1 },
          { itemId: 'spring', itemName: 'Spring', amount: 1 },
          { itemId: 'andesite-casing', itemName: 'Andesite Casing', amount: 1 }
        ],
        outputs: [{ itemId: 'torsion-spring', itemName: 'Torsion Spring', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'propeller-bearing',
    name: 'Propeller Bearing',
    category: 'Kinetics & Contraptions',
    icon: '/items/propeller_bearing.png',
    description: 'High-speed bearing designed for rotating aircraft and airship propellers in Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-propeller-bearing-crafting',
        name: 'Crafting Table - Propeller Bearing',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'wooden-slab', itemName: 'Wooden Slab', amount: 1 },
          { itemId: 'iron-sheet', itemName: 'Iron Sheet', amount: 1 },
          { itemId: 'brass-casing', itemName: 'Brass Casing', amount: 1 }
        ],
        outputs: [{ itemId: 'propeller-bearing', itemName: 'Propeller Bearing', amount: 1 }],
        speedRpm: 128,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'swivel-bearing',
    name: 'Swivel Bearing',
    category: 'Kinetics & Contraptions',
    icon: '/items/swivel_bearing.png',
    description: 'Freely pivoting rotation mount for airship rudders and directional thrusters in Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-swivel-bearing-crafting',
        name: 'Crafting Table - Swivel Bearing',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'wooden-slab', itemName: 'Wooden Slab', amount: 1 },
          { itemId: 'block-of-industrial-iron', itemName: 'Block of Industrial Iron', amount: 1 },
          { itemId: 'cogwheel', itemName: 'Cogwheel', amount: 1 }
        ],
        outputs: [{ itemId: 'swivel-bearing', itemName: 'Swivel Bearing', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'steam-vent',
    name: 'Steam Vent',
    category: 'Kinetics & Contraptions',
    icon: '/items/steam_vent.png',
    description: 'Directs buoyant heated air into airship envelopes in Create: Aeronautics.',
    sourceMod: 'Create: Aeronautics',
    recipes: [
      {
        id: 'recipe-steam-vent-crafting',
        name: 'Crafting Table - Steam Vent',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'golden-sheet', itemName: 'Golden Sheet', amount: 1 },
          { itemId: 'block-of-copper', itemName: 'Block of Copper', amount: 1 }
        ],
        outputs: [{ itemId: 'steam-vent', itemName: 'Steam Vent', amount: 1 }],
        speedRpm: 0,
        sourceMod: 'Create: Aeronautics'
      }
    ]
  },
  {
    id: 'fireclay',
    name: 'Fireclay',
    category: 'Materials & Resources',
    icon: '/items/fireclay.png',
    description: 'Heat-resistant refractory clay block used to manufacture blast furnace and casting chambers in Create: The Factory Must Grow.',
    sourceMod: 'Create: The Factory Must Grow',
    recipes: [
      {
        id: 'recipe-fireclay-crafting',
        name: 'Crafting Table - Fireclay',
        method: 'Crafting',
        buildingRequired: 'Crafting Table',
        processingTimeSeconds: 4,
        ingredients: [
          { itemId: 'fireclay-ball', itemName: 'Fireclay Ball', amount: 4 }
        ],
        outputs: [{ itemId: 'fireclay', itemName: 'Fireclay', amount: 1 }],
        speedRpm: 0,
        sourceMod: 'Create: The Factory Must Grow'
      }
    ]
  },
  {
    id: 'linked-typewriter',
    name: 'Linked Typewriter',
    category: 'Redstone & Displays',
    icon: '/items/linked_typewriter.png',
    description: 'Mechanical keyboard terminal from Create: Connected that broadcasts typed text over Redstone Link networks to Display Boards.',
    sourceMod: 'Create: Connected',
    recipes: [
      {
        id: 'recipe-linked-typewriter-crafter',
        name: 'Mechanical Crafter - Linked Typewriter',
        method: 'Mechanical Crafting',
        buildingRequired: 'Mechanical Crafter',
        processingTimeSeconds: 6,
        ingredients: [
          { itemId: 'stone-button', itemName: 'Button', amount: 9 },
          { itemId: 'transmitter', itemName: 'Transmitter', amount: 1 },
          { itemId: 'golden-sheet', itemName: 'Golden Sheet', amount: 2 },
          { itemId: 'precision-mechanism', itemName: 'Precision Mechanism', amount: 1 }
        ],
        outputs: [{ itemId: 'linked-typewriter', itemName: 'Linked Typewriter', amount: 1 }],
        speedRpm: 64,
        sourceMod: 'Create: Connected'
      }
    ]
  }
];

const marker = '...VANILLA_CRAFTING_ITEMS';
const idx = content.lastIndexOf(marker);
if (idx !== -1) {
  const insertJson = JSON.stringify(addonItems, null, 2).slice(1, -1).trim() + ',\n    ';
  const updated = content.slice(0, idx) + insertJson + content.slice(idx);
  fs.writeFileSync(CREATE_DATA_PATH, updated, 'utf8');
  console.log('Successfully added 17 addon items and recipes from createmodaddons.miraheze.org to create.ts!');
}
