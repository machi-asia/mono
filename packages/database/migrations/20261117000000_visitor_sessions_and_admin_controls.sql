-- ==============================================================================
-- Migration: 20261117000000_visitor_sessions_and_admin_controls.sql
-- Description: Creates public.visitor_sessions for live visitor presence, origin
--              tracking (app, referrer, UTM, geo, device/browser/OS), and grants
--              admin read access to Rose AI metadata tables.
-- Follows supabase-postgres-best-practices:
--   - RLS enabled with (select auth.uid()) optimization
--   - Explicit TO authenticated policies (never deprecated auth.role())
--   - UPDATE / ALL policies include both USING and WITH CHECK
--   - Indexes on last_seen_at, user_id, visitor_id, and app
-- ==============================================================================

create table if not exists public.visitor_sessions (
  session_key text primary key,
  user_id uuid references auth.users(id) on delete set null,
  visitor_id text not null,
  is_guest boolean not null default true,
  email text,
  display_name text,
  role text not null default 'guest' check (role in ('guest', 'member', 'pro', 'admin')),
  app text not null default 'machi-asia',
  hostname text,
  pathname text,
  referrer text,
  utm_source text,
  country text,
  region text,
  city text,
  ip_address text,
  device_type text,
  browser text,
  os text,
  user_agent text,
  started_at timestamptz not null default timezone('utc'::text, now()),
  last_seen_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.visitor_sessions enable row level security;

create index if not exists visitor_sessions_last_seen_idx
  on public.visitor_sessions (last_seen_at desc);

create index if not exists visitor_sessions_user_last_seen_idx
  on public.visitor_sessions (user_id, last_seen_at desc);

create index if not exists visitor_sessions_app_last_seen_idx
  on public.visitor_sessions (app, last_seen_at desc);

create index if not exists visitor_sessions_visitor_last_seen_idx
  on public.visitor_sessions (visitor_id, last_seen_at desc);

do $do$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'visitor_sessions' and policyname = 'Users can view their own sessions'
  ) then
    create policy "Users can view their own sessions"
      on public.visitor_sessions
      for select
      to authenticated
      using ((select auth.uid()) = user_id or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'visitor_sessions' and policyname = 'Admins can manage all sessions'
  ) then
    create policy "Admins can manage all sessions"
      on public.visitor_sessions
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  -- Allow admins to inspect rose_memories and rose_personalization for support & monitoring
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'rose_memories' and policyname = 'Admins can view all rose memories'
  ) then
    create policy "Admins can view all rose memories"
      on public.rose_memories
      for select
      to authenticated
      using (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'rose_personalization' and policyname = 'Admins can view all rose personalization'
  ) then
    create policy "Admins can view all rose personalization"
      on public.rose_personalization
      for select
      to authenticated
      using (public.is_admin());
  end if;
end
$do$;
