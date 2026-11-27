export type MinecraftModLoader = "fabric" | "forge" | "neoforge" | "quilt";

export interface MmmOrganization {
  id: string;
  name: string;
  slug: string;
  description: string;
  invite_code: string;
  minecraft_version: string;
  modloader: MinecraftModLoader;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  members_count?: number;
}

export interface MmmOrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  user_email?: string;
}

export interface MmmModList {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface MmmModDependency {
  id?: string;
  name: string;
  type?: "required" | "optional" | "incompatible";
}

export interface MmmMod {
  id: string;
  mod_list_id: string;
  modrinth_id: string;
  modrinth_slug: string;
  name: string;
  summary: string;
  icon_url: string;
  author: string;
  download_url: string;
  filename: string;
  version_number: string;
  minecraft_version: string;
  modloader: string;
  dependencies: MmmModDependency[];
  added_at: string;
  added_by?: string | null;
}

export interface MmmModHistory {
  id: string;
  mod_list_id: string;
  action: "add" | "remove" | "update";
  mod_name: string;
  modrinth_id: string;
  previous_version?: string;
  new_version?: string;
  message?: string;
  performed_by?: string | null;
  created_at: string;
}

export interface ModrinthSearchResult {
  project_id: string;
  slug: string;
  title: string;
  description: string;
  categories: string[];
  client_side: string;
  server_side: string;
  icon_url: string;
  downloads: number;
  follows: number;
  author: string;
  versions: string[];
}

export interface SupportedMinecraftVersion {
  version: string;
  major: string;
  releaseDate: string;
  recommendedLoader: MinecraftModLoader;
  isLTS?: boolean;
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

export const MOD_LOADERS: Array<{ id: MinecraftModLoader; name: string; description: string }> = [
  { id: "fabric", name: "Fabric", description: "Lightweight, modular modding toolchain with immense performance mod ecosystem." },
  { id: "neoforge", name: "NeoForge", description: "Modern community-driven fork of Minecraft Forge for 1.20.2+." },
  { id: "forge", name: "Forge", description: "Classic powerhouse modding platform with comprehensive API features." },
  { id: "quilt", name: "Quilt", description: "Modern modular modloader with backward compatibility for Fabric mods." },
];

export const DEMO_MMM_ORG: MmmOrganization = {
  id: "demo-nexus-smp",
  name: "Machi Nexus SMP",
  slug: "machi-nexus-smp",
  description: "Curated Fabric 1.21.1 optimization, shader, and Create automation modpack for SMP seasons.",
  invite_code: "NEXUS-2026",
  minecraft_version: "1.21.1",
  modloader: "fabric",
  created_at: "2026-11-10T08:00:00Z",
  updated_at: "2026-11-21T08:00:00Z",
};

export const DEMO_MMM_MODS: MmmMod[] = [
  {
    id: "demo-mod-sodium",
    mod_list_id: "demo-list-main",
    modrinth_id: "AANobbMI",
    modrinth_slug: "sodium",
    name: "Sodium",
    summary: "The fastest and most compatible rendering optimization mod for Minecraft. Dramatically boosts frame rates and reduces micro-stutter.",
    icon_url: "https://cdn.modrinth.com/data/AANobbMI/icon.png",
    author: "jellysquid3_",
    download_url: "https://modrinth.com/mod/sodium",
    filename: "sodium-fabric-0.6.5+mc1.21.1.jar",
    version_number: "0.6.5",
    minecraft_version: "1.21.1",
    modloader: "fabric",
    dependencies: [{ id: "P7dR8mSH", name: "Fabric API", type: "required" }],
    added_at: "2026-11-12T09:15:00Z",
  },
  {
    id: "demo-mod-iris",
    mod_list_id: "demo-list-main",
    modrinth_id: "YL57xq9U",
    modrinth_slug: "iris",
    name: "Iris Shaders",
    summary: "Modern shaders mod for Minecraft intended to be compatible with existing OptiFine shader packs and Sodium.",
    icon_url: "https://cdn.modrinth.com/data/YL57xq9U/icon.png",
    author: "coderbot",
    download_url: "https://modrinth.com/mod/iris",
    filename: "iris-fabric-1.8.1+mc1.21.1.jar",
    version_number: "1.8.1",
    minecraft_version: "1.21.1",
    modloader: "fabric",
    dependencies: [
      { id: "AANobbMI", name: "Sodium", type: "required" },
      { id: "P7dR8mSH", name: "Fabric API", type: "optional" },
    ],
    added_at: "2026-11-13T11:30:00Z",
  },
  {
    id: "demo-mod-lithium",
    mod_list_id: "demo-list-main",
    modrinth_id: "gvQqBUqZ",
    modrinth_slug: "lithium",
    name: "Lithium",
    summary: "General-purpose optimization mod improving game physics, mob AI, and block ticking without altering vanilla behavior.",
    icon_url: "https://cdn.modrinth.com/data/gvQqBUqZ/icon.png",
    author: "jellysquid3_",
    download_url: "https://modrinth.com/mod/lithium",
    filename: "lithium-fabric-0.14.3+mc1.21.1.jar",
    version_number: "0.14.3",
    minecraft_version: "1.21.1",
    modloader: "fabric",
    dependencies: [{ id: "P7dR8mSH", name: "Fabric API", type: "optional" }],
    added_at: "2026-11-14T14:20:00Z",
  },
  {
    id: "demo-mod-fabric-api",
    mod_list_id: "demo-list-main",
    modrinth_id: "P7dR8mSH",
    modrinth_slug: "fabric-api",
    name: "Fabric API",
    summary: "Lightweight and modular API providing common hooks and intercompatibility measures utilized by Fabric mods.",
    icon_url: "https://cdn.modrinth.com/data/P7dR8mSH/icon.png",
    author: "modmuss50",
    download_url: "https://modrinth.com/mod/fabric-api",
    filename: "fabric-api-0.110.0+1.21.1.jar",
    version_number: "0.110.0",
    minecraft_version: "1.21.1",
    modloader: "fabric",
    dependencies: [],
    added_at: "2026-11-10T08:05:00Z",
  },
  {
    id: "demo-mod-modmenu",
    mod_list_id: "demo-list-main",
    modrinth_id: "mOgUt4GM",
    modrinth_slug: "modmenu",
    name: "Mod Menu",
    summary: "Adds an in-game screen for viewing and configuring all installed Fabric mods and dependency trees.",
    icon_url: "https://cdn.modrinth.com/data/mOgUt4GM/icon.png",
    author: "Prospector",
    download_url: "https://modrinth.com/mod/modmenu",
    filename: "modmenu-11.0.3.jar",
    version_number: "11.0.3",
    minecraft_version: "1.21.1",
    modloader: "fabric",
    dependencies: [{ id: "P7dR8mSH", name: "Fabric API", type: "required" }],
    added_at: "2026-11-15T16:45:00Z",
  },
  {
    id: "demo-mod-ferritecore",
    mod_list_id: "demo-list-main",
    modrinth_id: "uXXizFIs",
    modrinth_slug: "ferrite-core",
    name: "FerriteCore",
    summary: "Memory usage optimization mod reducing client and dedicated server RAM overhead significantly.",
    icon_url: "https://cdn.modrinth.com/data/uXXizFIs/icon.png",
    author: "malte0811",
    download_url: "https://modrinth.com/mod/ferrite-core",
    filename: "ferritecore-7.0.2-fabric.jar",
    version_number: "7.0.2",
    minecraft_version: "1.21.1",
    modloader: "fabric",
    dependencies: [],
    added_at: "2026-11-16T18:10:00Z",
  },
];

export const DEMO_MMM_HISTORY: MmmModHistory[] = [
  {
    id: "hist-6",
    mod_list_id: "demo-list-main",
    action: "add",
    mod_name: "FerriteCore",
    modrinth_id: "uXXizFIs",
    new_version: "7.0.2",
    message: "Added FerriteCore (7.0.2) to reduce heap allocation during chunk generation",
    created_at: "2026-11-16T18:10:00Z",
  },
  {
    id: "hist-5",
    mod_list_id: "demo-list-main",
    action: "add",
    mod_name: "Mod Menu",
    modrinth_id: "mOgUt4GM",
    new_version: "11.0.3",
    message: "Added Mod Menu (11.0.3) with Fabric API dependency",
    created_at: "2026-11-15T16:45:00Z",
  },
  {
    id: "hist-4",
    mod_list_id: "demo-list-main",
    action: "add",
    mod_name: "Lithium",
    modrinth_id: "gvQqBUqZ",
    new_version: "0.14.3",
    message: "Added Lithium (0.14.3) server tick optimizer",
    created_at: "2026-11-14T14:20:00Z",
  },
  {
    id: "hist-3",
    mod_list_id: "demo-list-main",
    action: "add",
    mod_name: "Iris Shaders",
    modrinth_id: "YL57xq9U",
    new_version: "1.8.1",
    message: "Added Iris Shaders (1.8.1) linked against Sodium 0.6.5",
    created_at: "2026-11-13T11:30:00Z",
  },
  {
    id: "hist-2",
    mod_list_id: "demo-list-main",
    action: "update",
    mod_name: "Sodium",
    modrinth_id: "AANobbMI",
    previous_version: "0.6.2",
    new_version: "0.6.5",
    message: "Updated Sodium (0.6.2 -> 0.6.5) for MC 1.21.1 pipeline compatibility",
    created_at: "2026-11-12T09:15:00Z",
  },
  {
    id: "hist-1",
    mod_list_id: "demo-list-main",
    action: "add",
    mod_name: "Fabric API",
    modrinth_id: "P7dR8mSH",
    new_version: "0.110.0",
    message: "Initialized Main Modpack with Fabric API (0.110.0)",
    created_at: "2026-11-10T08:05:00Z",
  },
];
