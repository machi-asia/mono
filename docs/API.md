# API Documentation

Conventions for documenting APIs across the monorepo.

## Overview

Each app may expose API routes via Next.js API handlers. This file documents the conventions for how those APIs are structured and documented.

## API Route Structure

```
apps/<app>/app/api/<route>/route.ts
```

All API routes follow the Next.js App Router convention using `route.ts` files.

## Conventions

- API routes live within the app that owns the resource.
- Authentication for API routes is handled via `/packages/auth` (Supabase Auth).
- Data access for API routes is handled via `/packages/database` (Supabase Database/Storage).
- All API routes must validate input and return typed responses.
- Error responses must follow a consistent shape.
- Server-side Supabase clients are created via `@mono/auth/server` or `@mono/database/server`.

## Response Format

```json
{
  "data": {},
  "error": null
}
```

or on failure:

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Per-App API Docs

Document app-specific API endpoints in `docs/user-manual/<app>/api.md` as the APIs are built.

## Authentication

All protected API routes must verify the session using `/packages/auth`. Do not implement custom auth checks in individual routes.

## Versioning

API routes do not have explicit versioning in the URL. Breaking changes must be coordinated across all consuming apps and documented in `CHANGELOG.md`.
