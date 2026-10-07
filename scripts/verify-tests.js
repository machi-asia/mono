#!/usr/bin/env node

/**
 * Machi Asia - Monorepo Test Enforcement Script
 *
 * Verifies that:
 * 1. Every app and package in the workspace defines a valid "test" script (no "echo skip").
 * 2. Every app and package contains active `.test.ts`, `.test.tsx`, `.test.js`, or `.test.jsx` test files.
 * 3. Recent source code changes in git have corresponding test coverage / co-located test files.
 */

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const WORKSPACE_DIRS = ["apps", "packages"];

let hasErrors = false;

function error(msg) {
  console.error(`\x1b[31m[test:enforce] ERROR: ${msg}\x1b[0m`);
  hasErrors = true;
}

function success(msg) {
  console.log(`\x1b[32m[test:enforce] PASS: ${msg}\x1b[0m`);
}

function info(msg) {
  console.log(`\x1b[34m[test:enforce]\x1b[0m ${msg}`);
}

function findTestFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === "dist" ||
        entry.name === ".next" ||
        entry.name === "out" ||
        entry.name === ".turbo"
      ) {
        continue;
      }
      results.push(...findTestFiles(fullPath));
    } else if (
      /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(entry.name)
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

info("Auditing workspace test configurations and .test file presence...\n");

for (const wsDir of WORKSPACE_DIRS) {
  const base = path.join(root, wsDir);
  if (!fs.existsSync(base)) continue;

  const items = fs.readdirSync(base, { withFileTypes: true });
  for (const item of items) {
    if (!item.isDirectory()) continue;
    const pkgDir = path.join(base, item.name);
    const pkgJsonPath = path.join(pkgDir, "package.json");

    if (!fs.existsSync(pkgJsonPath)) {
      continue;
    }

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const pkgName = pkgJson.name || `${wsDir}/${item.name}`;

    // 1. Verify test script
    const testScript = pkgJson.scripts && pkgJson.scripts.test;
    if (!testScript) {
      error(`Package '${pkgName}' (${wsDir}/${item.name}) is missing a 'test' script in package.json!`);
    } else if (typeof testScript === "string" && (testScript.trim() === "echo skip" || testScript.includes("exit 0"))) {
      error(`Package '${pkgName}' is bypassing testing with dummy script: "${testScript}"!`);
    } else {
      success(`Package '${pkgName}' defines valid test runner: "${testScript}"`);
    }

    // 2. Verify .test file count
    const testFiles = findTestFiles(pkgDir);
    if (testFiles.length === 0) {
      error(
        `Package '${pkgName}' (${wsDir}/${item.name}) has 0 test files! Every workspace MUST include co-located *.test.ts/tsx files.`
      );
    } else {
      success(`Package '${pkgName}' contains ${testFiles.length} test file(s).`);
    }
  }
}

// 3. Check git status for modified source files without tests
info("\nChecking working tree for untested modified source modules...");
const gitStatus = spawnSync("git", ["status", "--porcelain"], {
  cwd: root,
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (gitStatus.stdout) {
  const lines = gitStatus.stdout.split(/\r?\n/).filter(Boolean);
  const changedFiles = lines.map((line) => line.slice(3).trim());

  const sourceFiles = changedFiles.filter((file) => {
    return (
      (file.startsWith("apps/") || file.startsWith("packages/")) &&
      /\.(ts|tsx)$/.test(file) &&
      !/\.(test|spec)\.(ts|tsx)$/.test(file) &&
      !file.endsWith(".d.ts") &&
      !file.includes("/types") &&
      !file.includes("/dist/")
    );
  });

  for (const src of sourceFiles) {
    const dir = path.dirname(src);
    const ext = path.extname(src);
    const base = path.basename(src, ext);

    const colocatedTest1 = path.join(dir, `${base}.test${ext}`);
    const colocatedTest2 = path.join(dir, `${base}.test.ts`);
    const colocatedTest3 = path.join(dir, `${base}.test.tsx`);
    const testsDirTest = path.join(dir, "__tests__", `${base}.test${ext}`);
    const testsDirTestTs = path.join(dir, "__tests__", `${base}.test.ts`);

    const hasTest =
      fs.existsSync(path.join(root, colocatedTest1)) ||
      fs.existsSync(path.join(root, colocatedTest2)) ||
      fs.existsSync(path.join(root, colocatedTest3)) ||
      fs.existsSync(path.join(root, testsDirTest)) ||
      fs.existsSync(path.join(root, testsDirTestTs));

    if (!hasTest) {
      // Check if package has general tests
      const pkgMatch = src.match(/^(apps|packages)\/([^/]+)/);
      if (pkgMatch) {
        const pkgPath = path.join(root, pkgMatch[1], pkgMatch[2]);
        const tests = findTestFiles(pkgPath);
        if (tests.length === 0) {
          error(`Modified source file '${src}' has no test coverage in package '${pkgMatch[2]}'`);
        }
      }
    }
  }
}

console.log("\n==========================================");
if (hasErrors) {
  console.error("  Test Enforcement Check: FAILED");
  console.error("  Please ensure all packages and modules have active .test files.");
  console.error("==========================================\n");
  process.exit(1);
} else {
  console.log("  Test Enforcement Check: PASSED");
  console.log("==========================================\n");
  process.exit(0);
}
