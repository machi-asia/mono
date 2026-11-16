import type { User } from "@supabase/supabase-js";
import { resolveSafeRoleFromUser, type UserRole } from "@mono/database";

export interface UserProfileInfo {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  initials: string;
  isGuest: boolean;
  role: UserRole;
}

/**
 * Extracts a clean, fallback-safe display name from a Supabase User object.
 */
export function getUserDisplayName(
  user?: {
    email?: string | null;
    is_anonymous?: boolean;
    user_metadata?: Record<string, unknown>;
  } | null
): string {
  if (!user) return "Guest";
  const meta = user.user_metadata ?? {};
  const candidates = [
    meta.name,
    meta.full_name,
    meta.user_name,
    meta.username,
    meta.preferred_username,
    user.email,
  ];
  const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
  if (found) return (found as string).trim();
  return user.is_anonymous ? "Guest" : "User";
}

/**
 * Extracts a clean avatar URL from a Supabase User's metadata if available.
 */
export function getUserAvatarUrl(
  user?: {
    user_metadata?: Record<string, unknown>;
  } | null
): string | undefined {
  if (!user) return undefined;
  const meta = user.user_metadata ?? {};
  const candidates = [meta.avatar_url, meta.picture, meta.avatar, meta.photo_url];
  const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
  return found ? (found as string).trim() : undefined;
}

/**
 * Computes 1-2 character uppercase initials from a display name or email.
 */
export function getUserInitials(nameOrEmail: string): string {
  const cleaned = (nameOrEmail || "G").trim();
  if (!cleaned) return "G";
  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

/**
 * Returns a complete, normalized UserProfileInfo summary from any Supabase User.
 */
export function getUserProfileInfo(user?: User | null): UserProfileInfo {
  const displayName = getUserDisplayName(user);
  const avatarUrl = getUserAvatarUrl(user);
  const role = resolveSafeRoleFromUser(user ?? null);
  const isGuest = !user || Boolean(user.is_anonymous);

  return {
    id: user?.id ?? "guest",
    displayName,
    email: user?.email ?? undefined,
    avatarUrl,
    initials: getUserInitials(displayName),
    isGuest,
    role,
  };
}
