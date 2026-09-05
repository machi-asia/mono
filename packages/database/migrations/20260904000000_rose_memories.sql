-- ==============================================================================
-- Migration: 20260904000000_rose_memories.sql
-- Description: Creates the rose_memories table for Rose AI agent's long-term memory system.
-- Follows supabase-postgres-best-practices:
--   - bigint generated always as identity primary key
--   - timestamptz for time values with timezone
--   - text for unbounded strings
--   - RLS enabled with (select auth.uid()) = user_id performance optimization
--   - Composite index on (user_id, created_at desc)
-- ==============================================================================

create table if not exists public.rose_memories (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  category text not null default 'general',
  importance text not null default 'medium',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.rose_memories enable row level security;

-- Index for querying recent memories by user_id
create index if not exists rose_memories_user_created_idx
  on public.rose_memories (user_id, created_at desc);

-- RLS: Allow authenticated users to view only their own memories
-- Using (select auth.uid()) to avoid re-evaluating auth.uid() per row
create policy "Users can view their own memories"
  on public.rose_memories
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- RLS: Allow authenticated users to insert their own memories
create policy "Users can insert their own memories"
  on public.rose_memories
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- RLS: Allow authenticated users to update their own memories
create policy "Users can update their own memories"
  on public.rose_memories
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- RLS: Allow authenticated users to delete their own memories
create policy "Users can delete their own memories"
  on public.rose_memories
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
