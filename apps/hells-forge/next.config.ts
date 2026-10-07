import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  transpilePackages: ["@mono/components", "@mono/auth", "@mono/sync"],
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
