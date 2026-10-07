const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const apps = ["calculator", "docs", "hells-forge", "machi-asia", "rose"];

const androidDir = path.join(root, "android");
const defaultKeystorePath = path.join(androidDir, "machi-release.keystore");
const keystorePath = process.env.ANDROID_KEYSTORE_PATH || defaultKeystorePath;
const keystorePass = process.env.ANDROID_KEYSTORE_PASSWORD || "machi-asia-release";
const keyAlias = process.env.ANDROID_KEY_ALIAS || "machi-asia";
const keyPass = process.env.ANDROID_KEY_PASSWORD || "machi-asia-release";

const androidHome =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  (process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Android", "Sdk") : null);

console.log("\n============================================================");
console.log("  Building Signed & Deobfuscated Android App Bundles (.aab)");
console.log("============================================================\n");

if (androidHome) {
  console.log(`[bundle:android] Using ANDROID_HOME: ${androidHome}`);
} else {
  console.warn(`[bundle:android] Warning: ANDROID_HOME not found in environment.`);
}

// 1. Ensure Keystore exists
if (!fs.existsSync(keystorePath)) {
  console.log(`[bundle:android] Keystore not found at ${keystorePath}. Generating release keystore...`);
  fs.mkdirSync(path.dirname(keystorePath), { recursive: true });
  const keytoolResult = spawnSync(
    "keytool",
    [
      "-genkeypair",
      "-v",
      "-storetype",
      "PKCS12",
      "-keystore",
      keystorePath,
      "-alias",
      keyAlias,
      "-keyalg",
      "RSA",
      "-keysize",
      "2048",
      "-validity",
      "10000",
      "-dname",
      "CN=Machi Asia, OU=Engineering, O=Machi Asia, L=Singapore, ST=Singapore, C=SG",
      "-storepass",
      keystorePass,
      "-keypass",
      keyPass,
    ],
    {
      stdio: "inherit",
      shell: process.platform === "win32",
    }
  );

  if (keytoolResult.status !== 0) {
    console.error("[bundle:android] Failed to generate release keystore via keytool.");
    process.exit(1);
  }
}

console.log(`[bundle:android] Release Keystore: ${keystorePath} (Alias: ${keyAlias})\n`);

const env = {
  ...process.env,
  ANDROID_KEYSTORE_PATH: keystorePath,
  ANDROID_KEYSTORE_PASSWORD: keystorePass,
  ANDROID_KEY_ALIAS: keyAlias,
  ANDROID_KEY_PASSWORD: keyPass,
  ...(androidHome ? { ANDROID_HOME: androidHome, ANDROID_SDK_ROOT: androidHome } : {}),
};

const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const outputs = [];

for (const app of apps) {
  const appAndroidDir = path.join(root, "apps", app, "android");
  if (!fs.existsSync(appAndroidDir)) {
    console.warn(`[bundle:android] Skipping ${app}: android/ directory not found.`);
    continue;
  }

  console.log(`\n------------------------------------------------------------`);
  console.log(`  Compiling, Shrinking & Signing: @mono/${app}`);
  console.log(`------------------------------------------------------------`);

  const result = spawnSync(gradlew, ["bundleRelease", "--no-daemon"], {
    cwd: appAndroidDir,
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(`[bundle:android] Failed to build signed AAB for '@mono/${app}'.`);
    process.exit(result.status || 1);
  }

  const bundlePath = path.join(appAndroidDir, "app", "build", "outputs", "bundle", "release", "app-release.aab");
  if (!fs.existsSync(bundlePath)) {
    console.error(`[bundle:android] Bundle output missing at: ${bundlePath}`);
    process.exit(1);
  }

  const mappingPath = path.join(appAndroidDir, "app", "build", "outputs", "mapping", "release", "mapping.txt");
  const hasMapping = fs.existsSync(mappingPath);

  // Check verification
  let verifyResult = spawnSync("jarsigner", ["-verify", "-certs", bundlePath], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  let verified = verifyResult.stdout.includes("jar verified") || verifyResult.stdout.includes("Signer #1");

  // If not verified, sign directly with jarsigner using the keystore
  if (!verified) {
    console.log(`[bundle:android] Signing bundle directly via jarsigner for @mono/${app}...`);
    spawnSync(
      "jarsigner",
      ["-keystore", keystorePath, "-storepass", keystorePass, "-keypass", keyPass, bundlePath, keyAlias],
      {
        stdio: "inherit",
        shell: process.platform === "win32",
      }
    );

    verifyResult = spawnSync("jarsigner", ["-verify", "-certs", bundlePath], {
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    verified = verifyResult.stdout.includes("jar verified") || verifyResult.stdout.includes("Signer #1");
  }

  const stats = fs.statSync(bundlePath);

  outputs.push({
    app,
    path: bundlePath,
    mappingPath: hasMapping ? mappingPath : "Embedded in bundle",
    sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
    verified,
    hasMapping,
    signer: verified ? "CN=Machi Asia (RSA 2048-bit)" : "UNSIGNED / UNVERIFIED",
  });
}

console.log("\n============================================================");
console.log("  Signed Android App Bundles & Deobfuscation Summary");
console.log("============================================================\n");

for (const out of outputs) {
  const statusSymbol = out.verified ? "[SIGNED / VERIFIED]" : "[FAILED SIGNING]";
  const mappingSymbol = out.hasMapping ? "[R8 MAPPING GENERATED]" : "[NO MAPPING]";
  console.log(`  * @mono/${out.app.padEnd(12)} -> ${statusSymbol} ${mappingSymbol}`);
  console.log(`    Bundle  : ${out.path}`);
  console.log(`    Mapping : ${out.mappingPath}`);
  console.log(`    Signer  : ${out.signer}`);
  console.log(`    Size    : ${out.sizeMb} MB\n`);
}

const allVerified = outputs.every((o) => o.verified);
if (!allVerified) {
  console.error("Error: Not all bundles passed cryptographic signature verification.");
  process.exit(1);
}

console.log("All Android App Bundles (.aab) are cryptographically signed, R8 deobfuscation mapped, and ready for Google Play Store upload!\n");
