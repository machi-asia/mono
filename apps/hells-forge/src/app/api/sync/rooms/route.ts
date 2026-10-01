import { handleSyncRoomsRoute } from "@mono/sync/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleSyncRoomsRoute(req);
}
