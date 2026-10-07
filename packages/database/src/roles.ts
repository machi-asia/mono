import { createClient } from "./client";
import type { UserRole, UserRoleRecord } from "./types";

/**
 * Default fallback role when no profile or metadata is present.
 */
export const DEFAULT_USER_ROLE: UserRole = "member";

/**
 * Fetches the current user's role from the database or session metadata.
 */
export async function getUserRole(userId?: string): Promise<UserRole> {
  try {
    const supabase = createClient();
    let targetUserId = userId;

    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return "guest";
      if (user.is_anonymous) return "guest";
      targetUserId = user.id;

      // Check fast path from user/app metadata
      const metaRole = (user.app_metadata?.role || user.user_metadata?.role) as UserRole | undefined;
      if (metaRole) return metaRole;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_USER_ROLE;
    }

    return (data as { role: UserRole }).role || DEFAULT_USER_ROLE;
  } catch {
    return DEFAULT_USER_ROLE;
  }
}

/**
 * Admin function to update a user's role in the database.
 */
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const supabase = createClient();
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
