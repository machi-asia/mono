import { NextResponse } from "next/server";
import { getRoseUsage, checkAndIncrementRoseUsage, type RoseUsage } from "../rose/usage-calc";
import { getAuthUser } from "../rose/chat";

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
  rose: {
    guestDailyLimit: number;
    userDailyLimit: number;
    guestWeeklyLimit: number;
    userWeeklyLimit: number;
  };
}

// In-memory telemetry cache with persistence fallback
const startTime = Date.now();
let totalApiRequests = 0;
let totalApiErrors = 0;
const endpointMetrics: Map<string, ApiUsageMetric> = new Map();

export function recordApiCall(endpoint: string, method: string, latencyMs: number, isError = false) {
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
    rose: {
      guestDailyLimit: Number.parseInt(process.env.ROSE_DAILY_LIMIT_GUEST || "10", 10),
      userDailyLimit: Number.parseInt(process.env.ROSE_DAILY_LIMIT_USER || "20", 10),
      guestWeeklyLimit: Number.parseInt(process.env.ROSE_WEEKLY_LIMIT_GUEST || "50", 10),
      userWeeklyLimit: Number.parseInt(process.env.ROSE_WEEKLY_LIMIT_USER || "200", 10),
    },
  };
}

export async function handleUsageMetricsRoute(req: Request): Promise<Response> {
  try {
    const summary = await getSystemUsageSummary();
    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate usage summary" },
      { status: 500 }
    );
  }
}

export { getRoseUsage, checkAndIncrementRoseUsage, type RoseUsage };
