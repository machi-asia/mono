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
  exceededType?: "daily" | "weekly" | "monthly";
  remaining: number;
  role?: "admin" | "guest" | "authenticated" | "member" | "pro";
}

export interface ApiQuotaStatus {
  locked: boolean;
  exceededType?: "daily" | "weekly" | "monthly" | "rate_limit" | "role";
  retryAfterSeconds?: number;
  message?: string;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  quota?: ApiQuotaStatus;
}

export interface ApiClientConfig {
  baseUrl?: string;
  getAuthToken?: () => Promise<string | null> | string | null;
  onQuotaLocked?: (status: ApiQuotaStatus) => void;
  onUnauthorized?: () => void;
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

export interface SerializedMetricQuotaSnapshot {
  locked: boolean;
  allowed: boolean;
  metric: string;
  label: string;
  unit: string;
  formatDivisor: number;
  role: "guest" | "member" | "pro" | "admin";
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  remaining: number;
  exceededType?: "daily" | "monthly" | "role";
}

export interface UserQuotaSummaryResponse {
  userId: string;
  role: "guest" | "member" | "pro" | "admin";
  metrics?: Record<string, SerializedMetricQuotaSnapshot>;
  quotas: Record<
    string,
    {
      dailyCount: number;
      dailyLimit: number;
      monthlyCount: number;
      monthlyLimit: number;
      allowed: boolean;
      remaining: number;
    }
  >;
}

export interface TrackUsageRequest {
  metric: string;
  app?: string;
  amount?: number;
  checkOnly?: boolean;
  dailyLimitOverride?: number;
  monthlyLimitOverride?: number;
}

export interface TrackUsageResponse {
  ok: boolean;
  allowed: boolean;
  quota?: SerializedMetricQuotaSnapshot;
  usage?: {
    allowed: boolean;
    role: "guest" | "member" | "pro" | "admin";
    metric: string;
    dailyCount: number;
    dailyLimit: number;
    monthlyCount: number;
    monthlyLimit: number;
    exceededType?: "daily" | "monthly" | "role";
    remaining: number;
    day: string;
    month: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
