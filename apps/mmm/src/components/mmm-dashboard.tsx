"use client";

import { useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpZA,
  Boxes,
  Check,
  Copy,
  Download,
  FolderSearch,
  GitBranch,
  History,
  LayoutGrid,
  List,
  PackagePlus,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { AuthNavbar, SignInModal } from "@mono/auth";
import { Button } from "@mono/components";
import { useMmmLogic, type SortField } from "./useMmmLogic";
import { ModCard } from "./ModCard";
import { ModHistoryTimeline } from "./ModHistoryTimeline";
import { CreateOrgModal } from "./CreateOrgModal";
import { ModrinthBrowserModal } from "./ModrinthBrowserModal";
import { ScanModsModal } from "./ScanModsModal";
import { UploadModModal } from "./UploadModModal";
import { BulkDownloadModal } from "./BulkDownloadModal";
import { OrphanedDependencyModal } from "./OrphanedDependencyModal";

export function MmmDashboard() {
  const {
    user,
    organizations,
    activeOrg,
    mods,
    filteredMods,
    history,
    isUsingDemo,
    loadingDetails,
    statusMessage,
    errorMessage,
    setStatusMessage,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortCriteria,
    setSortCriteria,
    missingDependencies,
    selectOrganization,
    createOrganization,
    joinByInviteCode,
    addModToList,
    removeModFromList,
  } = useMmmLogic();

  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showModrinth, setShowModrinth] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDepModal, setShowDepModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyInvite = async () => {
    if (!activeOrg?.invite_code) return;
    try {
      await navigator.clipboard.writeText(activeOrg.invite_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setStatusMessage(`Invite code: ${activeOrg.invite_code}`);
    }
  };

  const toggleSort = (field: SortField) => {
    setSortCriteria((prev) => {
      const existing = prev[0];
      if (existing && existing.key === field) {
        return [{ key: field, dir: existing.dir === "asc" ? "desc" : "asc" }];
      }
      return [{ key: field, dir: field === "added_at" ? "desc" : "asc" }];
    });
  };

  const activeSort = sortCriteria[0];

  return (
    <div className="mmm-body">
      <AuthNavbar
        brand={
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", fontWeight: 800 }}>
            <Boxes size={20} style={{ color: "var(--accent-light)" }} />
            <span>MMM</span>
            <span className="mmm-tag" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
              Minecraft Mod Manager
            </span>
          </span>
        }
        links={[
          { label: "Machi Hub", href: "https://machi.asia" },
          { label: "Modrinth", href: "https://modrinth.com" },
        ]}
        actions={
          !user ? (
            <Button size="sm" variant="secondary" onClick={() => setShowSignIn(true)}>
              Sign In to Cloud Sync
            </Button>
          ) : undefined
        }
      />

      <main className="mmm-shell-main">
        <div className="mmm-container">
          {isUsingDemo && (
            <div className="mmm-invite-banner" style={{ justifyContent: "space-between", background: "rgb(16 185 129 / 10%)", borderColor: "rgb(16 185 129 / 35%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <Sparkles size={16} style={{ color: "var(--accent-light)" }} />
                <span style={{ fontSize: "0.88rem" }}>
                  <strong>Interactive Preview Mode:</strong> Exploring <em>{activeOrg?.name}</em>.{" "}
                  {user
                    ? "Create your first cloud organization to persist changes to Supabase."
                    : "Test adding mods or scanning folders live — sign in anytime to sync across teammates."}
                </span>
              </div>
              <Button size="sm" variant="primary" onClick={() => setShowCreateOrg(true)}>
                <Plus size={14} /> New Organization
              </Button>
            </div>
          )}

          {(statusMessage || errorMessage) && (
            <div
              className="mmm-invite-banner"
              style={{
                background: errorMessage ? "rgb(239 68 68 / 12%)" : "rgb(16 185 129 / 12%)",
                borderColor: errorMessage ? "rgb(239 68 68 / 40%)" : "rgb(16 185 129 / 40%)",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>{errorMessage || statusMessage}</span>
              <button
                type="button"
                className="mmm-icon-btn"
                onClick={() => setStatusMessage(null)}
                aria-label="Dismiss status"
              >
                ×
              </button>
            </div>
          )}

          <section className="mmm-card mmm-header-card">
            <div className="mmm-header-top">
              <div className="mmm-title-area">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <h1 style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {activeOrg?.name ?? "Minecraft Mod Manager"}
                  </h1>
                  {organizations.length > 1 && (
                    <select
                      aria-label="Select organization"
                      className="mmm-sort-select"
                      value={activeOrg?.id ?? ""}
                      onChange={(e) => void selectOrganization(e.target.value)}
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.modloader} {org.minecraft_version})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem", maxWidth: "66ch" }}>
                  {activeOrg?.description ||
                    "Collaborative Minecraft modpack registry, dependency verifier, and Modrinth sync engine."}
                </p>

                <div className="mmm-badge-row">
                  <span className="mmm-tag">MC {activeOrg?.minecraft_version ?? "1.21.1"}</span>
                  <span className="mmm-tag" style={{ textTransform: "capitalize" }}>
                    {activeOrg?.modloader ?? "fabric"}
                  </span>
                  <span className="mmm-tag">{mods.length} Mods</span>
                  {activeOrg?.invite_code && (
                    <button
                      type="button"
                      className="mmm-tag"
                      onClick={() => void handleCopyInvite()}
                      style={{ cursor: "pointer" }}
                      title="Copy invite code"
                    >
                      {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                      Invite: {activeOrg.invite_code}
                    </button>
                  )}
                </div>
              </div>

              <div className="mmm-actions-row">
                <Button variant="primary" onClick={() => setShowModrinth(true)}>
                  <PackagePlus size={16} /> Browse Modrinth
                </Button>
                <Button variant="secondary" onClick={() => setShowScanModal(true)}>
                  <FolderSearch size={16} /> Scan Mods
                </Button>
                <Button variant="secondary" onClick={() => setShowUploadModal(true)}>
                  <Upload size={16} /> Custom URL
                </Button>
                <Button variant="secondary" onClick={() => setShowBulkModal(true)}>
                  <Download size={16} /> Export Pack
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDepModal(true)}
                  aria-label="Audit dependencies"
                >
                  <ShieldAlert size={16} />
                  {missingDependencies.length > 0
                    ? `${missingDependencies.length} Missing Deps`
                    : "Deps OK"}
                </Button>
              </div>
            </div>
          </section>

          <nav className="mmm-tabs-bar" aria-label="Modpack sections">
            <button
              type="button"
              className={`mmm-tab-btn ${activeTab === "mods" ? "active" : ""}`}
              onClick={() => setActiveTab("mods")}
            >
              <Boxes size={16} /> Mods ({mods.length})
            </button>
            <button
              type="button"
              className={`mmm-tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <History size={16} /> Changelog ({history.length})
            </button>
            <button
              type="button"
              className={`mmm-tab-btn ${activeTab === "members" ? "active" : ""}`}
              onClick={() => setActiveTab("members")}
            >
              <Users size={16} /> Team & Join Code
            </button>
          </nav>

          {activeTab === "mods" && (
            <>
              <div className="mmm-controls-bar">
                <div className="mmm-search-box">
                  <Search size={16} className="mmm-search-icon" />
                  <input
                    type="text"
                    className="mmm-input"
                    placeholder="Filter mods by name, author, or filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mmm-controls-buttons">
                  <div className="mmm-sort-chips">
                    <span className="mmm-sort-label">Sort:</span>
                    {(["added_at", "name", "author"] as SortField[]).map((field) => {
                      const active = activeSort?.key === field;
                      return (
                        <button
                          key={field}
                          type="button"
                          className="mmm-sort-chip"
                          style={{
                            borderColor: active ? "var(--accent)" : undefined,
                            color: active ? "var(--accent-light)" : undefined,
                          }}
                          onClick={() => toggleSort(field)}
                        >
                          {field === "added_at" ? "Recent" : field === "name" ? "Name" : "Author"}
                          {active &&
                            (activeSort.dir === "asc" ? (
                              <ArrowDownAZ size={13} />
                            ) : (
                              <ArrowUpZA size={13} />
                            ))}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mmm-view-toggle" role="group" aria-label="View layout">
                    <button
                      type="button"
                      className={`mmm-view-btn ${viewMode === "grid" ? "active" : ""}`}
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      type="button"
                      className={`mmm-view-btn ${viewMode === "list" ? "active" : ""}`}
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {loadingDetails ? (
                <div className="mmm-card" style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
                  Loading modpack catalog...
                </div>
              ) : filteredMods.length === 0 ? (
                <div className="mmm-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                  <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
                    No mods matched your filter. Add builds from Modrinth or scan your mods folder.
                  </p>
                  <Button variant="primary" onClick={() => setShowModrinth(true)}>
                    <PackagePlus size={16} /> Browse Modrinth
                  </Button>
                </div>
              ) : (
                <div className={viewMode === "list" ? "mmm-mods-list" : "mmm-mods-grid"}>
                  {filteredMods.map((mod) => (
                    <ModCard
                      key={mod.id}
                      mod={mod}
                      viewMode={viewMode}
                      onRemove={(id) => void removeModFromList(id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "history" && <ModHistoryTimeline history={history} />}

          {activeTab === "members" && (
            <section className="mmm-card" style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div>
                <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <GitBranch size={17} /> Share Modpack Invite
                </h2>
                <p style={{ margin: "0 0 0.85rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                  Share this organization code with teammates so everyone stays pinned to {activeOrg?.modloader} {activeOrg?.minecraft_version}.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <code
                    style={{
                      padding: "0.55rem 0.9rem",
                      borderRadius: "8px",
                      border: "1px solid var(--card-border)",
                      background: "rgb(var(--foreground-rgb) / 4%)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {activeOrg?.invite_code || "NEXUS-2026"}
                  </code>
                  <Button size="sm" variant="secondary" onClick={() => void handleCopyInvite()}>
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div>
                <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700 }}>
                  Join Another Modpack
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inviteInput.trim()) void joinByInviteCode(inviteInput);
                  }}
                  style={{ display: "flex", gap: "0.6rem" }}
                >
                  <input
                    type="text"
                    className="mmm-input"
                    placeholder="Enter invite code (e.g. NEXUS-2026)"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    Join
                  </Button>
                </form>
              </div>
            </section>
          )}
        </div>
      </main>

      <CreateOrgModal
        isOpen={showCreateOrg}
        onClose={() => setShowCreateOrg(false)}
        onCreate={createOrganization}
      />
      <ModrinthBrowserModal
        isOpen={showModrinth}
        minecraftVersion={activeOrg?.minecraft_version ?? "1.21.1"}
        modloader={activeOrg?.modloader ?? "fabric"}
        installedModIds={mods.map((m) => m.modrinth_id)}
        onClose={() => setShowModrinth(false)}
        onAddMod={addModToList}
      />
      <ScanModsModal
        isOpen={showScanModal}
        minecraftVersion={activeOrg?.minecraft_version ?? "1.21.1"}
        modloader={activeOrg?.modloader ?? "fabric"}
        onClose={() => setShowScanModal(false)}
        onImportMods={addModToList}
      />
      <UploadModModal
        isOpen={showUploadModal}
        minecraftVersion={activeOrg?.minecraft_version ?? "1.21.1"}
        modloader={activeOrg?.modloader ?? "fabric"}
        onClose={() => setShowUploadModal(false)}
        onAddMod={addModToList}
      />
      <BulkDownloadModal
        isOpen={showBulkModal}
        organization={activeOrg}
        mods={mods}
        onClose={() => setShowBulkModal(false)}
      />
      <OrphanedDependencyModal
        isOpen={showDepModal}
        missingDependencies={missingDependencies}
        onClose={() => setShowDepModal(false)}
      />
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          title="Sign in to MMM"
          subtitle="Sync your Minecraft modpacks across your SMP group with Supabase."
        />
      )}
    </div>
  );
}
