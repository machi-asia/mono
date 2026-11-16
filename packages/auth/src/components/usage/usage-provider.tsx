"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiClient } from "@mono/api-client";
import {
  currentDay,
  currentMonth,
  getMetricDefinition,
  getRoleQuotaForMetric,
  isRoleAtLeast,
  listRegisteredMetrics,
  registerUsageMetric,
  type CheckUsageResult,
  type UsageMetric,
  type UsageMetricDefinition,
  type UserRole,
} from "@mono/database";
import { AuthContext } from "../provider/provider";
import { SignInModal } from "../sign-in-modal/sign-in-modal";
import { AccountSettings, type TopLevelTab } from "../account-settings/account-settings";

export interface UsageMetricState {
  metric: UsageMetric;
  definition: UsageMetricDefinition;
  role: UserRole;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  remaining: number;
  allowed: boolean;
  locked: boolean;
  exceededType?: "daily" | "monthly" | "role";
  status: "default" | "warning" | "danger" | "locked";
  loading: boolean;
}

export interface UsageContextValue {
  role: UserRole;
  userId: string;
  loading: boolean;
  metrics: Record<string, UsageMetricState>;
  getMetricState: (metric: UsageMetric, customDef?: Partial<UsageMetricDefinition>) => UsageMetricState;
  trackMetric: (
    metric: UsageMetric,
    amount?: number,
    options?: {
      app?: string;
      checkOnly?: boolean;
      dailyLimitOverride?: number;
      monthlyLimitOverride?: number;
    }
  ) => Promise<CheckUsageResult>;
  refreshMetrics: (metricKeys?: UsageMetric[]) => Promise<void>;
  openUpgradeModal: (tab?: TopLevelTab) => void;
  openSignInModal: () => void;
}

export const UsageContext = createContext<UsageContextValue | null>(null);

function computeStatus(
  dailyUsed: number,
  dailyLimit: number,
  monthlyUsed: number,
  monthlyLimit: number,
  allowed: boolean,
  def: UsageMetricDefinition
): "default" | "warning" | "danger" | "locked" {
  if (!allowed || dailyUsed >= dailyLimit || monthlyUsed >= monthlyLimit) {
    return "locked";
  }
  const dailyPct = dailyLimit > 0 && Number.isFinite(dailyLimit) ? (dailyUsed / dailyLimit) * 100 : 0;
  const monthlyPct =
    monthlyLimit > 0 && Number.isFinite(monthlyLimit) ? (monthlyUsed / monthlyLimit) * 100 : 0;
  const maxPct = Math.max(dailyPct, monthlyPct);
  const danger = def.dangerThreshold ?? 90;
  const warning = def.warningThreshold ?? 75;
  if (maxPct >= danger) return "danger";
  if (maxPct >= warning) return "warning";
  return "default";
}

export function buildMetricState(
  metric: UsageMetric,
  role: UserRole,
  counts?: {
    dailyUsed?: number;
    dailyLimit?: number;
    monthlyUsed?: number;
    monthlyLimit?: number;
    exceededType?: "daily" | "monthly" | "role";
  },
  loading = false,
  customDef?: Partial<UsageMetricDefinition>
): UsageMetricState {
  const baseDef = getMetricDefinition(metric);
  const def: UsageMetricDefinition = customDef ? { ...baseDef, ...customDef } : baseDef;
  const quota = getRoleQuotaForMetric(role, metric);

  const dailyUsed = counts?.dailyUsed ?? 0;
  const dailyLimit = role === "admin" ? Infinity : (counts?.dailyLimit ?? quota.daily);
  const monthlyUsed = counts?.monthlyUsed ?? 0;
  const monthlyLimit = role === "admin" ? Infinity : (counts?.monthlyLimit ?? quota.monthly);

  const roleAllowed = def.minRole ? isRoleAtLeast(role, def.minRole) : true;
  const dailyAllowed = dailyUsed < dailyLimit;
  const monthlyAllowed = monthlyUsed < monthlyLimit;
  const allowed = role === "admin" ? true : roleAllowed && dailyAllowed && monthlyAllowed;
  const locked = !allowed;

  const exceededType =
    counts?.exceededType ??
    (!roleAllowed ? "role" : !dailyAllowed ? "daily" : !monthlyAllowed ? "monthly" : undefined);

  const remaining =
    role === "admin"
      ? Infinity
      : !allowed
        ? 0
        : Math.min(Math.max(0, dailyLimit - dailyUsed), Math.max(0, monthlyLimit - monthlyUsed));

  return {
    metric,
    definition: def,
    role,
    dailyUsed,
    dailyLimit,
    monthlyUsed,
    monthlyLimit,
    remaining,
    allowed,
    locked,
    exceededType,
    status: computeStatus(dailyUsed, dailyLimit, monthlyUsed, monthlyLimit, allowed, def),
    loading,
  };
}

export interface UsageProviderProps {
  children: ReactNode;
  /** Optional initial or mock metric counts (useful for docs showcases and unit tests) */
  initialCounts?: Record<
    string,
    {
      dailyUsed: number;
      dailyLimit?: number;
      monthlyUsed?: number;
      monthlyLimit?: number;
    }
  >;
  /** Override role when used outside AuthProvider or in interactive demos */
  roleOverride?: UserRole;
  /** Disable network auto-fetch on mount (useful in offline/showcase environments) */
  disableAutoFetch?: boolean;
}

export function UsageProvider({
  children,
  initialCounts,
  roleOverride,
  disableAutoFetch = false,
}: UsageProviderProps) {
  const auth = useContext(AuthContext);
  const role: UserRole = roleOverride ?? auth?.role ?? "guest";
  const userId = auth?.user?.id ?? "guest";
  const accessToken = auth?.session?.access_token ?? null;

  const [countsMap, setCountsMap] = useState<
    Record<
      string,
      {
        dailyUsed: number;
        dailyLimit?: number;
        monthlyUsed: number;
        monthlyLimit?: number;
        exceededType?: "daily" | "monthly" | "role";
      }
    >
  >(() => {
    const initial: Record<
      string,
      {
        dailyUsed: number;
        dailyLimit?: number;
        monthlyUsed: number;
        monthlyLimit?: number;
      }
    > = {};
    if (initialCounts) {
      for (const [k, v] of Object.entries(initialCounts)) {
        initial[k] = {
          dailyUsed: v.dailyUsed,
          dailyLimit: v.dailyLimit,
          monthlyUsed: v.monthlyUsed ?? v.dailyUsed,
          monthlyLimit: v.monthlyLimit,
        };
      }
    }
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<TopLevelTab>("usage");

  const countsRef = useRef(countsMap);
  countsRef.current = countsMap;

  const apiClient = useMemo(
    () =>
      new ApiClient({
        getAuthToken: () => accessToken,
      }),
    [accessToken]
  );

  const refreshMetrics = useCallback(
    async (metricKeys?: UsageMetric[]) => {
      if (disableAutoFetch && !metricKeys) return;
      setLoading(true);

      try {
        // Fetch authoritative usage snapshot strictly from apps/api (/usage/metrics?scope=user)
        const snapshot = await apiClient.usage.getUserQuotaSummary(metricKeys);
        if (snapshot?.metrics) {
          setCountsMap((prev) => {
            const next = { ...prev };
            for (const [k, m] of Object.entries(snapshot.metrics!)) {
              next[k] = {
                dailyUsed: m.dailyUsed,
                dailyLimit: m.dailyLimit,
                monthlyUsed: m.monthlyUsed,
                monthlyLimit: m.monthlyLimit,
                exceededType: m.exceededType,
              };
            }
            return next;
          });
        }
      } catch {
        // Keep current in-memory state if API server is unreachable (e.g. offline test/showcase)
      } finally {
        setLoading(false);
      }
    },
    [apiClient, disableAutoFetch]
  );

  useEffect(() => {
    if (!disableAutoFetch && !initialCounts) {
      void refreshMetrics();
    }
  }, [disableAutoFetch, initialCounts, refreshMetrics]);

  const getMetricState = useCallback(
    (metric: UsageMetric, customDef?: Partial<UsageMetricDefinition>): UsageMetricState => {
      return buildMetricState(metric, role, countsMap[metric], loading, customDef);
    },
    [countsMap, loading, role]
  );

  const trackMetric = useCallback(
    async (
      metric: UsageMetric,
      amount = 1,
      options?: {
        app?: string;
        checkOnly?: boolean;
        dailyLimitOverride?: number;
        monthlyLimitOverride?: number;
      }
    ): Promise<CheckUsageResult> => {
      const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 1;
      const def = getMetricDefinition(metric);
      const current = buildMetricState(metric, role, countsRef.current[metric], false);
      const effectiveDailyLimit = options?.dailyLimitOverride ?? current.dailyLimit;
      const effectiveMonthlyLimit = options?.monthlyLimitOverride ?? current.monthlyLimit;
      const increment = options?.checkOnly ? 0 : safeAmount;
      const day = currentDay();
      const month = currentMonth();

      // Check minimum role requirement first
      if (def.minRole && !isRoleAtLeast(role, def.minRole)) {
        const blocked: CheckUsageResult = {
          allowed: false,
          role,
          metric,
          dailyCount: current.dailyUsed,
          dailyLimit: effectiveDailyLimit,
          monthlyCount: current.monthlyUsed,
          monthlyLimit: effectiveMonthlyLimit,
          exceededType: "role",
          remaining: 0,
          day,
          month,
        };
        setCountsMap((prev) => ({
          ...prev,
          [metric]: {
            dailyUsed: current.dailyUsed,
            dailyLimit: effectiveDailyLimit,
            monthlyUsed: current.monthlyUsed,
            monthlyLimit: effectiveMonthlyLimit,
            exceededType: "role",
          },
        }));
        return blocked;
      }

      // Check local optimistic quota lock before incrementing
      if (increment > 0 && role !== "admin") {
        if (current.dailyUsed + increment > effectiveDailyLimit) {
          const exceeded: CheckUsageResult = {
            allowed: false,
            role,
            metric,
            dailyCount: current.dailyUsed,
            dailyLimit: effectiveDailyLimit,
            monthlyCount: current.monthlyUsed,
            monthlyLimit: effectiveMonthlyLimit,
            exceededType: "daily",
            remaining: 0,
            day,
            month,
          };
          setCountsMap((prev) => ({
            ...prev,
            [metric]: {
              ...prev[metric],
              dailyUsed: current.dailyUsed,
              dailyLimit: effectiveDailyLimit,
              monthlyUsed: current.monthlyUsed,
              monthlyLimit: effectiveMonthlyLimit,
              exceededType: "daily",
            },
          }));
          return exceeded;
        }
        if (current.monthlyUsed + increment > effectiveMonthlyLimit) {
          const exceeded: CheckUsageResult = {
            allowed: false,
            role,
            metric,
            dailyCount: current.dailyUsed,
            dailyLimit: effectiveDailyLimit,
            monthlyCount: current.monthlyUsed,
            monthlyLimit: effectiveMonthlyLimit,
            exceededType: "monthly",
            remaining: 0,
            day,
            month,
          };
          setCountsMap((prev) => ({
            ...prev,
            [metric]: {
              ...prev[metric],
              dailyUsed: current.dailyUsed,
              dailyLimit: effectiveDailyLimit,
              monthlyUsed: current.monthlyUsed,
              monthlyLimit: effectiveMonthlyLimit,
              exceededType: "monthly",
            },
          }));
          return exceeded;
        }
      }

      // Optimistically apply increment locally so UI meters react in 0ms
      const nextDaily = current.dailyUsed + increment;
      const nextMonthly = current.monthlyUsed + increment;
      setCountsMap((prev) => ({
        ...prev,
        [metric]: {
          dailyUsed: nextDaily,
          dailyLimit: effectiveDailyLimit,
          monthlyUsed: nextMonthly,
          monthlyLimit: effectiveMonthlyLimit,
        },
      }));

      // Sync with authoritative API server (/usage/track) when network is enabled
      if (!disableAutoFetch) {
        try {
          const response = await apiClient.usage.track({
            metric,
            app: options?.app || def.defaultApp || "global",
            amount: increment,
            checkOnly: options?.checkOnly,
          });

          if (response?.usage) {
            const res = response.usage;
            const syncedDaily = Math.max(nextDaily, res.dailyCount);
            const syncedMonthly = Math.max(nextMonthly, res.monthlyCount);
            const serverDailyLimit = options?.dailyLimitOverride ?? res.dailyLimit;
            const serverMonthlyLimit = options?.monthlyLimitOverride ?? res.monthlyLimit;
            setCountsMap((prev) => ({
              ...prev,
              [metric]: {
                dailyUsed: syncedDaily,
                dailyLimit: serverDailyLimit,
                monthlyUsed: syncedMonthly,
                monthlyLimit: serverMonthlyLimit,
                exceededType: res.exceededType,
              },
            }));
            return {
              ...res,
              dailyCount: syncedDaily,
              dailyLimit: serverDailyLimit,
              monthlyCount: syncedMonthly,
              monthlyLimit: serverMonthlyLimit,
            };
          }
        } catch {
          // Fall back to optimistic state when offline
        }
      }

      const remDaily = Math.max(0, effectiveDailyLimit - nextDaily);
      const remMonthly = Math.max(0, effectiveMonthlyLimit - nextMonthly);
      return {
        allowed: nextDaily <= effectiveDailyLimit && nextMonthly <= effectiveMonthlyLimit,
        role,
        metric,
        dailyCount: nextDaily,
        dailyLimit: effectiveDailyLimit,
        monthlyCount: nextMonthly,
        monthlyLimit: effectiveMonthlyLimit,
        remaining: Math.min(remDaily, remMonthly),
        day,
        month,
      };
    },
    [apiClient, disableAutoFetch, role]
  );

  const openSignInModal = useCallback(() => {
    setSignInOpen(true);
  }, []);

  const openUpgradeModal = useCallback(
    (tab: TopLevelTab = "usage") => {
      if (!auth?.user || auth.isGuest) {
        setSignInOpen(true);
      } else {
        setSettingsTab(tab);
        setSettingsOpen(true);
      }
    },
    [auth?.isGuest, auth?.user]
  );

  const allMetrics = useMemo(() => {
    const map: Record<string, UsageMetricState> = {};
    const keys = new Set<string>([
      ...listRegisteredMetrics().map((m) => m.metric),
      ...Object.keys(countsMap),
    ]);
    keys.forEach((key) => {
      map[key] = buildMetricState(key, role, countsMap[key], loading);
    });
    return map;
  }, [countsMap, loading, role]);

  const contextValue = useMemo<UsageContextValue>(
    () => ({
      role,
      userId,
      loading,
      metrics: allMetrics,
      getMetricState,
      trackMetric,
      refreshMetrics,
      openUpgradeModal,
      openSignInModal,
    }),
    [
      allMetrics,
      getMetricState,
      loading,
      openSignInModal,
      openUpgradeModal,
      refreshMetrics,
      role,
      trackMetric,
      userId,
    ]
  );

  return (
    <UsageContext.Provider value={contextValue}>
      {children}
      {signInOpen && auth ? (
        <SignInModal
          onClose={() => setSignInOpen(false)}
          title="Unlock Higher Quotas"
          subtitle="Sign in or create a free account to unlock Member & Pro usage tiers."
        />
      ) : null}
      {settingsOpen && auth?.user ? (
        <AccountSettings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          initialTab={settingsTab}
        />
      ) : null}
    </UsageContext.Provider>
  );
}

export interface UseUsageOptions {
  /** Register or override metric definition properties on the fly */
  definition?: Partial<UsageMetricDefinition>;
  /** Custom app namespace when recording usage */
  app?: string;
  /** Override daily limit for this consumer */
  dailyLimitOverride?: number;
  /** Override monthly limit for this consumer */
  monthlyLimitOverride?: number;
}

export interface UseUsageReturn extends UsageMetricState {
  /** Atomically increments usage by `amount` (default 1) and returns the updated quota check result */
  track: (amount?: number) => Promise<CheckUsageResult>;
  /** Checks current quota status without incrementing */
  check: () => Promise<CheckUsageResult>;
  /** Refreshes usage state from the backend/database */
  refresh: () => Promise<void>;
  /** Opens SignInModal (for guests) or AccountSettings Usage & Quotas tab (for signed-in users) */
  openUpgradeModal: (tab?: TopLevelTab) => void;
}

/**
 * Modular hook to read, track, and enforce usage quotas for any metric key.
 * Works both inside a `<UsageProvider>` (shared reactive state across the tree)
 * and standalone (automatically manages local reactive state if no provider is mounted).
 */
export function useUsage(metric: UsageMetric, options?: UseUsageOptions): UseUsageReturn {
  const ctx = useContext(UsageContext);
  const auth = useContext(AuthContext);
  const fallbackRole: UserRole = auth?.role ?? "guest";

  // Register custom definition if provided with full quotas
  useEffect(() => {
    if (options?.definition && options.definition.quotas && options.definition.label && options.definition.unit) {
      registerUsageMetric({
        metric,
        label: options.definition.label,
        unit: options.definition.unit,
        quotas: options.definition.quotas,
        ...options.definition,
      });
    }
  }, [metric, options?.definition]);

  const [standaloneCounts, setStandaloneCounts] = useState<{
    dailyUsed: number;
    dailyLimit?: number;
    monthlyUsed: number;
    monthlyLimit?: number;
    exceededType?: "daily" | "monthly" | "role";
  }>({
    dailyUsed: 0,
    dailyLimit: options?.dailyLimitOverride,
    monthlyUsed: 0,
    monthlyLimit: options?.monthlyLimitOverride,
  });

  const state = useMemo(() => {
    if (ctx) {
      const base = ctx.getMetricState(metric, options?.definition);
      if (options?.dailyLimitOverride !== undefined || options?.monthlyLimitOverride !== undefined) {
        return buildMetricState(
          metric,
          ctx.role,
          {
            dailyUsed: base.dailyUsed,
            dailyLimit: options.dailyLimitOverride ?? base.dailyLimit,
            monthlyUsed: base.monthlyUsed,
            monthlyLimit: options.monthlyLimitOverride ?? base.monthlyLimit,
            exceededType: base.exceededType,
          },
          base.loading,
          options?.definition
        );
      }
      return base;
    }
    return buildMetricState(
      metric,
      fallbackRole,
      {
        ...standaloneCounts,
        dailyLimit: options?.dailyLimitOverride ?? standaloneCounts.dailyLimit,
        monthlyLimit: options?.monthlyLimitOverride ?? standaloneCounts.monthlyLimit,
      },
      false,
      options?.definition
    );
  }, [
    ctx,
    fallbackRole,
    metric,
    options?.dailyLimitOverride,
    options?.definition,
    options?.monthlyLimitOverride,
    standaloneCounts,
  ]);

  const track = useCallback(
    async (amount = 1): Promise<CheckUsageResult> => {
      if (ctx) {
        return ctx.trackMetric(metric, amount, {
          app: options?.app,
          dailyLimitOverride: options?.dailyLimitOverride,
          monthlyLimitOverride: options?.monthlyLimitOverride,
        });
      }
      const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 1;
      const current = buildMetricState(metric, fallbackRole, standaloneCounts, false, options?.definition);
      const day = currentDay();
      const month = currentMonth();

      if (!current.allowed || (safeAmount > 0 && current.dailyUsed + safeAmount > current.dailyLimit)) {
        return {
          allowed: false,
          role: fallbackRole,
          metric,
          dailyCount: current.dailyUsed,
          dailyLimit: current.dailyLimit,
          monthlyCount: current.monthlyUsed,
          monthlyLimit: current.monthlyLimit,
          exceededType: current.exceededType || "daily",
          remaining: 0,
          day,
          month,
        };
      }

      const nextDaily = current.dailyUsed + safeAmount;
      const nextMonthly = current.monthlyUsed + safeAmount;
      setStandaloneCounts({
        dailyUsed: nextDaily,
        dailyLimit: current.dailyLimit,
        monthlyUsed: nextMonthly,
        monthlyLimit: current.monthlyLimit,
      });

      const client = new ApiClient({
        getAuthToken: () => auth?.session?.access_token ?? null,
      });
      try {
        const response = await client.usage.track({
          metric,
          app: options?.app,
          amount: safeAmount,
        });
        if (response?.usage) {
          setStandaloneCounts({
            dailyUsed: response.usage.dailyCount,
            dailyLimit: options?.dailyLimitOverride ?? response.usage.dailyLimit,
            monthlyUsed: response.usage.monthlyCount,
            monthlyLimit: options?.monthlyLimitOverride ?? response.usage.monthlyLimit,
            exceededType: response.usage.exceededType,
          });
          return response.usage;
        }
      } catch {
        // Ignore network errors in standalone offline demo mode
      }

      return {
        allowed: nextDaily <= current.dailyLimit && nextMonthly <= current.monthlyLimit,
        role: fallbackRole,
        metric,
        dailyCount: nextDaily,
        dailyLimit: current.dailyLimit,
        monthlyCount: nextMonthly,
        monthlyLimit: current.monthlyLimit,
        remaining: Math.max(0, current.dailyLimit - nextDaily),
        day,
        month,
      };
    },
    [
      auth?.session?.access_token,
      ctx,
      fallbackRole,
      metric,
      options?.app,
      options?.dailyLimitOverride,
      options?.definition,
      options?.monthlyLimitOverride,
      standaloneCounts,
    ]
  );

  const check = useCallback(async (): Promise<CheckUsageResult> => {
    if (ctx) {
      return ctx.trackMetric(metric, 0, {
        app: options?.app,
        checkOnly: true,
        dailyLimitOverride: options?.dailyLimitOverride,
        monthlyLimitOverride: options?.monthlyLimitOverride,
      });
    }
    return track(0);
  }, [
    ctx,
    metric,
    options?.app,
    options?.dailyLimitOverride,
    options?.monthlyLimitOverride,
    track,
  ]);

  const refresh = useCallback(async () => {
    if (ctx) {
      await ctx.refreshMetrics([metric]);
    } else {
      await check();
    }
  }, [check, ctx, metric]);

  const openUpgradeModal = useCallback(
    (tab: TopLevelTab = "usage") => {
      ctx?.openUpgradeModal(tab);
    },
    [ctx]
  );

  return {
    ...state,
    track,
    check,
    refresh,
    openUpgradeModal,
  };
}
