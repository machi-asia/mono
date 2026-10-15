import fs from 'fs';
import path from 'path';

const PUBLIC_ITEMS_DIR = 'apps/itemlist-create/public/items';

// Known aliases to local files that already exist
const LOCAL_COPIES = [
  ['oak_planks_3.png', 'oak_planks.png'],
  ['oak_planks_3.png', 'wooden_slab.png'],
  ['oak_log_1.png', 'oak_log.png'],
  ['oak_log_1.png', 'log.png'],
  ['oak_log_1.png', 'wood.png'],
  ['oak_trapdoor.png', 'wooden_trapdoor.png'],
  ['oak_trapdoor.png', 'wood_trapdoor.png'],
  ['oak_door.png', 'wood_door.png'],
  ['oak_leaves.png', 'leaves.png'],
  ['white_concrete_powder.png', 'concrete_powder.png'],
  ['white_concrete.png', 'concrete.png'],
  ['glass_1.png', 'stained_glass.png'],
  ['glass_1.png', 'stained_glass_pane.png'],
  ['glass_pane__ew__je12.png', 'framed_glass_pane.png'],
  ['glass_pane__ew__je12.png', 'oak_window_pane.png'],
  ['white_wool.png', 'wool.png'],
  ['brown_toolbox_1.png', 'brown_toolbox.png'],
  ['shaft.png', 'gantry_shaft.png'],
  ['mechanical_piston.png', 'sticky_mechanical_piston.png'],
  ['mechanical_piston.png', 'engine_piston.png'],
  ['stone_slab.png', 'polished_blackstone_slab.png'],
  ['torsion_spring.png', 'spring.png'],
  ['chute.png', 'smart_chute.png'],
  ['sail_frame.png', 'windmill_sail_frame.png'],
  ['stone_1.png', 'button.png'],
  ['stone_1.png', 'oak_button.png'],
  ['stone_1.png', 'wood_button.png'],
  ['stone_1.png', 'pressure_plate.png'],
  ['fireclay.png', 'fireclay_ball.png'],
  ['block_of_cardboard_1.png', 'pulp.png'],
  ['red_dye.png', 'dye.png'],
  ['andesite_door_block.png', 'andesite_door.png'],
  ['copper_nugget_je1_be1.png', 'copper_rod.png'],
  ['copper_nugget_je1_be1.png', 'electrum_wire.png'],
  ['zinc_nugget.png', 'brass_nugget.png'],
  ['honey.png', 'honey_500mb_.png'],
  ['precision_mechanism.png', 'integrated_circuit.png'],
  ['precision_mechanism.png', 'capacitor.png'],
  ['ornate_iron_window.png', 'ornate_iron_window.png']
];

for (const [src, dst] of LOCAL_COPIES) {
  const srcPath = path.join(PUBLIC_ITEMS_DIR, src);
  const dstPath = path.join(PUBLIC_ITEMS_DIR, dst);
  if (fs.existsSync(srcPath) && !fs.existsSync(dstPath)) {
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Copied ${src} -> ${dst}`);
  }
}

// Download missing official vanilla textures from GitHub assets
const REMOTE_DOWNLOADS = [
  ['https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block/blast_furnace_front.png', 'blast_furnace.png'],
  ['https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/comparator.png', 'comparator.png'],
  ['https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block/oak_trapdoor.png', 'oak_trapdoor.png'],
  ['https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block/oak_door_top.png', 'oak_door_top.png'],
  ['https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block/stone.png', 'stone_button.png']
];

async function runDownloads() {
  for (const [url, file] of REMOTE_DOWNLOADS) {
    const dstPath = path.join(PUBLIC_ITEMS_DIR, file);
    if (!fs.existsSync(dstPath)) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(dstPath, buf);
          console.log(`Downloaded ${file} (${buf.length} bytes)`);
        }
      } catch (e) {
        console.error(`Failed ${file}:`, e.message);
      }
    }
  }
}

runDownloads().then(() => console.log('Done preparing assets.'));
