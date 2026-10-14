import { defaultApiClient } from "@mono/api-client";
import type {
  ItemListReportCorrections as ReportCorrections,
  ItemListReportSubmission as IssueReportSubmission,
  ItemListCommunityOverride as CommunityOverride,
} from "@mono/api-client";

export type { ReportCorrections, IssueReportSubmission, CommunityOverride };

/**
 * Generate a persistent anonymous reporter identifier on the client.
 * This prevents a single user from spamming multiple reports to manipulate consensus.
 */
export function getReporterHash(): string {
  if (typeof window === "undefined") return "server-anon";
  try {
    let id = localStorage.getItem("itemlist_reporter_id");
    if (!id) {
      id = "rep_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("itemlist_reporter_id", id);
    }
    return id;
  } catch {
    return "ephemeral_rep_" + Date.now().toString(36);
  }
}

/**
 * Submit an issue report via api.machi.asia
 */
export async function submitIssueReport(payload: IssueReportSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const reporterHash = getReporterHash();
    const res = await defaultApiClient.itemlist.submitReport({
      ...payload,
      reporterHash,
    });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to submit issue report via API:", err);
    return { success: false, error: msg };
  }
}

/**
 * Fetch verified community overrides via api.machi.asia
 */
export async function fetchCommunityOverrides(gameId: string): Promise<CommunityOverride[]> {
  try {
    return await defaultApiClient.itemlist.getOverrides(gameId);
  } catch (err) {
    console.warn("Failed to load community consensus overrides from API:", err);
    return [];
  }
}

