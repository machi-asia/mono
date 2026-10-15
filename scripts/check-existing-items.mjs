import fs from 'fs';

const c = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');

const checkItems = [
  'copper-backtank', 'extendo-grip', 'wand-of-symmetry', 'smart-chute',
  'gantry-shaft', 'sticky-mechanical-piston', 'empty-blaze-burner',
  'andesite-door', 'brass-door', 'copper-door', 'train-door', 'framed-glass-door',
  'framed-glass-pane', 'oak-window-pane', 'brown-toolbox', 'copper-valve-handle',
  'windmill-sail-frame', 'ornate-iron-window', 'industrial-iron-window',
  'weathered-iron-window', 'pulp', 'cardboard'
];

for (const id of checkItems) {
  const idx = c.indexOf(`"id": "${id}"`);
  if (idx !== -1) {
    const chunk = c.slice(idx, idx + 400);
    const iconMatch = chunk.match(/"icon":\s*"([^"]+)"/);
    console.log(`[FOUND] ${id} -> icon: ${iconMatch ? iconMatch[1] : 'NONE'}`);
  } else {
    console.log(`[NOT FOUND] ${id}`);
  }
}
