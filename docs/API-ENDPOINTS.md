# API Endpoint Reference

Complete reference of every HTTP endpoint in the monorepo. All routes are Next.js App Router `route.ts` files that delegate to handlers in `@mono/rose/server` or `@mono/sync/server`. All are `force-dynamic`.

## Error Format

Rose endpoints return errors as:

```json
{ "error": { "code": "bad_request", "message": "A 'message' string is required." } }
```

Sync endpoints return `{ "error": "message" }`.

## Rose (`@mono/rose/server`)

Mounted at `/api/rose/*` in both `apps/rose` and `apps/docs`.

### POST /api/rose/chat

Sends a message to the Rose agent. Streams by default (Server-Sent Events); send `"stream": false` for a JSON response.

| Field | Type | Description |
|---|---|---|
| `message` | string | Required. The user message. |
| `history` | ChatMessage[] | Optional prior turns. |
| `conversationId` | string | Optional session id. |
| `stream` | boolean | Optional; defaults to streaming. |

Auth is resolved from the `authorization` header and `x-user-id`.

| Status | Meaning |
|---|---|
| 200 | `text/event-stream`, or JSON when `stream: false` |
| 400 | `bad_request`: missing `message` |
| 429 | `usage_limit_exceeded`: daily or weekly quota reached |
| 500 | Internal error |

### GET /api/rose/settings

Returns the user's saved `memories` and `personalization`.

### POST /api/rose/settings

Mutates settings. The `action` field selects the operation.

| action | Body fields | Response |
|---|---|---|
| `save_personalization` | `customInstructions`, `nickname`, `tone` | `{ ok, personalization }` |
| `add_memory` | `index`, `content`, `importance` | `{ ok, memory }` |
| `update_memory` | `index`, `content`, `importance`, `newIndex` | `{ ok, memory }` |
| `delete_memory` | `index` | `{ ok }` |

Errors: `400 invalid_memory`, `400 invalid_action`, `405 method_not_allowed`, `500`.

### POST /api/rose/transcribe

Speech-to-text via faster-whisper. Accepts `multipart/form-data` (`audio` file, optional `language`) or a base64 JSON payload.

Success: `{ "ok": true, "transcript": "...", "provider": "faster-whisper" }`. When the native binary is unavailable it returns a 200 with an error body so the client can fall back to the Web Speech API. Other errors: `400 bad_request`, `405`, `500 transcription_error`.

### GET /api/rose/usage

Returns the caller's quota metrics (daily and weekly count and limit). Error: `500 internal_error`.

## Sync (`@mono/sync/server`)

Mounted at `/api/sync/*` in `apps/hells-forge`.

### GET /api/sync/events

Opens an SSE stream for a room. Query: `roomId` (required), `userId`, `userName`.

Emits `room-members` and `sync-event` events plus a `: keepalive` comment every 15 seconds. Returns `400` if `roomId` is missing.

### POST /api/sync/events

Publishes events to a room. Accepts a single event or a batch.

| Field | Type | Description |
|---|---|---|
| `roomId` | string | Required. |
| `trigger` | string | Required. `player_input` is processed by the authoritative simulation. |
| `userId`, `eventId`, `phase`, `inputType`, `actionId`, `payload`, `timestamp` | mixed | Optional event metadata. |

Responses: `200 { success, eventId }`, `200 { success, skipped: true }` for stale input, `200 { success, count }` for batches, `400 Missing roomId or trigger`, `500`.

### GET /api/sync/rooms

Lists room members. Query: `roomId` (required). Returns `{ roomId, members }`; `400` if `roomId` is missing, `405` for other methods.
