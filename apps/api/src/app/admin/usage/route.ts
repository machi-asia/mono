import { handleAdminUsageRoute } from "@/server/admin/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/admin/usage", app: "admin", requireAdmin: true },
    async (auth) => handleAdminUsageRoute(req, auth)
  );
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/admin/usage", app: "admin", requireAdmin: true },
    async (auth) => handleAdminUsageRoute(req, auth)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, OPTIONS");
}
