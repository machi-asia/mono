import { handleRoseChat } from "@/server/rose/chat";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/chat", app: "rose", metric: "requests", cost: 1 },
    async () => handleRoseChat(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "POST, OPTIONS");
}
