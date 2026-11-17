import type { SupabaseClient } from "@supabase/supabase-js";
import { UAParser } from "ua-parser-js";
import { isBot } from "ua-parser-js/bot-detection";
import { assertServerOnlyExecution, createServiceClient } from "./client";
import type { Database, UserRole, VisitorSessionRecord } from "./types";

export interface ParsedUserAgentInfo {
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet" | "bot";
}

export interface RecordVisitorSessionInput {
  sessionKey?: string;
  userId?: string | null;
  visitorId: string;
  isGuest: boolean;
  email?: string | null;
  displayName?: string | null;
  role: UserRole;
  app?: string;
  hostname?: string | null;
  pathname?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
}

export interface VisitorSessionWithStatus extends VisitorSessionRecord {
  isOnline: boolean;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

const FALLBACK_VISITOR_SESSIONS = new Map<string, VisitorSessionRecord>();

export function resetFallbackVisitorSessions(): void {
  FALLBACK_VISITOR_SESSIONS.clear();
}

/**
 * Parses a User-Agent string using ua-parser-js and bot-detection into clean
 * browser, OS, and deviceType classifications.
 */
export function parseUserAgent(ua: string | null | undefined): ParsedUserAgentInfo {
  const normalized = (ua || "").trim();
  if (!normalized) {
    return {
      browser: "Unknown",
      os: "Unknown",
      deviceType: "desktop",
    };
  }

  const parser = new UAParser(normalized);
  const result = parser.getResult();

  let deviceType: ParsedUserAgentInfo["deviceType"] = "desktop";
  if (isBot(result) || isBot(normalized)) {
    deviceType = "bot";
  } else if (result.device.type === "tablet") {
    deviceType = "tablet";
  } else if (
    result.device.type === "mobile" ||
    result.device.type === "wearable"
  ) {
    deviceType = "mobile";
  }

  const browserName = result.browser.name?.trim();
  const browserMajor = result.browser.major?.trim();
  const browser = browserName
    ? browserMajor
      ? `${browserName} ${browserMajor}`
      : browserName
    : deviceType === "bot"
      ? "Bot / Crawler"
      : "Unknown";

  const osName = result.os.name?.trim();
  const osVersion = result.os.version?.trim();
  const os = osName ? (osVersion ? `${osName} ${osVersion}` : osName) : "Unknown";

  return {
    browser,
    os,
    deviceType,
  };
}

function isOfflineTestMode(clientOverride?: SupabaseClient<Database>): boolean {
  return (
    !clientOverride &&
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL
  );
}

/**
 * Records or refreshes a visitor's active session, origin, geo, and device metadata.
 * Strictly server-only. Falls back gracefully to an in-memory map if Supabase is unreachable.
 */
export async function recordVisitorSession(
  input: RecordVisitorSessionInput,
  clientOverride?: SupabaseClient<Database>
): Promise<VisitorSessionRecord> {
  assertServerOnlyExecution("recordVisitorSession");

  const now = new Date().toISOString();
  const app = (input.app || "machi-asia").trim() || "machi-asia";
  const visitorId = (input.visitorId || "anonymous").trim();
  const sessionKey = (input.sessionKey || `${visitorId}::${app}`).slice(0, 255);
  const dbUserId = input.userId && UUID_REGEX.test(input.userId) ? input.userId : null;

  const parsedUa = parseUserAgent(input.userAgent);
  const existing = FALLBACK_VISITOR_SESSIONS.get(sessionKey);

  const record: VisitorSessionRecord = {
    session_key: sessionKey,
    user_id: dbUserId ?? existing?.user_id ?? null,
    visitor_id: visitorId,
    is_guest: input.isGuest,
    email: input.email ?? existing?.email ?? null,
    display_name: input.displayName ?? existing?.display_name ?? null,
    role: input.role,
    app,
    hostname: input.hostname ?? existing?.hostname ?? null,
    pathname: input.pathname ?? existing?.pathname ?? null,
    referrer: input.referrer ?? existing?.referrer ?? null,
    utm_source: input.utmSource ?? existing?.utm_source ?? null,
    country: input.country ?? existing?.country ?? null,
    region: input.region ?? existing?.region ?? null,
    city: input.city ?? existing?.city ?? null,
    ip_address: input.ipAddress ?? existing?.ip_address ?? null,
    device_type: input.deviceType ?? parsedUa.deviceType,
    browser: input.browser ?? parsedUa.browser,
    os: input.os ?? parsedUa.os,
    user_agent: input.userAgent ?? existing?.user_agent ?? null,
    started_at: existing?.started_at ?? now,
    last_seen_at: now,
  };

  FALLBACK_VISITOR_SESSIONS.set(sessionKey, record);

  if (!isOfflineTestMode(clientOverride)) {
    try {
      const supabase = clientOverride || createServiceClient();
      const { error } = await supabase
        .from("visitor_sessions")
        .upsert(record as never, { onConflict: "session_key" });

      if (error) {
        // Silently degrade to fallback cache if migration hasn't been applied yet
        return record;
      }
    } catch {
      // Ignore network/DB telemetry failures so user requests never fail
    }
  }

  return record;
}

/**
 * Lists visitor sessions with online presence indicator (`last_seen_at` within 5 minutes).
 * Strictly server-only.
 */
export async function listVisitorSessions(
  options: {
    app?: string;
    activeWithinMinutes?: number;
    limit?: number;
  } = {},
  clientOverride?: SupabaseClient<Database>
): Promise<VisitorSessionWithStatus[]> {
  assertServerOnlyExecution("listVisitorSessions");

  const merged = new Map<string, VisitorSessionRecord>();
  const limit = Math.max(1, Math.min(options.limit ?? 500, 1000));

  if (!isOfflineTestMode(clientOverride)) {
    try {
      const supabase = clientOverride || createServiceClient();
      let query = supabase
        .from("visitor_sessions")
        .select("*")
        .order("last_seen_at", { ascending: false })
        .limit(limit);

      if (options.app && options.app !== "all") {
        query = query.eq("app", options.app);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        for (const row of data as VisitorSessionRecord[]) {
          merged.set(row.session_key, row);
        }
      }
    } catch {
      // Fall back to in-memory sessions
    }
  }

  for (const [key, fallbackRow] of FALLBACK_VISITOR_SESSIONS.entries()) {
    if (options.app && options.app !== "all" && fallbackRow.app !== options.app) {
      continue;
    }
    const existing = merged.get(key);
    if (
      !existing ||
      new Date(fallbackRow.last_seen_at).getTime() >= new Date(existing.last_seen_at).getTime()
    ) {
      merged.set(key, fallbackRow);
    }
  }

  const nowMs = Date.now();
  const cutoffMs =
    typeof options.activeWithinMinutes === "number" && options.activeWithinMinutes > 0
      ? nowMs - options.activeWithinMinutes * 60 * 1000
      : 0;

  return Array.from(merged.values())
    .filter((row) => (cutoffMs > 0 ? new Date(row.last_seen_at).getTime() >= cutoffMs : true))
    .sort((a, b) => new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime())
    .slice(0, limit)
    .map((row) => ({
      ...row,
      isOnline: nowMs - new Date(row.last_seen_at).getTime() <= ONLINE_WINDOW_MS,
    }));
}
