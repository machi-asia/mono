"use client";

import { useEffect, useState, useCallback, type MutableRefObject } from "react";
import { useAuth } from "@mono/auth";
import { Usage, Tooltip } from "@mono/components";
import { getRoseUsage, currentDay, type RoseUsage } from "./usage";
import "./usage.css";

export interface UsageBarProps {
  usage?: RoseUsage;
  apiBasePath?: string;
  onRefreshRef?: MutableRefObject<((newUsage?: RoseUsage) => void) | null>;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const DEFAULT_USAGE: RoseUsage = {
  allowed: true,
  count: 0,
  limit: 200,
  week: "",
  dailyCount: 0,
  dailyLimit: 20,
  day: "",
  remaining: 20,
  role: "authenticated",
};

export function getCachedUsage(userId: string): RoseUsage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`rose_usage_${userId}_${currentDay()}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.dailyCount === "number") {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCachedUsage(userId: string, data: RoseUsage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`rose_usage_${userId}_${currentDay()}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function UsageBar({
  usage: initialUsage,
  apiBasePath = "/api/rose",
  onRefreshRef,
  className = "",
  size = "sm",
}: UsageBarProps) {
  const { user, isGuest, session } = useAuth();
  const userId = user?.id || "guest";

  const [usage, setUsage] = useState<RoseUsage>(() => {
    if (initialUsage) return initialUsage;
    const cached = getCachedUsage(userId);
    return cached ?? DEFAULT_USAGE;
  });
  const [loading, setLoading] = useState(!initialUsage && !getCachedUsage(userId));

  useEffect(() => {
    if (initialUsage) {
      setUsage(initialUsage);
      setCachedUsage(userId, initialUsage);
      setLoading(false);
    }
  }, [initialUsage, userId]);

  const fetchUsage = useCallback(
    async (explicitUsage?: RoseUsage) => {
      if (explicitUsage) {
        setUsage(explicitUsage);
        setCachedUsage(userId, explicitUsage);
        setLoading(false);
        return;
      }

      try {
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
        if (user?.id) {
          headers["x-user-id"] = user.id;
        }
        const res = await fetch(`${apiBasePath}/usage`, { headers }).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data && typeof data.dailyCount === "number") {
            setUsage(data);
            setCachedUsage(userId, data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback to client database check
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const roles: string[] = [];
        if (isGuest) roles.push("guest");
        const userRoles = (user as any)?.roles;
        if (Array.isArray(userRoles)) {
          roles.push(...userRoles);
        }
        const data = await getRoseUsage(user.id, roles);
        setUsage(data);
        setCachedUsage(userId, data);
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    },
    [user, isGuest, session, apiBasePath, userId]
  );

  useEffect(() => {
    if (onRefreshRef) {
      onRefreshRef.current = fetchUsage;
    }
  }, [onRefreshRef, fetchUsage]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const isAdmin = usage.role === "admin" || usage.limit === Infinity;
  const roleLabel = isAdmin ? "Admin" : usage.role === "guest" ? "Guest" : "User";

  return (
    <div className={`m-rose-usage-bar ${className}`} data-mono="rose-usage-bar">
      <div className="m-rose-usage-meta">
        <div className="m-rose-usage-role-row">
          <div className="m-rose-usage-role-pill" data-role={usage.role || "authenticated"}>
            <span className="m-rose-usage-role-dot" />
            <span>{roleLabel} Tier</span>
          </div>
          <Tooltip
            variant="help"
            position="bottom"
            triggerAriaLabel="View Rose usage tiers"
            content={
              <div className="m-rose-tier-tooltip">
                <div className="m-rose-tier-tooltip-title">Rose Usage Tiers</div>
                <ul className="m-rose-tier-tooltip-list">
                  <li>
                    <strong>Guest:</strong> 10 msgs/day (50/week)
                  </li>
                  <li>
                    <strong>User:</strong> 20 msgs/day (200/week)
                  </li>
                  <li>
                    <strong>Admin:</strong> Unlimited messages
                  </li>
                </ul>
              </div>
            }
          />
        </div>
        <span className="m-rose-usage-quota-text">
          {isAdmin
            ? "Unlimited Messages"
            : loading
            ? "Calculating quota…"
            : usage.allowed
            ? `${usage.remaining} remaining today`
            : usage.exceededType === "daily"
            ? "Daily limit reached"
            : "Weekly quota reached"}
        </span>
      </div>

      {!isAdmin && (
        <Usage
          label="Messages Today"
          used={usage.dailyCount}
          total={usage.dailyLimit || 20}
          size={size}
          warningThreshold={75}
          dangerThreshold={90}
          showPercentage={true}
        />
      )}
    </div>
  );
}

export default UsageBar;
