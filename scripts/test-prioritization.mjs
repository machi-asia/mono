import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

// Equipment keywords that should NEVER be used as the default recipe
const EQUIPMENT_KEYWORDS = [
  'horse armor', 'horse-armor', 'saddle', 'sword', 'pickaxe', 'axe', 'shovel',
  'hoe', 'helmet', 'chestplate', 'leggings', 'boots', 'shears', 'shield'
];

function isEquipmentRecycling(recipe) {
  for (const ing of (recipe.ingredients || [])) {
    const name = (ing.itemName || '').toLowerCase();
    const id = (ing.itemId || '').toLowerCase();
    if (EQUIPMENT_KEYWORDS.some(k => name.includes(k) || id.includes(k))) {
      return true;
    }
  }
  return false;
}

// Check how many items have equipment recycling
let equipmentRecipeCount = 0;
for (const item of createItems) {
  for (const r of (item.recipes || [])) {
    if (isEquipmentRecycling(r)) {
      equipmentRecipeCount++;
    }
  }
}
console.log(`Found ${equipmentRecipeCount} equipment recycling recipes across createItems.`);

// Specific community defaults for well-known Create mod items:
// 1. andesite-alloy:
//    - Mixing Andesite + Zinc Nugget or Iron Nugget (1:1 ratio) is the most efficient and standard automation method
// 2. brass-ingot:
//    - Heated Mixing (Copper Ingot + Zinc Ingot)
// 3. iron-sheet / golden-sheet / copper-sheet / brass-sheet:
//    - Mechanical Press (Pressing from Ingot)
// 4. dough:
//    - Bulk Washing from Wheat Flour (Encased Fan + Water) or mixing Wheat Flour + Water
// 5. wheat-flour:
//    - Milling (from Wheat) via Millstone
// 6. string:
//    - Milling or Crushing from Wool (NOT from Diamond/Gold Horse Armor!)
// 7. leather:
//    - Bulk Haunting or from Rotten Flesh/Cow, NOT Horse Armor or Saddle
// 8. diamond:
//    - Crushing Diamond Ore or Deepslate Diamond Ore, NOT Diamond Horse Armor
// 9. gold-nugget:
//    - Bulk Washing Red Sand or Crushed Gold Ore, NOT Golden Horse Armor
// 10. cinder-flour:
//    - Crushing Netherrack via Crushing Wheels
// 11. powdered-obsidian:
//    - Crushing Obsidian via Crushing Wheels
// 12. blaze-cake-base:
//    - Compacting Egg + Sugar + Cinder Flour via Mechanical Press
// 13. bar-of-chocolate:
//    - Compacting 250mB of Chocolate via Mechanical Press
// 14. 250mb-of-chocolate:
//    - Heated Mixing (Sugar + Cocoa Beans + Milk) via Mechanical Mixer
// 15. polished-rose-quartz:
//    - Sandpaper / Deployer with Sand Paper

console.log('Testing specific community item checks...');
const sampleIds = ['andesite-alloy', 'iron-sheet', 'dough', 'wheat-flour', 'string', 'diamond', 'gold-nugget', 'cinder-flour', 'blaze-cake-base', 'sugar'];
for (const id of sampleIds) {
  const item = createItems.find(i => i.id === id);
  if (item) {
    console.log(`\n${item.name} (${item.id}): has ${item.recipes?.length} recipes:`);
    item.recipes?.forEach((r, idx) => console.log(`  [${idx}] ${r.name} (${r.method})`));
  }
}
