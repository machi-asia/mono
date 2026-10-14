import type { Node, Edge } from "@xyflow/react";
import type { GameItem } from "./data";

export interface ProductionRequest {
  itemId: string;
  targetQuantityPerMinute: number;
  recipeId?: string;
}

export interface RecipeNodeData extends Record<string, unknown> {
  item: GameItem;
  label: string;
  itemIcon: string;
  outputPerMinute: number;
  isRequested: boolean;
  requestedQuantity?: number;
  isRawInput?: boolean;
  onToggleRawInput?: (itemId: string) => void;
  onNodeClick?: (item: GameItem) => void;
  building?: string;
  buildingIcon?: string;
  buildingCount?: number;
  cycleTimeSeconds?: number;
  sourceMod?: string;
  recipeMethod?: string;
  pairedCatalystName?: string;
  pairedCatalystIcon?: string;
  candidateOptions?: {
    id: string;
    name: string;
    icon: string;
  }[];
  activeCandidateId?: string;
  onSwitchIngredient?: (groupKey: string, chosenOptionId: string) => void;
  groupKey?: string;
  ingredients?: {
    itemId: string;
    itemName: string;
    amount: number;
    icon?: string;
    ratePerMinute?: number;
  }[];
}

export interface RecipeEdgeData extends Record<string, unknown> {
  ratePerMinute: number;
  belts: number;
  beltIcon?: string;
}

export type RecipeCustomNode = Node<RecipeNodeData>;
export type RecipeCustomEdge = Edge<RecipeEdgeData>;

export interface FacilitySummaryItem {
  name: string;
  count: number;
  icon?: string;
  pairedCatalystIcon?: string;
}

export interface GraphCalculationResult {
  nodes: RecipeCustomNode[];
  edges: RecipeCustomEdge[];
  totalBuildings: Record<string, number>;
  buildingDetails?: FacilitySummaryItem[];
  rawIngredients: { itemName: string; itemId: string; requiredPerMinute: number; icon: string }[];
}
