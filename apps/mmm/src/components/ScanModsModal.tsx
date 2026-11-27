"use client";

import { useState, type ChangeEvent } from "react";
import { FolderSearch, Plus, X } from "lucide-react";
import { Button } from "@mono/components";
import type { AddModPayload } from "./useMmmLogic";

interface ScanModsModalProps {
  isOpen: boolean;
  minecraftVersion: string;
  modloader: string;
  onClose: () => void;
  onImportMods: (mods: AddModPayload[]) => Promise<{ ok: boolean }>;
}

interface MatchedJar extends AddModPayload {
  original_filename: string;
  confidence: "high" | "medium";
}

export function ScanModsModal({
  isOpen,
  minecraftVersion,
  modloader,
  onClose,
  onImportMods,
}: ScanModsModalProps) {
  const [rawFilenames, setRawFilenames] = useState(
    "continuity-3.0.0+1.21.jar\nentityculling-fabric-1.7.0-mc1.21.jar\njade-fabric-15.1.8.jar"
  );
  const [scanning, setScanning] = useState(false);
  const [matched, setMatched] = useState<MatchedJar[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  if (!isOpen) return null;

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
      .map((f) => f.name)
      .filter((n) => n.endsWith(".jar"));
    if (files.length > 0) {
      setRawFilenames(files.join("\n"));
    }
  };

  const handleScan = async () => {
    const lines = rawFilenames
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    setScanning(true);
    try {
      const res = await fetch("/api/mmm/modrinth/match-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filenames: lines,
          minecraft_version: minecraftVersion,
          modloader,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          matched?: MatchedJar[];
          unmatched?: string[];
        };
        setMatched(data.matched ?? []);
        setUnmatched(data.unmatched ?? []);
      }
    } finally {
      setScanning(false);
    }
  };

  const handleImportAll = async () => {
    if (matched.length === 0) return;
    setImporting(true);
    const res = await onImportMods(matched);
    setImporting(false);
    if (res.ok) {
      setMatched([]);
      setUnmatched([]);
      onClose();
    }
  };

  return (
    <div className="mmm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Scan Mods Folder">
      <div className="mmm-modal-panel" style={{ maxWidth: "720px" }}>
        <div className="mmm-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FolderSearch size={18} /> Smart Mod Scanner
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Select `.jar` files from your local `mods/` folder or paste filenames to match Modrinth releases.
            </p>
          </div>
          <button type="button" className="mmm-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              padding: "0.65rem 0.9rem",
              borderRadius: "8px",
              border: "1px dashed var(--card-border)",
              background: "rgb(var(--foreground-rgb) / 3%)",
            }}
          >
            <input
              type="file"
              accept=".jar"
              multiple
              onChange={handleFileInput}
              style={{ fontSize: "0.8rem" }}
            />
          </label>

          <textarea
            className="mmm-input"
            rows={4}
            value={rawFilenames}
            onChange={(e) => setRawFilenames(e.target.value)}
            placeholder="Paste .jar filenames (one per line)..."
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Target: {modloader} {minecraftVersion}
            </span>
            <Button variant="primary" loading={scanning} onClick={() => void handleScan()}>
              Match Against Modrinth
            </Button>
          </div>

          {matched.length > 0 && (
            <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <strong style={{ fontSize: "0.9rem" }}>Matched ({matched.length})</strong>
                <Button size="sm" variant="primary" loading={importing} onClick={() => void handleImportAll()}>
                  <Plus size={14} /> Import All Matched
                </Button>
              </div>
              <div className="mmm-download-list">
                {matched.map((item) => (
                  <div key={item.original_filename} className="mmm-download-item">
                    <div>
                      <strong style={{ fontSize: "0.85rem" }}>{item.name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                        {item.original_filename} → v{item.version_number}
                      </div>
                    </div>
                    <span className="mmm-tag" style={{ fontSize: "0.7rem" }}>
                      {item.confidence} match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unmatched.length > 0 && (
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#fbbf24" }}>
              Unmatched files: {unmatched.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
