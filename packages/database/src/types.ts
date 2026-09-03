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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
