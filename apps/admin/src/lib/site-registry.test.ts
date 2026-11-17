import { describe, it, expect } from "vitest";
import {
  SITE_ADMIN_REGISTRY,
  getSiteAdminMeta,
  getSitesByDomainGroup,
} from "./site-registry";

describe("site-registry", () => {
  it("lists all Machi Asia and ItemList sites with dedicated admin routes", () => {
    expect(SITE_ADMIN_REGISTRY.length).toBeGreaterThanOrEqual(10);
    expect(getSiteAdminMeta("rose")?.adminPath).toBe("/rose");
    expect(getSiteAdminMeta("itemlist")?.adminPath).toBe("/itemlist");
    expect(getSiteAdminMeta("calculator")?.adminPath).toBe("/calculator");
    expect(getSiteAdminMeta("hells-forge")?.adminPath).toBe("/hells-forge");
    expect(getSiteAdminMeta("non-existent")).toBeUndefined();
  });

  it("categorizes per-site portals by domain (*.machi.asia vs *.itemlist.online)", () => {
    const groups = getSitesByDomainGroup();
    expect(groups.map((g) => g.pattern)).toEqual(["*.machi.asia", "*.itemlist.online"]);

    const machiGroup = groups.find((g) => g.id === "machi.asia");
    const itemlistGroup = groups.find((g) => g.id === "itemlist.online");
    expect(machiGroup).toBeDefined();
    expect(itemlistGroup).toBeDefined();

    expect(
      machiGroup!.sites.every(
        (site) => site.domain === "machi.asia" || site.domain.endsWith(".machi.asia")
      )
    ).toBe(true);
    expect(
      itemlistGroup!.sites.every(
        (site) => site.domain === "itemlist.online" || site.domain.endsWith(".itemlist.online")
      )
    ).toBe(true);
    expect(machiGroup!.sites.length + itemlistGroup!.sites.length).toBe(
      SITE_ADMIN_REGISTRY.length
    );
  });
});
