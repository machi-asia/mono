"use client";

import { useContext } from "react";
import { ComponentShowcase } from "@mono/components";
import { AuthGate, SignInModal } from "@mono/auth";
import { AuthContext } from "@mono/auth/provider";
import { MockAuthProvider, type MockAuthState } from "@mono/auth/mock";
import "./auth-demo.css";

const mockStateOptions: { label: string; value: MockAuthState }[] = [
  { label: "Signed in (user)", value: "signed-in" },
  { label: "Signed in (guest)", value: "guest" },
  { label: "Signed out", value: "signed-out" },
  { label: "Loading", value: "loading" },
];

function AuthProviderDemo() {
  const auth = useContext(AuthContext);
  return (
    <div className="auth-demo-status">
      <p className="auth-demo-status-row">
        <span className="auth-demo-status-key">isLoading</span>
        <span className="auth-demo-status-value">
          {auth?.isLoading === undefined ? "— (no provider)" : String(auth.isLoading)}
        </span>
      </p>
      <p className="auth-demo-status-row">
        <span className="auth-demo-status-key">user</span>
        <span className="auth-demo-status-value">
          {auth?.isLoading ? "loading…" : auth?.user ? "signed in" : "null"}
        </span>
      </p>
      <p className="auth-demo-status-row">
        <span className="auth-demo-status-key">isGuest</span>
        <span className="auth-demo-status-value">
          {auth?.isLoading ? "…" : String(!!auth?.isGuest)}
        </span>
      </p>
    </div>
  );
}

export function AuthShowcase() {
  return (
    <ComponentShowcase
      packageName="mono/auth"
      description="Authentication components from the shared auth package. Every app must wrap its root layout in AuthProvider and AuthGate so no signed-out user can reach any page. Each component below is rendered live against a mock auth context controlled by its dropdown."
      components={[
        {
          name: "AuthProvider",
          uses: 'import { AuthProvider } from "@mono/auth"',
          description:
            "React context provider that tracks user, session, isLoading, and isGuest, and exposes the sign-in/out methods via useAuth. Below it is rendered live wrapping a consumer that reads useAuth() — this reflects the real provider in production.",
          render: () => (
            <MockAuthProvider state="signed-in">
              <AuthProviderDemo />
            </MockAuthProvider>
          ),
        },
        {
          name: "AuthGate",
          uses: 'import { AuthGate } from "@mono/auth"',
          description:
            "Client gate. While the session loads it shows a loading state; without a user it renders SignInModal; once a session exists it renders its children. Use the dropdown to drive the mock auth state and see the gate react live.",
          propControls: [
            { prop: "mockState", label: "Mock auth state", options: mockStateOptions, defaultValue: "guest" },
          ],
          render: ({ mockState }) => (
            <MockAuthProvider state={mockState as MockAuthState}>
              <AuthGate>
                <p className="auth-demo-gated">Signed in! This is the gated content behind AuthGate.</p>
              </AuthGate>
            </MockAuthProvider>
          ),
        },
        {
          name: "SignInModal",
          uses: 'import { SignInModal } from "@mono/auth"',
          description:
            "A sign-in dialog with no exit or cancel controls. Offers Continue with Google, email/password sign in or register, and Continue as Guest (Supabase anonymous session). Rendered live below in an embed box so it can be inspected without signing into the docs app.",
          render: () => (
            <MockAuthProvider state="signed-out">
              <div className="auth-demo-modal-embed">
                <SignInModal />
              </div>
            </MockAuthProvider>
          ),
        },
      ]}
    />
  );
}
