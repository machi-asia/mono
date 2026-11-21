export type WikiCategory =
  | "Architecture & Core"
  | "Architecture Decisions (ADR)"
  | "Packages & Libraries"
  | "Standards & Guidelines"
  | "Applications & Services"
  | "Biography";

export interface WikiArticle {
  slug: string;
  title: string;
  description: string;
  category: WikiCategory;
  updatedAt: string;
  author: string;
  readTime: string;
  tags: string[];
  image?: string;
  content: string;
}

export interface TocEntry {
  title: string;
  level: 2 | 3;
  id: string;
}
