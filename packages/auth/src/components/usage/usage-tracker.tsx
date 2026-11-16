"use client";

import { Activity, Lock, Plus, RefreshCw, Sparkles } from "lucide-react";
import { Usage, type UsageSize } from "@mono/components";
import type { UsageMetric, UsageMetricDefinition } from "@mono/database";
import { useUsage } from "./usage-provider";
import "./usage.css";

export interface UsageTrackerProps {
  /** Metric key to read & track (e.g. "requests", "turns", "blueprint_exports", or any custom string) */
  metric: UsageMetric;
  /** Optional custom label override */
  label?: string;
  /** Which quota windows to display */
  period?: "daily" | "monthly" | "both";
  /** Visual presentation style */
  variant?: "card" | "inline" | "compact";
  /** Size of the underlying progress bar */
  size?: UsageSize;
  /** Show a refresh button */
  showRefresh?: boolean;
  /** Show an interactive action button to increment/test or upgrade when locked */
  showAction?: boolean;
  /** Label for the interactive increment button when `showAction` is true */
  actionLabel?: string;
  /** Amount to increment when the action button is clicked (default 1) */
  actionAmount?: number;
  /** Optional daily limit override */
  dailyLimitOverride?: number;
  /** Optional monthly limit override */
  monthlyLimitOverride?: number;
  /** Optional custom metric definition for ad-hoc component metrics */
  definition?: Partial<UsageMetricDefinition>;
  className?: string;
}

function scaleValue(value: number, divisor = 1): number {
  if (!Number.isFinite(value)) return 999_999;
  if (divisor <= 1) return value;
  return Math.round((value / divisor) * 10) / 10;
}

export function UsageTracker({
  metric,
  label,
  period = "both",
  variant = "card",
  size = "sm",
  showRefresh = false,
  showAction = false,
  actionLabel = "Record +1",
  actionAmount = 1,
  dailyLimitOverride,
  monthlyLimitOverride,
  definition,
  className = "",
}: UsageTrackerProps) {
  const usage = useUsage(metric, {
    definition,
    dailyLimitOverride,
    monthlyLimitOverride,
  });

  const divisor = usage.definition.formatDivisor || 1;
  const displayUnit = usage.definition.unit;
  const displayTitle = label || usage.definition.label;

  const dailyUsedScaled = scaleValue(usage.dailyUsed, divisor);
  const dailyLimitScaled = scaleValue(usage.dailyLimit, divisor);
  const monthlyUsedScaled = scaleValue(usage.monthlyUsed, divisor);
  const monthlyLimitScaled = scaleValue(usage.monthlyLimit, divisor);

  if (variant === "compact") {
    return (
      <div
        className={`mono-usage-tracker mono-usage-tracker--compact ${className}`}
        data-mono="usage-tracker"
        data-metric={metric}
      >
        {usage.locked ? (
          <Lock size={13} style={{ color: "var(--color-error, #ef4444)" }} />
        ) : (
          <Activity size={13} style={{ color: "var(--color-primary, #6366f1)" }} />
        )}
        <span>{displayTitle}:</span>
        <span>
          {dailyUsedScaled}/{Number.isFinite(usage.dailyLimit) ? dailyLimitScaled : "∞"}{" "}
          {displayUnit}
        </span>
        {usage.locked ? (
          <button
            type="button"
            className="mono-usage-tracker-btn mono-usage-tracker-btn--primary"
            onClick={() => usage.openUpgradeModal("usage")}
          >
            Unlock
          </button>
        ) : showAction ? (
          <button
            type="button"
            className="mono-usage-tracker-btn"
            onClick={() => void usage.track(actionAmount)}
          >
            +{actionAmount}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`mono-usage-tracker mono-usage-tracker--${variant} ${className}`}
      data-mono="usage-tracker"
      data-metric={metric}
    >
      <div className="mono-usage-tracker-header">
        <div className="mono-usage-tracker-title-group">
          <span className="mono-usage-tracker-title">{displayTitle}</span>
          <span
            className={`mono-usage-tracker-badge${
              usage.locked
                ? " mono-usage-tracker-badge--locked"
                : usage.status === "warning" || usage.status === "danger"
                  ? " mono-usage-tracker-badge--warning"
                  : ""
            }`}
          >
            {usage.locked ? "Locked" : `${usage.role} tier`}
          </span>
        </div>

        <div className="mono-usage-tracker-actions">
          {showRefresh ? (
            <button
              type="button"
              className="mono-usage-tracker-btn"
              onClick={() => void usage.refresh()}
              disabled={usage.loading}
              aria-label={`Refresh ${displayTitle}`}
            >
              <RefreshCw size={12} />
              <span>{usage.loading ? "Syncing…" : "Refresh"}</span>
            </button>
          ) : null}

          {showAction && !usage.locked ? (
            <button
              type="button"
              className="mono-usage-tracker-btn"
              onClick={() => void usage.track(actionAmount)}
            >
              <Plus size={12} />
              <span>{actionLabel}</span>
            </button>
          ) : null}

          {usage.locked ? (
            <button
              type="button"
              className="mono-usage-tracker-btn mono-usage-tracker-btn--primary"
              onClick={() => usage.openUpgradeModal("usage")}
            >
              <Sparkles size={12} />
              <span>{usage.role === "guest" ? "Sign In to Unlock" : "View Quotas"}</span>
            </button>
          ) : null}
        </div>
      </div>

      {(period === "daily" || period === "both") && (
        <Usage
          label={period === "both" ? "Daily Quota" : displayTitle}
          used={dailyUsedScaled}
          total={dailyLimitScaled}
          unit={displayUnit}
          size={size}
          warningThreshold={usage.definition.warningThreshold}
          dangerThreshold={usage.definition.dangerThreshold}
        />
      )}

      {(period === "monthly" || period === "both") && (
        <Usage
          label={period === "both" ? "Monthly Quota" : displayTitle}
          used={monthlyUsedScaled}
          total={monthlyLimitScaled}
          unit={displayUnit}
          size={size}
          warningThreshold={usage.definition.warningThreshold}
          dangerThreshold={usage.definition.dangerThreshold}
        />
      )}
    </div>
  );
}
