"use client";

import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import { useAuth, useApiClient } from "@mono/auth";
import type {
  AdminManageUsageRequest,
  AdminOverviewResponse,
  AdminUserRole,
} from "@mono/api-client";
import { Button, Card, Row, SkeletonCard } from "@mono/components";
import {
  Activity,
  Bot,
  ExternalLink,
  Globe,
  Layers,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  TicketCheck,
  Users,
} from "lucide-react";
import { getSiteAdminMeta, getSitesByDomainGroup } from "../lib/site-registry";
import { AdminGate } from "./admin-gate";
import { RoseChatsPanel } from "./rose-chats-panel";
import { UsageQuotasPanel } from "./usage-quotas-panel";
import { UsersOriginsPanel } from "./users-origins-panel";

export type AdminTabKey =
  | "overview"
  | "users"
  | "usage"
  | "rose-chats"
  | "support";

export interface AdminDashboardProps {
  siteId?: string;
  initialTab?: AdminTabKey;
}

export function AdminDashboard({ siteId = "all", initialTab = "overview" }: AdminDashboardProps) {
  const { user } = useAuth();
  const apiClient = useApiClient();
  const siteMeta = siteId !== "all" ? getSiteAdminMeta(siteId) : undefined;

  const [activeTab, setActiveTab] = useState<AdminTabKey>(initialTab);
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [updatingUsageKey, setUpdatingUsageKey] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadOverview = useCallback(
    async (silent = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        const targetSite = siteMeta ? siteMeta.appFilter : siteId;
        const data = await apiClient.admin.getOverview(targetSite);
        setOverview(data);
        setStatusMessage(null);
      } catch (err: unknown) {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to load admin telemetry",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [apiClient, siteId, siteMeta]
  );

  useEffect(() => {
    let cancelled = false;
    const targetSite = siteMeta ? siteMeta.appFilter : siteId;
    apiClient.admin
      .getOverview(targetSite)
      .then((data) => {
        if (!cancelled) {
          setOverview(data);
          setStatusMessage(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setStatusMessage({
            type: "error",
            text: err instanceof Error ? err.message : "Failed to load admin telemetry",
          });
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
  }, [apiClient, siteId, siteMeta]);

  const handleUpdateRole = async (targetUserId: string, role: AdminUserRole) => {
    setUpdatingUserId(targetUserId);
    try {
      await apiClient.admin.updateUserRole(targetUserId, role);
      setStatusMessage({
        type: "success",
        text: `Updated user ${targetUserId.slice(0, 8)}… role to '${role}'.`,
      });
      await loadOverview(true);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update role",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleManageUsage = async (payload: AdminManageUsageRequest) => {
    const key = `${payload.userId}::${payload.app || "global"}::${payload.metric}`;
    setUpdatingUsageKey(key);
    try {
      await apiClient.admin.manageUsage(payload);
      setStatusMessage({
        type: "success",
        text:
          payload.action === "reset"
            ? `Reset ${payload.metric} counters for ${payload.userId.slice(0, 8)}….`
            : `Updated quota limits for ${payload.metric}.`,
      });
      await loadOverview(true);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update usage quota",
      });
    } finally {
      setUpdatingUsageKey(null);
    }
  };

  const handleDeleteRoseChat = async (targetUserId: string, conversationId: string) => {
    setDeletingChatId(conversationId);
    try {
      await apiClient.admin.deleteRoseChat(targetUserId, conversationId);
      setStatusMessage({
        type: "success",
        text: `Deleted Rose conversation ${conversationId}.`,
      });
      await loadOverview(true);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete conversation",
      });
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    status: "open" | "in_progress" | "resolved" | "closed"
  ) => {
    setUpdatingTicketId(ticketId);
    try {
      await apiClient.admin.updateTicketStatus(ticketId, status);
      setStatusMessage({
        type: "success",
        text: `Updated ticket ${ticketId.slice(0, 8)}… to ${status}.`,
      });
      await loadOverview(true);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update support ticket",
      });
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <AdminGate>
      <main className="admin-shell">
        <div className="admin-container">
          <div className="admin-hero">
            <div>
              <h1 className="admin-hero-title">
                <ShieldCheck size={26} style={{ color: "var(--color-primary)" }} />
                <span>{siteMeta ? `${siteMeta.name} Admin` : "Machi Asia Admin Portal"}</span>
              </h1>
              <p className="admin-hero-subtitle">
                {siteMeta
                  ? `${siteMeta.description} (${siteMeta.domain})`
                  : "Monitor logged-in users, guests, traffic origins, API quotas, Rose AI Redis chats, and per-site portals."}
              </p>
            </div>

            <Row wrap gap="var(--space-2)">
              {siteMeta ? (
                <NextLink href="/" style={{ textDecoration: "none" }}>
                  <Button type="button" variant="secondary" size="sm">
                    All Sites Overview
                  </Button>
                </NextLink>
              ) : null}
              <Button
                type="button"
                variant="primary"
                size="sm"
                loading={refreshing}
                icon={<RefreshCw size={14} />}
                onClick={() => void loadOverview(true)}
              >
                Refresh Telemetry
              </Button>
            </Row>
          </div>

          {statusMessage ? (
            <Card
              style={{
                borderColor:
                  statusMessage.type === "error"
                    ? "var(--color-error)"
                    : "var(--color-success)",
              }}
            >
              <Row justify="space-between" align="center">
                <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                  {statusMessage.text}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatusMessage(null)}
                >
                  Dismiss
                </Button>
              </Row>
            </Card>
          ) : null}

          <div className="admin-tabs" role="tablist" aria-label="Admin sections">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "overview"}
              data-active={activeTab === "overview"}
              className="admin-tab-btn"
              onClick={() => setActiveTab("overview")}
            >
              <Activity size={15} /> Overview & Sites
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "users"}
              data-active={activeTab === "users"}
              className="admin-tab-btn"
              onClick={() => setActiveTab("users")}
            >
              <Users size={15} /> Users, Guests & Roles
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "usage"}
              data-active={activeTab === "usage"}
              className="admin-tab-btn"
              onClick={() => setActiveTab("usage")}
            >
              <Layers size={15} /> Usage & Quotas
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "rose-chats"}
              data-active={activeTab === "rose-chats"}
              className="admin-tab-btn"
              onClick={() => setActiveTab("rose-chats")}
            >
              <Bot size={15} /> Rose AI Chats (Redis)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "support"}
              data-active={activeTab === "support"}
              className="admin-tab-btn"
              onClick={() => setActiveTab("support")}
            >
              <TicketCheck size={15} /> Support & Consensus
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : overview ? (
            <>
              {activeTab === "overview" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                  <div className="admin-kpi-grid">
                    <Card className="admin-kpi-card">
                      <span className="admin-kpi-label">
                        Online Now <Globe size={14} />
                      </span>
                      <p className="admin-kpi-value">{overview.stats.onlineVisitors}</p>
                      <span className="admin-kpi-sub">
                        Active in last 5m ({overview.stats.totalSessions} total sessions)
                      </span>
                    </Card>

                    <Card className="admin-kpi-card">
                      <span className="admin-kpi-label">
                        Users & Guests <Users size={14} />
                      </span>
                      <p className="admin-kpi-value">
                        {overview.stats.totalUsers} / {overview.stats.totalGuests}
                      </p>
                      <span className="admin-kpi-sub">Registered users / Guest visitors</span>
                    </Card>

                    <Card className="admin-kpi-card">
                      <span className="admin-kpi-label">
                        Rose AI Chats <MessageSquare size={14} />
                      </span>
                      <p className="admin-kpi-value">{overview.stats.totalRoseChats}</p>
                      <span className="admin-kpi-sub">Conversations cached in Redis</span>
                    </Card>

                    <Card className="admin-kpi-card">
                      <span className="admin-kpi-label">
                        Tickets & Reports <TicketCheck size={14} />
                      </span>
                      <p className="admin-kpi-value">
                        {overview.stats.openTickets} / {overview.stats.pendingReports}
                      </p>
                      <span className="admin-kpi-sub">Open tickets / Pending ItemList reports</span>
                    </Card>
                  </div>

                  <div className="admin-breakdown-grid">
                    <BreakdownCard title="Traffic by Machi Asia App" data={overview.breakdowns.byApp} />
                    <BreakdownCard title="Where Visitors Come From (Referrer)" data={overview.breakdowns.byReferrer} />
                    <BreakdownCard title="Geo Locations (Country)" data={overview.breakdowns.byCountry} />
                    <BreakdownCard title="Devices" data={overview.breakdowns.byDevice} />
                  </div>

                  {!siteMeta ? (
                    <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                      <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                        Per-Site Admin Portals
                      </h2>
                      <div className="admin-domain-sections">
                        {getSitesByDomainGroup().map((section) => {
                          const sectionSessions = section.sites.reduce(
                            (sum, site) => sum + (overview.breakdowns.byApp[site.appFilter] || 0),
                            0
                          );
                          return (
                            <div key={section.id} className="admin-domain-group">
                              <div className="admin-domain-header">
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                  <h3 className="admin-domain-title">
                                    <Globe size={16} style={{ color: "var(--color-primary)" }} />
                                    <span>{section.title}</span>
                                    <span
                                      className={`admin-badge ${
                                        section.id === "machi.asia" ? "admin-badge-admin" : "admin-badge-pro"
                                      }`}
                                    >
                                      {section.pattern}
                                    </span>
                                  </h3>
                                  <p className="admin-muted" style={{ margin: 0, fontSize: "0.83rem" }}>
                                    {section.description}
                                  </p>
                                </div>
                                <span className="admin-mono admin-muted" style={{ fontSize: "0.78rem" }}>
                                  {section.sites.length} sites · {sectionSessions} sessions
                                </span>
                              </div>

                              <div className="admin-site-grid">
                                {section.sites.map((site) => (
                                  <Card key={site.id} className="admin-site-card">
                                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                                      <Row justify="space-between" align="flex-start" wrap gap="var(--space-2)">
                                        <strong style={{ fontSize: "0.98rem" }}>{site.name}</strong>
                                        <span className="admin-badge">{site.domain}</span>
                                      </Row>
                                      <p className="admin-muted" style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.45 }}>
                                        {site.description}
                                      </p>
                                    </div>
                                    <Row
                                      justify="space-between"
                                      align="center"
                                      wrap
                                      gap="var(--space-2)"
                                      style={{
                                        paddingTop: "var(--space-2)",
                                        borderTop: "1px solid var(--color-border-soft)",
                                      }}
                                    >
                                      <span className="admin-mono admin-muted" style={{ fontSize: "0.75rem" }}>
                                        {overview.breakdowns.byApp[site.appFilter] || 0} sessions
                                      </span>
                                      <NextLink href={site.adminPath} style={{ textDecoration: "none" }}>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="secondary"
                                          icon={<ExternalLink size={13} />}
                                        >
                                          Open Admin
                                        </Button>
                                      </NextLink>
                                    </Row>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}
                </div>
              ) : null}

              {activeTab === "users" ? (
                <UsersOriginsPanel
                  users={overview.users}
                  currentAdminId={user?.id}
                  onUpdateRole={handleUpdateRole}
                  updatingUserId={updatingUserId}
                />
              ) : null}

              {activeTab === "usage" ? (
                <UsageQuotasPanel
                  records={overview.usages}
                  users={overview.users}
                  onManageUsage={handleManageUsage}
                  updatingKey={updatingUsageKey}
                />
              ) : null}

              {activeTab === "rose-chats" ? (
                <RoseChatsPanel
                  conversations={overview.roseChats}
                  onDeleteConversation={handleDeleteRoseChat}
                  deletingId={deletingChatId}
                />
              ) : null}

              {activeTab === "support" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <Card>
                    <Row justify="space-between" align="center" wrap gap="var(--space-2)">
                      <div>
                        <h3 style={{ margin: "0 0 var(--space-1)", fontSize: "1.05rem" }}>
                          ItemList Moderation & Recipe Consensus
                        </h3>
                        <p className="admin-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                          {overview.stats.pendingReports} pending item report(s) in queue.
                        </p>
                      </div>
                      <NextLink href="/itemlist" style={{ textDecoration: "none" }}>
                        <Button type="button" size="sm" variant="primary" icon={<ExternalLink size={14} />}>
                          Open ItemList Admin (/itemlist)
                        </Button>
                      </NextLink>
                    </Row>
                  </Card>

                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ticket</th>
                          <th>App & Type</th>
                          <th>User</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.tickets.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="admin-muted" style={{ textAlign: "center" }}>
                              No support tickets found.
                            </td>
                          </tr>
                        ) : (
                          overview.tickets.map((t) => (
                            <tr key={t.id}>
                              <td>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                  <strong>{t.subject}</strong>
                                  <span className="admin-muted" style={{ fontSize: "0.82rem" }}>
                                    {t.message}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <Row gap="0.3rem" wrap>
                                  <span className="admin-badge">{t.app}</span>
                                  <span className="admin-badge">{t.type}</span>
                                </Row>
                              </td>
                              <td>{t.user_email || t.user_id || "Anonymous"}</td>
                              <td>
                                <select
                                  aria-label={`Status for ticket ${t.subject}`}
                                  className="admin-select"
                                  value={t.status}
                                  disabled={updatingTicketId === t.id}
                                  onChange={(e) =>
                                    void handleUpdateTicketStatus(
                                      t.id,
                                      e.target.value as "open" | "in_progress" | "resolved" | "closed"
                                    )
                                  }
                                >
                                  <option value="open">Open</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </main>
    </AdminGate>
  );
}

function BreakdownCard({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <Card>
      <h3 style={{ margin: "0 0 var(--space-3)", fontSize: "0.95rem", fontWeight: 700 }}>
        {title}
      </h3>
      {entries.length === 0 ? (
        <p className="admin-muted" style={{ margin: 0, fontSize: "0.84rem" }}>
          No sessions recorded yet.
        </p>
      ) : (
        <ul className="admin-breakdown-list">
          {entries.map(([label, count]) => (
            <li key={label} className="admin-breakdown-item">
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {label}
              </span>
              <strong>{count}</strong>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
