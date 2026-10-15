import fs from 'fs';

const items = [
  'Wooden Slab', 'Oak Planks', 'Comparator', 'Wooden Trapdoor', 'Wood Door',
  'Andesite Door', 'Copper Door', 'Brass Door', 'Framed Glass Door', 'Train Door',
  'Oak Button', 'Wood Button', 'Pressure Plate', 'Stone Slab', 'Kelp', 'Leaves', 'Wood',
  'Concrete Powder', 'Concrete', 'Stained Glass', 'Stained Glass Pane',
  'Water Bucket', 'Engine Piston', 'Polished Blackstone Slab', 'Blast Furnace',
  'Copper Rod', 'Capacitor', 'Electrum Wire', 'Integrated Circuit', 'Brass Nugget',
  'Honey (500mB)', 'Spring', 'Fireclay Ball', 'Button', 'Dye', 'Book', 'Name Tag',
  'Empty Blaze Burner', 'Copper Backtank', 'Cut Copper', 'Wooden Bracket', 'Metal Bracket',
  'Pulp', 'Log', 'Wool', 'Smart Chute', 'Framed Glass Pane', 'Gantry Shaft', 'Extendo Grip',
  'Wand Of Symmetry', 'Sticky Mechanical Piston', 'Windmill Sail Frame', 'Ornate Iron Window',
  'Industrial Iron Window', 'Weathered Iron Window', 'Oak Window Pane', 'Brown Toolbox',
  'Copper Valve Handle'
];

async function check() {
  console.log('Checking asset resolution for common raw ingredients...');
  for (const name of items) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    // check if local in public/items
    const local = fs.existsSync(`apps/itemlist-create/public/items/${slug}.png`);
    let itemUrl = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${slug}.png`;
    let blockUrl = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block/${slug}.png`;

    let status = local ? 'LOCAL_FOUND' : 'REMOTE_CHECK';
    if (!local) {
      const resItem = await fetch(itemUrl);
      if (resItem.ok) {
        status = 'GITHUB_ITEM_FOUND';
      } else {
        const resBlock = await fetch(blockUrl);
        if (resBlock.ok) {
          status = 'GITHUB_BLOCK_FOUND';
        } else {
          status = 'MISSING_ALL';
        }
      }
    }
    console.log(`[${status}] ${name} (slug: ${slug})`);
  }
}
check();
