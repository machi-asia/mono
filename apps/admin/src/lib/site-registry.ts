export type SiteDomainGroupId = "machi.asia" | "itemlist.online";

export interface SiteDomainSection {
  id: SiteDomainGroupId;
  pattern: string;
  title: string;
  description: string;
}

export interface SiteAdminMeta {
  id: string;
  name: string;
  domain: string;
  domainGroup: SiteDomainGroupId;
  adminPath: string;
  appFilter: string;
  description: string;
  category: "core" | "itemlist" | "platform";
  primaryMetrics: string[];
}

export interface GroupedSiteSection extends SiteDomainSection {
  sites: SiteAdminMeta[];
}

export const SITE_DOMAIN_SECTIONS: SiteDomainSection[] = [
  {
    id: "machi.asia",
    pattern: "*.machi.asia",
    title: "Machi Asia Ecosystem",
    description:
      "Core Machi Asia web applications, Rose AI companion, calculators, developer docs, and API gateway.",
  },
  {
    id: "itemlist.online",
    pattern: "*.itemlist.online",
    title: "ItemList Online Ecosystem",
    description:
      "ItemList directory, community consensus moderation, and game-specific recipe planners.",
  },
];

export const SITE_ADMIN_REGISTRY: SiteAdminMeta[] = [
  {
    id: "machi-asia",
    name: "Machi Asia Hub",
    domain: "machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/machi-asia",
    appFilter: "machi-asia",
    description: "Main showcase portal, authentication entry, and subscription billing hub.",
    category: "core",
    primaryMetrics: ["requests", "storage_bytes"],
  },
  {
    id: "rose",
    name: "Rose AI",
    domain: "rose.machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/rose",
    appFilter: "rose",
    description: "Conversational AI companion with Redis chat persistence, voice mode, and token quotas.",
    category: "core",
    primaryMetrics: ["turns", "ai_tokens", "voice_minutes", "requests"],
  },
  {
    id: "calculator",
    name: "Production Calculator",
    domain: "calculator.machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/calculator",
    appFilter: "calculator",
    description: "Multi-game factory planner and dependency graph calculator.",
    category: "core",
    primaryMetrics: ["blueprint_exports", "requests"],
  },
  {
    id: "hells-forge",
    name: "Hell's Forge",
    domain: "hellsforge.machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/hells-forge",
    appFilter: "hells-forge",
    description: "2D multiplayer exploration sandbox powered by Pixi.js and Redis sync rooms.",
    category: "core",
    primaryMetrics: ["requests", "arena_spawns"],
  },
  {
    id: "docs",
    name: "Docs & Dev Hub",
    domain: "docs.machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/docs",
    appFilter: "docs",
    description: "Developer documentation, component showcases, ADRs, and user manuals.",
    category: "platform",
    primaryMetrics: ["requests"],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    domain: "portfolio.machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/portfolio",
    appFilter: "portfolio",
    description: "Interactive engineering portfolio and case study showcase.",
    category: "platform",
    primaryMetrics: ["requests"],
  },
  {
    id: "api",
    name: "API Gateway",
    domain: "api.machi.asia",
    domainGroup: "machi.asia",
    adminPath: "/api",
    appFilter: "api",
    description: "Centralized API microservice, rate limiter, Redis sync, and health telemetry.",
    category: "platform",
    primaryMetrics: ["requests", "ai_tokens"],
  },
  {
    id: "itemlist",
    name: "ItemList Portal",
    domain: "itemlist.online",
    domainGroup: "itemlist.online",
    adminPath: "/itemlist",
    appFilter: "itemlist",
    description: "ItemList community consensus overrides, Create & RimWorld recipe reports, and triage.",
    category: "itemlist",
    primaryMetrics: ["requests", "blueprint_exports"],
  },
  {
    id: "home",
    name: "ItemList Home",
    domain: "itemlist.online",
    domainGroup: "itemlist.online",
    adminPath: "/home",
    appFilter: "home",
    description: "Centralized directory for game production calculators.",
    category: "itemlist",
    primaryMetrics: ["requests"],
  },
  {
    id: "create",
    name: "ItemList Create",
    domain: "create.itemlist.online",
    domainGroup: "itemlist.online",
    adminPath: "/create",
    appFilter: "create",
    description: "Minecraft Create mod kinetic automation and recipe tree planner.",
    category: "itemlist",
    primaryMetrics: ["blueprint_exports", "requests"],
  },
  {
    id: "rimworld",
    name: "ItemList RimWorld",
    domain: "rimworld.itemlist.online",
    domainGroup: "itemlist.online",
    adminPath: "/rimworld",
    appFilter: "rimworld",
    description: "RimWorld colony manufacturing and fabrication bench bill planner.",
    category: "itemlist",
    primaryMetrics: ["blueprint_exports", "requests"],
  },
];

export function getSiteAdminMeta(siteId: string): SiteAdminMeta | undefined {
  const normalized = siteId.trim().toLowerCase();
  return SITE_ADMIN_REGISTRY.find((s) => s.id === normalized);
}

export function getSitesByDomainGroup(): GroupedSiteSection[] {
  return SITE_DOMAIN_SECTIONS.map((section) => ({
    ...section,
    sites: SITE_ADMIN_REGISTRY.filter((site) => site.domainGroup === section.id),
  }));
}
