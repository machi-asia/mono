export interface QuickNoteItem {
  id: number;
  user_id?: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface QuickNoteRelationItem {
  note_id: number;
  related_note_id: number;
  created_at: string;
}

export const SEED_NOTES: QuickNoteItem[] = [
  {
    id: 1,
    title: "Architecture Hub",
    folder: "Engineering",
    tags: ["architecture", "monorepo", "index"],
    order_index: 0,
    content: `# Machi Monorepo Architecture

Central knowledge hub linking core domain services across **machi.asia**.

## Active Services
- [[MMM Modpack Protocol]] — Modrinth v2 hash matching and SMP team sync
- [[Knowledge Graph Heuristics]] — Force-directed layout & bidirectional backlinks
- [[Peer Ledger Design]] — Zero-friction IOU reconciliation in U Owe Me

## Tasks
- [x] Unify Supabase RLS with \`(select auth.uid())\`
- [x] Wire shared \`@mono/auth\` and \`@mono/components\`
- [ ] Schedule weekly semantic search indexing`,
    created_at: "2026-11-10T09:00:00Z",
    updated_at: "2026-11-21T08:30:00Z",
  },
  {
    id: 2,
    title: "Knowledge Graph Heuristics",
    folder: "Research",
    tags: ["graph", "pkm", "algorithms"],
    order_index: 1,
    content: `# Knowledge Graph Heuristics

Notes become nodes; explicit relations and \`[[Wikilinks]]\` form bidirectional edges inside the SVG/Canvas physics engine.

## Layout Properties
- Radial clustering by folder namespace (\`Engineering\`, \`Research\`, \`Product\`)
- Repulsion force inversely proportional to squared node distance
- Connected node degree highlights hub notes inside [[Architecture Hub]]

\`\`\`ts
const springForce = (distance - targetLength) * stiffness;
\`\`\``,
    created_at: "2026-11-12T10:15:00Z",
    updated_at: "2026-11-20T14:20:00Z",
  },
  {
    id: 3,
    title: "MMM Modpack Protocol",
    folder: "Product",
    tags: ["minecraft", "modrinth", "mmm"],
    order_index: 2,
    content: `# MMM Modpack Protocol

Standardized workflow for keeping server and client mods deterministic:
1. Pin target Minecraft version and modloader (e.g. \`1.21.1 · fabric\`).
2. Match existing \`.jar\` builds via filename & Modrinth API.
3. Audit required runtime libraries like **Fabric API** before release.

Connected to [[Architecture Hub]] and [[Release Checklist]].`,
    created_at: "2026-11-14T11:45:00Z",
    updated_at: "2026-11-19T16:10:00Z",
  },
  {
    id: 4,
    title: "Peer Ledger Design",
    folder: "Product",
    tags: ["fintech", "uoweme", "ux"],
    order_index: 3,
    content: `# Peer Ledger Design

**U Owe Me** aggregates itemized receipts by contact so friends see a single net balance instead of dozens of tiny transfers.

- Supports multi-entry batch checkout
- Generates shareable settlement statements at \`/share/uoweme\`
- Shares identity session with [[Architecture Hub]] and [[Release Checklist]]`,
    created_at: "2026-11-15T13:30:00Z",
    updated_at: "2026-11-21T07:50:00Z",
  },
  {
    id: 5,
    title: "Release Checklist",
    folder: "Engineering",
    tags: ["devops", "seo", "testing"],
    order_index: 4,
    content: `# Pre-Deploy Quality Checklist

- [x] Verify Vitest unit & page smoke coverage
- [x] Validate \`stylelint\` modern CSS Color 4 rules
- [x] Confirm \`robots.ts\`, \`sitemap.ts\`, and \`og.png\` metadata
- [ ] Publish annotated Voila walkthrough to Portfolio`,
    created_at: "2026-11-18T15:00:00Z",
    updated_at: "2026-11-21T09:00:00Z",
  },
];

export const SEED_NOTE_RELATIONS: QuickNoteRelationItem[] = [
  { note_id: 1, related_note_id: 2, created_at: "2026-11-12T10:20:00Z" },
  { note_id: 1, related_note_id: 3, created_at: "2026-11-14T11:50:00Z" },
  { note_id: 1, related_note_id: 4, created_at: "2026-11-15T13:35:00Z" },
  { note_id: 3, related_note_id: 5, created_at: "2026-11-18T15:05:00Z" },
  { note_id: 4, related_note_id: 5, created_at: "2026-11-18T15:10:00Z" },
];
