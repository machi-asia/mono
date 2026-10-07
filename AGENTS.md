# Agent Instructions

This is the organization-level `.github` repository for **machi-asia**. It owns the shared
issue/PR templates, label manifest, reusable CI/CD workflows, composite actions, and the
canonical `AGENTS.md` that every repository in the org must carry.

## Mandatory Duties

### 1. Keep `latest.commit.txt` in sync with uncommitted work

Whenever this working tree contains uncommitted changes, `latest.commit.txt` MUST be updated
to describe ALL of them before a task or session ends.

- Base it strictly on the current uncommitted diff (`git status` + `git diff`) against HEAD.
- Format: the first line (title) MUST match
  `^(feature|fix|refactor|chore|docs|style|test|ci|build)\s*\([a-z0-9]+(-[a-z0-9]+)*\):\s*.+$`
  — choose the type closest to the dominant nature of the pending changes and a kebab-case
  scope naming the affected area. Below it, add one bullet per notable change
  (`- <area>: what changed and why`).
- Regenerate it from scratch every time; never append stale entries.
- Once everything is committed and the tree is clean, empty the file.

### 2. Maintain per-directory `latest.release.txt` for application release versions

`latest.release.txt` is maintained in the root directory and within every application directory (`apps/<app>/latest.release.txt`) to track, summarize, and preserve all release notes, release names, and version updates across `apps/`.

- Unlike `latest.commit.txt` (which is emptied when the working tree is clean), `latest.release.txt` is persistent and MUST never be emptied.
- Whenever an application release version is prepared or deployed, `latest.release.txt` in each affected app directory (and root manifest) MUST be updated.
- Format: every `latest.release.txt` MUST include the **Release Name** (e.g. `Release Name: v1.0.0 - Genesis Release`), metadata (Date, App, Platforms, Package ID, Capgo Channel), and an **Updates** section strictly limited to concise, store-compliant release notes (2-4 bullet points, under 500 characters for Google Play Store `en-US` limits).

### 3. Update `README.md` for every major feature change

Any change that adds, removes, or alters user-facing behavior or developer-facing
infrastructure (new workflows, new templates, new mandated toolchain, changed pipeline
stages, new sync mechanisms) requires a matching `README.md` update in the same change.

Excluded: pure styling tweaks and internal refactors with no behavioral surface.

### 4. Propagate canonical files to all repositories

Every repository in the org must carry this `AGENTS.md`, synced verbatim from this repo.
The scheduled/dispatch workflow `.github/workflows/sync-canonical-files.yml` also propagates
`templates/dependabot.yml` (as root `dependabot.yml`) and `.github/labels.yml` in the same run;
these three files are centrally managed — do not fork its logic into consumer repos, and do not
edit any of them outside this repo.
