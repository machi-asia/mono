# ADR-002: Turborepo Monorepo Structure

## Status

Accepted

## Date

2026-09-01

## Context

The Machi Asia project consists of multiple applications (`machi-asia`, `rose`, `docs`) that share common code (auth, database, UI components). We need a structure that supports code sharing, independent deployment, and a single development workflow.

## Decision

Use **Turborepo** with npm workspaces in a monorepo structure:

```
mono/
├── apps/           # Deployable Next.js applications
├── packages/       # Shared libraries (auth, database, components)
├── docs/           # Architecture documentation and ADRs
├── turbo.json      # Turborepo pipeline
└── package.json    # Root workspace config
```

## Alternatives Considered

- **Separate repositories** — Difficult to share code, harder to maintain consistency.
- **Lerna** — Deprecated, Turborepo is the modern replacement.
- **Nx** — More complex setup, heavier than needed for this project size.

## Consequences

- Code changes that affect multiple apps can be made in a single commit.
- Shared packages are consumed via npm workspace references.
- Turborepo handles build caching and parallel task execution.
- Each app can be deployed independently.
- Package versions are managed within the monorepo (no separate publishing).
- `turbo.json` defines the build pipeline (`build`, `dev`, `lint`, `test`, `clean`).
