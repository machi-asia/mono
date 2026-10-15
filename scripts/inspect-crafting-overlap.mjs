import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');

const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length - 1, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '') + ']';

let items = JSON.parse(cleanedRaw);

let countItemsWithCrafting = 0;
let countItemsWithCrafterAndCrafting = 0;
let countItemsWithOnlyCrafting = 0;
const onlyCraftingList = [];

for (const item of items) {
  const craftingRecipes = (item.recipes || []).filter(r => r.method === 'Crafting' || r.buildingRequired === 'Crafting Table');
  const crafterRecipes = (item.recipes || []).filter(r => r.method === 'Mechanical Crafting' || r.buildingRequired === 'Mechanical Crafter');

  if (craftingRecipes.length > 0) {
    countItemsWithCrafting++;
    if (crafterRecipes.length > 0) {
      countItemsWithCrafterAndCrafting++;
    } else {
      countItemsWithOnlyCrafting++;
      onlyCraftingList.push({ id: item.id, name: item.name, count: craftingRecipes.length });
    }
  }
}

console.log('Total items with Crafting Table recipe:', countItemsWithCrafting);
console.log('Items with BOTH Mechanical Crafter and Crafting Table:', countItemsWithCrafterAndCrafting);
console.log('Items with ONLY Crafting Table (' + countItemsWithOnlyCrafting + '):');
for (const it of onlyCraftingList) {
  console.log(`  - ${it.id} (${it.name})`);
}
