#!/usr/bin/env node
/**
 * Env synchronization and verification script.
 * Synchronizes every .env.local to match its corresponding .env.sample
 * in exact format, comments, and key order, while preserving existing values.
 *
 * Checks (without printing secret values):
 *  - Keys whose values are still placeholders or empty.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function findEnvSamples(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findEnvSamples(full));
    } else if (entry.name === ".env.sample") {
      results.push(full);
    }
  }
  return results;
}

function parseEnv(file) {
  if (!fs.existsSync(file)) return null;
  const map = new Map();
  const text = fs.readFileSync(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    map.set(key, value);
  }
  return map;
}

function isPlaceholder(value) {
  if (!value) return true;
  const normalized = value.trim().replace(/^["']|["']$/g, "");
  if (!normalized) return true;
  // Whole-value placeholders: empty, all dashes/x/asterisks, or "<...>".
  if (/^[-_xX*]+$/.test(normalized)) return true;
  if (/^<.*>$/.test(normalized)) return true;
  // Token-based placeholders with clear identifiers (e.g. "your-supabase-url").
  if (/(^|[^a-z0-9])your(_|-| )/i.test(normalized)) return true;
  return /changeme|change[-_]me|replace[-_]me|placeholder|enter[-_ ]your|\.\.\./i.test(normalized);
}

function syncEnvLocal(samplePath, localPath) {
  const sampleContent = fs.readFileSync(samplePath, "utf8");
  const localMap = parseEnv(localPath) || new Map();

  const sampleLines = sampleContent.split(/\r?\n/);
  const newLocalLines = [];

  for (const rawLine of sampleLines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      newLocalLines.push(rawLine);
      continue;
    }
    const eqIndex = rawLine.indexOf("=");
    if (eqIndex === -1) {
      newLocalLines.push(rawLine);
      continue;
    }
    const key = rawLine.slice(0, eqIndex).trim();
    const sampleVal = rawLine.slice(eqIndex + 1).trim();

    if (localMap.has(key)) {
      const existingVal = localMap.get(key);
      newLocalLines.push(`${key}=${existingVal}`);
    } else {
      newLocalLines.push(`${key}=${sampleVal}`);
    }
  }

  const finalContent = newLocalLines.join("\n") + (sampleContent.endsWith("\n") ? "" : "\n");
  fs.writeFileSync(localPath, finalContent, "utf8");
}

const samples = findEnvSamples(ROOT);

if (samples.length === 0) {
  console.warn("[env] No .env.sample files found — nothing to verify.");
  process.exit(0);
}

let failed = false;
let totalMissingValues = 0;

for (const samplePath of samples) {
  const dir = path.dirname(samplePath);
  const localPath = path.join(dir, ".env.local");

  // Synchronize .env.local with .env.sample structure & key order
  syncEnvLocal(samplePath, localPath);

  const sampleMap = parseEnv(samplePath);
  const localMap = parseEnv(localPath);
  const relativeSample = path.relative(ROOT, samplePath);
  const relativeLocal = path.relative(ROOT, localPath);

  const warnings = [];

  for (const [key] of sampleMap) {
    const localValue = localMap.get(key);
    if (isPlaceholder(localValue)) {
      warnings.push(`  - PLACEHOLDER VALUE: ${key}`);
      totalMissingValues++;
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n[env] Synced ${relativeLocal} with ${relativeSample} (action required):`);
    warnings.forEach((w) => console.warn(w));
    failed = true;
  } else {
    console.log(`[env] Synced & verified ${relativeLocal} (matches ${relativeSample}). OK.`);
  }
}

console.log("");
if (!failed) {
  console.log("[env] All .env.local files matched with .env.sample and populated with values. OK.");
  process.exit(0);
} else {
  console.warn(`[env] Sync complete with ${totalMissingValues} placeholder value(s) requiring your configuration.`);
  process.exit(0);
}
