import { handleRoseSettings } from "@/server/rose/settings";
import { recordApiCall } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const start = Date.now();
  try {
    const res = await handleRoseSettings(req);
    recordApiCall("/rose/settings", "GET", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall("/rose/settings", "GET", Date.now() - start, true);
    throw err;
  }
}

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const res = await handleRoseSettings(req);
    recordApiCall("/rose/settings", "POST", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall("/rose/settings", "POST", Date.now() - start, true);
    throw err;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
