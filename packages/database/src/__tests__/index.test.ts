import { describe, it, expect } from "vitest";
import * as db from "../index";

describe("@mono/database public API exports", () => {
  it("exports all key functions and constants", () => {
    expect(db.createClient).toBeDefined();
    expect(db.detectMediaType).toBeDefined();
    expect(db.listUserMedia).toBeDefined();
    expect(db.uploadUserMedia).toBeDefined();
    expect(db.deleteUserMedia).toBeDefined();
    expect(db.renameUserMedia).toBeDefined();
    expect(db.createMemory).toBeDefined();
    expect(db.getMemoryByIndex).toBeDefined();
    expect(db.updateMemoryByIndex).toBeDefined();
    expect(db.deleteMemoryByIndex).toBeDefined();
    expect(db.listMemoryIndexes).toBeDefined();
    expect(db.normalizeCategory).toBeDefined();
    expect(db.normalizeImportance).toBeDefined();
    expect(db.createSupportTicket).toBeDefined();
    expect(db.listUserSupportTickets).toBeDefined();
    expect(db.getUserRole).toBeDefined();
    expect(db.updateUserRole).toBeDefined();
    expect(db.DEFAULT_USER_ROLE).toBe("member");
    expect(db.ROLE_IMAGE_MAX_SIZE_KB).toBeDefined();
    expect(db.ROLE_STORAGE_LIMIT_BYTES).toBeDefined();
    expect(db.ROLE_QUOTAS).toBeDefined();
    expect(db.recordAndCheckUsage).toBeDefined();
    expect(db.getUserUsageSummary).toBeDefined();
  });
});
