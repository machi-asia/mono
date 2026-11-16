import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import {
  resolveSupabaseUrl,
  resolveSupabasePublishableKey,
  resolveSupabaseServerKey,
} from "@mono/app-config";
import type { Database } from "./types";

let client: ReturnType<typeof createSupabaseBrowserClient<Database>> | undefined;

/**
 * Throws a security error if a privileged server-only database helper is invoked
 * inside a browser runtime (`typeof window !== "undefined"`), unless running in
 * an explicit Vitest/test environment.
 */
export function assertServerOnlyExecution(functionName: string): void {
  const isVitest =
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST));

  if (typeof window !== "undefined" && (!isVitest || (globalThis as any).__FORCE_BROWSER_SECURITY_GUARD)) {
    throw new Error(
      `Security Violation: \`${functionName}\` is a privileged server-only database helper and cannot be executed in a browser environment.`
    );
  }
}

export function createClient() {
  const supabaseUrl = resolveSupabaseUrl();
  const supabaseKey = resolveSupabasePublishableKey();

  if (typeof window === "undefined") {
    return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        experimental: {
          passkey: true,
        },
      },
    });
  }

  if (!client) {
    client = createSupabaseBrowserClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        experimental: {
          passkey: true,
        },
      },
    });
  }

  return client;
}

export function createTokenClient(token: string) {
  assertServerOnlyExecution("createTokenClient");
  const supabaseUrl = resolveSupabaseUrl();
  const supabaseKey = resolveSupabaseServerKey();

  return createSupabaseJsClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

export function createServiceClient() {
  assertServerOnlyExecution("createServiceClient");
  const supabaseUrl = resolveSupabaseUrl();
  const supabaseKey = resolveSupabaseServerKey();

  return createSupabaseJsClient<Database>(supabaseUrl, supabaseKey);
}
