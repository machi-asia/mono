import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", "..", ".."),
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
};

export default nextConfig;
