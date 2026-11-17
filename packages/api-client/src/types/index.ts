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

export type AdminUserRole = "guest" | "member" | "pro" | "admin";

export interface VisitorOriginContext {
  app?: string;
  hostname?: string;
  pathname?: string;
  referrer?: string;
  utmSource?: string;
}

export interface AdminDirectoryUser {
  userId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: AdminUserRole;
  isGuest: boolean;
  isOnline: boolean;
  currentApp: string | null;
  hostname: string | null;
  pathname: string | null;
  referrer: string | null;
  utmSource: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  ipAddress: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  lastSeenAt: string | null;
  createdAt: string | null;
  totalDailyUsage: number;
  totalMonthlyUsage: number;
  roseChatCount: number;
  providers: string[];
  canChangeRole: boolean;
}

export interface AdminVisitorSession {
  session_key: string;
  user_id: string | null;
  visitor_id: string;
  is_guest: boolean;
  email: string | null;
  display_name: string | null;
  role: AdminUserRole;
  app: string;
  hostname: string | null;
  pathname: string | null;
  referrer: string | null;
  utm_source: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  ip_address: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  user_agent: string | null;
  started_at: string;
  last_seen_at: string;
  isOnline: boolean;
}

export interface AdminUsageRecord {
  id: string;
  user_id: string;
  app: string;
  metric: string;
  period_type: "daily" | "monthly";
  period_key: string;
  count: number;
  usage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface AdminRoseMessage {
  id: string;
  role: "user" | "model";
  text: string;
  emotion?: string;
  traces?: string[];
  variant?: "normal" | "error" | "warning";
  createdAt?: string;
}

export interface AdminRoseConversation {
  id: string;
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  isGuest: boolean;
  role: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AdminRoseMessage[];
  history: Array<{ role: string; parts: Array<Record<string, unknown>> }>;
  lastEmotion?: string;
  totalTurns: number;
  estimatedTokens: number;
  originApp?: string;
}

export interface AdminSupportTicket {
  id: string;
  user_id: string | null;
  user_email: string | null;
  type: "bug_report" | "recommendation" | "general_support";
  app: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminOverviewResponse {
  ok: boolean;
  siteId: string;
  stats: {
    totalUsers: number;
    totalGuests: number;
    onlineVisitors: number;
    totalSessions: number;
    totalApiRequests: number;
    totalRoseChats: number;
    openTickets: number;
    pendingReports: number;
  };
  breakdowns: {
    byApp: Record<string, number>;
    byReferrer: Record<string, number>;
    byCountry: Record<string, number>;
    byDevice: Record<string, number>;
  };
  users: AdminDirectoryUser[];
  visitors: AdminVisitorSession[];
  usages: AdminUsageRecord[];
  registeredMetrics: Array<{
    metric: string;
    label: string;
    description?: string;
    unit: string;
    formatDivisor?: number;
    formatDecimals?: number;
    defaultApp?: string;
  }>;
  systemSummary: Record<string, unknown>;
  roseChats: AdminRoseConversation[];
  tickets: AdminSupportTicket[];
  reports: ItemListReportItem[];
}

export interface AdminManageUsageRequest {
  userId: string;
  app?: string;
  metric: string;
  action: "reset" | "set_limits";
  dailyLimit?: number;
  monthlyLimit?: number;
}

export interface AdminManageUsageResponse {
  ok: boolean;
  success: boolean;
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
}
