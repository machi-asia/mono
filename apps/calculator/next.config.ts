import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", "..", ".."),
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

