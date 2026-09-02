const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const commitFile = path.join(root, "latest.commit.txt");

const TITLE_RE = /^(feature|fix|refactor|chore|docs|style|test|ci|build)\s*\([a-z0-9]+(-[a-z0-9]+)*\):\s*.+$/;

function validateTitle() {
  if (!fs.existsSync(commitFile)) {
    console.error("[deploy] Missing latest.commit.txt at repository root.");
    process.exit(1);
  }
  const lines = fs.readFileSync(commitFile, "utf8").split(/\r?\n/);
  const title = lines.find((line) => line.trim() !== "")?.trim() ?? "";
  if (!TITLE_RE.test(title)) {
    console.error("[deploy] latest.commit.txt title does not match the required format.");
    console.error(`  Expected: ^(feature|fix|refactor|chore|docs|style|test|ci|build)\\s*\\(scope\\):\\s*message$`);
    console.error(`  Got:      ${title || "(empty)"}`);
    process.exit(1);
  }
}

function run(args) {
  console.log(`[deploy] git ${args.join(" ")}`);
  const result = spawnSync("git", args, { cwd: root, stdio: "inherit" });
  if (result.error) {
    console.error(`[deploy] Failed to run 'git ${args.join(" ")}': ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[deploy] 'git ${args.join(" ")}' exited with code ${result.status}`);
    process.exit(result.status);
  }
}

validateTitle();

run(["add", "."]);
run(["commit", "-F", "latest.commit.txt"]);
run(["push"]);

console.log("[deploy] Done.");
