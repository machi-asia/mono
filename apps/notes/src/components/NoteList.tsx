"use client";

import { useMemo, useState } from "react";
import { Folder, FolderOpen, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@mono/components";
import type { QuickNoteItem } from "@/data/seed-notes";

interface NoteListProps {
  notes: QuickNoteItem[];
  activeNoteId: number | null;
  onSelectNote: (noteId: number) => void;
  onCreateBlankNote: () => void;
  onOpenAiGenerate: () => void;
  onDeleteNote: (noteId: number) => void;
}

export function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateBlankNote,
  onOpenAiGenerate,
  onDeleteNote,
}: NoteListProps) {
  const [query, setQuery] = useState("");
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        )
      : notes;

    const groups = new Map<string, QuickNoteItem[]>();
    for (const note of filtered) {
      const folderName = note.folder || "General";
      const list = groups.get(folderName) ?? [];
      list.push(note);
      groups.set(folderName, list);
    }
    return Array.from(groups.entries());
  }, [notes, query]);

  const toggleFolder = (folder: string) => {
    setCollapsedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="qn-sidebar-header">
        <strong style={{ fontSize: "0.88rem", letterSpacing: "0.02em" }}>
          Vault ({notes.length})
        </strong>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          <Button size="sm" variant="ghost" onClick={onOpenAiGenerate} aria-label="AI Draft">
            <Sparkles size={14} /> AI
          </Button>
          <Button size="sm" variant="primary" onClick={onCreateBlankNote} aria-label="New Note">
            <Plus size={14} /> New
          </Button>
        </div>
      </div>

      <div className="qn-search-wrap">
        <Search
          size={14}
          style={{
            position: "absolute",
            left: "1.2rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--qn-muted)",
          }}
        />
        <input
          type="text"
          className="qn-input"
          style={{ paddingLeft: "1.95rem" }}
          placeholder="Search notes, #tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="qn-tree-list" data-testid="note-tree-list">
        {grouped.map(([folderName, items]) => {
          const isCollapsed = collapsedFolders[folderName] ?? false;
          return (
            <div key={folderName} style={{ marginBottom: "0.35rem" }}>
              <button
                type="button"
                onClick={() => toggleFolder(folderName)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: "var(--qn-muted)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "0.35rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                {isCollapsed ? <Folder size={13} /> : <FolderOpen size={13} />}
                <span>{folderName}</span>
                <span style={{ marginLeft: "auto", opacity: 0.7 }}>{items.length}</span>
              </button>

              {!isCollapsed &&
                items.map((note) => (
                  <div key={note.id} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <button
                      type="button"
                      className={`qn-tree-item ${activeNoteId === note.id ? "active" : ""}`}
                      onClick={() => onSelectNote(note.id)}
                      data-testid={`note-item-${note.id}`}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {note.title}
                      </span>
                    </button>
                    {notes.length > 1 && (
                      <button
                        type="button"
                        className="qn-icon-btn"
                        style={{ width: "26px", height: "26px", flexShrink: 0 }}
                        onClick={() => onDeleteNote(note.id)}
                        aria-label={`Delete ${note.title}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
