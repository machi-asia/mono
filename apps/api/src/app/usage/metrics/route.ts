import { handleUsageMetricsRoute } from "@/server/usage/tracker";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/usage/metrics", app: "api" },
    async () => handleUsageMetricsRoute(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, OPTIONS");
}
