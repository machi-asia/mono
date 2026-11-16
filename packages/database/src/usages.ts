import type { SupabaseClient } from "@supabase/supabase-js";
import { assertServerOnlyExecution, createClient, createServiceClient } from "./client";
import type {
  BuiltInUsageMetric,
  CoreUsageMetric,
  Database,
  UsageMetric,
  UserRole,
  UserUsageRecord,
} from "./types";

export interface RoleQuota {
  daily: number;
  monthly: number;
}

/**
 * Metadata and 4-tier quota definition for any tracked usage metric.
 * Supports both built-in metrics and dynamically registered custom metrics.
 */
export interface UsageMetricDefinition {
  metric: UsageMetric;
  label: string;
  description?: string;
  unit: string;
  /** Optional divisor for display formatting (e.g., 1000 for "k tok", 1048576 for "MB") */
  formatDivisor?: number;
  /** Optional precision for formatted values when formatDivisor > 1 */
  formatDecimals?: number;
  /** Optional default app bucket when tracking this metric (defaults to "global") */
  defaultApp?: string;
  /** Minimum role required to use this feature at all (defaults to "guest") */
  minRole?: UserRole;
  /** Warning threshold percentage (0-100, default 75) */
  warningThreshold?: number;
  /** Danger threshold percentage (0-100, default 90) */
  dangerThreshold?: number;
  /** 4-tier daily & monthly quotas */
  quotas: Record<UserRole, RoleQuota>;
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
 * Standard quota matrix by role and core metric.
 */
export const ROLE_QUOTAS: Record<UserRole, Record<CoreUsageMetric, RoleQuota> & Record<string, RoleQuota>> = {
  guest: {
    requests: { daily: 50, monthly: 500 },
    ai_tokens: { daily: 50_000, monthly: 500_000 },
    turns: { daily: 15, monthly: 150 },
    storage_bytes: { daily: 200 * 1024, monthly: 1 * 1024 * 1024 }, // 1 MB total
    blueprint_exports: { daily: 5, monthly: 30 },
    voice_minutes: { daily: 5, monthly: 30 },
  },
  member: {
    requests: { daily: 250, monthly: 3_500 },
    ai_tokens: { daily: 250_000, monthly: 3_500_000 },
    turns: { daily: 60, monthly: 1_200 },
    storage_bytes: { daily: 1 * 1024 * 1024, monthly: 5 * 1024 * 1024 }, // 5 MB total
    blueprint_exports: { daily: 25, monthly: 300 },
    voice_minutes: { daily: 30, monthly: 300 },
  },
  pro: {
    requests: { daily: 1_500, monthly: 25_000 },
    ai_tokens: { daily: 2_000_000, monthly: 30_000_000 },
    turns: { daily: 300, monthly: 6_000 },
    storage_bytes: { daily: 100 * 1024 * 1024, monthly: 1 * 1024 * 1024 * 1024 }, // 1 GB total
    blueprint_exports: { daily: 200, monthly: 3_000 },
    voice_minutes: { daily: 180, monthly: 3_000 },
  },
  admin: {
    requests: { daily: 1_000_000, monthly: 10_000_000 },
    ai_tokens: { daily: 100_000_000, monthly: 1_000_000_000 },
    turns: { daily: 100_000, monthly: 1_000_000 },
    storage_bytes: { daily: 100 * 1024 * 1024 * 1024, monthly: 1024 * 1024 * 1024 * 1024 },
    blueprint_exports: { daily: 100_000, monthly: 1_000_000 },
    voice_minutes: { daily: 100_000, monthly: 1_000_000 },
  },
};

/**
 * Default fallback quota per role when an ad-hoc custom metric key is tracked
 * without explicit prior registration.
 */
export const DEFAULT_CUSTOM_METRIC_QUOTAS: Record<UserRole, RoleQuota> = {
  guest: { daily: 15, monthly: 150 },
  member: { daily: 60, monthly: 1_000 },
  pro: { daily: 500, monthly: 10_000 },
  admin: { daily: 1_000_000, monthly: 10_000_000 },
};

const INITIAL_METRICS: Record<BuiltInUsageMetric, UsageMetricDefinition> = {
  requests: {
    metric: "requests",
    label: "API Requests",
    description: "Total authenticated and guest API gateway invocations.",
    unit: "req",
    formatDivisor: 1,
    defaultApp: "api",
    quotas: {
      guest: ROLE_QUOTAS.guest.requests,
      member: ROLE_QUOTAS.member.requests,
      pro: ROLE_QUOTAS.pro.requests,
      admin: ROLE_QUOTAS.admin.requests,
    },
  },
  turns: {
    metric: "turns",
    label: "Rose AI Turns",
    description: "Conversational turns and tool executions in Rose AI.",
    unit: "turns",
    formatDivisor: 1,
    defaultApp: "rose",
    quotas: {
      guest: ROLE_QUOTAS.guest.turns,
      member: ROLE_QUOTAS.member.turns,
      pro: ROLE_QUOTAS.pro.turns,
      admin: ROLE_QUOTAS.admin.turns,
    },
  },
  ai_tokens: {
    metric: "ai_tokens",
    label: "AI Tokens",
    description: "Prompt and completion token consumption across AI models.",
    unit: "k tok",
    formatDivisor: 1000,
    formatDecimals: 1,
    defaultApp: "rose",
    quotas: {
      guest: ROLE_QUOTAS.guest.ai_tokens,
      member: ROLE_QUOTAS.member.ai_tokens,
      pro: ROLE_QUOTAS.pro.ai_tokens,
      admin: ROLE_QUOTAS.admin.ai_tokens,
    },
  },
  storage_bytes: {
    metric: "storage_bytes",
    label: "Cloud Storage",
    description: "Uploaded media files and cloud workspace assets.",
    unit: "KB",
    formatDivisor: 1024,
    formatDecimals: 0,
    defaultApp: "media",
    quotas: {
      guest: ROLE_QUOTAS.guest.storage_bytes,
      member: ROLE_QUOTAS.member.storage_bytes,
      pro: ROLE_QUOTAS.pro.storage_bytes,
      admin: ROLE_QUOTAS.admin.storage_bytes,
    },
  },
  blueprint_exports: {
    metric: "blueprint_exports",
    label: "Blueprint & Graph Exports",
    description: "Crafting tree, factory planner, and calculator exports.",
    unit: "exports",
    formatDivisor: 1,
    defaultApp: "calculator",
    quotas: {
      guest: ROLE_QUOTAS.guest.blueprint_exports,
      member: ROLE_QUOTAS.member.blueprint_exports,
      pro: ROLE_QUOTAS.pro.blueprint_exports,
      admin: ROLE_QUOTAS.admin.blueprint_exports,
    },
  },
  voice_minutes: {
    metric: "voice_minutes",
    label: "Voice Session Minutes",
    description: "Real-time voice synthesis and audio streaming minutes.",
    unit: "min",
    formatDivisor: 1,
    defaultApp: "rose",
    quotas: {
      guest: ROLE_QUOTAS.guest.voice_minutes,
      member: ROLE_QUOTAS.member.voice_minutes,
      pro: ROLE_QUOTAS.pro.voice_minutes,
      admin: ROLE_QUOTAS.admin.voice_minutes,
    },
  },
};

/**
 * Live registry of all known usage metrics.
 * Any package or component can register a new metric at runtime via `registerUsageMetric`.
 */
export const USAGE_METRICS_REGISTRY = new Map<string, UsageMetricDefinition>(
  Object.entries(INITIAL_METRICS)
);

function humanizeMetricKey(metric: string): string {
  return metric
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Registers or updates a usage metric definition in the global registry and syncs `ROLE_QUOTAS`.
 */
export function registerUsageMetric(definition: UsageMetricDefinition): UsageMetricDefinition {
  const normalized: UsageMetricDefinition = {
    formatDivisor: 1,
    formatDecimals: 0,
    defaultApp: "global",
    minRole: "guest",
    warningThreshold: 75,
    dangerThreshold: 90,
    ...definition,
  };
  USAGE_METRICS_REGISTRY.set(normalized.metric, normalized);

  const roles: UserRole[] = ["guest", "member", "pro", "admin"];
  for (const r of roles) {
    if (normalized.quotas[r]) {
      ROLE_QUOTAS[r][normalized.metric] = normalized.quotas[r];
    }
  }
  return normalized;
}

/**
 * Retrieves the definition for any metric. If the metric was not explicitly registered,
 * synthesizes a clean default definition so any custom component metric works out of the box.
 */
export function getMetricDefinition(metric: UsageMetric): UsageMetricDefinition {
  const existing = USAGE_METRICS_REGISTRY.get(metric);
  if (existing) return existing;

  return {
    metric,
    label: humanizeMetricKey(metric),
    unit: "uses",
    formatDivisor: 1,
    formatDecimals: 0,
    defaultApp: "global",
    minRole: "guest",
    warningThreshold: 75,
    dangerThreshold: 90,
    quotas: {
      guest: ROLE_QUOTAS.guest[metric] ?? DEFAULT_CUSTOM_METRIC_QUOTAS.guest,
      member: ROLE_QUOTAS.member[metric] ?? DEFAULT_CUSTOM_METRIC_QUOTAS.member,
      pro: ROLE_QUOTAS.pro[metric] ?? DEFAULT_CUSTOM_METRIC_QUOTAS.pro,
      admin: ROLE_QUOTAS.admin[metric] ?? DEFAULT_CUSTOM_METRIC_QUOTAS.admin,
    },
  };
}

/**
 * Returns all registered metric definitions.
 */
export function listRegisteredMetrics(): UsageMetricDefinition[] {
  return Array.from(USAGE_METRICS_REGISTRY.values());
}

/**
 * Resolves the daily and monthly quota for a given role and metric.
 */
export function getRoleQuotaForMetric(role: UserRole, metric: UsageMetric): RoleQuota {
  const def = getMetricDefinition(metric);
  return def.quotas[role] ?? def.quotas.member ?? DEFAULT_CUSTOM_METRIC_QUOTAS[role];
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  member: 1,
  pro: 2,
  admin: 3,
};

/**
 * Checks whether a user's current role meets or exceeds a required minimum role.
 */
export function isRoleAtLeast(userRole: UserRole, minRole: UserRole): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

export interface CheckUsageResult {
  allowed: boolean;
  role: UserRole;
  metric: UsageMetric;
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
  exceededType?: "daily" | "monthly" | "role";
  remaining: number;
  day: string;
  month: string;
}

export interface RoseUsage {
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

export function currentDay(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function currentMonth(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

export function currentWeek(): string {
  const now = new Date();
  const jan1 = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((now.getTime() - jan1.getTime()) / 86_400_000) + 1;
  const weekNum = Math.ceil(dayOfYear / 7);
  return `${now.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function roseDailyLimitGuest(): number {
  const raw = typeof process !== "undefined" ? process.env?.ROSE_DAILY_LIMIT_GUEST : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : ROLE_QUOTAS.guest.turns.daily;
}

export function roseWeeklyLimitGuest(): number {
  const raw = typeof process !== "undefined" ? process.env?.ROSE_WEEKLY_LIMIT_GUEST : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : ROLE_QUOTAS.guest.turns.monthly;
}

export function roseDailyLimitUser(): number {
  const raw = typeof process !== "undefined" ? process.env?.ROSE_DAILY_LIMIT_USER : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : ROLE_QUOTAS.member.turns.daily;
}

export function roseWeeklyLimitUser(): number {
  const raw = typeof process !== "undefined" ? process.env?.ROSE_WEEKLY_LIMIT_USER : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : ROLE_QUOTAS.member.turns.monthly;
}

export function getRoleLimits(roles: string[] = []): {
  role: UserRole;
  weeklyLimit: number;
  dailyLimit: number;
} {
  if (roles.includes("admin")) {
    return { role: "admin", weeklyLimit: Infinity, dailyLimit: Infinity };
  }
  if (roles.includes("pro")) {
    return {
      role: "pro",
      weeklyLimit: ROLE_QUOTAS.pro.turns.monthly,
      dailyLimit: ROLE_QUOTAS.pro.turns.daily,
    };
  }
  if (roles.includes("guest") || roles.includes("anon")) {
    return {
      role: "guest",
      weeklyLimit: roseWeeklyLimitGuest(),
      dailyLimit: roseDailyLimitGuest(),
    };
  }
  return {
    role: "member",
    weeklyLimit: roseWeeklyLimitUser(),
    dailyLimit: roseDailyLimitUser(),
  };
}

interface LocalUsageLedgerEntry {
  dailyCount: number;
  monthlyCount: number;
  day: string;
  month: string;
}

// Strict in-memory fallback ledger so that if Supabase RPC is unreachable,
// quota enforcement still locks callers when they exceed their role quota!
const FALLBACK_USAGE_LEDGER = new Map<string, LocalUsageLedgerEntry>();

export function resetFallbackUsageLedger(): void {
  FALLBACK_USAGE_LEDGER.clear();
}

function getLedgerKey(userId: string, app: string, metric: UsageMetric): string {
  return `${userId}::${app}::${metric}`;
}

function evaluateFallbackLedger(options: {
  userId: string;
  app: string;
  metric: UsageMetric;
  amount: number;
  role: UserRole;
  dailyLimit: number;
  monthlyLimit: number;
}): CheckUsageResult {
  const { userId, app, metric, amount, role, dailyLimit, monthlyLimit } = options;
  const day = currentDay();
  const month = currentMonth();
  const key = getLedgerKey(userId, app, metric);

  const existing = FALLBACK_USAGE_LEDGER.get(key);
  let dailyCount = existing && existing.day === day ? existing.dailyCount : 0;
  let monthlyCount = existing && existing.month === month ? existing.monthlyCount : 0;

  if (amount > 0) {
    if (dailyCount + amount > dailyLimit) {
      return {
        allowed: false,
        role,
        metric,
        dailyCount,
        dailyLimit,
        monthlyCount,
        monthlyLimit,
        exceededType: "daily",
        remaining: 0,
        day,
        month,
      };
    }
    if (monthlyCount + amount > monthlyLimit) {
      return {
        allowed: false,
        role,
        metric,
        dailyCount,
        dailyLimit,
        monthlyCount,
        monthlyLimit,
        exceededType: "monthly",
        remaining: 0,
        day,
        month,
      };
    }

    dailyCount += amount;
    monthlyCount += amount;
    FALLBACK_USAGE_LEDGER.set(key, {
      dailyCount,
      monthlyCount,
      day,
      month,
    });
  }

  const dailyAllowed = dailyCount < dailyLimit;
  const monthlyAllowed = monthlyCount < monthlyLimit;
  const allowed = amount > 0 ? true : dailyAllowed && monthlyAllowed;
  const dailyRemaining = Math.max(0, dailyLimit - dailyCount);
  const monthlyRemaining = Math.max(0, monthlyLimit - monthlyCount);

  return {
    allowed,
    role,
    metric,
    dailyCount,
    dailyLimit,
    monthlyCount,
    monthlyLimit,
    exceededType: !dailyAllowed ? "daily" : !monthlyAllowed ? "monthly" : undefined,
    remaining: Math.min(dailyRemaining, monthlyRemaining),
    day,
    month,
  };
}

function toDeterministicUuid(input: string): string {
  if (!input) return "00000000-0000-0000-0000-000000000001";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(input)) return input;

  // Deterministic hash-to-UUID for IP or session identifiers so each guest gets an isolated bucket
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const hex2 = (h2 >>> 0).toString(16).padStart(8, "0");
  return `${hex1}-${hex2.slice(0, 4)}-4${hex2.slice(5, 8)}-8${hex1.slice(1, 4)}-${hex1}${hex2.slice(0, 4)}`;
}

/**
 * Increments (or reads when amount = 0) usage for a user, checking both daily and monthly limits atomically.
 * Strictly server-only: throws if invoked in a browser environment, rejects negative `amount`,
 * and uses `createServiceClient()` on the server so `increment_user_usage` executes with `service_role`.
 * Falls back to strict in-memory quota enforcement if the database RPC is temporarily unreachable.
 */
export async function recordAndCheckUsage(options: {
  userId: string;
  app?: string;
  metric: UsageMetric;
  amount?: number;
  role?: UserRole;
  dailyLimitOverride?: number;
  monthlyLimitOverride?: number;
  clientOverride?: SupabaseClient<Database>;
}): Promise<CheckUsageResult> {
  assertServerOnlyExecution("recordAndCheckUsage");

  const { userId, metric, amount = 1 } = options;
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Invalid negative usage increment: `amount` must be a non-negative number.");
  }

  const def = getMetricDefinition(metric);
  const app = options.app || def.defaultApp || "global";
  const validUserId = toDeterministicUuid(userId);
  const day = currentDay();
  const month = currentMonth();

  const role: UserRole = options.role ?? "member";
  const baseQuota = getRoleQuotaForMetric(role, metric);
  const dailyLimit = options.dailyLimitOverride ?? baseQuota.daily;
  const monthlyLimit = options.monthlyLimitOverride ?? baseQuota.monthly;

  if (def.minRole && !isRoleAtLeast(role, def.minRole)) {
    return {
      allowed: false,
      role,
      metric,
      dailyCount: 0,
      dailyLimit,
      monthlyCount: 0,
      monthlyLimit,
      exceededType: "role",
      remaining: 0,
      day,
      month,
    };
  }

  if (role === "admin") {
    return {
      allowed: true,
      role: "admin",
      metric,
      dailyCount: 0,
      dailyLimit: Infinity,
      monthlyCount: 0,
      monthlyLimit: Infinity,
      remaining: Infinity,
      day,
      month,
    };
  }

  const isOfflineTest =
    !options.clientOverride &&
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL;

  if (!isOfflineTest) {
    try {
      const supabase =
        options.clientOverride ||
        (typeof window === "undefined" ? createServiceClient() : createClient());
      const { data, error } = await supabase.rpc("increment_user_usage", {
        p_user_id: validUserId,
        p_app: app,
        p_metric: metric,
        p_amount: amount,
        p_daily_limit: dailyLimit,
        p_monthly_limit: monthlyLimit,
      } as never);

      if (!error && data && typeof data === "object" && "daily_count" in (data as Record<string, unknown>)) {
        const res = data as {
          allowed: boolean;
          role?: UserRole;
          daily_count: number;
          daily_limit: number;
          monthly_count: number;
          monthly_limit: number;
          exceeded_type?: "daily" | "monthly" | null;
        };

        const dCount = Number(res.daily_count);
        const dLimit = Number(res.daily_limit) || dailyLimit;
        const mCount = Number(res.monthly_count);
        const mLimit = Number(res.monthly_limit) || monthlyLimit;

        // Sync fallback ledger with DB state
        FALLBACK_USAGE_LEDGER.set(getLedgerKey(validUserId, app, metric), {
          dailyCount: dCount,
          monthlyCount: mCount,
          day,
          month,
        });

        const dRem = Math.max(0, dLimit - dCount);
        const mRem = Math.max(0, mLimit - mCount);

        return {
          allowed: Boolean(res.allowed),
          role: res.role || role,
          metric,
          dailyCount: dCount,
          dailyLimit: dLimit,
          monthlyCount: mCount,
          monthlyLimit: mLimit,
          exceededType: res.exceeded_type || (!res.allowed ? (dCount >= dLimit ? "daily" : "monthly") : undefined),
          remaining: res.allowed ? Math.min(dRem, mRem) : 0,
          day,
          month,
        };
      }

      // Secondary DB fallback: check user_usages table directly if RPC not yet deployed
      if (supabase.from) {
        const queryBuilder = supabase.from("user_usages");
        if (queryBuilder && typeof queryBuilder.select === "function") {
          const [dailyRes, monthlyRes] = await Promise.all([
            supabase
              .from("user_usages")
              .select("count, usage_limit")
              .eq("user_id", validUserId)
              .eq("app", app)
              .eq("metric", metric)
              .eq("period_type", "daily")
              .eq("period_key", day)
              .maybeSingle(),
            supabase
              .from("user_usages")
              .select("count, usage_limit")
              .eq("user_id", validUserId)
              .eq("app", app)
              .eq("metric", metric)
              .eq("period_type", "monthly")
              .eq("period_key", month)
              .maybeSingle(),
          ]);

          if (!dailyRes?.error && !monthlyRes?.error && (dailyRes?.data || monthlyRes?.data)) {
            const existingLedger = FALLBACK_USAGE_LEDGER.get(getLedgerKey(validUserId, app, metric));
            let dCount = Math.max(
              Number((dailyRes?.data as any)?.count ?? 0),
              existingLedger?.day === day ? existingLedger.dailyCount : 0
            );
            let mCount = Math.max(
              Number((monthlyRes?.data as any)?.count ?? 0),
              existingLedger?.month === month ? existingLedger.monthlyCount : 0
            );
            const dLimit = Number((dailyRes?.data as any)?.usage_limit) || dailyLimit;
            const mLimit = Number((monthlyRes?.data as any)?.usage_limit) || monthlyLimit;

            if (amount > 0) {
              if (dCount + amount > dLimit) {
                return {
                  allowed: false,
                  role,
                  metric,
                  dailyCount: dCount,
                  dailyLimit: dLimit,
                  monthlyCount: mCount,
                  monthlyLimit: mLimit,
                  exceededType: "daily",
                  remaining: 0,
                  day,
                  month,
                };
              }
              if (mCount + amount > mLimit) {
                return {
                  allowed: false,
                  role,
                  metric,
                  dailyCount: dCount,
                  dailyLimit: dLimit,
                  monthlyCount: mCount,
                  monthlyLimit: mLimit,
                  exceededType: "monthly",
                  remaining: 0,
                  day,
                  month,
                };
              }
              dCount += amount;
              mCount += amount;
            }

            FALLBACK_USAGE_LEDGER.set(getLedgerKey(validUserId, app, metric), {
              dailyCount: dCount,
              monthlyCount: mCount,
              day,
              month,
            });

            const dRem = Math.max(0, dLimit - dCount);
            const mRem = Math.max(0, mLimit - mCount);
            const allowed = dCount <= dLimit && mCount <= mLimit && (amount > 0 || (dCount < dLimit && mCount < mLimit));

            return {
              allowed,
              role,
              metric,
              dailyCount: dCount,
              dailyLimit: dLimit,
              monthlyCount: mCount,
              monthlyLimit: mLimit,
              exceededType: !allowed ? (dCount >= dLimit ? "daily" : "monthly") : undefined,
              remaining: Math.min(dRem, mRem),
              day,
              month,
            };
          }
        }
      }
    } catch {
      // Fall through to strict in-memory ledger
    }
  }

  return evaluateFallbackLedger({
    userId: validUserId,
    app,
    metric,
    amount,
    role,
    dailyLimit,
    monthlyLimit,
  });
}

/**
 * Reads current usage for a specific metric without incrementing.
 */
export async function getUserUsageStatus(options: {
  userId: string;
  app?: string;
  metric: UsageMetric;
  role?: UserRole;
  clientOverride?: SupabaseClient<Database>;
}): Promise<CheckUsageResult> {
  return recordAndCheckUsage({
    ...options,
    amount: 0,
  });
}

/**
 * Reads current Rose AI usage without incrementing.
 * Uses the unified @mono/database quota engine while preserving the RoseUsage shape.
 */
export async function getRoseUsage(
  userId: string,
  roles: string[] = [],
  clientOverride?: SupabaseClient<Database>
): Promise<RoseUsage> {
  const { role, dailyLimit, weeklyLimit } = getRoleLimits(roles);
  const week = currentWeek();
  const day = currentDay();

  if (role === "admin") {
    return {
      allowed: true,
      count: 0,
      limit: Infinity,
      week,
      dailyCount: 0,
      dailyLimit: Infinity,
      day,
      remaining: Infinity,
      role: "admin",
    };
  }

  const res = await recordAndCheckUsage({
    userId,
    app: "rose",
    metric: "turns",
    amount: 0,
    role,
    dailyLimitOverride: dailyLimit,
    monthlyLimitOverride: weeklyLimit,
    clientOverride,
  });

  return {
    allowed: res.allowed,
    count: res.monthlyCount,
    limit: res.monthlyLimit,
    week,
    dailyCount: res.dailyCount,
    dailyLimit: res.dailyLimit,
    day: res.day,
    exceededType: res.exceededType === "monthly" ? "weekly" : res.exceededType === "role" ? "daily" : res.exceededType,
    remaining: res.remaining,
    role: role === "member" ? "authenticated" : role,
  };
}

/**
 * Atomically checks and increments Rose AI usage by 1 turn.
 */
export async function checkAndIncrementRoseUsage(
  userId: string,
  roles: string[] = [],
  clientOverride?: SupabaseClient<Database>
): Promise<RoseUsage> {
  const { role, dailyLimit, weeklyLimit } = getRoleLimits(roles);
  const week = currentWeek();
  const day = currentDay();

  if (role === "admin") {
    return {
      allowed: true,
      count: 0,
      limit: Infinity,
      week,
      dailyCount: 0,
      dailyLimit: Infinity,
      day,
      remaining: Infinity,
      role: "admin",
    };
  }

  const res = await recordAndCheckUsage({
    userId,
    app: "rose",
    metric: "turns",
    amount: 1,
    role,
    dailyLimitOverride: dailyLimit,
    monthlyLimitOverride: weeklyLimit,
    clientOverride,
  });

  return {
    allowed: res.allowed,
    count: res.monthlyCount,
    limit: res.monthlyLimit,
    week,
    dailyCount: res.dailyCount,
    dailyLimit: res.dailyLimit,
    day: res.day,
    exceededType: res.exceededType === "monthly" ? "weekly" : res.exceededType === "role" ? "daily" : res.exceededType,
    remaining: res.remaining,
    role: role === "member" ? "authenticated" : role,
  };
}

/**
 * Retrieves the user's current daily and monthly usage summaries across apps.
 */
export async function getUserUsageSummary(
  userId: string,
  clientOverride?: SupabaseClient<Database>
): Promise<UserUsageRecord[]> {
  try {
    const supabase = clientOverride || createClient();
    const validUserId = toDeterministicUuid(userId);
    const { data, error } = await supabase
      .from("user_usages")
      .select("*")
      .eq("user_id", validUserId)
      .order("updated_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as UserUsageRecord[];
  } catch {
    return [];
  }
}
