import type { User, Session } from "@supabase/supabase-js";

export interface SavedAccount {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  isAnonymous?: boolean;
  refreshToken: string;
  accessToken: string;
  lastActive: number;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isGuest: boolean;
  accounts: SavedAccount[];
}

export interface AuthContextValue extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithGithub: () => Promise<{ error?: string }>;
  signInAsGuest: () => Promise<{ error?: string }>;
  switchAccount: (userId: string) => Promise<{ error?: string }>;
  removeAccount: (userId: string) => void;
  signOut: () => Promise<void>;
}
