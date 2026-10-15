import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');

const beforeItems = createContent.slice(0, startIdx + '"items": ['.length);
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const afterItems = createContent.slice(endIdx);

const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

// Equipment keywords that should NOT be the default recipe
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

// 1. First, distribute any misplaced recipes
const itemMap = new Map();
createItems.forEach(i => itemMap.set(i.id, i));

for (const item of createItems) {
  const kept = [];
  for (const r of (item.recipes || [])) {
    const producesSelf = (r.outputs || []).some(o => o.itemId === item.id || o.itemName.toLowerCase() === item.name.toLowerCase());
    if (producesSelf) {
      kept.push(r);
    } else {
      const out = (r.outputs || [])[0];
      if (out && out.itemId && itemMap.has(out.itemId)) {
        const target = itemMap.get(out.itemId);
        target.recipes = target.recipes || [];
        if (!target.recipes.some(tr => tr.id === r.id)) {
          target.recipes.push(r);
        }
      }
    }
  }
  item.recipes = kept;
}

// 2. Score and sort recipes so index [0] is the definitive community default
// Scoring rules:
// - Huge penalty (-1000) for equipment/tool recycling
// - Huge penalty (-500) if recipe consumes a higher-tier block of the item (e.g. Block of Andesite Alloy -> Andesite Alloy)
// - Penalty (-200) for incomplete / truncated recipe fragments
// - Bonus (+500) for canonical community automated methods:
//   - Andesite Alloy: Mechanical Mixer with Andesite + Iron/Zinc Nugget (1:1 ratio is standard)
//   - Dough: Bulk Washing (Wheat Flour)
//   - Wheat Flour: Milling (from Wheat) via Millstone
//   - Sheets (Iron, Gold, Copper, Brass): Mechanical Press (Pressing from Ingot)
//   - Cinder Flour: Crushing from Netherrack
//   - Powdered Obsidian: Crushing from Obsidian
//   - Diamond: Crushing from Diamond Ore / Deepslate Diamond Ore
//   - Gold Nugget: Bulk Washing from Crushed Gold Ore / Red Sand
//   - String: Milling / Crushing from Wool
//   - Sugar: Milling from Sugar Cane
//   - Blaze Cake Base: Compacting Egg + Sugar + Cinder Flour
//   - Chocolate: Heated Mixing from Sugar + Cocoa Beans + Milk
//   - Bar of Chocolate: Compacting from 250mB of Chocolate
//   - Dyes: Milling from primary flower
//   - Sand: Milling / Crushing from Sandstone / Gravel
//   - Red Sand: Milling / Crushing from Granite / Terracotta
//   - Mechanical Contraption crafting: recipes with complete standard components (e.g. Shaft + Planks for Cogwheel)

function getRecipeScore(item, recipe) {
  let score = 100;
  const name = (recipe.name || '').toLowerCase();
  const method = (recipe.method || '').toLowerCase();
  const building = (recipe.buildingRequired || '').toLowerCase();
  const ingredients = recipe.ingredients || [];
  const ingNames = ingredients.map(i => (i.itemName || '').toLowerCase());
  const ingIds = ingredients.map(i => (i.itemId || '').toLowerCase());

  // 1. Extreme penalty for equipment recycling
  if (isEquipmentRecycling(recipe)) {
    return -1000;
  }

  // 2. Penalty for deconstructing block form into single item (e.g. Block of Andesite Alloy -> Andesite Alloy)
  if (ingIds.some(id => id === `block-of-${item.id}`)) {
    score -= 500;
  }

  // 3. Penalty for incomplete single-ingredient fragment recipes where standard crafting requires multiple ingredients
  // Example: Cogwheel requiring only [Oak Planks] or [Cogwheel] instead of [Shaft, Oak Planks]
  if (item.id === 'cogwheel') {
    if (ingIds.includes('shaft') && ingIds.includes('oak-planks')) score += 300;
    else score -= 200;
  }
  if (item.id === 'large-cogwheel') {
    if (ingIds.includes('shaft') && ingNames.some(n => n.includes('planks'))) score += 300;
    else if (ingIds.includes('cogwheel') && ingNames.some(n => n.includes('planks'))) score += 250;
    else score -= 200;
  }
  if (item.id === 'analog-lever') {
    if (ingIds.includes('stick') && ingIds.includes('andesite-casing')) score += 300;
    else score -= 200;
  }
  if (item.id === 'gantry-carriage') {
    if (ingIds.includes('andesite-casing') && ingIds.includes('cogwheel')) score += 300;
    else score -= 200;
  }
  if (item.id === 'clutch' || item.id === 'gearshift') {
    if (ingIds.includes('andesite-casing') && ingIds.includes('shaft') && ingIds.includes('redstone-dust')) score += 300;
    else score -= 200;
  }
  if (item.id === 'encased-fan') {
    if (building.includes('crafter') && ingIds.includes('propeller')) score += 300;
    else score -= 100;
  }
  if (item.id === 'clipboard') {
    if (ingIds.includes('paper') && ingIds.includes('andesite-alloy')) score += 300;
  }

  // 4. Specific canonical item rules:
  if (item.id === 'andesite-alloy') {
    // Mechanical Mixer Andesite + Iron/Zinc Nugget (1:1 ratio) is the most efficient automated method
    if (building.includes('mixer') && (ingIds.includes('iron-nugget') || ingIds.includes('zinc-nugget'))) {
      score += 400;
    } else if (building.includes('crafter') && ingredients.length === 2) {
      score += 200;
    }
  }

  if (item.id === 'dough') {
    // Bulk Washing from Wheat Flour is the ubiquitous Create mod staple
    if (method.includes('washing') && ingIds.includes('wheat-flour')) {
      score += 400;
    } else if (ingIds.includes('wheat-flour') && (ingNames.some(n => n.includes('water')))) {
      score += 200;
    }
  }

  if (item.id === 'wheat-flour') {
    // Milling Wheat via Millstone is the early/mid-game standard
    if (building.includes('millstone') && ingIds.includes('wheat')) {
      score += 400;
    } else if (building.includes('crushing') && ingIds.includes('wheat')) {
      score += 350;
    }
  }

  if (['iron-sheet', 'golden-sheet', 'copper-sheet', 'brass-sheet'].includes(item.id)) {
    // Pressing from ingot via Mechanical Press
    if (method.includes('press') || building.includes('press')) {
      score += 400;
    }
  }

  if (item.id === 'cinder-flour') {
    if (building.includes('crushing') && ingIds.includes('netherrack')) score += 400;
    else if (building.includes('millstone') && ingIds.includes('netherrack')) score += 350;
  }

  if (item.id === 'powdered-obsidian') {
    if (building.includes('crushing') && ingIds.includes('obsidian')) score += 400;
  }

  if (item.id === 'string') {
    // Wool to string (milling or crushing)
    if ((building.includes('millstone') || building.includes('crushing')) && ingNames.some(n => n.includes('wool'))) {
      score += 400;
    }
  }

  if (item.id === 'sugar') {
    if (building.includes('millstone') && ingIds.includes('sugar-cane')) score += 400;
    else if (building.includes('crushing') && ingIds.includes('sugar-cane')) score += 350;
    else if (building.includes('crafter') && ingIds.includes('sugar-cane')) score += 300;
  }

  if (item.id === 'diamond') {
    if (building.includes('crushing') && (ingIds.includes('diamond-ore') || ingIds.includes('deepslate-diamond-ore'))) {
      score += 400;
    }
  }

  if (item.id === 'gold-nugget') {
    if (method.includes('washing') && ingIds.includes('crushed-gold-ore')) score += 400;
    else if (method.includes('washing') && ingIds.includes('red-sand')) score += 350;
  }

  if (item.id === 'blaze-cake-base') {
    if (building.includes('press') && ingredients.length === 3) score += 400;
  }

  if (item.id === '250mb-of-chocolate') {
    if (building.includes('mixer') && ingIds.includes('cocoa-beans')) score += 400;
  }

  if (item.id === 'bar-of-chocolate') {
    if (building.includes('press')) score += 400;
  }

  if (item.id === 'wheat-seeds') {
    if (ingIds.includes('wheat')) score += 200;
  }

  if (item.id === 'sand') {
    if (ingIds.includes('gravel')) score += 300;
    else if (ingIds.includes('sandstone')) score += 250;
  }

  if (item.id === 'red-sand') {
    if (ingIds.includes('terracotta')) score += 300;
    else if (ingIds.includes('granite')) score += 250;
  }

  return score;
}

// Re-order recipes for all items
let reorderedCount = 0;
for (const item of createItems) {
  if (item.recipes && item.recipes.length > 1) {
    const beforeFirstId = item.recipes[0].id;
    item.recipes.sort((a, b) => {
      const scoreA = getRecipeScore(item, a);
      const scoreB = getRecipeScore(item, b);
      return scoreB - scoreA;
    });
    const afterFirstId = item.recipes[0].id;
    if (beforeFirstId !== afterFirstId) {
      reorderedCount++;
      console.log(`[DEFAULT CHANGED] ${item.name} (${item.id}): new default -> "${item.recipes[0].name}" (${item.recipes[0].method} via ${item.recipes[0].buildingRequired})`);
    }
  }
}

console.log(`\nUpdated default recipes for ${reorderedCount} items.`);

// Write back create.ts with formatted items
const formattedItems = JSON.stringify(createItems, null, 2);
const innerItems = formattedItems.slice(1, formattedItems.length - 1).trim();

const newContent = `${beforeItems}\n${innerItems},\n  ${afterItems}`;
fs.writeFileSync('apps/itemlist-create/data/create.ts', newContent, 'utf8');
console.log('Successfully written optimized recipe defaults to apps/itemlist-create/data/create.ts');
