import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const vanillaContent = fs.readFileSync('apps/itemlist-create/data/vanilla-crafting.ts', 'utf8');

// Parse items from create.ts
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

console.log('Total Create items:', createItems.length);

const itemsWithMultiple = [];
for (const item of createItems) {
  if (item.recipes && item.recipes.length > 1) {
    itemsWithMultiple.push({
      id: item.id,
      name: item.name,
      recipes: item.recipes.map(r => ({
        id: r.id,
        name: r.name,
        method: r.method,
        building: r.buildingRequired,
        ingredients: (r.ingredients || []).map(i => `${i.amount}x ${i.itemName}`).join(', ')
      }))
    });
  }
}

console.log(`Found ${itemsWithMultiple.length} items with multiple recipes in create.ts:`);
for (const it of itemsWithMultiple) {
  console.log(`\n=== [${it.id}] ${it.name} (${it.recipes.length} recipes) ===`);
  it.recipes.forEach((r, idx) => {
    console.log(`  [${idx}] ${r.name || r.id} (${r.method} via ${r.building}): ${r.ingredients}`);
  });
}
