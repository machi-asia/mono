"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import { RefreshCw, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Usage } from "@mono/components";
import {
  ROLE_QUOTAS,
  currentDay,
  currentMonth,
  getMetricDefinition,
  getUserUsageSummary,
  listRegisteredMetrics,
  listUserMedia,
  resolveSafeRoleFromUser,
  type UsageMetric,
  type UserUsageRecord,
} from "@mono/database";
import { createClient } from "../../client";
import { UsageContext } from "../usage/usage-provider";

interface UsageSectionProps {
  user: User;
  /** Optional subset of metrics to display (defaults to all core + registered metrics) */
  metrics?: UsageMetric[];
}

interface MetricUsageSummary {
  metric: UsageMetric;
  label: string;
  unit: string;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  formatDivisor?: number;
}

const CORE_LABEL_OVERRIDES: Record<string, { label: string; unit: string; formatDivisor?: number }> = {
  turns: { label: "Rose AI Messages", unit: "msgs" },
  storage_bytes: { label: "Cloud Media Storage", unit: "KB", formatDivisor: 1024 },
};

const HIDDEN_DEFAULT_METRICS = new Set<string>(["requests", "ai_tokens"]);

export function UsageSection({ user, metrics }: UsageSectionProps) {
  const usageCtx = useContext(UsageContext);
  const role = resolveSafeRoleFromUser(user);
  const roleQuotas = ROLE_QUOTAS[role] ?? ROLE_QUOTAS.member;

  const [records, setRecords] = useState<UserUsageRecord[]>([]);
  const [mediaStorageBytes, setMediaStorageBytes] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUsage = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const [rows, mediaResult] = await Promise.all([
        getUserUsageSummary(user.id, supabase as any),
        listUserMedia(supabase as any, { userId: user.id, pageSize: 1000 }).catch(() => null),
      ]);
      setRecords(Array.isArray(rows) ? rows : []);
      const mediaItems = Array.isArray(mediaResult?.items) ? mediaResult.items : [];
      const totalBytes = mediaItems.reduce(
        (sum, file) => sum + Number(file.size ?? (file as { size_bytes?: number }).size_bytes ?? 0),
        0
      );
      setMediaStorageBytes(totalBytes);
      if (usageCtx) {
        await usageCtx.refreshMetrics(metrics);
      }
    } catch {
      setRecords([]);
      setMediaStorageBytes(0);
    } finally {
      setLoading(false);
    }
  }, [metrics, usageCtx, user.id]);

  useEffect(() => {
    void loadUsage();
  }, [loadUsage]);

  const day = currentDay();
  const month = currentMonth();

  const metricKeys: UsageMetric[] =
    metrics && metrics.length > 0
      ? metrics
      : listRegisteredMetrics()
          .map((def) => def.metric)
          .filter((m) => !HIDDEN_DEFAULT_METRICS.has(m));

  const summaries: MetricUsageSummary[] = metricKeys.map((metricKey) => {
    const def = getMetricDefinition(metricKey);
    const override = CORE_LABEL_OVERRIDES[metricKey];
    const quota = roleQuotas[metricKey] ?? def.quotas[role] ?? def.quotas.member;
    const divisor = override?.formatDivisor ?? def.formatDivisor ?? 1;

    const ctxState = usageCtx?.metrics?.[metricKey];
    const dbDailyTotal = records
      .filter((r) => r.metric === metricKey && r.period_type === "daily" && r.period_key === day)
      .reduce((sum, r) => sum + Number(r.count || 0), 0);

    const dbMonthlyTotal = records
      .filter((r) => r.metric === metricKey && r.period_type === "monthly" && r.period_key === month)
      .reduce((sum, r) => sum + Number(r.count || 0), 0);

    const dailyTotal = Math.max(dbDailyTotal, ctxState?.dailyUsed ?? 0);
    const monthlyTotal = Math.max(
      dbMonthlyTotal,
      ctxState?.monthlyUsed ?? 0,
      metricKey === "storage_bytes" ? mediaStorageBytes : 0
    );

    return {
      metric: metricKey,
      label: override?.label ?? def.label,
      unit: override?.unit ?? def.unit,
      dailyUsed: Math.round((dailyTotal / divisor) * 10) / 10,
      dailyLimit: Math.round((quota.daily / divisor) * 10) / 10,
      monthlyUsed: Math.round((monthlyTotal / divisor) * 10) / 10,
      monthlyLimit: Math.round((quota.monthly / divisor) * 10) / 10,
    };
  });

  const anyLocked = summaries.some((s) =>
    s.metric === "storage_bytes"
      ? s.monthlyUsed >= s.monthlyLimit
      : s.dailyUsed >= s.dailyLimit || s.monthlyUsed >= s.monthlyLimit
  );

  return (
    <section className="auth-settings-section auth-usage-section">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          marginBottom: "var(--space-4)",
        }}
      >
        <div>
          <h2 className="auth-settings-section-title">API Usage & Quotas</h2>
          <p className="auth-settings-section-desc" style={{ marginBottom: 0 }}>
            Message limits and account quotas enforced for your user tier.
          </p>
        </div>
        <button
          type="button"
          className="auth-settings-btn"
          onClick={() => void loadUsage()}
          disabled={loading}
          aria-label="Refresh usage"
        >
          <RefreshCw size={14} className={loading ? "auth-spin" : ""} />
          <span>{loading ? "Refreshing…" : "Refresh"}</span>
        </button>
      </div>

      <div className="auth-profile-card" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {anyLocked ? (
            <ShieldAlert size={24} style={{ color: "var(--color-error)" }} />
          ) : (
            <CheckCircle2 size={24} style={{ color: "var(--color-success)" }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Active Tier: <span style={{ textTransform: "uppercase", color: "var(--color-primary)" }}>{role}</span>
            </div>
            <div className="auth-settings-muted">
              {anyLocked
                ? "One or more API quotas have reached their limit and are temporarily locked."
                : "All API endpoints and AI gateways are unlocked and operating within quota."}
            </div>
          </div>
        </div>
        <div className="auth-profile-badges">
          <span className="auth-profile-badge auth-profile-badge--role">
            {role.toUpperCase()} TIER
          </span>
          <span className="auth-profile-badge">
            Period: {day}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-4)",
          marginTop: "var(--space-3)",
        }}
      >
        {summaries.map((item) => (
          <div
            key={item.metric}
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{item.label}</div>
            {item.metric === "storage_bytes" ? (
              <Usage
                label="Total Storage"
                used={item.monthlyUsed}
                total={item.monthlyLimit}
                unit={item.unit}
                size="sm"
              />
            ) : (
              <>
                <Usage
                  label="Daily Quota"
                  used={item.dailyUsed}
                  total={item.dailyLimit}
                  unit={item.unit}
                  size="sm"
                />
                <Usage
                  label="Monthly Quota"
                  used={item.monthlyUsed}
                  total={item.monthlyLimit}
                  unit={item.unit}
                  size="sm"
                />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
