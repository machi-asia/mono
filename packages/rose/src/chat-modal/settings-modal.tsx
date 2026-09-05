"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  X,
  Sliders,
  Brain,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Tooltip, Button, Card, Dropdown, Navbar } from "@mono/components";

export interface RoseMemoryItem {
  id: number | string;
  user_id?: string;
  content: string;
  category?: string | null;
  importance?: "low" | "medium" | "high" | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface RosePersonalizationData {
  user_id?: string;
  custom_instructions: string;
  nickname?: string | null;
  tone?: string | null;
  updated_at?: string;
}

export interface RoseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBasePath?: string;
}

const TONE_OPTIONS = [
  "Warm & Helpful",
  "Concise & Direct",
  "Enthusiastic & Playful",
  "Professional & Formal",
  "Empathetic & Gentle",
  "Analytical & Technical",
];

const TONE_DROPDOWN_ITEMS = TONE_OPTIONS.map((opt) => ({ label: opt, value: opt }));

const IMPORTANCE_DROPDOWN_ITEMS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const LOCAL_STORAGE_MEMORIES_KEY = "mono_rose_local_memories";
const LOCAL_STORAGE_PERSONALIZATION_KEY = "mono_rose_local_personalization";

export function RoseSettingsModal({
  isOpen,
  onClose,
  apiBasePath = "/api/rose",
}: RoseSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"personalization" | "memories">("personalization");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Personalization state
  const [customInstructions, setCustomInstructions] = useState("");
  const [nickname, setNickname] = useState("");
  const [tone, setTone] = useState("Warm & Helpful");

  // Memories state
  const [memories, setMemories] = useState<RoseMemoryItem[]>([]);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newImportance, setNewImportance] = useState<"low" | "medium" | "high">("medium");

  // Editing memory state
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [editImportance, setEditImportance] = useState<"low" | "medium" | "high">("medium");

  const loadSettings = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${apiBasePath}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.personalization) {
          setCustomInstructions(data.personalization.custom_instructions || "");
          setNickname(data.personalization.nickname || "");
          setTone(data.personalization.tone || "Warm & Helpful");
        }
        if (Array.isArray(data.memories)) {
          setMemories(data.memories);
        }
        return;
      }
    } catch {
      // ignore network failure, fallback to localStorage
    }

    // LocalStorage fallback for guests / offline / mock mode
    try {
      const storedP = localStorage.getItem(LOCAL_STORAGE_PERSONALIZATION_KEY);
      if (storedP) {
        const parsed = JSON.parse(storedP);
        setCustomInstructions(parsed.custom_instructions || "");
        setNickname(parsed.nickname || "");
        setTone(parsed.tone || "Warm & Helpful");
      }
      const storedM = localStorage.getItem(LOCAL_STORAGE_MEMORIES_KEY);
      if (storedM) {
        const parsed = JSON.parse(storedM);
        if (Array.isArray(parsed)) {
          setMemories(parsed);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, apiBasePath]);

  const handleSavePersonalization = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      action: "save_personalization",
      customInstructions: customInstructions.trim(),
      nickname: nickname.trim(),
      tone,
    };

    try {
      const res = await fetch(`${apiBasePath}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Personalization saved successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      // Local fallback
      try {
        localStorage.setItem(
          LOCAL_STORAGE_PERSONALIZATION_KEY,
          JSON.stringify({
            custom_instructions: customInstructions.trim(),
            nickname: nickname.trim(),
            tone,
          })
        );
        setSuccessMsg("Personalization saved locally.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch {
        setErrorMsg("Failed to save personalization.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMemory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSaving(true);
    setErrorMsg("");

    const payload = {
      action: "add_memory",
      content: newContent.trim(),
      category: newCategory.trim() || "general",
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
          setMemories((prev) => [data.memory, ...prev]);
        }
        setNewContent("");
        setNewCategory("general");
        setIsAddingMemory(false);
        setSuccessMsg("Memory saved.");
        setTimeout(() => setSuccessMsg(""), 3000);
        return;
      }
    } catch {
      // Local fallback
      const localItem: RoseMemoryItem = {
        id: Date.now(),
        content: newContent.trim(),
        category: newCategory.trim() || "general",
        importance: newImportance,
        created_at: new Date().toISOString(),
      };
      const updated = [localItem, ...memories];
      setMemories(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_MEMORIES_KEY, JSON.stringify(updated));
      } catch {}
      setNewContent("");
      setNewCategory("general");
      setIsAddingMemory(false);
      setSuccessMsg("Memory saved locally.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMemory = async (id: number | string) => {
    if (!editContent.trim()) return;

    setIsSaving(true);
    setErrorMsg("");

    const payload = {
      action: "update_memory",
      id,
      content: editContent.trim(),
      category: editCategory.trim() || "general",
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
        setMemories((prev) =>
          prev.map((m) => (m.id === id ? data.memory || { ...m, content: editContent, category: editCategory, importance: editImportance } : m))
        );
        setEditingId(null);
        setSuccessMsg("Memory updated.");
        setTimeout(() => setSuccessMsg(""), 3000);
        return;
      }
    } catch {
      // Local fallback
      const updated = memories.map((m) =>
        m.id === id
          ? {
              ...m,
              content: editContent.trim(),
              category: editCategory.trim() || "general",
              importance: editImportance,
              updated_at: new Date().toISOString(),
            }
          : m
      );
      setMemories(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_MEMORIES_KEY, JSON.stringify(updated));
      } catch {}
      setEditingId(null);
      setSuccessMsg("Memory updated locally.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMemory = async (id: number | string) => {
    setIsSaving(true);
    setErrorMsg("");

    const payload = {
      action: "delete_memory",
      id,
    };

    try {
      const res = await fetch(`${apiBasePath}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        setSuccessMsg("Memory removed.");
        setTimeout(() => setSuccessMsg(""), 3000);
        return;
      }
    } catch {
      // Local fallback
      const updated = memories.filter((m) => m.id !== id);
      setMemories(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_MEMORIES_KEY, JSON.stringify(updated));
      } catch {}
      setSuccessMsg("Memory removed locally.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="m-rose-settings-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
      <div className="m-rose-settings-modal">
        {/* Header */}
        <header className="m-rose-settings-header">
          <div className="m-rose-settings-header-title">
            <Sliders size={18} className="m-rose-settings-icon" />
            <h2 id="settings-dialog-title">Rose Settings</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="m-rose-header-icon-btn"
            onClick={onClose}
            title="Close Settings"
            aria-label="Close Settings"
            icon={<X size={18} />}
          />
        </header>

        {/* Tabs Navbar */}
        <Navbar
          variant="tabs"
          className="m-rose-settings-navbar"
          links={[
            {
              label: "Personalization",
              active: activeTab === "personalization",
              icon: <Sliders size={14} />,
              onClick: () => setActiveTab("personalization"),
            },
            {
              label: `Memories (${memories.length})`,
              active: activeTab === "memories",
              icon: <Brain size={14} />,
              onClick: () => setActiveTab("memories"),
            },
          ]}
        />

        {/* Status Messages */}
        {successMsg && (
          <div className="m-rose-settings-alert success" role="status">
            <Check size={14} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="m-rose-settings-alert error" role="alert">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="m-rose-settings-content">
          {activeTab === "personalization" ? (
            <form onSubmit={handleSavePersonalization} className="m-rose-personalization-form">
              <div className="m-rose-settings-field">
                <div className="m-rose-settings-label-row">
                  <label htmlFor="pref-nickname">Preferred Nickname / Name</label>
                  <Tooltip
                    variant="help"
                    triggerAriaLabel="Help for Preferred Nickname"
                    content="Specify how Rose should address you throughout chats and greetings."
                  />
                </div>
                <input
                  id="pref-nickname"
                  type="text"
                  className="m-rose-settings-input"
                  placeholder="e.g. Captain, Alex, Sensei"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="m-rose-settings-field">
                <div className="m-rose-settings-label-row">
                  <label htmlFor="pref-tone">Personality & Tone Style</label>
                  <Tooltip
                    variant="help"
                    triggerAriaLabel="Help for Tone Style"
                    content="Select Rose's predominant conversational tone across responses."
                  />
                </div>
                <Dropdown
                  items={TONE_DROPDOWN_ITEMS}
                  value={tone}
                  onChange={(val) => setTone(val)}
                  className="m-rose-settings-dropdown"
                />
              </div>

              <div className="m-rose-settings-field">
                <div className="m-rose-settings-label-row">
                  <label htmlFor="pref-instructions">Custom Instructions</label>
                  <Tooltip
                    variant="help"
                    triggerAriaLabel="Help for Custom Instructions"
                    content="Provide guidelines, topics of interest, or constraints that Rose will remember and follow in every conversation."
                  />
                </div>
                <textarea
                  id="pref-instructions"
                  className="m-rose-settings-textarea"
                  rows={5}
                  placeholder="What would you like Rose to know about you to provide better responses? (e.g. Always respond with TypeScript examples, keep answers concise)"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
              </div>

              <div className="m-rose-settings-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSaving}
                  icon={<Sparkles size={14} />}
                >
                  {isSaving ? "Saving…" : "Save Personalization"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="m-rose-memories-container">
              <div className="m-rose-memories-header">
                <div className="m-rose-memories-header-text">
                  <p className="m-rose-memories-desc">
                    Memories automatically gathered by Rose or added by you. Rose references these in every prompt.
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
                    Add Memory
                  </Button>
                )}
              </div>

              {/* Add Memory Form */}
              {isAddingMemory && (
                <Card
                  as="form"
                  bordered
                  padded={false}
                  className="m-rose-memory-form-card"
                  onSubmit={handleAddMemory}
                >
                  <div className="m-rose-settings-field">
                    <label htmlFor="new-mem-content">Memory Content</label>
                    <textarea
                      id="new-mem-content"
                      className="m-rose-settings-textarea"
                      rows={2}
                      placeholder="e.g. Loves minimalist modern architecture; allergic to peanuts"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="m-rose-memory-form-row">
                    <div className="m-rose-settings-field flex-1">
                      <label htmlFor="new-mem-category">Category</label>
                      <input
                        id="new-mem-category"
                        type="text"
                        className="m-rose-settings-input"
                        placeholder="general, preference, hobby"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>

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
                      disabled={isSaving || !newContent.trim()}
                    >
                      {isSaving ? "Saving…" : "Save Memory"}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Memories List */}
              <div className="m-rose-memories-list" role="list">
                {memories.length === 0 ? (
                  <div className="m-rose-empty-memories">
                    <Brain size={32} className="m-rose-empty-icon" />
                    <p className="m-rose-empty-title">No memories stored yet</p>
                    <p className="m-rose-empty-sub">
                      Tell Rose about your preferences or use the &quot;Add Memory&quot; button above to create one.
                    </p>
                  </div>
                ) : (
                  memories.map((m) => {
                    const isEditing = editingId === m.id;

                    if (isEditing) {
                      return (
                        <Card
                          key={m.id}
                          as="div"
                          bordered
                          padded={false}
                          className="m-rose-memory-form-card"
                          role="listitem"
                        >
                          <div className="m-rose-settings-field">
                            <label>Edit Memory</label>
                            <textarea
                              className="m-rose-settings-textarea"
                              rows={2}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              required
                            />
                          </div>
                          <div className="m-rose-memory-form-row">
                            <div className="m-rose-settings-field flex-1">
                              <label>Category</label>
                              <input
                                type="text"
                                className="m-rose-settings-input"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                              />
                            </div>
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
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="m-rose-primary-btn"
                              disabled={isSaving || !editContent.trim()}
                              onClick={() => handleUpdateMemory(m.id)}
                            >
                              Update
                            </Button>
                          </div>
                        </Card>
                      );
                    }

                    return (
                      <Card
                        key={m.id}
                        as="div"
                        bordered
                        padded={false}
                        className="m-rose-memory-card"
                        role="listitem"
                      >
                        <div className="m-rose-memory-card-body">
                          <div className="m-rose-memory-card-tags">
                            <span className="m-rose-memory-category-tag">
                              <Tag size={10} />
                              {m.category || "general"}
                            </span>
                            <span className={`m-rose-memory-importance-tag ${m.importance || "medium"}`}>
                              {m.importance || "medium"}
                            </span>
                          </div>
                          <p className="m-rose-memory-card-text">{m.content}</p>
                        </div>
                        <div className="m-rose-memory-card-actions">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="m-rose-memory-icon-btn"
                            title="Edit memory"
                            aria-label="Edit memory"
                            icon={<Edit2 size={13} />}
                            onClick={() => {
                              setEditingId(m.id);
                              setEditContent(m.content);
                              setEditCategory(m.category || "general");
                              setEditImportance(m.importance || "medium");
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="m-rose-memory-icon-btn danger"
                            title="Delete memory"
                            aria-label="Delete memory"
                            icon={<Trash2 size={13} />}
                            onClick={() => handleDeleteMemory(m.id)}
                          />
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
