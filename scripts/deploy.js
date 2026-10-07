const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const commitFile = path.join(root, "latest.commit.txt");

const TITLE_RE = /^(feature|fix|refactor|chore|docs|style|test|ci|build)\s*\([a-z0-9]+(-[a-z0-9]+)*\):\s*.+$/;

function runCmd(cmd, args, options = {}) {
  const display = `${cmd} ${args.join(" ")}`;
  console.log(`[deploy] > ${display}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: options.stdio || "inherit",
    encoding: "utf8",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.error) {
    console.error(`[deploy] Error executing '${display}':`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0 && !options.allowFailure) {
    console.error(`[deploy] Command failed with exit code ${result.status}: ${display}`);
    process.exit(result.status || 1);
  }

  return result;
}

function previousCommitSubject() {
  const result = spawnSync("git", ["log", "-1", "--pretty=%s"], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  return (result.stdout && result.stdout.trim()) || "";
}

function getCurrentBranch() {
  const result = spawnSync("git", ["branch", "--show-current"], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  return (result.stdout && result.stdout.trim()) || "main";
}

function hasWorkingTreeChanges() {
  const result = spawnSync("git", ["status", "--porcelain"], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  return Boolean(result.stdout && result.stdout.trim().length > 0);
}

function ensureCommitMessage() {
  if (!fs.existsSync(commitFile)) {
    fs.writeFileSync(
      commitFile,
      `chore(deploy): build and sync all repositories and mobile platforms\n\n- deploy: automated build and sync run\n`,
      "utf8"
    );
  }

  const raw = fs.readFileSync(commitFile, "utf8");
  const lines = raw.split(/\r?\n/);
  const title = lines.find((line) => line.trim() !== "")?.trim() ?? "";

  if (!TITLE_RE.test(title)) {
    console.log("[deploy] latest.commit.txt title does not match convention. Generating default commit message...");
    const defaultMsg = `chore(repo): update applications, build web assets, and sync mobile platforms\n\n- deploy: automated build, sync, and push\n`;
    fs.writeFileSync(commitFile, defaultMsg, "utf8");
  } else {
    const previous = previousCommitSubject();
    if (previous && title === previous) {
      const updatedTitle = `${title} (update)`;
      const newBody = raw.replace(title, updatedTitle);
      fs.writeFileSync(commitFile, newBody, "utf8");
    }
  }
}

console.log("\n==========================================");
console.log("  Machi Asia - Unified Deploy Pipeline");
console.log("==========================================\n");

const branch = getCurrentBranch();

// 1. Fetch & Rebase to keep local in sync with remote
console.log(`[deploy] Syncing remote changes from 'origin/${branch}'...`);
runCmd("git", ["pull", "--rebase", "origin", branch], { allowFailure: true });

// 2. Build Stage
console.log("\n[deploy] Step 1/3: Building web and mobile packages...");
runCmd("npx", ["turbo", "build"]);
runCmd("npx", ["turbo", "build:mobile"]);

// 3. Sync Stage
console.log("\n[deploy] Step 2/3: Syncing all Capacitor mobile repositories...");
runCmd("npx", ["turbo", "cap:sync"]);

// 4. Git Stage (Auto Commit & Push)
console.log("\n[deploy] Step 3/3: Checking git state, committing and pushing...");
const hasChanges = hasWorkingTreeChanges();

if (hasChanges) {
  ensureCommitMessage();
  console.log("[deploy] Staging all changes...");
  runCmd("git", ["add", "."]);

  console.log("[deploy] Committing changes with latest.commit.txt...");
  runCmd("git", ["commit", "-F", "latest.commit.txt"]);

  // Clear latest.commit.txt per Organization Duty #1
  fs.writeFileSync(commitFile, "", "utf8");
  runCmd("git", ["add", "latest.commit.txt"], { allowFailure: true });
  runCmd("git", ["commit", "--amend", "--no-edit"], { allowFailure: true });
  console.log("[deploy] Cleared latest.commit.txt after successful commit.");
} else {
  console.log("[deploy] Working tree is clean (no uncommitted file modifications).");
}

// Push to remote repository
console.log(`[deploy] Pushing commits to remote branch '${branch}'...`);
const pushResult = runCmd("git", ["push"], { allowFailure: true });

if (pushResult.status !== 0) {
  console.log(`[deploy] Push rejected. Pulling remote rebase and retrying...`);
  runCmd("git", ["pull", "--rebase", "origin", branch]);
  runCmd("git", ["push", "-u", "origin", branch]);
}

console.log("\n==========================================");
console.log("  Deploy Pipeline Completed Successfully!");
console.log("==========================================\n");
