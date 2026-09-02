# Changelog

All notable changes to this monorepo will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.5.0] - 2026-09-02

### Added

- `ComponentShowcase` (in `@mono/components`) now renders **live interactive demos** with a **dropdown for every prop**:
  - New `ShowcaseItemPropControl` (`{ prop, label?, options, defaultValue? }`) and a `render(values)` API replacing the old static `demo` node. `ComponentShowcase` renders a `<select>` per control and re-invokes `render` with the selected values.
  - Backward-incompatible: `ShowcaseItem.demo` removed in favor of `render` + `propControls`; every showcase entry updated accordingly.
- `@mono/auth` `MockAuthProvider` (`@mono/auth/mock`) — a controlled auth-provider stand-in whose `state` prop (loading / signed-out / guest / signed-in) drives `AuthProvider`'s context for live demos; `AuthContext` is now exported for reuse.
- Docs showcase pages now render components live:
  - `apps/docs/src/app/components/auth/page.tsx` — live `AuthProvider`, `AuthGate`, `SignInModal` demos against `MockAuthProvider` with a mock auth-state dropdown (new `auth-showcase.tsx` + `auth-demo.css`).
  - `apps/docs/src/app/components/components/page.tsx` — live `ComponentShowcase` demo with a `packageName` dropdown (new `components-showcase.tsx`).
- `docs/adr/004-component-showcase-pages.md` updated, and the rule enforced in markdowns on every component create/update: `AGENTS.md` (rule 12), `CONTRIBUTING.md`, `DESIGN.md`, `README.md`, `docs/ARCHITECTURE.md` — every exported component must render live via `render(values)` with a `propControls` dropdown for every choice/enum prop.
- Tests: `ComponentShowcase` dropdown rendering + live re-render; `MockAuthProvider` driving `AuthGate`/`SignInModal`.

## [0.4.0] - 2026-09-02

### Added

- `@mono/components` `ComponentShowcase` — the shared reusable **list-view layout** that every package's component showcase page uses. Accepts a `packageName`, `description`, and a list of exported components (`name`, `uses`, `description`, optional `demo`).
- Showcase pages in the `apps/docs` app, one per package, listing all exported components via `ComponentShowcase`:
  - `apps/docs/src/app/components/auth/page.tsx` — `@mono/auth` (`AuthProvider`, `AuthGate`, `SignInModal`).
  - `apps/docs/src/app/components/components/page.tsx` — `@mono/components` (`ComponentShowcase`).
  - `apps/docs/src/app/components/database/page.tsx` — `@mono/database` (no UI components currently exported).
- Docs home page lists links to each package showcase.
- ADR-004: Component Showcase Pages.
- Convention enforced in markdowns: `AGENTS.md` (rule 12), `CONTRIBUTING.md`, `DESIGN.md`, `README.md`, `docs/ARCHITECTURE.md` — every package's exported components must be listed on its showcase page using `ComponentShowcase`.

## [0.3.0] - 2026-09-02

### Added

- `@mono/auth` `AuthGate` — client gate that renders the sign-in modal until a session exists.
- `@mono/auth` `SignInModal` — sign-in dialog with **no exit/cancel controls**: Google OAuth, email/password sign-in or register, and **Continue as Guest** (Supabase anonymous).
- `signInWithGoogle` auth method on `AuthProvider`.
- Guest detection corrected to use Supabase `user.is_anonymous`.
- `AuthProvider` + `AuthGate` wired into every app root layout (`machi-asia`, `rose`, `docs`) — no signed-out user can access any page.
- Real Supabase credentials placed in each app's `.env.local`.
- `@mono/auth` now includes `vitest` + `stylelint` tooling and tests for `AuthGate`.
- Docs app page documenting the auth components.
- `scripts/check-env.js` placeholder detection made precise (no longer flags URLs containing `xxx` as placeholders).

### Changed

- ADR-003 and `docs/ARCHITECTURE.md` updated for the mandatory `AuthProvider` + `AuthGate` requirement.
- `AGENTS.md` updated to require `AuthProvider` + `AuthGate` and describe the sign-in options.

### Fixed

- `@mono/auth`, `@mono/database`, and `@mono/components` now resolve from `src` TypeScript instead of a pre-built `dist`. Previously `next dev` could fail with `Module not found: Can't resolve '...dist/provider.js'` or `Can't resolve './auth-gate.css'` (the `tsc` build emitted JS that referenced a CSS file it never copied to `dist`, and stale `.next`/`dist` caches pointed Next at the broken output). No build step is required to consume the packages in the apps; stale `dist` and `.next` caches were removed.

## [0.2.0] - 2026-09-02

### Added

- Dev tooling for every app: `eslint`, `stylelint`, `typecheck`, `vitest`.
- Global `npm run test` runs all quality checks in parallel via Turborepo.
- Environment verification: `npm run env` compares `.env.local` against `.env.sample`.
- `.env.sample` files declaring Supabase env keys for all apps.
- `scripts/check-env.js` — script-based env check that never exposes secret values.

### Changed

- `npm run dev` at the repo root runs all apps and packages.
- Convention docs now require every env key to be declared in `.env.sample`.

## [0.1.0] - 2026-09-01

### Added

- Monorepo scaffolding with Turborepo.
- Next.js apps with placeholder pages: `machi-asia`, `rose`, `docs`.
- `apps/machi-asia` — Showcase and subscription billing hub.
- `apps/rose` — Custom AI agent application.
- `apps/docs` — Documentation site for components and user manuals.
- `packages/auth` — Centralized authentication package with Supabase Auth.
  - `AuthProvider` — Required by every app. Supports guest and authenticated users.
  - `useAuth` hook — Client-side auth state and methods.
  - Server client factory for Server Components and Route Handlers.
  - Middleware helper for route protection.
- `packages/database` — Centralized data/store package with Supabase.
  - Client and server client factories.
  - TypeScript database types.
- `packages/components` — Shared UI component library.
- Supabase integration: `@supabase/ssr`, `@supabase/supabase-js`.
- Documentation: `README.md`, `CONTRIBUTING.md`, `DESIGN.md`, `SECURITY.md`, `AGENTS.md`.
- Architecture docs: `docs/ARCHITECTURE.md`, `docs/API.md`.
- Architecture Decision Records: `docs/adr/`.
- `CHANGELOG.md` initialization.
