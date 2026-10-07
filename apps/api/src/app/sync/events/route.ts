import { handleSyncEventsRoute } from "@/server/sync/handlers";
import { recordApiCall } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const start = Date.now();
  try {
    const res = await handleSyncEventsRoute(req);
    recordApiCall("/sync/events", "GET", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall("/sync/events", "GET", Date.now() - start, true);
    throw err;
  }
}

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const res = await handleSyncEventsRoute(req);
    recordApiCall("/sync/events", "POST", Date.now() - start, !res.ok);
    return res;
  } catch (err) {
    recordApiCall("/sync/events", "POST", Date.now() - start, true);
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
