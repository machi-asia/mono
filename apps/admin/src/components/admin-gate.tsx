"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SignInModal, useAuth } from "@mono/auth";
import { Button, Card, Row, SkeletonCard } from "@mono/components";
import { LogOut, RefreshCw, ShieldAlert, UserPlus } from "lucide-react";

export interface AdminGateProps {
  children: ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const { user, role, isLoading, isGuest, refreshRole, signOut } = useAuth();
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const needsRoleCheck = Boolean(!isLoading && user && role !== "admin" && checkedUserId !== user.id);

  useEffect(() => {
    if (!needsRoleCheck || !user) {
      return;
    }

    let cancelled = false;
    void refreshRole().finally(() => {
      if (!cancelled) {
        setCheckedUserId(user.id);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [needsRoleCheck, refreshRole, user]);

  if (isLoading || needsRoleCheck) {
    return (
      <div className="admin-container">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return <SignInModal />;
  }

  if (role !== "admin") {
    return (
      <div className="admin-gate-center">
        <Card elevated className="admin-gate-card">
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgb(239 68 68 / 15%)",
              border: "1px solid rgb(239 68 68 / 40%)",
              color: "var(--color-error-soft)",
            }}
          >
            <ShieldAlert size={26} />
          </div>

          <div>
            <h1 style={{ margin: "0 0 var(--space-2)", fontSize: "1.35rem", fontWeight: 800 }}>
              Administrator Access Required
            </h1>
            <p className="admin-muted" style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>
              Signed in as{" "}
              <span className="admin-mono" style={{ color: "var(--color-text)" }}>
                {isGuest ? `Guest (${user.id.slice(0, 8)}…)` : user.email || user.id}
              </span>{" "}
              with role <span className="admin-badge">{role}</span>. Only accounts registered with{" "}
              <span className="admin-mono">admin</span> privileges in{" "}
              <span className="admin-mono">public.user_roles</span> can access{" "}
              <span className="admin-mono">admin.machi.asia</span>.
            </p>
          </div>

          <Row wrap justify="center" gap="var(--space-2)">
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<UserPlus size={15} />}
              onClick={() => setShowSignInModal(true)}
            >
              Switch / Sign In Admin
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={15} />}
              onClick={() => void refreshRole()}
            >
              Re-check Role
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<LogOut size={15} />}
              onClick={() => void signOut()}
            >
              Sign Out
            </Button>
          </Row>
        </Card>

        {showSignInModal ? (
          <SignInModal
            onClose={() => setShowSignInModal(false)}
            title="Sign in as Administrator"
            subtitle="Authenticate with an administrator account to access admin.machi.asia."
          />
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}
