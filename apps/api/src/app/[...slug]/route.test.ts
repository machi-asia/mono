import { describe, expect, it } from "vitest";
import { DELETE, GET, OPTIONS, PATCH, POST } from "./route";

function makeContext(slug: string[]) {
  return { params: Promise.resolve({ slug }) };
}

describe("apps/api unified catch-all dispatcher", () => {
  it("handles /health and /api/health uniformly", async () => {
    const resDirect = await GET(new Request("http://localhost:3005/health"), makeContext(["health"]));
    expect(resDirect.status).toBe(200);
    const jsonDirect = (await resDirect.json()) as { status: string; service: string };
    expect(jsonDirect.status).toBe("ok");
    expect(jsonDirect.service).toBe("@mono/api");

    const resPrefixed = await GET(
      new Request("http://localhost:3005/api/health"),
      makeContext(["api", "health"])
    );
    expect(resPrefixed.status).toBe(200);
    const jsonPrefixed = (await resPrefixed.json()) as { status: string };
    expect(jsonPrefixed.status).toBe("ok");
  });

  it("routes /api/mmm, /api/quicknote, and /api/uoweme endpoints", async () => {
    const mmmRes = await GET(
      new Request("http://localhost:3005/api/mmm/organizations"),
      makeContext(["api", "mmm", "organizations"])
    );
    expect(mmmRes.status).toBe(200);
    expect(await mmmRes.json()).toEqual({ organizations: [], isGuest: true });

    const noteRes = await POST(
      new Request("http://localhost:3005/api/quicknote/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Gateway Dispatch" }),
      }),
      makeContext(["api", "quicknote", "generate"])
    );
    expect(noteRes.status).toBe(200);
    const noteJson = (await noteRes.json()) as { title: string };
    expect(noteJson.title).toBe("Gateway Dispatch");

    const uowemeRes = await GET(
      new Request("http://localhost:3005/api/uoweme"),
      makeContext(["api", "uoweme"])
    );
    expect(uowemeRes.status).toBe(200);
    expect(await uowemeRes.json()).toEqual({ debts: [], isGuest: true });
  });

  it("enforces method checks, admin guard, CORS preflight, and 404s", async () => {
    const optionsRes = await OPTIONS(
      new Request("http://localhost:3005/api/health", {
        method: "OPTIONS",
        headers: { origin: "https://mmm.machi.asia" },
      })
    );
    expect(optionsRes.status).toBe(204);
    expect(optionsRes.headers.get("Access-Control-Allow-Origin")).toBe("https://mmm.machi.asia");

    const badMethod = await DELETE(
      new Request("http://localhost:3005/health", { method: "DELETE" }),
      makeContext(["health"])
    );
    expect(badMethod.status).toBe(405);

    const adminBlocked = await GET(
      new Request("http://localhost:3005/api/admin/overview"),
      makeContext(["api", "admin", "overview"])
    );
    expect(adminBlocked.status).toBe(401);

    const dynamicParamMethod = await PATCH(
      new Request("http://localhost:3005/api/uoweme/debt-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settled: true }),
      }),
      makeContext(["api", "uoweme", "debt-1"])
    );
    expect(dynamicParamMethod.status).toBe(401);

    const missing = await GET(
      new Request("http://localhost:3005/api/does-not-exist"),
      makeContext(["api", "does-not-exist"])
    );
    expect(missing.status).toBe(404);
  });
});
