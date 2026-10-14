export interface GameMetadata {
  id: string;
  name: string;
  tagline: string;
  homeUrl?: string;
  itemCount: number;
}

export const GAMES_METADATA: Record<string, GameMetadata> = {
  create: {
    id: "create",
    name: "Create",
    tagline: "Build kinetic contraptions, rotational power networks, and automated multi-step assembly lines.",
    homeUrl: "https://itemlist.online",
    itemCount: 478,
  },
  rimworld: {
    id: "rimworld",
    name: "RimWorld",
    tagline: "Manage colony production chains, crafting benches, fabrication, and survival manufacturing.",
    homeUrl: "https://itemlist.online",
    itemCount: 9,
  },
};
