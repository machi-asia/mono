-- ==============================================================================
-- Migration: 20261107000000_core_tables_quotas_and_rls.sql
-- Description: Complete declarative schema for Machi Asia core tables, RLS policies,
--              and atomic API usage & quota locking RPCs.
-- Follows supabase-postgres-best-practices:
--   - RLS enabled on all public tables with (select auth.uid()) optimization
--   - Composite & unique indexes for hot lookup paths
--   - Atomic INSERT ... ON CONFLICT DO UPDATE for quota checking & locking
--   - Explicit TO authenticated / TO anon policies (never deprecated auth.role())
--   - UPDATE policies include both USING and WITH CHECK
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. user_roles table
-- ------------------------------------------------------------------------------
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('guest', 'member', 'pro', 'admin')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.user_roles enable row level security;

create index if not exists user_roles_role_idx on public.user_roles (role);

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

do $do$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_roles' and policyname = 'Users can view their own role'
  ) then
    create policy "Users can view their own role"
      on public.user_roles
      for select
      to authenticated
      using ((select auth.uid()) = user_id or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_roles' and policyname = 'Admins can manage all roles'
  ) then
    create policy "Admins can manage all roles"
      on public.user_roles
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$do$;

-- ------------------------------------------------------------------------------
-- 2. user_usages table (Unified API & Resource Quota Ledger)
-- ------------------------------------------------------------------------------
create table if not exists public.user_usages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  app text not null default 'global',
  metric text not null check (char_length(metric) between 1 and 64 and metric ~ '^[a-z0-9_:-]+$'),
  period_type text not null check (period_type in ('daily', 'monthly')),
  period_key text not null,
  count bigint not null default 0 check (count >= 0),
  usage_limit bigint not null default 0 check (usage_limit >= 0),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint user_usages_unique_period unique (user_id, app, metric, period_type, period_key)
);

alter table public.user_usages enable row level security;

create index if not exists user_usages_lookup_idx
  on public.user_usages (user_id, app, metric, period_type, period_key);

create index if not exists user_usages_user_updated_idx
  on public.user_usages (user_id, updated_at desc);

do $do$
begin
  -- Revoke any legacy client write policies on user_usages so browser clients can never tamper with usage counts or limits
  drop policy if exists "Users can upsert their own usages" on public.user_usages;
  drop policy if exists "Users can update their own usages" on public.user_usages;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_usages' and policyname = 'Users can view their own usages'
  ) then
    create policy "Users can view their own usages"
      on public.user_usages
      for select
      to authenticated
      using ((select auth.uid()) = user_id or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_usages' and policyname = 'Admins can manage all usages'
  ) then
    create policy "Admins can manage all usages"
      on public.user_usages
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$do$;

-- ------------------------------------------------------------------------------
-- 3. Atomic RPC: increment_user_usage
--    Checks and increments daily & monthly usage atomically with row-level locking.
--    Restricted to service_role (and postgres/admins); never directly callable by anon/authenticated clients.
--    If either daily or monthly quota is exceeded, does NOT increment and returns allowed=false.
-- ------------------------------------------------------------------------------
create or replace function public.increment_user_usage(
  p_user_id uuid,
  p_app text,
  p_metric text,
  p_amount bigint default 1,
  p_daily_limit bigint default 250,
  p_monthly_limit bigint default 3500
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_jwt_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
  v_role text := 'member';
  v_day_key text := to_char(timezone('utc'::text, now()), 'YYYY-MM-DD');
  v_month_key text := to_char(timezone('utc'::text, now()), 'YYYY-MM');
  v_daily_count bigint := 0;
  v_monthly_count bigint := 0;
  v_effective_daily_limit bigint := p_daily_limit;
  v_effective_monthly_limit bigint := p_monthly_limit;
  v_allowed boolean := true;
  v_exceeded_type text := null;
begin
  -- Strict negative increment rejection: usage counts can never be decremented via increment_user_usage
  if p_amount < 0 then
    raise exception 'Invalid negative usage increment: p_amount must be >= 0';
  end if;

  -- Defense-in-depth: even if EXECUTE permissions are misconfigured, block non-service_role / non-admin callers
  if v_jwt_role in ('anon', 'authenticated') and not public.is_admin() then
    raise exception 'Unauthorized: usage mutations must be performed via the authoritative server';
  end if;

  -- Resolve role from user_roles if present
  select r.role into v_role
  from public.user_roles r
  where r.user_id = p_user_id;

  if v_role is null then
    v_role := 'member';
  end if;

  if v_role = 'admin' then
    return jsonb_build_object(
      'allowed', true,
      'role', 'admin',
      'daily_count', 0,
      'daily_limit', p_daily_limit,
      'monthly_count', 0,
      'monthly_limit', p_monthly_limit,
      'day_key', v_day_key,
      'month_key', v_month_key
    );
  end if;

  -- Ensure rows exist for current day and month
  insert into public.user_usages (user_id, app, metric, period_type, period_key, count, usage_limit)
  values
    (p_user_id, p_app, p_metric, 'daily', v_day_key, 0, greatest(0, p_daily_limit)),
    (p_user_id, p_app, p_metric, 'monthly', v_month_key, 0, greatest(0, p_monthly_limit))
  on conflict (user_id, app, metric, period_type, period_key) do nothing;

  -- Lock current rows for atomic evaluation
  select count, usage_limit
    into v_daily_count, v_effective_daily_limit
  from public.user_usages
  where user_id = p_user_id
    and app = p_app
    and metric = p_metric
    and period_type = 'daily'
    and period_key = v_day_key
  for update;

  select count, usage_limit
    into v_monthly_count, v_effective_monthly_limit
  from public.user_usages
  where user_id = p_user_id
    and app = p_app
    and metric = p_metric
    and period_type = 'monthly'
    and period_key = v_month_key
  for update;

  if v_effective_daily_limit <= 0 then
    v_effective_daily_limit := greatest(0, p_daily_limit);
  end if;
  if v_effective_monthly_limit <= 0 then
    v_effective_monthly_limit := greatest(0, p_monthly_limit);
  end if;

  -- Check if adding p_amount would exceed limits (when p_amount > 0)
  if p_amount > 0 then
    if (v_daily_count + p_amount) > v_effective_daily_limit then
      v_allowed := false;
      v_exceeded_type := 'daily';
    elsif (v_monthly_count + p_amount) > v_effective_monthly_limit then
      v_allowed := false;
      v_exceeded_type := 'monthly';
    else
      v_daily_count := v_daily_count + p_amount;
      v_monthly_count := v_monthly_count + p_amount;

      update public.user_usages
      set count = v_daily_count,
          usage_limit = v_effective_daily_limit,
          updated_at = timezone('utc'::text, now())
      where user_id = p_user_id
        and app = p_app
        and metric = p_metric
        and period_type = 'daily'
        and period_key = v_day_key;

      update public.user_usages
      set count = v_monthly_count,
          usage_limit = v_effective_monthly_limit,
          updated_at = timezone('utc'::text, now())
      where user_id = p_user_id
        and app = p_app
        and metric = p_metric
        and period_type = 'monthly'
        and period_key = v_month_key;
    end if;
  else
    v_allowed := (v_daily_count < v_effective_daily_limit) and (v_monthly_count < v_effective_monthly_limit);
    if v_daily_count >= v_effective_daily_limit then
      v_exceeded_type := 'daily';
    elsif v_monthly_count >= v_effective_monthly_limit then
      v_exceeded_type := 'monthly';
    end if;
  end if;

  return jsonb_build_object(
    'allowed', v_allowed,
    'role', v_role,
    'daily_count', v_daily_count,
    'daily_limit', v_effective_daily_limit,
    'monthly_count', v_monthly_count,
    'monthly_limit', v_effective_monthly_limit,
    'exceeded_type', v_exceeded_type,
    'day_key', v_day_key,
    'month_key', v_month_key
  );
end;
$$;

revoke execute on function public.increment_user_usage(uuid, text, text, bigint, bigint, bigint) from public, anon, authenticated;
grant execute on function public.increment_user_usage(uuid, text, text, bigint, bigint, bigint) to service_role;

-- ------------------------------------------------------------------------------
-- 4. media_files table
-- ------------------------------------------------------------------------------
create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  path text not null unique,
  url text not null,
  type text not null default 'file' check (type in ('image', 'pdf', 'docx', 'file')),
  mime_type text not null default 'application/octet-stream',
  size bigint not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.media_files enable row level security;

create index if not exists media_files_user_created_idx
  on public.media_files (user_id, created_at desc);

do $do$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'media_files' and policyname = 'Users can view their own media'
  ) then
    create policy "Users can view their own media"
      on public.media_files
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'media_files' and policyname = 'Users can insert their own media'
  ) then
    create policy "Users can insert their own media"
      on public.media_files
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'media_files' and policyname = 'Users can update their own media'
  ) then
    create policy "Users can update their own media"
      on public.media_files
      for update
      to authenticated
      using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'media_files' and policyname = 'Users can delete their own media'
  ) then
    create policy "Users can delete their own media"
      on public.media_files
      for delete
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end
$do$;

-- ------------------------------------------------------------------------------
-- 5. support_tickets table
-- ------------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  type text not null default 'general_support' check (type in ('bug_report', 'recommendation', 'general_support')),
  app text not null default 'machi-asia',
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.support_tickets enable row level security;

create index if not exists support_tickets_user_created_idx
  on public.support_tickets (user_id, created_at desc);

do $do$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'support_tickets' and policyname = 'Users can view their own tickets'
  ) then
    create policy "Users can view their own tickets"
      on public.support_tickets
      for select
      to authenticated
      using ((select auth.uid()) = user_id or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'support_tickets' and policyname = 'Users can insert their own tickets'
  ) then
    create policy "Users can insert their own tickets"
      on public.support_tickets
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id or user_id is null);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'support_tickets' and policyname = 'Admins can update tickets'
  ) then
    create policy "Admins can update tickets"
      on public.support_tickets
      for update
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$do$;

-- ------------------------------------------------------------------------------
-- 6. issue_reports table & get_community_overrides RPC
-- ------------------------------------------------------------------------------
create table if not exists public.issue_reports (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  item_id text not null,
  item_name text not null,
  issue_type text not null,
  description text,
  suggested_fix text,
  reporter_hash text not null,
  corrections jsonb not null default '{}'::jsonb,
  consensus_key text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'rejected')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.issue_reports enable row level security;

create index if not exists issue_reports_game_status_idx
  on public.issue_reports (game_id, status, created_at desc);

create index if not exists issue_reports_consensus_idx
  on public.issue_reports (game_id, consensus_key);

do $do$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'issue_reports' and policyname = 'Anyone can submit issue reports'
  ) then
    create policy "Anyone can submit issue reports"
      on public.issue_reports
      for insert
      to anon, authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'issue_reports' and policyname = 'Admins can view and manage issue reports'
  ) then
    create policy "Admins can view and manage issue reports"
      on public.issue_reports
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$do$;

create or replace function public.get_community_overrides(p_game_id text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'game_id', sub.game_id,
        'item_id', sub.item_id,
        'item_name', sub.item_name,
        'issue_type', sub.issue_type,
        'corrections', sub.corrections,
        'reporter_count', sub.reporter_count
      )
    ),
    '[]'::jsonb
  )
  from (
    select
      game_id,
      item_id,
      max(item_name) as item_name,
      max(issue_type) as issue_type,
      (array_agg(corrections order by created_at desc))[1] as corrections,
      count(distinct reporter_hash) as reporter_count
    from public.issue_reports
    where game_id = p_game_id
      and status in ('pending', 'resolved')
    group by game_id, item_id, consensus_key
    having count(distinct reporter_hash) >= 2 or bool_or(status = 'resolved')
  ) sub;
$$;
