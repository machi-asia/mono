import { NextResponse } from "next/server";
import { recordApiCall } from "@/server/usage/tracker";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  recordApiCall("/health", "GET", Date.now() - start, false);
  return NextResponse.json({
    status: "ok",
    service: "@mono/api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
