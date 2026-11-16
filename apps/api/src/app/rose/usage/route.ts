import { handleRoseUsage } from "@/server/rose/usage";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/usage", app: "rose" },
    async () => handleRoseUsage(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, OPTIONS");
}
