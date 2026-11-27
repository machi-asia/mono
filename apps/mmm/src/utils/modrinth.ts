import type { MmmModDependency } from "../data/mmm-catalog";

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
