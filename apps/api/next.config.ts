import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  transpilePackages: [
    "@mono/components",
    "@mono/auth",
    "@mono/rose",
    "@mono/database",
    "@mono/api-client",
    "@mono/app-config",
  ],
  serverExternalPackages: [
    "faster-whisper-ts",
    "koffi",
    "onnxruntime-node",
    "@huggingface/tokenizers",
    "ioredis",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Client-Info, X-User-Id, X-Test-Role" },
        ],
      },
    ];
  },
};

export default nextConfig;
