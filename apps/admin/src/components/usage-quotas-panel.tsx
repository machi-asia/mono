"use client";

import { useMemo, useState } from "react";
import type {
  AdminDirectoryUser,
  AdminManageUsageRequest,
  AdminUsageRecord,
} from "@mono/api-client";
import { Button, Card, Row, Usage } from "@mono/components";
import { RotateCcw, Search, Sliders } from "lucide-react";

export interface UsageQuotasPanelProps {
  records: AdminUsageRecord[];
  users: AdminDirectoryUser[];
  onManageUsage: (payload: AdminManageUsageRequest) => Promise<void>;
  updatingKey?: string | null;
}

interface PairedUsageRow {
  key: string;
  userId: string;
  app: string;
  metric: string;
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
  updatedAt: string;
}

export function UsageQuotasPanel({
  records,
  users,
  onManageUsage,
  updatingKey,
}: UsageQuotasPanelProps) {
  const [search, setSearch] = useState("");
  const [appFilter, setAppFilter] = useState("all");
  const [metricFilter, setMetricFilter] = useState("all");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [dailyInput, setDailyInput] = useState("250");
  const [monthlyInput, setMonthlyInput] = useState("3500");

  const userLookup = useMemo(() => {
    const map = new Map<string, AdminDirectoryUser>();
    for (const u of users) {
      map.set(u.userId, u);
    }
    return map;
  }, [users]);

  const pairedRows = useMemo(() => {
    const grouped = new Map<string, PairedUsageRow>();
    for (const r of records) {
      const key = `${r.user_id}::${r.app}::${r.metric}`;
      const existing = grouped.get(key) || {
        key,
        userId: r.user_id,
        app: r.app,
        metric: r.metric,
        dailyCount: 0,
        dailyLimit: 0,
        monthlyCount: 0,
        monthlyLimit: 0,
        updatedAt: r.updated_at,
      };

      if (r.period_type === "daily") {
        existing.dailyCount = Number(r.count || 0);
        existing.dailyLimit = Number(r.usage_limit || 0);
      } else {
        existing.monthlyCount = Number(r.count || 0);
        existing.monthlyLimit = Number(r.usage_limit || 0);
      }
      if (new Date(r.updated_at).getTime() > new Date(existing.updatedAt).getTime()) {
        existing.updatedAt = r.updated_at;
      }
      grouped.set(key, existing);
    }

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [records]);

  const distinctApps = useMemo(
    () => Array.from(new Set(pairedRows.map((r) => r.app))).sort(),
    [pairedRows]
  );
  const distinctMetrics = useMemo(
    () => Array.from(new Set(pairedRows.map((r) => r.metric))).sort(),
    [pairedRows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pairedRows.filter((row) => {
      if (appFilter !== "all" && row.app !== appFilter) return false;
      if (metricFilter !== "all" && row.metric !== metricFilter) return false;
      if (!q) return true;
      const u = userLookup.get(row.userId);
      return (
        row.userId.toLowerCase().includes(q) ||
        row.app.toLowerCase().includes(q) ||
        row.metric.toLowerCase().includes(q) ||
        (u?.email || "").toLowerCase().includes(q) ||
        (u?.displayName || "").toLowerCase().includes(q)
      );
    });
  }, [appFilter, metricFilter, pairedRows, search, userLookup]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div className="admin-toolbar">
        <div className="admin-input-wrap">
          <Search size={15} className="admin-input-icon" />
          <input
            type="text"
            aria-label="Search usage records"
            placeholder="Search by user email, ID, app, or metric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input admin-input-with-icon"
          />
        </div>

        <Row wrap gap="var(--space-2)">
          <select
            aria-label="Filter usage by app"
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Apps</option>
            {distinctApps.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter usage by metric"
            value={metricFilter}
            onChange={(e) => setMetricFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Metrics</option>
            {distinctMetrics.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Row>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="admin-muted" style={{ margin: 0, textAlign: "center" }}>
            No recorded usage buckets yet for the current filters.
          </p>
        </Card>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Guest</th>
                <th>App & Metric</th>
                <th>Daily Quota</th>
                <th>Monthly Quota</th>
                <th>Admin Controls</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const user = userLookup.get(row.userId);
                const isBusy = updatingKey === row.key;
                const isEditing = editingKey === row.key;

                return (
                  <tr key={row.key}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{ fontWeight: 700 }}>
                          {user?.displayName || user?.email || "Tracked Account / Guest"}
                        </span>
                        <span className="admin-mono admin-muted" style={{ fontSize: "0.74rem" }}>
                          {row.userId}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span className="admin-badge" style={{ width: "fit-content" }}>
                          {row.app}
                        </span>
                        <span className="admin-mono" style={{ fontWeight: 600 }}>
                          {row.metric}
                        </span>
                      </div>
                    </td>

                    <td style={{ minWidth: 190 }}>
                      <Usage
                        label="Daily"
                        size="sm"
                        used={row.dailyCount}
                        total={Math.max(1, row.dailyLimit || row.dailyCount || 1)}
                      />
                    </td>

                    <td style={{ minWidth: 190 }}>
                      <Usage
                        label="Monthly"
                        size="sm"
                        used={row.monthlyCount}
                        total={Math.max(1, row.monthlyLimit || row.monthlyCount || 1)}
                      />
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <Row gap="0.4rem" wrap>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            loading={isBusy}
                            icon={<RotateCcw size={13} />}
                            onClick={() =>
                              void onManageUsage({
                                userId: row.userId,
                                app: row.app,
                                metric: row.metric,
                                action: "reset",
                              })
                            }
                          >
                            Reset
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            icon={<Sliders size={13} />}
                            onClick={() => {
                              if (isEditing) {
                                setEditingKey(null);
                              } else {
                                setEditingKey(row.key);
                                setDailyInput(String(row.dailyLimit || 250));
                                setMonthlyInput(String(row.monthlyLimit || 3500));
                              }
                            }}
                          >
                            {isEditing ? "Cancel" : "Limits"}
                          </Button>
                        </Row>

                        {isEditing ? (
                          <Row gap="0.35rem" align="center" wrap>
                            <input
                              type="number"
                              min={0}
                              aria-label="Daily limit override"
                              value={dailyInput}
                              onChange={(e) => setDailyInput(e.target.value)}
                              className="admin-input"
                              style={{ width: 82 }}
                              placeholder="Daily"
                            />
                            <input
                              type="number"
                              min={0}
                              aria-label="Monthly limit override"
                              value={monthlyInput}
                              onChange={(e) => setMonthlyInput(e.target.value)}
                              className="admin-input"
                              style={{ width: 92 }}
                              placeholder="Monthly"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="primary"
                              loading={isBusy}
                              onClick={() => {
                                const dailyLimit = Number.parseInt(dailyInput, 10);
                                const monthlyLimit = Number.parseInt(monthlyInput, 10);
                                void onManageUsage({
                                  userId: row.userId,
                                  app: row.app,
                                  metric: row.metric,
                                  action: "set_limits",
                                  dailyLimit: Number.isFinite(dailyLimit) ? dailyLimit : undefined,
                                  monthlyLimit: Number.isFinite(monthlyLimit)
                                    ? monthlyLimit
                                    : undefined,
                                }).then(() => setEditingKey(null));
                              }}
                            >
                              Save
                            </Button>
                          </Row>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
