-- ==============================================================================
-- Migration: 20261121000000_terraprice_datasets.sql
-- Description: Creates public.terraprice_datasets for TerraPrice regional
--              commodity price datasets and neural network retraining.
-- Follows supabase-postgres-best-practices:
--   - RLS enabled with (select auth.uid()) optimization
--   - Explicit TO anon / authenticated policies (never deprecated auth.role())
--   - UPDATE / ALL policies include both USING and WITH CHECK
--   - Indexes on created_at/id and category/commodity
-- ==============================================================================

create table if not exists public.terraprice_datasets (
  id bigserial primary key,
  latitude double precision not null check (latitude between 4.2158 and 21.321),
  longitude double precision not null check (longitude between 116.87 and 126.605),
  category text not null,
  commodity text not null,
  pricetype text not null check (pricetype in ('Retail', 'Wholesale', 'retail', 'wholesale')),
  price numeric(12, 2) not null check (price >= 0),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.terraprice_datasets enable row level security;

create index if not exists terraprice_datasets_created_id_idx
  on public.terraprice_datasets (created_at desc, id desc);

create index if not exists terraprice_datasets_category_commodity_idx
  on public.terraprice_datasets (category, commodity);

do $do$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'terraprice_datasets' and policyname = 'Public can read terraprice datasets'
  ) then
    create policy "Public can read terraprice datasets"
      on public.terraprice_datasets
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'terraprice_datasets' and policyname = 'Authenticated users can insert terraprice datasets'
  ) then
    create policy "Authenticated users can insert terraprice datasets"
      on public.terraprice_datasets
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'terraprice_datasets' and policyname = 'Admins can manage terraprice datasets'
  ) then
    create policy "Admins can manage terraprice datasets"
      on public.terraprice_datasets
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$do$;

grant select on public.terraprice_datasets to anon, authenticated;
grant insert on public.terraprice_datasets to authenticated;
grant usage, select on sequence public.terraprice_datasets_id_seq to authenticated;
