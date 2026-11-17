import { describe, it, expect, beforeEach } from "vitest";
import { handleRoseConversations } from "./conversations";
import { resetRoseChatStoreForTests } from "./chat-store";

describe("Rose Conversations API Handler", () => {
  beforeEach(() => {
    resetRoseChatStoreForTests();
  });

  it("saves, fetches, and deletes user conversations via Redis/memory store", async () => {
    const saveReq = new Request("http://localhost:3005/rose/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "conv-sync-user",
      },
      body: JSON.stringify({
        conversations: [
          {
            id: "conv-abc",
            title: "Cross-device sync test",
            createdAt: "2026-11-17T08:00:00.000Z",
            updatedAt: "2026-11-17T08:01:00.000Z",
            messages: [
              { id: "m1", role: "user", text: "Hello across devices" },
              { id: "m2", role: "model", text: "Synced via Redis!", emotion: "happy" },
            ],
            history: [],
          },
        ],
      }),
    });

    const saveRes = await handleRoseConversations(saveReq);
    expect(saveRes.status).toBe(200);
    const saveJson = await saveRes.json();
    expect(saveJson.ok).toBe(true);
    expect(saveJson.count).toBe(1);

    const getReq = new Request("http://localhost:3005/rose/conversations", {
      method: "GET",
      headers: { "x-user-id": "conv-sync-user" },
    });
    const getRes = await handleRoseConversations(getReq);
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.conversations).toHaveLength(1);
    expect(getJson.conversations[0].title).toBe("Cross-device sync test");

    const delReq = new Request("http://localhost:3005/rose/conversations?id=conv-abc", {
      method: "DELETE",
      headers: { "x-user-id": "conv-sync-user" },
    });
    const delRes = await handleRoseConversations(delReq);
    expect(delRes.status).toBe(200);
    const delJson = await delRes.json();
    expect(delJson.deleted).toBe(true);
  });
});
