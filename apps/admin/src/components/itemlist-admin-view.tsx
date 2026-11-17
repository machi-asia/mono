"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useApiClient } from "@mono/auth";
import type { ItemListReportItem } from "@mono/api-client";
import { Button, Card, Row, SkeletonCard } from "@mono/components";
import { Check, RotateCcw, Search, ShieldCheck, Users, XCircle } from "lucide-react";
import { AdminGate } from "./admin-gate";

export function ItemListAdminView() {
  const apiClient = useApiClient();
  const [reports, setReports] = useState<ItemListReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gameFilter, setGameFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.itemlist.admin.getReports();
      setReports(Array.isArray(data) ? data : []);
      setErrorMsg(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load ItemList reports");
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    let cancelled = false;
    apiClient.itemlist.admin
      .getReports()
      .then((data) => {
        if (!cancelled) {
          setReports(Array.isArray(data) ? data : []);
          setErrorMsg(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : "Failed to load ItemList reports");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [apiClient]);

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: "pending" | "resolved" | "rejected"
  ) => {
    setUpdatingId(reportId);
    try {
      const res = await apiClient.itemlist.admin.updateReportStatus(reportId, newStatus);
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
        );
        setErrorMsg(null);
      } else {
        setErrorMsg(res.error || "Unknown error updating report");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update report status");
    } finally {
      setUpdatingId(null);
    }
  };

  const consensusCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of reports) {
      if (r.status !== "rejected") {
        map.set(r.consensus_key, (map.get(r.consensus_key) || 0) + 1);
      }
    }
    return map;
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesSearch =
        !q ||
        r.item_name.toLowerCase().includes(q) ||
        r.item_id.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.suggested_fix && r.suggested_fix.toLowerCase().includes(q));
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesGame = gameFilter === "all" || r.game_id === gameFilter;
      return matchesSearch && matchesStatus && matchesGame;
    });
  }, [gameFilter, reports, search, statusFilter]);

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const consensusOverriddenCount = Array.from(consensusCounts.values()).filter((c) => c >= 3).length;

  return (
    <AdminGate>
      <main className="admin-shell">
        <div className="admin-container">
          <div className="admin-hero">
            <div>
              <h1 className="admin-hero-title">
                <ShieldCheck size={26} style={{ color: "var(--color-primary)" }} />
                <span>ItemList Moderation & Consensus</span>
              </h1>
              <p className="admin-hero-subtitle">
                Community recipe data consensus, Create Mod & RimWorld issue report triage (`admin.machi.asia/itemlist`).
              </p>
            </div>

            <Row wrap gap="var(--space-2)">
              <NextLink href="/create" style={{ textDecoration: "none" }}>
                <Button type="button" variant="secondary" size="sm">
                  Create Site Telemetry
                </Button>
              </NextLink>
              <NextLink href="/rimworld" style={{ textDecoration: "none" }}>
                <Button type="button" variant="secondary" size="sm">
                  RimWorld Site Telemetry
                </Button>
              </NextLink>
              <Button type="button" variant="primary" size="sm" onClick={() => void loadReports()}>
                Refresh Reports
              </Button>
            </Row>
          </div>

          {errorMsg ? (
            <Card style={{ borderColor: "var(--color-error)" }}>
              <span style={{ color: "var(--color-error-soft)", fontSize: "0.88rem" }}>
                {errorMsg}
              </span>
            </Card>
          ) : null}

          <div className="admin-kpi-grid">
            <Card className="admin-kpi-card">
              <span className="admin-kpi-label">Total Issue Reports</span>
              <p className="admin-kpi-value">{reports.length}</p>
            </Card>
            <Card className="admin-kpi-card">
              <span className="admin-kpi-label">Pending Review</span>
              <p className="admin-kpi-value">{pendingCount}</p>
            </Card>
            <Card className="admin-kpi-card">
              <span className="admin-kpi-label">Active Consensus Overrides</span>
              <p className="admin-kpi-value">{consensusOverriddenCount}</p>
              <span className="admin-kpi-sub">3+ matching reports trigger automatic override</span>
            </Card>
          </div>

          <div className="admin-toolbar">
            <div className="admin-input-wrap">
              <Search size={15} className="admin-input-icon" />
              <input
                type="text"
                aria-label="Search ItemList reports"
                placeholder="Search reports by item name, ID, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input admin-input-with-icon"
              />
            </div>

            <Row wrap gap="var(--space-2)">
              <select
                aria-label="Filter report status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                aria-label="Filter report game"
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="admin-select"
              >
                <option value="all">All Games</option>
                <option value="create">Create Mod</option>
                <option value="rimworld">RimWorld</option>
              </select>
            </Row>
          </div>

          {loading ? (
            <SkeletonCard />
          ) : filteredReports.length === 0 ? (
            <Card>
              <p className="admin-muted" style={{ margin: 0, textAlign: "center" }}>
                No issue reports match your filters.
              </p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {filteredReports.map((report) => {
                const count = consensusCounts.get(report.consensus_key) || 1;
                const hasConsensus = count >= 3;

                return (
                  <Card key={report.id}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                      <Row justify="space-between" align="center" wrap gap="var(--space-2)">
                        <Row align="center" wrap gap="var(--space-2)">
                          <strong style={{ fontSize: "1rem" }}>{report.item_name}</strong>
                          <span className="admin-mono admin-muted" style={{ fontSize: "0.78rem" }}>
                            ({report.item_id})
                          </span>
                          <span className="admin-badge">{report.game_id}</span>
                          <span className="admin-badge">{report.issue_type}</span>
                        </Row>

                        <Row align="center" gap="var(--space-2)">
                          {hasConsensus ? (
                            <span className="admin-badge admin-badge-online">
                              <Users size={12} /> Consensus ({count} reports)
                            </span>
                          ) : null}
                          <span
                            className={
                              report.status === "resolved"
                                ? "admin-badge admin-badge-online"
                                : report.status === "rejected"
                                  ? "admin-badge admin-badge-danger"
                                  : "admin-badge admin-badge-guest"
                            }
                          >
                            {report.status}
                          </span>
                        </Row>
                      </Row>

                      {(report.description || report.suggested_fix) ? (
                        <div style={{ fontSize: "0.86rem" }}>
                          {report.description ? (
                            <p style={{ margin: "0 0 var(--space-1)" }}>
                              <span className="admin-muted">Description: </span>
                              {report.description}
                            </p>
                          ) : null}
                          {report.suggested_fix ? (
                            <p style={{ margin: 0 }}>
                              <span className="admin-muted">Suggested Fix: </span>
                              {report.suggested_fix}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <Row justify="space-between" align="center" wrap gap="var(--space-2)">
                        <span className="admin-muted" style={{ fontSize: "0.76rem" }}>
                          Reported {new Date(report.created_at).toLocaleString()} • ID:{" "}
                          <span className="admin-mono">{report.id.slice(0, 8)}</span>
                        </span>

                        <Row gap="var(--space-2)" wrap>
                          {report.status !== "resolved" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="primary"
                              disabled={updatingId === report.id}
                              icon={<Check size={13} />}
                              onClick={() => void handleUpdateStatus(report.id, "resolved")}
                            >
                              Mark Resolved
                            </Button>
                          ) : null}
                          {report.status !== "rejected" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              disabled={updatingId === report.id}
                              icon={<XCircle size={13} />}
                              onClick={() => void handleUpdateStatus(report.id, "rejected")}
                            >
                              Reject
                            </Button>
                          ) : null}
                          {report.status !== "pending" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={updatingId === report.id}
                              icon={<RotateCcw size={13} />}
                              onClick={() => void handleUpdateStatus(report.id, "pending")}
                            >
                              Reset to Pending
                            </Button>
                          ) : null}
                        </Row>
                      </Row>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </AdminGate>
  );
}
