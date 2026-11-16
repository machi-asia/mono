import { handleRoseSettings } from "@/server/rose/settings";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/settings", app: "rose" },
    async () => handleRoseSettings(req)
  );
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/settings", app: "rose" },
    async () => handleRoseSettings(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, OPTIONS");
}
