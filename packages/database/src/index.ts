export {
  createClient,
  createTokenClient,
  createServiceClient,
} from "./client";
export type {
  Database,
  Json,
  UserRole,
  UserRoleRecord,
  CoreUsageMetric,
  BuiltInUsageMetric,
  UsageMetric,
  UsagePeriodType,
  UserUsageRecord,
  MediaFileRecord,
  RoseMemoryRecord,
  RosePersonalizationRecord,
  SupportTicketRecord,
  IssueReportRecord,
  KeepaliveHeartbeatRecord,
  VisitorSessionRecord,
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
  listAllSupportTickets,
  updateSupportTicketStatus,
  seedFallbackSupportTicket,
  resetFallbackSupportTickets,
} from "./support";
export type {
  SupportTicketType,
  SupportTicketStatus,
  CreateSupportTicketInput,
} from "./support";
export {
  getUserRole,
  updateUserRole,
  listAllUserRoles,
  resetFallbackUserRoles,
  isValidUserRole,
  resolveSafeRoleFromUser,
  DEFAULT_USER_ROLE,
} from "./roles";
export type { AdminUserDirectoryEntry } from "./roles";
export {
  ROLE_QUOTAS,
  ROLE_IMAGE_MAX_SIZE_KB,
  ROLE_STORAGE_LIMIT_BYTES,
  DEFAULT_CUSTOM_METRIC_QUOTAS,
  USAGE_METRICS_REGISTRY,
  registerUsageMetric,
  getMetricDefinition,
  listRegisteredMetrics,
  getRoleQuotaForMetric,
  isRoleAtLeast,
  recordAndCheckUsage,
  getUserUsageStatus,
  getUserUsageSummary,
  listAllUserUsages,
  adminManageUserUsage,
  getRoseUsage,
  checkAndIncrementRoseUsage,
  getRoleLimits,
  currentDay,
  currentMonth,
  currentWeek,
  toDeterministicUuid,
  roseDailyLimitGuest,
  roseWeeklyLimitGuest,
  roseDailyLimitUser,
  roseWeeklyLimitUser,
  resetFallbackUsageLedger,
} from "./usages";
export type {
  RoleQuota,
  UsageMetricDefinition,
  CheckUsageResult,
  RoseUsage,
} from "./usages";
export {
  parseUserAgent,
  recordVisitorSession,
  listVisitorSessions,
  resetFallbackVisitorSessions,
} from "./visitors";
export type {
  ParsedUserAgentInfo,
  RecordVisitorSessionInput,
  VisitorSessionWithStatus,
} from "./visitors";
