"use client";

import { useState } from "react";
import { Columns2, Eye, Link2, PenLine } from "lucide-react";
import { MarkdownRenderer } from "@mono/components";
import type { QuickNoteItem, QuickNoteRelationItem } from "@/data/seed-notes";

interface NoteEditorProps {
  note: QuickNoteItem;
  allNotes: QuickNoteItem[];
  relations: QuickNoteRelationItem[];
  viewMode: "editor" | "split" | "preview";
  saving: boolean;
  onChangeMode: (mode: "editor" | "split" | "preview") => void;
  onUpdate: (
    updates: Partial<Pick<QuickNoteItem, "title" | "content" | "folder" | "tags">>
  ) => void;
  onSelectNote: (noteId: number) => void;
  onLinkNote: (relatedNoteId: number) => void;
}

export function NoteEditor({
  note,
  allNotes,
  relations,
  viewMode,
  saving,
  onChangeMode,
  onUpdate,
  onSelectNote,
  onLinkNote,
}: NoteEditorProps) {
  const [linkTargetId, setLinkTargetId] = useState<string>("");

  const connectedNotes = allNotes.filter((candidate) => {
    if (candidate.id === note.id) return false;
    return relations.some(
      (r) =>
        (r.note_id === note.id && r.related_note_id === candidate.id) ||
        (r.related_note_id === note.id && r.note_id === candidate.id)
    );
  });

  const handleWikilinkClick = (targetTitle: string) => {
    const found = allNotes.find(
      (n) => n.title.toLowerCase() === targetTitle.toLowerCase()
    );
    if (found) {
      onSelectNote(found.id);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div className="qn-toolbar">
        <input
          type="text"
          aria-label="Note title"
          className="qn-title-input"
          value={note.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            type="text"
            aria-label="Folder"
            className="qn-input"
            style={{ width: "120px", padding: "0.35rem 0.6rem" }}
            placeholder="Folder"
            value={note.folder}
            onChange={(e) => onUpdate({ folder: e.target.value })}
          />
          <span style={{ fontSize: "0.75rem", color: "var(--qn-muted)" }}>
            {saving ? "Saving..." : "Synced"}
          </span>

          <div className="qn-mode-group" role="group" aria-label="Editor view mode">
            <button
              type="button"
              className={`qn-mode-btn ${viewMode === "editor" ? "active" : ""}`}
              onClick={() => onChangeMode("editor")}
            >
              <PenLine size={13} /> Write
            </button>
            <button
              type="button"
              className={`qn-mode-btn ${viewMode === "split" ? "active" : ""}`}
              onClick={() => onChangeMode("split")}
            >
              <Columns2 size={13} /> Split
            </button>
            <button
              type="button"
              className={`qn-mode-btn ${viewMode === "preview" ? "active" : ""}`}
              onClick={() => onChangeMode("preview")}
            >
              <Eye size={13} /> Preview
            </button>
          </div>
        </div>
      </div>

      <div className={`qn-content-area ${viewMode === "split" ? "split" : ""}`}>
        {viewMode !== "preview" && (
          <div className="qn-editor-pane">
            <textarea
              aria-label="Markdown content"
              className="qn-textarea"
              value={note.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Write markdown with [[Wikilinks]] and #tags..."
            />
          </div>
        )}

        {viewMode !== "editor" && (
          <div className="qn-preview-pane" data-testid="note-markdown-preview">
            <MarkdownRenderer
              content={note.content}
              onWikilinkClick={handleWikilinkClick}
            />
          </div>
        )}
      </div>

      <div className="qn-relations-strip">
        <span style={{ color: "var(--qn-muted)", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
          <Link2 size={14} /> Linked Notes:
        </span>

        {connectedNotes.length === 0 ? (
          <span style={{ color: "var(--qn-muted)" }}>None yet</span>
        ) : (
          connectedNotes.map((relNote) => (
            <button
              key={relNote.id}
              type="button"
              className="qn-chip"
              onClick={() => onSelectNote(relNote.id)}
            >
              {relNote.title}
            </button>
          ))
        )}

        <select
          aria-label="Connect note"
          className="qn-input"
          style={{ width: "auto", padding: "0.25rem 0.55rem", marginLeft: "auto", fontSize: "0.78rem" }}
          value={linkTargetId}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLinkTargetId("");
            if (Number.isFinite(val) && val > 0) {
              onLinkNote(val);
            }
          }}
        >
          <option value="">+ Connect Note...</option>
          {allNotes
            .filter((n) => n.id !== note.id)
            .map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.title}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
