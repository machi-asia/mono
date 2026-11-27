import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createServiceClient, type Json, type MinecraftModLoader } from "@mono/database";
import { createClient } from "@mono/database/server";

export interface MmmModDependency {
  id?: string;
  name: string;
  type?: "required" | "optional" | "incompatible";
}

interface RawModrinthDependency {
  project_id?: string;
  version_id?: string;
  file_name?: string;
  dependency_type?: "required" | "optional" | "incompatible";
}

interface RawModrinthProject {
  id?: string;
  title?: string;
  name?: string;
  slug?: string;
}

interface ModrinthVersionFile {
  url: string;
  filename: string;
  primary?: boolean;
}

interface ModrinthVersion {
  id: string;
  version_number: string;
  date_published?: string;
  files?: ModrinthVersionFile[];
  dependencies?: RawModrinthDependency[];
}

interface RawSearchHit {
  project_id: string;
  slug: string;
  title: string;
  description: string;
  icon_url?: string;
  author?: string;
}

interface IncomingModPayload {
  modrinth_id: string;
  modrinth_slug?: string;
  name: string;
  summary?: string;
  icon_url?: string;
  author?: string;
  download_url: string;
  filename: string;
  version_number?: string;
  minecraft_version?: string;
  modloader?: string;
  dependencies?: MmmModDependency[];
}

const VALID_LOADERS = new Set<MinecraftModLoader>(["fabric", "forge", "neoforge", "quilt"]);

function normalizeLoader(input?: string): MinecraftModLoader {
  return input && VALID_LOADERS.has(input as MinecraftModLoader)
    ? (input as MinecraftModLoader)
    : "fabric";
}

function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 36);
  const suffix = randomBytes(2).toString("hex");
  return `${base || "modpack"}-${suffix}`;
}

async function resolveSupabaseSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { supabase, user: null };
    }
    return { supabase, user };
  } catch {
    return { supabase: null, user: null };
  }
}

/**
 * Resolves Modrinth version dependency project IDs into readable mod names.
 */
export async function resolveModrinthDependencies(
  rawDependencies: RawModrinthDependency[]
): Promise<MmmModDependency[]> {
  if (!Array.isArray(rawDependencies) || rawDependencies.length === 0) {
    return [];
  }

  const projectIds = rawDependencies
    .map((d) => d.project_id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  const nameMap = new Map<string, string>();

  if (projectIds.length > 0) {
    try {
      const url = new URL("https://api.modrinth.com/v2/projects");
      url.searchParams.set("ids", JSON.stringify(projectIds));
      const res = await fetch(url.toString(), {
        headers: { "User-Agent": "MachiAsia-MMM/1.0.0 (contact@machi.asia)" },
      });
      if (res.ok) {
        const projects = (await res.json()) as RawModrinthProject[];
        if (Array.isArray(projects)) {
          for (const p of projects) {
            if (p.id) {
              nameMap.set(p.id, p.title || p.name || p.slug || p.id);
            }
          }
        }
      }
    } catch {
      // Non-fatal: fall back to project ID or filename
    }
  }

  return rawDependencies.map((d) => ({
    id: d.project_id || d.version_id || "",
    name:
      (d.project_id && nameMap.get(d.project_id)) ||
      d.file_name ||
      d.project_id ||
      "Dependency",
    type: d.dependency_type || "required",
  }));
}

/**
 * Extracts a clean Modrinth search query string from a local .jar filename.
 */
export function extractModQueryFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.(jar|disabled|zip)$/i, "");
  const cleaned = withoutExt
    .replace(/[-_+](?:mc|fabric|forge|neoforge|quilt)[-_+]?[\d.]+.*$/i, "")
    .replace(/[-_+][\d]+(?:\.[\d]+)+.*$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return cleaned || withoutExt;
}

export async function handleMmmGetOrganizations(): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ organizations: [], isGuest: true });
    }

    const { data: memberships, error: memError } = await supabase
      .from("mmm_organization_members")
      .select("role, joined_at, organization_id")
      .eq("user_id", user.id);

    if (memError) {
      return NextResponse.json({ error: memError.message }, { status: 500 });
    }

    const orgIds = (memberships ?? []).map((m) => m.organization_id);
    if (orgIds.length === 0) {
      return NextResponse.json({ organizations: [], isGuest: false });
    }

    const { data: orgs, error: orgError } = await supabase
      .from("mmm_organizations")
      .select("*")
      .in("id", orgIds)
      .order("created_at", { ascending: false });

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 500 });
    }

    const { data: modLists } = await supabase
      .from("mmm_mod_lists")
      .select("*")
      .in("organization_id", orgIds)
      .order("created_at", { ascending: true });

    const roleMap = new Map((memberships ?? []).map((m) => [m.organization_id, m.role]));
    const listsByOrg = new Map<string, typeof modLists>();
    for (const list of modLists ?? []) {
      const existing = listsByOrg.get(list.organization_id) ?? [];
      existing.push(list);
      listsByOrg.set(list.organization_id, existing);
    }

    const enriched = (orgs ?? []).map((org) => ({
      ...org,
      role: roleMap.get(org.id) ?? "member",
      mod_lists: listsByOrg.get(org.id) ?? [],
    }));

    return NextResponse.json({ organizations: enriched, isGuest: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load organizations" },
      { status: 500 }
    );
  }
}

export async function handleMmmCreateOrganization(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Sign in required to create an organization" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
      minecraft_version?: string;
      modloader?: string;
    };

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const { data: org, error: orgError } = await supabase
      .from("mmm_organizations")
      .insert({
        name,
        slug: generateSlug(name),
        description: body.description?.trim() ?? "",
        invite_code: generateInviteCode(),
        minecraft_version: body.minecraft_version || "1.21.1",
        modloader: normalizeLoader(body.modloader),
        created_by: user.id,
      })
      .select()
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: orgError?.message ?? "Failed to create organization" },
        { status: 500 }
      );
    }

    const { error: memberError } = await supabase.from("mmm_organization_members").insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    const { data: modList, error: listError } = await supabase
      .from("mmm_mod_lists")
      .insert({
        organization_id: org.id,
        name: "Main Modpack",
        description: `Primary ${org.modloader} ${org.minecraft_version} mod list`,
        is_default: true,
      })
      .select()
      .single();

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    return NextResponse.json({ organization: org, modList }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create organization" },
      { status: 500 }
    );
  }
}

export async function handleMmmJoinOrganization(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Sign in required to join an organization" }, { status: 401 });
    }

    const body = (await request.json()) as { invite_code?: string };
    const code = body.invite_code?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const lookupClient = process.env.SUPABASE_SECRET_KEY ? createServiceClient() : supabase;

    const { data: org, error: orgError } = await lookupClient
      .from("mmm_organizations")
      .select("id, name, minecraft_version, modloader, invite_code")
      .eq("invite_code", code)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from("mmm_organization_members")
      .select("id")
      .eq("organization_id", org.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ organization: org, alreadyMember: true });
    }

    const { error: joinError } = await supabase.from("mmm_organization_members").insert({
      organization_id: org.id,
      user_id: user.id,
      role: "member",
    });

    if (joinError) {
      return NextResponse.json({ error: joinError.message }, { status: 500 });
    }

    return NextResponse.json({ organization: org, alreadyMember: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to join organization" },
      { status: 500 }
    );
  }
}

export async function handleMmmGetOrganization(_request: Request, id: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: organization, error: orgError } = await supabase
      .from("mmm_organizations")
      .select("*")
      .eq("id", id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { data: modLists } = await supabase
      .from("mmm_mod_lists")
      .select("*")
      .eq("organization_id", id)
      .order("created_at", { ascending: true });

    let activeModList = modLists?.find((list) => list.is_default) ?? modLists?.[0];

    if (!activeModList) {
      const { data: createdList } = await supabase
        .from("mmm_mod_lists")
        .insert({
          organization_id: id,
          name: "Main Modpack",
          description: "Primary synced modpack",
          is_default: true,
        })
        .select()
        .single();
      if (createdList) {
        activeModList = createdList;
      }
    }

    let mods: unknown[] = [];
    if (activeModList) {
      const { data: modRows } = await supabase
        .from("mmm_mods")
        .select("*")
        .eq("mod_list_id", activeModList.id)
        .order("added_at", { ascending: false });
      mods = modRows ?? [];
    }

    const { data: members } = await supabase
      .from("mmm_organization_members")
      .select("id, organization_id, user_id, role, joined_at")
      .eq("organization_id", id);

    return NextResponse.json({
      organization,
      modLists: activeModList ? [activeModList] : modLists ?? [],
      mods,
      members: members ?? [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch organization details" },
      { status: 500 }
    );
  }
}

export async function handleMmmUpdateOrganization(request: Request, id: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
      minecraft_version?: string;
      modloader?: string;
    };

    const updates: {
      name?: string;
      description?: string;
      minecraft_version?: string;
      modloader?: MinecraftModLoader;
    } = {};
    if (body.name?.trim()) updates.name = body.name.trim();
    if (typeof body.description === "string") updates.description = body.description.trim();
    if (body.minecraft_version) updates.minecraft_version = body.minecraft_version;
    if (body.modloader && VALID_LOADERS.has(body.modloader as MinecraftModLoader)) {
      updates.modloader = body.modloader as MinecraftModLoader;
    }

    const { data: organization, error } = await supabase
      .from("mmm_organizations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !organization) {
      return NextResponse.json(
        { error: error?.message ?? "Failed to update organization" },
        { status: 500 }
      );
    }

    return NextResponse.json({ organization });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update organization" },
      { status: 500 }
    );
  }
}

export async function handleMmmDeleteOrganization(_request: Request, id: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("mmm_organizations").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete organization" },
      { status: 500 }
    );
  }
}

export async function handleMmmGetModListHistory(_request: Request, modListId: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: history, error } = await supabase
      .from("mmm_mod_history")
      .select("*")
      .eq("mod_list_id", modListId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ history: history ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch mod history" },
      { status: 500 }
    );
  }
}

export async function handleMmmAddMods(request: Request, modListId: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as IncomingModPayload | { mods: IncomingModPayload[] };
    const modsToAdd =
      "mods" in body && Array.isArray(body.mods) ? body.mods : [body as IncomingModPayload];

    if (modsToAdd.length === 0) {
      return NextResponse.json({ error: "No mods specified" }, { status: 400 });
    }

    const rowsToInsert = modsToAdd.map((m) => ({
      mod_list_id: modListId,
      modrinth_id: m.modrinth_id,
      modrinth_slug: m.modrinth_slug ?? "",
      name: m.name,
      summary: m.summary ?? "",
      icon_url: m.icon_url ?? "",
      author: m.author ?? "",
      download_url: m.download_url,
      filename: m.filename,
      version_number: m.version_number ?? "1.0.0",
      minecraft_version: m.minecraft_version ?? "",
      modloader: m.modloader ?? "",
      dependencies: (m.dependencies ?? []) as unknown as Json,
      added_by: user.id,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("mmm_mods")
      .insert(rowsToInsert)
      .select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const historyRows = (inserted ?? []).map((mod) => ({
      mod_list_id: modListId,
      action: "add" as const,
      mod_name: mod.name,
      modrinth_id: mod.modrinth_id,
      new_version: mod.version_number,
      message: `Added ${mod.name} (${mod.version_number})`,
      performed_by: user.id,
    }));

    if (historyRows.length > 0) {
      await supabase.from("mmm_mod_history").insert(historyRows);
    }

    return NextResponse.json({ mods: inserted ?? [] }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add mod" },
      { status: 500 }
    );
  }
}

export async function handleMmmUpdateMod(request: Request, modListId: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      modId?: string;
      version_number?: string;
      download_url?: string;
      filename?: string;
      dependencies?: MmmModDependency[];
    };

    if (!body.modId) {
      return NextResponse.json({ error: "modId is required" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("mmm_mods")
      .select("name, modrinth_id, version_number")
      .eq("id", body.modId)
      .eq("mod_list_id", modListId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Mod not found" }, { status: 404 });
    }

    const updates: {
      version_number?: string;
      download_url?: string;
      filename?: string;
      dependencies?: Json;
    } = {};
    if (body.version_number) updates.version_number = body.version_number;
    if (body.download_url) updates.download_url = body.download_url;
    if (body.filename) updates.filename = body.filename;
    if (body.dependencies) updates.dependencies = body.dependencies as unknown as Json;

    const { data: updated, error: updateError } = await supabase
      .from("mmm_mods")
      .update(updates)
      .eq("id", body.modId)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { error: updateError?.message ?? "Failed to update mod" },
        { status: 500 }
      );
    }

    await supabase.from("mmm_mod_history").insert({
      mod_list_id: modListId,
      action: "update",
      mod_name: existing.name,
      modrinth_id: existing.modrinth_id,
      previous_version: existing.version_number,
      new_version: body.version_number ?? existing.version_number,
      message: `Updated ${existing.name} (${existing.version_number} -> ${body.version_number ?? existing.version_number})`,
      performed_by: user.id,
    });

    return NextResponse.json({ mod: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update mod" },
      { status: 500 }
    );
  }
}

export async function handleMmmDeleteMod(request: Request, modListId: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const modId = searchParams.get("modId");
    if (!modId) {
      return NextResponse.json({ error: "modId query parameter is required" }, { status: 400 });
    }

    const { data: mod } = await supabase
      .from("mmm_mods")
      .select("name, modrinth_id, version_number")
      .eq("id", modId)
      .eq("mod_list_id", modListId)
      .single();

    const { error: deleteError } = await supabase
      .from("mmm_mods")
      .delete()
      .eq("id", modId)
      .eq("mod_list_id", modListId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (mod) {
      await supabase.from("mmm_mod_history").insert({
        mod_list_id: modListId,
        action: "remove",
        mod_name: mod.name,
        modrinth_id: mod.modrinth_id,
        previous_version: mod.version_number,
        message: `Removed ${mod.name} (${mod.version_number})`,
        performed_by: user.id,
      });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to remove mod" },
      { status: 500 }
    );
  }
}

export async function handleMmmModrinthSearch(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const mcVersion = searchParams.get("version") || "";
    const loader = searchParams.get("loader") || "";

    if (projectId) {
      const versionUrl = new URL(
        `https://api.modrinth.com/v2/project/${encodeURIComponent(projectId)}/version`
      );
      if (mcVersion) versionUrl.searchParams.set("game_versions", JSON.stringify([mcVersion]));
      if (loader) versionUrl.searchParams.set("loaders", JSON.stringify([loader]));

      const vRes = await fetch(versionUrl.toString(), {
        headers: { "User-Agent": "MachiAsia-MMM/1.0.0 (contact@machi.asia)" },
      });

      if (!vRes.ok) {
        return NextResponse.json({ error: "Failed to load Modrinth versions" }, { status: vRes.status });
      }

      const versions = (await vRes.json()) as ModrinthVersion[];
      const enriched = await Promise.all(
        versions.slice(0, 8).map(async (v) => {
          const primaryFile = v.files?.find((f) => f.primary) ?? v.files?.[0];
          const dependencies = await resolveModrinthDependencies(v.dependencies ?? []);
          return {
            id: v.id,
            version_number: v.version_number,
            date_published: v.date_published,
            download_url: primaryFile?.url ?? "",
            filename: primaryFile?.filename ?? `${projectId}-${v.version_number}.jar`,
            dependencies,
          };
        })
      );

      return NextResponse.json({ versions: enriched });
    }

    const query = searchParams.get("query") || "";
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    const facets: string[][] = [["project_type:mod"]];
    if (mcVersion) facets.push([`versions:${mcVersion}`]);
    if (loader) facets.push([`categories:${loader}`]);

    const searchUrl = new URL("https://api.modrinth.com/v2/search");
    if (query) searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("facets", JSON.stringify(facets));
    searchUrl.searchParams.set("limit", limit);
    searchUrl.searchParams.set("offset", offset);

    const res = await fetch(searchUrl.toString(), {
      headers: { "User-Agent": "MachiAsia-MMM/1.0.0 (contact@machi.asia)" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Modrinth API error: ${errorText}` }, { status: res.status });
    }

    const data = (await res.json()) as Record<string, unknown>;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to query Modrinth" },
      { status: 500 }
    );
  }
}

export async function handleMmmModrinthMatchFiles(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      filenames?: string[];
      minecraft_version?: string;
      modloader?: string;
    };

    const filenames = Array.isArray(body.filenames) ? body.filenames.slice(0, 50) : [];
    const mcVersion = body.minecraft_version || "1.21.1";
    const modloader = body.modloader || "fabric";

    if (filenames.length === 0) {
      return NextResponse.json({ error: "No filenames provided" }, { status: 400 });
    }

    const matched: Array<Record<string, unknown>> = [];
    const unmatched: string[] = [];

    for (const filename of filenames) {
      const searchHint = extractModQueryFromFilename(filename);
      try {
        const facets = [
          ["project_type:mod"],
          [`versions:${mcVersion}`],
          [`categories:${modloader}`],
        ];
        const searchUrl = new URL("https://api.modrinth.com/v2/search");
        searchUrl.searchParams.set("query", searchHint);
        searchUrl.searchParams.set("facets", JSON.stringify(facets));
        searchUrl.searchParams.set("limit", "3");

        const res = await fetch(searchUrl.toString(), {
          headers: { "User-Agent": "MachiAsia-MMM/1.0.0 (contact@machi.asia)" },
        });

        if (!res.ok) {
          unmatched.push(filename);
          continue;
        }

        const payload = (await res.json()) as { hits?: RawSearchHit[] };
        const hit = payload.hits?.[0];
        if (!hit) {
          unmatched.push(filename);
          continue;
        }

        const versionUrl = new URL(
          `https://api.modrinth.com/v2/project/${encodeURIComponent(hit.project_id)}/version`
        );
        versionUrl.searchParams.set("game_versions", JSON.stringify([mcVersion]));
        versionUrl.searchParams.set("loaders", JSON.stringify([modloader]));

        const vRes = await fetch(versionUrl.toString(), {
          headers: { "User-Agent": "MachiAsia-MMM/1.0.0 (contact@machi.asia)" },
        });
        const versions = vRes.ok ? ((await vRes.json()) as ModrinthVersion[]) : [];
        const latestVersion = versions[0];
        const primaryFile = latestVersion?.files?.find((f) => f.primary) ?? latestVersion?.files?.[0];
        const dependencies = latestVersion?.dependencies
          ? await resolveModrinthDependencies(latestVersion.dependencies)
          : [];

        matched.push({
          original_filename: filename,
          modrinth_id: hit.project_id,
          modrinth_slug: hit.slug,
          name: hit.title,
          summary: hit.description,
          icon_url: hit.icon_url ?? "",
          author: hit.author ?? "Modrinth Creator",
          download_url: primaryFile?.url ?? `https://modrinth.com/mod/${hit.slug}`,
          filename: primaryFile?.filename ?? filename,
          version_number: latestVersion?.version_number ?? "1.0.0",
          minecraft_version: mcVersion,
          modloader,
          dependencies,
          confidence: hit.slug.toLowerCase().includes(searchHint.toLowerCase().split(" ")[0] ?? "")
            ? "high"
            : "medium",
        });
      } catch {
        unmatched.push(filename);
      }
    }

    return NextResponse.json({ matched, unmatched });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to match files against Modrinth" },
      { status: 500 }
    );
  }
}
