import { createClient } from "./client";
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
