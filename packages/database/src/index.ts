export { createClient } from "./client";
export type {
  Database,
  MediaFileRecord,
  RoseMemoryRecord,
  RosePersonalizationRecord,
} from "./types";
export {
  listUserMedia,
  uploadUserMedia,
  deleteUserMedia,
  detectMediaType,
} from "./media";
export type {
  ListUserMediaOptions,
  ListUserMediaResult,
  UploadUserMediaOptions,
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

