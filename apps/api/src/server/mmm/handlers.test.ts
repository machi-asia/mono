import { afterEach, describe, expect, it, vi } from "vitest";
import {
  extractModQueryFromFilename,
  handleMmmCreateOrganization,
  handleMmmGetOrganizations,
  handleMmmModrinthMatchFiles,
  resolveModrinthDependencies,
} from "./handlers";

describe("MMM API handlers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts clean search queries from .jar filenames", () => {
    expect(extractModQueryFromFilename("sodium-fabric-0.6.5+mc1.21.1.jar")).toBe("sodium");
    expect(extractModQueryFromFilename("iris-mc1.21.1-1.8.0.jar")).toBe("iris");
  });

  it("resolves Modrinth dependency names via project lookup", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: "P7dR8mSH", title: "Fabric API" }]), { status: 200 })
    );

    const resolved = await resolveModrinthDependencies([
      { project_id: "P7dR8mSH", dependency_type: "required" },
    ]);

    expect(resolved).toEqual([
      { id: "P7dR8mSH", name: "Fabric API", type: "required" },
    ]);
  });

  it("returns empty guest organizations when no request session exists", async () => {
    const res = await handleMmmGetOrganizations();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ organizations: [], isGuest: true });
  });

  it("rejects unauthenticated organization creation with 401", async () => {
    const req = new Request("http://localhost:3005/mmm/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Skyblock Lab" }),
    });
    const res = await handleMmmCreateOrganization(req);
    expect(res.status).toBe(401);
  });

  it("validates empty filenames array on match-files", async () => {
    const req = new Request("http://localhost:3005/mmm/modrinth/match-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filenames: [] }),
    });
    const res = await handleMmmModrinthMatchFiles(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "No filenames provided" });
  });
});
