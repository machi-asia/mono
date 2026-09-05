-- ==============================================================================
-- Migration: 20260904000001_rose_personalization.sql
-- Description: Creates the rose_personalization table for user custom instructions & tone.
-- Follows supabase-postgres-best-practices:
--   - user_id uuid primary key references auth.users(id) on delete cascade
--   - timestamptz for time values with timezone
--   - text for unbounded custom instructions, nickname, and tone
--   - RLS enabled with (select auth.uid()) = user_id performance optimization
-- ==============================================================================

create table if not exists public.rose_personalization (
  user_id uuid primary key references auth.users(id) on delete cascade,
  custom_instructions text not null default '',
  nickname text,
  tone text,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.rose_personalization enable row level security;

-- RLS: Allow authenticated users to view only their own personalization
create policy "Users can view their own personalization"
  on public.rose_personalization
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- RLS: Allow authenticated users to insert their own personalization
create policy "Users can insert their own personalization"
  on public.rose_personalization
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- RLS: Allow authenticated users to update their own personalization
create policy "Users can update their own personalization"
  on public.rose_personalization
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- RLS: Allow authenticated users to delete their own personalization
create policy "Users can delete their own personalization"
  on public.rose_personalization
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
