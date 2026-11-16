import { handleSyncEventsRoute } from "@/server/sync/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/sync/events", app: "sync" },
    async (auth) => handleSyncEventsRoute(req, auth)
  );
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/sync/events", app: "sync", metric: "requests", cost: 1 },
    async (auth) => handleSyncEventsRoute(req, auth)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, OPTIONS");
}
