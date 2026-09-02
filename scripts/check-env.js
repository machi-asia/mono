#!/usr/bin/env node
/**
 * Env verification script.
 * Compares every .env.sample against the corresponding .env.local.
 *
 * Checks (without printing secret values):
 *  - Keys present in .env.sample but MISSING from .env.local
 *  - Keys present in .env.local but NOT declared in .env.sample (new/legacy keys)
 *  - Keys whose value is empty/missing in .env.local or .env.sample
 *
 * Pairs are matched by file basename: `.env.sample` <-> `.env.local`.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function findEnvSamples(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
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
    const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    map.set(key, value);
  }
  return map;
}

function isPlaceholder(value) {
  if (!value) return true;
  const normalized = value.trim();
  // Whole-value placeholders: empty, all dashes/x/asterisks, or "<...>".
  if (/^[-_xX*]+$/.test(normalized)) return true;
  if (/^<.*>$/.test(normalized)) return true;
  // Token-based placeholders with clear identifiers (e.g. "your-supabase-url").
  if (/(^|[^a-z0-9])your(_|-| )/i.test(normalized)) return true;
  return /changeme|change[-_]me|replace[-_]me|placeholder|enter[-_ ]your|\.\.\./i.test(normalized);
}

const samples = findEnvSamples(ROOT);

let failed = false;
let totalMissingKeys = 0;
let totalMissingValues = 0;

for (const samplePath of samples) {
  const dir = path.dirname(samplePath);
  const localPath = path.join(dir, ".env.local");
  const sampleMap = parseEnv(samplePath);
  const localMap = parseEnv(localPath);

  if (!localMap) {
    console.error(`[env] MISSING .env.local in ${dir} — expected next to .env.sample`);
    failed = true;
    totalMissingKeys += sampleMap.size;
    continue;
  }

  const errors = [];

  for (const [key, sampleValue] of sampleMap) {
    if (!localMap.has(key)) {
      errors.push(`  - MISSING KEY: ${key}`);
      totalMissingKeys++;
    } else {
      const localValue = localMap.get(key);
      if (isPlaceholder(localValue)) {
        errors.push(`  - MISSING VALUE (still a placeholder/empty): ${key}`);
        totalMissingValues++;
      }
    }
  }

  for (const key of localMap.keys()) {
    if (!sampleMap.has(key)) {
      errors.push(`  - NOT DECLARED IN SAMPLE: ${key}`);
      failed = true;
    }
  }

  if (errors.length > 0) {
    console.error(`\n[env] ${path.relative(ROOT, samplePath)}`);
    errors.forEach((e) => console.error(e));
    failed = true;
  }
}

console.log("");
if (samples.length === 0) {
  console.warn("[env] No .env.sample files found — nothing to verify.");
  process.exit(0);
}

if (!failed) {
  console.log("[env] All sample keys present with values across all packages. OK.");
  process.exit(0);
}

console.error(`[env] FAILED — ${totalMissingKeys} missing key(s), ${totalMissingValues} missing/placeholder value(s).`);
process.exit(1);
