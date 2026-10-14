/**
 * # QuickNote Feature Data
 *
 * > [!NOTE]
 * > QuickNote is a private per-user Markdown notes system backed by Supabase.
 * > Notes are stored in `public.quicknote_notes` with full RLS (owner-only access).
 *
 * | Feature | Detail |
 * |---|---|
 * | **Storage** | Supabase `public.quicknote_notes` table |
 * | **Auth Required** | Yes — all CRUD operations require authentication |
 * | **Graph Algorithm** | Tag-based SVG graph (shared tags create note connections) |
 * | **Markdown** | Rendered via `react-markdown` + `remark-gfm` |
 * | **Max Note Size** | 50,000 characters per note |
 * | **Max Title Size** | 200 characters |
 */

/**
 * A description of the QuickNote feature for use in agent tools and wiki articles.
 */
export const quickNoteFeatureDescription = `QuickNote is a private, per-user Markdown notes application accessible at /sites/quicknote.

## Features
- **Create & Edit**: Write notes in Markdown with a live split-pane preview
- **Tags**: Assign comma-separated tags to categorize and connect notes
- **Graph View**: An SVG-based interactive graph shows notes as nodes; notes sharing at least one tag are connected by edges
- **Private**: All notes are owner-private, enforced at the database level via Row-Level Security
- **Storage**: Notes are persisted in the Supabase \`public.quicknote_notes\` table

## Schema
| Column | Type | Constraint |
|---|---|---|
| \`id\` | bigint | PK, generated always as identity |
| \`user_id\` | uuid | FK → auth.users, on delete cascade |
| \`title\` | text | non-empty, ≤ 200 chars |
| \`content\` | text | ≤ 50,000 chars |
| \`tags\` | text[] | GIN-indexed for fast tag queries |
| \`created_at\` | timestamptz | auto-set on insert |
| \`updated_at\` | timestamptz | auto-updated via trigger |

## API
- \`GET /api/quicknote/notes\` — fetch all notes for the authenticated user
- \`POST /api/quicknote/notes\` — create a new note
- \`PATCH /api/quicknote/notes\` — update note title, content, or tags by id
- \`DELETE /api/quicknote/notes?id=<id>\` — delete a note by id`;
