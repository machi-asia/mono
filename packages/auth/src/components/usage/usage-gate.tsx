"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Lock, ShieldAlert, Sparkles } from "lucide-react";
import {
  isRoleAtLeast,
  type UsageMetric,
  type UsageMetricDefinition,
  type UserRole,
} from "@mono/database";
import { useUsage, type UseUsageReturn } from "./usage-provider";
import "./usage.css";

export type UsageGateMode = "overlay" | "disable" | "banner" | "render";

export interface UsageGateProps {
  /** Metric key to gate on */
  metric: UsageMetric;
  /** Optional minimum role required to unlock this feature */
  minRole?: UserRole;
  /** How to render the locked state when quota is reached or role is insufficient */
  mode?: UsageGateMode;
  /** Optional custom title when locked */
  lockTitle?: string;
  /** Optional custom message when locked */
  lockMessage?: string;
  /** Optional custom CTA label */
  ctaLabel?: string;
  /** Automatically increment usage by 1 when mounted while unlocked */
  autoTrackOnMount?: boolean;
  /** Optional daily limit override */
  dailyLimitOverride?: number;
  /** Optional monthly limit override */
  monthlyLimitOverride?: number;
  /** Optional custom metric definition */
  definition?: Partial<UsageMetricDefinition>;
  /** Custom fallback node when locked (used in "banner" or custom replacement) */
  fallback?: ReactNode;
  /** Standard ReactNode children or a render-prop receiving the live `UseUsageReturn` state */
  children: ReactNode | ((usage: UseUsageReturn) => ReactNode);
  className?: string;
}

export function UsageGate({
  metric,
  minRole,
  mode = "overlay",
  lockTitle,
  lockMessage,
  ctaLabel,
  autoTrackOnMount = false,
  dailyLimitOverride,
  monthlyLimitOverride,
  definition,
  fallback,
  children,
  className = "",
}: UsageGateProps) {
  const usage = useUsage(metric, {
    definition: minRole ? { ...definition, minRole } : definition,
    dailyLimitOverride,
    monthlyLimitOverride,
  });

  const trackedMountRef = useRef(false);
  const roleBlocked = minRole ? !isRoleAtLeast(usage.role, minRole) : false;
  const isLocked = usage.locked || roleBlocked;

  useEffect(() => {
    if (autoTrackOnMount && !isLocked && !trackedMountRef.current) {
      trackedMountRef.current = true;
      void usage.track(1);
    }
  }, [autoTrackOnMount, isLocked, usage]);

  if (typeof children === "function") {
    return <>{children({ ...usage, locked: isLocked, allowed: !isLocked })}</>;
  }

  if (!isLocked) {
    return (
      <div className={`mono-usage-gate ${className}`} data-mono="usage-gate" data-locked="false">
        {children}
      </div>
    );
  }

  const resolvedTitle =
    lockTitle ||
    (roleBlocked
      ? `${(minRole || "member").toUpperCase()} Tier Required`
      : `${usage.definition.label} Limit Reached`);

  const resolvedMessage =
    lockMessage ||
    (roleBlocked
      ? `This module requires at least the ${(minRole || "member").toUpperCase()} role. Your active tier is ${usage.role.toUpperCase()}.`
      : `You have used ${usage.dailyUsed}/${usage.dailyLimit} ${usage.definition.unit} today. ${
          usage.role === "guest"
            ? "Sign in for free to unlock higher Member & Pro quotas."
            : "Upgrade your tier or wait for the next quota window."
        }`);

  const resolvedCta =
    ctaLabel || (usage.role === "guest" ? "Sign In to Unlock" : "View Usage & Quotas");

  if (fallback) {
    return (
      <div className={`mono-usage-gate ${className}`} data-mono="usage-gate" data-locked="true">
        {fallback}
      </div>
    );
  }

  if (mode === "banner") {
    return (
      <div className={`mono-usage-gate ${className}`} data-mono="usage-gate" data-locked="true">
        <div className="mono-usage-gate-banner" role="alert">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2, 8px)" }}>
            <ShieldAlert size={18} style={{ color: "var(--color-error, #ef4444)", flexShrink: 0 }} />
            <div>
              <div className="mono-usage-gate-title">{resolvedTitle}</div>
              <div className="mono-usage-gate-desc">{resolvedMessage}</div>
            </div>
          </div>
          <button
            type="button"
            className="mono-usage-tracker-btn mono-usage-tracker-btn--primary"
            onClick={() => usage.openUpgradeModal("usage")}
          >
            <Sparkles size={12} />
            <span>{resolvedCta}</span>
          </button>
        </div>
        <div className="mono-usage-gate--disabled-content" aria-disabled="true">
          {children}
        </div>
      </div>
    );
  }

  if (mode === "disable") {
    return (
      <div
        className={`mono-usage-gate ${className}`}
        data-mono="usage-gate"
        data-locked="true"
        title={`${resolvedTitle}: ${resolvedMessage}`}
      >
        <div className="mono-usage-gate--disabled-content" aria-disabled="true">
          {children}
        </div>
      </div>
    );
  }

  // Default: "overlay"
  return (
    <div className={`mono-usage-gate ${className}`} data-mono="usage-gate" data-locked="true">
      <div className="mono-usage-gate--disabled-content" aria-hidden="true">
        {children}
      </div>
      <div className="mono-usage-gate-overlay" role="region" aria-label={resolvedTitle}>
        <Lock size={22} style={{ color: "var(--color-error, #ef4444)" }} />
        <div className="mono-usage-gate-title">{resolvedTitle}</div>
        <div className="mono-usage-gate-desc">{resolvedMessage}</div>
        <button
          type="button"
          className="mono-usage-tracker-btn mono-usage-tracker-btn--primary"
          onClick={() => usage.openUpgradeModal("usage")}
        >
          <Sparkles size={13} />
          <span>{resolvedCta}</span>
        </button>
      </div>
    </div>
  );
}
