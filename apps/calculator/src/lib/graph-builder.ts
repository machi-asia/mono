import dagre from "dagre";
import type { GameItem } from "../data/types";
import type {
  ProductionRequest,
  RecipeNodeData,
  RecipeCustomNode,
  RecipeCustomEdge,
  GraphCalculationResult,
} from "../types/graph";

const DEFAULT_NODE_WIDTH = 220;
const DEFAULT_NODE_HEIGHT = 110;
const CONVEYOR_CAPACITY = 90; // Standard 90/min belt throughput base

interface InternalNodeAccumulator {
  item: GameItem;
  demandedOutputPerMinute: number;
  requestedDirectly: number;
  buildingName?: string;
  buildingIcon?: string;
  buildingCount?: number;
  cycleTimeSeconds?: number;
}

export function calculateRecipeGraph(
  items: GameItem[],
  requests: ProductionRequest[]
): GraphCalculationResult {
  const itemMap = new Map<string, GameItem>();
  for (const item of items) {
    itemMap.set(item.id, item);
    itemMap.set(item.name.toLowerCase(), item);
  }

  const nodeAccumulators = new Map<string, InternalNodeAccumulator>();
  const edgeMap = new Map<string, { source: string; target: string; ratePerMinute: number }>();
  const visitedPath = new Set<string>();

  function resolveItem(identifier: string): GameItem | undefined {
    return itemMap.get(identifier) || itemMap.get(identifier.toLowerCase());
  }

  function addRequirement(item: GameItem, requiredPerMin: number, parentItem?: GameItem) {
    const key = item.id;

    if (parentItem) {
      const edgeId = `edge-${item.id}-${parentItem.id}`;
      const existingEdge = edgeMap.get(edgeId);
      if (existingEdge) {
        existingEdge.ratePerMinute += requiredPerMin;
      } else {
        edgeMap.set(edgeId, {
          source: `node-${item.id}`,
          target: `node-${parentItem.id}`,
          ratePerMinute: requiredPerMin,
        });
      }
    }

    if (visitedPath.has(key)) {
      // Prevent cyclic recursion
      return;
    }

    const existing = nodeAccumulators.get(key);
    if (existing) {
      existing.demandedOutputPerMinute += requiredPerMin;
    } else {
      const nodeAcc: InternalNodeAccumulator = {
        item,
        demandedOutputPerMinute: requiredPerMin,
        requestedDirectly: 0,
      };

      if (item.recipe) {
        nodeAcc.buildingName = item.recipe.buildingRequired;
        nodeAcc.cycleTimeSeconds = item.recipe.processingTimeSeconds;
        const buildingSlug = item.recipe.buildingRequired.replaceAll(" ", "_");
        nodeAcc.buildingIcon = `/lrl/items/${buildingSlug}.png`;
      }
      nodeAccumulators.set(key, nodeAcc);
    }

    if (item.recipe && item.recipe.ingredients.length > 0) {
      visitedPath.add(key);

      const primaryOutput = item.recipe.outputs.find((o) => o.itemId === item.id) ||
        item.recipe.outputs[0] || { amount: 1 };
      const outputBatch = Math.max(0.001, primaryOutput.amount);

      for (const ingredient of item.recipe.ingredients) {
        const subItem = resolveItem(ingredient.itemId) || resolveItem(ingredient.itemName);
        if (!subItem) continue;

        const ingredientBatchPerRecipe = ingredient.amount;
        const subItemNeededRate = (requiredPerMin / outputBatch) * ingredientBatchPerRecipe;
        addRequirement(subItem, subItemNeededRate, item);
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

  for (const acc of nodeAccumulators.values()) {
    const item = acc.item;
    if (item.recipe && acc.demandedOutputPerMinute > 0) {
      const primaryOutput = item.recipe.outputs.find((o) => o.itemId === item.id) ||
        item.recipe.outputs[0] || { amount: 1 };
      const outputBatch = Math.max(0.001, primaryOutput.amount);
      const cycleSeconds = Math.max(0.1, item.recipe.processingTimeSeconds);
      const outputPerMachinePerMinute = (outputBatch / cycleSeconds) * 60;
      const count = acc.demandedOutputPerMinute / outputPerMachinePerMinute;
      acc.buildingCount = Number(count.toFixed(2));

      const bName = acc.buildingName || "Assembler";
      totalBuildings[bName] = (totalBuildings[bName] || 0) + Number(count.toFixed(2));
    } else if (!item.recipe || item.recipe.ingredients.length === 0) {
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
    g.setNode(`node-${acc.item.id}`, {
      width: DEFAULT_NODE_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
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
    const posX = dagreNode ? dagreNode.x - DEFAULT_NODE_WIDTH / 2 : 0;
    const posY = dagreNode ? dagreNode.y - DEFAULT_NODE_HEIGHT / 2 : 0;

    const data: RecipeNodeData = {
      item: acc.item,
      label: acc.item.name,
      itemIcon: acc.item.icon,
      outputPerMinute: Number(acc.demandedOutputPerMinute.toFixed(2)),
      isRequested: acc.requestedDirectly > 0,
      requestedQuantity: acc.requestedDirectly > 0 ? acc.requestedDirectly : undefined,
      building: acc.buildingName,
      buildingIcon: acc.buildingIcon,
      buildingCount: acc.buildingCount,
      cycleTimeSeconds: acc.cycleTimeSeconds,
    };

    finalNodes.push({
      id: nodeId,
      type: "recipeProcess",
      position: { x: posX, y: posY },
      data,
      width: DEFAULT_NODE_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
    });
  }

  const finalEdges: RecipeCustomEdge[] = [];
  for (const [id, edge] of edgeMap.entries()) {
    const roundedRate = Number(edge.ratePerMinute.toFixed(1));
    const belts = Math.ceil(roundedRate / CONVEYOR_CAPACITY);
    finalEdges.push({
      id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
      label: `${belts} Belts • ${roundedRate}/m`,
      style: { stroke: "var(--color-primary, #d4af37)", strokeWidth: 2 },
    });
  }

  return {
    nodes: finalNodes,
    edges: finalEdges,
    totalBuildings,
    rawIngredients,
  };
}
