import type { Tool } from "./index";
import { saveMemory } from "@mono/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface RememberArgs {
  content: string;
  category?: string;
  importance?: "low" | "medium" | "high";
}

// In-memory fallback cache for development, test, or guest environments
const LOCAL_MEMORY_FALLBACK: Array<{
  id: number;
  user_id: string;
  content: string;
  category?: string;
  importance?: "low" | "medium" | "high";
  created_at: string;
}> = [];

// Scoped user ID tracker for server requests
let currentExecutionUserId = "00000000-0000-0000-0000-000000000001";
let currentExecutionClient: any = null;

export function setRememberToolContext(userId: string, client?: any) {
  currentExecutionUserId = userId || "00000000-0000-0000-0000-000000000001";
  currentExecutionClient = client || null;
}

export function clearRememberToolContext() {
  currentExecutionUserId = "00000000-0000-0000-0000-000000000001";
  currentExecutionClient = null;
}

export const rememberTool: Tool = {
  declaration: {
    name: "remember",
    description:
      "Record and store important long-term relevant information, user preferences, project context, facts, goals, or milestones into persistent memory. Use this tool whenever the user tells you personal preferences, instructions to recall later, or key project facts.",
    parameters: {
      type: "OBJECT",
      properties: {
        content: {
          type: "STRING",
          description: "The essential information, user preference, instruction, or key fact to remember.",
        },
        category: {
          type: "STRING",
          description: "Category of the memory, e.g., 'preference', 'project', 'fact', 'personal', 'goal', or 'instruction'.",
        },
        importance: {
          type: "STRING",
          description: "Importance level: 'low', 'medium', or 'high'. Default is 'medium'.",
        },
      },
      required: ["content"],
    },
  },
  execute: async (args: Record<string, unknown>) => {
    try {
      const content = String(args.content || "").trim();
      if (!content) {
        return JSON.stringify({ error: "Parameter 'content' is required." });
      }

      const category = args.category ? String(args.category).trim().toLowerCase() : "general";
      const rawImportance = String(args.importance || "medium").toLowerCase();
      const importance: "low" | "medium" | "high" =
        rawImportance === "high" || rawImportance === "low" ? rawImportance : "medium";

      const userId = currentExecutionUserId;

      try {
        let supabase = currentExecutionClient;
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const secretKey = process.env.SUPABASE_SECRET_KEY;

        // When running on the server, if SUPABASE_SECRET_KEY is available, use it for direct server storage
        // to ensure reliable writes regardless of RLS evaluation in background agent tool execution
        if (secretKey && supabaseUrl) {
          supabase = createSupabaseClient(supabaseUrl, secretKey);
        } else if (!supabase) {
          const supabaseKey =
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_PUBLISHABLE_KEY;

          if (supabaseUrl && supabaseKey) {
            supabase = createSupabaseClient(supabaseUrl, supabaseKey);
          }
        }

        if (supabase) {
          const saved = await saveMemory(supabase, {
            userId,
            content,
            category,
            importance,
          });

          return JSON.stringify({
            success: true,
            message: "Memory successfully saved to long-term storage.",
            memory: {
              id: saved.id,
              content: saved.content,
              category: saved.category,
              importance: saved.importance,
              created_at: saved.created_at,
            },
          });
        }
      } catch (dbErr: any) {
        console.warn("[RememberTool] Supabase write failed, using fallback:", dbErr?.message || dbErr);
      }

      // Fallback cache when Supabase database is unreachable or offline
      const fallbackRecord = {
        id: LOCAL_MEMORY_FALLBACK.length + 1,
        user_id: userId,
        content,
        category,
        importance,
        created_at: new Date().toISOString(),
      };
      LOCAL_MEMORY_FALLBACK.push(fallbackRecord);

      return JSON.stringify({
        success: true,
        message: "Memory stored in local session memory cache.",
        memory: fallbackRecord,
      });
    } catch (err: any) {
      return JSON.stringify({
        error: err?.message || "Failed to execute remember tool.",
      });
    }
  },
};
