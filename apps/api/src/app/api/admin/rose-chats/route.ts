import { handleAdminRoseChatsRoute } from "@/server/admin/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/api/admin/rose-chats", app: "admin", requireAdmin: true },
    async (auth) => handleAdminRoseChatsRoute(req, auth)
  );
}

export async function DELETE(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/api/admin/rose-chats", app: "admin", requireAdmin: true },
    async (auth) => handleAdminRoseChatsRoute(req, auth)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, DELETE, OPTIONS");
}
