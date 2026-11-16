export interface AppConfig {
  id: string;
  name: string;
  underDevelopment: boolean;
  appUrl: string;
  devPort?: number;
}

export type AppId =
  | "home"
  | "create"
  | "rimworld"
  | "admin"
  | "machi-asia"
  | "docs"
  | "calculator"
  | "hells-forge"
  | "rose"
  | "portfolio"
  | "api";

export const APPS_CONFIG: Record<AppId, AppConfig> = {
  home: {
    id: "home",
    name: "Home",
    underDevelopment: false,
    appUrl: "https://itemlist.online",
    devPort: 3010,
  },
  create: {
    id: "create",
    name: "Create",
    underDevelopment: false,
    appUrl: "https://create.itemlist.online",
    devPort: 3011,
  },
  rimworld: {
    id: "rimworld",
    name: "RimWorld",
    underDevelopment: true,
    appUrl: "https://rimworld.itemlist.online",
    devPort: 3012,
  },
  admin: {
    id: "admin",
    name: "Admin Portal",
    underDevelopment: false,
    appUrl: "https://admin.itemlist.online",
    devPort: 3013,
  },
  "machi-asia": {
    id: "machi-asia",
    name: "Machi Asia Hub",
    underDevelopment: false,
    appUrl: "https://machi.asia",
    devPort: 3000,
  },
  calculator: {
    id: "calculator",
    name: "Game Production Calculator",
    underDevelopment: false,
    appUrl: "https://calculator.machi.asia",
    devPort: 3001,
  },
  docs: {
    id: "docs",
    name: "Documentation & Developer Hub",
    underDevelopment: false,
    appUrl: "https://docs.machi.asia",
    devPort: 3002,
  },
  "hells-forge": {
    id: "hells-forge",
    name: "Hell's Forge",
    underDevelopment: false,
    appUrl: "https://hellsforge.machi.asia",
    devPort: 3003,
  },
  rose: {
    id: "rose",
    name: "Rose AI",
    underDevelopment: false,
    appUrl: "https://rose.machi.asia",
    devPort: 3004,
  },
  api: {
    id: "api",
    name: "Machi Asia API Gateway",
    underDevelopment: false,
    appUrl: "https://api.machi.asia",
    devPort: 3005,
  },
  portfolio: {
    id: "portfolio",
    name: "Portfolio",
    underDevelopment: false,
    appUrl: "https://portfolio.machi.asia",
    devPort: 3006,
  },
};

export const DOMAIN_HOST_TO_APP_ID: Record<string, AppId> = {
  "machi.asia": "machi-asia",
  "www.machi.asia": "machi-asia",
  "machi-asia.com": "machi-asia",
  "www.machi-asia.com": "machi-asia",
  "calculator.machi.asia": "calculator",
  "calculator.machi-asia.com": "calculator",
  "docs.machi.asia": "docs",
  "docs.machi-asia.com": "docs",
  "hellsforge.machi.asia": "hells-forge",
  "hellsforge.machi-asia.com": "hells-forge",
  "forge.machi.asia": "hells-forge",
  "forge.machi-asia.com": "hells-forge",
  "rose.machi.asia": "rose",
  "rose.machi-asia.com": "rose",
  "api.machi.asia": "api",
  "api.machi-asia.com": "api",
  "portfolio.machi.asia": "portfolio",
  "portfolio.machi-asia.com": "portfolio",
  "itemlist.online": "home",
  "www.itemlist.online": "home",
  "create.itemlist.online": "create",
  "rimworld.itemlist.online": "rimworld",
  "admin.itemlist.online": "admin",
};

export const SUPABASE_CONFIG = {
  url: "https://zyatzdkapdqngwyhiqqn.supabase.co",
  anonKey: "sb_publishable_xwwMB4HT0zXrWgEhPN63yA_xBNK00YR",
} as const;

export const ALLOWED_CORS_ORIGINS = [
  "https://machi.asia",
  "https://www.machi.asia",
  "https://machi-asia.com",
  "https://www.machi-asia.com",
  "https://docs.machi.asia",
  "https://rose.machi.asia",
  "https://rose.machi-asia.com",
  "https://calculator.machi.asia",
  "https://hellsforge.machi.asia",
  "https://portfolio.machi.asia",
  "https://api.machi.asia",
  "https://api.machi-asia.com",
  "https://itemlist.online",
  "https://www.itemlist.online",
  "https://create.itemlist.online",
  "https://rimworld.itemlist.online",
  "https://admin.itemlist.online",
  "capacitor://localhost",
  "http://localhost",
] as const;

function readEnv(key: string): string | undefined {
  const proc =
    typeof globalThis !== "undefined"
      ? ((globalThis as Record<string, unknown>).process as
          | { env?: Record<string, string | undefined> }
          | undefined)
      : undefined;
  return proc?.env?.[key];
}

export function isLocalHostname(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  const normalized = hostname.trim().toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    normalized.endsWith(".localhost")
  );
}

export interface LocalLinkOptions {
  /** Force local or production resolution regardless of current environment */
  forceLocal?: boolean;
  /** Explicit hostname to evaluate (e.g. from window.location.hostname or request headers) */
  currentHostname?: string;
  /** Localhost host string to use when rewriting (defaults to "localhost") */
  localHost?: string;
}

export function isLocalEnvironment(options?: LocalLinkOptions): boolean {
  if (typeof options?.forceLocal === "boolean") {
    return options.forceLocal;
  }
  if (options?.currentHostname !== undefined) {
    return isLocalHostname(options.currentHostname);
  }
  if (typeof window !== "undefined" && window.location?.hostname) {
    return isLocalHostname(window.location.hostname);
  }
  const nodeEnv = readEnv("NODE_ENV");
  if (nodeEnv === "development") {
    return true;
  }
  return false;
}

export function resolveAppHref(
  appId: AppId,
  path = "",
  options?: LocalLinkOptions
): string {
  const config = APPS_CONFIG[appId];
  const normalizedPath = path
    ? path.startsWith("/") || path.startsWith("?") || path.startsWith("#")
      ? path
      : `/${path}`
    : "";

  if (isLocalEnvironment(options) && config?.devPort) {
    const host =
      options?.localHost ||
      (options?.currentHostname && isLocalHostname(options.currentHostname)
        ? options.currentHostname
        : typeof window !== "undefined" &&
            window.location?.hostname &&
            isLocalHostname(window.location.hostname)
          ? window.location.hostname
          : "localhost");
    return `http://${host}:${config.devPort}${normalizedPath}`;
  }

  const base = (config?.appUrl || "").replace(/\/$/, "");
  return `${base}${normalizedPath}`;
}

/**
 * Logic wrapper for all links across the monorepo.
 * When running locally (localhost / 127.0.0.1 / development), rewrites any Machi Asia
 * or ItemList domain URL (or cross-app sub-route like `/docs`, `/calculator`, `/rose`)
 * to its equivalent `http://localhost:<devPort>` URL while preserving paths, query strings, and hashes.
 */
export function resolveHref(
  href: string | null | undefined,
  options?: LocalLinkOptions
): string {
  if (!href) return "";
  const trimmed = href.trim();
  if (!trimmed) return "";

  if (!isLocalEnvironment(options)) {
    return trimmed;
  }

  const localHost =
    options?.localHost ||
    (options?.currentHostname && isLocalHostname(options.currentHostname)
      ? options.currentHostname
      : typeof window !== "undefined" &&
          window.location?.hostname &&
          isLocalHostname(window.location.hostname)
        ? window.location.hostname
        : "localhost");

  // 1. Absolute http(s) URLs matching known organization domains
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const hostname = parsed.hostname.toLowerCase();
      const matchedAppId = DOMAIN_HOST_TO_APP_ID[hostname];
      if (matchedAppId) {
        const appConfig = APPS_CONFIG[matchedAppId];
        if (appConfig?.devPort) {
          const suffix = `${parsed.pathname === "/" && !trimmed.endsWith("/") && !parsed.search && !parsed.hash ? "" : parsed.pathname}${parsed.search}${parsed.hash}`;
          return `http://${localHost}:${appConfig.devPort}${suffix}`;
        }
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

export function resolveSupabaseUrl(): string {
  const url = readEnv("SUPABASE_URL") || readEnv("NEXT_PUBLIC_SUPABASE_URL");
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    try {
      new URL(url);
      return url;
    } catch {
      // invalid URL
    }
  }
  return SUPABASE_CONFIG.url;
}

export function resolveSupabasePublishableKey(): string {
  const key =
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    readEnv("SUPABASE_PUBLISHABLE_KEY");
  if (key && !key.startsWith("your-")) {
    return key;
  }
  return SUPABASE_CONFIG.anonKey;
}

export function resolveSupabaseServerKey(): string {
  const secret = readEnv("SUPABASE_SECRET_KEY");
  if (secret && !secret.startsWith("your-")) {
    return secret;
  }
  return resolveSupabasePublishableKey();
}

export function resolveApiBaseUrl(options?: LocalLinkOptions): string {
  const envUrl = readEnv("API_SERVICE_URL") || readEnv("NEXT_PUBLIC_API_URL");
  if (envUrl) {
    return resolveHref(envUrl.replace(/\/$/, ""), options);
  }
  return resolveAppHref("api", "", options);
}

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return true;
  if (ALLOWED_CORS_ORIGINS.includes(origin as (typeof ALLOWED_CORS_ORIGINS)[number])) {
    return true;
  }
  try {
    const parsed = new URL(origin);
    if (
      isLocalHostname(parsed.hostname) ||
      parsed.hostname.endsWith(".machi.asia") ||
      parsed.hostname.endsWith(".machi-asia.com") ||
      parsed.hostname.endsWith(".itemlist.online") ||
      parsed.hostname.endsWith(".vercel.app")
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function isAppUnderDevelopment(appId: AppId | string): boolean {
  return Boolean(APPS_CONFIG[appId as AppId]?.underDevelopment);
}

export function getAppConfig(appId: AppId | string): AppConfig | undefined {
  return APPS_CONFIG[appId as AppId];
}
