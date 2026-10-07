export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "guest" | "member" | "pro" | "admin";

export interface UserRoleRecord {
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UsageMetric = "requests" | "ai_tokens" | "turns" | "storage_bytes";
export type UsagePeriodType = "daily" | "monthly";

export interface UserUsageRecord {
  id: string;
  user_id: string;
  app: string;
  metric: UsageMetric;
  period_type: UsagePeriodType;
  period_key: string;
  count: number;
  usage_limit: number;
  created_at: string;
  updated_at: string;
}

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
  id: string;
  user_id: string;
  category: string;
  content: string;
  importance: "low" | "medium" | "high";
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

export interface SupportTicketRecord {
  id: string;
  user_id: string | null;
  user_email: string | null;
  type: "bug_report" | "recommendation" | "general_support";
  app: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: UserRoleRecord;
        Insert: Omit<UserRoleRecord, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserRoleRecord, "user_id">>;
      };
      user_usages: {
        Row: UserUsageRecord;
        Insert: Omit<UserUsageRecord, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserUsageRecord, "id">>;
      };
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
          created_at?: string;
        };
        Update: Partial<Omit<RoseMemoryRecord, "id">>;
      };
      rose_personalization: {
        Row: RosePersonalizationRecord;
        Insert: RosePersonalizationRecord;
        Update: Partial<RosePersonalizationRecord>;
      };
      support_tickets: {
        Row: SupportTicketRecord;
        Insert: Omit<SupportTicketRecord, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SupportTicketRecord, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_user_usage: {
        Args: {
          p_user_id: string;
          p_app: string;
          p_metric: string;
          p_amount?: number;
          p_daily_limit?: number;
          p_monthly_limit?: number;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
