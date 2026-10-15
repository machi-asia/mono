import fs from 'fs';
import path from 'path';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const vanillaContent = fs.readFileSync('apps/itemlist-create/data/vanilla-crafting.ts', 'utf8');
const rawIconsContent = fs.readFileSync('apps/itemlist-create/data/raw-item-icons.ts', 'utf8');

// Parse RAW_ITEM_ICONS
const rawIconsMatch = rawIconsContent.match(/export const RAW_ITEM_ICONS: Record<string, string> = \{([\s\S]*?)\};/);
const rawIcons = {};
if (rawIconsMatch) {
  const lines = rawIconsMatch[1].split('\n');
  for (const l of lines) {
    const m = l.match(/"([^"]+)":\s*"([^"]+)"/);
    if (m) rawIcons[m[1]] = m[2];
  }
}

// Collect all items defined
const definedItems = new Map();
const itemRegex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"icon":\s*"([^"]+)"/g;
let m;
while ((m = itemRegex.exec(createContent)) !== null) {
  definedItems.set(m[1], { name: m[2], icon: m[4] });
}
const vItemRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*icon:\s*([^\n,]+)/g;
while ((m = vItemRegex.exec(vanillaContent)) !== null) {
  definedItems.set(m[1], { name: m[2], icon: m[4] });
}

// Collect all ingredient names used in create.ts & vanillaContent
const ingRegex = /"itemId":\s*"([^"]+)",\s*"itemName":\s*"([^"]+)"/g;
const allIngredients = new Map();
while ((m = ingRegex.exec(createContent)) !== null) {
  allIngredients.set(m[1], m[2]);
}
while ((m = ingRegex.exec(vanillaContent)) !== null) {
  allIngredients.set(m[1], m[2]);
}

console.log('Total unique ingredient items:', allIngredients.size);

// For every ingredient: check if it has an icon
// How graph-builder resolves icon:
// 1. definedItems.get(itemId)?.icon
// 2. RAW_ITEM_ICONS[itemName] || RAW_ITEM_ICONS[cleanName]
// 3. fallback to InventivetalentDev item texture: https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${assetName}.png
// 4. local file if path starts with /items/

const unresolved = [];
for (const [id, name] of allIngredients.entries()) {
  const def = definedItems.get(id);
  const raw = rawIcons[name];
  if (!def && !raw) {
    unresolved.push({ id, name });
  }
}

console.log('Ingredients without defined item or RAW_ITEM_ICONS mapping (' + unresolved.length + '):');
for (const u of unresolved) {
  console.log(`  - ${u.id}: "${u.name}"`);
}
