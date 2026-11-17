# ADR-018: Unified Multi-Site Admin Portal, Visitor Origin Telemetry & Redis Rose Chats

## Status
**Accepted** (2026-11-17)

## Context
Machi Asia operates multiple applications across `*.machi.asia` and `*.itemlist.online`, along with a legacy standalone moderation portal (`apps/itemlist-admin` at `admin.itemlist.online`). Administrators needed a unified portal at `admin.machi.asia` (`apps/admin`) with:
- Live and historical visibility into all logged-in users and guests, including where they come from (app/subdomain, pathname, HTTP referrer, UTM source, geolocation, and device/browser/OS).
- Multi-period API and resource usage monitoring with admin controls to reset counters or customize daily/monthly quota limits.
- Real-time inspection and cross-device persistence of Rose AI chats stored in Redis.
- Role management across `guest`, `member`, `pro`, and `admin` tiers (with self-demotion safeguards).
- Dedicated per-site administration pages (`/rose`, `/itemlist`, `/[siteId]`), consolidating `itemlist-admin` under `admin.machi.asia/itemlist`.

## Decision
1. **Unified Admin Portal (`apps/admin` at `admin.machi.asia`, port `3013`)**:
   - Retires `apps/itemlist-admin` and routes `admin.machi.asia`, `admin.machi-asia.com`, `admin.itemlist.online`, and `/admin` to `apps/admin` in `vercel.json`.
   - Wraps the application in `<MonoAppShell requireAuth header={<AdminNavbar />}>` and `<AdminGate>` to enforce authentication and strict `admin` role verification.
   - Provides a global multi-tab dashboard at `/`, dedicated `/rose` and `/itemlist` routes, and dynamic per-site dashboards at `/[siteId]`.
2. **Visitor Origin & Geo Telemetry (`public.visitor_sessions`)**:
   - Adds `packages/database/migrations/20261117000000_visitor_sessions_and_admin_controls.sql` with RLS enabled (`Users can view their own sessions`, `Admins can manage all sessions`).
   - Uses `@vercel/functions` (`geolocation`, `ipAddress`) in `apps/api` and `ua-parser-js` (`UAParser`, `isBot`) in `@mono/database` alongside client origin context forwarded by `UsageProvider` in `@mono/auth`.
3. **Redis-Backed Rose AI Conversation Store (`apps/api/src/server/rose/chat-store.ts`)**:
   - Persists Rose AI chat turns and cross-device conversation lists in Redis (`REDIS_URL` via `ioredis`) with an automatic in-memory fallback for local/test environments.
   - Exposes `/rose/conversations` for cross-device sync in `@mono/rose` and `/admin/rose-chats` for administrative inspection and moderation.

## Consequences
- Single unified administration surface for all Machi Asia and ItemList apps.
- Faster, cross-device Rose AI chat history with immediate server-side visibility for administrators.
- Centralized role and quota governance across all tracked applications.
