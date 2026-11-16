import { NextResponse } from "next/server";
import { handleCorsPreflight, withApiGuard } from "@/server/security/guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return withApiGuard(req, { endpoint: "/health", app: "api" }, async () =>
    NextResponse.json({
      status: "ok",
      service: "@mono/api",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  );
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req, "GET, OPTIONS");
}
