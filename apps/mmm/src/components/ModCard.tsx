"use client";

import { Download, ExternalLink, Package, Trash2 } from "lucide-react";
import { Tooltip } from "@mono/components";
import type { MmmMod } from "@/data/mmm-catalog";

interface ModCardProps {
  mod: MmmMod;
  viewMode: "grid" | "list";
  onRemove: (modId: string) => void;
}

export function ModCard({ mod, viewMode, onRemove }: ModCardProps) {
  const deps = mod.dependencies ?? [];

  if (viewMode === "list") {
    return (
      <article className="mmm-mod-card-list" data-testid={`mod-card-${mod.modrinth_slug || mod.id}`}>
        <div className="mmm-mod-list-left">
          {mod.icon_url ? (
            <img src={mod.icon_url} alt={mod.name} className="mmm-mod-icon-sm" />
          ) : (
            <div className="mmm-mod-icon-placeholder-sm">
              <Package size={20} />
            </div>
          )}
          <div className="mmm-mod-list-info">
            <div className="mmm-mod-name-list">
              <span>{mod.name}</span>
              <span className="mmm-mod-version-badge-sm">v{mod.version_number}</span>
              <span className="mmm-mod-author-sm">by {mod.author || "Modrinth"}</span>
            </div>
            <p className="mmm-mod-desc-list">{mod.summary || mod.filename}</p>
          </div>
        </div>

        <div className="mmm-mod-list-right">
          {deps.length > 0 && (
            <div className="mmm-mod-deps-list">
              <span className="mmm-dep-label-sm">Deps:</span>
              {deps.slice(0, 3).map((dep, idx) => (
                <span
                  key={`${dep.name}-${idx}`}
                  className={`mmm-dep-tag-sm ${dep.type === "optional" ? "optional" : "required"}`}
                >
                  {dep.name}
                </span>
              ))}
            </div>
          )}
          <div className="mmm-mod-actions">
            <Tooltip content={`Download ${mod.filename}`}>
              <a
                href={mod.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mmm-icon-btn"
                aria-label={`Download ${mod.name}`}
              >
                <Download size={15} />
              </a>
            </Tooltip>
            <Tooltip content="Remove from pack">
              <button
                type="button"
                className="mmm-icon-btn danger"
                onClick={() => onRemove(mod.id)}
                aria-label={`Remove ${mod.name}`}
              >
                <Trash2 size={15} />
              </button>
            </Tooltip>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="mmm-mod-card" data-testid={`mod-card-${mod.modrinth_slug || mod.id}`}>
      <div className="mmm-mod-header">
        {mod.icon_url ? (
          <img src={mod.icon_url} alt={mod.name} className="mmm-mod-icon" />
        ) : (
          <div className="mmm-mod-icon-placeholder">
            <Package size={22} />
          </div>
        )}
        <div className="mmm-mod-meta">
          <h3 className="mmm-mod-name">{mod.name}</h3>
          <div className="mmm-mod-author">
            by {mod.author || "Community"} · {mod.modloader} {mod.minecraft_version}
          </div>
        </div>
      </div>

      <p className="mmm-mod-desc">{mod.summary || mod.filename}</p>

      {deps.length > 0 && (
        <div className="mmm-mod-dependencies">
          <span className="mmm-dep-label">Dependencies</span>
          <div className="mmm-dep-tags">
            {deps.map((dep, idx) => (
              <span
                key={`${dep.name}-${idx}`}
                className={`mmm-dep-tag ${dep.type === "optional" ? "optional" : "required"}`}
              >
                {dep.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mmm-mod-footer">
        <div className="mmm-mod-badges">
          <span className="mmm-mod-version-badge">v{mod.version_number}</span>
        </div>
        <div className="mmm-mod-actions">
          {mod.modrinth_slug && (
            <Tooltip content="View on Modrinth">
              <a
                href={`https://modrinth.com/mod/${mod.modrinth_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mmm-icon-btn"
                aria-label={`Open ${mod.name} on Modrinth`}
              >
                <ExternalLink size={15} />
              </a>
            </Tooltip>
          )}
          <Tooltip content={`Download ${mod.filename}`}>
            <a
              href={mod.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mmm-icon-btn"
              aria-label={`Download ${mod.name}`}
            >
              <Download size={15} />
            </a>
          </Tooltip>
          <Tooltip content="Remove from pack">
            <button
              type="button"
              className="mmm-icon-btn danger"
              onClick={() => onRemove(mod.id)}
              aria-label={`Remove ${mod.name}`}
            >
              <Trash2 size={15} />
            </button>
          </Tooltip>
        </div>
      </div>
    </article>
  );
}
