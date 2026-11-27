import { NextResponse } from "next/server";
import {
  handleAdminOverviewRoute,
  handleAdminRoseChatsRoute,
  handleAdminTicketsRoute,
  handleAdminUsageRoute,
  handleAdminUsersRoute,
} from "@/server/admin/handlers";
import {
  handleAdminGetReports,
  handleAdminUpdateReport,
  handleCreateReport,
  handleGetOverrides,
} from "@/server/itemlist/handlers";
import {
  handleMmmAddMods,
  handleMmmDeleteMod,
  handleMmmDeleteOrganization,
  handleMmmGetModListHistory,
  handleMmmGetOrganization,
  handleMmmGetOrganizations,
  handleMmmJoinOrganization,
  handleMmmModrinthMatchFiles,
  handleMmmModrinthSearch,
  handleMmmCreateOrganization,
  handleMmmUpdateMod,
  handleMmmUpdateOrganization,
} from "@/server/mmm/handlers";
import {
  handleQuicknoteClickupMcp,
  handleQuicknoteCreateNote,
  handleQuicknoteCreateRelation,
  handleQuicknoteDeleteNote,
  handleQuicknoteDeleteRelation,
  handleQuicknoteGenerate,
  handleQuicknoteGetNotes,
  handleQuicknoteGetRelations,
  handleQuicknoteUpdateNote,
} from "@/server/quicknote/handlers";
import { handleRoseChat } from "@/server/rose/chat";
import { handleRoseConversations } from "@/server/rose/conversations";
import { handleRoseSettings } from "@/server/rose/settings";
import { handleRoseTranscribe } from "@/server/rose/transcribe";
import { handleRoseUsage } from "@/server/rose/usage";
import {
  buildCorsHeaders,
  handleCorsPreflight,
  withApiGuard,
  type ApiGuardOptions,
  type RequestAuthContext,
} from "@/server/security/guard";
import { handleSyncEventsRoute, handleSyncRoomsRoute } from "@/server/sync/handlers";
import {
  handleUowemeCheckout,
  handleUowemeCreateDebt,
  handleUowemeDeleteDebt,
  handleUowemeGetDebts,
  handleUowemeGetUsers,
  handleUowemeUpdateDebt,
} from "@/server/uoweme/handlers";
import { handleUsageMetricsRoute, handleUsageTrackRoute } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RouteMatch {
  options: ApiGuardOptions;
  run: (auth: RequestAuthContext) => Promise<Response>;
}

function normalizeRouteSegments(slug: string[]): string[] {
  return slug[0] === "api" ? slug.slice(1) : slug;
}

function methodNotAllowedResponse(req: Request, allowedMethods: string[]): Response {
  return NextResponse.json(
    {
      error: {
        code: "method_not_allowed",
        message: `Method ${req.method} not allowed`,
      },
    },
    {
      status: 405,
      headers: {
        ...buildCorsHeaders(req, [...allowedMethods, "OPTIONS"].join(", ")),
        Allow: [...allowedMethods, "OPTIONS"].join(", "),
      },
    }
  );
}

function resolveRoute(
  req: Request,
  segments: string[]
): RouteMatch | { errorResponse: Response } {
  const method = (req.method || "GET").toUpperCase() as HttpMethod;
  const routePath = `/${segments.join("/")}`;

  const dispatchMethods = (
    handlers: Partial<Record<HttpMethod, { options: ApiGuardOptions; run: (auth: RequestAuthContext) => Promise<Response> }>>
  ): RouteMatch | { errorResponse: Response } => {
    const match = handlers[method];
    if (!match) {
      return { errorResponse: methodNotAllowedResponse(req, Object.keys(handlers)) };
    }
    return match;
  };

  if (routePath === "/health") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/health", app: "api" },
        run: async () =>
          NextResponse.json({
            status: "ok",
            service: "@mono/api",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
          }),
      },
    });
  }

  // Admin endpoints
  if (routePath === "/admin/overview") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/admin/overview", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminOverviewRoute(req, auth),
      },
    });
  }

  if (routePath === "/admin/rose-chats") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/admin/rose-chats", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminRoseChatsRoute(req, auth),
      },
      DELETE: {
        options: { endpoint: "/admin/rose-chats", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminRoseChatsRoute(req, auth),
      },
    });
  }

  if (routePath === "/admin/tickets") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/admin/tickets", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminTicketsRoute(req, auth),
      },
      PATCH: {
        options: { endpoint: "/admin/tickets", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminTicketsRoute(req, auth),
      },
    });
  }

  if (routePath === "/admin/usage") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/admin/usage", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminUsageRoute(req, auth),
      },
      POST: {
        options: { endpoint: "/admin/usage", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminUsageRoute(req, auth),
      },
    });
  }

  if (routePath === "/admin/users") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/admin/users", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminUsersRoute(req, auth),
      },
      PATCH: {
        options: { endpoint: "/admin/users", app: "admin", requireAdmin: true },
        run: (auth) => handleAdminUsersRoute(req, auth),
      },
    });
  }

  // ItemList endpoints
  if (routePath === "/itemlist/overrides") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/itemlist/overrides", app: "itemlist" },
        run: () => handleGetOverrides(req),
      },
    });
  }

  if (routePath === "/itemlist/reports") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/itemlist/overrides", app: "itemlist" },
        run: () => handleGetOverrides(req),
      },
      POST: {
        options: { endpoint: "/itemlist/reports", app: "itemlist" },
        run: () => handleCreateReport(req),
      },
    });
  }

  if (routePath === "/itemlist/admin/reports") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/itemlist/admin/reports", app: "itemlist" },
        run: () => handleAdminGetReports(req),
      },
    });
  }

  if (segments.length === 4 && segments[0] === "itemlist" && segments[1] === "admin" && segments[2] === "reports") {
    const id = segments[3];
    return dispatchMethods({
      PATCH: {
        options: { endpoint: `/itemlist/admin/reports/${id}`, app: "itemlist" },
        run: () => handleAdminUpdateReport(req, id),
      },
    });
  }

  // Rose endpoints
  if (routePath === "/rose/chat") {
    return dispatchMethods({
      POST: {
        options: { endpoint: "/rose/chat", app: "rose", metric: "requests", cost: 1 },
        run: () => handleRoseChat(req),
      },
    });
  }

  if (routePath === "/rose/conversations") {
    return dispatchMethods({
      GET: { options: { endpoint: "/rose/conversations", app: "rose" }, run: () => handleRoseConversations(req) },
      POST: { options: { endpoint: "/rose/conversations", app: "rose" }, run: () => handleRoseConversations(req) },
      PUT: { options: { endpoint: "/rose/conversations", app: "rose" }, run: () => handleRoseConversations(req) },
      DELETE: { options: { endpoint: "/rose/conversations", app: "rose" }, run: () => handleRoseConversations(req) },
    });
  }

  if (routePath === "/rose/settings") {
    return dispatchMethods({
      GET: { options: { endpoint: "/rose/settings", app: "rose" }, run: () => handleRoseSettings(req) },
      POST: { options: { endpoint: "/rose/settings", app: "rose" }, run: () => handleRoseSettings(req) },
    });
  }

  if (routePath === "/rose/transcribe") {
    return dispatchMethods({
      POST: { options: { endpoint: "/rose/transcribe", app: "rose" }, run: () => handleRoseTranscribe(req) },
    });
  }

  if (routePath === "/rose/usage") {
    return dispatchMethods({
      GET: { options: { endpoint: "/rose/usage", app: "rose" }, run: () => handleRoseUsage(req) },
    });
  }

  // Realtime sync endpoints
  if (routePath === "/sync/events") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/sync/events", app: "sync" },
        run: (auth) => handleSyncEventsRoute(req, auth),
      },
      POST: {
        options: { endpoint: "/sync/events", app: "sync", metric: "requests", cost: 1 },
        run: (auth) => handleSyncEventsRoute(req, auth),
      },
    });
  }

  if (routePath === "/sync/rooms") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/sync/rooms", app: "sync" },
        run: () => handleSyncRoomsRoute(req),
      },
      POST: {
        options: { endpoint: "/sync/rooms", app: "sync", metric: "requests", cost: 1 },
        run: () => handleSyncRoomsRoute(req),
      },
    });
  }

  // Usage & telemetry endpoints
  if (routePath === "/usage/metrics") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/usage/metrics", app: "api" },
        run: () => handleUsageMetricsRoute(req),
      },
    });
  }

  if (routePath === "/usage/track") {
    return dispatchMethods({
      GET: {
        options: { endpoint: "/usage/track", app: "api" },
        run: (auth) => handleUsageTrackRoute(req, auth),
      },
      POST: {
        options: { endpoint: "/usage/track", app: "api" },
        run: (auth) => handleUsageTrackRoute(req, auth),
      },
    });
  }

  // MMM endpoints
  if (routePath === "/mmm/organizations") {
    return dispatchMethods({
      GET: { options: { endpoint: "/mmm/organizations", app: "mmm" }, run: () => handleMmmGetOrganizations() },
      POST: { options: { endpoint: "/mmm/organizations", app: "mmm" }, run: () => handleMmmCreateOrganization(req) },
    });
  }

  if (routePath === "/mmm/organizations/join") {
    return dispatchMethods({
      POST: { options: { endpoint: "/mmm/organizations/join", app: "mmm" }, run: () => handleMmmJoinOrganization(req) },
    });
  }

  if (segments.length === 3 && segments[0] === "mmm" && segments[1] === "organizations") {
    const id = segments[2];
    return dispatchMethods({
      GET: { options: { endpoint: `/mmm/organizations/${id}`, app: "mmm" }, run: () => handleMmmGetOrganization(req, id) },
      PATCH: { options: { endpoint: `/mmm/organizations/${id}`, app: "mmm" }, run: () => handleMmmUpdateOrganization(req, id) },
      DELETE: { options: { endpoint: `/mmm/organizations/${id}`, app: "mmm" }, run: () => handleMmmDeleteOrganization(req, id) },
    });
  }

  if (segments.length === 4 && segments[0] === "mmm" && segments[1] === "mod-lists" && segments[3] === "history") {
    const id = segments[2];
    return dispatchMethods({
      GET: { options: { endpoint: `/mmm/mod-lists/${id}/history`, app: "mmm" }, run: () => handleMmmGetModListHistory(req, id) },
    });
  }

  if (segments.length === 4 && segments[0] === "mmm" && segments[1] === "mod-lists" && segments[3] === "mods") {
    const id = segments[2];
    return dispatchMethods({
      POST: { options: { endpoint: `/mmm/mod-lists/${id}/mods`, app: "mmm" }, run: () => handleMmmAddMods(req, id) },
      PATCH: { options: { endpoint: `/mmm/mod-lists/${id}/mods`, app: "mmm" }, run: () => handleMmmUpdateMod(req, id) },
      DELETE: { options: { endpoint: `/mmm/mod-lists/${id}/mods`, app: "mmm" }, run: () => handleMmmDeleteMod(req, id) },
    });
  }

  if (routePath === "/mmm/modrinth/search") {
    return dispatchMethods({
      GET: { options: { endpoint: "/mmm/modrinth/search", app: "mmm" }, run: () => handleMmmModrinthSearch(req) },
    });
  }

  if (routePath === "/mmm/modrinth/match-files") {
    return dispatchMethods({
      POST: { options: { endpoint: "/mmm/modrinth/match-files", app: "mmm" }, run: () => handleMmmModrinthMatchFiles(req) },
    });
  }

  // Quicknote (Machi Notes) endpoints
  if (routePath === "/quicknote/notes") {
    return dispatchMethods({
      GET: { options: { endpoint: "/quicknote/notes", app: "notes" }, run: () => handleQuicknoteGetNotes() },
      POST: { options: { endpoint: "/quicknote/notes", app: "notes" }, run: () => handleQuicknoteCreateNote(req) },
      PUT: { options: { endpoint: "/quicknote/notes", app: "notes" }, run: () => handleQuicknoteUpdateNote(req) },
      DELETE: { options: { endpoint: "/quicknote/notes", app: "notes" }, run: () => handleQuicknoteDeleteNote(req) },
    });
  }

  if (routePath === "/quicknote/relations") {
    return dispatchMethods({
      GET: { options: { endpoint: "/quicknote/relations", app: "notes" }, run: () => handleQuicknoteGetRelations() },
      POST: { options: { endpoint: "/quicknote/relations", app: "notes" }, run: () => handleQuicknoteCreateRelation(req) },
      DELETE: { options: { endpoint: "/quicknote/relations", app: "notes" }, run: () => handleQuicknoteDeleteRelation(req) },
    });
  }

  if (routePath === "/quicknote/generate") {
    return dispatchMethods({
      POST: { options: { endpoint: "/quicknote/generate", app: "notes" }, run: () => handleQuicknoteGenerate(req) },
    });
  }

  if (routePath === "/quicknote/mcp/clickup") {
    return dispatchMethods({
      POST: { options: { endpoint: "/quicknote/mcp/clickup", app: "notes" }, run: () => handleQuicknoteClickupMcp(req) },
    });
  }

  // UOweMe endpoints
  if (routePath === "/uoweme") {
    return dispatchMethods({
      GET: { options: { endpoint: "/uoweme", app: "uoweme" }, run: () => handleUowemeGetDebts() },
      POST: { options: { endpoint: "/uoweme", app: "uoweme" }, run: () => handleUowemeCreateDebt(req) },
    });
  }

  if (routePath === "/uoweme/checkout") {
    return dispatchMethods({
      POST: { options: { endpoint: "/uoweme/checkout", app: "uoweme" }, run: () => handleUowemeCheckout(req) },
    });
  }

  if (routePath === "/uoweme/users") {
    return dispatchMethods({
      GET: { options: { endpoint: "/uoweme/users", app: "uoweme" }, run: () => handleUowemeGetUsers(req) },
    });
  }

  if (segments.length === 2 && segments[0] === "uoweme") {
    const id = segments[1];
    return dispatchMethods({
      PATCH: { options: { endpoint: `/uoweme/${id}`, app: "uoweme" }, run: () => handleUowemeUpdateDebt(req, id) },
      DELETE: { options: { endpoint: `/uoweme/${id}`, app: "uoweme" }, run: () => handleUowemeDeleteDebt(req, id) },
    });
  }

  return {
    errorResponse: NextResponse.json(
      {
        error: {
          code: "not_found",
          message: `Unknown API route: ${routePath}`,
        },
      },
      { status: 404, headers: buildCorsHeaders(req) }
    ),
  };
}

async function handleDispatch(req: Request, context: RouteContext): Promise<Response> {
  const { slug } = await context.params;
  const segments = normalizeRouteSegments(slug ?? []);
  const resolved = resolveRoute(req, segments);

  if ("errorResponse" in resolved) {
    return resolved.errorResponse;
  }

  return withApiGuard(req, resolved.options, resolved.run);
}

export async function GET(req: Request, context: RouteContext): Promise<Response> {
  return handleDispatch(req, context);
}

export async function POST(req: Request, context: RouteContext): Promise<Response> {
  return handleDispatch(req, context);
}

export async function PUT(req: Request, context: RouteContext): Promise<Response> {
  return handleDispatch(req, context);
}

export async function PATCH(req: Request, context: RouteContext): Promise<Response> {
  return handleDispatch(req, context);
}

export async function DELETE(req: Request, context: RouteContext): Promise<Response> {
  return handleDispatch(req, context);
}

export async function OPTIONS(req: Request): Promise<Response> {
  return handleCorsPreflight(req, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
}
