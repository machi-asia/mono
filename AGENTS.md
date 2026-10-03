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

### 2. Update `README.md` for every major feature change

Any change that adds, removes, or alters user-facing behavior or developer-facing
infrastructure (new workflows, new templates, new mandated toolchain, changed pipeline
stages, new sync mechanisms) requires a matching `README.md` update in the same change.

Excluded: pure styling tweaks and internal refactors with no behavioral surface.

### 3. Propagate canonical files to all repositories

Every repository in the org must carry this `AGENTS.md`, synced verbatim from this repo.
The scheduled/dispatch workflow `.github/workflows/sync-canonical-files.yml` also propagates
`templates/dependabot.yml` (as root `dependabot.yml`) and `.github/labels.yml` in the same run;
these three files are centrally managed — do not fork its logic into consumer repos, and do not
edit any of them outside this repo.

### 4. Shared Icon Library Standard (`lucide-react`)

All applications under `apps/` and packages under `packages/` MUST standardize on `lucide-react` as
the single canonical icon library across the organization.
- Do NOT install or introduce competing icon packages (e.g. `react-icons`, `@tabler/icons-react`,
  `@heroicons/react`, `font-awesome`, etc.).
- Ensure `lucide-react` is declared in workspace dependencies whenever icons are required.

### 5. Mandatory Skeleton Loading Components for Asynchronous Fetches

All components that load data from a `fetch` or database query MUST be replaced with a skeleton component (`<Skeleton>`, `<SkeletonText>`, `<SkeletonCard>`, `<SkeletonCircle>`, `<SkeletonButton>`) from `@mono/components` before load completes.
- Never leave a bare spinner, unstyled loading text, or blank layout container when loading asynchronous data.
- Ensure skeleton placeholders closely mimic the geometry, proportions, and visual rhythm of the loaded content.
