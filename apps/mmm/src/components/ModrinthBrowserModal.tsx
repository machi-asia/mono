"use client";

import { useState, useCallback, useEffect } from "react";
import { Check, Download, Plus, Search, X } from "lucide-react";
import { Button } from "@mono/components";
import type { ModrinthSearchResult, MmmModDependency } from "@/data/mmm-catalog";
import type { AddModPayload } from "./useMmmLogic";

interface ModrinthBrowserModalProps {
  isOpen: boolean;
  minecraftVersion: string;
  modloader: string;
  installedModIds: string[];
  onClose: () => void;
  onAddMod: (mod: AddModPayload) => Promise<{ ok: boolean }>;
}

const FEATURED_FALLBACK: ModrinthSearchResult[] = [
  {
    project_id: "1IjD5062",
    slug: "continuity",
    title: "Continuity",
    description: "A Fabric mod that allows for efficient connected textures across blocks and glass.",
    categories: ["decoration", "fabric"],
    client_side: "required",
    server_side: "unsupported",
    icon_url: "https://cdn.modrinth.com/data/1IjD5062/icon.png",
    downloads: 18400000,
    follows: 12000,
    author: "PepperCode1",
    versions: ["1.21.1"],
  },
  {
    project_id: "NNAgCjsB",
    slug: "entityculling",
    title: "EntityCulling",
    description: "Using async path-tracing to hide Block/Entities that are not visible.",
    categories: ["optimization", "fabric"],
    client_side: "required",
    server_side: "unsupported",
    icon_url: "https://cdn.modrinth.com/data/NNAgCjsB/icon.png",
    downloads: 42100000,
    follows: 29000,
    author: "tr7zw",
    versions: ["1.21.1"],
  },
  {
    project_id: "9s6osm5g",
    slug: "cloth-config",
    title: "Cloth Config API",
    description: "Configuration Screen API for Minecraft mods.",
    categories: ["library", "fabric"],
    client_side: "required",
    server_side: "optional",
    icon_url: "https://cdn.modrinth.com/data/9s6osm5g/icon.png",
    downloads: 95000000,
    follows: 14500,
    author: "shedaniel",
    versions: ["1.21.1"],
  },
];

export function ModrinthBrowserModal({
  isOpen,
  minecraftVersion,
  modloader,
  installedModIds,
  onClose,
  onAddMod,
}: ModrinthBrowserModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ModrinthSearchResult[]>(FEATURED_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const runSearch = useCallback(
    async (searchTerm: string) => {
      setLoading(true);
      try {
        const url = new URL("/api/mmm/modrinth/search", window.location.origin);
        url.searchParams.set("query", searchTerm);
        url.searchParams.set("version", minecraftVersion);
        url.searchParams.set("loader", modloader);
        url.searchParams.set("limit", "12");
        const res = await fetch(url.toString());
        if (res.ok) {
          const data = (await res.json()) as { hits?: ModrinthSearchResult[] };
          if (Array.isArray(data.hits) && data.hits.length > 0) {
            setResults(data.hits);
            return;
          }
        }
        setResults(FEATURED_FALLBACK);
      } catch {
        setResults(FEATURED_FALLBACK);
      } finally {
        setLoading(false);
      }
    },
    [minecraftVersion, modloader]
  );

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const loadInitial = async () => {
      if (!mounted) return;
      await runSearch("");
    };
    void loadInitial();
    return () => {
      mounted = false;
    };
  }, [isOpen, runSearch]);

  if (!isOpen) return null;

  const handleInstall = async (hit: ModrinthSearchResult) => {
    setAddingId(hit.project_id);
    try {
      let versionNumber = "1.0.0";
      let downloadUrl = `https://modrinth.com/mod/${hit.slug}`;
      let filename = `${hit.slug}-${modloader}-${minecraftVersion}.jar`;
      let dependencies: MmmModDependency[] = [];

      try {
        const vUrl = new URL("/api/mmm/modrinth/search", window.location.origin);
        vUrl.searchParams.set("projectId", hit.project_id);
        vUrl.searchParams.set("version", minecraftVersion);
        vUrl.searchParams.set("loader", modloader);
        const vRes = await fetch(vUrl.toString());
        if (vRes.ok) {
          const vJson = (await vRes.json()) as {
            versions?: Array<{
              version_number: string;
              download_url: string;
              filename: string;
              dependencies?: MmmModDependency[];
            }>;
          };
          const latest = vJson.versions?.[0];
          if (latest) {
            versionNumber = latest.version_number;
            if (latest.download_url) downloadUrl = latest.download_url;
            if (latest.filename) filename = latest.filename;
            if (latest.dependencies) dependencies = latest.dependencies;
          }
        }
      } catch {
        // Fallback to direct project metadata
      }

      await onAddMod({
        modrinth_id: hit.project_id,
        modrinth_slug: hit.slug,
        name: hit.title,
        summary: hit.description,
        icon_url: hit.icon_url,
        author: hit.author,
        download_url: downloadUrl,
        filename,
        version_number: versionNumber,
        minecraft_version: minecraftVersion,
        modloader,
        dependencies,
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="mmm-modal-backdrop" role="dialog" aria-modal="true" aria-label="Browse Modrinth Catalog">
      <div className="mmm-modal-panel" style={{ maxWidth: "780px" }}>
        <div className="mmm-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
              Modrinth Catalog ({modloader} · {minecraftVersion})
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
              Search verified Modrinth builds compatible with your pack&apos;s loader and version.
            </p>
          </div>
          <button type="button" className="mmm-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch(query);
          }}
          style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}
        >
          <div className="mmm-search-box" style={{ flex: 1, minWidth: 0 }}>
            <Search size={16} className="mmm-search-icon" />
            <input
              type="text"
              className="mmm-input"
              placeholder="Search mods (e.g. Create, Distant Horizons, Jade)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" loading={loading}>
            Search
          </Button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "52vh", overflowY: "auto" }}>
          {results.map((hit) => {
            const installed = installedModIds.includes(hit.project_id);
            return (
              <div
                key={hit.project_id}
                className="mmm-card"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0.85rem 1rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
                  {hit.icon_url ? (
                    <img src={hit.icon_url} alt={hit.title} className="mmm-mod-icon-sm" />
                  ) : (
                    <div className="mmm-mod-icon-placeholder-sm">M</div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.95rem" }}>{hit.title}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>by {hit.author}</span>
                    </div>
                    <p
                      style={{
                        margin: "0.2rem 0 0",
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "460px",
                      }}
                    >
                      {hit.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Download size={12} /> {(hit.downloads / 1_000_000).toFixed(1)}M
                  </span>
                  <Button
                    size="sm"
                    variant={installed ? "secondary" : "primary"}
                    disabled={installed}
                    loading={addingId === hit.project_id}
                    onClick={() => void handleInstall(hit)}
                  >
                    {installed ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
