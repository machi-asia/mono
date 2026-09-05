export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface MediaFileRecord {
  id: string;
  user_id: string;
  name: string;
  path: string;
  url: string;
  type: "image" | "pdf" | "docx" | "file";
  mime_type: string;
  size: number;
  created_at: string;
}

export interface RoseMemoryRecord {
  id: number;
  user_id: string;
  content: string;
  category?: string | null;
  importance?: "low" | "medium" | "high" | null;
  created_at: string;
  updated_at?: string | null;
}

export interface RosePersonalizationRecord {
  user_id: string;
  custom_instructions: string;
  nickname?: string | null;
  tone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      media_files: {
        Row: MediaFileRecord;
        Insert: Omit<MediaFileRecord, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<MediaFileRecord, "id">>;
      };
      rose_memories: {
        Row: RoseMemoryRecord;
        Insert: Omit<RoseMemoryRecord, "id" | "created_at"> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Omit<RoseMemoryRecord, "id">>;
      };
      rose_personalization: {
        Row: RosePersonalizationRecord;
        Insert: RosePersonalizationRecord;
        Update: Partial<RosePersonalizationRecord>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
