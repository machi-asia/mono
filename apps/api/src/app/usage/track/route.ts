import { handleUsageTrackRoute } from "@/server/usage/tracker";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/usage/track", app: "api" },
    async (auth) => handleUsageTrackRoute(req, auth)
  );
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/usage/track", app: "api" },
    async (auth) => handleUsageTrackRoute(req, auth)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, OPTIONS");
}
