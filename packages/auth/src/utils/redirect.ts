/**
 * Constructs the centralized authentication redirect hub URL (`api.machi.asia/redirect`),
 * preserving the originating URL/subdomain in the `returnTo` query parameter.
 */
export function getAuthRedirectUrl(currentUrl?: string): string {
  if (typeof window === "undefined") {
    return currentUrl || "https://machi.asia";
  }

  const destination = currentUrl || window.location.href;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    const cleanApi = apiUrl.replace(/\/+$/, "");
    return `${cleanApi}/redirect?returnTo=${encodeURIComponent(destination)}`;
  }

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const redirectBase = isLocal
    ? "http://localhost:3005/redirect"
    : "https://api.machi.asia/redirect";

  return `${redirectBase}?returnTo=${encodeURIComponent(destination)}`;
}
