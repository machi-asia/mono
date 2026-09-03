# ADR-006: Database-Connected Media Library with User Isolation

## Status

Accepted

## Date

2026-09-03

## Context

Applications across Machi Asia require file upload, asset management, and preview capabilities for user content (profile assets, documents, reports, attachments). Previously, `@mono/components` had a basic in-memory `MediaLibrary` mock that lacked database connectivity, user isolation, document format support (.pdf, .docx), pagination, and detail inspection modals.

## Decision

Upgrade `MediaLibrary` in `@mono/components` to integrate with `@mono/database` and `@mono/auth`:

1. **User Isolation**: Media files are stored and scoped per user. In Supabase Storage, assets are kept under `media/users/{userId}/...`. In the database, the `media_files` table tracks ownership via `user_id`.
2. **Supported File Types & Filtering**: Supports images, `.pdf`, and `.docx` documents. The component provides built-in filter tabs (`All`, `Images`, `PDFs`, `DOCX`).
3. **Inspection Modal & Quick Copy**: Clicking any item opens an inspection modal showing the file preview (image render or document type icon with badge), metadata, public bucket link with a quick one-click copy button, and a delete action with two-step confirmation.
4. **Pagination**: Built-in client and server pagination controls showing item ranges and page navigation (`Prev` / `Next`).
5. **Icon System**: Adopt `lucide-react` for rich, tree-shakeable icons representing file types, copy/check status, trash/deletion, and modal controls.
6. **Graceful Degradation / Controlled Mode**: For documentation showcase and testing, `MediaLibrary` continues to support controlled `items`, `onSelect`, `onUpload`, and `onDelete` props so showcase demos and unit tests run fast and reliably without mandatory live network dependencies.

## Consequences

- Consistent media management across all apps and products.
- Secure, isolated storage by user ID.
- Seamless public link sharing with copy-to-clipboard functionality.
- Showcase in `apps/docs` provides an interactive demo with filter and page size controls.
