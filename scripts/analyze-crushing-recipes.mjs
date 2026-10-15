import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

const crushingToolItems = [];
const equipmentKeywords = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe', 'helmet', 'chestplate', 'leggings', 'boots', 'horse-armor', 'horse armor', 'saddle', 'shears', 'shield'];

for (const item of createItems) {
  if (item.recipes && item.recipes.length > 1) {
    const hasEquipmentIngredient = item.recipes.some(r =>
      (r.ingredients || []).some(i => equipmentKeywords.some(k => i.itemId.toLowerCase().includes(k) || i.itemName.toLowerCase().includes(k)))
    );
    if (hasEquipmentIngredient) {
      crushingToolItems.push({
        id: item.id,
        name: item.name,
        recipes: item.recipes.map(r => ({
          name: r.name,
          method: r.method,
          ingredients: (r.ingredients || []).map(i => i.itemName).join(', ')
        }))
      });
    }
  }
}

console.log(`Found ${crushingToolItems.length} items having recipes with tools/equipment as ingredients:`);
for (const it of crushingToolItems) {
  console.log(`\nItem: ${it.name} (${it.id})`);
  it.recipes.forEach((r, idx) => {
    console.log(`  [${idx}] ${r.name} (${r.method}) <- ${r.ingredients}`);
  });
}
