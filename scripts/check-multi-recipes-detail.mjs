import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

// Examine each multiple recipe item to see the types of recipes
const multiItems = createItems.filter(i => i.recipes && i.recipes.length > 1);

console.log('Sample of multiple recipes:');
for (const it of multiItems.slice(0, 30)) {
  console.log(`\nItem: ${it.name} (${it.id})`);
  it.recipes.forEach((r, idx) => {
    console.log(`  [${idx}] ${r.name} (${r.method} via ${r.buildingRequired}) -> ings: [${(r.ingredients||[]).map(i => `${i.amount}x ${i.itemName}`).join(', ')}]`);
  });
}
