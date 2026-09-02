# AI Agent Instructions

Rules for AI agents working on this monorepo.

## Repository Rules

1. **All apps and packages are Next.js-based.** Never scaffold or suggest non-Next.js code.
2. **Packages export components, functions, hooks, and types.** No page routes, no business logic outside packages.
3. **Auth lives in `/packages/auth`.** Uses Supabase Auth. Do not create auth logic elsewhere.
4. **Store/data lives in `/packages/database`.** Uses Supabase Database/Storage. Do not create data access logic elsewhere.
5. **Every app must use `AuthProvider` + `AuthGate`** from `/packages/auth`. No signed-out user may access any page; the sign-in modal offers email/password, Google, or Guest (Supabase anonymous) sign-in and has no exit/cancel controls.
6. **Every app must include linting and testing tooling** — `eslint`, `stylelint`, `typecheck`, `vitest`.
7. **Any env key referenced in code must be added to the corresponding `.env.sample`.** Never hardcode secrets. When you reference a new env key, update `.env.sample`, not `.env.local` (do not read or write secret values in `.env.local` unless setting up local dev).
8. **Run `npm run env` after env-related changes.** It compares `.env.sample` against `.env.local` for missing keys and missing/placeholder values. Never read the actual values in `.env.local` — rely on the script.
9. **Components must be documented in `/docs` app.** Every new component gets a doc page.
10. **Architecture decisions go in `/docs/adr/`.** Create an ADR before implementing significant changes.
11. **All `.md` files must stay current.** When you change code, update the relevant docs.
12. **Every package's exported components get a showcase page with a live interactive demo.** Every package that exports components must have a corresponding `page.tsx` in the `apps/docs` app (e.g. `apps/docs/src/app/components/<package>/page.tsx`) that renders each exported component **live** using the shared `ComponentShowcase` layout from `@mono/components`. Each listed component must:
    - declare a `render(values)` function that renders the **actual component** (not just a description), and
    - declare a `propControls` dropdown for **every choice/enum prop** of that component.
    When you add or update a component in a package, add/update its entry on that package's showcase page accordingly. This applies to current and future component exports. Components that depend on shared context (e.g. auth) are demoed against a mock provider (`@mono/auth/mock`).
13. **Follow the design system** (see `DESIGN.md`): colors are token-based CSS custom properties, never hardcoded hex; theme switching uses `ThemeProvider`/`next-themes` with **dark mode primary and gold accents**; use the shared easing/duration and spacing tokens; keep whitespace generous and clutter minimal; and build layout + functional primitives (`Row`, `Col`, `Card`, date/time pickers, etc.) **strictly from `/packages/components`** — apps must not hand-roll them. Pages should be **high-image, low-text**.

## File Ownership

| Path | Owner | Purpose |
|------|-------|---------|
| `apps/machi-asia/` | `machi-asia` team | Showcase + billing hub |
| `apps/rose/` | `rose` team | Custom AI agent |
| `apps/docs/` | `docs` team | Component + user documentation |
| `packages/auth/` | All teams | Shared authentication |
| `packages/database/` | All teams | Shared data/store |
| `packages/components/` | All teams | Shared UI components |
| `docs/adr/` | All teams | Architecture Decision Records |
| `docs/ARCHITECTURE.md` | All teams | Architecture overview |
| `docs/API.md` | All teams | API conventions |

## When Making Changes

- Edit the relevant `.md` files to reflect your changes.
- If the change is architectural, create an ADR in `docs/adr/` with the next sequential number.
- If you add a component to `packages/components`, document it in the `apps/docs` app.
- If you add an exported component to any package, add it to that package's showcase page under `apps/docs/src/app/components/<package>/page.tsx` using the shared `ComponentShowcase` list-view layout, with a live `render(values)` demo and a `propControls` dropdown for every choice/enum prop.
- If you modify auth behavior, update `packages/auth` and `docs/ARCHITECTURE.md`.
- If you modify data/store behavior, update `packages/database` and `docs/ARCHITECTURE.md`.
- If you add or rename an env key in code, update the corresponding `.env.sample` (never commit values in `.env.local`).
- Always update `CHANGELOG.md` with a new entry.
- Always run `npm run env` after any env-related change to verify `.env.local` vs `.env.sample`.
- Always update `latest.commit.txt` with a summary of all uncommitted changes before the agent session ends. `latest.commit.txt` is read verbatim as the commit message by `npm run deploy` (see `scripts/deploy.js`). Its first line (a Conventional-Commits-style title) **must** match:
  `^(feature|fix|refactor|chore|docs|style|test|ci|build)\s*\([a-z0-9]+(-[a-z0-9]+)*\):\s*.+$`
  Choose the type closest to the dominant nature of the pending changes and a kebab-case scope naming the affected area. Below the title, add one bullet per notable change (`- <area>: what changed and why`).

## Code Style

- Match the existing code style in the file you are editing.
- No comments unless explicitly requested.
- No secrets, keys, or credentials in code or docs.
