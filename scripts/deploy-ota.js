const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const apps = [
  { name: "calculator", path: "apps/calculator", appId: "bcbdb078-9e02-4744-98dd-44afd20505c4" },
  { name: "docs", path: "apps/docs", appId: "b4cb8036-75d2-45f1-ac52-3de7904869b3" },
  { name: "hells-forge", path: "apps/hells-forge", appId: "36660daa-e552-4410-9afb-fc6320b592cc" },
  { name: "machi-asia", path: "apps/machi-asia", appId: "3ad8cf40-58d9-4124-b82a-079df5524596" },
  { name: "rose", path: "apps/rose", appId: "717836e1-e934-42de-b027-0a5061173bcb" },
];

const apiKey = process.env.OTAKIT_TOKEN || process.env.OTAKIT_KEY;
const channel = process.env.OTAKIT_CHANNEL;

console.log("\n============================================================");
console.log("  Machi Asia - OtaKit OTA Deployment Pipeline");
console.log("============================================================\n");

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

  console.log(`\n[deploy:ota] Uploading OTA bundle for ${app.name} (${app.appId})...`);
  const uploadArgs = [
    "-y",
    "@otakit/cli@latest",
    "upload",
    outDir,
    "--app-id",
    app.appId,
    "--release",
    ...(channel ? [channel] : []),
    "--ignore-compat",
    ...(apiKey ? ["--token", apiKey] : []),
  ];

  const uploadResult = spawnSync("npx", uploadArgs, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

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
  console.log("  All OtaKit OTA Bundles Successfully Deployed!");
  console.log("============================================================\n");
}
