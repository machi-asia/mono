import { handleAdminGetReports } from "@/server/itemlist/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/itemlist/admin/reports", app: "itemlist" },
    async () => handleAdminGetReports(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, OPTIONS");
}
