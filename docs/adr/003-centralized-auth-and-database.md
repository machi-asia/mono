# ADR-003: Centralized Auth and Database Packages

## Status

Accepted

## Date

2026-09-01

## Context

Multiple applications in the monorepo need authentication and data access. Without a centralized approach, each app would implement its own auth and data logic, leading to duplication, inconsistencies, and security risks.

## Decision

Authentication and data/store logic are centralized into two shared packages, both powered by **Supabase**:

- **`/packages/auth`** (`@mono/auth`) — All authentication via Supabase Auth.
  - `AuthProvider` (React context, required by every app)
  - `AuthGate` (client gate — renders the sign-in modal until a session exists, then children)
  - `SignInModal` (no exit/cancel controls; Google, email/password, and Guest sign-in)
  - `useAuth` hook (client-side)
  - Browser and server client factories
  - Middleware for route protection
- **`/packages/database`** (`@mono/database`) — All data/storage via Supabase Database and Storage.
  - Browser and server client factories
  - Typed database schema

No app or other package may implement auth or data logic independently. Every app must wrap its root layout with `AuthProvider` **and** `AuthGate` — no signed-out user may access any page, and the only way in is to sign in (email/password, Google, or as a Guest via Supabase anonymous).

## Alternatives Considered

- **Per-app auth** — Each app implements its own auth. Leads to duplication and security inconsistencies.
- **Auth as an app route** — Auth logic in an app makes it non-shareable with other apps.
- **Third-party auth only** — Limits control over auth behavior and adds vendor lock-in.

## Consequences

- All apps import auth from `/packages/auth` and data from `/packages/database`.
- Changes to auth or data logic are made once and propagate to all apps.
- Security review is simplified — auth logic lives in one place.
- Packages remain focused: `auth` handles identity, `database` handles data.
- The `components` package remains UI-only — no auth or data logic mixed in.
- Breaking changes to auth or database APIs require updating all consuming apps.
