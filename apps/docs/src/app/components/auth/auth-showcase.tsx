"use client";

import { useContext } from "react";
import { ComponentShowcase } from "@mono/components";
import {
  AuthGate,
  AuthNavbar,
  SignInModal,
  UsageProvider,
  UsageTracker,
  UsageGate,
  type UsageGateMode,
  type UserRole,
} from "@mono/auth";
import { AuthContext } from "@mono/auth/provider";
import { MockAuthProvider, type MockAuthState } from "@mono/auth/mock";
import "./auth-demo.css";

const mockStateOptions: { label: string; value: MockAuthState }[] = [
  { label: "Signed in (user)", value: "signed-in" },
  { label: "Signed in (guest)", value: "guest" },
  { label: "Signed out", value: "signed-out" },
  { label: "Loading", value: "loading" },
];

const themeOptions = [
  { label: "Dark mode", value: "dark" },
  { label: "Light mode", value: "light" },
];

const metricOptions = [
  { label: "Blueprint Exports (blueprint_exports)", value: "blueprint_exports" },
  { label: "Rose AI Turns (turns)", value: "turns" },
  { label: "API Requests (requests)", value: "requests" },
  { label: "AI Tokens (ai_tokens)", value: "ai_tokens" },
  { label: "Voice Minutes (voice_minutes)", value: "voice_minutes" },
];

const variantOptions = [
  { label: "Card", value: "card" },
  { label: "Inline", value: "inline" },
  { label: "Compact Pill", value: "compact" },
];

const gateModeOptions = [
  { label: "Overlay Lock", value: "overlay" },
  { label: "Banner Callout", value: "banner" },
  { label: "Disable Content", value: "disable" },
];

const roleOptions = [
  { label: "Guest", value: "guest" },
  { label: "Member", value: "member" },
  { label: "Pro", value: "pro" },
  { label: "Admin", value: "admin" },
];

const navbarVariantOptions = [
  { label: "Default", value: "default" },
  { label: "Floating", value: "floating" },
  { label: "Compact", value: "compact" },
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
      description="Authentication, MonoAppShell, AuthNavbar, and plug-and-play Usage Quota components from the shared @mono/auth package. Any feature or component across the monorepo can track or gate usage with <UsageTracker /> and <UsageGate />."
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
          name: "AuthNavbar",
          uses: 'import { AuthNavbar } from "@mono/auth"',
          description:
            "Drop-in auth-aware navigation bar that automatically wires useAuth() to @mono/components's <Navbar />, renders <AccountSettings /> (with shortcuts to Profile, Usage & Quotas, and Display), renders <SignInModal /> for multi-account switching, and optionally embeds a live compact <UsageTracker /> pill.",
          propControls: [
            { prop: "variant", label: "Variant", options: navbarVariantOptions, defaultValue: "default" },
            { prop: "metric", label: "Usage Pill Metric", options: metricOptions, defaultValue: "blueprint_exports" },
          ],
          render: ({ variant, metric }) => (
            <MockAuthProvider state="signed-in">
              <UsageProvider
                roleOverride="member"
                disableAutoFetch
                initialCounts={{
                  [metric || "blueprint_exports"]: {
                    dailyUsed: 4,
                    dailyLimit: 25,
                  },
                }}
              >
                <AuthNavbar
                  variant={(variant as "default" | "floating" | "compact") || "default"}
                  brand={<span>Machi Asia</span>}
                  links={[
                    { label: "Home", href: "/", active: true },
                    { label: "Calculator", href: "https://calculator.machi-asia.com" },
                    { label: "Docs", href: "/docs" },
                  ]}
                  usageMetric={metric || "blueprint_exports"}
                  showDisplayMenuItem
                />
              </UsageProvider>
            </MockAuthProvider>
          ),
        },
        {
          name: "AuthGate",
          uses: 'import { AuthGate } from "@mono/auth"',
          description:
            "Client gate. While the session loads it shows a loading state; without a user it renders SignInModal; once a session exists it renders its children. Use the dropdown to drive the mock auth state and see the gate react live in light or dark theme.",
          propControls: [
            { prop: "mockState", label: "Mock auth state", options: mockStateOptions, defaultValue: "guest" },
            { prop: "theme", label: "Theme mode", options: themeOptions, defaultValue: "dark" },
          ],
          render: ({ mockState, theme }) => (
            <MockAuthProvider state={(mockState as MockAuthState) || "guest"}>
              <div
                className={`auth-demo-embed-theme ${theme === "light" ? "light" : "dark"}`}
                data-theme={theme || "dark"}
              >
                <AuthGate>
                  <p className="auth-demo-gated">Signed in! This is the gated content behind AuthGate.</p>
                </AuthGate>
              </div>
            </MockAuthProvider>
          ),
        },
        {
          name: "UsageTracker",
          uses: 'import { UsageProvider, UsageTracker, useUsage } from "@mono/auth"',
          description:
            "Plug-and-play usage meter for any registered or custom metric key. Click '+1' to test live optimistic quota tracking and watch the meter automatically lock when the daily limit is reached.",
          propControls: [
            { prop: "metric", label: "Metric", options: metricOptions, defaultValue: "blueprint_exports" },
            { prop: "variant", label: "Variant", options: variantOptions, defaultValue: "card" },
            { prop: "role", label: "Active Role", options: roleOptions, defaultValue: "guest" },
          ],
          render: ({ metric, variant, role }) => (
            <MockAuthProvider state={role === "guest" ? "guest" : "signed-in"}>
              <UsageProvider
                key={`${metric}-${role}`}
                roleOverride={(role as UserRole) || "guest"}
                disableAutoFetch
                initialCounts={{
                  [metric || "blueprint_exports"]: {
                    dailyUsed: 3,
                    dailyLimit: 5,
                    monthlyUsed: 18,
                    monthlyLimit: 30,
                  },
                }}
              >
                <UsageTracker
                  metric={metric || "blueprint_exports"}
                  variant={(variant as "card" | "inline" | "compact") || "card"}
                  showAction
                  actionLabel="Record +1"
                  dailyLimitOverride={5}
                  monthlyLimitOverride={30}
                />
              </UsageProvider>
            </MockAuthProvider>
          ),
        },
        {
          name: "UsageGate",
          uses: 'import { UsageGate } from "@mono/auth"',
          description:
            "Declarative quota & role gate. Automatically locks child modules when the metric quota is exhausted or when the user's tier is below minRole. Switch between Overlay, Banner, and Disable modes or change the role to Member/Pro to unlock.",
          propControls: [
            { prop: "mode", label: "Lock Mode", options: gateModeOptions, defaultValue: "overlay" },
            { prop: "role", label: "User Role", options: roleOptions, defaultValue: "guest" },
          ],
          render: ({ mode, role }) => (
            <MockAuthProvider state={role === "guest" ? "guest" : "signed-in"}>
              <UsageProvider
                key={`gate-${mode}-${role}`}
                roleOverride={(role as UserRole) || "guest"}
                disableAutoFetch
                initialCounts={{
                  blueprint_exports: {
                    dailyUsed: role === "guest" ? 5 : 2,
                    dailyLimit: 5,
                  },
                }}
              >
                <UsageGate
                  metric="blueprint_exports"
                  minRole="member"
                  mode={(mode as UsageGateMode) || "overlay"}
                  dailyLimitOverride={5}
                >
                  <div className="auth-demo-gated" style={{ padding: "24px" }}>
                    <strong>Unlocked Blueprint Exporter Module</strong>
                    <p style={{ margin: "6px 0 0", opacity: 0.8 }}>
                      Your role ({role || "guest"}) has active quota remaining for this component!
                    </p>
                  </div>
                </UsageGate>
              </UsageProvider>
            </MockAuthProvider>
          ),
        },
        {
          name: "SignInModal",
          uses: 'import { SignInModal } from "@mono/auth"',
          description:
            "A sign-in dialog with no exit or cancel controls. Offers Continue with Google, email/password sign in or register, and Continue as Guest (Supabase anonymous session). Test both dark and light modes using the Theme mode control.",
          propControls: [
            { prop: "theme", label: "Theme mode", options: themeOptions, defaultValue: "dark" },
          ],
          render: ({ theme }) => (
            <MockAuthProvider state="signed-out">
              <div
                className={`auth-demo-modal-embed ${theme === "light" ? "light" : "dark"}`}
                data-theme={theme || "dark"}
              >
                <SignInModal />
              </div>
            </MockAuthProvider>
          ),
        },
      ]}
    />
  );
}
