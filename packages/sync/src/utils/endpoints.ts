import { resolveApiBaseUrl, type LocalLinkOptions } from "@mono/app-config";

/**
 * Returns the resolved default API endpoint for sync signaling and events.
 * Defaults to `${resolveApiBaseUrl(options)}/sync/events` (e.g. `https://api.machi.asia/sync/events` or `http://localhost:3005/sync/events`).
 */
export function getSyncEventsUrl(options?: LocalLinkOptions): string {
  const base = resolveApiBaseUrl(options);
  return `${base.replace(/\/$/, "")}/sync/events`;
}

/**
 * Returns the resolved default API endpoint for sync rooms.
 * Defaults to `${resolveApiBaseUrl(options)}/sync/rooms`.
 */
export function getSyncRoomsUrl(options?: LocalLinkOptions): string {
  const base = resolveApiBaseUrl(options);
  return `${base.replace(/\/$/, "")}/sync/rooms`;
}
