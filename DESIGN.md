# Design Principles

Core design principles for the Machi Asia monorepo.

## Next.js First

Every app and package in this monorepo is built on Next.js. This is a non-negotiable convention. All frameworks, tooling, and build pipelines assume Next.js.

## Separation of Concerns

- **`/packages/auth`** — Single source of truth for authentication. Login, logout, sessions, tokens, middleware — all here.
- **`/packages/database`** — Single source of truth for data access and state. Queries, models, schemas, store logic — all here.
- **`/packages/components`** — Single source of truth for shared UI: the design-token theme system, layout primitives (`Row`, `Col`, `Card`), and every functional element (date/time pickers, etc.). Only exports React components (`<>`). No business logic, no server functions.

## Design System

The visual language of every Machi Asia app lives here. These conventions apply to every app, page, and component.

### Color & Theme

- Colors are defined as **design tokens** — CSS custom properties (`--color-*`) — never hardcoded hex in components or apps.
- Theme switching uses **`next-themes`** (via the `ThemeProvider` from `@mono/components`), which is SSR-safe, persists the choice, and supports the system preference.
- The **primary theme is dark mode with gold accents**. A light theme is derived from the same token set.
- Use the token surface/text/border/overlay scales; do not invent new palette values inline.

### Motion

- Smooth, subtle animations are a core value. Use the shared easing/duration tokens (`--duration-*`, `--ease-*`).
- Transitions should be purposeful and restrained — no jarring or arbitrary animation.
- Always respect `prefers-reduced-motion`.

### Spacing & Minimal Clutter

- Generous whitespace between every component is required; whitespace is a first-class layout tool.
- Keep visual clutter minimal: restrained borders, shadows, and decoration.
- Use the shared spacing scale (`--space-*`) rather than ad-hoc pixel values.

### Component Rules

- Layout primitives (`<Row>`, `<Col>`, `<Card>`) and functional elements (date/time pickers, etc.) are **built and consumed strictly from `@mono/components`**.
- Apps and pages must **not** hand-roll their own layout or functional primitives.

### Content Density

- Pages are **high-image, low-text**: emphasize visuals and minimize prose.
- Prefer imagery, cards, and compact visual statements over long paragraphs whenever possible.

## Package Exports

Packages export React components, functions, hooks, and types. They do not contain page routes or business logic outside their scope.

- **`/packages/auth`** exports: `AuthProvider`, `useAuth`, `createClient` (browser/server), `updateSession` (middleware).
- **`/packages/database`** exports: `createClient` (browser/server), database types.
- **`/packages/components`** exports: `ThemeProvider`, `Row`, `Col`, `Card`, `ComponentShowcase` — plus the design-token CSS and any functional elements (date/time pickers, etc.).

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
