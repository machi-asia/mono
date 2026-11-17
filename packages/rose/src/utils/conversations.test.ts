import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createNewConversation,
  deleteConversationOnServer,
  mergeConversations,
  pushConversationsToServer,
  syncConversationsFromServer,
} from "./conversations";

describe("Rose conversations cross-device Redis sync helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("merges local and remote conversations keeping newest updates", () => {
    const local = {
      ...createNewConversation(),
      id: "conv-1",
      title: "Local Older",
      updatedAt: "2026-11-17T08:00:00.000Z",
    };
    const remote = {
      ...createNewConversation(),
      id: "conv-1",
      title: "Remote Newer",
      updatedAt: "2026-11-17T09:00:00.000Z",
    };
    const remoteOnly = {
      ...createNewConversation(),
      id: "conv-2",
      title: "Phone Conversation",
      updatedAt: "2026-11-17T10:00:00.000Z",
    };

    const merged = mergeConversations([local], [remote, remoteOnly]);
    expect(merged).toHaveLength(2);
    expect(merged[0].id).toBe("conv-2");
    expect(merged[1].title).toBe("Remote Newer");
  });

  it("syncs, pushes, and deletes conversations via /rose/conversations endpoint", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, conversations: [createNewConversation()] }),
    });
    global.fetch = mockFetch;

    const fetched = await syncConversationsFromServer("http://localhost:3005/rose", "u1", "tok");
    expect(fetched).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3005/rose/conversations",
      expect.objectContaining({ method: "GET" })
    );

    const pushed = await pushConversationsToServer("http://localhost:3005/rose", [], "tok", "u1");
    expect(pushed).toBe(true);

    const deleted = await deleteConversationOnServer("http://localhost:3005/rose", "conv-1", "tok", "u1");
    expect(deleted).toBe(true);
  });
});
