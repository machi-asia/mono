-- ==============================================================================
-- Migration: 20261109010000_supabase_keepalive_cron.sql
-- Description: Weekly Supabase keep-alive heartbeat table, RLS policies, and
--              pg_cron schedule to prevent project inactivity pausing.
-- ==============================================================================

-- 1. Enable pg_cron extension if available
create extension if not exists pg_cron with schema pg_catalog;

-- 2. Create keepalive_heartbeats log table in public schema with RLS
create table if not exists public.keepalive_heartbeats (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'pg_cron',
  pinged_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.keepalive_heartbeats enable row level security;

create index if not exists keepalive_heartbeats_pinged_at_idx
  on public.keepalive_heartbeats (pinged_at desc);

do $do$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'keepalive_heartbeats'
      and policyname = 'Admins can view keepalive heartbeats'
  ) then
    create policy "Admins can view keepalive heartbeats"
      on public.keepalive_heartbeats
      for select
      to authenticated
      using (public.is_admin());
  end if;
end
$do$;

-- 3. Create helper function to record a heartbeat
create or replace function public.record_keepalive_heartbeat(p_source text default 'cron')
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := timezone('utc'::text, now());
begin
  insert into public.keepalive_heartbeats (source, pinged_at)
  values (coalesce(nullif(trim(p_source), ''), 'cron'), v_now);

  return v_now;
end;
$$;

revoke all on function public.record_keepalive_heartbeat(text) from public, anon, authenticated;
grant execute on function public.record_keepalive_heartbeat(text) to service_role;

-- 4. Schedule weekly pg_cron job (every Monday at 03:00 UTC)
do $do$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    if not exists (select 1 from cron.job where jobname = 'weekly-supabase-keepalive') then
      perform cron.schedule(
        'weekly-supabase-keepalive',
        '0 3 * * 1',
        $cron$select public.record_keepalive_heartbeat('pg_cron')$cron$
      );
    end if;
  end if;
end
$do$;
