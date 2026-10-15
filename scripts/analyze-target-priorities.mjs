import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

// Items with valid multiple recipes
const multiItems = [];

for (const item of createItems) {
  // Filter recipes to only those producing this item
  const valid = (item.recipes || []).filter(r =>
    (r.outputs || []).some(o => o.itemId === item.id || o.itemName.toLowerCase() === item.name.toLowerCase())
  );
  if (valid.length > 1) {
    multiItems.push({ id: item.id, name: item.name, valid });
  }
}

console.log(`Found ${multiItems.length} items with truly multiple valid recipes producing themselves.`);
for (const it of multiItems) {
  console.log(`\nItem: ${it.name} (${it.id}) - ${it.valid.length} recipes:`);
  it.valid.forEach((r, idx) => {
    console.log(`  [${idx}] ${r.name} (${r.method} via ${r.buildingRequired}) -> [${(r.ingredients||[]).map(i => `${i.amount}x ${i.itemName}`).join(', ')}]`);
  });
}
