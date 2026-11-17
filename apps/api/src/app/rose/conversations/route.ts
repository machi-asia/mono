import { handleRoseConversations } from "@/server/rose/conversations";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/conversations", app: "rose" },
    async () => handleRoseConversations(req)
  );
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/conversations", app: "rose" },
    async () => handleRoseConversations(req)
  );
}

export async function PUT(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/conversations", app: "rose" },
    async () => handleRoseConversations(req)
  );
}

export async function DELETE(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/conversations", app: "rose" },
    async () => handleRoseConversations(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, POST, PUT, DELETE, OPTIONS");
}
