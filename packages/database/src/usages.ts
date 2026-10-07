import { createClient } from "./client";
import type { UsageMetric, UserRole, UserUsageRecord } from "./types";

export interface RoleQuota {
  daily: number;
  monthly: number;
}

/**
 * Maximum per-image upload size constraints by role (in KB):
 * - guest: 2 KB max
 * - member: 20 KB max
 * - pro: 10 MB max (10,240 KB)
 * - admin: unlimited (Infinity)
 */
export const ROLE_IMAGE_MAX_SIZE_KB: Record<UserRole, number> = {
  guest: 2,
  member: 20,
  pro: 10 * 1024,
  admin: Infinity,
};

/**
 * Total cloud storage capacity limits by role (in bytes):
 * - guest: 1 MB max (1 * 1024 * 1024 bytes)
 * - member: 5 MB max (5 * 1024 * 1024 bytes)
 * - pro: 1 GB max (1 * 1024 * 1024 * 1024 bytes)
 * - admin: unlimited (Infinity / 1 TB)
 */
export const ROLE_STORAGE_LIMIT_BYTES: Record<UserRole, number> = {
  guest: 1 * 1024 * 1024,
  member: 5 * 1024 * 1024,
  pro: 1 * 1024 * 1024 * 1024,
  admin: 1024 * 1024 * 1024 * 1024,
};

/**
 * Standard quota matrix by role and metric.
 */
export const ROLE_QUOTAS: Record<UserRole, Record<UsageMetric, RoleQuota>> = {
  guest: {
    requests: { daily: 50, monthly: 500 },
    ai_tokens: { daily: 50_000, monthly: 500_000 },
    turns: { daily: 15, monthly: 150 },
    storage_bytes: { daily: 200 * 1024, monthly: 1 * 1024 * 1024 }, // 1 MB total
  },
  member: {
    requests: { daily: 250, monthly: 3_500 },
    ai_tokens: { daily: 250_000, monthly: 3_500_000 },
    turns: { daily: 60, monthly: 1_200 },
    storage_bytes: { daily: 1 * 1024 * 1024, monthly: 5 * 1024 * 1024 }, // 5 MB total
  },
  pro: {
    requests: { daily: 1_500, monthly: 25_000 },
    ai_tokens: { daily: 2_000_000, monthly: 30_000_000 },
    turns: { daily: 300, monthly: 6_000 },
    storage_bytes: { daily: 100 * 1024 * 1024, monthly: 1 * 1024 * 1024 * 1024 }, // 1 GB total
  },
  admin: {
    requests: { daily: 1_000_000, monthly: 10_000_000 },
    ai_tokens: { daily: 100_000_000, monthly: 1_000_000_000 },
    turns: { daily: 100_000, monthly: 1_000_000 },
    storage_bytes: { daily: 100 * 1024 * 1024 * 1024, monthly: 1024 * 1024 * 1024 * 1024 },
  },
};

export interface CheckUsageResult {
  allowed: boolean;
  role: UserRole;
  metric: UsageMetric;
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
}

/**
 * Increments usage for a user, checking both daily and monthly limits atomically.
 */
export async function recordAndCheckUsage(options: {
  userId: string;
  app: string;
  metric: UsageMetric;
  amount?: number;
  role?: UserRole;
}): Promise<CheckUsageResult> {
  const { userId, app, metric, amount = 1 } = options;
  const supabase = createClient();

  const role = options.role ?? "member";
  const quota = ROLE_QUOTAS[role]?.[metric] ?? ROLE_QUOTAS.member[metric];

  if (role === "admin") {
    return {
      allowed: true,
      role: "admin",
      metric,
      dailyCount: 0,
      dailyLimit: quota.daily,
      monthlyCount: 0,
      monthlyLimit: quota.monthly,
    };
  }

  try {
    const { data, error } = await supabase.rpc("increment_user_usage", {
      p_user_id: userId,
      p_app: app,
      p_metric: metric,
      p_amount: amount,
      p_daily_limit: quota.daily,
      p_monthly_limit: quota.monthly,
    } as never);

    if (error || !data) {
      // Fallback: allow if RPC has temporary connection issue
      return {
        allowed: true,
        role,
        metric,
        dailyCount: 1,
        dailyLimit: quota.daily,
        monthlyCount: 1,
        monthlyLimit: quota.monthly,
      };
    }

    const res = data as {
      allowed: boolean;
      role: UserRole;
      daily_count: number;
      daily_limit: number;
      monthly_count: number;
      monthly_limit: number;
    };

    return {
      allowed: res.allowed,
      role: res.role,
      metric,
      dailyCount: Number(res.daily_count),
      dailyLimit: Number(res.daily_limit),
      monthlyCount: Number(res.monthly_count),
      monthlyLimit: Number(res.monthly_limit),
    };
  } catch {
    return {
      allowed: true,
      role,
      metric,
      dailyCount: 1,
      dailyLimit: quota.daily,
      monthlyCount: 1,
      monthlyLimit: quota.monthly,
    };
  }
}

/**
 * Retrieves the user's current daily and monthly usage summaries across apps.
 */
export async function getUserUsageSummary(userId: string): Promise<UserUsageRecord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_usages")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as UserUsageRecord[];
  } catch {
    return [];
  }
}
