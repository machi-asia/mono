import { handleGetOverrides, handleCreateReport } from "@/server/itemlist/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/itemlist/overrides", app: "itemlist" },
    async () => handleGetOverrides(req)
  );
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/itemlist/reports", app: "itemlist" },
    async () => handleCreateReport(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, OPTIONS");
}
