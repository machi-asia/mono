import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mono/components", "@mono/auth", "@mono/sync"],
};

export default nextConfig;
