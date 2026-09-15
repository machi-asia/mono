#!/usr/bin/env node
/**
 * global-env — compile every app's environment into a single root `.env`.
 *
 * Scans the repo for `.env.sample` files (the committed key declarations),
 * reads the real values from each sibling `.env.local` when present, and
 * writes one consolidated `.env` at the repo root grouped into two sections:
 *   - CONFIG  — non-secret keys (NEXT_PUBLIC_*, publishable keys, URLs,
 *               model names, limits, feature flags, …)
 *   - SECRET  — credentials and API keys
 *
 * Keys shared across several apps with identical values are emitted once
 * with an `Apps:` annotation; conflicting values are reported on the console
 * (never printed) and the first occurrence wins.
 *
 * Never prints or logs secret values.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, ".env");

function findEnvSampleFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === ".next" ||
      entry.name === ".turbo" ||
      entry.name === "dist"
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findEnvSampleFiles(full));
    } else if (entry.name === ".env.sample") {
      results.push(full);
    }
  }
  return results;
}

function parseEnv(file) {
  if (!fs.existsSync(file)) return new Map();
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

/** Decorative ruler / DESIGN.md section separator, e.g. "# ====..." or "# Config Keys (…)" */
function isSectionComment(line) {
  const body = line.slice(1).trim();
  if (/^[-=_*~]{4,}\s*$/.test(body)) return true;
  if (/^(Non-Config Keys|Configuration Keys|Config Keys)/i.test(body)) return true;
  return false;
}

/**
 * Build ordered list of { key, value, comments } for a sample file, carrying
 * the non-section comment lines that precede each key, and values sourced
 * from the sibling `.env.local` when available.
 */
function readScope(samplePath) {
  const localPath = path.join(path.dirname(samplePath), ".env.local");
  const localMap = parseEnv(localPath);
  const sampleLines = fs.readFileSync(samplePath, "utf8").split(/\r?\n/);

  const entries = [];
  let pendingComments = [];

  for (const rawLine of sampleLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      pendingComments = [];
      continue;
    }
    if (trimmed.startsWith("#")) {
      if (!isSectionComment(trimmed)) pendingComments.push(trimmed.replace(/^#\s*/, ""));
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const sampleValue = trimmed.slice(eq + 1).trim();
    const value = localMap.has(key) ? localMap.get(key) : sampleValue;
    entries.push({ key, value, comments: pendingComments });
    pendingComments = [];
  }

  return entries;
}

function isSecretKey(key) {
  // Publishable / client-exposed keys are config, not secrets.
  if (/(NEXT_PUBLIC|PUBLISHABLE|_PUBLIC_)/.test(key)) return false;
  if (/(SECRET|PASSWORD|TOKEN|PRIVATE|CREDENTIAL)/i.test(key)) return true;
  // Explicit credential-ish suffixes: *_KEY, *_API_KEY, KEY (bare).
  if (/(^|_)(API_)?KEY$/.test(key)) return true;
  return false;
}

function formatValue(value) {
  const needsQuotes = /[\s#]/.test(value) || value === "";
  if (!needsQuotes) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

const samples = findEnvSampleFiles(ROOT);
const scopes = samples
  .sort()
  .map((samplePath) => ({
    label: path.relative(ROOT, path.dirname(samplePath)).split(path.sep).join("/") || ".",
    entries: readScope(samplePath),
  }));

const byKey = new Map();
const conflicts = [];

for (const scope of scopes) {
  for (const entry of scope.entries) {
    if (byKey.has(entry.key)) {
      const seen = byKey.get(entry.key);
      seen.scopes.push(scope.label);
      if (seen.value !== entry.value) {
        conflicts.push(
          `${entry.key} = ${formatValue(seen.value)} (${seen.scopes[0]}) vs ${formatValue(entry.value)} (${scope.label})`
        );
      }
    } else {
      byKey.set(entry.key, { ...entry, scopes: [scope.label] });
    }
  }
}

const unique = [...byKey.values()];

const renderSection = (title, subtitle, entries) => {
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.scopes[0])) groups.set(entry.scopes[0], []);
    groups.get(entry.scopes[0]).push(entry);
  }

  const blocks = [];
  for (const [scopeLabel, groupEntries] of groups) {
    const lines = [`## ${scopeLabel}`];
    for (const entry of groupEntries) {
      for (const comment of entry.comments) lines.push(`# ${comment}`);
      const shared = entry.scopes.filter((s) => s !== entry.scopes[0]);
      if (shared.length > 0) lines.push(`# Apps: ${shared.join(", ")}`);
      lines.push(`${entry.key}=${formatValue(entry.value)}`);
      lines.push("");
    }
    blocks.push(lines.join("\n"));
  }

  return [
    `# ${"=".repeat(78)}`,
    `# ${title}`,
    `# ${subtitle}`,
    `# ${"=".repeat(78)}`,
    "",
    ...blocks,
  ].join("\n");
};

const configEntries = unique.filter((e) => !isSecretKey(e.key));
const secretEntries = unique.filter((e) => isSecretKey(e.key));

const output = [
  "# Global environment — compiled from every app env sample/.env.local.",
  "# Generated by `npm run global-env`. Do not edit by hand; re-run the script.",
  `# Sources: ${scopes.map((s) => s.label).join(", ")}.`,
  "",
  renderSection(
    "CONFIG  /  non-secret settings (safe to expose)",
    "Public keys, URLs, models, tiers, limits and feature flags.",
    configEntries
  ),
  "",
  renderSection(
    "SECRET  /  credentials and API keys (never expose, never commit)",
    "Server-side values only. Read from the gitignored .env.local files.",
    secretEntries
  ),
  "",
].join("\n");

fs.writeFileSync(OUTPUT, output, "utf8");

console.log(`[global-env] Wrote ${path.relative(ROOT, OUTPUT)}`);
console.log(
  `[global-env] ${unique.length} unique keys ${configEntries.length} config + ${secretEntries.length} secret from ${scopes.length} scope(s).`
);
if (conflicts.length > 0) {
  console.warn(`[global-env] ${conflicts.length} conflicting value(s) across apps (first occurrence wins):`);
  for (const line of conflicts) {
    console.warn(`  - ${line}`);
  }
}