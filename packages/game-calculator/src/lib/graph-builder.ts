import dagre from "dagre";
import type { GameItem, Recipe, OutputItem } from "../types/data";
import type {
  ProductionRequest,
  RecipeNodeData,
  RecipeCustomNode,
  RecipeCustomEdge,
  GraphCalculationResult,
} from "../types/graph";
import { RAW_ITEM_ICONS } from "../data/raw-item-icons";

const DEFAULT_NODE_WIDTH = 270;
const DEFAULT_NODE_HEIGHT = 120;
const CONVEYOR_CAPACITY = 90;

interface InternalNodeAccumulator {
  item: GameItem;
  recipe?: Recipe;
  demandedOutputPerMinute: number;
  requestedDirectly: number;
  buildingName?: string;
  buildingIcon?: string;
  buildingCount?: number;
  cycleTimeSeconds?: number;
  pairedCatalystName?: string;
  pairedCatalystIcon?: string;
  candidateOptions?: { id: string; name: string; icon: string }[];
  activeCandidateId?: string;
  groupKey?: string;
}

function useRawInputSet(rawInputs?: Set<string> | string[]): Set<string> {
  if (!rawInputs) return new Set();
  if (rawInputs instanceof Set) return rawInputs;
  return new Set(rawInputs);
}

const itemMapCache = new WeakMap<GameItem[], Map<string, GameItem>>();

function normalizeFluidName(name: string): string {
  const match = name.match(/^\d+\s*mb\s+of\s+(.+)$/i);
  return match ? match[1]!.trim() : name;
}

function getOrCreateItemMap(items: GameItem[]): Map<string, GameItem> {
  const cached = itemMapCache.get(items);
  if (cached) return cached;

  const itemMap = new Map<string, GameItem>();
  for (const item of items) {
    itemMap.set(item.id, item);
    itemMap.set(item.name.toLowerCase(), item);
  }

  // Ensure any ingredient referenced in recipes that is not yet a top-level catalog item
  // is automatically resolved as a raw base ingredient with its proper name and icon
  for (const item of items) {
    for (const r of item.recipes || []) {
      for (const ing of r.ingredients || []) {
        const normName = normalizeFluidName(ing.itemName);
        if (
          !itemMap.has(ing.itemId) &&
          !itemMap.has(ing.itemName.toLowerCase()) &&
          !itemMap.has(normName.toLowerCase()) &&
          !itemMap.has(normName.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
        ) {
          const cleanName = ing.itemName.split(";")[0]?.trim() || "";
          const directIcon =
            RAW_ITEM_ICONS[ing.itemName] ||
            RAW_ITEM_ICONS[cleanName];
          const assetName = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
          const fallbackIcon = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${assetName}.png`;

          const rawItem: GameItem = {
            id: ing.itemId,
            name: ing.itemName,
            category: "Raw Material",
            sourceMod: "Vanilla",
            icon: directIcon || fallbackIcon,
            description: `Base material required for crafting ${item.name}.`,
            recipes: [],
          };
          itemMap.set(rawItem.id, rawItem);
          itemMap.set(rawItem.name.toLowerCase(), rawItem);
        }
      }
    }
  }

  itemMapCache.set(items, itemMap);
  return itemMap;
}

export function calculateRecipeGraph(
  items: GameItem[],
  requests: ProductionRequest[],
  recipeOverrides?: Record<string, string>,
  ingredientChoices?: Record<string, string>,
  rawInputs?: Set<string> | string[]
): GraphCalculationResult {
  const rawInputSet = useRawInputSet(rawInputs);
  const itemMap = getOrCreateItemMap(items);

  const requestRecipeIds = new Map<string, string>();
  for (const req of requests) {
    if (req.recipeId) requestRecipeIds.set(req.itemId, req.recipeId);
  }

  const nodeAccumulators = new Map<string, InternalNodeAccumulator>();
  const edgeMap = new Map<
    string,
    { source: string; target: string; targetHandle?: string; ratePerMinute: number }
  >();
  const visitedPath = new Set<string>();

  function resolveItem(identifier: string): GameItem | undefined {
    const direct = itemMap.get(identifier) || itemMap.get(identifier.toLowerCase());
    if (direct) return direct;
    const normalized = normalizeFluidName(identifier);
    if (normalized !== identifier) {
      return itemMap.get(normalized) || itemMap.get(normalized.toLowerCase()) || itemMap.get(normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    }
    return undefined;
  }

  function resolveMachineIcon(buildingName?: string): string | undefined {
    if (!buildingName) return undefined;
    const cleanName = buildingName.replace(/ Loop$/, "");
    const direct = resolveItem(cleanName) || resolveItem(cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    if (direct?.icon && (direct.icon.startsWith("http") || direct.icon.startsWith("/"))) return direct.icon;
    const lower = cleanName.toLowerCase();
    if (lower.includes("drill")) return resolveItem("mechanical-drill")?.icon;
    if (lower.includes("crush")) return resolveItem("crushing-wheel")?.icon;
    if (lower.includes("crafter") || lower.includes("craft")) return resolveItem("mechanical-crafter")?.icon;
    if (lower.includes("press")) return resolveItem("mechanical-press")?.icon;
    if (lower.includes("mix")) return resolveItem("mechanical-mixer")?.icon;
    if (lower.includes("saw")) return resolveItem("mechanical-saw")?.icon;
    if (lower.includes("fan")) return resolveItem("encased-fan")?.icon;
    if (lower.includes("mill")) return resolveItem("millstone")?.icon;
    if (lower.includes("spout")) return resolveItem("spout")?.icon;
    if (lower.includes("deploy")) return resolveItem("deployer")?.icon;
    return undefined;
  }

  function isValidRecipe(r: Recipe, currentItem: GameItem): boolean {
    const isSelfCraft = r.ingredients.some(
      (ing) =>
        ing.itemId === currentItem.id ||
        ing.itemName.toLowerCase().trim() === currentItem.name.toLowerCase().trim()
    );
    // If a recipe consumes the exact same item it is intended to produce, discard it
    if (isSelfCraft) {
      const producesSelf = r.outputs.some(
        (out) =>
          out.itemId === currentItem.id ||
          out.itemName.toLowerCase().trim() === currentItem.name.toLowerCase().trim()
      );
      if (producesSelf) return false;
    }
    return true;
  }

  function pickRecipe(item: GameItem, overrideRecipeId?: string): Recipe | undefined {
    const validRecipes = (item.recipes || (item.recipe ? [item.recipe] : [])).filter((r) =>
      isValidRecipe(r, item)
    );
    if (validRecipes.length === 0) return undefined;
    if (overrideRecipeId) {
      const match = validRecipes.find((r: Recipe) => r.id === overrideRecipeId);
      if (match) return match;
    }
    return validRecipes[0];
  }

  function getFanCatalyst(recipe?: Recipe): { name: string; icon?: string } | undefined {
    if (!recipe) return undefined;
    const bName = recipe.buildingRequired || "";
    if (!bName.toLowerCase().includes("fan")) return undefined;

    const rName = (recipe.name || "").toLowerCase();
    const rMethod = (recipe.method || "").toLowerCase();

    if (rMethod.includes("blasting") || rName.includes("blasting") || rName.includes("lava")) {
      return { name: "Lava", icon: RAW_ITEM_ICONS["Lava"] || "" };
    }
    if (rMethod.includes("washing") || rName.includes("washing") || rName.includes("water")) {
      return { name: "Water", icon: RAW_ITEM_ICONS["Water"] || "" };
    }
    if (rMethod.includes("smoking") || rName.includes("smoking") || rName.includes("campfire")) {
      return { name: "Campfire", icon: RAW_ITEM_ICONS["Campfire"] || "" };
    }
    if (rMethod.includes("haunting") || rName.includes("haunting") || rName.includes("soul fire")) {
      return { name: "Soul Fire", icon: RAW_ITEM_ICONS["Soul Fire"] || "" };
    }
    return undefined;
  }

  function resolveBuildingInfo(recipe?: Recipe): {
    buildingName?: string;
    buildingIcon?: string;
    pairedCatalystName?: string;
    pairedCatalystIcon?: string;
  } {
    if (!recipe) return {};
    const baseBuilding = recipe.buildingRequired || "Assembler";
    const baseIcon = recipe.buildingIcon || resolveMachineIcon(baseBuilding);

    const catalyst = getFanCatalyst(recipe);
    if (catalyst) {
      return {
        buildingName: `${baseBuilding} (${catalyst.name})`,
        buildingIcon: baseIcon,
        pairedCatalystName: catalyst.name,
        pairedCatalystIcon: catalyst.icon,
      };
    }

    return {
      buildingName: baseBuilding,
      buildingIcon: baseIcon,
    };
  }

  function parseCandidateNames(rawName: string): string[] {
    if (!rawName.includes(";")) return [];
    return rawName.split(";").map((s) => s.trim()).filter(Boolean);
  }

  function resolveCandidateOptions(rawName: string): { id: string; name: string; icon: string }[] {
    const names = parseCandidateNames(rawName);
    return names.map((candName) => {
      const found = resolveItem(candName) || resolveItem(candName.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      const directIcon = RAW_ITEM_ICONS[candName] || found?.icon;
      const assetSlug = candName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const fallbackIcon = `/items/${assetSlug}.png`;
      return {
        id: found?.id || candName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: found?.name || candName,
        icon: directIcon || fallbackIcon,
      };
    });
  }

  function addRequirement(
    item: GameItem,
    requiredPerMin: number,
    parentItem?: GameItem,
    candidateContext?: {
      candidateOptions: { id: string; name: string; icon: string }[];
      activeCandidateId: string;
      groupKey: string;
    },
    parentIngredientId?: string
  ) {
    const key = item.id;

    if (parentItem) {
      const edgeId = `edge-${item.id}-${parentItem.id}`;
      const targetHandle = parentIngredientId
        ? `handle-in-${parentIngredientId}`
        : `handle-in-${item.id}`;
      const existingEdge = edgeMap.get(edgeId);
      if (existingEdge) {
        existingEdge.ratePerMinute += requiredPerMin;
      } else {
        edgeMap.set(edgeId, {
          source: `node-${item.id}`,
          target: `node-${parentItem.id}`,
          targetHandle,
          ratePerMinute: requiredPerMin,
        });
      }
    }

    if (visitedPath.has(key)) {
      return;
    }

    const existing = nodeAccumulators.get(key);
    if (existing) {
      existing.demandedOutputPerMinute += requiredPerMin;
      if (candidateContext && !existing.candidateOptions) {
        existing.candidateOptions = candidateContext.candidateOptions;
        existing.activeCandidateId = candidateContext.activeCandidateId;
        existing.groupKey = candidateContext.groupKey;
      }
    } else {
      const isRaw = rawInputSet.has(item.id);
      const overrideId = requestRecipeIds.get(key) ?? recipeOverrides?.[key];
      const recipe = isRaw ? undefined : pickRecipe(item, overrideId);
      const bInfo = resolveBuildingInfo(recipe);
      const nodeAcc: InternalNodeAccumulator = {
        item,
        recipe,
        demandedOutputPerMinute: requiredPerMin,
        requestedDirectly: 0,
        buildingName: bInfo.buildingName,
        buildingIcon: bInfo.buildingIcon,
        pairedCatalystName: bInfo.pairedCatalystName,
        pairedCatalystIcon: bInfo.pairedCatalystIcon,
        cycleTimeSeconds: recipe?.processingTimeSeconds,
        candidateOptions: candidateContext?.candidateOptions,
        activeCandidateId: candidateContext?.activeCandidateId,
        groupKey: candidateContext?.groupKey,
      };
      nodeAccumulators.set(key, nodeAcc);
    }

    const isRaw = rawInputSet.has(item.id);
    const accRecipe = isRaw ? undefined : nodeAccumulators.get(key)?.recipe;
    if (accRecipe && accRecipe.ingredients.length > 0) {
      visitedPath.add(key);

      const matchingOutputs = accRecipe.outputs.filter((o: OutputItem) => o.itemId === item.id);
      let expectedBatch = 0;
      if (matchingOutputs.length > 0) {
        for (const out of matchingOutputs) {
          const mult = out.chance !== undefined ? out.chance / 100 : 1;
          expectedBatch += out.amount * mult;
        }
      } else {
        const fallback = accRecipe.outputs[0];
        const fbAmount = fallback?.amount ?? 1;
        const fbChance = fallback?.chance !== undefined ? fallback.chance / 100 : 1;
        expectedBatch = fbAmount * fbChance;
      }
      const outputBatch = Math.max(0.001, expectedBatch);

      for (const ingredient of accRecipe.ingredients) {
        let subItem = resolveItem(ingredient.itemId) || resolveItem(ingredient.itemName);
        let candCtx:
          | {
              candidateOptions: { id: string; name: string; icon: string }[];
              activeCandidateId: string;
              groupKey: string;
            }
          | undefined = undefined;

        if (ingredient.itemName.includes(";")) {
          const options = resolveCandidateOptions(ingredient.itemName);
          if (options.length > 1) {
            const groupKey = ingredient.itemId || ingredient.itemName;
            const chosenId = ingredientChoices?.[groupKey] || ingredientChoices?.[ingredient.itemId] || options[0]?.id;
            const chosenOption = options.find((opt) => opt.id === chosenId) || options[0];

            if (chosenOption) {
              const candidateItem = resolveItem(chosenOption.id) || resolveItem(chosenOption.name);
              if (candidateItem) {
                subItem = candidateItem;
              }
              candCtx = {
                candidateOptions: options,
                activeCandidateId: chosenOption.id,
                groupKey,
              };
            }
          }
        }

        if (!subItem) continue;

        const ingredientBatchPerRecipe = ingredient.amount;
        const subItemNeededRate = (requiredPerMin / outputBatch) * ingredientBatchPerRecipe;
        addRequirement(subItem, subItemNeededRate, item, candCtx, ingredient.itemId);
      }

      visitedPath.delete(key);
    }
  }

  for (const req of requests) {
    if (req.targetQuantityPerMinute <= 0) continue;
    const item = resolveItem(req.itemId);
    if (!item) continue;

    addRequirement(item, req.targetQuantityPerMinute);
    const existing = nodeAccumulators.get(item.id);
    if (existing) {
      existing.requestedDirectly += req.targetQuantityPerMinute;
    }
  }

  const totalBuildings: Record<string, number> = {};
  const rawIngredients: { itemName: string; itemId: string; requiredPerMinute: number; icon: string }[] = [];

  const buildingIconsMap: Record<string, string | undefined> = {};

  const buildingCatalystMap: Record<string, string | undefined> = {};

  for (const acc of nodeAccumulators.values()) {
    const item = acc.item;
    if (acc.recipe && acc.demandedOutputPerMinute > 0) {
      const matchingOutputs = acc.recipe.outputs.filter((o: OutputItem) => o.itemId === item.id);
      let expectedBatch = 0;
      if (matchingOutputs.length > 0) {
        for (const out of matchingOutputs) {
          const mult = out.chance !== undefined ? out.chance / 100 : 1;
          expectedBatch += out.amount * mult;
        }
      } else {
        const fallback = acc.recipe.outputs[0];
        const fbAmount = fallback?.amount ?? 1;
        const fbChance = fallback?.chance !== undefined ? fallback.chance / 100 : 1;
        expectedBatch = fbAmount * fbChance;
      }
      const outputBatch = Math.max(0.001, expectedBatch);
      const cycleSeconds = Math.max(0.1, acc.recipe.processingTimeSeconds);
      const outputPerMachinePerMinute = (outputBatch / cycleSeconds) * 60;
      const count = acc.demandedOutputPerMinute / outputPerMachinePerMinute;
      acc.buildingCount = Number(count.toFixed(2));

      const bName = acc.buildingName || "Assembler";
      totalBuildings[bName] = (totalBuildings[bName] || 0) + Number(count.toFixed(2));
      if (!buildingIconsMap[bName]) {
        buildingIconsMap[bName] = acc.buildingIcon || resolveMachineIcon(bName);
      }
      if (!buildingCatalystMap[bName]) {
        buildingCatalystMap[bName] = acc.pairedCatalystIcon;
      }
    } else if (!acc.recipe || acc.recipe.ingredients.length === 0) {
      rawIngredients.push({
        itemId: item.id,
        itemName: item.name,
        requiredPerMinute: Number(acc.demandedOutputPerMinute.toFixed(1)),
        icon: item.icon,
      });
    }
  }

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "LR",
    ranksep: 180,
    nodesep: 80,
    edgesep: 40,
    marginx: 40,
    marginy: 40,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const acc of nodeAccumulators.values()) {
    const ingredientCount = acc.recipe?.ingredients?.length || 0;
    const hasCandidates = Boolean(acc.candidateOptions && acc.candidateOptions.length > 1);
    const dynamicHeight = Math.max(DEFAULT_NODE_HEIGHT, 100 + ingredientCount * 26 + (hasCandidates ? 42 : 0));
    g.setNode(`node-${acc.item.id}`, {
      width: DEFAULT_NODE_WIDTH,
      height: dynamicHeight,
    });
  }

  for (const edge of edgeMap.values()) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const finalNodes: RecipeCustomNode[] = [];
  for (const acc of nodeAccumulators.values()) {
    const nodeId = `node-${acc.item.id}`;
    const dagreNode = g.node(nodeId);
    const ingredientCount = acc.recipe?.ingredients?.length || 0;
    const hasCandidates = Boolean(acc.candidateOptions && acc.candidateOptions.length > 1);
    const dynamicHeight = Math.max(DEFAULT_NODE_HEIGHT, 100 + ingredientCount * 26 + (hasCandidates ? 42 : 0));
    const posX = dagreNode ? dagreNode.x - DEFAULT_NODE_WIDTH / 2 : 0;
    const posY = dagreNode ? dagreNode.y - dynamicHeight / 2 : 0;

    // Build ingredient list for node handles and labels
    const nodeIngredients = acc.recipe?.ingredients?.map((ing) => {
      const resolved = resolveItem(ing.itemId) || resolveItem(ing.itemName);
      return {
        itemId: ing.itemId,
        itemName: ing.itemName,
        amount: ing.amount,
        icon: resolved?.icon,
      };
    });

    const isNaturallyRaw = !acc.recipe || !acc.recipe.ingredients || acc.recipe.ingredients.length === 0;
    const isRawInput = rawInputSet.has(acc.item.id) || isNaturallyRaw;

    const data: RecipeNodeData = {
      item: acc.item,
      label: acc.item.name,
      itemIcon: acc.item.icon,
      outputPerMinute: Number(acc.demandedOutputPerMinute.toFixed(2)),
      isRequested: acc.requestedDirectly > 0,
      requestedQuantity: acc.requestedDirectly > 0 ? acc.requestedDirectly : undefined,
      isRawInput,
      building: isRawInput ? undefined : acc.buildingName,
      buildingIcon: isRawInput ? undefined : (acc.buildingIcon || resolveMachineIcon(acc.buildingName)),
      pairedCatalystName: acc.pairedCatalystName,
      pairedCatalystIcon: acc.pairedCatalystIcon,
      buildingCount: acc.buildingCount,
      cycleTimeSeconds: acc.cycleTimeSeconds,
      sourceMod: acc.recipe?.sourceMod || acc.item.sourceMod,
      recipeMethod: acc.recipe?.method,
      ingredients: nodeIngredients,
      candidateOptions: acc.candidateOptions,
      activeCandidateId: acc.activeCandidateId,
      groupKey: acc.groupKey,
    };

    finalNodes.push({
      id: nodeId,
      type: "recipeProcess",
      position: { x: posX, y: posY },
      data,
      width: DEFAULT_NODE_WIDTH,
      height: dynamicHeight,
    });
  }

  const beltItem = resolveItem("mechanical-belt") || resolveItem("mechanical belt");
  const beltIcon = beltItem?.icon || "/items/mechanical_belt_block.png";

  const finalEdges: RecipeCustomEdge[] = [];
  let totalBelts = 0;
  for (const [id, edge] of edgeMap.entries()) {
    const roundedRate = Number(edge.ratePerMinute.toFixed(1));
    const belts = Math.ceil(roundedRate / CONVEYOR_CAPACITY);
    totalBelts += belts;
    finalEdges.push({
      id,
      source: edge.source,
      target: edge.target,
      targetHandle: edge.targetHandle,
      type: "conveyorBelt",
      animated: true,
      data: {
        ratePerMinute: roundedRate,
        belts,
        beltIcon,
      },
      label: `${belts} Belts • ${roundedRate}/m`,
      style: { stroke: "#6366f1", strokeWidth: 2 },
    });
  }

  if (totalBelts > 0) {
    totalBuildings["Mechanical Belt"] = (totalBuildings["Mechanical Belt"] || 0) + totalBelts;
    buildingIconsMap["Mechanical Belt"] = beltIcon;
  }

  const buildingDetails = Object.entries(totalBuildings).map(([name, count]) => ({
    name,
    count,
    icon: buildingIconsMap[name] || resolveMachineIcon(name),
    pairedCatalystIcon: buildingCatalystMap[name],
  }));

  return {
    nodes: finalNodes,
    edges: finalEdges,
    totalBuildings,
    buildingDetails,
    rawIngredients,
  };
}
