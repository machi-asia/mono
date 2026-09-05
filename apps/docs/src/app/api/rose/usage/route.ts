import { handleRoseUsage } from "@mono/rose/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleRoseUsage(req);
}
