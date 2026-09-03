"use client";

import { useMemo, type ReactNode } from "react";
import "./usage.css";

export type UsageStatus = "normal" | "warning" | "danger" | "exceeded";
export type UsageSize = "sm" | "md" | "lg";

export interface UsageProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
  size?: UsageSize;
  warningThreshold?: number; // default 75%
  dangerThreshold?: number;  // default 90%
  description?: ReactNode;
  showPercentage?: boolean;
  className?: string;
}

export function formatUsageNumber(val: number): string {
  if (Number.isInteger(val)) {
    return val.toLocaleString();
  }
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function Usage({
  label,
  used,
  total,
  unit = "",
  size = "md",
  warningThreshold = 75,
  dangerThreshold = 90,
  description,
  showPercentage = true,
  className = "",
}: UsageProps) {
  const percentage = useMemo(() => {
    if (total <= 0) return 0;
    return (used / total) * 100;
  }, [used, total]);

  // Clamped percentage for progress bar width
  const barWidth = useMemo(() => {
    return Math.min(100, Math.max(0, percentage));
  }, [percentage]);

  const status: UsageStatus = useMemo(() => {
    if (percentage > 100) return "exceeded";
    if (percentage >= dangerThreshold) return "danger";
    if (percentage >= warningThreshold) return "warning";
    return "normal";
  }, [percentage, dangerThreshold, warningThreshold]);

  const unitSuffix = unit ? ` ${unit}` : "";

  return (
    <div
      className={`m-usage m-usage--${size} m-usage--${status} ${className}`}
      data-mono="usage"
    >
      <div className="m-usage-header">
        <span className="m-usage-label">{label}</span>
        <div className="m-usage-numbers">
          <span className="m-usage-used">
            {formatUsageNumber(used)}
          </span>
          <span className="m-usage-divider">/</span>
          <span className="m-usage-total">
            {formatUsageNumber(total)}{unitSuffix}
          </span>
          {showPercentage ? (
            <span className="m-usage-percent">
              ({percentage.toFixed(0)}%)
            </span>
          ) : null}
        </div>
      </div>

      <div
        className="m-usage-track"
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${label} usage: ${used} of ${total}${unitSuffix}`}
      >
        <div
          className="m-usage-fill"
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {description ? (
        <div className="m-usage-description">{description}</div>
      ) : null}
    </div>
  );
}
