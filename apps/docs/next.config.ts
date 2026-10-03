import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", "..", ".."),
  serverExternalPackages: [
    "faster-whisper-ts",
    "koffi",
    "onnxruntime-node",
    "@huggingface/tokenizers",
  ],
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/components/auth",
        permanent: false,
      },
      {
        source: "/docs",
        destination: "/",
        permanent: false,
      },
      {
        source: "/docs/:path*",
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

