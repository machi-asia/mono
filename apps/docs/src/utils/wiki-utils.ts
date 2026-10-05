import type { TocEntry } from "../data/wiki-types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTocFromMarkdown(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const title = line.replace(/^## /, "").trim();
      entries.push({
        title,
        level: 2,
        id: slugify(title),
      });
    } else if (line.startsWith("### ")) {
      const title = line.replace(/^### /, "").trim();
      entries.push({
        title,
        level: 3,
        id: slugify(title),
      });
    }
  }

  return entries;
}
