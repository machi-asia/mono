import fs from 'fs';

let content = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');

// 1. Let's fix all uncleaned wikitext brackets {{MC|... / {{Mc|...
// Examples:
// "itemName": "Any {{MC|Wooden Slab" -> "itemName": "Wooden Slab", "itemId": "wooden-slab"
// "itemName": "{{MC|Stick" -> "itemName": "Stick", "itemId": "stick"
// "itemName": "Any {{MC|Wood Slab" -> "itemName": "Wooden Slab", "itemId": "wooden-slab"
// "itemName": "{{MC|Gold|Gold Ingot" -> "itemName": "Gold Ingot", "itemId": "gold-ingot"
// "itemName": "{{MC|Comparat" -> "itemName": "Comparator", "itemId": "comparator"
// "itemName": "{{MC|Wooden Trapdo" -> "itemName": "Wooden Trapdoor", "itemId": "wooden-trapdoor"

// Helper to clean wikitext
function cleanText(str) {
  let res = str
    .replace(/\{\{MC\|(?:[^|}]*\|)?([^}]+)\}\}?/gi, '$1')
    .replace(/\{\{Mc\|(?:[^|}]*\|)?([^}]+)\}\}?/gi, '$1')
    .replace(/\{\{ItemLink\|(?:[^|}]*\|)?([^}]+)\}\}?/gi, '$1')
    .replace(/\{\{[^|}]*\|/g, '')
    .replace(/\{\{[^}]+\}\}?/g, '')
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/'''?/g, '')
    .trim();

  // Fix known truncation or weird names
  if (res.toLowerCase().includes('comparat')) res = 'Comparator';
  if (res.toLowerCase().includes('wooden trapdo')) res = 'Wooden Trapdoor';
  if (res.toLowerCase().includes('wood slab') || res.toLowerCase().includes('wooden slab')) res = 'Wooden Slab';
  if (res.toLowerCase().includes('planks')) res = 'Oak Planks';
  if (res.toLowerCase().includes('wooden button')) res = 'Oak Button';
  if (res.toLowerCase().includes('gold ingot')) res = 'Gold Ingot';
  if (res.toLowerCase().includes('crafting table|')) res = 'Clipboard';

  return res;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 2. Parse items from create.ts
const startIdx = content.indexOf('"items": [');
const endIdx = content.lastIndexOf('...VANILLA_CRAFTING_ITEMS');

const beforeItems = content.slice(0, startIdx + '"items": ['.length);
const itemsRaw = content.slice(startIdx + '"items": ['.length, endIdx).trim();
const afterItems = content.slice(endIdx);

const cleanedRaw = itemsRaw.replace(/,\s*$/, '');
const items = JSON.parse('[' + cleanedRaw + ']');

let replacedCraftingCount = 0;
let cleanedNamesCount = 0;

for (const item of items) {
  if (item.recipes) {
    for (const r of item.recipes) {
      // Clean ingredients
      for (const ing of (r.ingredients || [])) {
        if (ing.itemName && (ing.itemName.includes('{{') || ing.itemName.includes('MC|') || ing.itemName.startsWith('Any '))) {
          const prevName = ing.itemName;
          let cleaned = cleanText(ing.itemName);
          if (cleaned.startsWith('Any ')) cleaned = cleaned.replace(/^Any\s+/, '');
          ing.itemName = cleaned;
          ing.itemId = slugify(cleaned);
          cleanedNamesCount++;
        }
      }

      // Clean outputs
      for (const out of (r.outputs || [])) {
        if (out.itemName && (out.itemName.includes('{{') || out.itemName.includes('MC|') || out.itemName.startsWith('Any '))) {
          let cleaned = cleanText(out.itemName);
          if (cleaned.startsWith('Any ')) cleaned = cleaned.replace(/^Any\s+/, '');
          out.itemName = cleaned;
          out.itemId = slugify(cleaned);
          cleanedNamesCount++;
        }
      }

      // Check if this is Crafting / Crafting Table
      if (r.method === 'Crafting' || r.buildingRequired === 'Crafting Table') {
        r.method = 'Mechanical Crafting';
        r.buildingRequired = 'Mechanical Crafter';
        if (r.name && r.name.startsWith('Crafting Table -')) {
          r.name = r.name.replace(/^Crafting Table -/, 'Mechanical Crafter -');
        } else if (r.name && r.name.includes('Crafting')) {
          r.name = r.name.replace(/Crafting/g, 'Mechanical Crafting');
        }
        if (!r.speedRpm) r.speedRpm = 64;
        if (!r.processingTimeSeconds) r.processingTimeSeconds = 4;
        replacedCraftingCount++;
      }
    }

    // Deduplicate recipes if an item now has two identical Mechanical Crafter recipes
    const seen = new Set();
    const uniqueRecipes = [];
    for (const r of item.recipes) {
      const ingKey = (r.ingredients || []).map(i => `${i.itemId}:${i.amount}`).sort().join('|');
      const outKey = (r.outputs || []).map(o => `${o.itemId}:${o.amount}`).sort().join('|');
      const key = `${r.buildingRequired}::${ingKey}::${outKey}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRecipes.push(r);
      }
    }
    item.recipes = uniqueRecipes;
  }
}

console.log(`Replaced ${replacedCraftingCount} Crafting Table recipes with Mechanical Crafter.`);
console.log(`Cleaned ${cleanedNamesCount} wikitext/corrupted ingredient names.`);

// Write back create.ts with formatted items
const formattedItems = JSON.stringify(items, null, 2);
// Strip outermost brackets [ and ]
const innerItems = formattedItems.slice(1, formattedItems.length - 1).trim();

const newContent = `${beforeItems}\n${innerItems},\n  ${afterItems}`;
fs.writeFileSync('apps/itemlist-create/data/create.ts', newContent, 'utf8');
console.log('Successfully updated apps/itemlist-create/data/create.ts');
