"use client";

import { useMemo } from "react";
import { ApiClient, type ApiClientConfig, type ApiQuotaStatus } from "@mono/api-client";
import { useToast } from "@mono/components";
import { useContext } from "react";
import { AuthContext } from "./provider/provider";
import { UsageContext } from "./usage/usage-provider";

export interface UseApiClientOptions extends Partial<ApiClientConfig> {
  /** Automatically display a warning/error toast when a 429 quota lock occurs (defaults to true) */
  toastOnQuotaLock?: boolean;
}

/**
 * Returns a memoized `ApiClient` instance automatically wired to:
 * 1. The active Supabase session access token (`Authorization: Bearer <token>`)
 * 2. `<ToastProvider>` notifications when a 429 quota lock is encountered
 * 3. `<UsageProvider>` state refresh so all `<UsageTracker>` and `<UsageGate>` components react immediately
 */
export function useApiClient(options?: UseApiClientOptions): ApiClient {
  const auth = useContext(AuthContext);
  const usage = useContext(UsageContext);
  const { toast } = useToast();

  const accessToken = auth?.session?.access_token ?? null;
  const toastOnQuotaLock = options?.toastOnQuotaLock ?? true;

  return useMemo(() => {
    return new ApiClient({
      ...options,
      getAuthToken: options?.getAuthToken ?? (() => accessToken),
      onQuotaLocked: (status: ApiQuotaStatus) => {
        if (toastOnQuotaLock) {
          toast("error", status.message || "API usage quota limit reached.");
        }
        void usage?.refreshMetrics();
        options?.onQuotaLocked?.(status);
      },
    });
  }, [accessToken, options, toast, toastOnQuotaLock, usage]);
}
