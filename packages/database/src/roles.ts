import type { SupabaseClient } from "@supabase/supabase-js";
import { assertServerOnlyExecution, createClient, createServiceClient } from "./client";
import type { Database, UserRole } from "./types";

/**
 * Default fallback role when no profile or metadata is present.
 */
export const DEFAULT_USER_ROLE: UserRole = "member";

const VALID_ROLES: UserRole[] = ["guest", "member", "pro", "admin"];

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
      return DEFAULT_USER_ROLE;
    }

    const dbRole = (data as { role: UserRole }).role;
    return isValidUserRole(dbRole) ? dbRole : DEFAULT_USER_ROLE;
  } catch {
    return DEFAULT_USER_ROLE;
  }
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
  try {
    const supabase = clientOverride || createServiceClient();
    const payload = {
      user_id: userId,
      role,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_roles")
      .upsert(payload as never)
      .select()
      .single();

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error("Failed to update user role"),
    };
  }
}
