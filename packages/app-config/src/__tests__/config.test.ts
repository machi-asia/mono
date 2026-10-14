import { describe, it, expect } from "vitest";
import { APPS_CONFIG, isAppUnderDevelopment, getAppConfig } from "../index.js";

describe("@mono/app-config", () => {
  it("manages apps underDevelopment status", () => {
    expect(APPS_CONFIG.create.underDevelopment).toBe(false);
    expect(APPS_CONFIG.rimworld.underDevelopment).toBe(true);

    expect(isAppUnderDevelopment("create")).toBe(false);
    expect(isAppUnderDevelopment("rimworld")).toBe(true);

    expect(getAppConfig("create")?.name).toBe("Create");
    expect(getAppConfig("rimworld")?.name).toBe("RimWorld");
  });
});
