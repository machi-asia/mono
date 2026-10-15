import fs from 'fs';

const c = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');

const regex = /"itemId":\s*"([^"]+)",\s*"itemName":\s*"([^"]+)"/g;
let m;
const missing = new Map();

while ((m = regex.exec(c)) !== null) {
  const id = m[1];
  const name = m[2];
  if (!c.includes(`"id": "${id}"`)) {
    missing.set(id, name);
  }
}

console.log('Total referenced item IDs that are not top-level items in create.ts:', missing.size);
for (const [id, name] of missing.entries()) {
  console.log(`  - ${id}: "${name}"`);
}
