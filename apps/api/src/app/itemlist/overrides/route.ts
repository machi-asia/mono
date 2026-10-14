import { handleGetOverrides } from "@/server/itemlist/handlers";
import { recordApiCall } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const start = Date.now();
  try {
    const res = await handleGetOverrides(req);
    recordApiCall("/itemlist/overrides", "GET", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall("/itemlist/overrides", "GET", Date.now() - start, true);
    throw err;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
