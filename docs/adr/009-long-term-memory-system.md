# ADR 009: Long-Term Memory System for Rose AI Agent

## Status

Accepted

## Context

The Rose AI Agent (`@mono/rose`) requires persistence for user preferences, facts, and ongoing context across distinct chat sessions. Without long-term memory, every session begins without prior awareness of the user's specific guidelines, background, or historical interactions, leading to redundant queries and reduced conversational coherence.

Additionally:
- Database operations must be executed strictly on the server side (`@mono/database/server`) per Repository Rule 4 and Rule 17.
- Monorepo Rule 15 mandates that database schema changes target the canonical Supabase project (`https://zyatzdkapdqngwyhiqqn.supabase.co`).
- Postgres table designs must follow best practices (`supabase-postgres-best-practices`): 64-bit integer identity primary keys, timezone-aware timestamps, performant RLS caching `(select auth.uid())`, and compound indexes.

## Decision

1. **Database Schema (`rose_memories`)**:
   - `id`: `bigint generated always as identity primary key` (avoids UUIDv4 index fragmentation and reduces B-tree memory footprint).
   - `user_id`: `uuid not null references auth.users(id) on delete cascade`.
   - `content`: `text not null`.
   - `category`: `text not null default 'general'` (e.g. `'preference'`, `'fact'`, `'instruction'`).
   - `importance`: `text not null default 'medium'` (`'low'`, `'medium'`, `'high'`).
   - `metadata`: `jsonb not null default '{}'::jsonb`.
   - `created_at` / `updated_at`: `timestamp with time zone not null default timezone('utc'::text, now())`.
   - **Composite Index**: `(user_id, created_at desc)` for efficient retrieval of the latest memories per user.
   - **Row Level Security (RLS)**: Enforced with `((select auth.uid()) = user_id)` to cache auth evaluation per query rather than re-evaluating for every row.

2. **Server-Side Data Access Layer (`@mono/database`)**:
   - Added `saveMemory` and `listMemories` helper functions exported from `@mono/database`.
   - Uses server Supabase client (`createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)`) on server actions and route handlers.

3. **Agent Integration (`@mono/rose`)**:
   - Implemented `rememberTool` with structured parameters: `content` (string), `category` (enum), and `importance` (enum).
   - Added `setRememberToolContext` and `clearRememberToolContext` for associating current `userId` and Supabase clients during request handling with automatic teardown in `finally` blocks.
   - Fallback local in-memory store for guest/test sessions.
   - Auto-injection of the 10 most recent user memories into the system prompt context in `handleRoseChat` (`[Context: Long-Term User Memories & Preferences]`).
   - Tool calling parsing supports both native Groq/Gemini function call outputs and embedded text tool call invocations (`{"tool": "remember", "parameters": ...}`).

## Consequences

### Positive
- Cross-session memory allows Rose to personalize interactions and retain user preferences.
- Postgres best practices guarantee optimal query execution, minimal index bloat, and fast RLS evaluation.
- Architecture adheres to strict server-side boundaries; clients cannot directly mutate or query memories without server validation.

### Negative / Trade-offs
- Prompt token usage slightly increases as memories are injected into active context (bounded by top 10 limit).
- Requires execution of migration `20260904000000_rose_memories.sql` on the canonical Supabase project.
