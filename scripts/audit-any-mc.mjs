import fs from 'fs';

const createContent = fs.readFileSync('apps/itemlist-create/data/create.ts', 'utf8');

// Find all occurrences of {{ in createContent
const braces = createContent.match(/\{\{[^"\n]+/g);
console.log('Uncleaned wikitext tags in create.ts (' + (braces ? braces.length : 0) + '):');
if (braces) {
  const unique = Array.from(new Set(braces));
  console.log(unique);
}
