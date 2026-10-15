import fs from 'fs';
import path from 'path';

// Let's load create.ts and vanilla-crafting.ts
// Since they are TypeScript files with ES module syntax, let's extract all item definitions and recipe ingredient/output IDs using regex or ts runner.

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');
const vanillaContent = fs.readFileSync('apps/itemlist-create/data/vanilla-crafting.ts', 'utf8');

// Find all defined item IDs and their icons
const definedItems = new Map(); // id -> { name, icon, source }

// Parse items in createContent
const itemRegex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"icon":\s*"([^"]+)"/g;
let m;
while ((m = itemRegex.exec(createContent)) !== null) {
  definedItems.set(m[1], { name: m[2], icon: m[4], source: 'create.ts' });
}

// Parse items in vanillaContent
const vItemRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*icon:\s*([^\n,]+)/g;
while ((m = vItemRegex.exec(vanillaContent)) !== null) {
  definedItems.set(m[1], { name: m[2], icon: m[4], source: 'vanilla-crafting.ts' });
}

console.log('Total defined items:', definedItems.size);

// Now find all ingredient and output references across both files
const refRegex = /"itemId":\s*"([^"]+)",\s*"itemName":\s*"([^"]+)"/g;
const missingItems = new Map(); // id -> itemName
while ((m = refRegex.exec(createContent)) !== null) {
  const id = m[1];
  const name = m[2];
  if (!definedItems.has(id)) {
    missingItems.set(id, name);
  }
}
while ((m = refRegex.exec(vanillaContent)) !== null) {
  const id = m[1];
  const name = m[2];
  if (!definedItems.has(id)) {
    missingItems.set(id, name);
  }
}

console.log('Referenced items with NO item definition (' + missingItems.size + '):');
for (const [id, name] of missingItems.entries()) {
  console.log(`  - ${id} ("${name}")`);
}

// Also check all defined items whose icon file does not exist in public/ or cannot be loaded
const missingIconFiles = [];
for (const [id, info] of definedItems.entries()) {
  if (info.icon.startsWith('/items/')) {
    const diskPath = path.join('apps/itemlist-create/public', info.icon);
    if (!fs.existsSync(diskPath)) {
      missingIconFiles.push({ id, name: info.name, icon: info.icon, diskPath });
    }
  }
}
console.log('Defined items with missing icon files on disk (' + missingIconFiles.length + '):');
for (const item of missingIconFiles) {
  console.log(`  - ${item.id}: ${item.icon}`);
}
