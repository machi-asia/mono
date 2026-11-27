-- ==============================================================================
-- Migration: 20261121010000_mmm_notes_uoweme_tables.sql
-- Description: Creates tables for MMM (mmm.machi.asia), Machi Notes
--              (notes.machi.asia), and U Owe Me (uoweme.machi.asia) with
--              RLS, FK indexes, triggers, and role grants.
-- ==============================================================================

-- ── 1. MMM (Minecraft Mod Manager) ────────────────────────────────────────────

create table if not exists public.mmm_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text not null default '',
  invite_code text not null unique,
  minecraft_version text not null default '1.20.1',
  modloader text not null default 'fabric' check (modloader in ('fabric', 'forge', 'neoforge', 'quilt')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.mmm_organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.mmm_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default timezone('utc'::text, now()),
  unique (organization_id, user_id)
);

create table if not exists public.mmm_mod_lists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.mmm_organizations(id) on delete cascade,
  name text not null default 'Main Modpack',
  description text not null default '',
  is_default boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.mmm_mods (
  id uuid primary key default gen_random_uuid(),
  mod_list_id uuid not null references public.mmm_mod_lists(id) on delete cascade,
  modrinth_id text not null,
  modrinth_slug text not null default '',
  name text not null,
  summary text not null default '',
  icon_url text not null default '',
  author text not null default '',
  download_url text not null,
  filename text not null,
  version_number text not null default '',
  minecraft_version text not null default '',
  modloader text not null default '',
  dependencies jsonb not null default '[]'::jsonb,
  added_at timestamptz not null default timezone('utc'::text, now()),
  added_by uuid references auth.users(id) on delete set null,
  unique (mod_list_id, modrinth_id)
);

create table if not exists public.mmm_mod_history (
  id uuid primary key default gen_random_uuid(),
  mod_list_id uuid not null references public.mmm_mod_lists(id) on delete cascade,
  action text not null check (action in ('add', 'remove', 'update')),
  mod_name text not null,
  modrinth_id text not null default '',
  previous_version text not null default '',
  new_version text not null default '',
  message text not null default '',
  performed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_mmm_org_invite on public.mmm_organizations (invite_code);
create index if not exists idx_mmm_org_created_by on public.mmm_organizations (created_by);
create index if not exists idx_mmm_org_members_user on public.mmm_organization_members (user_id);
create index if not exists idx_mmm_org_members_org on public.mmm_organization_members (organization_id);
create index if not exists idx_mmm_mod_lists_org on public.mmm_mod_lists (organization_id);
create index if not exists idx_mmm_mods_list on public.mmm_mods (mod_list_id);
create index if not exists idx_mmm_mods_added_by on public.mmm_mods (added_by);
create index if not exists idx_mmm_history_list on public.mmm_mod_history (mod_list_id, created_at desc);
create index if not exists idx_mmm_history_performed_by on public.mmm_mod_history (performed_by);

alter table public.mmm_organizations enable row level security;
alter table public.mmm_organization_members enable row level security;
alter table public.mmm_mod_lists enable row level security;
alter table public.mmm_mods enable row level security;
alter table public.mmm_mod_history enable row level security;

do $do$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organizations' and policyname='Anyone can view mmm organizations') then
    create policy "Anyone can view mmm organizations" on public.mmm_organizations for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organizations' and policyname='Authenticated users can create mmm organizations') then
    create policy "Authenticated users can create mmm organizations" on public.mmm_organizations for insert to authenticated with check ((select auth.uid()) = created_by);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organizations' and policyname='Org admins can update mmm organizations') then
    create policy "Org admins can update mmm organizations" on public.mmm_organizations for update to authenticated
      using ((select auth.uid()) = created_by or exists (select 1 from public.mmm_organization_members m where m.organization_id = id and m.user_id = (select auth.uid()) and m.role in ('owner', 'admin')))
      with check ((select auth.uid()) = created_by or exists (select 1 from public.mmm_organization_members m where m.organization_id = id and m.user_id = (select auth.uid()) and m.role in ('owner', 'admin')));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organizations' and policyname='Org owners can delete mmm organizations') then
    create policy "Org owners can delete mmm organizations" on public.mmm_organizations for delete to authenticated
      using ((select auth.uid()) = created_by or exists (select 1 from public.mmm_organization_members m where m.organization_id = id and m.user_id = (select auth.uid()) and m.role = 'owner'));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organization_members' and policyname='Anyone can view mmm members') then
    create policy "Anyone can view mmm members" on public.mmm_organization_members for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organization_members' and policyname='Authenticated users can join mmm organizations') then
    create policy "Authenticated users can join mmm organizations" on public.mmm_organization_members for insert to authenticated with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_organization_members' and policyname='Users can leave or owners remove mmm members') then
    create policy "Users can leave or owners remove mmm members" on public.mmm_organization_members for delete to authenticated
      using ((select auth.uid()) = user_id or exists (select 1 from public.mmm_organization_members owner_mem where owner_mem.organization_id = organization_id and owner_mem.user_id = (select auth.uid()) and owner_mem.role in ('owner', 'admin')));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mod_lists' and policyname='Anyone can view mmm mod lists') then
    create policy "Anyone can view mmm mod lists" on public.mmm_mod_lists for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mod_lists' and policyname='Org members can insert mmm mod lists') then
    create policy "Org members can insert mmm mod lists" on public.mmm_mod_lists for insert to authenticated
      with check (exists (select 1 from public.mmm_organizations o where o.id = organization_id and o.created_by = (select auth.uid())) or exists (select 1 from public.mmm_organization_members mem where mem.organization_id = organization_id and mem.user_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mod_lists' and policyname='Org members can update mmm mod lists') then
    create policy "Org members can update mmm mod lists" on public.mmm_mod_lists for update to authenticated
      using (exists (select 1 from public.mmm_organization_members mem where mem.organization_id = organization_id and mem.user_id = (select auth.uid())))
      with check (exists (select 1 from public.mmm_organization_members mem where mem.organization_id = organization_id and mem.user_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mod_lists' and policyname='Org members can delete mmm mod lists') then
    create policy "Org members can delete mmm mod lists" on public.mmm_mod_lists for delete to authenticated
      using (exists (select 1 from public.mmm_organization_members mem where mem.organization_id = organization_id and mem.user_id = (select auth.uid())));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mods' and policyname='Anyone can view mmm mods') then
    create policy "Anyone can view mmm mods" on public.mmm_mods for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mods' and policyname='Org members can insert mmm mods') then
    create policy "Org members can insert mmm mods" on public.mmm_mods for insert to authenticated
      with check (exists (select 1 from public.mmm_mod_lists ml join public.mmm_organization_members mem on mem.organization_id = ml.organization_id where ml.id = mod_list_id and mem.user_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mods' and policyname='Org members can update mmm mods') then
    create policy "Org members can update mmm mods" on public.mmm_mods for update to authenticated
      using (exists (select 1 from public.mmm_mod_lists ml join public.mmm_organization_members mem on mem.organization_id = ml.organization_id where ml.id = mod_list_id and mem.user_id = (select auth.uid())))
      with check (exists (select 1 from public.mmm_mod_lists ml join public.mmm_organization_members mem on mem.organization_id = ml.organization_id where ml.id = mod_list_id and mem.user_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mods' and policyname='Org members can delete mmm mods') then
    create policy "Org members can delete mmm mods" on public.mmm_mods for delete to authenticated
      using (exists (select 1 from public.mmm_mod_lists ml join public.mmm_organization_members mem on mem.organization_id = ml.organization_id where ml.id = mod_list_id and mem.user_id = (select auth.uid())));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mod_history' and policyname='Anyone can view mmm mod history') then
    create policy "Anyone can view mmm mod history" on public.mmm_mod_history for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='mmm_mod_history' and policyname='Org members can insert mmm mod history') then
    create policy "Org members can insert mmm mod history" on public.mmm_mod_history for insert to authenticated
      with check (exists (select 1 from public.mmm_mod_lists ml join public.mmm_organization_members mem on mem.organization_id = ml.organization_id where ml.id = mod_list_id and mem.user_id = (select auth.uid())));
  end if;
end
$do$;

grant select on public.mmm_organizations to anon, authenticated;
grant insert, update, delete on public.mmm_organizations to authenticated;
grant select on public.mmm_organization_members to anon, authenticated;
grant insert, delete on public.mmm_organization_members to authenticated;
grant select on public.mmm_mod_lists to anon, authenticated;
grant insert, update, delete on public.mmm_mod_lists to authenticated;
grant select on public.mmm_mods to anon, authenticated;
grant insert, update, delete on public.mmm_mods to authenticated;
grant select on public.mmm_mod_history to anon, authenticated;
grant insert on public.mmm_mod_history to authenticated;

-- ── 2. Machi Notes (QuickNote) ───────────────────────────────────────────────

create table if not exists public.quicknote_notes (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Note'
    check (length(trim(title)) > 0 and length(title) <= 200),
  content text not null default ''
    check (length(content) <= 50000),
  tags text[] not null default '{}',
  folder text not null default '',
  order_index integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_quicknote_user_id on public.quicknote_notes (user_id);
create index if not exists idx_quicknote_created_at on public.quicknote_notes (created_at desc);
create index if not exists idx_quicknote_tags on public.quicknote_notes using gin (tags);
create index if not exists idx_quicknote_user_folder_order on public.quicknote_notes (user_id, folder, order_index);

create or replace function public.quicknote_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create or replace trigger trg_quicknote_updated_at
  before update on public.quicknote_notes
  for each row
  execute function public.quicknote_set_updated_at();

alter table public.quicknote_notes enable row level security;

create table if not exists public.quicknote_note_relations (
  note_id bigint not null references public.quicknote_notes(id) on delete cascade,
  related_note_id bigint not null references public.quicknote_notes(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (note_id, related_note_id),
  constraint no_self_relation check (note_id <> related_note_id)
);

create index if not exists idx_qn_relations_note_id on public.quicknote_note_relations (note_id);
create index if not exists idx_qn_relations_related_note_id on public.quicknote_note_relations (related_note_id);

alter table public.quicknote_note_relations enable row level security;

do $do$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_notes' and policyname='Users can view own notes') then
    create policy "Users can view own notes" on public.quicknote_notes for select to authenticated using ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_notes' and policyname='Users can insert own notes') then
    create policy "Users can insert own notes" on public.quicknote_notes for insert to authenticated with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_notes' and policyname='Users can update own notes') then
    create policy "Users can update own notes" on public.quicknote_notes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_notes' and policyname='Users can delete own notes') then
    create policy "Users can delete own notes" on public.quicknote_notes for delete to authenticated using ((select auth.uid()) = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_note_relations' and policyname='Users can view own note relations') then
    create policy "Users can view own note relations" on public.quicknote_note_relations for select to authenticated
      using (exists (select 1 from public.quicknote_notes n where n.id = note_id and n.user_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_note_relations' and policyname='Users can insert own note relations') then
    create policy "Users can insert own note relations" on public.quicknote_note_relations for insert to authenticated
      with check (exists (select 1 from public.quicknote_notes n where n.id = note_id and n.user_id = (select auth.uid())) and exists (select 1 from public.quicknote_notes n where n.id = related_note_id and n.user_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quicknote_note_relations' and policyname='Users can delete own note relations') then
    create policy "Users can delete own note relations" on public.quicknote_note_relations for delete to authenticated
      using (exists (select 1 from public.quicknote_notes n where n.id = note_id and n.user_id = (select auth.uid())));
  end if;
end
$do$;

grant select, insert, update, delete on public.quicknote_notes to authenticated;
grant usage, select on sequence public.quicknote_notes_id_seq to authenticated;
grant select, insert, delete on public.quicknote_note_relations to authenticated;

-- ── 3. U Owe Me ───────────────────────────────────────────────────────────────

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person text not null,
  amount numeric(12, 2) not null check (amount > 0),
  direction text not null check (direction in ('they_owe_me', 'i_owe_them')),
  note text not null default '',
  date date not null default current_date,
  due_date date,
  settled boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_debts_user_id on public.debts (user_id, created_at desc);
create index if not exists idx_debts_person_lower on public.debts (lower(person));

alter table public.debts enable row level security;

do $do$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='debts' and policyname='Users can view relevant debts') then
    create policy "Users can view relevant debts" on public.debts for select to authenticated
      using ((select auth.uid()) = user_id or public.is_admin() or lower(person) = lower(coalesce((select auth.jwt() ->> 'email'), '')));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='debts' and policyname='Authenticated users can insert own debts') then
    create policy "Authenticated users can insert own debts" on public.debts for insert to authenticated
      with check ((select auth.uid()) = user_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='debts' and policyname='Owners or admins can update debts') then
    create policy "Owners or admins can update debts" on public.debts for update to authenticated
      using ((select auth.uid()) = user_id or public.is_admin())
      with check ((select auth.uid()) = user_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='debts' and policyname='Owners or admins can delete debts') then
    create policy "Owners or admins can delete debts" on public.debts for delete to authenticated
      using ((select auth.uid()) = user_id or public.is_admin());
  end if;
end
$do$;

grant select, insert, update, delete on public.debts to authenticated;
