import path from "node:path";
import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["26.244.155.226", "localhost", "127.0.0.1"],
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  transpilePackages: [
    "@mono/components",
    "@mono/auth",
    "@mono/rose",
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
  serverExternalPackages: [
    "faster-whisper-ts",
    "koffi",
    "onnxruntime-node",
    "@huggingface/tokenizers",
  ],
  ...(!isStaticExport
    ? {
        async redirects() {
          return [
            {
              source: "/auth",
              destination: "/components/auth",
              permanent: false,
            },
            {
              source: "/wiki",
              destination: "/docs",
              permanent: false,
            },
            {
              source: "/wiki/:slug",
              destination: "/docs/:slug",
              permanent: false,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
