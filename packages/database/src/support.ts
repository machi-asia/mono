import type { SupabaseClient } from "@supabase/supabase-js";
import { assertServerOnlyExecution, createClient, createServiceClient } from "./client";
import type { Database, Json } from "./types";

export type SupportTicketType = "bug_report" | "recommendation" | "general_support";
export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicketRecord {
  id: string;
  user_id: string | null;
  user_email: string | null;
  type: SupportTicketType;
  app: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface CreateSupportTicketInput {
  type: SupportTicketType;
  app: string;
  subject: string;
  message: string;
  userEmail?: string;
  metadata?: Record<string, Json | undefined>;
}

/**
 * Creates and submits a new support ticket, bug report, or recommendation to Supabase.
 */
export async function createSupportTicket(
  input: CreateSupportTicketInput,
): Promise<{ data: SupportTicketRecord | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      user_id: user?.id ?? null,
      user_email: input.userEmail ?? user?.email ?? null,
      type: input.type,
      app: input.app,
      subject: input.subject.trim(),
      message: input.message.trim(),
      metadata: {
        ...input.metadata,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        submittedUrl: typeof window !== "undefined" ? window.location.href : undefined,
      },
    };

    const { data, error } = await supabase
      .from("support_tickets")
      .insert(payload as never)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SupportTicketRecord, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Failed to submit support ticket"),
    };
  }
}

/**
 * Lists the authenticated user's submitted support tickets.
 */
export async function listUserSupportTickets(): Promise<{
  data: SupportTicketRecord[];
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    return { data: (data ?? []) as SupportTicketRecord[], error: null };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err : new Error("Failed to fetch support tickets"),
    };
  }
}

const VALID_TICKET_STATUSES: SupportTicketStatus[] = [
  "open",
  "in_progress",
  "resolved",
  "closed",
];

const FALLBACK_SUPPORT_TICKETS = new Map<string, SupportTicketRecord>();

export function resetFallbackSupportTickets(): void {
  FALLBACK_SUPPORT_TICKETS.clear();
}

export function seedFallbackSupportTicket(ticket: SupportTicketRecord): void {
  FALLBACK_SUPPORT_TICKETS.set(ticket.id, ticket);
}

/**
 * Lists all support tickets across all users for the Admin Portal.
 * Strictly server-only.
 */
export async function listAllSupportTickets(
  options: {
    app?: string;
    status?: SupportTicketStatus | "all";
    limit?: number;
  } = {},
  clientOverride?: SupabaseClient<Database>
): Promise<{ data: SupportTicketRecord[]; error: Error | null }> {
  assertServerOnlyExecution("listAllSupportTickets");

  const limit = Math.max(1, Math.min(options.limit ?? 500, 1000));
  const merged = new Map<string, SupportTicketRecord>();

  const isOfflineTest =
    !clientOverride &&
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL;

  if (!isOfflineTest) {
    try {
      const supabase = clientOverride || createServiceClient();
      let query = supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (options.app && options.app !== "all") {
        query = query.eq("app", options.app);
      }
      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      const { data, error } = await query;
      if (error) {
        return { data: [], error: new Error(error.message) };
      }
      if (Array.isArray(data)) {
        for (const row of data as SupportTicketRecord[]) {
          merged.set(row.id, row);
        }
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err : new Error("Failed to list support tickets"),
      };
    }
  }

  for (const ticket of FALLBACK_SUPPORT_TICKETS.values()) {
    if (options.app && options.app !== "all" && ticket.app !== options.app) continue;
    if (options.status && options.status !== "all" && ticket.status !== options.status) continue;
    if (!merged.has(ticket.id)) {
      merged.set(ticket.id, ticket);
    }
  }

  return {
    data: Array.from(merged.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit),
    error: null,
  };
}

/**
 * Updates a support ticket status (`open` | `in_progress` | `resolved` | `closed`).
 * Strictly server-only.
 */
export async function updateSupportTicketStatus(
  ticketId: string,
  status: SupportTicketStatus,
  clientOverride?: SupabaseClient<Database>
): Promise<{ data: SupportTicketRecord | null; error: Error | null }> {
  assertServerOnlyExecution("updateSupportTicketStatus");

  if (!VALID_TICKET_STATUSES.includes(status)) {
    return { data: null, error: new Error(`Invalid support ticket status: ${status}`) };
  }

  const now = new Date().toISOString();
  const fb = FALLBACK_SUPPORT_TICKETS.get(ticketId);
  if (fb) {
    const updated: SupportTicketRecord = { ...fb, status, updated_at: now };
    FALLBACK_SUPPORT_TICKETS.set(ticketId, updated);
  }

  const isOfflineTest =
    !clientOverride &&
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST)) &&
    !process.env?.SUPABASE_URL &&
    !process.env?.NEXT_PUBLIC_SUPABASE_URL;

  if (isOfflineTest) {
    const updated = FALLBACK_SUPPORT_TICKETS.get(ticketId) ?? null;
    if (!updated) {
      return { data: null, error: new Error("Support ticket not found") };
    }
    return { data: updated, error: null };
  }

  try {
    const supabase = clientOverride || createServiceClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .update({ status, updated_at: now } as never)
      .eq("id", ticketId)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SupportTicketRecord, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Failed to update support ticket"),
    };
  }
}
