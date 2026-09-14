import type { RoseMemoryRecord } from "@mono/database";

export const MEMORY_CONTEXT_MARKER = "[Context: Long-Term Memory Indexes]";
export const PERSONALIZATION_CONTEXT_MARKER = "[Context: User Personalization & Preferences]";

export function toExcerpt(text: string, max = 120): string {
  const oneLine = (text || "").replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max - 1)}…` : oneLine;
}

export function buildMemoryIndexContext(records: RoseMemoryRecord[]): string | null {
  if (!records || records.length === 0) return null;

  const bullets = records
    .map((m) => `- ${m.category || "general"}: ${toExcerpt(m.content)}`)
    .join("\n");

  return `${MEMORY_CONTEXT_MARKER}
Your long-term memory is stored as unique indexes, each holding one full description.
Available memory indexes (with short excerpts):
${bullets}

To read the exact details of any index, call the 'recall' tool with the matching index name. Never rely on the excerpt alone and never guess what an index contains.`;
}

export function hasMemoryContext(history: Array<{ role: string; parts: Array<{ text?: string }> }>): boolean {
  return history.some((h) =>
    h.parts.some((p) =>
      p.text?.includes(MEMORY_CONTEXT_MARKER) ||
      p.text?.includes("[Context: Long-Term User Memories & Knowledge]") ||
      p.text?.includes("[Context: Long-Term User Memories & Preferences]")
    )
  );
}