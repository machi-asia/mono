import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@mono/app-config";
import {
  createServiceClient,
  createTokenClient,
  getUserRole,
  recordAndCheckUsage,
  resolveSafeRoleFromUser,
  type CheckUsageResult,
  type UsageMetric,
  type UserRole,
} from "@mono/database";
import { createClient as createServerSupabaseClient } from "@mono/database/server";
import { recordApiCall } from "../usage/tracker";

export interface RequestAuthContext {
  userId: string;
  role: UserRole;
  roles: string[];
  isAuthenticated: boolean;
  isAnonymous: boolean;
  user: any | null;
  supabaseClient: any;
}

function isTestEnvironment(): boolean {
  return (
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST))
  );
}

export function extractClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return `ip:${firstIp}`;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return `ip:${realIp}`;
  return "ip:anonymous-guest";
}

export function buildCorsHeaders(
  req?: Request,
  methods = "GET, POST, PATCH, DELETE, OPTIONS"
): Record<string, string> {
  const origin = req?.headers?.get("origin");
  let allowOrigin = "*";

  if (origin) {
    allowOrigin = isAllowedOrigin(origin) ? origin : "https://machi.asia";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, X-User-Id, X-Test-Role, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export function handleCorsPreflight(
  req?: Request,
  methods = "GET, POST, PATCH, DELETE, OPTIONS"
): Response {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(req, methods),
  });
}

/**
 * Resolves the authenticated (or guest) identity for an incoming API request.
 * Rejects unverified `x-user-id` spoofing in production (`NODE_ENV === "production"`),
 * and never trusts `user_metadata.role` for privilege escalation.
 */
export async function resolveRequestAuth(req: Request): Promise<RequestAuthContext> {
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token && token !== "mock-access-token") {
      try {
        const supabase = createTokenClient(token);
        const {
          data: { user },
        } = await supabase.auth.getUser(token);

        if (user) {
          let role = resolveSafeRoleFromUser(user);
          if (role !== "admin" && !user.is_anonymous) {
            const dbRole = await getUserRole(user.id, supabase as any);
            if (dbRole) role = dbRole;
          }
          const isAnon = Boolean(user.is_anonymous);
          return {
            userId: user.id,
            role,
            roles: isAnon ? ["guest"] : [role],
            isAuthenticated: !isAnon,
            isAnonymous: isAnon,
            user,
            supabaseClient: supabase,
          };
        }
      } catch {
        // Fall through to cookie / guest resolution
      }
    }
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let role = resolveSafeRoleFromUser(user);
      if (role !== "admin" && !user.is_anonymous) {
        const dbRole = await getUserRole(user.id, supabase as any);
        if (dbRole) role = dbRole;
      }
      const isAnon = Boolean(user.is_anonymous);
      return {
        userId: user.id,
        role,
        roles: isAnon ? ["guest"] : [role],
        isAuthenticated: !isAnon,
        isAnonymous: isAnon,
        user,
        supabaseClient: supabase,
      };
    }
  } catch {
    // Ignore cookie session lookup failure outside Next.js request context
  }

  // Only allow x-user-id header in explicit test environments (never in production)
  if (isTestEnvironment() && process.env?.NODE_ENV !== "production") {
    const testUserId = req.headers.get("x-user-id")?.trim();
    if (testUserId) {
      const testRoleHeader = req.headers.get("x-test-role")?.trim() as UserRole | undefined;
      const role: UserRole =
        testRoleHeader && ["guest", "member", "pro", "admin"].includes(testRoleHeader)
          ? testRoleHeader
          : "member";
      return {
        userId: testUserId,
        role,
        roles: [role],
        isAuthenticated: role !== "guest",
        isAnonymous: role === "guest",
        user: { id: testUserId, roles: [role], is_anonymous: role === "guest" },
        supabaseClient: undefined,
      };
    }
  }

  const guestId = extractClientIdentifier(req);
  return {
    userId: guestId,
    role: "guest",
    roles: ["guest"],
    isAuthenticated: false,
    isAnonymous: true,
    user: null,
    supabaseClient: isTestEnvironment() ? undefined : createServiceClient(),
  };
}

export interface ApiGuardOptions {
  endpoint: string;
  app?: string;
  metric?: UsageMetric;
  cost?: number;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * Wraps an API route handler with CORS origin enforcement, authentication/role verification,
 * atomic usage quota locking (`recordAndCheckUsage`), and telemetry recording (`recordApiCall`).
 */
export async function withApiGuard(
  req: Request,
  options: ApiGuardOptions,
  handler: (auth: RequestAuthContext, usage?: CheckUsageResult) => Promise<Response>
): Promise<Response> {
  const start = Date.now();
  const method = req.method || "GET";
  const corsHeaders = buildCorsHeaders(req);

  try {
    const auth = await resolveRequestAuth(req);

    if (options.requireAdmin && auth.role !== "admin") {
      recordApiCall(options?.endpoint ?? "unknown", method, Date.now() - start, true);
      return NextResponse.json(
        {
          error: {
            code: "unauthorized",
            message: "Unauthorized: Administrator access required",
          },
        },
        { status: 401, headers: corsHeaders }
      );
    }

    if (options.requireAuth && !auth.isAuthenticated && !auth.user) {
      recordApiCall(options?.endpoint ?? "unknown", method, Date.now() - start, true);
      return NextResponse.json(
        {
          error: {
            code: "unauthorized",
            message: "Authentication required for this operation.",
          },
        },
        { status: 401, headers: corsHeaders }
      );
    }

    let usageResult: CheckUsageResult | undefined;
    if (options.cost && options.cost > 0) {
      usageResult = await recordAndCheckUsage({
        userId: auth.userId,
        app: options.app || "api",
        metric: options.metric || "requests",
        amount: options.cost,
        role: auth.role,
        clientOverride: isTestEnvironment() ? auth.supabaseClient : undefined,
      });

      if (!usageResult.allowed) {
        recordApiCall(options?.endpoint ?? "unknown", method, Date.now() - start, true);
        return NextResponse.json(
          {
            error: {
              code: "rate_limit_exceeded",
              message: `API quota limit reached (${usageResult.exceededType || "daily"} limit exceeded).`,
            },
            quota: {
              locked: true,
              metric: usageResult.metric,
              role: usageResult.role,
              dailyUsed: usageResult.dailyCount,
              dailyLimit: usageResult.dailyLimit,
              monthlyUsed: usageResult.monthlyCount,
              monthlyLimit: usageResult.monthlyLimit,
              remaining: 0,
              exceededType: usageResult.exceededType,
            },
          },
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Retry-After": "60",
            },
          }
        );
      }
    }

    const res = await handler(auth, usageResult);
    recordApiCall(options.endpoint, method, Date.now() - start, !res.ok);

    // Attach CORS headers if not already present
    const mergedHeaders = new Headers(res.headers);
    for (const [key, val] of Object.entries(corsHeaders)) {
      if (!mergedHeaders.has(key)) {
        mergedHeaders.set(key, val);
      }
    }

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: mergedHeaders,
    });
  } catch (err: unknown) {
    recordApiCall(options?.endpoint ?? "unknown", method, Date.now() - start, true);
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Internal server error",
        },
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
