export interface Ingredient {
  itemId: string;
  itemName: string;
  amount: number;
}

export interface OutputItem {
  itemId: string;
  itemName: string;
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  buildingRequired: string;
  processingTimeSeconds: number;
  ingredients: Ingredient[];
  outputs: OutputItem[];
}

export interface GameItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  recipe?: Recipe;
}

export interface GameDataset {
  id: string;
  name: string;
  tagline: string;
  items: GameItem[];
}
