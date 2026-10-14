import { handleAdminUpdateReport } from "@/server/itemlist/handlers";
import { recordApiCall } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const start = Date.now();
  const { id } = await params;
  try {
    const res = await handleAdminUpdateReport(req, id);
    recordApiCall(`/itemlist/admin/reports/${id}`, "PATCH", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall(`/itemlist/admin/reports/${id}`, "PATCH", Date.now() - start, true);
    throw err;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
