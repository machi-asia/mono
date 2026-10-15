import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CREATE_APP_DIR = path.join(ROOT, 'apps', 'itemlist-create');
const CREATE_DATA_PATH = path.join(CREATE_APP_DIR, 'data', 'create.ts');
const PUBLIC_ITEMS_DIR = path.join(CREATE_APP_DIR, 'public', 'items');

const API_BASE = 'https://createmodminecraft.miraheze.org/w/api.php';

async function fetchWiki(params) {
  const url = new URL(API_BASE);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set('format', 'json');
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'MachiCreateModSync/1.0 (contact: admin@machi.asia)' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return await res.json();
}

function cleanWikiText(str) {
  if (!str) return '';
  return str
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/\{\{MC\|(?:[^|}]*\|)?([^}]+)\}\}/gi, '$1')
    .replace(/\{\{Mc\|(?:[^|}]*\|)?([^}]+)\}\}/gi, '$1')
    .replace(/\{\{ItemLink\|(?:[^|}]*\|)?([^}]+)\}\}/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/'''?/g, '')
    .trim();
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getPagesWithTemplate(templateTitle) {
  const pages = [];
  let eicontinue = undefined;
  while (true) {
    const params = {
      action: 'query',
      list: 'embeddedin',
      eititle: templateTitle,
      eilimit: '500'
    };
    if (eicontinue) params.eicontinue = eicontinue;
    const res = await fetchWiki(params);
    if (res.query?.embeddedin) {
      pages.push(...res.query.embeddedin.map(p => p.title));
    }
    if (res.continue?.eicontinue) {
      eicontinue = res.continue.eicontinue;
    } else {
      break;
    }
  }
  return pages;
}

async function getPageWikitext(title) {
  try {
    const res = await fetchWiki({
      action: 'parse',
      page: title,
      prop: 'wikitext|images',
      redirects: '1'
    });
    return {
      title: res.parse?.title || title,
      wikitext: res.parse?.wikitext?.['*'] || '',
      images: res.parse?.images || []
    };
  } catch (err) {
    return { title, wikitext: '', images: [], error: err.message };
  }
}

async function getImageUrl(fileName) {
  try {
    const res = await fetchWiki({
      action: 'query',
      titles: 'File:' + fileName,
      prop: 'imageinfo',
      iiprop: 'url'
    });
    const page = Object.values(res.query?.pages || {})[0];
    return page?.imageinfo?.[0]?.url || null;
  } catch {
    return null;
  }
}

async function downloadIconIfMissing(imageFileName, destFileName) {
  const targetPath = path.join(PUBLIC_ITEMS_DIR, destFileName);
  if (fs.existsSync(targetPath)) {
    const buf = fs.readFileSync(targetPath);
    if (!buf.slice(0, 15).toString().includes('<html') && !buf.slice(0, 15).toString().includes('<!DOCTYPE')) {
      return true;
    }
  }

  const url = await getImageUrl(imageFileName);
  if (!url) return false;

  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    if (buf.slice(0, 15).toString().includes('<html') || buf.slice(0, 15).toString().includes('<!DOCTYPE')) {
      return false;
    }
    fs.writeFileSync(targetPath, buf);
    console.log(`[ICON] Downloaded: ${destFileName} (${buf.length} bytes)`);
    return true;
  } catch (err) {
    return false;
  }
}

// Officially removed items in Create as defined in Navboxes
const EXPLICITLY_REMOVED_ITEMS = new Set([
  'adjustable crate', 'adjustable repeater', 'adjustable pulse repeater', 'cocoa jungle log',
  'belt observer', 'extractor', 'linked extractor', 'funnel (removed)', 'furnace engine',
  'transposer', 'linked transposer', 'belt support', 'dark scoria', 'chiseled dark scoria',
  'dark scoria cobblestone', 'fancy dark scoria bricks', 'paved dark scoria', 'dolomite',
  'chiseled dolomite', 'dolomite cobblestone', 'fancy dolomite bricks', 'paved dolomite',
  'gabbro', 'chiseled gabbro', 'gabbro cobblestone', 'fancy gabbro bricks', 'paved gabbro',
  'limesand', 'weathered limestone', 'chiseled weathered limestone', 'weathered limestone cobblestone',
  'fancy weathered limestone bricks', 'paved weathered limestone', 'crushed brass',
  'lapis sheet', 'integrated circuit', 'blaze brass', 'chorus chrome', 'chromatic compound',
  'shadow steel', 'refined radiance', 'quality tool handle', 'deforester', 'handheld blockzapper',
  'blazing axe', 'blazing pickaxe', 'blazing shovel', 'blazing sword',
  'gilded quartz axe', 'gilded quartz pickaxe', 'gilded quartz shovel', 'gilded quartz sword',
  'shadow steel garden mattock', 'shadow steel pickaxe', 'shadow steel sword'
]);

function parseExistingItems(content) {
  const marker = '"items": [';
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) throw new Error('Could not find items array in create.ts');
  const itemsStart = startIdx + marker.length;
  const itemsEnd = content.lastIndexOf('...VANILLA_CRAFTING_ITEMS');
  if (itemsEnd === -1) throw new Error('Could not find ...VANILLA_CRAFTING_ITEMS marker');
  
  let jsonChunk = content.slice(itemsStart, itemsEnd).trim();
  if (jsonChunk.endsWith(',')) jsonChunk = jsonChunk.slice(0, -1);
  jsonChunk = jsonChunk.trim();
  const parsed = JSON.parse('[' + jsonChunk + ']');
  return { parsed, prefix: content.slice(0, itemsStart), suffix: content.slice(itemsEnd) };
}

function parseAmount(str) {
  if (!str) return 1;
  const m = str.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

async function runSync() {
  console.log('--- Step 1: Loading existing dataset ---');
  const fileContent = fs.readFileSync(CREATE_DATA_PATH, 'utf8');
  const { parsed: existingItems, prefix, suffix } = parseExistingItems(fileContent);
  console.log(`Loaded ${existingItems.length} items from create.ts.`);

  console.log('--- Step 2: Removing officially removed items ---');
  const itemsList = [];
  for (const item of existingItems) {
    if (item.sourceMod === 'Vanilla') {
      itemsList.push(item);
      continue;
    }
    const nameLower = item.name.toLowerCase();
    const idLower = item.id.toLowerCase();
    if (!EXPLICITLY_REMOVED_ITEMS.has(nameLower) && !EXPLICITLY_REMOVED_ITEMS.has(idLower)) {
      itemsList.push(item);
    }
  }

  // Build item lookup maps
  const itemMap = new Map();
  const nameToItem = new Map();
  for (const it of itemsList) {
    itemMap.set(it.id, it);
    nameToItem.set(it.name.toLowerCase(), it);
  }

  console.log('--- Step 3: Discovering all active pages & new items from wiki ---');
  const templates = [
    'Template:RecipeTable',
    'Template:Crafting Table',
    'Template:Mechanical Crafter',
    'Template:Mechanical Mixer',
    'Template:Mechanical Press',
    'Template:Mechanical Saw',
    'Template:Sequenced Assembly',
    'Template:Millstone',
    'Template:Spout',
    'Template:Encased Fan'
  ];

  const recipePageSet = new Set([
    'Crushing',
    'Milling',
    'Bulk Washing',
    'Bulk Haunting',
    'Filling'
  ]);

  for (const t of templates) {
    const list = await getPagesWithTemplate(t);
    list.forEach(p => recipePageSet.add(p));
  }

  // 0.6.x modern logistics and machinery additions
  const modernItems = [
    'Cardboard', 'Cardboard Sword', 'Cardboard Armor', 'Cardboard Package',
    'Package Frogport', 'Packager', 'Re-Packager', 'Factory Gauge',
    'Stock Link', 'Stock Ticker', 'Redstone Requester', 'Table Cloth',
    'Chain Conveyor', 'Postbox'
  ];
  modernItems.forEach(p => recipePageSet.add(p));

  const recipePages = Array.from(recipePageSet).filter(p => !p.startsWith('Template:') && !p.startsWith('Style Guide/') && !p.startsWith('Tutorials/'));
  console.log(`Discovered ${recipePages.length} active wiki pages.`);

  let newlyCreatedItems = 0;
  let addedRecipes = 0;

  for (let i = 0; i < recipePages.length; i++) {
    const title = recipePages[i];
    const { wikitext, images } = await getPageWikitext(title);
    if (!wikitext) continue;

    // Check if this page represents a new item not currently in dataset
    const pageSlug = slugify(title);
    const cleanTitle = cleanWikiText(title);

    // Skip mechanic pages from being registered as items
    const isMechanicPage = ['crushing', 'milling', 'bulk-washing', 'bulk-haunting', 'filling'].includes(pageSlug);

    let pageItem = nameToItem.get(cleanTitle.toLowerCase()) || itemMap.get(pageSlug);

    // If item doesn't exist yet and page has recipe or item infobox, create it!
    const hasInfobox = wikitext.includes('{{Item') || wikitext.includes('{{Block');
    const hasRecipe = wikitext.includes('{{RecipeTable') || wikitext.includes('{{Crafting Table');

    if (!pageItem && !isMechanicPage && (hasInfobox || hasRecipe)) {
      let iconSlug = `${pageSlug.replace(/-/g, '_')}.png`;
      let wikiImage = images.find(img => img.toLowerCase().includes(pageSlug) || img.toLowerCase().includes(cleanTitle.toLowerCase().replace(/\s+/g, '_')));
      if (wikiImage) {
        await downloadIconIfMissing(wikiImage, iconSlug);
      }

      let category = 'Logistics & Components';
      if (title.toLowerCase().includes('armor') || title.toLowerCase().includes('sword')) category = 'Equipment & Utilities';
      else if (title.toLowerCase().includes('cardboard') || title.toLowerCase().includes('package')) category = 'Materials & Packaging';
      else if (title.toLowerCase().includes('gauge') || title.toLowerCase().includes('requester') || title.toLowerCase().includes('ticker')) category = 'Redstone & Displays';

      pageItem = {
        id: pageSlug,
        name: cleanTitle,
        category: category,
        icon: `/items/${iconSlug}`,
        description: `${cleanTitle} from Create Mod and connected expansions.`,
        recipes: [],
        sourceMod: 'Create Mod'
      };

      itemsList.push(pageItem);
      itemMap.set(pageSlug, pageItem);
      nameToItem.set(cleanTitle.toLowerCase(), pageItem);
      newlyCreatedItems++;
      console.log(`[NEW ITEM] Added: ${cleanTitle} (${pageSlug})`);
    }

    // Parse recipes
    const tableRegex = /\{\{RecipeTable\s*([\s\S]*?)\}\}/gi;
    let match;
    while ((match = tableRegex.exec(wikitext)) !== null) {
      const block = match[1];
      const p1 = block.indexOf('|');
      if (p1 === -1) continue;
      const p2 = block.indexOf('|', p1 + 1);
      if (p2 === -1) continue;
      const p3 = block.indexOf('|', p2 + 1);

      let rawOutput = cleanWikiText(block.slice(p1 + 1, p2));
      let rawIng = cleanWikiText(p3 !== -1 ? block.slice(p2 + 1, p3) : block.slice(p2 + 1));
      if (!rawOutput || !rawIng) continue;

      let outAmount = 1;
      const outCommaMatch = rawOutput.match(/^(.+?)[,x]\s*(\d+)$/);
      if (outCommaMatch) {
        rawOutput = outCommaMatch[1].trim();
        outAmount = parseInt(outCommaMatch[2], 10);
      }

      let targetItem = nameToItem.get(rawOutput.toLowerCase()) || itemMap.get(slugify(rawOutput));
      if (!targetItem) {
        const outSlug = slugify(rawOutput);
        targetItem = {
          id: outSlug,
          name: rawOutput,
          category: 'Logistics & Components',
          icon: `/items/${outSlug.replace(/-/g, '_')}.png`,
          description: `${rawOutput} added from Create Mod recipes.`,
          recipes: [],
          sourceMod: 'Create Mod'
        };
        itemsList.push(targetItem);
        itemMap.set(outSlug, targetItem);
        nameToItem.set(rawOutput.toLowerCase(), targetItem);
        newlyCreatedItems++;
        console.log(`[NEW RECIPE ITEM] Added: ${rawOutput} (${outSlug})`);
      }

      let method = 'Crafting';
      let building = 'Crafting Table';
      let speed = 64;
      let timeSec = 4;

      if (block.includes('Mechanical Crafter')) {
        method = 'Mechanical Crafting';
        building = 'Mechanical Crafter';
      } else if (block.includes('Mechanical Mixer')) {
        method = block.includes('Heating=Super-Heated') ? 'Mixing (Super-Heated)' : (block.includes('Heating=Heated') ? 'Mixing (Heated)' : 'Mixing');
        building = 'Mechanical Mixer';
        speed = 64;
        timeSec = 3;
      } else if (block.includes('Mechanical Press')) {
        method = block.includes('compacting') ? 'Compacting' : 'Pressing';
        building = 'Mechanical Press';
        speed = 64;
        timeSec = 2;
      } else if (block.includes('Mechanical Saw')) {
        method = 'Sawing';
        building = 'Mechanical Saw';
        speed = 64;
        timeSec = 2;
      } else if (block.includes('Sequenced Assembly')) {
        method = 'Sequenced Assembly';
        building = 'Deployer';
        speed = 64;
        timeSec = 10;
      } else if (block.includes('Manual Application')) {
        method = 'Manual Application';
        building = 'Manual Application';
        speed = 0;
        timeSec = 1;
      } else if (block.includes('Spout')) {
        method = 'Spout Filling';
        building = 'Spout';
        speed = 0;
        timeSec = 1;
      } else if (block.includes('Millstone')) {
        method = 'Milling';
        building = 'Millstone';
        speed = 64;
        timeSec = 5;
      } else if (block.includes('Encased Fan')) {
        if (block.toLowerCase().includes('washing')) {
          method = 'Bulk Washing';
          building = 'Encased Fan';
          speed = 128;
          timeSec = 7.5;
        } else if (block.toLowerCase().includes('haunting')) {
          method = 'Bulk Haunting';
          building = 'Encased Fan';
          speed = 128;
          timeSec = 7.5;
        } else if (block.toLowerCase().includes('smoking')) {
          method = 'Bulk Smoking';
          building = 'Encased Fan';
          speed = 128;
          timeSec = 7.5;
        } else {
          method = 'Bulk Blasting';
          building = 'Encased Fan';
          speed = 128;
          timeSec = 7.5;
        }
      }

      const ingTokens = rawIng.split(/\+|or|\n/).map(s => s.trim()).filter(Boolean);
      const parsedIngredients = [];
      for (const token of ingTokens) {
        const cleanToken = cleanWikiText(token);
        if (!cleanToken || cleanToken.toLowerCase().startsWith('any')) {
          const genericName = cleanToken || 'Material';
          parsedIngredients.push({
            itemId: slugify(genericName),
            itemName: genericName,
            amount: 1
          });
          continue;
        }
        const amt = parseAmount(cleanToken);
        const nameOnly = cleanToken.replace(/^\d+x?\s*/, '').replace(/,\s*\d+$/, '').trim();
        parsedIngredients.push({
          itemId: slugify(nameOnly),
          itemName: nameOnly,
          amount: amt
        });
      }

      if (parsedIngredients.length > 0) {
        const recipeId = `recipe-${targetItem.id}-${slugify(method)}-wiki-${targetItem.recipes.length}`;
        const exists = targetItem.recipes.some(r =>
          r.method === method &&
          r.ingredients.length === parsedIngredients.length &&
          r.ingredients.every((ing, idx) => ing.itemId === parsedIngredients[idx]?.itemId)
        );

        if (!exists) {
          targetItem.recipes.push({
            id: recipeId,
            name: `${building} - ${targetItem.name}`,
            method: method,
            buildingRequired: building,
            processingTimeSeconds: timeSec,
            ingredients: parsedIngredients,
            outputs: [
              {
                itemId: targetItem.id,
                itemName: targetItem.name,
                amount: outAmount
              }
            ],
            speedRpm: speed,
            sourceMod: 'Create Mod'
          });
          addedRecipes++;
        }
      }
    }
  }

  console.log(`\nSynchronization complete: added ${newlyCreatedItems} new items and ${addedRecipes} recipes.`);
  console.log('Total items in dataset:', itemsList.length);

  console.log('--- Step 4: Serializing updated create.ts ---');
  const itemsJson = JSON.stringify(itemsList, null, 2);
  const indentedItems = itemsJson.slice(1, -1).trim();
  const newContent = `${prefix}\n  ${indentedItems},\n    ${suffix.trim()}`;
  fs.writeFileSync(CREATE_DATA_PATH, newContent, 'utf8');
  console.log(`Successfully updated ${CREATE_DATA_PATH}`);
}

runSync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
