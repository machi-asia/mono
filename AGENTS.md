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

### 4. Enforce SEO standards on every app

Every public app in this repo (and every consumer repo with a public app) MUST follow the SEO
conventions defined in the canonical skill at `.agents/skills/seo/SKILL.md`:

- **Root `layout.tsx`** exports `Metadata` with `metadataBase`, `title.default` + `title.template`
  (`%s | <Brand>`), `description`, `keywords`, `openGraph`, `twitter`, and `alternates.canonical`.
- **`viewport`** export with `themeColor` set from the design system tokens (`#121212` dark-primary).
- **`robots.ts`** and **`sitemap.ts`** exist at `src/app/` in every public app; every indexable route
  appears in the sitemap.
- **Every page** that can be indexed exports its own `title` + `description` metadata (never
  duplicate the root default verbatim).
- **Keyword-rich copy is derived from each app's function and purpose**, per the per-app SEO strings
  in `.agents/skills/seo/SKILL.md` (calculator → factory/crafting keywords, rose → AI keywords, etc.).
- **`NEXT_PUBLIC_SITE_URL`** is declared in every public app's `.env.sample` and used as the single
  source of truth for `metadataBase`, OG URLs, canonical URLs, and sitemap URLs.

Do not merge a PR that adds or modifies a public page, changes root layout metadata, or renames an
app's branding without running the SEO checklist in `.agents/skills/seo/SKILL.md`.

### 5. Register skills in this repo

Skills live in `.agents/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`,
`metadata.version`) so any agent (opencode, Claude Code, Cursor, GitHub Copilot, etc.) can load
them. When you add a new skill, also add `.os/AGENTS.md`-style usage notes to `README.md` so other
agents discover it. SEO is enforced via `.agents/skills/seo/SKILL.md` — treat it as canonical and
update it whenever SEO rules evolve.
