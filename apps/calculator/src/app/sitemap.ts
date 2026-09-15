import type { MetadataRoute } from "next";
import { GAMES_DATA } from "../data/games";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calculator.machi-asia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const gameRoutes: MetadataRoute.Sitemap = GAMES_DATA.map((game) => ({
    url: `${SITE_URL}/${game.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...gameRoutes,
  ];
}