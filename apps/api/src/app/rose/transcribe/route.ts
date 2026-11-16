import { handleRoseTranscribe } from "@/server/rose/transcribe";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return withApiGuard(
    req,
    { endpoint: "/rose/transcribe", app: "rose" },
    async () => handleRoseTranscribe(req)
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "POST, OPTIONS");
}
