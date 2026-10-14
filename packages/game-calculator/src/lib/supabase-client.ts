import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@mono/app-config";

export interface ReportCorrections {
  recipeMethod?: string;
  machineRequired?: string;
  outputAmount?: number;
  ingredients?: Array<{ name: string; amount: number }>;
  processingTimeSeconds?: number;
  speedRpm?: number;
  intendedItemsPerMin?: number;
  iconUrl?: string;
}

export interface IssueReportSubmission {
  gameId: string;
  itemId: string;
  itemName: string;
  issueType: string;
  description?: string;
  suggestedFix?: string;
  corrections?: ReportCorrections;
}

export interface CommunityOverride {
  game_id: string;
  item_id: string;
  item_name: string;
  issue_type: string;
  corrections: ReportCorrections;
  reporter_count: number;
}

// Client-side singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
  return supabaseClient;
}

/**
 * Generate a persistent anonymous reporter identifier on the client.
 * This prevents a single user from spamming multiple reports to manipulate consensus.
 */
function getReporterHash(): string {
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
 * Deterministically compute a consensus key from item ID and structured corrections.
 * Identical corrections produce the same canonical key regardless of key order.
 */
export function generateConsensusKey(itemId: string, corrections: ReportCorrections = {}): string {
  const norm: Record<string, unknown> = {};

  if (corrections.recipeMethod) norm.method = corrections.recipeMethod.trim().toLowerCase();
  if (corrections.machineRequired) norm.machine = corrections.machineRequired.trim().toLowerCase();
  if (corrections.outputAmount !== undefined) norm.out = Number(corrections.outputAmount);
  if (corrections.processingTimeSeconds !== undefined) norm.time = Number(corrections.processingTimeSeconds);
  if (corrections.speedRpm !== undefined) norm.rpm = Number(corrections.speedRpm);
  if (corrections.iconUrl) norm.icon = corrections.iconUrl.trim();

  if (corrections.ingredients && corrections.ingredients.length > 0) {
    norm.ings = corrections.ingredients
      .map((i) => `${i.name.trim().toLowerCase()}:${Number(i.amount)}`)
      .sort();
  }

  return `${itemId}::${JSON.stringify(norm)}`;
}

/**
 * Submit an issue report to Supabase
 */
export async function submitIssueReport(payload: IssueReportSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const reporterHash = getReporterHash();
    const consensusKey = generateConsensusKey(payload.itemId, payload.corrections);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("issue_reports") as any).insert([
      {
        game_id: payload.gameId,
        item_id: payload.itemId,
        item_name: payload.itemName,
        issue_type: payload.issueType,
        description: payload.description || null,
        suggested_fix: payload.suggestedFix || null,
        reporter_hash: reporterHash,
        corrections: payload.corrections || {},
        consensus_key: consensusKey,
      },
    ]);

    if (error) {
      console.error("Supabase issue report insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to submit issue report:", err);
    return { success: false, error: msg };
  }
}

/**
 * Fetch verified community overrides (>= 3 distinct reports with matching expected values)
 */
export async function fetchCommunityOverrides(gameId: string): Promise<CommunityOverride[]> {
  try {
    const supabase = getSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)("get_community_overrides", {
      p_game_id: gameId,
    });

    if (error) {
      console.warn("Failed to load community consensus overrides from Supabase:", error.message);
      return [];
    }

    return (data as CommunityOverride[]) || [];
  } catch (err) {
    console.warn("Error calling get_community_overrides RPC:", err);
    return [];
  }
}
