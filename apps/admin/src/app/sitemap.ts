import type { MetadataRoute } from "next";
import { SITE_ADMIN_REGISTRY } from "../lib/site-registry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://admin.machi.asia";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...SITE_ADMIN_REGISTRY.map((site) => ({
      url: `${SITE_URL}${site.adminPath}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
  return routes;
}
