import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  transpilePackages: [
    "@mono/components",
    "@mono/auth",
    "@mono/database",
    "@mono/api-client",
    "@mono/app-config",
  ],
};

export default nextConfig;
