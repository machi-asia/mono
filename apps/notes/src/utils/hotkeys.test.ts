import { describe, expect, it, vi } from "vitest";
import { matchQuickNoteHotkey } from "./hotkeys";

describe("matchQuickNoteHotkey", () => {
  it("triggers graph toggle on Ctrl+Shift+G", () => {
    const onToggleGraph = vi.fn();
    const matched = matchQuickNoteHotkey(
      { ctrlKey: true, metaKey: false, shiftKey: true, key: "G" },
      { onToggleGraph }
    );
    expect(matched).toBe(true);
    expect(onToggleGraph).toHaveBeenCalledOnce();
  });

  it("ignores bare keypresses without modifier", () => {
    const onSave = vi.fn();
    const matched = matchQuickNoteHotkey(
      { ctrlKey: false, metaKey: false, shiftKey: false, key: "s" },
      { onSave }
    );
    expect(matched).toBe(false);
    expect(onSave).not.toHaveBeenCalled();
  });
});
