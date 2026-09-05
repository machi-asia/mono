import { handleRoseChat } from "@mono/rose/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleRoseChat(req);
}
