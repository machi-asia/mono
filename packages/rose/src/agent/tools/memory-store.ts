import {
  createMemory,
  getMemoryByIndex,
  updateMemoryByIndex,
  deleteMemoryByIndex,
  type MemoryImportance,
} from "@mono/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface MemoryEntry {
  category: string;
  content: string;
  importance: MemoryImportance;
  created_at: string;
  updated_at?: string | null;
}

export interface MemoryUpdatePayload {
  content?: string;
  importance?: MemoryImportance;
  newCategory?: string;
}

const LOCAL_STORE = new Map<string, MemoryEntry>();

let currentExecutionUserId = "00000000-0000-0000-0000-000000000001";
let currentExecutionClient: any = null;

export function setMemoryToolContext(userId: string, client?: any) {
  currentExecutionUserId = userId || "00000000-0000-0000-0000-000000000001";
  currentExecutionClient = client || null;
}

export function clearMemoryToolContext() {
  currentExecutionUserId = "00000000-0000-0000-0000-000000000001";
  currentExecutionClient = null;
}

export function parseImportance(value: unknown): MemoryImportance {
  const raw = String(value || "medium").trim().toLowerCase();
  return raw === "high" || raw === "low" ? raw : "medium";
}

function normalizeIndex(index: string): string {
  return index.trim().toLowerCase();
}

function localKey(userId: string, index: string): string {
  return `${userId}:${index}`;
}

function resolveSupabaseClient() {
  let supabase = currentExecutionClient;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

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

  return supabase;
}

function toEntry(record: {
  category: string;
  content: string;
  importance: MemoryImportance;
  created_at: string;
  updated_at?: string | null;
}): MemoryEntry {
  return {
    category: record.category,
    content: record.content,
    importance: record.importance,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

export async function memoryDbCreate(
  indexInput: string,
  description: string,
  importance: MemoryImportance
): Promise<MemoryEntry> {
  const userId = currentExecutionUserId;
  const category = normalizeIndex(indexInput);
  const client = resolveSupabaseClient();

  if (client) {
    const record = await createMemory(client, {
      userId,
      category,
      content: description,
      importance,
    });
    return toEntry(record);
  }

  const key = localKey(userId, category);
  if (LOCAL_STORE.has(key)) {
    throw new Error(`Memory index '${category}' already exists.`);
  }
  const entry: MemoryEntry = {
    category,
    content: description,
    importance,
    created_at: new Date().toISOString(),
  };
  LOCAL_STORE.set(key, entry);
  return entry;
}

export async function memoryDbRead(
  indexInput: string
): Promise<MemoryEntry | null> {
  const userId = currentExecutionUserId;
  const category = normalizeIndex(indexInput);
  const client = resolveSupabaseClient();

  if (client) {
    const record = await getMemoryByIndex(client, userId, category);
    return record ? toEntry(record) : null;
  }

  return LOCAL_STORE.get(localKey(userId, category)) || null;
}

export async function memoryDbUpdate(
  indexInput: string,
  payload: MemoryUpdatePayload
): Promise<MemoryEntry> {
  const userId = currentExecutionUserId;
  const category = normalizeIndex(indexInput);
  const client = resolveSupabaseClient();

  if (client) {
    const record = await updateMemoryByIndex(client, {
      userId,
      category,
      content: payload.content,
      importance: payload.importance,
      newCategory: payload.newCategory,
    });
    return toEntry(record);
  }

  const key = localKey(userId, category);
  const existing = LOCAL_STORE.get(key);
  if (!existing) {
    throw new Error(`Memory index '${category}' was not found.`);
  }

  const next: MemoryEntry = {
    ...existing,
    content: payload.content ?? existing.content,
    importance: payload.importance ?? existing.importance,
    updated_at: new Date().toISOString(),
  };

  if (payload.newCategory) {
    const newCategory = normalizeIndex(payload.newCategory);
    const newKey = localKey(userId, newCategory);
    if (LOCAL_STORE.has(newKey)) {
      throw new Error(`Memory index '${newCategory}' already exists.`);
    }
    LOCAL_STORE.delete(key);
    next.category = newCategory;
    LOCAL_STORE.set(newKey, next);
  } else {
    LOCAL_STORE.set(key, next);
  }

  return next;
}

export async function memoryDbDelete(indexInput: string): Promise<boolean> {
  const userId = currentExecutionUserId;
  const category = normalizeIndex(indexInput);
  const client = resolveSupabaseClient();

  if (client) {
    return deleteMemoryByIndex(client, userId, category);
  }

  return LOCAL_STORE.delete(localKey(userId, category));
}

export function memoryDbRecreateForTests(
  userId: string,
  indexInput: string,
  entry: MemoryEntry
) {
  LOCAL_STORE.set(localKey(userId, normalizeIndex(indexInput)), entry);
}

export function memoryDbResetForTests() {
  LOCAL_STORE.clear();
}