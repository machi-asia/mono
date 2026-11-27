import path from "node:path";
import type { NextConfig } from "next";

const isStaticExport =
  process.env.NODE_ENV === "production" ||
  process.env.STATIC_EXPORT === "true" ||
  process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  ...(isStaticExport ? { output: "export" } : {}),
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ailxxxnezfdgbtqxjoil.supabase.co",
      },
    ],
  },
};

export default nextConfig;
