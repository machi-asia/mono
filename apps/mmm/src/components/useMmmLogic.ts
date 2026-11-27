"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@mono/auth";
import {
  DEMO_MMM_HISTORY,
  DEMO_MMM_MODS,
  DEMO_MMM_ORG,
  type MinecraftModLoader,
  type MmmMod,
  type MmmModHistory,
  type MmmModList,
  type MmmOrganization,
} from "@/data/mmm-catalog";

export type SortField = "name" | "added_at" | "author";
export type SortDirection = "asc" | "desc";

export interface SortCriterion {
  key: SortField;
  dir: SortDirection;
}

export interface AddModPayload {
  modrinth_id: string;
  modrinth_slug?: string;
  name: string;
  summary?: string;
  icon_url?: string;
  author?: string;
  download_url: string;
  filename: string;
  version_number: string;
  minecraft_version?: string;
  modloader?: string;
  dependencies?: MmmMod["dependencies"];
}

export interface CreateOrgPayload {
  name: string;
  description: string;
  minecraft_version: string;
  modloader: MinecraftModLoader;
}

const DEMO_MOD_LIST: MmmModList = {
  id: "demo-list-main",
  organization_id: DEMO_MMM_ORG.id,
  name: "Main Modpack",
  description: "Curated Fabric 1.21.1 optimization, shader, and utility stack",
  is_default: true,
  created_at: "2026-11-10T08:00:00Z",
  updated_at: "2026-11-21T08:00:00Z",
};

export function useMmmLogic() {
  const { user, isLoading: authLoading } = useAuth();

  const [organizations, setOrganizations] = useState<MmmOrganization[]>([DEMO_MMM_ORG]);
  const [activeOrgId, setActiveOrgId] = useState<string>(DEMO_MMM_ORG.id);
  const [modLists, setModLists] = useState<MmmModList[]>([DEMO_MOD_LIST]);
  const [mods, setMods] = useState<MmmMod[]>(DEMO_MMM_MODS);
  const [history, setHistory] = useState<MmmModHistory[]>(DEMO_MMM_HISTORY);
  const [isUsingDemo, setIsUsingDemo] = useState<boolean>(true);
  const [loadingOrgs, setLoadingOrgs] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"mods" | "history" | "members">("mods");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([
    { key: "added_at", dir: "desc" },
  ]);

  const activeOrg = useMemo(
    () => organizations.find((o) => o.id === activeOrgId) ?? organizations[0] ?? null,
    [organizations, activeOrgId]
  );

  const activeModList = useMemo(
    () =>
      modLists.find((l) => l.organization_id === activeOrg?.id && l.is_default) ??
      modLists.find((l) => l.organization_id === activeOrg?.id) ??
      modLists[0] ??
      null,
    [modLists, activeOrg]
  );

  const loadOrganizationDetails = useCallback(async (orgId: string) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/mmm/organizations/${encodeURIComponent(orgId)}`);
      if (!res.ok) return;
      const payload = (await res.json()) as {
        modLists?: MmmModList[];
        mods?: MmmMod[];
      };
      if (payload.modLists) {
        setModLists(payload.modLists);
      }
      if (payload.mods) {
        setMods(payload.mods);
      }
      const defaultList = payload.modLists?.[0];
      if (defaultList) {
        const histRes = await fetch(
          `/api/mmm/mod-lists/${encodeURIComponent(defaultList.id)}/history`
        );
        if (histRes.ok) {
          const histData = (await histRes.json()) as { history?: MmmModHistory[] };
          setHistory(histData.history ?? []);
        }
      }
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const refreshOrganizations = useCallback(async () => {
    if (!user) {
      setOrganizations([DEMO_MMM_ORG]);
      setActiveOrgId(DEMO_MMM_ORG.id);
      setModLists([DEMO_MOD_LIST]);
      setMods(DEMO_MMM_MODS);
      setHistory(DEMO_MMM_HISTORY);
      setIsUsingDemo(true);
      return;
    }

    setLoadingOrgs(true);
    try {
      const res = await fetch("/api/mmm/organizations");
      if (!res.ok) {
        return;
      }
      const data = (await res.json()) as { organizations?: MmmOrganization[] };
      const cloudOrgs = data.organizations ?? [];
      if (cloudOrgs.length > 0) {
        setOrganizations(cloudOrgs);
        setIsUsingDemo(false);
        const firstId = cloudOrgs[0]?.id;
        if (firstId) {
          setActiveOrgId(firstId);
          await loadOrganizationDetails(firstId);
        }
      } else {
        setOrganizations([DEMO_MMM_ORG]);
        setActiveOrgId(DEMO_MMM_ORG.id);
        setModLists([DEMO_MOD_LIST]);
        setMods(DEMO_MMM_MODS);
        setHistory(DEMO_MMM_HISTORY);
        setIsUsingDemo(true);
      }
    } finally {
      setLoadingOrgs(false);
    }
  }, [user, loadOrganizationDetails]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    const sync = async () => {
      if (!active) return;
      await refreshOrganizations();
    };
    void sync();
    return () => {
      active = false;
    };
  }, [authLoading, refreshOrganizations]);

  const selectOrganization = useCallback(
    async (orgId: string) => {
      setActiveOrgId(orgId);
      if (!isUsingDemo) {
        await loadOrganizationDetails(orgId);
      }
    },
    [isUsingDemo, loadOrganizationDetails]
  );

  const createOrganization = useCallback(
    async (payload: CreateOrgPayload) => {
      setErrorMessage(null);
      if (!user) {
        const created: MmmOrganization = {
          id: `demo-${Date.now()}`,
          name: payload.name,
          slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: payload.description,
          invite_code: `SMP-${Math.floor(1000 + Math.random() * 9000)}`,
          minecraft_version: payload.minecraft_version,
          modloader: payload.modloader,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const createdList: MmmModList = {
          id: `demo-list-${Date.now()}`,
          organization_id: created.id,
          name: "Main Modpack",
          description: `Local sandbox pack (${payload.modloader} ${payload.minecraft_version})`,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setOrganizations((prev) => [created, ...prev]);
        setModLists((prev) => [createdList, ...prev]);
        setActiveOrgId(created.id);
        setMods([]);
        setHistory([]);
        setStatusMessage(`Created "${created.name}" in preview sandbox.`);
        return { ok: true, organization: created };
      }

      const res = await fetch("/api/mmm/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        organization?: MmmOrganization;
        modList?: MmmModList;
        error?: string;
      };
      if (!res.ok || !json.organization) {
        const msg = json.error ?? "Failed to create organization";
        setErrorMessage(msg);
        return { ok: false, error: msg };
      }

      setIsUsingDemo(false);
      setOrganizations((prev) => {
        const withoutDemo = prev.filter((o) => !o.id.startsWith("demo-"));
        return [json.organization!, ...withoutDemo];
      });
      if (json.modList) {
        setModLists([json.modList]);
      }
      setActiveOrgId(json.organization.id);
      setMods([]);
      setHistory([]);
      setStatusMessage(`Created "${json.organization.name}" and synced to cloud.`);
      return { ok: true, organization: json.organization };
    },
    [user]
  );

  const joinByInviteCode = useCallback(
    async (inviteCode: string) => {
      setErrorMessage(null);
      if (!user) {
        setErrorMessage("Please sign in to join a cloud modpack organization.");
        return { ok: false, error: "Sign in required" };
      }
      const res = await fetch("/api/mmm/organizations/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: inviteCode }),
      });
      const json = (await res.json()) as {
        organization?: MmmOrganization;
        error?: string;
      };
      if (!res.ok || !json.organization) {
        const msg = json.error ?? "Invalid invite code";
        setErrorMessage(msg);
        return { ok: false, error: msg };
      }
      await refreshOrganizations();
      await selectOrganization(json.organization.id);
      setStatusMessage(`Joined ${json.organization.name}!`);
      return { ok: true, organization: json.organization };
    },
    [user, refreshOrganizations, selectOrganization]
  );

  const addModToList = useCallback(
    async (mod: AddModPayload | AddModPayload[]) => {
      setErrorMessage(null);
      const list = Array.isArray(mod) ? mod : [mod];
      if (!activeModList) return { ok: false };

      if (isUsingDemo || !user) {
        const now = new Date().toISOString();
        const inserted: MmmMod[] = list.map((item, idx) => ({
          id: `demo-mod-${Date.now()}-${idx}`,
          mod_list_id: activeModList.id,
          modrinth_id: item.modrinth_id,
          modrinth_slug: item.modrinth_slug ?? "",
          name: item.name,
          summary: item.summary ?? "",
          icon_url: item.icon_url ?? "",
          author: item.author ?? "Community",
          download_url: item.download_url,
          filename: item.filename,
          version_number: item.version_number,
          minecraft_version: item.minecraft_version ?? activeOrg?.minecraft_version ?? "1.21.1",
          modloader: item.modloader ?? activeOrg?.modloader ?? "fabric",
          dependencies: item.dependencies ?? [],
          added_at: now,
        }));
        const entries: MmmModHistory[] = inserted.map((m, idx) => ({
          id: `hist-${Date.now()}-${idx}`,
          mod_list_id: activeModList.id,
          action: "add",
          mod_name: m.name,
          modrinth_id: m.modrinth_id,
          new_version: m.version_number,
          message: `Added ${m.name} (${m.version_number})`,
          created_at: now,
        }));
        setMods((prev) => [...inserted, ...prev]);
        setHistory((prev) => [...entries, ...prev]);
        setStatusMessage(`Added ${inserted.length} mod(s) to preview pack.`);
        return { ok: true };
      }

      const res = await fetch(
        `/api/mmm/mod-lists/${encodeURIComponent(activeModList.id)}/mods`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mods: list }),
        }
      );
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setErrorMessage(err.error ?? "Failed to add mod");
        return { ok: false };
      }
      if (activeOrg) {
        await loadOrganizationDetails(activeOrg.id);
      }
      setStatusMessage(`Added ${list.length} mod(s) to ${activeOrg?.name ?? "pack"}.`);
      return { ok: true };
    },
    [activeModList, activeOrg, isUsingDemo, loadOrganizationDetails, user]
  );

  const removeModFromList = useCallback(
    async (modId: string) => {
      setErrorMessage(null);
      if (!activeModList) return;
      const target = mods.find((m) => m.id === modId);
      if (!target) return;

      if (isUsingDemo || !user) {
        setMods((prev) => prev.filter((m) => m.id !== modId));
        setHistory((prev) => [
          {
            id: `hist-${Date.now()}`,
            mod_list_id: activeModList.id,
            action: "remove",
            mod_name: target.name,
            modrinth_id: target.modrinth_id,
            previous_version: target.version_number,
            message: `Removed ${target.name} (${target.version_number})`,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setStatusMessage(`Removed ${target.name}.`);
        return;
      }

      const res = await fetch(
        `/api/mmm/mod-lists/${encodeURIComponent(activeModList.id)}/mods?modId=${encodeURIComponent(modId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        setErrorMessage("Failed to remove mod");
        return;
      }
      if (activeOrg) {
        await loadOrganizationDetails(activeOrg.id);
      }
      setStatusMessage(`Removed ${target.name}.`);
    },
    [activeModList, activeOrg, isUsingDemo, loadOrganizationDetails, mods, user]
  );

  const filteredMods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? mods.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.summary.toLowerCase().includes(q) ||
            m.author.toLowerCase().includes(q) ||
            m.filename.toLowerCase().includes(q)
        )
      : [...mods];

    filtered.sort((a, b) => {
      for (const criterion of sortCriteria) {
        const mult = criterion.dir === "asc" ? 1 : -1;
        let cmp = 0;
        if (criterion.key === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (criterion.key === "author") {
          cmp = a.author.localeCompare(b.author);
        } else {
          cmp = new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
        }
        if (cmp !== 0) return cmp * mult;
      }
      return 0;
    });

    return filtered;
  }, [mods, searchQuery, sortCriteria]);

  const missingDependencies = useMemo(() => {
    const installedNames = new Set(mods.map((m) => m.name.toLowerCase()));
    const installedIds = new Set(mods.map((m) => m.modrinth_id));
    const missing: Array<{ modName: string; depId?: string; depName: string }> = [];

    for (const mod of mods) {
      for (const dep of mod.dependencies ?? []) {
        if (dep.type && dep.type !== "required") continue;
        const matched =
          (dep.id && installedIds.has(dep.id)) ||
          installedNames.has(dep.name.toLowerCase());
        if (!matched) {
          missing.push({ modName: mod.name, depId: dep.id, depName: dep.name });
        }
      }
    }
    return missing;
  }, [mods]);

  return {
    user,
    authLoading,
    organizations,
    activeOrg,
    activeModList,
    mods,
    filteredMods,
    history,
    isUsingDemo,
    loadingOrgs,
    loadingDetails,
    statusMessage,
    errorMessage,
    setStatusMessage,
    setErrorMessage,
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
    refreshOrganizations,
    createOrganization,
    joinByInviteCode,
    addModToList,
    removeModFromList,
  };
}
