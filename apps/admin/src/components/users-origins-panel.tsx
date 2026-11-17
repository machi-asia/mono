"use client";

import { useMemo, useState } from "react";
import type { AdminDirectoryUser, AdminUserRole } from "@mono/api-client";
import { Button, Card, Row } from "@mono/components";
import {
  Globe,
  Laptop,
  MapPin,
  Search,
  Shield,
  Smartphone,
  Tablet,
  UserCheck,
  UserCog,
} from "lucide-react";

export interface UsersOriginsPanelProps {
  users: AdminDirectoryUser[];
  currentAdminId?: string | null;
  onUpdateRole: (userId: string, role: AdminUserRole) => Promise<void>;
  updatingUserId?: string | null;
}

const ROLE_OPTIONS: Array<{ value: AdminUserRole; label: string }> = [
  { value: "guest", label: "Guest" },
  { value: "member", label: "User (Member)" },
  { value: "pro", label: "Pro" },
  { value: "admin", label: "Admin" },
];

function DeviceIcon({ type }: { type?: string | null }) {
  if (type === "mobile") return <Smartphone size={14} />;
  if (type === "tablet") return <Tablet size={14} />;
  return <Laptop size={14} />;
}

function getRoleBadgeClass(role: AdminUserRole): string {
  if (role === "admin") return "admin-badge admin-badge-admin";
  if (role === "pro") return "admin-badge admin-badge-pro";
  if (role === "guest") return "admin-badge admin-badge-guest";
  return "admin-badge";
}

export function UsersOriginsPanel({
  users,
  currentAdminId,
  onUpdateRole,
  updatingUserId,
}: UsersOriginsPanelProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "online" | "users" | "guests">("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (typeFilter === "online" && !u.isOnline) return false;
      if (typeFilter === "users" && u.isGuest) return false;
      if (typeFilter === "guests" && !u.isGuest) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      if (!q) return true;
      return (
        u.userId.toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.displayName || "").toLowerCase().includes(q) ||
        (u.currentApp || "").toLowerCase().includes(q) ||
        (u.referrer || "").toLowerCase().includes(q) ||
        (u.country || "").toLowerCase().includes(q) ||
        (u.city || "").toLowerCase().includes(q)
      );
    });
  }, [roleFilter, search, typeFilter, users]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div className="admin-toolbar">
        <div className="admin-input-wrap">
          <Search size={15} className="admin-input-icon" />
          <input
            type="text"
            aria-label="Search users and guests"
            placeholder="Search by email, ID, site, referrer, country, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input admin-input--with-icon"
          />
        </div>

        <Row wrap gap="var(--space-2)">
          <select
            aria-label="Filter visitor type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="admin-select"
          >
            <option value="all">All Visitors ({users.length})</option>
            <option value="online">Online Now ({users.filter((u) => u.isOnline).length})</option>
            <option value="users">Logged-in Users ({users.filter((u) => !u.isGuest).length})</option>
            <option value="guests">Guests ({users.filter((u) => u.isGuest).length})</option>
          </select>

          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Roles</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Row>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="admin-muted" style={{ margin: 0, textAlign: "center" }}>
            No users or guests match the active filters.
          </p>
        </Card>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Identity & Status</th>
                <th>Site & Origin (Referrer)</th>
                <th>Location & Device</th>
                <th>Usage & Rose Chats</th>
                <th>Role Control</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isSelf = Boolean(currentAdminId && u.userId === currentAdminId);
                const isBusy = updatingUserId === u.userId;

                return (
                  <tr key={u.userId}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <Row align="center" gap="var(--space-2)" wrap>
                          <span style={{ fontWeight: 700 }}>
                            {u.displayName || u.email || (u.isGuest ? "Guest Visitor" : "User")}
                          </span>
                          {u.isOnline ? (
                            <span className="admin-badge admin-badge-online">● Online</span>
                          ) : (
                            <span className="admin-badge">Offline</span>
                          )}
                          <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                        </Row>
                        {u.email ? (
                          <span className="admin-mono admin-muted" style={{ fontSize: "0.78rem" }}>
                            {u.email}
                          </span>
                        ) : null}
                        <span className="admin-mono admin-muted" style={{ fontSize: "0.72rem" }}>
                          {u.userId}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <Row align="center" gap="0.35rem">
                          <Globe size={13} />
                          <span style={{ fontWeight: 600 }}>{u.currentApp || "unknown"}</span>
                          {u.pathname ? (
                            <span className="admin-mono admin-muted" style={{ fontSize: "0.76rem" }}>
                              {u.pathname}
                            </span>
                          ) : null}
                        </Row>
                        <span className="admin-muted" style={{ fontSize: "0.78rem" }}>
                          From: {u.referrer || "Direct / Bookmark"}
                        </span>
                        {u.utmSource ? (
                          <span className="admin-badge" style={{ width: "fit-content" }}>
                            utm_source: {u.utmSource}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <Row align="center" gap="0.35rem">
                          <MapPin size={13} />
                          <span>
                            {[u.city, u.region, u.country].filter(Boolean).join(", ") || "Unknown Location"}
                          </span>
                        </Row>
                        <Row align="center" gap="0.35rem" className="admin-muted" style={{ fontSize: "0.78rem" }}>
                          <DeviceIcon type={u.deviceType} />
                          <span>
                            {[u.deviceType, u.browser, u.os].filter(Boolean).join(" • ") || "Unknown Device"}
                          </span>
                        </Row>
                        {u.lastSeenAt ? (
                          <span className="admin-muted" style={{ fontSize: "0.72rem" }}>
                            Seen: {new Date(u.lastSeenAt).toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span>
                          Today: <strong>{u.totalDailyUsage.toLocaleString()}</strong>
                        </span>
                        <span className="admin-muted" style={{ fontSize: "0.78rem" }}>
                          Month: {u.totalMonthlyUsage.toLocaleString()}
                        </span>
                        <span className="admin-muted" style={{ fontSize: "0.78rem" }}>
                          Rose Chats: {u.roseChatCount}
                        </span>
                      </div>
                    </td>

                    <td>
                      {u.canChangeRole ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <select
                            aria-label={`Role for ${u.email || u.userId}`}
                            className="admin-select"
                            value={u.role}
                            disabled={isBusy || isSelf}
                            onChange={(e) =>
                              void onUpdateRole(u.userId, e.target.value as AdminUserRole)
                            }
                          >
                            {ROLE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {!isSelf ? (
                            <Row gap="0.35rem" wrap>
                              {u.role !== "admin" ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  loading={isBusy}
                                  icon={<Shield size={13} />}
                                  onClick={() => void onUpdateRole(u.userId, "admin")}
                                >
                                  Make Admin
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  loading={isBusy}
                                  icon={<UserCheck size={13} />}
                                  onClick={() => void onUpdateRole(u.userId, "member")}
                                >
                                  Make User
                                </Button>
                              )}
                            </Row>
                          ) : (
                            <span className="admin-muted" style={{ fontSize: "0.72rem" }}>
                              Active admin (self-locked)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="admin-badge" title="IP-only guest has no Supabase auth.users row">
                          <UserCog size={12} /> IP Guest
                        </span>
                      )}
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
