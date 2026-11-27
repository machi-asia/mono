export interface QuickNoteHotkeyHandlers {
  onNewNote?: () => void;
  onSave?: () => void;
  onToggleGraph?: () => void;
  onOpenGenerate?: () => void;
}

export function matchQuickNoteHotkey(
  event: Pick<KeyboardEvent, "ctrlKey" | "metaKey" | "shiftKey" | "key">,
  handlers: QuickNoteHotkeyHandlers
): boolean {
  const mod = event.ctrlKey || event.metaKey;
  if (!mod) return false;

  const key = event.key.toLowerCase();

  if (key === "s") {
    handlers.onSave?.();
    return true;
  }
  if (key === "g" && event.shiftKey) {
    handlers.onToggleGraph?.();
    return true;
  }
  if (key === "k" && event.shiftKey) {
    handlers.onOpenGenerate?.();
    return true;
  }
  if (key === "n" && event.shiftKey) {
    handlers.onNewNote?.();
    return true;
  }

  return false;
}
