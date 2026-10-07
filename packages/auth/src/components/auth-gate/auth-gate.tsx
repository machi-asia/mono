"use client";

import { type ReactNode } from "react";
import { useAuth } from "../provider/provider";
import { SignInModal } from "../sign-in-modal/sign-in-modal";
import "./auth-gate.css";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-gate-loading" role="status">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <SignInModal />;
  }

  return <>{children}</>;
}
