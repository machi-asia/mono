"use client";

import { useState, useCallback } from "react";

export function useNoteTabs(initialNoteId = 1) {
  const [openTabIds, setOpenTabIds] = useState<number[]>([initialNoteId, 2]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(initialNoteId);

  const openNoteTab = useCallback((noteId: number) => {
    setOpenTabIds((prev) => (prev.includes(noteId) ? prev : [...prev, noteId]));
    setActiveNoteId(noteId);
  }, []);

  const closeNoteTab = useCallback(
    (noteId: number) => {
      setOpenTabIds((prev) => {
        const remaining = prev.filter((id) => id !== noteId);
        if (activeNoteId === noteId) {
          setActiveNoteId(remaining[remaining.length - 1] ?? null);
        }
        return remaining;
      });
    },
    [activeNoteId]
  );

  return {
    openTabIds,
    activeNoteId,
    setActiveNoteId,
    openNoteTab,
    closeNoteTab,
  };
}
