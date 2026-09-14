"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  KeyRound,
  FileText,
} from "lucide-react";
import { Tooltip, Button, Card, Dropdown } from "@mono/components";

export interface RoseMemoryItem {
  id: string;
  user_id?: string;
  category: string;
  content: string;
  importance?: "low" | "medium" | "high";
  created_at?: string;
  updated_at?: string | null;
}

export interface RoseMemoriesTabProps {
  isOpen: boolean;
  apiBasePath?: string;
  onCountChange?: (count: number) => void;
  onStatus?: (message: string, kind: "success" | "error") => void;
}

const IMPORTANCE_DROPDOWN_ITEMS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const LOCAL_STORAGE_MEMORIES_KEY = "mono_rose_local_memories";

export function RoseMemoriesTab({
  isOpen,
  apiBasePath = "/api/rose",
  onCountChange,
  onStatus,
}: RoseMemoriesTabProps) {
  const [memories, setMemories] = useState<RoseMemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newIndex, setNewIndex] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImportance, setNewImportance] = useState<"low" | "medium" | "high">("medium");

  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImportance, setEditImportance] = useState<"low" | "medium" | "high">("medium");

  useEffect(() => {
    if (!isOpen) return;
    loadMemories();
  }, [isOpen, apiBasePath]);

  const updateCount = (rows: RoseMemoryItem[]) => {
    setMemories(rows);
    onCountChange?.(rows.length);
  };

  const loadMemories = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${apiBasePath}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.memories)) {
          updateCount(data.memories);
          return;
        }
      }
    } catch {
      // ignore network failure, fallback to localStorage
    }

    try {
      const storedM = localStorage.getItem(LOCAL_STORAGE_MEMORIES_KEY);
      if (storedM) {
        const parsed = JSON.parse(storedM);
        if (Array.isArray(parsed)) {
          updateCount(parsed);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const pushLocal = (rows: RoseMemoryItem[]) => {
    updateCount(rows);
    try {
      localStorage.setItem(LOCAL_STORAGE_MEMORIES_KEY, JSON.stringify(rows));
    } catch {
      // ignore storage quota errors
    }
  };

  const reportError = (message: string) => {
    setErrorMsg(message);
    onStatus?.(message, "error");
  };

  const handleAddMemory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !newIndex.trim()) return;

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const normalizeIndex = newIndex.trim().toLowerCase();

    if (memories.some((m) => m.category === normalizeIndex)) {
      reportError(`Memory index '${normalizeIndex}' already exists. Edit it instead of adding a duplicate.`);
      setIsSaving(false);
      return;
    }

    const payload = {
      action: "add_memory",
      index: newIndex.trim(),
      content: newContent.trim(),
      importance: newImportance,
    };

    try {
      const res = await fetch(`${apiBasePath}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.memory) {
          updateCount([data.memory, ...memories]);
        }
        setNewContent("");
        setNewIndex("");
        setIsAddingMemory(false);
        setSuccessMsg("Memory learned.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      reportError(data.error?.message || "Failed to save memory.");
    } catch {
      const localItem: RoseMemoryItem = {
        id: `local-${Date.now()}`,
        content: newContent.trim(),
        category: normalizeIndex,
        importance: newImportance,
        created_at: new Date().toISOString(),
      };
      pushLocal([localItem, ...memories]);
      setNewContent("");
      setNewIndex("");
      setIsAddingMemory(false);
      setSuccessMsg("Memory saved locally.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMemory = async (oldIndex: string) => {
    if (!editContent.trim() || !editIndex.trim()) return;

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      action: "update_memory",
      index: oldIndex,
      newIndex: editIndex.trim(),
      content: editContent.trim(),
      importance: editImportance,
    };

    try {
      const res = await fetch(`${apiBasePath}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        updateCount(
          memories.map((m) =>
            m.category === oldIndex
              ? data.memory || { ...m, category: editIndex.trim().toLowerCase(), content: editContent.trim(), importance: editImportance }
              : m
          )
        );
        setEditingIndex(null);
        setSuccessMsg("Memory updated.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      reportError(data.error?.message || "Failed to update memory.");
    } catch {
      pushLocal(
        memories.map((m) =>
          m.category === oldIndex
            ? {
                ...m,
                category: editIndex.trim().toLowerCase(),
                content: editContent.trim(),
                importance: editImportance,
                updated_at: new Date().toISOString(),
              }
            : m
        )
      );
      setEditingIndex(null);
      setSuccessMsg("Memory updated locally.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMemory = async (indexValue: string) => {
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      action: "delete_memory",
      index: indexValue,
    };

    try {
      const res = await fetch(`${apiBasePath}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        pushLocal(memories.filter((m) => m.category !== indexValue));
        setSuccessMsg("Memory forgotten.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      reportError(data.error?.message || "Failed to delete memory.");
    } catch {
      pushLocal(memories.filter((m) => m.category !== indexValue));
      setSuccessMsg("Memory forgotten locally.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="m-rose-memories-container">
      {(successMsg || errorMsg) && (
        <div className={`m-rose-settings-alert ${errorMsg ? "error" : "success"}`} role={errorMsg ? "alert" : "status"}>
          {errorMsg ? "✕" : "✓"}
          <span>{errorMsg || successMsg}</span>
        </div>
      )}

      <div className="m-rose-memories-header">
        <div className="m-rose-memories-header-text">
          <p className="m-rose-memories-desc">
            Long-term memory is stored as unique indexes, each holding one full
            description. Rose always sees the index list and recalls the exact
            details on demand. Add, edit, rename, or delete indexes here.
          </p>
        </div>
        {!isAddingMemory && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="m-rose-add-memory-btn"
            onClick={() => setIsAddingMemory(true)}
            icon={<Plus size={14} />}
          >
            Add Memory Index
          </Button>
        )}
      </div>

      {isAddingMemory && (
        <Card
          as="form"
          bordered
          padded={false}
          className="m-rose-memory-form-card"
          onSubmit={handleAddMemory}
        >
          <div className="m-rose-settings-field">
            <div className="m-rose-settings-label-row">
              <label htmlFor="new-mem-index">Memory Index</label>
              <Tooltip
                variant="help"
                triggerAriaLabel="Help for Memory Index"
                content="A unique index (category) that names the memory topic, e.g. 'portfolio' or 'preferences'. One index stores one full description."
              />
            </div>
            <input
              id="new-mem-index"
              type="text"
              className="m-rose-settings-input"
              placeholder="e.g. portfolio, preferences, projects"
              value={newIndex}
              onChange={(e) => setNewIndex(e.target.value)}
              required
            />
          </div>

          <div className="m-rose-settings-field">
            <div className="m-rose-settings-label-row">
              <label htmlFor="new-mem-content">Full Description</label>
              <Tooltip
                variant="help"
                triggerAriaLabel="Help for Memory Description"
                content="The complete details Rose should recall when this index is opened. This replaces the full contents of the index."
              />
            </div>
            <textarea
              id="new-mem-content"
              className="m-rose-settings-textarea"
              rows={3}
              placeholder="e.g. Modern growth portfolio: 60% indexed global equity ETFs, 40% bonds, rebalanced quarterly. Stop-loss guidance at -15%."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            />
          </div>

          <div className="m-rose-memory-form-row">
            <div className="m-rose-settings-field flex-1">
              <label htmlFor="new-mem-importance">Importance</label>
              <Dropdown
                items={IMPORTANCE_DROPDOWN_ITEMS}
                value={newImportance}
                onChange={(val) => setNewImportance(val as any)}
                className="m-rose-settings-dropdown"
              />
            </div>
          </div>

          <div className="m-rose-memory-form-actions">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="m-rose-secondary-btn"
              onClick={() => setIsAddingMemory(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="m-rose-primary-btn"
              disabled={isSaving || !newContent.trim() || !newIndex.trim()}
            >
              {isSaving ? "Saving…" : "Learn Memory"}
            </Button>
          </div>
        </Card>
      )}

      <div className="m-rose-memories-list" role="list">
        {isLoading ? (
          <p className="m-rose-empty-sub">Loading memories…</p>
        ) : memories.length === 0 ? (
          <div className="m-rose-empty-memories">
            <Brain size={32} className="m-rose-empty-icon" />
            <p className="m-rose-empty-title">No memory indexes yet</p>
            <p className="m-rose-empty-sub">
              Use the &quot;Add Memory Index&quot; button to teach Rose about a
              topic, or just tell Rose in chat — she learns new indexes on her own.
            </p>
          </div>
        ) : (
          memories.map((m) => {
            const isEditing = editingIndex === m.category;

            if (isEditing) {
              return (
                <Card
                  key={m.category}
                  as="div"
                  bordered
                  padded={false}
                  className="m-rose-memory-form-card"
                  role="listitem"
                >
                  <div className="m-rose-settings-field">
                    <div className="m-rose-settings-label-row">
                      <label>Memory Index</label>
                      <Tooltip
                        variant="help"
                        triggerAriaLabel="Help for renaming Memory Index"
                        content="Rename the index to a new unique value. The description under it carries over."
                      />
                    </div>
                    <input
                      type="text"
                      className="m-rose-settings-input"
                      value={editIndex}
                      onChange={(e) => setEditIndex(e.target.value)}
                    />
                  </div>
                  <div className="m-rose-settings-field">
                    <label>Full Description</label>
                    <textarea
                      className="m-rose-settings-textarea"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      required
                    />
                  </div>
                  <div className="m-rose-memory-form-row">
                    <div className="m-rose-settings-field flex-1">
                      <label>Importance</label>
                      <Dropdown
                        items={IMPORTANCE_DROPDOWN_ITEMS}
                        value={editImportance}
                        onChange={(val) => setEditImportance(val as any)}
                        className="m-rose-settings-dropdown"
                      />
                    </div>
                  </div>
                  <div className="m-rose-memory-form-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="m-rose-secondary-btn"
                      onClick={() => setEditingIndex(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="m-rose-primary-btn"
                      disabled={isSaving || !editContent.trim() || !editIndex.trim()}
                      onClick={() => handleUpdateMemory(m.category)}
                    >
                      Update
                    </Button>
                  </div>
                </Card>
              );
            }

            return (
              <Card
                key={m.category}
                as="div"
                bordered
                padded={false}
                className="m-rose-memory-card"
                role="listitem"
              >
                <div className="m-rose-memory-card-body">
                  <div className="m-rose-memory-card-tags">
                    <span className="m-rose-memory-category-tag">
                      <KeyRound size={10} />
                      {m.category}
                    </span>
                    <span className={`m-rose-memory-importance-tag ${m.importance || "medium"}`}>
                      {m.importance || "medium"}
                    </span>
                  </div>
                  <p className="m-rose-memory-card-text">
                    <FileText size={12} />
                    <span>{m.content}</span>
                  </p>
                </div>
                <div className="m-rose-memory-card-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="m-rose-memory-icon-btn"
                    title="Edit memory index"
                    aria-label="Edit memory index"
                    icon={<Edit2 size={13} />}
                    onClick={() => {
                      setEditingIndex(m.category);
                      setEditIndex(m.category);
                      setEditContent(m.content);
                      setEditImportance(m.importance || "medium");
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="m-rose-memory-icon-btn danger"
                    title="Delete memory index"
                    aria-label="Delete memory index"
                    icon={<Trash2 size={13} />}
                    onClick={() => handleDeleteMemory(m.category)}
                  />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}