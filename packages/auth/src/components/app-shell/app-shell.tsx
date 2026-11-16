"use client";

import type { ReactNode } from "react";
import { OtaUpdateNotifier, ThemeProvider, type ThemeProviderProps } from "@mono/components";
import type { UserRole } from "@mono/database";
import { AuthProvider } from "../provider/provider";
import { AuthGate } from "../auth-gate/auth-gate";
import { UsageProvider, type UsageProviderProps } from "../usage/usage-provider";

export interface MonoAppShellProps {
  children: ReactNode;
  /** Default theme mode when mounting ThemeProvider (defaults to "dark") */
  defaultTheme?: ThemeProviderProps["defaultTheme"];
  /** Whether to require authentication via AuthGate (defaults to false for public apps) */
  requireAuth?: boolean;
  /** Enable Capacitor / Capgo OTA update notifications (defaults to true) */
  enableOta?: boolean;
  /** Optional header / navbar element rendered above the main content */
  header?: ReactNode;
  /** Optional footer element rendered below the main content */
  footer?: ReactNode;
  /** Optional role override for UsageProvider (for previews/testing) */
  roleOverride?: UserRole;
  /** Optional initial usage counts for UsageProvider */
  initialUsageCounts?: UsageProviderProps["initialCounts"];
  /** Disable automatic usage snapshot fetch on mount */
  disableUsageAutoFetch?: boolean;
}

/**
 * Unified, modular application shell combining ThemeProvider, OtaUpdateNotifier,
 * AuthProvider (which includes ToastProvider), UsageProvider, and optional AuthGate.
 * Drop into any app root layout or feature module to wire theme, auth, and
 * real-time usage quota tracking in a single component.
 */
export function MonoAppShell({
  children,
  defaultTheme = "dark",
  requireAuth = false,
  enableOta = true,
  header,
  footer,
  roleOverride,
  initialUsageCounts,
  disableUsageAutoFetch = false,
}: MonoAppShellProps) {
  const inner = requireAuth ? <AuthGate>{children}</AuthGate> : children;

  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      {enableOta ? <OtaUpdateNotifier /> : null}
      <AuthProvider>
        <UsageProvider
          roleOverride={roleOverride}
          initialCounts={initialUsageCounts}
          disableAutoFetch={disableUsageAutoFetch}
        >
          {header}
          {inner}
          {footer}
        </UsageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
