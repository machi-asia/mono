"use client";

import { useMemo, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { AuthContext } from "../provider/provider";
import type { AuthContextValue } from "../types";
import { ToastProvider } from "@mono/components";

export type MockAuthState = "loading" | "signed-out" | "guest" | "signed-in";

const signInStubs: Pick<
  AuthContextValue,
  | "signInWithEmail"
  | "signUpWithEmail"
  | "signInWithGoogle"
  | "signInWithGithub"
  | "signInAsGuest"
  | "switchAccount"
  | "removeAccount"
  | "signOut"
> = {
  signInWithEmail: async () => ({ error: undefined }),
  signUpWithEmail: async () => ({ error: undefined }),
  signInWithGoogle: async () => ({ error: undefined }),
  signInWithGithub: async () => ({ error: undefined }),
  signInAsGuest: async () => ({ error: undefined }),
  switchAccount: async () => ({ error: undefined }),
  removeAccount: () => {},
  signOut: async () => {},
};

function mockUser(state: MockAuthState): User | null {
  if (state === "signed-in" || state === "guest") {
    return {
      id: "mock-user-id",
      aud: "authenticated",
      role: "authenticated",
      email: state === "guest" ? null : "demo@machi.asia",
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      is_anonymous: state === "guest",
    } as User;
  }
  return null;
}

function mockSession(state: MockAuthState): Session | null {
  const user = mockUser(state);
  if (!user) {
    return null;
  }
  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user,
  } as Session;
}

export function MockAuthProvider({
  state = "signed-out",
  children,
}: {
  state?: MockAuthState;
  children?: ReactNode;
}) {
  const user = mockUser(state);
  const session = mockSession(state);
  const accounts = useMemo(() => {
    if (!user) return [];
    return [
      {
        id: user.id,
        email: user.email ?? undefined,
        name: user.is_anonymous ? "Guest" : "Demo User",
        isAnonymous: user.is_anonymous,
        refreshToken: "mock-refresh-token",
        accessToken: "mock-access-token",
        lastActive: Date.now(),
      },
    ];
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading: state === "loading",
      isGuest: state === "guest",
      accounts,
      ...signInStubs,
    }),
    [state, user, session, accounts]
  );

  return <ToastProvider><AuthContext.Provider value={value}>{children}</AuthContext.Provider></ToastProvider>;
}
