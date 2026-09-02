# ADR-004: Component Showcase Pages

## Status

Accepted

## Date

2026-09-02

## Context

Packages export reusable components (`@mono/auth`, `@mono/components`, future packages). Without a convention, documentation of these components spreads across ad-hoc doc pages, making exports hard to discover and easy to forget when new components are added.

## Decision

Every package that exports components has a showcase `page.tsx` in the `apps/docs` app that renders each of that package's exported components **live** in a list view.

- The **listing layout and interactive prop dropdowns** are provided once by the reusable `ComponentShowcase` component in `@mono/components`.
- Each showcase page lives at `apps/docs/src/app/components/<package>/page.tsx` and passes `ComponentShowcase` a `packageName`, a short `description`, and the array of exported `components`.
- Each component entry declares a `render(values)` function that renders the **actual component** (not a description) and a `propControls` array with one dropdown for **every choice/enum prop** of that component (`{ prop, label?, options, defaultValue? }`). `ComponentShowcase` renders a `<select>` per control and re-invokes `render(values)` with the selected values, so the live demo reacts to prop changes.
- Components that depend on shared context (e.g. auth) are demoed against a **mock provider** — `@mono/auth/mock` (`MockAuthProvider`) — whose `state` prop drives the auth context for live `AuthGate`/`SignInModal` demos without a real backend.
- Host pages are server components; live demos live in sibling `"use client"` wrappers (e.g. `auth-showcase.tsx`) so functions cannot cross the server/client boundary.
- Packages that currently export no UI components (e.g. `@mono/database`) still get a page with an empty list, so the convention holds uniformly for current and future packages.
- Adding or updating a component in a package requires adding/updating its showcase entry with a live render and a dropdown per choice/enum prop. This is enforced by repo markdown rules (REF: `AGENTS.md` rule 12, `CONTRIBUTING.md`, `DESIGN.md`, `README.md`, `docs/ARCHITECTURE.md`).

Showcase pages live in the `docs` app (not inside the packages) because, per ADR-002 and the repo rule "no page routes in packages", packages only export components/functions/hooks/types.

## Alternatives Considered

- **Showcase page inside each package** — conflicts with the rule that packages contain no page routes.
- **Single combined docs page** — becomes unwieldy and fails to discover per-package exports.
- **No enforced convention** — exports go undocumented as packages grow.

## Consequences

- Exported components are discoverable in one place per package, in a consistent list view.
- `@mono/components` owns the shared listing layout, so visual consistency is guaranteed.
- Every package change that touches components must also touch the docs app and update the relevant markdowns.
