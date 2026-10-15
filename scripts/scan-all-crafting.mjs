import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const vanillaContent = fs.readFileSync('apps/itemlist-create/data/vanilla-crafting.ts', 'utf8');

function countCrafting(content, label) {
  const methodCrafting = (content.match(/"method":\s*"Crafting"/g) || []).length;
  const buildingCraftingTable = (content.match(/"buildingRequired":\s*"Crafting Table"/g) || []).length;
  console.log(`[${label}] "method": "Crafting": ${methodCrafting}, "buildingRequired": "Crafting Table": ${buildingCraftingTable}`);
}

countCrafting(createContent, 'create.ts');
countCrafting(vanillaContent, 'vanilla-crafting.ts');
