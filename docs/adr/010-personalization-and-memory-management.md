# ADR 010: Rose Settings - Personalization and Memories Management

## Status

Accepted

## Context

Users require explicit visibility and control over how the Rose AI agent interacts with them, including:
1. **Personalization**: User preferences such as preferred nickname/name, personality and tone style (e.g. "Warm & Helpful", "Concise & Direct"), and persistent custom instructions across conversations.
2. **Memories Management**: Direct inspection and management (view, add, edit, delete) of facts and preferences stored in the long-term memory system (`rose_memories`).
3. **Pervasive Application**: Both personalization and active memories must steer Rose's behavior across all chat sessions and prompts.
4. **Placement**: A dedicated Settings trigger button must be located under the conversations list in the sidebar.

## Decision

1. **Database Schema (`rose_personalization`)**:
   - `user_id`: `uuid primary key references auth.users(id) on delete cascade` (1 row per user).
   - `custom_instructions`: `text not null default ''`.
   - `nickname`: `text`.
   - `tone`: `text`.
   - `created_at` / `updated_at`: `timestamptz`.
   - **Row Level Security (RLS)**: Enforced with `((select auth.uid()) = user_id)` on `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

2. **Data Layer (`@mono/database`)**:
   - Added `updateMemory` and `deleteMemory` for memory mutations.
   - Added `getPersonalization` and `savePersonalization` (upsert on `user_id`).
   - Server-only execution per Monorepo Rule 4 and Rule 17.

3. **Prompt Augmentation (`handleRoseChat` in `@mono/rose/server`)**:
   - On chat turn initiation, fetches both `personalization` and active user `memories`.
   - Constructs structured system context:
     - `[Context: User Personalization & Preferences]` with nickname, tone, and custom instructions.
     - `[Context: Long-Term User Memories & Knowledge]` with recent memories.
   - Injects the combined context into the conversational history so all generated responses follow user preferences and stored knowledge.

4. **UI Components (`@mono/rose`)**:
   - Added fixed footer to conversations sidebar with a **Settings** button (`<Settings size={15} /> Settings`).
   - Created `<RoseSettingsModal />` featuring:
     - **Personalization Tab**: Inputs for nickname, tone style selector, custom instructions textarea, and circular help Tooltips (`<Tooltip variant="help">`).
     - **Memories Tab**: List of memories with category and importance tags, inline edit mode, delete confirmation, and an "Add Memory" form.
     - Offline / Guest fallback using `localStorage` for graceful degradation without backend credentials.

## Consequences

### Positive
- Users gain granular control over agent persona, tone, and memory contents.
- Direct ability to add, edit, or remove memories prevents stale or incorrect information from persisting.
- Consistent prompt steering across all conversations without requiring manual re-prompting.

### Negative / Trade-offs
- Adding personalization details to prompt context consumes additional input tokens.
