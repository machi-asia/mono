# Contributing

Guidelines for contributing to the Machi Asia monorepo.

## Conventions

### Framework

- All apps and packages **must be Next.js-based**.
- Do not introduce non-Next.js frameworks without an approved ADR.

### Required Tooling

Every app **must** include the following:

- **ESLint** — `lint` script, lints TypeScript/JS + Next.js rules.
- **Stylelint** — `lint:style` script, lints CSS.
- **TypeScript** — `typecheck` script, type-checks without emitting.
- **Vitest** — `test` script + `test:watch`, unit/component tests.

These are run in parallel via `npm run test` at the repo root.

### Package Rules

- Packages (`/packages/*`) **export components, functions, hooks, and types**.
- No page routes, no business logic outside packages.
- All authentication belongs in `/packages/auth` (Supabase Auth).
- All data/store logic belongs in `/packages/database` (Supabase Database/Storage).
- Every app must use the `AuthProvider` from `/packages/auth`.
- All layout and functional primitives (`Row`, `Col`, `Card`, date/time pickers, etc.) must be built in and consumed from `/packages/components` — never hand-rolled in an app.
- Follow the design system in `DESIGN.md`: token-based colors (no hardcoded hex), `next-themes` theming (dark-primary/gold), shared spacing/easing tokens, generous whitespace, subtle motion, high-image/low-text pages.

### Documentation

- **Every component** exported from `/packages/components` must have documentation in the `/docs` app.
- **Every package's exported components** must be listed on that package's showcase page (`apps/docs/src/app/components/<package>/page.tsx`) using the shared `ComponentShowcase` list-view layout from `@mono/components`. Each component must render **live** via a `render(values)` function and declare a `propControls` dropdown for **every choice/enum prop**. Add/update the relevant showcase entry whenever a component is created or updated.
- Architecture decisions must be recorded in `/docs/adr/` before implementation begins.
- All `.md` files in the repo must be updated when relevant code changes.
- Keep `CHANGELOG.md` updated with version entries.

### Environment Variables

- Every env key referenced in code must be added to the corresponding `.env.sample`.
- Never hardcode secrets or commit values; real values live in `.env.local` (gitignored).
- After adding, renaming, or removing an env key in code, update `.env.sample` accordingly.
- Always run `npm run env` after env-related changes to verify `.env.local` vs `.env.sample` (checks missing keys and missing/placeholder values). `npm run env` is script-based and does not expose real values.
- **The canonical Supabase project is `https://zyatzdkapdqngwyhiqqn.supabase.co`.** All database edits — migrations, DDL, edge functions, and data changes — must target this project only. `NEXT_PUBLIC_SUPABASE_URL` must resolve to this URL. Never run migrations against a mismatched/different project; verify the target before applying any change.

### Code Style

- Follow the existing code style in the file you are editing.
- Match naming conventions used in the same package.
- Do not add comments unless explicitly requested.

## Workflow

1. Create a feature branch from `main`.
2. Make your changes following the conventions above.
3. Update all relevant `.md` files.
4. Add an ADR to `/docs/adr/` if making an architecture decision.
5. If you referenced new env keys, update the corresponding `.env.sample`.
6. Run `npm run env` to verify environment configuration.
7. Run `npm run test` (runs lint, stylelint, typecheck, vitest in parallel).
8. Open a pull request against `main`.

## Pull Requests

- PR descriptions must reference the affected apps/packages.
- Include documentation updates in the same PR as code changes.
- All checks must pass before merging.

## Questions

Open an issue or reach out to the maintainers.
