import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

const itemsWithMultiple = createItems.filter(i => i.recipes && i.recipes.length > 1);

console.log('Total items with multiple recipes in createItems:', itemsWithMultiple.length);
console.log(itemsWithMultiple.map(i => ({ id: i.id, name: i.name, count: i.recipes.length })));
