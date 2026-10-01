import { handleSyncEventsRoute } from "@mono/sync/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleSyncEventsRoute(req);
}

export async function POST(req: Request) {
  return handleSyncEventsRoute(req);
}
