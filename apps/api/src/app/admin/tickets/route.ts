import { handleAdminTicketsRoute } from "@/server/admin/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/admin/tickets", app: "admin", requireAdmin: true },
    async (auth) => handleAdminTicketsRoute(req, auth)
  );
}

export async function PATCH(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/admin/tickets", app: "admin", requireAdmin: true },
    async (auth) => handleAdminTicketsRoute(req, auth)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, PATCH, OPTIONS");
}
