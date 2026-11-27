"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@mono/components";
import {
  MINECRAFT_VERSIONS,
  MOD_LOADERS,
  type MinecraftModLoader,
} from "@/data/mmm-catalog";
import type { CreateOrgPayload } from "./useMmmLogic";

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateOrgPayload) => Promise<{ ok: boolean; error?: string }>;
}

export function CreateOrgModal({ isOpen, onClose, onCreate }: CreateOrgModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minecraftVersion, setMinecraftVersion] = useState("1.21.1");
  const [modloader, setModloader] = useState<MinecraftModLoader>("fabric");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Organization name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await onCreate({
      name: name.trim(),
      description: description.trim(),
      minecraft_version: minecraftVersion,
      modloader,
    });
    setSubmitting(false);
    if (res.ok) {
      setName("");
      setDescription("");
      onClose();
    } else {
      setError(res.error ?? "Unable to create organization.");
    }
  };

  return (
    <div className="mmm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Create Modpack Organization">
      <div className="mmm-modal-panel">
        <div className="mmm-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
              New Modpack Organization
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Create a synchronized Minecraft server/client pack workspace with a shareable invite code.
            </p>
          </div>
          <button type="button" className="mmm-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="org-name" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.35rem" }}>
              Organization Name
            </label>
            <input
              id="org-name"
              type="text"
              className="mmm-input"
              placeholder="e.g. Create SMP Season 4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label htmlFor="org-version" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Minecraft Version
              </label>
              <select
                id="org-version"
                className="mmm-input"
                value={minecraftVersion}
                onChange={(e) => setMinecraftVersion(e.target.value)}
              >
                {MINECRAFT_VERSIONS.map((v) => (
                  <option key={v.version} value={v.version}>
                    {v.version} {v.isLTS ? "(Popular)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="org-loader" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Modloader
              </label>
              <select
                id="org-loader"
                className="mmm-input"
                value={modloader}
                onChange={(e) => setModloader(e.target.value as MinecraftModLoader)}
              >
                {MOD_LOADERS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="org-desc" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.35rem" }}>
              Pack Description
            </label>
            <textarea
              id="org-desc"
              className="mmm-input"
              rows={3}
              placeholder="Describe the mods, shaders, or server goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#f87171" }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create Modpack
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
