import type { Node, Edge } from "reactflow";
import type { GameItem } from "../data/types";

export interface ProductionRequest {
  itemId: string;
  targetQuantityPerMinute: number;
  recipeId?: string;
}

export interface RecipeNodeData {
  item: GameItem;
  label: string;
  itemIcon: string;
  outputPerMinute: number;
  isRequested: boolean;
  requestedQuantity?: number;
  building?: string;
  buildingIcon?: string;
  buildingCount?: number;
  cycleTimeSeconds?: number;
}

export type RecipeCustomNode = Node<RecipeNodeData>;
export type RecipeCustomEdge = Edge;

export interface GraphCalculationResult {
  nodes: RecipeCustomNode[];
  edges: RecipeCustomEdge[];
  totalBuildings: Record<string, number>;
  rawIngredients: { itemName: string; itemId: string; requiredPerMinute: number; icon: string }[];
}
