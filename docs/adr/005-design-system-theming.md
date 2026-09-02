# ADR-005: Design System, Theming, and Shared Layout Primitives

## Status

Accepted

## Date

2026-09-02

## Context

Machi Asia apps share styling and layout needs but had no shared system: colors were hardcoded hex, there was no theme switching, and apps would be tempted to hand-roll layout and functional components. We need consistent visuals, theme support, and a single source of truth for layout/functional primitives.

## Decision

Adopt a shared design system implemented in `@mono/components` and enforced across all apps.

- **Token-based colors**: colors are CSS custom properties (`--color-*`) defined in the design tokens, never hardcoded hex in components or apps.
- **Theme switching**: via **`next-themes`**, wrapped by the `ThemeProvider` from `@mono/components`. It is SSR-safe, persists the choice, and supports the system preference via the `class` attribute.
- **Primary theme is dark mode with gold accents**; a light theme is derived from the same token set.
- **Motion**: use the shared easing/duration tokens; transitions are subtle and purposeful; respect `prefers-reduced-motion`.
- **Spacing & minimal clutter**: use the shared spacing scale; generous whitespace between components; restrained borders/shadows.
- **Shared layout & functional primitives**: `Row`, `Col`, `Card`, and functional elements (date/time pickers, etc.) are **built and consumed strictly from `@mono/components`**. Apps must not hand-roll them.
- **Content density**: pages are **high-image, low-text**.

These conventions are documented in `DESIGN.md` and enforced as a repo rule in `AGENTS.md` (rule 13).

## Alternatives Considered

- **Per-app styling with hardcoded values** — inconsistent, no theme support, duplicates layout code across apps.
- **A custom theme hook instead of a library** — more to maintain; next-themes already handles SSR/flicker/persistence.
- **Light mode as primary** — rejected in favor of the dark/gold brand direction.

## Consequences

- Consistent visuals and theming across all apps.
- Layout and functional primitives live in one place, reducing duplication.
- New layout/functional components must be added to `@mono/components` (and their showcase pages) before use in apps.
- Contributors must follow the DESIGN.md conventions; verified by review and the AGENTS.md rule.
