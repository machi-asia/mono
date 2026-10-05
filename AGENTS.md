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

### 6. Data & Privacy Collection Registry Enforcement

Every application under `apps/` and package under `packages/` that collects, processes, transmits, or stores user data MUST declare that data collection in the centralized **Data & Privacy** registry (`@mono/auth` Account Settings / Data & Privacy modal).
- **Mandatory Disclosures**: Each entry must clearly specify:
  1. The specific data collected (e.g. email, companion conversation history, calculation graphs, performance telemetry).
  2. The exact purpose / what it is being used for (e.g. session authentication, AI response context, factory state synchronization, diagnostic logging).
  3. Requirement level: explicitly classify whether the collection is **Required** (strictly necessary for core operation) or **Optional** (enhancement/analytics).
  4. Interactive user control: Any optional collection MUST provide an accessible user opt-in/opt-out toggle with persistent preference state.
- **Never collect untracked user data**: Introducing new telemetry, analytics pings, cloud data saves, or tracking without registering it in the Data & Privacy registry and updating privacy documentation is strictly prohibited.

### 7. Mandatory Reporting of Significant Changes in the `/docs` Wiki

Every significant change across the organization — including new architectural patterns, altered public package interfaces, new deployable applications, ADR additions, and organization policy updates — MUST be documented in the centralized **Documentation Wiki** (`/docs`, backed by `apps/docs/src/data/wiki-articles.ts` and `docs/`).
- **Mandatory Requirements**:
  1. Add or update the relevant article in `apps/docs/src/data/wiki-articles.ts` with accurate metadata (title, category, tags, read time, author, and updated timestamp).
  2. Keep matching markdown documentation under `docs/` (`docs/ARCHITECTURE.md`, `docs/API.md`, `docs/adr/`, etc.) in sync.
  3. Ensure all code blocks specify valid language identifiers (`tsx`, `ts`, `json`, `bash`, `sql`, `css`) to guarantee syntax color coding.
- **Never ship undocumented features or architectural changes**: Introducing structural changes, public APIs, new package components, or service behaviors without registering them in the `/docs` wiki is strictly prohibited.
