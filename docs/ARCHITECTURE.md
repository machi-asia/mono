# Architecture

Overview of the Machi Asia monorepo architecture.

## Monorepo Layout

This is a Turborepo monorepo with npm workspaces. All applications and packages live under a single repository.

```
mono/
├── apps/           # Deployable applications (Next.js)
├── packages/       # Shared code (components, auth, database)
├── docs/           # Architecture docs, ADRs, user manuals
└── turbo.json      # Turborepo pipeline configuration
```

## Applications

### machi-asia

The home site for Machi Asia products. Serves as the showcase page and subscription billing hub. Users land here to discover and subscribe to other Machi Asia products.

**Stack:** Next.js, React, TypeScript

### rose

A custom AI agent application. Provides conversational AI capabilities with custom behavior.

**Stack:** Next.js, React, TypeScript

### docs

The documentation site. Houses component documentation for `/packages/components` and user manuals for each app.

**Stack:** Next.js, React, TypeScript

## Packages

### auth (`/packages/auth`)

Centralized authentication. All login, logout, session management, token handling, and auth middleware lives here. No other package or app implements auth logic.

Export surface:

- `AuthProvider` — React context provider. Tracks `user`, `session`, `isLoading`, `isGuest`.
- `AuthGate` — Client component that renders `<SignInModal />` until a session exists, then renders children. **Every app must wrap its root layout content in `AuthProvider` + `AuthGate`** so no page is reachable without signing in (as a guest or an authenticated user).
- `SignInModal` — Sign-in dialog with **no exit/cancel controls**. Offers: Continue with Google, email/password sign in or register, and **Continue as Guest** (Supabase anonymous session).
- `createClient`, `useAuth`, and auth hooks (`signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `signInAsGuest`, `signOut`).
- `server` / `middleware` — server-side client and `updateSession` helpers, used for SSR flows.

### database (`/packages/database`)

Centralized data and store layer. All database queries, schemas, models, and state management logic lives here. Apps and other packages import from this package to access data.

### components (`/packages/components`)

Shared UI component library. Exports React components only (`<>`). No server functions, no business logic, no API routes. Components are documented in the `docs` app.

This package is also the **single source of truth for the design system** (see `DESIGN.md` and `ADR-005`):
- design tokens (CSS custom properties, dark-primary/gold) and `ThemeProvider` (next-themes) for theme switching;
- layout primitives — `Row`, `Col`, `Card` — and any functional elements (date/time pickers, etc.) that apps must consume rather than hand-roll;
- `ComponentShowcase` — the shared **list-view layout** that every package's component showcase page uses (see "Component Showcases" below).

## Component Showcases

Every package that exports components must have a showcase `page.tsx` in the `apps/docs` app that renders each of that package's exported components **live** in a list view. The listing layout and interactive prop-dropdowns are provided by the shared `ComponentShowcase` component from `@mono/components`.

- Location: `apps/docs/src/app/components/<package>/page.tsx` (e.g. `.../components/auth/page.tsx`).
- Each showcase page passes `ComponentShowcase` a `packageName`, a short `description`, and the array of exported `components`.
- Each component entry must provide:
  - `render(values)` — a function that renders the **actual component** (not just a description), driven by the currently-selected prop values, and
  - `propControls` — an array with one dropdown entry for **every choice/enum prop** of that component (`{ prop, label?, options, defaultValue? }`). `ComponentShowcase` renders a `<select>` per control and re-invokes `render(values)` when a value changes.
- Showcase demos run client-side. Host pages are server components, so each live demo lives in a sibling `"use client"` wrapper (e.g. `auth-showcase.tsx`) that the page renders.
- Components that depend on shared context (e.g. auth) are demoed against a **mock provider** rather than a real backend: `@mono/auth` exports `MockAuthProvider` (`@mono/auth/mock`) whose `state` prop (loading / signed-out / guest / signed-in) drives `AuthProvider`'s context for live `AuthGate`/`SignInModal` demos.
- Existing showcases:
  - `apps/docs/src/app/components/auth/page.tsx` — `@mono/auth` (`AuthProvider`, `AuthGate`, `SignInModal`) with live demos and a mock auth-state dropdown.
  - `apps/docs/src/app/components/components/page.tsx` — `@mono/components` (`ComponentShowcase`) with a live `packageName` dropdown.
  - `apps/docs/src/app/components/database/page.tsx` — `@mono/database` (currently no UI components exported).
- **Rule:** when a package exports a component, it must be added to that package's showcase page with a live `render` demo and a dropdown for every choice/enum prop. Packages that export no UI components still get a page (with an empty list) so the convention holds for all packages.

## Data Flow

```
App (pages/routes)
  ├── wraps root in AuthProvider + AuthGate  (required — no signed-out access)
  ├── imports from @mono/auth           (Supabase Auth: provider, hooks, clients)
  ├── imports from @mono/database       (Supabase Database/Storage: clients, types)
  └── imports from @mono/components     (UI components)
```

## Supabase Integration

Both auth and database packages use Supabase:

- **`@mono/auth`** — Uses `@supabase/ssr` and `@supabase/supabase-js` for authentication.
  - Browser client, server client, auth provider, middleware.
- **`@mono/database`** — Uses `@supabase/supabase-js` and `@supabase/ssr` for data/storage.
  - Browser client, server client, typed database schema.

Environment variables required:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### Canonical Supabase Project

All Supabase-backed edits must target the **canonical project** at `https://zyatzdkapdqngwyhiqqn.supabase.co`. Migrations, DDL, edge functions, and data changes are applied to this project only. `NEXT_PUBLIC_SUPABASE_URL` must resolve to this canonical URL. Before applying any schema or data change, verify the connected target matches; if a tool/agent points to a different project, correct it first and do not proceed with edits until it matches.

## Key Decisions

See `docs/adr/` for all Architecture Decision Records. Key decisions:

- [ADR-001: Next.js Framework](./adr/001-nextjs-framework.md)
- [ADR-002: Monorepo Structure](./adr/002-monorepo-structure.md)
- [ADR-003: Centralized Auth and Database](./adr/003-centralized-auth-and-database.md)
- [ADR-004: Component Showcase Pages](./adr/004-component-showcase-pages.md)
- [ADR-005: Design System, Theming, and Shared Layout Primitives](./adr/005-design-system-theming.md)
- [ADR-006: Database-Connected Media Library](./adr/006-database-connected-media-library.md)
- [ADR-007: Obsidian-Flavored Markdown Renderer](./adr/007-obsidian-markdown-renderer.md)

## Documentation Requirements

- All `.md` files in the repo must be kept up to date.
- Architecture changes must be preceded by an ADR in `docs/adr/`.
- Component changes must be reflected in `apps/docs` documentation.
- Every code change must update the relevant documentation files.
