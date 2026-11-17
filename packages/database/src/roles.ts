import type { SupabaseClient } from "@supabase/supabase-js";
import { assertServerOnlyExecution, createClient, createServiceClient } from "./client";
import type { Database, UserRole, UserRoleRecord } from "./types";

/**
 * Default fallback role when no profile or metadata is present.
 */
export const DEFAULT_USER_ROLE: UserRole = "member";

const VALID_ROLES: UserRole[] = ["guest", "member", "pro", "admin"];

export interface AdminUserDirectoryEntry {
  userId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isGuest: boolean;
  providers: string[];
  createdAt: string | null;
  lastSignInAt: string | null;
}

const FALLBACK_USER_ROLES = new Map<string, UserRoleRecord>();

export function resetFallbackUserRoles(): void {
  FALLBACK_USER_ROLES.clear();
}

export function isValidUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.includes(role as UserRole);
}

/**
 * Resolves a UserRole from a Supabase user object safely:
 * - Never trusts user_metadata for "admin" or "pro" privilege escalation.
 * - Uses app_metadata.role if valid.
 * - Returns "guest" for anonymous users or null users.
 */
export function resolveSafeRoleFromUser(user: {
  id?: string;
  is_anonymous?: boolean;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  roles?: string[];
} | null | undefined): UserRole {
  if (!user) return "guest";
  if (user.is_anonymous) return "guest";

  if (Array.isArray(user.roles)) {
    if (user.roles.includes("admin")) return "admin";
    if (user.roles.includes("pro")) return "pro";
    if (user.roles.includes("guest") || user.roles.includes("anon")) return "guest";
    if (user.roles.includes("member")) return "member";
  }

  const appRole = user.app_metadata?.role;
  if (isValidUserRole(appRole)) {
    return appRole;
  }

  return DEFAULT_USER_ROLE;
}

/**
 * Fetches the current user's role from the database or verified app_metadata.
 */
export async function getUserRole(
  userId?: string,
  clientOverride?: SupabaseClient<Database>
): Promise<UserRole> {
  try {
    const supabase = clientOverride || createClient();
    let targetUserId = userId;

    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return "guest";
      if (user.is_anonymous) return "guest";
      targetUserId = user.id;

      // Check fast path from server-controlled app_metadata
      const appRole = user.app_metadata?.role;
      if (isValidUserRole(appRole)) {
        return appRole;
      }
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_USER_ROLES.get(targetUserId)?.role ?? DEFAULT_USER_ROLE;
    }

    const dbRole = (data as { role: UserRole }).role;
    return isValidUserRole(dbRole) ? dbRole : DEFAULT_USER_ROLE;
  } catch {
    return userId ? (FALLBACK_USER_ROLES.get(userId)?.role ?? DEFAULT_USER_ROLE) : DEFAULT_USER_ROLE;
  }
}

/**
 * Lists all registered users and role assignments for the Admin Portal.
 * Strictly server-only — merges `auth.admin.listUsers()`, `public.user_roles`, and fallback store.
 */
export async function listAllUserRoles(
  clientOverride?: SupabaseClient<Database>
): Promise<AdminUserDirectoryEntry[]> {
  assertServerOnlyExecution("listAllUserRoles");

  const byUserId = new Map<string, AdminUserDirectoryEntry>();
  const isOfflineTest =
    !clientOverride &&
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL;

  if (!isOfflineTest) {
    try {
      const supabase = clientOverride || createServiceClient();

      // 1. Fetch role table entries
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("*")
        .order("updated_at", { ascending: false });

      if (Array.isArray(roleRows)) {
        for (const row of roleRows as UserRoleRecord[]) {
          byUserId.set(row.user_id, {
            userId: row.user_id,
            email: null,
            displayName: null,
            avatarUrl: null,
            role: isValidUserRole(row.role) ? row.role : DEFAULT_USER_ROLE,
            isGuest: row.role === "guest",
            providers: [],
            createdAt: row.created_at,
            lastSignInAt: null,
          });
        }
      }

      // 2. Enrich from Supabase Auth Admin API when service role key is configured
      try {
        const authAdmin = (supabase.auth as unknown as {
          admin?: {
            listUsers?: (opts?: { page?: number; perPage?: number }) => Promise<{
              data?: { users?: Array<Record<string, unknown>> };
              error?: unknown;
            }>;
          };
        })?.admin;

        if (authAdmin && typeof authAdmin.listUsers === "function") {
          const { data: authData, error: authErr } = await authAdmin.listUsers({
            page: 1,
            perPage: 500,
          });
          if (!authErr && Array.isArray(authData?.users)) {
            for (const u of authData.users) {
              const uid = String(u.id || "");
              if (!uid) continue;
              const existing = byUserId.get(uid);
              const meta = (u.user_metadata as Record<string, unknown> | undefined) ?? {};
              const appMeta = (u.app_metadata as Record<string, unknown> | undefined) ?? {};
              const isAnon = Boolean(u.is_anonymous);
              const providers = Array.isArray(appMeta.providers)
                ? (appMeta.providers as string[])
                : typeof appMeta.provider === "string"
                  ? [appMeta.provider]
                  : [];
              const safeRole =
                existing?.role ??
                resolveSafeRoleFromUser({
                  id: uid,
                  is_anonymous: isAnon,
                  app_metadata: appMeta,
                });

              byUserId.set(uid, {
                userId: uid,
                email: typeof u.email === "string" ? u.email : existing?.email ?? null,
                displayName:
                  (typeof meta.full_name === "string" && meta.full_name) ||
                  (typeof meta.name === "string" && meta.name) ||
                  (typeof meta.user_name === "string" && meta.user_name) ||
                  existing?.displayName ||
                  null,
                avatarUrl:
                  (typeof meta.avatar_url === "string" && meta.avatar_url) ||
                  (typeof meta.picture === "string" && meta.picture) ||
                  existing?.avatarUrl ||
                  null,
                role: safeRole,
                isGuest: isAnon || safeRole === "guest",
                providers,
                createdAt:
                  typeof u.created_at === "string" ? u.created_at : existing?.createdAt ?? null,
                lastSignInAt:
                  typeof u.last_sign_in_at === "string"
                    ? u.last_sign_in_at
                    : existing?.lastSignInAt ?? null,
              });
            }
          }
        }
      } catch {
        // auth.admin.listUsers requires service_role key; ignore if unavailable
      }
    } catch {
      // Fall back to in-memory role store
    }
  }

  for (const [uid, fb] of FALLBACK_USER_ROLES.entries()) {
    const existing = byUserId.get(uid);
    byUserId.set(uid, {
      userId: uid,
      email: existing?.email ?? null,
      displayName: existing?.displayName ?? null,
      avatarUrl: existing?.avatarUrl ?? null,
      role: fb.role,
      isGuest: fb.role === "guest",
      providers: existing?.providers ?? [],
      createdAt: existing?.createdAt ?? fb.created_at,
      lastSignInAt: existing?.lastSignInAt ?? null,
    });
  }

  return Array.from(byUserId.values());
}

/**
 * Admin function to update a user's role in the database.
 * Strictly server-only — throws if invoked in a browser environment.
 */
export async function updateUserRole(
  userId: string,
  role: UserRole,
  clientOverride?: SupabaseClient<Database>
): Promise<{ success: boolean; error: Error | null }> {
  assertServerOnlyExecution("updateUserRole");
  if (!isValidUserRole(role)) {
    return { success: false, error: new Error(`Invalid user role: ${String(role)}`) };
  }

  const now = new Date().toISOString();
  const existingFallback = FALLBACK_USER_ROLES.get(userId);
  FALLBACK_USER_ROLES.set(userId, {
    user_id: userId,
    role,
    created_at: existingFallback?.created_at ?? now,
    updated_at: now,
  });

  const isOfflineTest =
    !clientOverride &&
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL;

  if (isOfflineTest) {
    return { success: true, error: null };
  }

  try {
    const supabase = clientOverride || createServiceClient();
    const payload = {
      user_id: userId,
      role,
      updated_at: now,
    };

    const { error } = await supabase
      .from("user_roles")
      .upsert(payload as never)
      .select()
      .single();

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    // Best-effort sync to Supabase Auth app_metadata so refreshed JWTs carry the updated role
    try {
      const authAdmin = (supabase.auth as unknown as {
        admin?: {
          updateUserById?: (
            id: string,
            attrs: { app_metadata?: Record<string, unknown> }
          ) => Promise<unknown>;
        };
      })?.admin;
      if (authAdmin && typeof authAdmin.updateUserById === "function") {
        await authAdmin.updateUserById(userId, { app_metadata: { role } });
      }
    } catch {
      // Ignore auth.admin sync errors
    }

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error("Failed to update user role"),
    };
  }
}
