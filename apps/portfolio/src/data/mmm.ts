import type { MinecraftModLoader } from "./types";

export interface SupportedMinecraftVersion {
  version: string;
  major: string;
  releaseDate: string;
  recommendedLoader: MinecraftModLoader;
  isLTS?: boolean;
}

export interface PresetModItem {
  name: string;
  modrinthSlug: string;
  summary: string;
  category: "performance" | "qol" | "visuals" | "utility";
  iconUrl: string;
  author: string;
}

export const MINECRAFT_VERSIONS: SupportedMinecraftVersion[] = [
  { version: "1.21.1", major: "1.21", releaseDate: "2024-08-08", recommendedLoader: "fabric", isLTS: true },
  { version: "1.21", major: "1.21", releaseDate: "2024-06-13", recommendedLoader: "fabric" },
  { version: "1.20.4", major: "1.20", releaseDate: "2023-12-07", recommendedLoader: "fabric" },
  { version: "1.20.1", major: "1.20", releaseDate: "2023-06-12", recommendedLoader: "fabric", isLTS: true },
  { version: "1.19.4", major: "1.19", releaseDate: "2023-03-14", recommendedLoader: "fabric" },
  { version: "1.19.2", major: "1.19", releaseDate: "2022-08-05", recommendedLoader: "forge" },
  { version: "1.18.2", major: "1.18", releaseDate: "2022-02-28", recommendedLoader: "forge", isLTS: true },
  { version: "1.16.5", major: "1.16", releaseDate: "2021-01-15", recommendedLoader: "forge", isLTS: true },
  { version: "1.12.2", major: "1.12", releaseDate: "2017-09-18", recommendedLoader: "forge", isLTS: true },
];

export const MOD_LOADERS: Array<{ id: MinecraftModLoader; name: string; description: string; icon: string }> = [
  { id: "fabric", name: "Fabric", description: "Lightweight, modular modding toolchain with immense performance mod ecosystem.", icon: "⚡" },
  { id: "neoforge", name: "NeoForge", description: "Modern community-driven fork of Minecraft Forge for 1.20.2+.", icon: "🔥" },
  { id: "forge", name: "Forge", description: "Classic powerhouse modding platform with comprehensive API features.", icon: "🔨" },
  { id: "quilt", name: "Quilt", description: "Modern modular modloader with backward compatibility for Fabric mods.", icon: "🧵" },
];

export const ESSENTIAL_STARTER_MODS: PresetModItem[] = [
  {
    name: "Sodium",
    modrinthSlug: "sodium",
    summary: "Modern rendering engine replacement for Minecraft that greatly improves frame rates and reduces micro-stutters.",
    category: "performance",
    iconUrl: "https://cdn.modrinth.com/data/AANobbMI/icon.png",
    author: "jellysquid3_",
  },
  {
    name: "Lithium",
    modrinthSlug: "lithium",
    summary: "General-purpose optimization mod for Minecraft which improves server physics, mob AI, and world generation without changing vanilla behavior.",
    category: "performance",
    iconUrl: "https://cdn.modrinth.com/data/gvQqBUqZ/icon.png",
    author: "jellysquid3_",
  },
  {
    name: "Iris Shaders",
    modrinthSlug: "iris",
    summary: "Modern shader mod for Minecraft compatible with Sodium, offering superior performance and full OptiFine shader pack support.",
    category: "visuals",
    iconUrl: "https://cdn.modrinth.com/data/YL57xq9U/icon.png",
    author: "coderbot",
  },
  {
    name: "Fabric API",
    modrinthSlug: "fabric-api",
    summary: "Core lightweight hook and compatibility library required for most Fabric mods.",
    category: "utility",
    iconUrl: "https://cdn.modrinth.com/data/P7dR8mSH/icon.png",
    author: "modmuss50",
  },
  {
    name: "Mod Menu",
    modrinthSlug: "modmenu",
    summary: "Adds a clean, responsive in-game screen to view and configure all installed mods.",
    category: "qol",
    iconUrl: "https://cdn.modrinth.com/data/mOgUt4GM/icon.png",
    author: "Prospector",
  },
  {
    name: "FerriteCore",
    modrinthSlug: "ferrite-core",
    summary: "Memory usage optimization mod reducing Minecraft RAM consumption by up to 50%.",
    category: "performance",
    iconUrl: "https://cdn.modrinth.com/data/uXXizFIs/icon.png",
    author: "malte0811",
  },
];

export const MMM_SYSTEM_FEATURES = {
  name: "Minecraft Mod Manager (MMM)",
  tagline: "Organization-Based Modpack Management with Version Control & Direct Modrinth Downloads",
  description: "MMM is a collaborative tool for Minecraft communities, SMP teams, and modpack creators. It enables organizations to curate mod lists, manage permissions, share instantaneous invite links, review git-like commit logs of added/removed/updated mods, search Modrinth directly with version matching, and download all mod JARs sequentially one by one without needing archive extractions.",
  capabilities: [
    "Organization multi-tenancy with instant invite links",
    "Direct integration with the Modrinth v2 REST API",
    "Smart game version and modloader compatibility filtering",
    "Git-like mod version control timeline (auditing every addition and removal)",
    "Sequential bulk downloader triggering native browser/filesystem stream saves one-by-one",
  ],
};
