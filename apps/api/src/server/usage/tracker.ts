import { NextResponse } from "next/server";
import {
  ROLE_QUOTAS,
  getMetricDefinition,
  listRegisteredMetrics,
  recordAndCheckUsage,
  roseDailyLimitGuest,
  roseDailyLimitUser,
  roseWeeklyLimitGuest,
  roseWeeklyLimitUser,
  type CheckUsageResult,
  type RoleQuota,
  type UsageMetric,
  type UserRole,
} from "@mono/database";
import { getRoseUsage, checkAndIncrementRoseUsage, type RoseUsage } from "../rose/usage-calc";
import { resolveRequestAuth, type RequestAuthContext } from "../security/guard";

export interface ApiUsageMetric {
  endpoint: string;
  method: string;
  count: number;
  totalLatencyMs: number;
  avgLatencyMs: number;
  lastAccessed: string;
  errorCount: number;
}

export interface SystemUsageSummary {
  status: "healthy" | "degraded";
  uptimeSeconds: number;
  totalRequests: number;
  totalErrors: number;
  activeSseConnections: number;
  endpoints: Record<string, ApiUsageMetric>;
  quotas: Record<UserRole, Record<string, RoleQuota>>;
  rose: {
    guestDailyLimit: number;
    userDailyLimit: number;
    guestWeeklyLimit: number;
    userWeeklyLimit: number;
  };
}

export interface SerializedMetricQuota {
  locked: boolean;
  allowed: boolean;
  metric: UsageMetric;
  label: string;
  unit: string;
  formatDivisor: number;
  role: UserRole;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  remaining: number;
  exceededType?: "daily" | "monthly" | "role";
}

// In-memory telemetry cache
const startTime = Date.now();
let totalApiRequests = 0;
let totalApiErrors = 0;
const endpointMetrics: Map<string, ApiUsageMetric> = new Map();

export function recordApiCall(
  endpoint: string,
  method: string,
  latencyMs: number,
  isError = false
) {
  totalApiRequests++;
  if (isError) totalApiErrors++;

  const key = `${method.toUpperCase()} ${endpoint}`;
  const existing = endpointMetrics.get(key) || {
    endpoint,
    method: method.toUpperCase(),
    count: 0,
    totalLatencyMs: 0,
    avgLatencyMs: 0,
    lastAccessed: new Date().toISOString(),
    errorCount: 0,
  };

  existing.count++;
  existing.totalLatencyMs += latencyMs;
  existing.avgLatencyMs = Math.round(existing.totalLatencyMs / existing.count);
  existing.lastAccessed = new Date().toISOString();
  if (isError) existing.errorCount++;

  endpointMetrics.set(key, existing);
}

export async function getSystemUsageSummary(): Promise<SystemUsageSummary> {
  const endpointsObj: Record<string, ApiUsageMetric> = {};
  endpointMetrics.forEach((v, k) => {
    endpointsObj[k] = v;
  });

  return {
    status: "healthy",
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    totalRequests: totalApiRequests,
    totalErrors: totalApiErrors,
    activeSseConnections: (globalThis as any).__activeSseCount || 0,
    endpoints: endpointsObj,
    quotas: ROLE_QUOTAS,
    rose: {
      guestDailyLimit: roseDailyLimitGuest(),
      userDailyLimit: roseDailyLimitUser(),
      guestWeeklyLimit: roseWeeklyLimitGuest(),
      userWeeklyLimit: roseWeeklyLimitUser(),
    },
  };
}

export function serializeCheckResult(check: CheckUsageResult): SerializedMetricQuota {
  const def = getMetricDefinition(check.metric);
  return {
    locked: !check.allowed,
    allowed: check.allowed,
    metric: check.metric,
    label: def.label,
    unit: def.unit,
    formatDivisor: def.formatDivisor || 1,
    role: check.role,
    dailyUsed: check.dailyCount,
    dailyLimit: check.dailyLimit,
    monthlyUsed: check.monthlyCount,
    monthlyLimit: check.monthlyLimit,
    remaining: check.remaining,
    exceededType: check.exceededType,
  };
}

export async function buildUserUsageSnapshot(
  auth: RequestAuthContext,
  requestedMetrics?: string[]
): Promise<{
  userId: string;
  role: UserRole;
  metrics: Record<string, SerializedMetricQuota>;
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
}> {
  const defaultKeys = listRegisteredMetrics().map((d) => d.metric);
  const metricKeys =
    requestedMetrics && requestedMetrics.length > 0
      ? Array.from(new Set(requestedMetrics.map((m) => m.trim()).filter(Boolean)))
      : defaultKeys;

  const checks = await Promise.all(
    metricKeys.map((metric) => {
      const def = getMetricDefinition(metric);
      return recordAndCheckUsage({
        userId: auth.userId,
        app: def.defaultApp || "global",
        metric,
        amount: 0,
        role: auth.role,
      });
    })
  );

  const metricsMap: Record<string, SerializedMetricQuota> = {};
  const quotasMap: Record<
    string,
    {
      dailyCount: number;
      dailyLimit: number;
      monthlyCount: number;
      monthlyLimit: number;
      allowed: boolean;
      remaining: number;
    }
  > = {};

  for (const check of checks) {
    metricsMap[check.metric] = serializeCheckResult(check);
    quotasMap[check.metric] = {
      dailyCount: check.dailyCount,
      dailyLimit: check.dailyLimit,
      monthlyCount: check.monthlyCount,
      monthlyLimit: check.monthlyLimit,
      allowed: check.allowed,
      remaining: check.remaining,
    };
  }

  return {
    userId: auth.userId,
    role: auth.role,
    metrics: metricsMap,
    quotas: quotasMap,
  };
}

export async function handleUsageMetricsRoute(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const scope = url.searchParams.get("scope");

    if (scope === "user") {
      const auth = await resolveRequestAuth(req);
      const metricsParam = url.searchParams.get("metrics");
      const requestedMetrics = metricsParam
        ? metricsParam
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean)
        : undefined;

      const snapshot = await buildUserUsageSnapshot(auth, requestedMetrics);
      return NextResponse.json(snapshot);
    }

    const summary = await getSystemUsageSummary();
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: { code: "internal_error", message: "Failed to generate usage summary" } },
      { status: 500 }
    );
  }
}

export async function handleUsageTrackRoute(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<Response> {
  try {
    const auth = authOverride || (await resolveRequestAuth(req));

    if (req.method === "GET") {
      const url = new URL(req.url);
      const metricsParam = url.searchParams.get("metrics") || url.searchParams.get("metric");
      const requestedMetrics = metricsParam
        ? metricsParam
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean)
        : undefined;
      const snapshot = await buildUserUsageSnapshot(auth, requestedMetrics);
      return NextResponse.json(snapshot);
    }

    const body = (await req.json().catch(() => ({}))) as {
      metric?: string;
      app?: string;
      amount?: number;
      checkOnly?: boolean;
      dailyLimitOverride?: number;
      monthlyLimitOverride?: number;
    };

    const metric = typeof body.metric === "string" && body.metric.trim() ? body.metric.trim() : "";
    if (!metric || !/^[a-z0-9_:-]{1,64}$/i.test(metric)) {
      return NextResponse.json(
        {
          error: {
            code: "bad_request",
            message: "A valid `metric` key (1-64 alphanumeric/underscore/hyphen characters) is required.",
          },
        },
        { status: 400 }
      );
    }

    if (typeof body.amount === "number" && (!Number.isFinite(body.amount) || body.amount < 0)) {
      return NextResponse.json(
        {
          error: {
            code: "bad_request",
            message: "Invalid `amount`: usage increments cannot be negative.",
          },
        },
        { status: 400 }
      );
    }

    const rawAmount = typeof body.amount === "number" && Number.isFinite(body.amount) ? Math.floor(body.amount) : 1;
    const amount = body.checkOnly ? 0 : Math.max(1, rawAmount);
    const def = getMetricDefinition(metric);

    // Security: never allow non-admin clients to supply custom limit overrides to inflate their quota
    const allowOverrides = auth.role === "admin";
    const dailyLimitOverride = allowOverrides ? body.dailyLimitOverride : undefined;
    const monthlyLimitOverride = allowOverrides ? body.monthlyLimitOverride : undefined;

    const check = await recordAndCheckUsage({
      userId: auth.userId,
      app: body.app || def.defaultApp || "global",
      metric,
      amount,
      role: auth.role,
      dailyLimitOverride,
      monthlyLimitOverride,
    });

    const serialized = serializeCheckResult(check);

    if (!check.allowed && amount > 0) {
      return NextResponse.json(
        {
          ok: false,
          allowed: false,
          usage: check,
          quota: serialized,
          error: {
            code: "usage_limit_exceeded",
            message: `${def.label} limit reached (${check.exceededType || "daily"} quota exceeded).`,
          },
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      ok: true,
      allowed: check.allowed,
      usage: check,
      quota: serialized,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to track usage",
        },
      },
      { status: 500 }
    );
  }
}

export { getRoseUsage, checkAndIncrementRoseUsage, type RoseUsage };
