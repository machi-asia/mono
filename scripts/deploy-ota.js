const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const apps = [
  { name: "calculator", path: "apps/calculator", appId: "asia.machi.calculator" },
  { name: "docs", path: "apps/docs", appId: "asia.machi.docs" },
  { name: "hells-forge", path: "apps/hells-forge", appId: "asia.machi.hellsforge" },
  { name: "machi-asia", path: "apps/machi-asia", appId: "asia.machi.portal" },
  { name: "rose", path: "apps/rose", appId: "asia.machi.rose" },
];

const apiKey = process.env.CAPGO_TOKEN || process.env.CAPGO_KEY;
const channel = process.env.CAPGO_CHANNEL || "production";

console.log("\n============================================================");
console.log("  Machi Asia - Capgo OTA Deployment Pipeline");
console.log("============================================================\n");

if (!apiKey) {
  console.error("[deploy:ota] Error: CAPGO_TOKEN or CAPGO_KEY environment variable is required.");
  console.error("  Usage: CAPGO_TOKEN=<key> npm run deploy:ota");
  process.exit(1);
}

// 1. Build mobile static exports
console.log("[deploy:ota] Building mobile web bundles (out/)...");
const buildResult = spawnSync("npx", ["turbo", "build:mobile"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (buildResult.status !== 0) {
  console.error("[deploy:ota] Build failed. Aborting OTA upload.");
  process.exit(buildResult.status || 1);
}

// 2. Upload bundles for each app
let hadError = false;

for (const app of apps) {
  const outDir = path.join(root, app.path, "out");
  if (!fs.existsSync(outDir)) {
    console.warn(`[deploy:ota] Skipping ${app.name}: out/ directory not found at ${outDir}`);
    continue;
  }

  console.log(`\n[deploy:ota] Uploading OTA bundle for ${app.name} (${app.appId}) to channel '${channel}'...`);
  const uploadResult = spawnSync(
    "npx",
    [
      "@capgo/cli",
      "bundle",
      "upload",
      "--path",
      outDir,
      "--channel",
      channel,
      "--apikey",
      apiKey,
      "--app",
      app.appId,
      "--version-exists-ok",
    ],
    {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    }
  );

  if (uploadResult.status !== 0) {
    console.error(`[deploy:ota] Failed to upload OTA bundle for ${app.name}`);
    hadError = true;
  } else {
    console.log(`[deploy:ota] ✓ Successfully uploaded OTA bundle for ${app.name}`);
  }
}

if (hadError) {
  console.error("\n[deploy:ota] Completed with errors.");
  process.exit(1);
} else {
  console.log("\n============================================================");
  console.log("  All Capgo OTA Bundles Successfully Deployed!");
  console.log("============================================================\n");
}
