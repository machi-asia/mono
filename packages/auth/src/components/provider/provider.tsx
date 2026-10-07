"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient } from "../../client";
import type { AuthContextValue, AuthState, SavedAccount, UserRole } from "../../types";
import { ToastProvider } from "@mono/components";

export const AuthContext = createContext<AuthContextValue | null>(null);

const ACCOUNTS_STORAGE_KEY = "mono_auth_saved_accounts";

function getSavedAccounts(): SavedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistAccounts(accounts: SavedAccount[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage write errors
  }
}

function resolveUserRole(user: User | null): UserRole {
  if (!user) return "guest";
  if (user.is_anonymous) return "guest";
  const metaRole = (user.app_metadata?.role || user.user_metadata?.role) as UserRole | undefined;
  if (metaRole && ["guest", "member", "pro", "admin"].includes(metaRole)) {
    return metaRole;
  }
  return "member";
}

function extractAccountInfo(session: any): SavedAccount | null {
  if (!session?.user || !session.access_token || !session.refresh_token) return null;
  const user = session.user;
  const meta = user.user_metadata ?? {};
  const name =
    meta.name ||
    meta.full_name ||
    meta.user_name ||
    meta.username ||
    meta.preferred_username ||
    (user.is_anonymous ? "Guest" : user.email?.split("@")[0] || "User");
  const avatar = meta.avatar_url || meta.picture || meta.avatar || meta.photo_url;
  const role = resolveUserRole(user);

  return {
    id: user.id,
    email: user.email ?? undefined,
    name,
    avatar,
    role,
    isAnonymous: user.is_anonymous,
    refreshToken: session.refresh_token,
    accessToken: session.access_token,
    lastActive: Date.now(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [state, setState] = useState<Omit<AuthState, "accounts">>({
    user: null,
    session: null,
    isLoading: true,
    isGuest: false,
    role: "guest",
  });

  const supabase = createClient();

  // Load saved accounts on mount
  useEffect(() => {
    setAccounts(getSavedAccounts());
  }, []);

  useEffect(() => {
    let mounted = true;

    // Fast initial check in case onAuthStateChange is delayed or aborted
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        if (!mounted) return;
        const user = session?.user ?? null;
        setState({
          user,
          session,
          isLoading: false,
          isGuest: user?.is_anonymous ?? false,
          role: resolveUserRole(user),
        });
      })
      .catch(() => {
        if (!mounted) return;
        setState((prev) => (prev.isLoading ? { ...prev, isLoading: false } : prev));
      });

    // Fallback timer so UI never hangs indefinitely in loading state
    const timeout = setTimeout(() => {
      if (mounted) {
        setState((prev) => (prev.isLoading ? { ...prev, isLoading: false } : prev));
      }
    }, 3000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;
      const user = session?.user ?? null;
      setState({
        user,
        session,
        isLoading: false,
        isGuest: user?.is_anonymous ?? false,
        role: resolveUserRole(user),
      });

      if (session) {
        const account = extractAccountInfo(session);
        if (account) {
          setAccounts((prev) => {
            const filtered = prev.filter((a) => a.id !== account.id);
            const updated = [account, ...filtered];
            persistAccounts(updated);
            return updated;
          });
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const switchAccount = useCallback(async (userId: string) => {
    const target = accounts.find((a) => a.id === userId);
    if (!target) {
      return { error: "Account not found in saved accounts" };
    }

    const { data, error } = await supabase.auth.setSession({
      access_token: target.accessToken,
      refresh_token: target.refreshToken,
    });

    if (error) {
      // If refresh token expired or failed, remove stale account
      setAccounts((prev) => {
        const updated = prev.filter((a) => a.id !== userId);
        persistAccounts(updated);
        return updated;
      });
      return { error: error.message };
    }

    if (data.session) {
      const updatedAccount = extractAccountInfo(data.session);
      if (updatedAccount) {
        setAccounts((prev) => {
          const filtered = prev.filter((a) => a.id !== updatedAccount.id);
          const updated = [updatedAccount, ...filtered];
          persistAccounts(updated);
          return updated;
        });
      }
    }

    return {};
  }, [accounts, supabase]);

  const removeAccount = useCallback((userId: string) => {
    setAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== userId);
      persistAccounts(updated);
      return updated;
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  }, [supabase]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message };
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    return { error: error?.message };
  }, [supabase]);

  const signInWithGithub = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.href },
    });
    return { error: error?.message };
  }, [supabase]);

  const signInAsGuest = useCallback(async () => {
    const { error } = await supabase.auth.signInAnonymously();
    return { error: error?.message };
  }, [supabase]);

  const signOut = useCallback(async () => {
    const currentId = state.user?.id;
    await supabase.auth.signOut();
    if (currentId) {
      // Keep other saved accounts intact so the user can easily switch or sign back in
      setAccounts((prev) => {
        const updated = prev.filter((a) => a.id !== currentId);
        persistAccounts(updated);
        return updated;
      });
    }
  }, [state.user, supabase]);

  const refreshRole = useCallback(async (): Promise<UserRole> => {
    if (!state.user?.id) return "guest";
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", state.user.id)
        .maybeSingle();

      const newRole = ((data as any)?.role as UserRole) || resolveUserRole(state.user);
      setState((prev) => ({ ...prev, role: newRole }));
      return newRole;
    } catch {
      return state.role;
    }
  }, [state.user, state.role, supabase]);

  return (
    <ToastProvider>
      <AuthContext.Provider
        value={{
          ...state,
          accounts,
          switchAccount,
          removeAccount,
          signInWithEmail,
          signUpWithEmail,
          signInWithGoogle,
          signInWithGithub,
          signInAsGuest,
          signOut,
          refreshRole,
        }}
      >
        {children}
      </AuthContext.Provider>
    </ToastProvider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useUserRole(): UserRole {
  const { role } = useAuth();
  return role;
}
