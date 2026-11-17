import { NextResponse } from "next/server";
import { geolocation, ipAddress } from "@vercel/functions";
import { DOMAIN_HOST_TO_APP_ID } from "@mono/app-config";
import {
  ROLE_QUOTAS,
  getMetricDefinition,
  listRegisteredMetrics,
  recordAndCheckUsage,
  recordVisitorSession,
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

function resolveOriginAppFromHeaders(
  explicitApp: string | null | undefined,
  hostname: string | null | undefined,
  originOrReferer: string | null | undefined
): string {
  if (explicitApp && explicitApp.trim() && explicitApp !== "global") {
    return explicitApp.trim();
  }
  if (hostname) {
    const mapped = DOMAIN_HOST_TO_APP_ID[hostname.toLowerCase()];
    if (mapped) return mapped;
  }
  if (originOrReferer) {
    try {
      const parsed = new URL(originOrReferer);
      const mapped = DOMAIN_HOST_TO_APP_ID[parsed.hostname.toLowerCase()];
      if (mapped) return mapped;
      if (parsed.port === "3000") return "machi-asia";
      if (parsed.port === "3001") return "calculator";
      if (parsed.port === "3002") return "docs";
      if (parsed.port === "3003") return "hells-forge";
      if (parsed.port === "3004") return "rose";
      if (parsed.port === "3006") return "portfolio";
      if (parsed.port === "3010") return "home";
      if (parsed.port === "3011") return "create";
      if (parsed.port === "3012") return "rimworld";
      if (parsed.port === "3013") return "admin";
    } catch {
      // ignore invalid URL
    }
  }
  return "machi-asia";
}

export async function recordVisitorPresenceFromRequest(
  req: Request,
  auth: RequestAuthContext,
  extra?: {
    app?: string | null;
    hostname?: string | null;
    pathname?: string | null;
    referrer?: string | null;
    utmSource?: string | null;
  }
): Promise<void> {
  try {
    const geo = geolocation(req);
    const detectedIp =
      ipAddress(req) ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      null;

    const originHeader = req.headers.get("origin");
    const refererHeader = req.headers.get("referer");
    let parsedHostname = extra?.hostname?.trim() || null;

    if (!parsedHostname && originHeader) {
      try {
        parsedHostname = new URL(originHeader).hostname;
      } catch {
        // ignore
      }
    }
    if (!parsedHostname && refererHeader) {
      try {
        parsedHostname = new URL(refererHeader).hostname;
      } catch {
        // ignore
      }
    }

    const app = resolveOriginAppFromHeaders(
      extra?.app,
      parsedHostname,
      originHeader || refererHeader
    );

    const country = geo.country || req.headers.get("x-vercel-ip-country") || null;
    const region =
      geo.countryRegion || geo.region || req.headers.get("x-vercel-ip-country-region") || null;
    const rawCity = geo.city || req.headers.get("x-vercel-ip-city") || null;
    let city = rawCity;
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity);
      } catch {
        city = rawCity;
      }
    }

    const meta = (auth.user?.user_metadata as Record<string, unknown> | undefined) ?? {};
    const displayName =
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      (typeof meta.user_name === "string" && meta.user_name) ||
      (auth.isAnonymous ? "Guest" : (auth.user?.email as string | undefined)?.split("@")[0] || null);

    await recordVisitorSession({
      userId: auth.user?.id ?? (auth.isAnonymous ? null : auth.userId),
      visitorId: auth.userId,
      isGuest: auth.isAnonymous,
      email: (auth.user?.email as string | undefined) ?? null,
      displayName,
      role: auth.role,
      app,
      hostname: parsedHostname,
      pathname: extra?.pathname ?? null,
      referrer: extra?.referrer || refererHeader || originHeader || null,
      utmSource: extra?.utmSource ?? null,
      country,
      region,
      city,
      ipAddress: detectedIp,
      userAgent: req.headers.get("user-agent") || null,
    });
  } catch {
    // Non-blocking telemetry
  }
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

      await recordVisitorPresenceFromRequest(req, auth, {
        app: url.searchParams.get("app"),
        hostname: url.searchParams.get("hostname"),
        pathname: url.searchParams.get("pathname"),
        referrer: url.searchParams.get("referrer"),
        utmSource: url.searchParams.get("utmSource"),
      });

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
      hostname?: string;
      pathname?: string;
      referrer?: string;
      utmSource?: string;
    };

    await recordVisitorPresenceFromRequest(req, auth, {
      app: body.app,
      hostname: body.hostname,
      pathname: body.pathname,
      referrer: body.referrer,
      utmSource: body.utmSource,
    });

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
