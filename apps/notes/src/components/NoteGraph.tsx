"use client";

import { useMemo } from "react";
import type { QuickNoteItem, QuickNoteRelationItem } from "@/data/seed-notes";
import { InteractiveGraph } from "./InteractiveGraph";

interface NoteGraphProps {
  notes: QuickNoteItem[];
  relations: QuickNoteRelationItem[];
  activeNoteId?: number | null;
  onSelectNote: (noteId: number) => void;
}

export function extractWikilinkTitles(content: string): string[] {
  const matches = content.match(/\[\[([^\]]+)\]\]/g) ?? [];
  return matches.map((m) => m.slice(2, -2).trim()).filter(Boolean);
}

export function NoteGraph({
  notes,
  relations,
  activeNoteId,
  onSelectNote,
}: NoteGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const graphNodes = notes.map((n) => ({
      id: n.id,
      label: n.title,
      folder: n.folder || "General",
      tags: n.tags ?? [],
    }));

    const titleToId = new Map(notes.map((n) => [n.title.toLowerCase(), n.id]));
    const edgeSet = new Set<string>();
    const combinedEdges: Array<{ source: number; target: number }> = [];

    const pushEdge = (a: number, b: number) => {
      if (a === b) return;
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      const key = `${min}-${max}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        combinedEdges.push({ source: min, target: max });
      }
    };

    for (const rel of relations) {
      pushEdge(rel.note_id, rel.related_note_id);
    }

    for (const note of notes) {
      for (const targetTitle of extractWikilinkTitles(note.content)) {
        const targetId = titleToId.get(targetTitle.toLowerCase());
        if (targetId !== undefined) {
          pushEdge(note.id, targetId);
        }
      }
    }

    return { nodes: graphNodes, edges: combinedEdges };
  }, [notes, relations]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} data-testid="note-graph-view">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--qn-border)",
          fontSize: "0.82rem",
          color: "var(--qn-muted)",
        }}
      >
        <span>
          <strong>{nodes.length}</strong> notes · <strong>{edges.length}</strong> bidirectional connections
        </span>
        <span>Click any node to jump directly to its editor tab</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <InteractiveGraph
          nodes={nodes}
          edges={edges}
          activeNodeId={activeNoteId}
          onSelectNode={onSelectNote}
        />
      </div>
    </div>
  );
}
