"use client";

import { useState, type FormEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@mono/components";
import type { AddModPayload } from "./useMmmLogic";

interface UploadModModalProps {
  isOpen: boolean;
  minecraftVersion: string;
  modloader: string;
  onClose: () => void;
  onAddMod: (payload: AddModPayload) => Promise<{ ok: boolean }>;
}

export function UploadModModal({
  isOpen,
  minecraftVersion,
  modloader,
  onClose,
  onAddMod,
}: UploadModModalProps) {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [filename, setFilename] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !downloadUrl.trim()) return;
    setSubmitting(true);
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const res = await onAddMod({
      modrinth_id: `custom-${slug}-${Date.now()}`,
      modrinth_slug: slug,
      name: name.trim(),
      summary: summary.trim() || `Custom ${modloader} mod entry`,
      author: author.trim() || "Custom Pack",
      download_url: downloadUrl.trim(),
      filename: filename.trim() || `${slug}-${version}.jar`,
      version_number: version.trim() || "1.0.0",
      minecraft_version: minecraftVersion,
      modloader,
    });
    setSubmitting(false);
    if (res.ok) {
      setName("");
      setFilename("");
      setDownloadUrl("");
      setAuthor("");
      setSummary("");
      onClose();
    }
  };

  return (
    <div className="mmm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Add Custom Mod">
      <div className="mmm-modal-panel">
        <div className="mmm-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Upload size={18} /> Add Custom Mod URL
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Register a GitHub release, CurseForge mirror, or private datapack `.jar` for {modloader} {minecraftVersion}.
            </p>
          </div>
          <button type="button" className="mmm-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
            <input
              type="text"
              className="mmm-input"
              placeholder="Mod name (e.g. Create Steam & Rails)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              className="mmm-input"
              placeholder="Version (1.6.4)"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>

          <input
            type="url"
            className="mmm-input"
            placeholder="Direct JAR URL (https://...)"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <input
              type="text"
              className="mmm-input"
              placeholder="Filename (optional .jar)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <input
              type="text"
              className="mmm-input"
              placeholder="Author / Maintainer"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <textarea
            className="mmm-input"
            rows={2}
            placeholder="Notes or patch description..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Add to Modpack
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
