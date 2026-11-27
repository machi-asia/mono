import path from "node:path";
import type { NextConfig } from "next";

const isStaticExport =
  process.env.NODE_ENV === "production" ||
  process.env.STATIC_EXPORT === "true" ||
  process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  transpilePackages: [
    "@mono/components",
    "@mono/auth",
    "@mono/game-calculator",
    "@mono/database",
    "@mono/api-client",
    "@mono/app-config",
  ],
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.xml": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.xml$/i,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
