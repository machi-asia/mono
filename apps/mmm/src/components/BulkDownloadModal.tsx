"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileCode2, X } from "lucide-react";
import { Button } from "@mono/components";
import type { MmmMod, MmmOrganization } from "@/data/mmm-catalog";

interface BulkDownloadModalProps {
  isOpen: boolean;
  organization: MmmOrganization | null;
  mods: MmmMod[];
  onClose: () => void;
}

export function BulkDownloadModal({
  isOpen,
  organization,
  mods,
  onClose,
}: BulkDownloadModalProps) {
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const exportManifestJson = () => {
    const manifest = {
      formatVersion: 1,
      game: "minecraft",
      name: organization?.name ?? "MMM Modpack",
      versionId: `${organization?.minecraft_version ?? "1.21.1"}-${organization?.modloader ?? "fabric"}`,
      dependencies: {
        minecraft: organization?.minecraft_version ?? "1.21.1",
        loader: organization?.modloader ?? "fabric",
      },
      files: mods.map((m) => ({
        path: `mods/${m.filename}`,
        downloads: [m.download_url],
        modrinthId: m.modrinth_id,
        version: m.version_number,
      })),
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${organization?.slug || "mmm-modpack"}.modrinth.index.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mmm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Bulk Download Modpack">
      <div className="mmm-modal-panel">
        <div className="mmm-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Download size={18} /> Export & Download Modpack
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Download individual `.jar` builds or export a Modrinth index manifest for all {mods.length} mods.
            </p>
          </div>
          <button type="button" className="mmm-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="mmm-download-list">
          {mods.map((mod) => {
            const done = downloadedIds.includes(mod.id);
            return (
              <div key={mod.id} className="mmm-download-item">
                <div>
                  <strong style={{ fontSize: "0.88rem" }}>{mod.name}</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    {mod.filename} · v{mod.version_number}
                  </div>
                </div>
                <a
                  href={mod.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    setDownloadedIds((prev) => (prev.includes(mod.id) ? prev : [...prev, mod.id]))
                  }
                  className={done ? "mmm-download-status-done" : "mmm-download-status-active"}
                  style={{ fontSize: "0.8rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                >
                  {done ? <CheckCircle2 size={14} /> : <Download size={14} />}
                  {done ? "Opened" : "Download"}
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={exportManifestJson}>
            <FileCode2 size={15} /> Export Manifest JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
