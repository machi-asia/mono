# Machi Asia Monorepo

Turborepo-based monorepo for all Machi Asia applications and shared packages.

## Apps

| App | Description |
|-----|-------------|
| `machi-asia` | Home site — showcase and subscription billing hub for all Machi Asia products |
| `rose` | Custom AI agent application |
| `calculator` | Multi-game production calculator with interactive recipe tree graph (styled throughput edge labels) and factory rate planner, a sortable item catalog (name/category carets) in gallery or list view, and per-item last-updated tracking |
| `docs` | Documentation site — component library docs and user manuals |

## Packages

| Package | Description |
|---------|-------------|
| `auth` | Centralized authentication via Supabase — auth provider, session management, middleware |
| `database` | Centralized data/store via Supabase — client creation, types, queries |
| `components` | Shared UI components + design system — tokens, theme, layout primitives (`Row`/`Col`/`Card`), and functional elements |

## Conventions

- **All apps and packages are Next.js-based.**
- **Packages export components, functions, and more** — no page routes, no business logic outside packages.
- **`/packages/auth`** owns all authentication (Supabase Auth).
- **`/packages/database`** owns all data access and state (Supabase Database/Storage).
- **Every app must use the `AuthProvider`** from `/packages/auth`. Users must be logged in (guest or authenticated) to access any website.
- **Every app must have these tools**: `eslint`, `stylelint`, `typecheck`, `vitest`.
- **`.env.sample` files** must list every env key used by an app/package. Every time code references an env key, it must be added to the corresponding `.env.sample`.
- **`npm run env`** verifies `.env.local` against `.env.sample` (checks missing keys and missing/placeholder values).
- **`/docs` app** must document every component exported from `/packages/components`.
- **SEO standards** are enforced on every public app via the canonical `.agents/skills/seo/SKILL.md` — every app exports rich `Metadata` + `viewport` (metadataBase, OG, Twitter, canonical), plus `robots.ts` and `sitemap.ts`. `NEXT_PUBLIC_SITE_URL` drives `metadataBase`, OG/canonical/sitemap URLs.
- **Every package's exported components** must be rendered live on that package's showcase page (`/components/<package>` in the docs app) using the shared `ComponentShowcase` list-view layout from `@mono/components`. Each component renders the actual component via `render(values)` and declares a `propControls` dropdown for every choice/enum prop.
- **`/docs/adr`** must be updated with an Architecture Decision Record for every significant technical decision.
- **Follow the design system** (`DESIGN.md`): token-based colors, dark-primary/gold theming via `next-themes`, generous whitespace, subtle motion, and layout/functional primitives used strictly from `@mono/components`.
- **All `.md` files** in the repo must be kept up to date as the project evolves.
- **Any code change** must also update the relevant documentation files.

## Skills

Agent skills live in `.agents/skills/<name>/SKILL.md` (YAML frontmatter: `name`, `description`,
`metadata.version`) and are loadable by any agent runtime (opencode, Claude Code, Cursor, GitHub
Copilot). Load a skill whenever the task matches its description.

| Skill | When to load |
|-------|--------------|
| `seo` | Editing any SEO surface — `layout.tsx` metadata, `robots.ts`, `sitemap.ts`, OG/Twitter tags, canonical URLs, or .md rules governing SEO. Canonical source of per-app SEO strings and the mandatory SEO checklist. |
| `supabase` | Any task involving Supabase — database, auth, edge functions, storage, CLI, MCP, debugging, or RLS. |
| `supabase-postgres-best-practices` | Writing or changing anything in Postgres — schema design, migrations, RLS policies, triggers, indexes, slow-query diagnostics. |

## Quality Checks

Run all quality checks in one command:

```bash
npm run test
```

This runs `lint`, `lint:style`, `typecheck`, and `test` (vitest) in parallel across all apps and packages via Turborepo. Individual scripts per app:

| Script | Tool | Purpose |
|--------|------|---------|
| `lint` | ESLint | Lint TypeScript/JS + Next.js rules |
| `lint:style` | Stylelint | Lint CSS |
| `typecheck` | TypeScript | Type-check without emitting |
| `test` | Vitest | Run unit/component tests |
| `test:watch` | Vitest | Run tests in watch mode |

## Environment Verification

```bash
npm run env
```

This compares every `.env.sample` against the sibling `.env.local` and reports:
- Keys present in `.env.sample` but missing from `.env.local` (missing keys).
- Keys whose value is empty or still a placeholder in `.env.local` (missing values).

It never prints secret/actual values — it only reports key names and status. `npm run env` is script-based and must pass before code changes are committed.

Each app and package that uses environment variables must maintain a `.env.sample` that declares every key its code references. When you add a new env key to code, add it to `.env.sample` too.

### Consolidated `.env` (`npm run global-env`)

```bash
npm run global-env
```

Compiles every app's environment into a single `.env` at the repo root: key names and values come from each app's `.env.local` (falling back to `.env.sample`), and the output is grouped into a **CONFIG** section (non-secret keys — `NEXT_PUBLIC_*`, publishable keys, URLs, models, limits) and a **SECRET** section (credentials and API keys). Duplicate keys shared across apps are emitted once with an `# Apps:` annotation; conflicting values across apps are reported on the console without printing their values. The generated `.env` is gitignored and should never be committed.

## Getting Started

```bash
# Install dependencies
npm install

# Run a specific app in dev mode
npm run dev -w @mono/machi-asia
npm run dev -w @mono/rose
npm run dev -w @mono/calculator-app
npm run dev -w @mono/docs

# Build all apps and packages
npm run build

# Lint all packages
npm run lint
```

Each app requires a `.env.local` with Supabase credentials (copy from `.env.sample`):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

> **Canonical Supabase project:** `https://zyatzdkapdqngwyhiqqn.supabase.co`. All migrations, DDL, edge functions, and data changes must target this project only. `NEXT_PUBLIC_SUPABASE_URL` must resolve to this URL; if a connected tool or agent points to a different project, correct it before applying any schema or data change.

## Project Structure

```
mono/
├── apps/
│   ├── calculator/     # Multi-game production calculator (Next.js)
│   ├── docs/           # Documentation site (Next.js)
│   ├── machi-asia/     # Showcase + billing hub (Next.js)
│   └── rose/           # Custom AI agent (Next.js)
├── packages/
│   ├── auth/           # Authentication
│   ├── components/     # Shared UI components
│   └── database/       # Data/store layer
├── docs/
│   ├── adr/            # Architecture Decision Records
│   ├── API.md          # API documentation conventions
│   ├── ARCHITECTURE.md # Architecture overview
│   └── user-manual/    # User-facing documentation (per app)
├── AGENTS.md           # AI agent instructions
├── CONTRIBUTING.md     # Contribution guidelines
├── DESIGN.md           # Design principles
├── SECURITY.md         # Security policies
└── CHANGELOG.md        # Version history
```

## License

See [LICENSE](./LICENSE) for details.
