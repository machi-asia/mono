"use client";

import { FileText, Network, X } from "lucide-react";
import type { QuickNoteItem } from "@/data/seed-notes";

interface NoteTabBarProps {
  notes: QuickNoteItem[];
  openTabIds: number[];
  activeNoteId: number | null;
  viewMode: "editor" | "split" | "preview" | "graph";
  onSelectTab: (noteId: number) => void;
  onCloseTab: (noteId: number) => void;
  onToggleGraph: () => void;
}

export function NoteTabBar({
  notes,
  openTabIds,
  activeNoteId,
  viewMode,
  onSelectTab,
  onCloseTab,
  onToggleGraph,
}: NoteTabBarProps) {
  const noteMap = new Map(notes.map((n) => [n.id, n]));

  return (
    <div className="qn-tabs-bar">
      <div className="qn-tabs-list" role="tablist" aria-label="Open notes">
        {openTabIds.map((id) => {
          const note = noteMap.get(id);
          if (!note) return null;
          const isActive = activeNoteId === id && viewMode !== "graph";
          return (
            <div
              key={id}
              role="tab"
              aria-selected={isActive}
              className={`qn-tab ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab(id)}
            >
              <FileText size={13} />
              <span>{note.title}</span>
              <button
                type="button"
                aria-label={`Close ${note.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(id);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`qn-tab ${viewMode === "graph" ? "active" : ""}`}
        onClick={onToggleGraph}
      >
        <Network size={14} />
        <span>Knowledge Graph</span>
      </button>
    </div>
  );
}
