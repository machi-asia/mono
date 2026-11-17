import { NextResponse } from "next/server";
import {
  adminManageUserUsage,
  createServiceClient,
  isValidUserRole,
  listAllSupportTickets,
  listAllUserRoles,
  listAllUserUsages,
  listRegisteredMetrics,
  listVisitorSessions,
  recordVisitorSession,
  toDeterministicUuid,
  updateSupportTicketStatus,
  updateUserRole,
  type IssueReportRecord,
  type SupportTicketRecord,
  type SupportTicketStatus,
  type UserRole,
  type UserUsageRecord,
  type VisitorSessionWithStatus,
} from "@mono/database";
import { getRoseChatStore, type StoredRoseConversation } from "../rose/chat-store";
import { resolveRequestAuth, type RequestAuthContext } from "../security/guard";
import { getSystemUsageSummary } from "../usage/tracker";

export interface AdminDirectoryUser {
  userId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isOfflineTestMode(): boolean {
  return (
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL
  );
}

async function ensureAdminAuth(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<{ auth: RequestAuthContext; errorResponse?: Response }> {
  const auth = authOverride || (await resolveRequestAuth(req));
  if (auth.role !== "admin") {
    return {
      auth,
      errorResponse: NextResponse.json(
        {
          error: {
            code: "unauthorized",
            message: "Unauthorized: Administrator access required",
          },
        },
        { status: 401 }
      ),
    };
  }
  return { auth };
}

async function listIssueReportsSafe(): Promise<IssueReportRecord[]> {
  if (isOfflineTestMode()) return [];
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("issue_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !Array.isArray(data)) return [];
    return data as IssueReportRecord[];
  } catch {
    return [];
  }
}

export async function buildAdminUsersDirectory(siteId?: string): Promise<{
  users: AdminDirectoryUser[];
  visitors: VisitorSessionWithStatus[];
  usages: UserUsageRecord[];
  roseChats: StoredRoseConversation[];
}> {
  const appFilter = siteId && siteId !== "all" ? siteId : undefined;
  const chatStore = await getRoseChatStore();

  const [roleEntries, visitors, usages, roseChats] = await Promise.all([
    listAllUserRoles(),
    listVisitorSessions({ app: appFilter }),
    listAllUserUsages({ app: appFilter }),
    chatStore.listAllConversationsForAdmin({ limit: 300 }),
  ]);

  const roleMap = new Map(roleEntries.map((r) => [r.userId, r]));
  const latestVisitorById = new Map<string, VisitorSessionWithStatus>();
  for (const v of visitors) {
    const primaryKey = v.user_id || v.visitor_id;
    const existing = latestVisitorById.get(primaryKey);
    if (
      !existing ||
      new Date(v.last_seen_at).getTime() > new Date(existing.last_seen_at).getTime()
    ) {
      latestVisitorById.set(primaryKey, v);
    }
  }

  // Group daily/monthly usage sums by both raw user_id and deterministic UUID
  const usageSums = new Map<string, { daily: number; monthly: number }>();
  for (const u of usages) {
    const bucket = usageSums.get(u.user_id) || { daily: 0, monthly: 0 };
    if (u.period_type === "daily") bucket.daily += Number(u.count || 0);
    if (u.period_type === "monthly") bucket.monthly += Number(u.count || 0);
    usageSums.set(u.user_id, bucket);
  }

  const chatCountByUser = new Map<string, number>();
  const chatMetaByUser = new Map<
    string,
    { email?: string | null; name?: string | null; isGuest: boolean; role: string; updatedAt: string }
  >();
  for (const c of roseChats) {
    chatCountByUser.set(c.userId, (chatCountByUser.get(c.userId) || 0) + 1);
    if (!chatMetaByUser.has(c.userId)) {
      chatMetaByUser.set(c.userId, {
        email: c.userEmail,
        name: c.userName,
        isGuest: c.isGuest,
        role: c.role,
        updatedAt: c.updatedAt,
      });
    }
  }

  const allKeys = new Set<string>();
  if (!appFilter) {
    for (const r of roleEntries) allKeys.add(r.userId);
    for (const c of roseChats) allKeys.add(c.userId);
  } else {
    // When filtered to a specific site, include active visitors on that site or Rose chatters if site === "rose"
    if (appFilter === "rose") {
      for (const c of roseChats) allKeys.add(c.userId);
    }
  }
  for (const key of latestVisitorById.keys()) {
    allKeys.add(key);
  }

  const users: AdminDirectoryUser[] = [];
  for (const uid of allKeys) {
    const roleInfo = roleMap.get(uid);
    const visitor = latestVisitorById.get(uid);
    const chatMeta = chatMetaByUser.get(uid);
    const detUuid = toDeterministicUuid(uid);
    const usage = usageSums.get(uid) || usageSums.get(detUuid) || { daily: 0, monthly: 0 };

    const resolvedRole: UserRole =
      roleInfo?.role ??
      visitor?.role ??
      (isValidUserRole(chatMeta?.role) ? chatMeta.role : undefined) ??
      (uid.startsWith("ip:") ? "guest" : "member");

    const isGuest =
      roleInfo?.isGuest ??
      visitor?.is_guest ??
      chatMeta?.isGuest ??
      (resolvedRole === "guest" || uid.startsWith("ip:"));

    users.push({
      userId: uid,
      email: roleInfo?.email ?? visitor?.email ?? chatMeta?.email ?? null,
      displayName: roleInfo?.displayName ?? visitor?.display_name ?? chatMeta?.name ?? null,
      avatarUrl: roleInfo?.avatarUrl ?? null,
      role: resolvedRole,
      isGuest,
      isOnline: visitor?.isOnline ?? false,
      currentApp: visitor?.app ?? null,
      hostname: visitor?.hostname ?? null,
      pathname: visitor?.pathname ?? null,
      referrer: visitor?.referrer ?? null,
      utmSource: visitor?.utm_source ?? null,
      country: visitor?.country ?? null,
      region: visitor?.region ?? null,
      city: visitor?.city ?? null,
      ipAddress: visitor?.ip_address ?? null,
      deviceType: visitor?.device_type ?? null,
      browser: visitor?.browser ?? null,
      os: visitor?.os ?? null,
      lastSeenAt: visitor?.last_seen_at ?? chatMeta?.updatedAt ?? null,
      createdAt: roleInfo?.createdAt ?? visitor?.started_at ?? null,
      totalDailyUsage: usage.daily,
      totalMonthlyUsage: usage.monthly,
      roseChatCount: chatCountByUser.get(uid) || 0,
      providers: roleInfo?.providers ?? [],
      canChangeRole: !uid.startsWith("ip:") && (UUID_REGEX.test(uid) || isOfflineTestMode()),
    });
  }

  users.sort((a, b) => {
    if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
    const ta = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
    const tb = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
    return tb - ta;
  });

  return { users, visitors, usages, roseChats };
}

export async function handleAdminOverviewRoute(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<Response> {
  const { errorResponse } = await ensureAdminAuth(req, authOverride);
  if (errorResponse) return errorResponse;

  try {
    const url = new URL(req.url);
    const siteId = url.searchParams.get("siteId") || undefined;
    const appFilter = siteId && siteId !== "all" ? siteId : undefined;

    const [{ users, visitors, usages, roseChats }, systemSummary, ticketRes, reports] =
      await Promise.all([
        buildAdminUsersDirectory(siteId),
        getSystemUsageSummary(),
        listAllSupportTickets({ app: appFilter }),
        listIssueReportsSafe(),
      ]);

    const tickets: SupportTicketRecord[] = ticketRes.data || [];
    const filteredRoseChats =
      appFilter && appFilter !== "rose"
        ? roseChats.filter((c) => c.originApp === appFilter)
        : roseChats;

    const originCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    const appCounts = new Map<string, number>();

    for (const v of visitors) {
      const appKey = v.app || "machi-asia";
      appCounts.set(appKey, (appCounts.get(appKey) || 0) + 1);

      let refLabel = "Direct / Bookmark";
      if (v.referrer) {
        try {
          refLabel = new URL(v.referrer).hostname || v.referrer;
        } catch {
          refLabel = v.referrer;
        }
      }
      originCounts.set(refLabel, (originCounts.get(refLabel) || 0) + 1);

      const countryLabel = v.country || "Unknown";
      countryCounts.set(countryLabel, (countryCounts.get(countryLabel) || 0) + 1);

      const deviceLabel = v.device_type || "desktop";
      deviceCounts.set(deviceLabel, (deviceCounts.get(deviceLabel) || 0) + 1);
    }

    return NextResponse.json({
      ok: true,
      siteId: siteId || "all",
      stats: {
        totalUsers: users.filter((u) => !u.isGuest).length,
        totalGuests: users.filter((u) => u.isGuest).length,
        onlineVisitors: visitors.filter((v) => v.isOnline).length,
        totalSessions: visitors.length,
        totalApiRequests: systemSummary.totalRequests,
        totalRoseChats: filteredRoseChats.length,
        openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
        pendingReports: reports.filter((r) => r.status === "pending").length,
      },
      breakdowns: {
        byApp: Object.fromEntries(appCounts),
        byReferrer: Object.fromEntries(originCounts),
        byCountry: Object.fromEntries(countryCounts),
        byDevice: Object.fromEntries(deviceCounts),
      },
      users,
      visitors,
      usages,
      registeredMetrics: listRegisteredMetrics(),
      systemSummary,
      roseChats: filteredRoseChats,
      tickets,
      reports,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to load admin overview",
        },
      },
      { status: 500 }
    );
  }
}

export async function handleAdminUsersRoute(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<Response> {
  const { auth, errorResponse } = await ensureAdminAuth(req, authOverride);
  if (errorResponse) return errorResponse;

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const siteId = url.searchParams.get("siteId") || undefined;
      const { users } = await buildAdminUsersDirectory(siteId);
      return NextResponse.json({ ok: true, users });
    }

    if (req.method === "PATCH") {
      const body = (await req.json().catch(() => ({}))) as {
        userId?: string;
        role?: UserRole;
      };

      const targetUserId = typeof body.userId === "string" ? body.userId.trim() : "";
      const newRole = body.role;

      if (!targetUserId || !isValidUserRole(newRole)) {
        return NextResponse.json(
          {
            error: {
              code: "bad_request",
              message: "Valid 'userId' and 'role' (guest | member | pro | admin) are required.",
            },
          },
          { status: 400 }
        );
      }

      if (targetUserId === auth.userId && newRole !== "admin") {
        return NextResponse.json(
          {
            error: {
              code: "self_demotion_forbidden",
              message: "You cannot demote your own active administrator account.",
            },
          },
          { status: 400 }
        );
      }

      const result = await updateUserRole(targetUserId, newRole);
      if (!result.success) {
        return NextResponse.json(
          {
            error: {
              code: "role_update_failed",
              message: result.error?.message || "Failed to update user role",
            },
          },
          { status: 400 }
        );
      }

      // Sync cached visitor session role if present
      const existingSessions = await listVisitorSessions();
      for (const s of existingSessions) {
        if (s.user_id === targetUserId || s.visitor_id === targetUserId) {
          await recordVisitorSession({
            sessionKey: s.session_key,
            userId: s.user_id,
            visitorId: s.visitor_id,
            isGuest: newRole === "guest",
            email: s.email,
            displayName: s.display_name,
            role: newRole,
            app: s.app,
          });
        }
      }

      return NextResponse.json({
        ok: true,
        userId: targetUserId,
        role: newRole,
      });
    }

    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed" } },
      { status: 405 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to handle admin users request",
        },
      },
      { status: 500 }
    );
  }
}

export async function handleAdminUsageRoute(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<Response> {
  const { errorResponse } = await ensureAdminAuth(req, authOverride);
  if (errorResponse) return errorResponse;

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId") || undefined;
      const app = url.searchParams.get("app") || undefined;
      const metric = url.searchParams.get("metric") || undefined;

      const [records, systemSummary] = await Promise.all([
        listAllUserUsages({ userId, app, metric }),
        getSystemUsageSummary(),
      ]);

      return NextResponse.json({
        ok: true,
        records,
        systemSummary,
        registeredMetrics: listRegisteredMetrics(),
      });
    }

    if (req.method === "POST") {
      const body = (await req.json().catch(() => ({}))) as {
        userId?: string;
        app?: string;
        metric?: string;
        action?: "reset" | "set_limits";
        dailyLimit?: number;
        monthlyLimit?: number;
      };

      const userId = typeof body.userId === "string" ? body.userId.trim() : "";
      const metric = typeof body.metric === "string" ? body.metric.trim() : "";
      const action = body.action;

      if (!userId || !metric || (action !== "reset" && action !== "set_limits")) {
        return NextResponse.json(
          {
            error: {
              code: "bad_request",
              message: "Valid 'userId', 'metric', and 'action' ('reset' | 'set_limits') are required.",
            },
          },
          { status: 400 }
        );
      }

      const result = await adminManageUserUsage({
        userId,
        app: body.app || "global",
        metric,
        action,
        dailyLimit: body.dailyLimit,
        monthlyLimit: body.monthlyLimit,
      });

      if (!result.success) {
        return NextResponse.json(
          {
            error: {
              code: "usage_update_failed",
              message: result.error || "Failed to update user usage",
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        ...result,
      });
    }

    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed" } },
      { status: 405 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to handle admin usage request",
        },
      },
      { status: 500 }
    );
  }
}

export async function handleAdminRoseChatsRoute(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<Response> {
  const { errorResponse } = await ensureAdminAuth(req, authOverride);
  if (errorResponse) return errorResponse;

  try {
    const store = await getRoseChatStore();

    if (req.method === "GET") {
      const url = new URL(req.url);
      const search = url.searchParams.get("search") || undefined;
      const userId = url.searchParams.get("userId") || undefined;
      const limitParam = url.searchParams.get("limit");
      const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

      const conversations = await store.listAllConversationsForAdmin({
        search,
        userId,
        limit: Number.isFinite(limit) ? limit : 200,
      });

      return NextResponse.json({
        ok: true,
        conversations,
      });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      let userId = url.searchParams.get("userId") || "";
      let conversationId = url.searchParams.get("conversationId") || "";

      if (!userId || !conversationId) {
        const body = (await req.json().catch(() => ({}))) as {
          userId?: string;
          conversationId?: string;
        };
        userId = userId || body.userId || "";
        conversationId = conversationId || body.conversationId || "";
      }

      if (!userId || !conversationId) {
        return NextResponse.json(
          {
            error: {
              code: "bad_request",
              message: "Both 'userId' and 'conversationId' are required.",
            },
          },
          { status: 400 }
        );
      }

      const deleted = await store.deleteConversation(userId, conversationId);
      return NextResponse.json({ ok: true, deleted });
    }

    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed" } },
      { status: 405 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to handle admin Rose chats request",
        },
      },
      { status: 500 }
    );
  }
}

export async function handleAdminTicketsRoute(
  req: Request,
  authOverride?: RequestAuthContext
): Promise<Response> {
  const { errorResponse } = await ensureAdminAuth(req, authOverride);
  if (errorResponse) return errorResponse;

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const app = url.searchParams.get("app") || undefined;
      const status = (url.searchParams.get("status") || "all") as SupportTicketStatus | "all";
      const result = await listAllSupportTickets({ app, status });
      if (result.error) {
        return NextResponse.json(
          { error: { code: "tickets_fetch_failed", message: result.error.message } },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, tickets: result.data });
    }

    if (req.method === "PATCH") {
      const body = (await req.json().catch(() => ({}))) as {
        ticketId?: string;
        status?: SupportTicketStatus;
      };

      const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
      const status = body.status;

      if (!ticketId || !status) {
        return NextResponse.json(
          { error: { code: "bad_request", message: "Both 'ticketId' and 'status' are required." } },
          { status: 400 }
        );
      }

      const result = await updateSupportTicketStatus(ticketId, status);
      if (result.error) {
        return NextResponse.json(
          { error: { code: "ticket_update_failed", message: result.error.message } },
          { status: 400 }
        );
      }

      return NextResponse.json({ ok: true, ticket: result.data });
    }

    return NextResponse.json(
      { error: { code: "method_not_allowed", message: "Method not allowed" } },
      { status: 405 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_error",
          message: err instanceof Error ? err.message : "Failed to handle admin tickets request",
        },
      },
      { status: 500 }
    );
  }
}
