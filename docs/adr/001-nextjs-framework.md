# ADR-001: Next.js as the Universal Framework

## Status

Accepted

## Date

2026-09-01

## Context

All applications and packages in the Machi Asia monorepo need a consistent web framework. The project requires server-side rendering, API routes, static generation, and a strong React ecosystem.

## Decision

All apps and packages in this monorepo will be built on **Next.js**. This applies to every deployable application (`machi-asia`, `rose`, `docs`) and every shared package.

## Alternatives Considered

- **Vite + React SPA** — No server-side rendering, no API routes. Limited for SSR use cases.
- **Remix** — Strong SSR but smaller ecosystem compared to Next.js.
- **Plain React** — Requires manual setup for routing, SSR, and API.

## Consequences

- All team members must be familiar with Next.js conventions.
- Every new app or package must use the Next.js project structure.
- Non-Next.js frameworks cannot be introduced without a new ADR.
- Shared packages must be compatible with Next.js build pipelines.
- Turborepo is configured with Next.js in mind (`next build`, `next dev`, etc.).
