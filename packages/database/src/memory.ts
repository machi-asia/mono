import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, RoseMemoryRecord, RosePersonalizationRecord } from "./types";

export type MemoryImportance = "low" | "medium" | "high";

export interface CreateMemoryOptions {
  userId: string;
  category: string;
  content: string;
  importance?: MemoryImportance;
}

export interface ListMemoryIndexesOptions {
  userId: string;
}

const IMPORTANCE_VALUES: MemoryImportance[] = ["low", "medium", "high"];

export function normalizeCategory(category: string | null | undefined): string {
  return (category || "general").trim().toLowerCase();
}

export function normalizeImportance(
  importance: string | null | undefined
): MemoryImportance {
  const value = (importance || "medium").trim().toLowerCase();
  return IMPORTANCE_VALUES.includes(value as MemoryImportance)
    ? (value as MemoryImportance)
    : "medium";
}

export async function createMemory(
  supabase: SupabaseClient<Database>,
  options: CreateMemoryOptions
): Promise<RoseMemoryRecord> {
  const { userId } = options;
  const category = normalizeCategory(options.category);
  const content = (options.content || "").trim();
  const importance = normalizeImportance(options.importance);

  if (!userId) {
    throw new Error("userId is required to create a memory index");
  }
  if (!content) {
    throw new Error("content is required to create a memory index");
  }

  const { data, error } = await supabase
    .from("rose_memories")
    .insert({ user_id: userId, content, category, importance } as never)
    .select("*")
    .single();

  if (error) {
    if (/duplicate key/i.test(error.message)) {
      throw new Error(
        `Memory index '${category}' already exists. Use an edit operation instead.`
      );
    }
    console.error("[Database] createMemory error:", error.message);
    throw new Error(`Failed to create memory index: ${error.message}`);
  }

  return data as RoseMemoryRecord;
}

export async function getMemoryByIndex(
  supabase: SupabaseClient<Database>,
  userId: string,
  categoryInput: string
): Promise<RoseMemoryRecord | null> {
  const category = normalizeCategory(categoryInput);
  if (!userId || !category) return null;

  const { data, error } = await supabase
    .from("rose_memories")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .maybeSingle();

  if (error) {
    console.error("[Database] getMemoryByIndex error:", error.message);
    return null;
  }

  return (data as unknown as RoseMemoryRecord) || null;
}

export interface UpdateMemoryByIndexOptions {
  userId: string;
  category: string;
  content?: string;
  importance?: MemoryImportance;
  newCategory?: string;
}

export async function updateMemoryByIndex(
  supabase: SupabaseClient<Database>,
  options: UpdateMemoryByIndexOptions
): Promise<RoseMemoryRecord> {
  const { userId, content, importance } = options;
  const category = normalizeCategory(options.category);
  const newCategory = options.newCategory
    ? normalizeCategory(options.newCategory)
    : category;

  if (!userId || !category) {
    throw new Error("userId and category are required to edit a memory index");
  }
  if (content !== undefined && !content.trim()) {
    throw new Error("content cannot be empty when editing a memory index");
  }

  const payload: any = {
    category: newCategory,
    updated_at: new Date().toISOString(),
  };
  if (content !== undefined) payload.content = content.trim();
  if (importance !== undefined) payload.importance = normalizeImportance(importance);

  const { data, error } = await (supabase
    .from("rose_memories") as any)
    .update(payload)
    .eq("user_id", userId)
    .eq("category", category)
    .select("*")
    .maybeSingle();

  if (error) {
    if (/duplicate key/i.test(error.message)) {
      throw new Error(
        `Memory index '${newCategory}' already exists. Choose a different index.`
      );
    }
    console.error("[Database] updateMemoryByIndex error:", error.message);
    throw new Error(`Failed to update memory index: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Memory index '${category}' was not found. Create it first.`
    );
  }

  return data as RoseMemoryRecord;
}

export async function deleteMemoryByIndex(
  supabase: SupabaseClient<Database>,
  userId: string,
  categoryInput: string
): Promise<boolean> {
  const category = normalizeCategory(categoryInput);
  if (!userId || !category) return false;

  const { error } = await (supabase
    .from("rose_memories") as any)
    .delete()
    .eq("user_id", userId)
    .eq("category", category);

  if (error) {
    console.error("[Database] deleteMemoryByIndex error:", error.message);
    throw new Error(`Failed to delete memory index: ${error.message}`);
  }

  return true;
}

export async function listMemoryIndexes(
  supabase: SupabaseClient<Database>,
  options: ListMemoryIndexesOptions
): Promise<RoseMemoryRecord[]> {
  const { userId } = options;
  if (!userId) return [];

  const { data, error } = await supabase
    .from("rose_memories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Database] listMemoryIndexes error:", error.message);
    return [];
  }

  return (data as RoseMemoryRecord[]) || [];
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