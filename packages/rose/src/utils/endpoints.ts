import { resolveApiBaseUrl, type LocalLinkOptions } from "@mono/app-config";

/**
 * Returns the resolved base API endpoint for Rose services.
 * Defaults to `${resolveApiBaseUrl(options)}/rose` (e.g. `https://api.machi.asia/rose` or `http://localhost:3005/rose`).
 */
export function getRoseApiBasePath(options?: LocalLinkOptions): string {
  const base = resolveApiBaseUrl(options);
  return `${base.replace(/\/$/, "")}/rose`;
}

/**
 * Returns the resolved transcription API endpoint for Rose audio services.
 * Defaults to `${resolveApiBaseUrl(options)}/rose/transcribe`.
 */
export function getRoseTranscribeEndpoint(options?: LocalLinkOptions): string {
  return `${getRoseApiBasePath(options)}/transcribe`;
}
