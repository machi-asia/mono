"use client";

import { useState, useEffect, useMemo } from "react";
import { NotebookPen, Sparkles } from "lucide-react";
import { AuthNavbar, SignInModal } from "@mono/auth";
import { Button } from "@mono/components";
import { useNoteCrud } from "./useNoteCrud";
import { useNoteTabs } from "./useNoteTabs";
import { useWorkspaceResizer } from "./useWorkspaceResizer";
import { NoteList } from "./NoteList";
import { NoteTabBar } from "./NoteTabBar";
import { NoteEditor } from "./NoteEditor";
import { NoteGraph } from "./NoteGraph";
import { NoteGenerateModal } from "./NoteGenerateModal";
import { matchQuickNoteHotkey } from "@/utils/hotkeys";

export function NotesWorkspace() {
  const {
    user,
    notes,
    relations,
    isUsingDemo,
    saving,
    createNote,
    updateNote,
    deleteNote,
    linkNotes,
  } = useNoteCrud();

  const {
    openTabIds,
    activeNoteId,
    openNoteTab,
    closeNoteTab,
  } = useNoteTabs(1);

  const { sidebarWidth, startResizing } = useWorkspaceResizer(275);
  const [viewMode, setViewMode] = useState<"editor" | "split" | "preview" | "graph">("split");
  const [editorLayoutMode, setEditorLayoutMode] = useState<"editor" | "split" | "preview">("split");
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) ?? notes[0] ?? null,
    [notes, activeNoteId]
  );

  const handleSelectNote = (noteId: number) => {
    openNoteTab(noteId);
    if (viewMode === "graph") {
      setViewMode(editorLayoutMode);
    }
  };

  const handleCreateBlank = async () => {
    const created = await createNote({
      title: `Note ${notes.length + 1}`,
      folder: "Inbox",
      content: `# Note ${notes.length + 1}\n\nConnected to [[Architecture Hub]]`,
    });
    if (created) {
      handleSelectNote(created.id);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const matched = matchQuickNoteHotkey(e, {
        onToggleGraph: () =>
          setViewMode((prev) => (prev === "graph" ? editorLayoutMode : "graph")),
        onOpenGenerate: () => setShowAiModal(true),
      });
      if (matched) e.preventDefault();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [editorLayoutMode]);

  return (
    <div className="qn-body">
      <AuthNavbar
        brand={
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", fontWeight: 800 }}>
            <NotebookPen size={19} style={{ color: "var(--qn-accent-light)" }} />
            <span>Machi Notes</span>
          </span>
        }
        links={[
          { label: "Machi Hub", href: "https://machi.asia" },
          { label: "MMM", href: "https://mmm.machi.asia" },
        ]}
        actions={
          !user ? (
            <Button size="sm" variant="secondary" onClick={() => setShowSignIn(true)}>
              Sign In to Sync Vault
            </Button>
          ) : undefined
        }
      />

      <div className="qn-shell">
        {isUsingDemo && (
          <div className="qn-banner">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              <Sparkles size={14} style={{ color: "var(--qn-accent-light)" }} />
              <strong>Sandbox Vault:</strong> Notes and graph links save locally in your browser. Sign in to sync across devices via Supabase.
            </span>
          </div>
        )}

        <div className="qn-workspace">
          <aside className="qn-sidebar" style={{ width: `${sidebarWidth}px` }}>
            <NoteList
              notes={notes}
              activeNoteId={activeNote?.id ?? null}
              onSelectNote={handleSelectNote}
              onCreateBlankNote={() => void handleCreateBlank()}
              onOpenAiGenerate={() => setShowAiModal(true)}
              onDeleteNote={(id) => {
                closeNoteTab(id);
                void deleteNote(id);
              }}
            />
          </aside>

          <div
            className="qn-resizer"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize notes sidebar"
            onMouseDown={startResizing}
          />

          <section className="qn-main">
            <NoteTabBar
              notes={notes}
              openTabIds={openTabIds}
              activeNoteId={activeNote?.id ?? null}
              viewMode={viewMode}
              onSelectTab={handleSelectNote}
              onCloseTab={closeNoteTab}
              onToggleGraph={() =>
                setViewMode((prev) => (prev === "graph" ? editorLayoutMode : "graph"))
              }
            />

            {viewMode === "graph" ? (
              <NoteGraph
                notes={notes}
                relations={relations}
                activeNoteId={activeNote?.id ?? null}
                onSelectNote={handleSelectNote}
              />
            ) : activeNote ? (
              <NoteEditor
                note={activeNote}
                allNotes={notes}
                relations={relations}
                viewMode={editorLayoutMode}
                saving={saving}
                onChangeMode={(mode) => {
                  setEditorLayoutMode(mode);
                  setViewMode(mode);
                }}
                onUpdate={(updates) => void updateNote(activeNote.id, updates)}
                onSelectNote={handleSelectNote}
                onLinkNote={(relatedId) => void linkNotes(activeNote.id, relatedId)}
              />
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--qn-muted)" }}>
                Select or create a note from the sidebar to start writing.
              </div>
            )}
          </section>
        </div>
      </div>

      <NoteGenerateModal
        isOpen={showAiModal}
        existingTitles={notes.map((n) => n.title)}
        onClose={() => setShowAiModal(false)}
        onCreateGenerated={async (draft) => {
          const created = await createNote(draft);
          if (created) handleSelectNote(created.id);
        }}
      />

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          title="Sign in to Machi Notes"
          subtitle="Sync your hierarchical markdown notes and knowledge graph with Supabase."
        />
      )}
    </div>
  );
}
