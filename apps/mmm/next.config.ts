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
    "@mono/database",
    "@mono/api-client",
    "@mono/app-config",
  ],
  ...(isStaticExport ? { output: "export" } : {}),
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.modrinth.com",
      },
    ],
  },
  ...(!isStaticExport
    ? {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: "http://localhost:3005/api/:path*",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
