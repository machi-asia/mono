import { handleAdminUpdateReport } from "@/server/itemlist/handlers";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withApiGuard(
    req,
    { endpoint: `/itemlist/admin/reports/${id}`, app: "itemlist" },
    async () => handleAdminUpdateReport(req, id)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "PATCH, OPTIONS");
}
