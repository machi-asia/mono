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
};

export default nextConfig;

