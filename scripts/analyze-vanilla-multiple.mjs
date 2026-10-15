import fs from 'fs';

const vContent = fs.readFileSync('apps/itemlist-create/data/vanilla-crafting.ts', 'utf8');

// Parse items in vanillaContent
const vItemRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"[\s\S]*?recipes:\s*\[([\s\S]*?)\]\s*\}/g;
let m;
const multipleInVanilla = [];

while ((m = vItemRegex.exec(vContent)) !== null) {
  const id = m[1];
  const name = m[2];
  const recipesBlock = m[3];
  const count = (recipesBlock.match(/id:\s*"[^"]+"/g) || []).length;
  if (count > 1) {
    multipleInVanilla.push({ id, name, count });
  }
}

console.log(`Total items with multiple recipes in vanilla-crafting.ts: ${multipleInVanilla.length}`);
for (const it of multipleInVanilla) {
  console.log(`  - ${it.id} (${it.name}): ${it.count} recipes`);
}
