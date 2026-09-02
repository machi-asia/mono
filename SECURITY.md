# Security Policies

Security guidelines for the Machi Asia monorepo.

## Authentication

All authentication is handled by `/packages/auth` using **Supabase Auth**. Do not implement auth logic in apps or other packages. This includes:

- Login and logout flows (email/password, anonymous/guest)
- Session management via `AuthProvider` (required in every app)
- Token handling via `@supabase/ssr`
- Auth middleware for route protection
- Role-based access control

Every app must wrap its root layout with `AuthProvider`. Users without a valid session (guest or authenticated) are redirected to login.

## Secrets and Credentials

- Never commit secrets, API keys, or credentials to the repository.
- Use environment variables for all sensitive configuration.
- Environment keys are declared in `.env.sample` files (never store real values there).
- Real values live in `.env.local`, which must be listed in `.gitignore` and never committed.
- When code references a new env key, add it to the corresponding `.env.sample` — never write real values into `.env.sample`.
- Run `npm run env` after env-related changes; the script verifies `.env.local` against `.env.sample` for missing keys and missing/placeholder values without exposing actual values.
- Rotate compromised credentials immediately.

## Dependency Security

- Run `npm audit` regularly and address high/critical vulnerabilities.
- Keep dependencies up to date.
- Review new dependencies before adding them.

## Data Access

All data access is managed through `/packages/database` using **Supabase Database and Storage**. Enforce:

- Input validation at the database boundary.
- Row Level Security (RLS) on all tables.
- Least-privilege access via Supabase publishable keys (never expose service_role keys).
- Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` env vars.

## Code Review

All code changes must go through pull request review before merging. Security-sensitive changes require additional review.

## Reporting

Report security vulnerabilities privately to the maintainers. Do not open public issues for security concerns.
