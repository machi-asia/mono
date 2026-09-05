import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, RoseMemoryRecord, RosePersonalizationRecord } from "./types";

export interface SaveMemoryOptions {
  userId: string;
  content: string;
  category?: string;
  importance?: "low" | "medium" | "high";
}

export interface ListMemoriesOptions {
  userId: string;
  category?: string;
  limit?: number;
}

export async function saveMemory(
  supabase: SupabaseClient<Database>,
  options: SaveMemoryOptions
): Promise<RoseMemoryRecord> {
  const { userId, content, category, importance = "medium" } = options;

  if (!userId) {
    throw new Error("userId is required to save memory");
  }
  if (!content || !content.trim()) {
    throw new Error("content is required to save memory");
  }

  const { data, error } = await supabase
    .from("rose_memories")
    .insert({
      user_id: userId,
      content: content.trim(),
      category: category ? category.trim().toLowerCase() : null,
      importance: importance || "medium",
    } as never)
    .select("*")
    .single();

  if (error) {
    console.error("[Database] saveMemory error:", error.message);
    throw new Error(`Failed to save memory: ${error.message}`);
  }

  return data as RoseMemoryRecord;
}

export async function listMemories(
  supabase: SupabaseClient<Database>,
  options: ListMemoriesOptions
): Promise<RoseMemoryRecord[]> {
  const { userId, category, limit = 20 } = options;

  if (!userId) {
    return [];
  }

  let query = supabase
    .from("rose_memories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category && category.trim()) {
    query = query.eq("category", category.trim().toLowerCase());
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Database] listMemories error:", error.message);
    return [];
  }

  return (data as RoseMemoryRecord[]) || [];
}

export async function updateMemory(
  supabase: SupabaseClient<Database>,
  options: {
    id: number;
    userId: string;
    content: string;
    category?: string | null;
    importance?: "low" | "medium" | "high" | null;
  }
): Promise<RoseMemoryRecord> {
  const { id, userId, content, category, importance } = options;

  if (!id || !userId) {
    throw new Error("id and userId are required to update memory");
  }
  if (!content || !content.trim()) {
    throw new Error("content is required to update memory");
  }

  const { data, error } = await (supabase
    .from("rose_memories") as any)
    .update({
      content: content.trim(),
      category: category ? category.trim().toLowerCase() : null,
      importance: importance || "medium",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("[Database] updateMemory error:", error.message);
    throw new Error(`Failed to update memory: ${error.message}`);
  }

  return data as RoseMemoryRecord;
}

export async function deleteMemory(
  supabase: SupabaseClient<Database>,
  options: {
    id: number;
    userId: string;
  }
): Promise<boolean> {
  const { id, userId } = options;

  if (!id || !userId) {
    throw new Error("id and userId are required to delete memory");
  }

  const { error } = await (supabase
    .from("rose_memories") as any)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("[Database] deleteMemory error:", error.message);
    throw new Error(`Failed to delete memory: ${error.message}`);
  }

  return true;
}

export interface SavePersonalizationOptions {
  userId: string;
  customInstructions?: string;
  nickname?: string | null;
  tone?: string | null;
}

export async function getPersonalization(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<RosePersonalizationRecord | null> {
  if (!userId) return null;

  const { data, error } = await (supabase
    .from("rose_personalization") as any)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Database] getPersonalization error:", error.message);
    return null;
  }

  return (data as RosePersonalizationRecord) || null;
}

export async function savePersonalization(
  supabase: SupabaseClient<Database>,
  options: SavePersonalizationOptions
): Promise<RosePersonalizationRecord> {
  const { userId, customInstructions = "", nickname, tone } = options;

  if (!userId) {
    throw new Error("userId is required to save personalization");
  }

  const payload: any = {
    user_id: userId,
    custom_instructions: customInstructions || "",
    nickname: nickname !== undefined ? (nickname ? nickname.trim() : null) : null,
    tone: tone !== undefined ? (tone ? tone.trim() : null) : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await (supabase
    .from("rose_personalization") as any)
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    console.error("[Database] savePersonalization error:", error.message);
    throw new Error(`Failed to save personalization: ${error.message}`);
  }

  return data as RosePersonalizationRecord;
}

