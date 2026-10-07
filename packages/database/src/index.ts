export { createClient } from "./client";
export type {
  Database,
  Json,
  UserRole,
  UserRoleRecord,
  UsageMetric,
  UsagePeriodType,
  UserUsageRecord,
  MediaFileRecord,
  RoseMemoryRecord,
  RosePersonalizationRecord,
  SupportTicketRecord,
} from "./types";
export {
  listUserMedia,
  uploadUserMedia,
  deleteUserMedia,
  renameUserMedia,
  detectMediaType,
} from "./media";
export type {
  ListUserMediaOptions,
  ListUserMediaResult,
  UploadUserMediaOptions,
  RenameUserMediaOptions,
} from "./media";
export {
  createMemory,
  getMemoryByIndex,
  updateMemoryByIndex,
  deleteMemoryByIndex,
  listMemoryIndexes,
  normalizeCategory,
  normalizeImportance,
  getPersonalization,
  savePersonalization,
} from "./memory";
export type {
  CreateMemoryOptions,
  ListMemoryIndexesOptions,
  UpdateMemoryByIndexOptions,
  SavePersonalizationOptions,
  MemoryImportance,
} from "./memory";
export {
  createSupportTicket,
  listUserSupportTickets,
} from "./support";
export type {
  SupportTicketType,
  SupportTicketStatus,
  CreateSupportTicketInput,
} from "./support";
export {
  getUserRole,
  updateUserRole,
  DEFAULT_USER_ROLE,
} from "./roles";
export {
  ROLE_QUOTAS,
  ROLE_IMAGE_MAX_SIZE_KB,
  ROLE_STORAGE_LIMIT_BYTES,
  recordAndCheckUsage,
  getUserUsageSummary,
} from "./usages";
export type {
  RoleQuota,
  CheckUsageResult,
} from "./usages";
