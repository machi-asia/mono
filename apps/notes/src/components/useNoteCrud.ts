"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@mono/auth";
import {
  SEED_NOTES,
  SEED_NOTE_RELATIONS,
  type QuickNoteItem,
  type QuickNoteRelationItem,
} from "@/data/seed-notes";

const STORAGE_NOTES_KEY = "machi_notes_sandbox_notes_v1";
const STORAGE_RELS_KEY = "machi_notes_sandbox_rels_v1";

export function useNoteCrud() {
  const { user, isLoading: authLoading } = useAuth();
  const [notes, setNotes] = useState<QuickNoteItem[]>(SEED_NOTES);
  const [relations, setRelations] = useState<QuickNoteRelationItem[]>(SEED_NOTE_RELATIONS);
  const [isUsingDemo, setIsUsingDemo] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const persistDemoState = useCallback(
    (nextNotes: QuickNoteItem[], nextRels: QuickNoteRelationItem[]) => {
      try {
        localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(nextNotes));
        localStorage.setItem(STORAGE_RELS_KEY, JSON.stringify(nextRels));
      } catch {
        // Ignore storage quota errors
      }
    },
    []
  );

  const refreshNotes = useCallback(async () => {
    if (!user) {
      try {
        const cachedNotes = localStorage.getItem(STORAGE_NOTES_KEY);
        const cachedRels = localStorage.getItem(STORAGE_RELS_KEY);
        if (cachedNotes) {
          const parsedNotes = JSON.parse(cachedNotes) as QuickNoteItem[];
          if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
            setNotes(parsedNotes);
          }
        }
        if (cachedRels) {
          const parsedRels = JSON.parse(cachedRels) as QuickNoteRelationItem[];
          if (Array.isArray(parsedRels)) {
            setRelations(parsedRels);
          }
        }
      } catch {
        setNotes(SEED_NOTES);
        setRelations(SEED_NOTE_RELATIONS);
      }
      setIsUsingDemo(true);
      return;
    }

    const [notesRes, relsRes] = await Promise.all([
      fetch("/api/quicknote/notes"),
      fetch("/api/quicknote/relations"),
    ]);

    if (notesRes.ok) {
      const notesJson = (await notesRes.json()) as { notes?: QuickNoteItem[] };
      const cloudNotes = notesJson.notes ?? [];
      if (cloudNotes.length > 0) {
        setNotes(cloudNotes);
        setIsUsingDemo(false);
        if (relsRes.ok) {
          const relsJson = (await relsRes.json()) as { relations?: QuickNoteRelationItem[] };
          setRelations(relsJson.relations ?? []);
        }
        return;
      }
    }

    setNotes(SEED_NOTES);
    setRelations(SEED_NOTE_RELATIONS);
    setIsUsingDemo(true);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    const sync = async () => {
      if (!active) return;
      await refreshNotes();
    };
    void sync();
    return () => {
      active = false;
    };
  }, [authLoading, refreshNotes]);

  const createNote = useCallback(
    async (input: { title: string; content?: string; folder?: string; tags?: string[] }) => {
      const now = new Date().toISOString();
      if (!user) {
        const nextId = notes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
        const created: QuickNoteItem = {
          id: nextId,
          title: input.title.trim() || "Untitled Note",
          content: input.content ?? `# ${input.title.trim() || "Untitled Note"}\n\n`,
          folder: input.folder ?? "General",
          tags: input.tags ?? ["note"],
          order_index: notes.length,
          created_at: now,
          updated_at: now,
        };
        const nextNotes = [...notes, created];
        setNotes(nextNotes);
        persistDemoState(nextNotes, relations);
        return created;
      }

      setSaving(true);
      try {
        const res = await fetch("/api/quicknote/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: input.title,
            content: input.content ?? "",
            folder: input.folder ?? "",
            tags: input.tags ?? [],
            order_index: notes.length,
          }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { note: QuickNoteItem };
        setIsUsingDemo(false);
        setNotes((prev) => [...prev.filter((n) => !isUsingDemo || n.user_id), data.note]);
        return data.note;
      } finally {
        setSaving(false);
      }
    },
    [isUsingDemo, notes, persistDemoState, relations, user]
  );

  const updateNote = useCallback(
    async (
      id: number,
      updates: Partial<Pick<QuickNoteItem, "title" | "content" | "folder" | "tags">>
    ) => {
      const now = new Date().toISOString();
      const nextNotes = notes.map((n) =>
        n.id === id ? { ...n, ...updates, updated_at: now } : n
      );
      setNotes(nextNotes);

      if (isUsingDemo || !user) {
        persistDemoState(nextNotes, relations);
        return;
      }

      setSaving(true);
      try {
        await fetch("/api/quicknote/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
      } finally {
        setSaving(false);
      }
    },
    [isUsingDemo, notes, persistDemoState, relations, user]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      const nextNotes = notes.filter((n) => n.id !== id);
      const nextRels = relations.filter(
        (r) => r.note_id !== id && r.related_note_id !== id
      );
      setNotes(nextNotes);
      setRelations(nextRels);

      if (isUsingDemo || !user) {
        persistDemoState(nextNotes, nextRels);
        return;
      }

      await fetch(`/api/quicknote/notes?id=${encodeURIComponent(String(id))}`, {
        method: "DELETE",
      });
    },
    [isUsingDemo, notes, persistDemoState, relations, user]
  );

  const linkNotes = useCallback(
    async (noteId: number, relatedNoteId: number) => {
      if (noteId === relatedNoteId) return;
      const exists = relations.some(
        (r) =>
          (r.note_id === noteId && r.related_note_id === relatedNoteId) ||
          (r.note_id === relatedNoteId && r.related_note_id === noteId)
      );
      if (exists) return;

      const rel: QuickNoteRelationItem = {
        note_id: noteId,
        related_note_id: relatedNoteId,
        created_at: new Date().toISOString(),
      };
      const nextRels = [...relations, rel];
      setRelations(nextRels);

      if (isUsingDemo || !user) {
        persistDemoState(notes, nextRels);
        return;
      }

      await fetch("/api/quicknote/relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_id: noteId, related_note_id: relatedNoteId }),
      });
    },
    [isUsingDemo, notes, persistDemoState, relations, user]
  );

  return {
    user,
    notes,
    relations,
    isUsingDemo,
    saving,
    createNote,
    updateNote,
    deleteNote,
    linkNotes,
  };
}
