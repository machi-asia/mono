import { handleRoseTranscribe } from "@mono/rose/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleRoseTranscribe(req);
}

