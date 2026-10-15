import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');

// Match all icon declarations
const iconRegex = /icon:\s*['"]([^'"]+)['"]/g;
let match;
const missing = new Set();
const corrupted = new Set();
const found = new Set();

while ((match = iconRegex.exec(content)) !== null) {
  const iconPath = match[1];
  const localPath = path.join('apps/itemlist-create/public', iconPath.replace(/^\//, ''));
  if (!fs.existsSync(localPath)) {
    missing.add(iconPath);
  } else {
    const stat = fs.statSync(localPath);
    if (stat.size < 200) {
      const head = fs.readFileSync(localPath, 'utf8');
      if (head.includes('html') || head.includes('<!DOCTYPE')) {
        corrupted.add(iconPath);
      } else {
        found.add(iconPath);
      }
    } else {
      found.add(iconPath);
    }
  }
}

// Check machines as well
const machineRegex = /machines:\s*\[([\s\S]*?)\];/;
const mMatch = content.match(machineRegex);
if (mMatch) {
  let mIconRegex = /icon:\s*['"]([^'"]+)['"]/g;
  let mm;
  while ((mm = mIconRegex.exec(mMatch[1])) !== null) {
    const iconPath = mm[1];
    const localPath = path.join('apps/itemlist-create/public', iconPath.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      missing.add(iconPath);
    }
  }
}

console.log('--- SCAN RESULTS ---');
console.log('Total valid icons:', found.size);
console.log('Missing icons (' + missing.size + '):', Array.from(missing));
console.log('Corrupted icons (' + corrupted.size + '):', Array.from(corrupted));

// Also check all items to see if any items have no icon or fall back to default
const itemBlockRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]([^}]+)\}/g;
let iMatch;
const itemsWithoutIcon = [];
while ((iMatch = itemBlockRegex.exec(content)) !== null) {
  const id = iMatch[1];
  const name = iMatch[2];
  const rest = iMatch[3];
  if (!rest.includes('icon:')) {
    itemsWithoutIcon.push({ id, name });
  }
}
console.log('Items without icon field (' + itemsWithoutIcon.length + '):', itemsWithoutIcon);

// Check all recipe outputs and inputs to see if they exist as items in createItems
// In create.ts, let's see how createItems is defined
