# Design Principles

Core design principles for the Machi Asia monorepo.

## Next.js First

Every app and package in this monorepo is built on Next.js. This is a non-negotiable convention. All frameworks, tooling, and build pipelines assume Next.js.

## Separation of Concerns

- **`/packages/auth`** — Single source of truth for authentication. Login, logout, sessions, tokens, middleware — all here.
- **`/packages/database`** — Single source of truth for data access and state. Queries, models, schemas, store logic — all here.
- **`/packages/components`** — Single source of truth for shared UI. Only exports React components (`<>`). No business logic, no server functions.

## Package Exports

Packages export React components, functions, hooks, and types. They do not contain page routes or business logic outside their scope.

- **`/packages/auth`** exports: `AuthProvider`, `useAuth`, `createClient` (browser/server), `updateSession` (middleware).
- **`/packages/database`** exports: `createClient` (browser/server), database types.
- **`/packages/components`** exports: React components (`<>`).

## Documentation Required

- Every component exported from `/packages/components` must be documented in the `/docs` app.
- Every package's exported components must be rendered live on that package's showcase page in the docs app, using the shared `ComponentShowcase` list-view layout from `@mono/components`. Each component must render the actual component via `render(values)` and declare a `propControls` dropdown for every choice/enum prop; this is required each time a component is created or updated.
- Architecture decisions must be recorded in `/docs/adr/` before implementation.
- All markdown files in the repo are living documents and must be updated as the project evolves.

## Environment Variables as Single Source of Truth

- Every env key an app or package references is declared in its `.env.sample`.
- Real values live in gitignored `.env.local` files only — never in `.env.sample`.
- `npm run env` verifies that `.env.local` matches `.env.sample` (missing keys, missing/placeholder values) via a script, so no tool or agent needs to read actual secret values.

## Simplicity

Prefer the simplest solution that meets the requirement. Avoid premature abstraction. Keep file structures shallow. Name things clearly.

## Consistency

Follow existing patterns in the codebase. When in doubt, look at neighboring files and mirror their style.
