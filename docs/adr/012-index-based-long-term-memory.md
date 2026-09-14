# ADR 012: Index-Based Long-Term Memory for Rose

- **Status**: Accepted
- **Date**: 2026-09-12
- **Supersedes**: ADR 009 (Long-Term Memory), ADR 010 (Personalization and Memory Management, memory portions)

## Context

Rose's long-term memory was previously an append-only list of discrete facts. Each chat turn injected up to 10 full memory rows into the system prompt, which bloated token usage, produced near-duplicate facts under free-text `category` labels, and never guaranteed that the agent had the *exact* details it needed. Updating a fact meant remembering an arbitrary stored record, and the database had no constraint preventing duplicate `content` for the same `(user_id, category)` pair.

We need a model that is cheap to prompt, deterministic to query, and unambiguous to update: **one index, one full description**, with a compact per-turn index list and on-demand recall.

## Decision

Long-term memory becomes an **index-based key-value map** per user, built on the existing `rose_memories` table:

- **Index** = the `category` column. Unique per `(user_id, category)`. Lowercased, trimmed, human-meaningful (e.g. `portfolio`, `preferences`, `projects`, `goals`, `allergies`).
- **Description** = the full `content` stored under the index. Whole description is replaced on edit — there is no per-sentence merge.
- **Importance** = `'low' | 'medium' | 'high'` (text), stock value `'medium'`.

### Agent tools (exactly four)

| Tool | Verb | Semantics |
|------|------|-----------|
| `learn` | WRITE | Create a new index. Errors if the index already exists. |
| `recall` | READ | Return the full description stored under an index. Errors if missing. |
| `remember` | EDIT | Replace the description of an existing index; optional `newIndex` renames the index. |
| `forget` | DELETE | Remove an index and its description. Idempotent. |

### Per-turn context

`handleRoseChat` injects a compact index list instead of full memories:

```
[Memory Indexes (n)]
- preference: User prefers dark mode...
- portfolio: Modern growth portfolio...
- goals: ...
...
```

Each row is the **index plus a short excerpt** (≈120 chars). The agent always sees every index each prompt; when it needs details it calls `recall('<index>')` with the exact index. Building this context is centralized in `packages/rose/src/agent/memoryContext.ts` (`buildMemoryIndexContext`).

### Database

- `@mono/database` exports index-based helpers: `createMemory`, `getMemoryByIndex`, `updateMemoryByIndex`, `deleteMemoryByIndex`, `listMemoryIndexes` (+ normalization helpers). Old `saveMemory`/`listMemories`/`updateMemory`/`deleteMemory` exports were removed.
- A dedicated **unique index** `(user_id, category)` enforces one description per index and is required before the canonical project can serve the new model.
- Migration `20260912000000_rose_memory_index_map.sql` converts `importance` from `integer` (1/2/3) to `text` (`low`/`medium`/`high`), creates the unique `(user_id, category)` index, and adds a CHECK constraint on importance values.
- Shared tool execution (`packages/rose/src/agent/tools/memory-store.ts`) resolves the Supabase client server-side (`SUPABASE_SECRET_KEY` or server publishable key) with an in-memory fallback map for guest/test sessions — no client component ever touches the database.

### Server

`packages/rose/src/server/chat.ts` (`handleRoseChat`) and `packages/rose/src/server/settings.ts` (`handleRoseSettings`) drive the model; `server.ts` is a thin re-export (`getAuthUser`, `handleRoseChat`, `handleRoseSettings`, `handleRoseUsage`, `handleRoseTranscribe`) decomposed into feature submodules so no file exceeds 500 lines.

### UI (Settings modal)

The Memories tab labels the field **Memory Index**, lists indexes with importance tags, and supports add (index + description + importance), inline edit, rename, and delete — all sending `index`/`newIndex` payloads to `/api/rose/settings`.

## Consequences

- **Pros**: prompt stays small (index list scales with fewer tokens than full records); deterministic recall; simple update/delete semantics; duplicates prevented at the DB level; bounded scope per tool.
- **Cons**: mutually-exclusive facts in one topic must live under separate indexes; editing one fact replaces the entire description; existing users' integer-importance rows must be migrated.
- Migration `20260912000000_rose_memory_index_map.sql` has been applied to the canonical Supabase project (`zyatzdkapdqngwyhiqqn.supabase.co`) on 2026-09-12.