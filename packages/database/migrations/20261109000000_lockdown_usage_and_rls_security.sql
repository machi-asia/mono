-- ==============================================================================
-- Migration: 20261109000000_lockdown_usage_and_rls_security.sql
-- Description: Hardens public.user_usages and public.increment_user_usage so
--              clients using the publishable/anon key can never manipulate or
--              reset their usage counts, limits, or roles.
-- ==============================================================================

-- 1. Drop legacy client INSERT/UPDATE policies on public.user_usages
drop policy if exists "Users can upsert their own usages" on public.user_usages;
drop policy if exists "Users can update their own usages" on public.user_usages;

-- 2. Widen metric check constraint to support dynamic component metrics (safe identifier format)
--    and enforce non-negative count and usage_limit constraints.
alter table public.user_usages
  drop constraint if exists user_usages_metric_check;

alter table public.user_usages
  add constraint user_usages_metric_check
  check (char_length(metric) between 1 and 64 and metric ~ '^[a-z0-9_:-]+$');

alter table public.user_usages
  drop constraint if exists user_usages_count_non_negative;

alter table public.user_usages
  add constraint user_usages_count_non_negative
  check (count >= 0);

-- 3. Ensure only Admins (or service_role bypassing RLS) can mutate user_usages directly
do $do$
begin
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

-- 4. Harden increment_user_usage RPC and restrict execution to service_role
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
  if p_amount < 0 then
    raise exception 'Invalid negative usage increment: p_amount must be >= 0';
  end if;

  if v_jwt_role in ('anon', 'authenticated') and not public.is_admin() then
    raise exception 'Unauthorized: usage mutations must be performed via the authoritative server';
  end if;

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

  insert into public.user_usages (user_id, app, metric, period_type, period_key, count, usage_limit)
  values
    (p_user_id, p_app, p_metric, 'daily', v_day_key, 0, greatest(0, p_daily_limit)),
    (p_user_id, p_app, p_metric, 'monthly', v_month_key, 0, greatest(0, p_monthly_limit))
  on conflict (user_id, app, metric, period_type, period_key) do nothing;

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
