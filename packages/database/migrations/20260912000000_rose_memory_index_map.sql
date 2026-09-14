-- ==============================================================================
-- Migration: 20260912000000_rose_memory_index_map.sql
-- Description: Aligns rose_memories with the index-based long-term memory model.
--   1. Converts importance from integer (1/2/3) to text ('low'/'medium'/'high').
--   2. Enforces uniqueness of (user_id, category) so 1 index = 1 description.
--   3. Adds a check constraint on the importance values.
-- Safe to run against the canonical project (zyatzdkapdqngwyhiqqn.supabase.co).
-- ==============================================================================

-- 1) Migrate importance to text if it is still integer (idempotent)
do $do$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'rose_memories'
      and column_name = 'importance'
      and data_type = 'integer'
  ) then
    alter table public.rose_memories
      alter column importance drop default;

    alter table public.rose_memories
      alter column importance type text
        using (
          case importance
            when 1 then 'medium'
            when 2 then 'high'
            when 3 then 'high'
            else 'medium'
          end
        );

    alter table public.rose_memories
      alter column importance set default 'medium';
  end if;
end
$do$;

-- 2) Enforce one description per user per index
create unique index if not exists rose_memories_user_category_idx
  on public.rose_memories (user_id, category);

-- 3) Constrain importance to the supported levels
do $do$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'rose_memories_importance_check'
      and conrelid = 'public.rose_memories'::regclass
  ) then
    alter table public.rose_memories
      drop constraint rose_memories_importance_check;
  end if;

  alter table public.rose_memories
    add constraint rose_memories_importance_check
      check (importance in ('low', 'medium', 'high'));
end
$do$;