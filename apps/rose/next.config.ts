import path from "node:path";
import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  transpilePackages: ["@mono/components", "@mono/auth", "@mono/rose", "@mono/database", "@mono/api-client", "@mono/app-config"],
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
  serverExternalPackages: [
    "faster-whisper-ts",
    "koffi",
    "onnxruntime-node",
    "@huggingface/tokenizers",
  ],
};

export default nextConfig;
