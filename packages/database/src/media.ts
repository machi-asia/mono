import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MediaFileRecord } from "./types";

export interface ListUserMediaOptions {
  userId: string;
  type?: "image" | "pdf" | "docx" | "file" | "all";
  page?: number;
  pageSize?: number;
}

export interface ListUserMediaResult {
  items: MediaFileRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UploadUserMediaOptions {
  file: File;
  userId: string;
  bucket?: string;
}

export function detectMediaType(file: File | { name: string; type?: string }): "image" | "pdf" | "docx" | "file" {
  const name = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/.test(name)) {
    return "image";
  }
  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    return "pdf";
  }
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/msword" ||
    name.endsWith(".docx") ||
    name.endsWith(".doc")
  ) {
    return "docx";
  }
  return "file";
}

export async function listUserMedia(
  supabase: SupabaseClient<Database>,
  options: ListUserMediaOptions
): Promise<ListUserMediaResult> {
  const { userId, type = "all", page = 1, pageSize = 12 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    let query = supabase
      .from("media_files")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    const total = count ?? (data ? data.length : 0);
    return {
      items: (data as MediaFileRecord[]) || [],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch (_err) {
    // Fallback directly to storage bucket listing if media_files table is not yet migrated
    const bucket = "media";
    const userFolder = `users/${userId}`;
    const { data: storageList, error: storageErr } = await supabase.storage
      .from(bucket)
      .list(userFolder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (storageErr || !storageList) {
      return { items: [], total: 0, page: 1, pageSize, totalPages: 1 };
    }

    const allItems: MediaFileRecord[] = storageList
      .filter((item) => item.name !== ".emptyFolderPlaceholder")
      .map((item) => {
        const path = `${userFolder}/${item.name}`;
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
        const inferredType = detectMediaType({ name: item.name, type: item.metadata?.mimetype });
        return {
          id: item.id || path,
          user_id: userId,
          name: item.name.replace(/^\d+-/, ""),
          path,
          url: publicUrlData.publicUrl,
          type: inferredType,
          mime_type: item.metadata?.mimetype || "application/octet-stream",
          size: item.metadata?.size || 0,
          created_at: item.created_at || new Date().toISOString(),
        };
      })
      .filter((item) => {
        if (!type || type === "all") return true;
        return item.type === type;
      });

    const total = allItems.length;
    const paginated = allItems.slice(from, from + pageSize);
    return {
      items: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }
}

export async function uploadUserMedia(
  supabase: SupabaseClient<Database>,
  options: UploadUserMediaOptions
): Promise<MediaFileRecord> {
  const { file, userId, bucket = "media" } = options;
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `users/${userId}/${Date.now()}-${sanitizedName}`;
  const mediaType = detectMediaType(file);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const publicUrl = publicUrlData.publicUrl;

  const record: Omit<MediaFileRecord, "id" | "created_at"> = {
    user_id: userId,
    name: file.name,
    path: storagePath,
    url: publicUrl,
    type: mediaType,
    mime_type: file.type || "application/octet-stream",
    size: file.size,
  };

  try {
    const { data: dbData, error: dbError } = await supabase
      .from("media_files")
      .insert(record as never)
      .select()
      .single();

    if (!dbError && dbData) {
      return dbData as MediaFileRecord;
    }
  } catch (_err) {
    // If table doesn't exist, proceed with storage-derived record
  }

  return {
    id: storagePath,
    ...record,
    created_at: new Date().toISOString(),
  };
}

export async function deleteUserMedia(
  supabase: SupabaseClient<Database>,
  options: { id?: string; path: string; userId: string; bucket?: string }
): Promise<void> {
  const { id, path, userId, bucket = "media" } = options;

  // Verify ownership prefix
  if (!path.startsWith(`users/${userId}/`)) {
    throw new Error("Unauthorized delete: media path does not belong to user");
  }

  // Delete from storage
  await supabase.storage.from(bucket).remove([path]);

  // Delete from database if id provided or by path
  try {
    if (id) {
      await supabase.from("media_files").delete().eq("id", id).eq("user_id", userId);
    } else {
      await supabase.from("media_files").delete().eq("path", path).eq("user_id", userId);
    }
  } catch (_err) {
    // Ignore DB error if table not present
  }
}
