import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

// Build map of items
const itemMap = new Map();
createItems.forEach(i => itemMap.set(i.id, i));

// Items that are abstract groups or materials where recipes actually produce sub-items
// e.g. "casing", "bracket", "planks", "sliding-door", "window", "seat", "table-cloth", "toolbox", "valve-handle", "postbox"
// For normal concrete items, a recipe whose output does NOT produce the item is a misplaced recipe from another item!
// Let's see which misplaced recipes can be moved to the correct item:

let movedCount = 0;
let removedCount = 0;

for (const item of createItems) {
  if (['casing', 'bracket', 'planks', 'sliding-door', 'window', 'seat', 'table-cloth', 'valve-handle', 'postbox', 'any-stripped-wood', 'any-planks', 'any-concrete'].includes(item.id)) {
    // For these container/parent pages from wiki, distribute their recipes to the actual target items if target items exist
    const keptRecipes = [];
    for (const r of (item.recipes || [])) {
      const out = (r.outputs || [])[0];
      if (out && out.itemId && out.itemId !== item.id) {
        const target = itemMap.get(out.itemId);
        if (target) {
          // If target item doesn't already have this recipe, add it
          const exists = (target.recipes || []).some(tr => tr.id === r.id);
          if (!exists) {
            target.recipes = target.recipes || [];
            target.recipes.push(r);
            movedCount++;
          }
        }
      }
    }
    // Filter item.recipes to only those that output item.id
    item.recipes = (item.recipes || []).filter(r => (r.outputs || []).some(o => o.itemId === item.id || o.itemName.toLowerCase() === item.name.toLowerCase()));
  } else {
    // Normal items: e.g. gantry-carriage had a recipe producing gantry-shaft
    const kept = [];
    for (const r of (item.recipes || [])) {
      const producesSelf = (r.outputs || []).some(o => o.itemId === item.id || o.itemName.toLowerCase() === item.name.toLowerCase());
      if (producesSelf) {
        kept.push(r);
      } else {
        const out = (r.outputs || [])[0];
        if (out && out.itemId) {
          const target = itemMap.get(out.itemId);
          if (target) {
            const exists = (target.recipes || []).some(tr => tr.id === r.id);
            if (!exists) {
              target.recipes = target.recipes || [];
              target.recipes.push(r);
              movedCount++;
            }
          } else {
            removedCount++;
          }
        }
      }
    }
    item.recipes = kept;
  }
}

console.log(`Moved ${movedCount} recipes to their correct items.`);
console.log(`Removed ${removedCount} orphan mismatched recipes.`);

// Now let's check remaining items
let remainingMismatched = 0;
for (const item of createItems) {
  for (const r of (item.recipes || [])) {
    const producesSelf = (r.outputs || []).some(o => o.itemId === item.id || o.itemName.toLowerCase() === item.name.toLowerCase());
    if (!producesSelf) remainingMismatched++;
  }
}
console.log(`Remaining mismatched recipes: ${remainingMismatched}`);
