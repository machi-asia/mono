export interface Ingredient {
  itemId: string;
  itemName: string;
  amount: number;
}

export interface OutputItem {
  itemId: string;
  itemName: string;
  amount: number;
  chance?: number;
}

export interface Recipe {
  id: string;
  name: string;
  method?: string;
  sourceMod?: string; // e.g. "Vanilla", "Create Mod", "Create: Steam & Rails", "Create: Crafts & Additions", etc.
  buildingRequired: string;
  buildingIcon?: string;
  processingTimeSeconds: number;
  speedRpm?: number;
  ingredients: Ingredient[];
  outputs: OutputItem[];
}

export interface GameItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  sourceMod?: string; // Provenance: "Vanilla", "Create Mod", or addon mod name
  lastUpdated?: string;
  recipes?: Recipe[];
  recipe?: Recipe;
}

export interface GameDataset {
  id: string;
  name: string;
  tagline: string;
  homeUrl?: string;
  items: GameItem[];
}
