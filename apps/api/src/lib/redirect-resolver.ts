export interface AppMetadata {
  id: string;
  name: string;
  subdomain: string;
  packageId: string;
  scheme: string;
  defaultUrl: string;
  description: string;
}

export const APP_REGISTRY: Record<string, AppMetadata> = {
  calculator: {
    id: "calculator",
    name: "Machi Calculator",
    subdomain: "calculator.machi.asia",
    packageId: "asia.machi.calculator",
    scheme: "machicalculator",
    defaultUrl: "https://calculator.machi.asia",
    description: "Production calculator & recipe tree planner",
  },
  docs: {
    id: "docs",
    name: "Machi Docs",
    subdomain: "docs.machi.asia",
    packageId: "asia.machi.docs",
    scheme: "machidocs",
    defaultUrl: "https://docs.machi.asia",
    description: "Developer documentation & architecture wiki",
  },
  "hells-forge": {
    id: "hells-forge",
    name: "Hell's Forge",
    subdomain: "hellsforge.machi.asia",
    packageId: "asia.machi.hellsforge",
    scheme: "hellsforge",
    defaultUrl: "https://hellsforge.machi.asia",
    description: "2D multiplayer exploration & sandbox",
  },
  portal: {
    id: "portal",
    name: "Machi Asia Portal",
    subdomain: "machi.asia",
    packageId: "asia.machi.portal",
    scheme: "machiportal",
    defaultUrl: "https://machi.asia",
    description: "Showcase portal & subscription billing hub",
  },
  rose: {
    id: "rose",
    name: "Rose AI",
    subdomain: "rose.machi.asia",
    packageId: "asia.machi.rose",
    scheme: "roseai",
    defaultUrl: "https://rose.machi.asia",
    description: "Conversational AI companion & voice agent",
  },
};

/**
 * Validates if the returnTo URL belongs to an allowed host:
 * - Any *.machi.asia or machi.asia
 * - localhost or 127.0.0.1 on any port (3000-3999)
 */
export function isAllowedRedirectUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Allow *.machi.asia and machi.asia
    if (hostname === "machi.asia" || hostname.endsWith(".machi.asia")) {
      return true;
    }

    // Allow localhost and 127.0.0.1
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Resolves application metadata based on destination URL or subdomain.
 */
export function resolveAppFromUrl(urlStr: string): AppMetadata {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    const port = parsed.port;

    if (hostname.includes("calculator") || port === "3001") {
      return APP_REGISTRY.calculator;
    }
    if (hostname.includes("docs") || port === "3002") {
      return APP_REGISTRY.docs;
    }
    if (hostname.includes("hellsforge") || hostname.includes("hells-forge") || port === "3003") {
      return APP_REGISTRY["hells-forge"];
    }
    if (hostname.includes("rose") || port === "3004") {
      return APP_REGISTRY.rose;
    }
    if (hostname === "machi.asia" || port === "3000") {
      return APP_REGISTRY.portal;
    }
  } catch {
    // Fall back to portal
  }

  return APP_REGISTRY.portal;
}

/**
 * Sanitizes returnTo parameter and merges incoming auth query params / hash fragments.
 */
export function constructRelayUrl(
  returnToParam: string | null | undefined,
  currentSearchParams: URLSearchParams,
  hashFragment = ""
): { targetUrl: string; app: AppMetadata } {
  let baseTarget = "https://machi.asia";

  if (returnToParam && isAllowedRedirectUrl(returnToParam)) {
    baseTarget = returnToParam;
  }

  const app = resolveAppFromUrl(baseTarget);

  try {
    const targetUrlObj = new URL(baseTarget);

    // Forward auth parameters from incoming search params (e.g. code, error, error_description, state)
    currentSearchParams.forEach((value, key) => {
      if (key !== "returnTo") {
        targetUrlObj.searchParams.set(key, value);
      }
    });

    let finalUrl = targetUrlObj.toString();

    // Attach hash fragment if present and not already on target
    if (hashFragment) {
      const cleanHash = hashFragment.startsWith("#") ? hashFragment.slice(1) : hashFragment;
      if (cleanHash && !targetUrlObj.hash) {
        finalUrl += `#${cleanHash}`;
      }
    }

    return { targetUrl: finalUrl, app };
  } catch {
    return { targetUrl: baseTarget, app };
  }
}

/**
 * Generates Android Intent and custom scheme URLs for launching native apps.
 */
export function generateMobileAppUrls(
  app: AppMetadata,
  targetUrl: string
): { customSchemeUrl: string; androidIntentUrl: string } {
  try {
    const parsed = new URL(targetUrl);
    const pathAndQuery = `${parsed.pathname.replace(/^\//, "")}${parsed.search}${parsed.hash}`;
    const customSchemeUrl = `${app.scheme}://${pathAndQuery || "auth/callback"}`;

    // Standard Android intent fallback URL
    const androidIntentUrl = `intent://${pathAndQuery || "auth/callback"}#Intent;scheme=${app.scheme};package=${app.packageId};end;`;

    return { customSchemeUrl, androidIntentUrl };
  } catch {
    return {
      customSchemeUrl: `${app.scheme}://auth/callback`,
      androidIntentUrl: `intent://auth/callback#Intent;scheme=${app.scheme};package=${app.packageId};end;`,
    };
  }
}
