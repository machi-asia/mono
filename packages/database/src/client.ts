import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const CANONICAL_SUPABASE_URL = "https://zyatzdkapdqngwyhiqqn.supabase.co";
const CANONICAL_SUPABASE_KEY = "sb_publishable_xwwMB4HT0zXrWgEhPN63yA_xBNK00YR";

function resolveSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    try {
      new URL(url);
      return url;
    } catch {
      // invalid URL
    }
  }
  return CANONICAL_SUPABASE_URL;
}

function resolveSupabaseKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (key && !key.startsWith("your-")) {
    return key;
  }
  return CANONICAL_SUPABASE_KEY;
}

let client: ReturnType<typeof createSupabaseBrowserClient<Database>> | undefined;

export function createClient() {
  const supabaseUrl = resolveSupabaseUrl();
  const supabaseKey = resolveSupabaseKey();

  if (typeof window === "undefined") {
    return createSupabaseBrowserClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          experimental: {
            passkey: true,
          },
        },
      }
    );
  }

  if (!client) {
    client = createSupabaseBrowserClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          experimental: {
            passkey: true,
          },
        },
      }
    );
  }

  return client;
}

