import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

let mismatchedCount = 0;
const mismatchedItems = [];

for (const item of createItems) {
  if (item.recipes) {
    const badRecipes = [];
    const goodRecipes = [];
    for (const r of item.recipes) {
      const producesThisItem = (r.outputs || []).some(o => o.itemId === item.id || o.itemName.toLowerCase() === item.name.toLowerCase());
      if (!producesThisItem) {
        badRecipes.push(r);
      } else {
        goodRecipes.push(r);
      }
    }
    if (badRecipes.length > 0) {
      mismatchedCount += badRecipes.length;
      mismatchedItems.push({
        itemId: item.id,
        itemName: item.name,
        badCount: badRecipes.length,
        goodCount: goodRecipes.length,
        badOutputs: badRecipes.map(b => (b.outputs || []).map(o => o.itemName).join(', '))
      });
    }
  }
}

console.log(`Total mismatched recipes across all items: ${mismatchedCount}`);
console.log(`Items affected (${mismatchedItems.length}):`);
for (const m of mismatchedItems) {
  console.log(`  - ${m.itemName} (${m.itemId}): has ${m.badCount} bad recipes producing: [${m.badOutputs.join(' | ')}] (good recipes: ${m.goodCount})`);
}
