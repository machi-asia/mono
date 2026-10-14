export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface RoseUsageResponse {
  allowed: boolean;
  count: number;
  limit: number;
  week: string;
  dailyCount: number;
  dailyLimit: number;
  day: string;
  exceededType?: "daily" | "weekly";
  remaining: number;
  role?: "admin" | "guest" | "authenticated";
}

export interface ApiClientConfig {
  baseUrl?: string;
  getAuthToken?: () => Promise<string | null> | string | null;
}

export interface ItemListReportCorrections {
  recipeMethod?: string;
  machineRequired?: string;
  outputAmount?: number;
  ingredients?: Array<{ name: string; amount: number }>;
  processingTimeSeconds?: number;
  speedRpm?: number;
  intendedItemsPerMin?: number;
  iconUrl?: string;
}

export interface ItemListReportSubmission {
  gameId: string;
  itemId: string;
  itemName: string;
  issueType: string;
  description?: string;
  suggestedFix?: string;
  corrections?: ItemListReportCorrections;
  reporterHash?: string;
}

export interface ItemListCommunityOverride {
  game_id: string;
  item_id: string;
  item_name: string;
  issue_type: string;
  corrections: ItemListReportCorrections;
  reporter_count: number;
}

export interface ItemListReportItem {
  id: string;
  game_id: string;
  item_id: string;
  item_name: string;
  issue_type: string;
  description: string | null;
  suggested_fix: string | null;
  reporter_hash: string;
  corrections: ItemListReportCorrections;
  consensus_key: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string;
}
