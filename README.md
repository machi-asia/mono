# Machi Asia Monorepo

Turborepo-based monorepo for all Machi Asia applications and shared packages.

## Apps

| App | Description |
|-----|-------------|
| `api` | Centralized API microservice, interactive API Explorer playground (`/`), realtime SSE sync hub, and organizational usage tracking |
| `machi-asia` | Home site — showcase and subscription billing hub for all Machi Asia products |
| `rose` | Custom AI companion application |
| `calculator` | Multi-game production calculator with interactive recipe tree graph (styled throughput edge labels) and factory rate planner, a sortable item catalog (name/category carets) in gallery or list view, and per-item last-updated tracking |
| `docs` | Documentation site — developer knowledge base, wiki articles, ADRs, component library showcases, and user manuals |
| `hells-forge` | High-performance 2D multiplayer exploration space powered by Pixi.js, spatial circle collisions, WASD movement, and `@mono/sync` |

## Packages

| Package | Description |
|---------|-------------|
| `api-client` | Typed API client SDK configured via `NEXT_PUBLIC_API_URL` for communicating with `apps/api` |
| `auth` | Centralized authentication via Supabase — auth provider, session management, middleware, data & privacy registry |
| `database` | Centralized data/store via Supabase — client creation, types, queries |
| `components` | Shared UI components + design system — tokens, theme, layout primitives (`Row`/`Col`/`Card`), and functional elements |
| `rose` | Client UI components, voice mode overlay, settings modals, and usage bars for Rose AI companion |
| `sync` | Realtime input dressing (`dressSyncFunction`), action registry, and WebRTC/SSE client transports |

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
- **All apps and packages use `lucide-react`** as the single canonical icon library. No competing icon packages (e.g. `react-icons`, `@tabler/icons-react`, `@heroicons/react`) are permitted.
- **Follow the design system** (`DESIGN.md`): token-based colors, dark-primary/gold theming via `next-themes`, generous whitespace, subtle motion, and layout/functional primitives used strictly from `@mono/components`.
- **Profile & Identity Management**: Users can manually customize their display name and switch between active profile pictures from any of their linked authentication providers (Google, GitHub, Discord, Twitter, Facebook, generated initials, or custom URL) in `@mono/auth` (accessible via Account Settings > Profile).
- **Linked Provider Account Swapping**: Linked third-party authentication accounts can be swapped or unlinked seamlessly directly within the Linked Providers security management panel.
- **Data & Privacy Registry**: Every application collecting user data must register it in the centralized Data & Privacy registry in `@mono/auth` (accessible via Account Settings > Data & Privacy), detailing what is collected, why it is used, and whether it is Required or Optional (with interactive user controls for optional telemetry).
- **Mandatory Documentation Wiki Reporting**: Every significant change across the organization (new architecture patterns, modified public APIs, ADRs, new deployable applications, and policy changes) must be documented in the centralized **Documentation Wiki** (`/docs` / `apps/docs/src/data/wiki-articles.ts`).
- **Release Tracking (`latest.release.txt`)**: All application release versions, release names, platform targets, and version updates are persistently tracked in per-directory `latest.release.txt` files (`apps/<app>/latest.release.txt`) and at the root.
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
npm run dev -w @mono/api
npm run dev -w @mono/machi-asia
npm run dev -w @mono/rose
npm run dev -w @mono/calculator-app
npm run dev -w @mono/docs
npm run dev -w @mono/hells-forge

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

## Mobile & Over-The-Air (OTA) Updates

All client-facing applications (`calculator`, `docs`, `hells-forge`, `machi-asia`, `rose`) support hybrid distribution on both Web and Android (Google Play Store) via **Capacitor** and **Capgo**.

### Android Package Identifiers
- **Calculator**: `asia.machi.calculator`
- **Docs**: `asia.machi.docs`
- **Hell's Forge**: `asia.machi.hellsforge`
- **Machi Asia Portal**: `asia.machi.portal`
- **Rose AI**: `asia.machi.rose`

### Mobile Build & Sync Workflow

```bash
# 1. Build static export for mobile
npm run build:mobile -w @mono/calculator-app

# 2. Sync web assets and plugins with the native Android project
npm run cap:sync -w @mono/calculator-app

# 3. Generate Android App Bundle (.aab) binaries for Google Play Store across apps
npm run bundle:android

# 4. Or open a specific project in Android Studio (for manual signing / emulator run)
npm run cap:open:android -w @mono/calculator-app
```

### Live Updates (OtaKit) & OTA Progress Notification
- Live OTA updates are distributed seamlessly via `@otakit/capacitor-updater`.
- The organization-standard `<OtaUpdateNotifier />` component from `@mono/components` is mounted in the root layout of every client app.
- During active update downloads, a sleek top glassmorphism pill displays real-time status and installation notifications, automatically dismissing once the update bundle is verified and ready.
- **Automated CI/CD**: The `.github/workflows/otakit-ota.yml` workflow automatically builds and uploads OTA bundles to OtaKit upon pushes to `main` (requires `OTAKIT_TOKEN` in GitHub repository secrets).
- **Manual / Local CLI Deploy**: Run `npm run deploy:ota` to build and upload OTA bundles directly from your local terminal.


## Project Structure

```
mono/
├── apps/
│   ├── api/            # Centralized API service & Interactive Explorer (Next.js)
│   ├── calculator/     # Multi-game production calculator (Next.js)
│   ├── docs/           # Documentation site (Next.js)
│   ├── hells-forge/    # Multiplayer 2D sandbox (Next.js)
│   ├── machi-asia/     # Showcase + billing hub (Next.js)
│   └── rose/           # Custom AI agent companion (Next.js)
├── packages/
│   ├── api-client/     # Standardized typed API client
│   ├── auth/           # Authentication & privacy registry (pure components/hooks)
│   ├── components/     # Shared UI components & design system tokens
│   ├── database/       # Data/store layer & type definitions
│   ├── rose/           # Rose AI client components & speech utils
│   └── sync/           # Realtime DRESS input & client transports
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
