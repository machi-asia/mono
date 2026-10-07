# ADR-016: User Roles and Multi-Period Resource Usage Monitoring

## Status

Accepted

## Context

Machi Asia products run across multiple deployable web applications (`apps/machi-asia`, `apps/rose`, `apps/calculator`, `apps/docs`, `apps/api`) offering different tiers of service to guests, authenticated members, pro subscribers, and administrators. Previously, usage tracking and rate limits were fragmented across ad-hoc local stores without unified multi-period (daily/monthly) quota evaluation or persistent database roles. Additionally, support tickets submitted from `@mono/auth` required a dedicated `public.support_tickets` table in Supabase with RLS protections.

## Decision

1. **User Roles (`public.user_roles`)**:
   - Store user roles (`guest`, `member`, `pro`, `admin`) in a dedicated `public.user_roles` table in Supabase.
   - Sync role changes into `auth.users.raw_app_meta_data` via Postgres triggers so role claims are included directly in client session tokens.
   - Provide `@mono/auth` hooks (`useUserRole`, `useAuth().role`) and `@mono/database` helpers (`getUserRole`, `updateUserRole`).

2. **Multi-Period Usages (`public.user_usages`)**:
   - Create `public.user_usages` table storing metric consumption per user, per app, and per period key (`YYYY-MM-DD` for daily, `YYYY-MM` for monthly).
   - Support metrics: `requests`, `ai_tokens`, `turns`, `storage_bytes`.
   - Implement `increment_user_usage` stored procedure in Supabase to atomically record usage and evaluate daily and monthly limits in a single operation.

3. **Quota Matrix & Rate Limit Enforcement**:
   - `guest`: Daily: 50 requests / 15 turns; Monthly: 500 requests / 150 turns. Max image upload 2 KB; Total storage 1 MB.
   - `member`: Daily: 250 requests / 60 turns; Monthly: 3,500 requests / 1,200 turns. Max image upload 20 KB; Total storage 5 MB.
   - `pro`: Daily: 1,500 requests / 300 turns; Monthly: 25,000 requests / 6,000 turns. Max image upload 10 MB; Total storage 1 GB.
   - `admin`: Unlimited consumption, image size, and storage across all metrics.
   - Enforce hard limits in `apps/api` with `429 Too Many Requests` responses and interactive upgrade prompts in UI components.

4. **Support Tickets (`public.support_tickets`)**:
   - Provision `public.support_tickets` in Supabase with RLS policies allowing authenticated users to create/view their tickets, and admins to view and manage all tickets.

## Consequences

- All applications have a single source of truth for user role determination and usage quota monitoring.
- Resource consumption is tracked across both daily and monthly time windows.
- Support tickets submitted in the Account Settings UI persist reliably in Supabase with user privacy protections.
