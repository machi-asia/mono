import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";

const CANONICAL_SUPABASE_URL = "https://zyatzdkapdqngwyhiqqn.supabase.co";
const CANONICAL_SUPABASE_KEY = "sb_publishable_xwwMB4HT0zXrWgEhPN63yA_xBNK00YR";

function resolveSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
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
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (key && !key.startsWith("your-")) {
    return key;
  }
  return CANONICAL_SUPABASE_KEY;
}

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = resolveSupabaseUrl();
  const supabaseKey = resolveSupabaseKey();

  const supabase = createSupabaseServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
      auth: {
        experimental: {
          passkey: true,
        },
      },
    }
  );

  return supabase;
}
