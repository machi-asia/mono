# ADR-015: Skeleton Loading State Enforcement

## Status

Accepted

## Date

2026-10-03

## Context

Components across applications and packages fetch data asynchronously from REST endpoints, Supabase APIs, and server actions. Previously, some views displayed simple textual "Loading..." placeholders, spinners, or empty layouts during initial network fetches. This caused layout shifts, visual flicker, and inconsistent user experience.

We require a standardized suite of skeleton loading components within `@mono/components` and a mandatory system-wide rule requiring that every component loading data from a fetch or database query renders a skeleton component matching its layout geometry before the load finishes.

## Decision

1. **Skeleton Component Suite in `@mono/components`**:
   - `Skeleton`: core polymorphic primitive supporting variants (`text`, `circular`, `rectangular`, `rounded`), animations (`pulse`, `wave`, `none`), multi-count groupings, and customizable geometry.
   - `SkeletonText`: multi-line text placeholder with configurable line counts, heights, and last-line tapering.
   - `SkeletonCircle`: circular avatar or badge placeholder.
   - `SkeletonButton`: button shape placeholder matching button sizes (`sm`, `md`, `lg`).
   - `SkeletonCard`: structured card placeholder with image, header, body lines, and action slots.
   - All skeleton components adhere to CSS design tokens (`--color-surface-2`, `--color-border-soft`), respect `prefers-reduced-motion`, and feature accessible `role="status"` / `aria-busy="true"` semantics.

2. **System-Wide Enforcement**:
   - Mandated in `AGENTS.md`, `DESIGN.md`, `README.md`, `CONTRIBUTING.md`, and `docs/ARCHITECTURE.md`.
   - Every component that performs data fetching (`fetch`, Supabase data calls) MUST replace its loading state with appropriate skeleton components before the data resolves.
   - Hand-rolled spinners or bare "Loading..." text strings are strictly prohibited for full component loading states.

## Alternatives Considered

- **Global Spinners Only**: Rejected because spinners cause layout shifts (CLS) and do not communicate the incoming structure of content to the user.
- **Per-App Custom Skeletons**: Rejected in favor of centralized design system primitives in `@mono/components` to guarantee consistent styling, theme switching, and token adherence.

## Consequences

- Improved perceived performance and reduced Cumulative Layout Shift (CLS) across all applications.
- Seamless transition between loading and resolved data states.
- All new components fetching data must provide matching skeleton loading states.
