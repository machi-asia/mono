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

export type CoreUsageMetric = "requests" | "ai_tokens" | "turns" | "storage_bytes";
export type BuiltInUsageMetric =
  | CoreUsageMetric
  | "blueprint_exports"
  | "voice_minutes";
export type UsageMetric = BuiltInUsageMetric | (string & {});
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

export interface IssueReportRecord {
  id: string;
  game_id: string;
  item_id: string;
  item_name: string;
  issue_type: string;
  description: string | null;
  suggested_fix: string | null;
  reporter_hash: string;
  corrections: Json;
  consensus_key: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string;
}

export interface KeepaliveHeartbeatRecord {
  id: string;
  source: string;
  pinged_at: string;
}

export interface VisitorSessionRecord {
  session_key: string;
  user_id: string | null;
  visitor_id: string;
  is_guest: boolean;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  app: string;
  hostname: string | null;
  pathname: string | null;
  referrer: string | null;
  utm_source: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  ip_address: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  user_agent: string | null;
  started_at: string;
  last_seen_at: string;
}

export interface TerraPriceDatasetRecord {
  id: number;
  latitude: number;
  longitude: number;
  category: string;
  commodity: string;
  pricetype: string;
  price: number;
  user_id: string | null;
  created_at: string;
}

export type MinecraftModLoader = "fabric" | "forge" | "neoforge" | "quilt";

export interface MmmOrganizationRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  invite_code: string;
  minecraft_version: string;
  modloader: MinecraftModLoader;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MmmOrganizationMemberRecord {
  id: string;
  organization_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
}

export interface MmmModListRecord {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface MmmModRecord {
  id: string;
  mod_list_id: string;
  modrinth_id: string;
  modrinth_slug: string;
  name: string;
  summary: string;
  icon_url: string;
  author: string;
  download_url: string;
  filename: string;
  version_number: string;
  minecraft_version: string;
  modloader: string;
  dependencies: Json;
  added_at: string;
  added_by: string | null;
}

export interface MmmModHistoryRecord {
  id: string;
  mod_list_id: string;
  action: "add" | "remove" | "update";
  mod_name: string;
  modrinth_id: string;
  previous_version: string;
  new_version: string;
  message: string;
  performed_by: string | null;
  created_at: string;
}

export interface QuickNoteRecord {
  id: number;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface QuickNoteRelationRecord {
  note_id: number;
  related_note_id: number;
  created_at: string;
}

export type DebtDirection = "they_owe_me" | "i_owe_them";

export interface DebtRecord {
  id: string;
  user_id: string;
  person: string;
  amount: number;
  direction: DebtDirection;
  note: string;
  date: string;
  due_date: string | null;
  settled: boolean;
  created_at: string;
}

type DbRow<T> = { [K in keyof T]: T[K] };

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: DbRow<UserRoleRecord>;
        Insert: DbRow<
          Omit<UserRoleRecord, "created_at" | "updated_at"> & {
            created_at?: string;
            updated_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<UserRoleRecord, "user_id">>>;
        Relationships: [];
      };
      user_usages: {
        Row: DbRow<UserUsageRecord>;
        Insert: DbRow<
          Omit<UserUsageRecord, "id" | "created_at" | "updated_at"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<UserUsageRecord, "id">>>;
        Relationships: [];
      };
      media_files: {
        Row: DbRow<MediaFileRecord>;
        Insert: DbRow<
          Omit<MediaFileRecord, "id" | "created_at"> & {
            id?: string;
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<MediaFileRecord, "id">>>;
        Relationships: [];
      };
      rose_memories: {
        Row: DbRow<RoseMemoryRecord>;
        Insert: DbRow<
          Omit<RoseMemoryRecord, "id" | "created_at"> & {
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<RoseMemoryRecord, "id">>>;
        Relationships: [];
      };
      rose_personalization: {
        Row: DbRow<RosePersonalizationRecord>;
        Insert: DbRow<RosePersonalizationRecord>;
        Update: DbRow<Partial<RosePersonalizationRecord>>;
        Relationships: [];
      };
      support_tickets: {
        Row: DbRow<SupportTicketRecord>;
        Insert: DbRow<
          Omit<SupportTicketRecord, "id" | "created_at" | "updated_at"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<SupportTicketRecord, "id">>>;
        Relationships: [];
      };
      issue_reports: {
        Row: DbRow<IssueReportRecord>;
        Insert: DbRow<
          Omit<IssueReportRecord, "id" | "status" | "created_at"> & {
            id?: string;
            status?: "pending" | "resolved" | "rejected";
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<IssueReportRecord, "id">>>;
        Relationships: [];
      };
      keepalive_heartbeats: {
        Row: DbRow<KeepaliveHeartbeatRecord>;
        Insert: {
          id?: string;
          source?: string;
          pinged_at?: string;
        };
        Update: DbRow<Partial<Omit<KeepaliveHeartbeatRecord, "id">>>;
        Relationships: [];
      };
      visitor_sessions: {
        Row: DbRow<VisitorSessionRecord>;
        Insert: DbRow<
          Omit<VisitorSessionRecord, "started_at" | "last_seen_at"> & {
            started_at?: string;
            last_seen_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<VisitorSessionRecord, "session_key">>>;
        Relationships: [];
      };
      terraprice_datasets: {
        Row: DbRow<TerraPriceDatasetRecord>;
        Insert: DbRow<
          Omit<TerraPriceDatasetRecord, "id" | "user_id" | "created_at"> & {
            id?: number;
            user_id?: string | null;
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<TerraPriceDatasetRecord, "id">>>;
        Relationships: [];
      };
      mmm_organizations: {
        Row: DbRow<MmmOrganizationRecord>;
        Insert: DbRow<
          Omit<MmmOrganizationRecord, "id" | "created_at" | "updated_at"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<MmmOrganizationRecord, "id">>>;
        Relationships: [];
      };
      mmm_organization_members: {
        Row: DbRow<MmmOrganizationMemberRecord>;
        Insert: DbRow<
          Omit<MmmOrganizationMemberRecord, "id" | "joined_at"> & {
            id?: string;
            joined_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<MmmOrganizationMemberRecord, "id">>>;
        Relationships: [];
      };
      mmm_mod_lists: {
        Row: DbRow<MmmModListRecord>;
        Insert: DbRow<
          Omit<MmmModListRecord, "id" | "created_at" | "updated_at"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<MmmModListRecord, "id">>>;
        Relationships: [];
      };
      mmm_mods: {
        Row: DbRow<MmmModRecord>;
        Insert: DbRow<
          Omit<MmmModRecord, "id" | "added_at"> & {
            id?: string;
            added_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<MmmModRecord, "id">>>;
        Relationships: [];
      };
      mmm_mod_history: {
        Row: DbRow<MmmModHistoryRecord>;
        Insert: DbRow<
          Omit<MmmModHistoryRecord, "id" | "created_at" | "previous_version" | "new_version"> & {
            id?: string;
            previous_version?: string | null;
            new_version?: string | null;
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<MmmModHistoryRecord, "id">>>;
        Relationships: [];
      };
      quicknote_notes: {
        Row: DbRow<QuickNoteRecord>;
        Insert: DbRow<
          Omit<QuickNoteRecord, "id" | "created_at" | "updated_at" | "folder" | "order_index"> & {
            folder?: string;
            order_index?: number;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<QuickNoteRecord, "id" | "user_id">>>;
        Relationships: [];
      };
      quicknote_note_relations: {
        Row: DbRow<QuickNoteRelationRecord>;
        Insert: DbRow<
          Omit<QuickNoteRelationRecord, "created_at"> & {
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<QuickNoteRelationRecord>>;
        Relationships: [];
      };
      debts: {
        Row: DbRow<DebtRecord>;
        Insert: DbRow<
          Omit<DebtRecord, "id" | "settled" | "created_at" | "due_date"> & {
            id?: string;
            due_date?: string | null;
            settled?: boolean;
            created_at?: string;
          }
        >;
        Update: DbRow<Partial<Omit<DebtRecord, "id">>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_keepalive_heartbeat: {
        Args: {
          p_source?: string;
        };
        Returns: string;
      };
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
      get_community_overrides: {
        Args: {
          p_game_id: string;
        };
        Returns: Json;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
