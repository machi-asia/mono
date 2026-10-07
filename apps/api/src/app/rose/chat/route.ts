import { handleRoseChat } from "@/server/rose/chat";
import { recordApiCall } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const res = await handleRoseChat(req);
    recordApiCall("/rose/chat", "POST", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall("/rose/chat", "POST", Date.now() - start, true);
    throw err;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
