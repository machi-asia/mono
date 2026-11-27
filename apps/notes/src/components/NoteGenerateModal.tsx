"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@mono/components";

interface NoteGenerateModalProps {
  isOpen: boolean;
  existingTitles: string[];
  onClose: () => void;
  onCreateGenerated: (draft: {
    title: string;
    content: string;
    tags: string[];
    folder: string;
  }) => Promise<void>;
}

export function NoteGenerateModal({
  isOpen,
  existingTitles,
  onClose,
  onCreateGenerated,
}: NoteGenerateModalProps) {
  const [prompt, setPrompt] = useState("");
  const [folder, setFolder] = useState("Research");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quicknote/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), existingTitles }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          title: string;
          content: string;
          tags?: string[];
        };
        await onCreateGenerated({
          title: data.title,
          content: data.content,
          tags: data.tags ?? ["ai"],
          folder,
        });
        setPrompt("");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qn-modal-backdrop" role="dialog" aria-modal="true" aria-label="AI Note Generator">
      <div className="qn-modal-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Sparkles size={18} style={{ color: "var(--qn-accent-light)" }} /> Draft Note with AI
          </h2>
          <button type="button" className="qn-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <input
            type="text"
            className="qn-input"
            placeholder="Target folder (e.g. Research, Engineering)"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          />
          <textarea
            className="qn-input"
            rows={4}
            placeholder="Describe what note you want structured with headings, tasks, and graph links..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem" }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Generate Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
