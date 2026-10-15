import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const startIdx = createContent.indexOf('"items": [');
const endIdx = createContent.lastIndexOf('...VANILLA_CRAFTING_ITEMS');

const beforeItems = createContent.slice(0, startIdx + '"items": ['.length);
const itemsRaw = createContent.slice(startIdx + '"items": ['.length, endIdx).trim();
const afterItems = createContent.slice(endIdx);

const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const createItems = JSON.parse('[' + cleanedRaw + ']');

let totalDeduped = 0;

for (const item of createItems) {
  if (item.recipes && item.recipes.length > 1) {
    const seen = new Set();
    const unique = [];

    // Prioritize clean names and correct building
    for (const r of item.recipes) {
      // Fix recipe title if it said "Casing" or "Mechanical Crafter" incorrectly
      if (r.name && r.name.includes(' - Casing')) {
        r.name = r.name.replace(' - Casing', ` - ${item.name}`);
      }
      if (r.name && r.name.includes(' - Mechanical Crafter') && item.id !== 'mechanical-crafter') {
        r.name = r.name.replace(' - Mechanical Crafter', ` - ${item.name}`);
      }

      const ingKey = (r.ingredients || [])
        .map(i => `${i.amount}x${i.itemId}`)
        .sort()
        .join('|');
      const key = `${r.buildingRequired}::${r.method}::${ingKey}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      } else {
        totalDeduped++;
      }
    }
    item.recipes = unique;
  }
}

console.log(`Removed ${totalDeduped} duplicate recipes.`);

// Write back create.ts with formatted items
const formattedItems = JSON.stringify(createItems, null, 2);
const innerItems = formattedItems.slice(1, formattedItems.length - 1).trim();

const newContent = `${beforeItems}\n${innerItems},\n  ${afterItems}`;
fs.writeFileSync('apps/itemlist-create/data/create.ts', newContent, 'utf8');
console.log('Successfully written clean deduplicated items.');
