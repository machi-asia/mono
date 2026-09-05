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

- **Strictly build UI using `@mono/components`**: Core primitives (`<Button>`, `<Card>`, `<Row>`, `<Col>`, `<Tooltip>`, `<Dropdown>`, `<Link>`, `<MarkdownRenderer>`, date/time pickers, etc.) must be consumed strictly from `@mono/components`.
- Apps, packages, and modals must **never hand-roll** raw buttons (`<button>`), custom card wrappers (`<div className="...card...">`), or ad-hoc primitives when an equivalent component exists in `@mono/components`.
- **Clarify vague or complex UI features with `<Tooltip variant="help">`**: Any UI metrics, settings, tiers, badges, or controls that might otherwise be ambiguous or vague to end users must include the circular `?` help tooltip (`<Tooltip variant="help">`) from `@mono/components` with concise, clear explanations and limits.

### Content Density

- Pages are **high-image, low-text**: emphasize visuals and minimize prose.
- Prefer imagery, cards, and compact visual statements over long paragraphs whenever possible.

## Package Exports

Packages export React components, functions, hooks, and types. They do not contain page routes or business logic outside their scope.

- **`/packages/auth`** exports: `AuthProvider`, `useAuth`, `createClient` (browser client with `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), server `createClient`, `updateSession` (middleware).
- **`/packages/database`** exports: server `createClient` (with `SUPABASE_SECRET_KEY` / publishable key with RLS), database types, and server media storage operations. Database operations are strictly server-only.
- **`/packages/components`** exports: `ThemeProvider`, `Row`, `Col`, `Card`, `ComponentShowcase` — plus the design-token CSS and any functional elements (date/time pickers, etc.).

## Documentation Required

- Every component exported from `/packages/components` must be documented in the `/docs` app.
- Every package's exported components must be rendered live on that package's showcase page in the docs app, using the shared `ComponentShowcase` list-view layout from `@mono/components`. Each component must render the actual component via `render(values)` and declare a `propControls` dropdown for every choice/enum prop; this is required each time a component is created or updated.
- Architecture decisions must be recorded in `/docs/adr/` before implementation.
- All markdown files in the repo are living documents and must be updated as the project evolves.

## Environment Variables as Single Source of Truth

- Every env key an app or package references is declared in its `.env.sample`.
- Real values live in gitignored `.env.local` files only — never in `.env.sample`.
- In all `.env.sample` and `.env.local` files, **all configuration keys (settings, feature flags, quotas, tiers, model options) must come after the non-config keys (credentials, secrets, URLs, tokens), separated by a comment separator**.
- `npm run env` verifies that `.env.local` matches `.env.sample` (missing keys, missing/placeholder values) via a script, so no tool or agent needs to read actual secret values.

## Simplicity

- Prefer the simplest solution that meets the requirement. Avoid premature abstraction. Keep file structures shallow. Name things clearly.
- Keep all files strictly below 500 lines for cleanliness and maintainability. When a component, style, or module grows beyond 500 lines, decompose it into focused subcomponents, sub-styles, or dedicated utilities co-located within that feature's directory.

## Consistency

Follow existing patterns in the codebase. When in doubt, look at neighboring files and mirror their style.
