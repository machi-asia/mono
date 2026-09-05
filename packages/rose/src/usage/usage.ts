import { createClient } from "@mono/database";

export function currentWeek(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - jan1.getTime()) / 86_400_000) + 1;
  const weekNum = Math.ceil(dayOfYear / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function currentDay(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export interface RoseUsage {
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

export function roseDailyLimitGuest(): number {
  const raw = process.env.ROSE_DAILY_LIMIT_GUEST;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export function roseWeeklyLimitGuest(): number {
  const raw = process.env.ROSE_WEEKLY_LIMIT_GUEST;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
}

export function roseDailyLimitUser(): number {
  const raw = process.env.ROSE_DAILY_LIMIT_USER;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
}

export function roseWeeklyLimitUser(): number {
  const raw = process.env.ROSE_WEEKLY_LIMIT_USER;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 200;
}

export function getRoleLimits(roles: string[] = []): {
  role: "admin" | "guest" | "authenticated";
  weeklyLimit: number;
  dailyLimit: number;
} {
  if (roles.includes("admin")) {
    return { role: "admin", weeklyLimit: Infinity, dailyLimit: Infinity };
  }
  if (roles.includes("guest") || roles.includes("anon")) {
    return {
      role: "guest",
      weeklyLimit: roseWeeklyLimitGuest(),
      dailyLimit: roseDailyLimitGuest(),
    };
  }
  return {
    role: "authenticated",
    weeklyLimit: roseWeeklyLimitUser(),
    dailyLimit: roseDailyLimitUser(),
  };
}

interface UsageRecord {
  dailyCount: number;
  weeklyCount: number;
  day: string;
  week: string;
}

const GLOBAL_USAGE_STORE = new Map<string, UsageRecord>();

function toValidUuid(userId: string): string {
  if (!userId) return "00000000-0000-0000-0000-000000000001";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) return userId;
  return "00000000-0000-0000-0000-000000000001";
}

export async function getRoseUsage(
  userId: string,
  roles: string[] = [],
  clientOverride?: any
): Promise<RoseUsage> {
  const week = currentWeek();
  const day = currentDay();
  const validUserId = toValidUuid(userId);
  const { role, weeklyLimit, dailyLimit } = getRoleLimits(roles);

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

  const cached = GLOBAL_USAGE_STORE.get(validUserId);
  let initialWeeklyCount = cached && cached.week === week ? cached.weeklyCount : 0;
  let initialDailyCount = cached && cached.day === day ? cached.dailyCount : 0;

  try {
    const supabase = clientOverride || createClient();
    const [weeklyRes, dailyRes] = await Promise.all([
      supabase
        .from("usage_limits")
        .select("count, usage_limit")
        .eq("user_id", validUserId)
        .eq("week", week)
        .eq("service_key", "ROSE")
        .maybeSingle(),
      supabase
        .from("usage_limits")
        .select("count, usage_limit")
        .eq("user_id", validUserId)
        .eq("week", day)
        .eq("service_key", "ROSE_DAILY")
        .maybeSingle(),
    ]);

    const weeklyCount = weeklyRes?.data?.count ?? initialWeeklyCount;
    const effectiveWeeklyLimit = weeklyRes?.data?.usage_limit ?? weeklyLimit;

    const dailyCount = dailyRes?.data?.count ?? initialDailyCount;
    const effectiveDailyLimit = dailyRes?.data?.usage_limit ?? dailyLimit;

    GLOBAL_USAGE_STORE.set(validUserId, {
      dailyCount,
      weeklyCount,
      day,
      week,
    });

    const dailyAllowed = dailyCount < effectiveDailyLimit;
    const weeklyAllowed = weeklyCount < effectiveWeeklyLimit;
    const allowed = dailyAllowed && weeklyAllowed;

    const dailyRemaining = Math.max(0, effectiveDailyLimit - dailyCount);
    const weeklyRemaining = Math.max(0, effectiveWeeklyLimit - weeklyCount);

    return {
      allowed,
      count: weeklyCount,
      limit: effectiveWeeklyLimit,
      week,
      dailyCount,
      dailyLimit: effectiveDailyLimit,
      day,
      exceededType: !dailyAllowed ? "daily" : !weeklyAllowed ? "weekly" : undefined,
      remaining: Math.min(dailyRemaining, weeklyRemaining),
      role,
    };
  } catch {
    const dailyRemaining = Math.max(0, dailyLimit - initialDailyCount);
    const weeklyRemaining = Math.max(0, weeklyLimit - initialWeeklyCount);

    return {
      allowed: initialDailyCount < dailyLimit && initialWeeklyCount < weeklyLimit,
      count: initialWeeklyCount,
      limit: weeklyLimit,
      week,
      dailyCount: initialDailyCount,
      dailyLimit,
      day,
      remaining: Math.min(dailyRemaining, weeklyRemaining),
      role,
    };
  }
}

export async function checkAndIncrementRoseUsage(
  userId: string,
  roles: string[] = [],
  clientOverride?: any
): Promise<RoseUsage> {
  const week = currentWeek();
  const day = currentDay();
  const validUserId = toValidUuid(userId);
  const { role, weeklyLimit, dailyLimit } = getRoleLimits(roles);

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

  const cached = GLOBAL_USAGE_STORE.get(validUserId);
  let currentWeeklyCount = cached && cached.week === week ? cached.weeklyCount : 0;
  let currentDailyCount = cached && cached.day === day ? cached.dailyCount : 0;
  let effectiveWeeklyLimit = weeklyLimit;
  let effectiveDailyLimit = dailyLimit;

  try {
    const supabase = clientOverride || createClient();
    const [weeklyRes, dailyRes] = await Promise.all([
      supabase
        .from("usage_limits")
        .select("count, usage_limit")
        .eq("user_id", validUserId)
        .eq("week", week)
        .eq("service_key", "ROSE")
        .maybeSingle(),
      supabase
        .from("usage_limits")
        .select("count, usage_limit")
        .eq("user_id", validUserId)
        .eq("week", day)
        .eq("service_key", "ROSE_DAILY")
        .maybeSingle(),
    ]);

    if (typeof weeklyRes?.data?.count === "number") {
      currentWeeklyCount = Math.max(currentWeeklyCount, weeklyRes.data.count);
    }
    if (typeof weeklyRes?.data?.usage_limit === "number") {
      effectiveWeeklyLimit = weeklyRes.data.usage_limit;
    }

    if (typeof dailyRes?.data?.count === "number") {
      currentDailyCount = Math.max(currentDailyCount, dailyRes.data.count);
    }
    if (typeof dailyRes?.data?.usage_limit === "number") {
      effectiveDailyLimit = dailyRes.data.usage_limit;
    }
  } catch {
    // non-critical, use memory cache
  }

  if (currentDailyCount >= effectiveDailyLimit) {
    return {
      allowed: false,
      count: currentWeeklyCount,
      limit: effectiveWeeklyLimit,
      week,
      dailyCount: currentDailyCount,
      dailyLimit: effectiveDailyLimit,
      day,
      exceededType: "daily",
      remaining: 0,
      role,
    };
  }

  if (currentWeeklyCount >= effectiveWeeklyLimit) {
    return {
      allowed: false,
      count: currentWeeklyCount,
      limit: effectiveWeeklyLimit,
      week,
      dailyCount: currentDailyCount,
      dailyLimit: effectiveDailyLimit,
      day,
      exceededType: "weekly",
      remaining: 0,
      role,
    };
  }

  const newDailyCount = currentDailyCount + 1;
  const newWeeklyCount = currentWeeklyCount + 1;

  GLOBAL_USAGE_STORE.set(validUserId, {
    dailyCount: newDailyCount,
    weeklyCount: newWeeklyCount,
    day,
    week,
  });

  try {
    const supabase = clientOverride || createClient();
    await supabase.from("usage_limits").upsert(
      [
        {
          user_id: validUserId,
          week: day,
          count: newDailyCount,
          usage_limit: effectiveDailyLimit,
          service_key: "ROSE_DAILY",
          updated_at: new Date().toISOString(),
        },
        {
          user_id: validUserId,
          week: week,
          count: newWeeklyCount,
          usage_limit: effectiveWeeklyLimit,
          service_key: "ROSE",
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id,week,service_key" }
    );
  } catch {
    // non-critical
  }

  const dailyRemaining = Math.max(0, effectiveDailyLimit - newDailyCount);
  const weeklyRemaining = Math.max(0, effectiveWeeklyLimit - newWeeklyCount);

  return {
    allowed: true,
    count: newWeeklyCount,
    limit: effectiveWeeklyLimit,
    week,
    dailyCount: newDailyCount,
    dailyLimit: effectiveDailyLimit,
    day,
    remaining: Math.min(dailyRemaining, weeklyRemaining),
    role,
  };
}
