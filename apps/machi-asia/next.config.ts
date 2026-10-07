import path from "node:path";
import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", "..", ".."),
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
  ...(!isStaticExport
    ? {
        async redirects() {
          const docsDest =
            process.env.NEXT_PUBLIC_DOCS_URL ||
            (process.env.NODE_ENV === "production"
              ? "https://docs.machi-asia.com"
              : "http://localhost:3000");

          return [
            {
              source: "/docs",
              destination: docsDest,
              permanent: false,
            },
            {
              source: "/docs/:path*",
              destination: `${docsDest}/:path*`,
              permanent: false,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
