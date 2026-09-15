import type { GameDataset, GameItem, Recipe, Ingredient, OutputItem } from "./types";

function unescapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function getAttr(str: string, attr: string): string {
  const match = str.match(new RegExp(`${attr}="([^"]*)"`));
  return match ? unescapeXml(match[1]) : "";
}

function getTag(str: string, tag: string): string {
  const match = str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? unescapeXml(match[1].trim()) : "";
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parses game items dataset from XML formatted string.
 * Supports both standard `<game>` XML schema and LRL `<items>` XML schema.
 */
export function parseGameDatasetXml(xml: string): GameDataset {
  const gameOpen = xml.match(/<game[^>]*>/)?.[0];

  if (gameOpen) {
    const id = getAttr(gameOpen, "id");
    const name = getAttr(gameOpen, "name");
    const tagline = getTag(xml, "tagline");

    const items: GameItem[] = [];
    const itemMatches = xml.matchAll(/<item\s+id="([^"]*)">([\s\S]*?)<\/item>/g);
    for (const match of itemMatches) {
      const itemId = unescapeXml(match[1]);
      const itemInner = match[2];
      const itemName = getTag(itemInner, "name");
      const category = getTag(itemInner, "category");
      const icon = getTag(itemInner, "icon");
      const description = getTag(itemInner, "description");

      let recipe: Recipe | undefined = undefined;
      const recipeMatch = itemInner.match(/<recipe\s+([^>]+)>([\s\S]*?)<\/recipe>/);
      if (recipeMatch) {
        const recipeAttrs = recipeMatch[1];
        const recipeInner = recipeMatch[2];
        const recipeId = getAttr(recipeAttrs, "id");
        const recipeName = getAttr(recipeAttrs, "name");
        const buildingRequired = getAttr(recipeAttrs, "buildingRequired");
        const processingTimeSeconds = parseFloat(getAttr(recipeAttrs, "processingTimeSeconds")) || 0;

        const ingredients: Ingredient[] = [];
        const ingMatches = recipeInner.matchAll(/<ingredient\s+([^/>]+)\/>/g);
        for (const ing of ingMatches) {
          ingredients.push({
            itemId: getAttr(ing[1], "itemId"),
            itemName: getAttr(ing[1], "itemName"),
            amount: parseFloat(getAttr(ing[1], "amount")) || 0,
          });
        }

        const outputs: OutputItem[] = [];
        const outMatches = recipeInner.matchAll(/<output\s+([^/>]+)\/>/g);
        for (const out of outMatches) {
          outputs.push({
            itemId: getAttr(out[1], "itemId"),
            itemName: getAttr(out[1], "itemName"),
            amount: parseFloat(getAttr(out[1], "amount")) || 0,
          });
        }

        recipe = {
          id: recipeId,
          name: recipeName,
          buildingRequired,
          processingTimeSeconds,
          ingredients,
          outputs,
        };
      }

      items.push({
        id: itemId,
        name: itemName,
        category,
        icon,
        description,
        ...(recipe ? { recipe } : {}),
      });
    }

    return { id, name, tagline, items };
  }

  // Fallback / LRL <items> schema
  const items: GameItem[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const itemInner = match[1];
    const itemName = getTag(itemInner, "name");
    const category = getTag(itemInner, "type") || "General";
    const itemId = slugify(itemName);
    const photoFilename = `${itemName.replaceAll(" ", "_")}.png`;
    const icon = `/lrl/items/${photoFilename}`;
    const description = `${itemName} (${category}) in Little Rocket Lab.`;

    let recipe: Recipe | undefined = undefined;
    const recipeMatch = itemInner.match(/<recipe>([\s\S]*?)<\/recipe>/);
    if (recipeMatch) {
      const recipeInner = recipeMatch[1];
      const buildingMatch = recipeInner.match(/<building\s+([^/>]+)\/>/);
      let buildingRequired = "Assembler";
      let throughput = 0;
      if (buildingMatch) {
        buildingRequired = getAttr(buildingMatch[1], "item") || "Assembler";
        throughput = parseFloat(getAttr(buildingMatch[1], "throughput")) || 0;
      }

      const ingredients: Ingredient[] = [];
      const inputMatches = recipeInner.matchAll(/<input\s+([^/>]+)\/>/g);
      for (const inp of inputMatches) {
        const inpName = getAttr(inp[1], "item");
        ingredients.push({
          itemId: slugify(inpName),
          itemName: inpName,
          amount: parseFloat(getAttr(inp[1], "quantity")) || 0,
        });
      }

      const outputs: OutputItem[] = [];
      const outputMatches = recipeInner.matchAll(/<output\s+([^/>]+)\/>/g);
      for (const outp of outputMatches) {
        const outpName = getAttr(outp[1], "item");
        outputs.push({
          itemId: slugify(outpName),
          itemName: outpName,
          amount: parseFloat(getAttr(outp[1], "quantity")) || 0,
        });
      }

      const processingTimeSeconds = throughput > 0 ? Number((60 / throughput).toFixed(2)) : 1;

      recipe = {
        id: `recipe-${itemId}`,
        name: `${itemName} Recipe`,
        buildingRequired,
        processingTimeSeconds,
        ingredients,
        outputs,
      };
    }

    items.push({
      id: itemId,
      name: itemName,
      category,
      icon,
      description,
      ...(recipe ? { recipe } : {}),
    });
  }

  return {
    id: "lrl",
    name: "Little Rocket Lab",
    tagline: "Engineer automated assembly lines and build rockets in Little Rocket Lab.",
    items,
  };
}
