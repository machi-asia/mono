import { afterEach, describe, expect, it, vi } from "vitest";
import { extractModQueryFromFilename, resolveModrinthDependencies } from "./modrinth";

describe("modrinth utilities", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when no dependencies are passed", async () => {
    expect(await resolveModrinthDependencies([])).toEqual([]);
  });

  it("resolves project IDs to human-readable mod titles", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: "P7dR8mSH", title: "Fabric API" }]), {
        status: 200,
      })
    );

    const resolved = await resolveModrinthDependencies([
      { project_id: "P7dR8mSH", dependency_type: "required" },
    ]);

    expect(resolved).toEqual([
      { id: "P7dR8mSH", name: "Fabric API", type: "required" },
    ]);
  });

  it("strips loader and version suffixes from .jar filenames", () => {
    expect(extractModQueryFromFilename("sodium-fabric-0.6.5+mc1.21.1.jar")).toBe("sodium");
    expect(extractModQueryFromFilename("iris-mc1.21.1-1.8.0.jar")).toBe("iris");
  });
});
