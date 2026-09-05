import { handleRoseSettings } from "@mono/rose/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleRoseSettings(req);
}

export async function POST(req: Request) {
  return handleRoseSettings(req);
}
