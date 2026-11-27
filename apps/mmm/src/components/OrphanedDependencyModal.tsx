"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@mono/components";

interface MissingDependencyItem {
  modName: string;
  depId?: string;
  depName: string;
}

interface OrphanedDependencyModalProps {
  isOpen: boolean;
  missingDependencies: MissingDependencyItem[];
  onClose: () => void;
}

export function OrphanedDependencyModal({
  isOpen,
  missingDependencies,
  onClose,
}: OrphanedDependencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="mmm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Dependency Check">
      <div className="mmm-modal-panel" style={{ maxWidth: "560px" }}>
        <div className="mmm-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={18} style={{ color: "#fbbf24" }} /> Dependency Audit
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Checks required runtime libraries across every mod in your active pack.
            </p>
          </div>
          <button type="button" className="mmm-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {missingDependencies.length === 0 ? (
          <div className="mmm-card" style={{ borderColor: "rgb(16 185 129 / 40%)", background: "rgb(16 185 129 / 8%)" }}>
            <strong style={{ color: "#34d399" }}>All required dependencies are satisfied!</strong>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Zero missing required runtime libraries detected in this modpack.
            </p>
          </div>
        ) : (
          <div className="mmm-download-list">
            {missingDependencies.map((item, idx) => (
              <div key={`${item.modName}-${item.depName}-${idx}`} className="mmm-download-item">
                <div>
                  <strong style={{ fontSize: "0.88rem" }}>{item.depName}</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    Required by {item.modName}
                  </div>
                </div>
                <span className="mmm-dep-tag required">Missing Required</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
