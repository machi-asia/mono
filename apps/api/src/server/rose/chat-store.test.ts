import { describe, it, expect, beforeEach } from "vitest";
import {
  MemoryRoseChatStore,
  RedisRoseChatStore,
  getRoseChatStore,
  resetRoseChatStoreForTests,
} from "./chat-store";

describe("Rose Redis & Memory Chat Store", () => {
  beforeEach(() => {
    resetRoseChatStoreForTests();
  });

  it("persists turns, searches across users/guests, and deletes conversations in memory store", async () => {
    const store = new MemoryRoseChatStore();

    const c1 = await store.appendTurnToConversation({
      userId: "user-1",
      conversationId: "conv-1",
      userMessage: "Explain nuclear fusion reactors",
      assistantMessage: "Nuclear fusion combines light atomic nuclei...",
      emotion: "happy",
      traces: ["webSearch"],
      estimatedTokens: 120,
      userEmail: "alice@machi.asia",
      userName: "Alice",
      isGuest: false,
      role: "pro",
    });

    expect(c1.title).toBe("Explain nuclear fusion reactors");
    expect(c1.totalTurns).toBe(1);
    expect(c1.estimatedTokens).toBe(120);

    await store.appendTurnToConversation({
      userId: "ip:203.0.113.9",
      conversationId: "conv-guest",
      userMessage: "Help with Minecraft Create mod",
      assistantMessage: "Sure! Rotational force is measured in SU...",
      emotion: "excited",
      estimatedTokens: 80,
      isGuest: true,
      role: "guest",
    });

    const user1Convs = await store.getUserConversations("user-1");
    expect(user1Convs).toHaveLength(1);
    expect(user1Convs[0].messages).toHaveLength(2);

    const allAdmin = await store.listAllConversationsForAdmin();
    expect(allAdmin).toHaveLength(2);

    const searchFiltered = await store.listAllConversationsForAdmin({ search: "Minecraft" });
    expect(searchFiltered).toHaveLength(1);
    expect(searchFiltered[0].isGuest).toBe(true);

    const deleted = await store.deleteConversation("user-1", "conv-1");
    expect(deleted).toBe(true);
    expect(await store.getUserConversations("user-1")).toHaveLength(0);
  });

  it("stores and queries conversations through RedisRoseChatStore with mocked Redis client", async () => {
    const hashes = new Map<string, Map<string, string>>();
    const zsets = new Map<string, Array<{ score: number; member: string }>>();

    const mockRedis = {
      async hvals(key: string) {
        return Array.from(hashes.get(key)?.values() ?? []);
      },
      async hget(key: string, field: string) {
        return hashes.get(key)?.get(field) ?? null;
      },
      async hset(key: string, field: string, value: string) {
        if (!hashes.has(key)) hashes.set(key, new Map());
        hashes.get(key)!.set(field, value);
        return 1;
      },
      async hdel(key: string, field: string) {
        return hashes.get(key)?.delete(field) ? 1 : 0;
      },
      async del(key: string) {
        return hashes.delete(key) ? 1 : 0;
      },
      async zadd(key: string, score: number, member: string) {
        if (!zsets.has(key)) zsets.set(key, []);
        const arr = zsets.get(key)!.filter((i) => i.member !== member);
        arr.push({ score, member });
        arr.sort((a, b) => b.score - a.score);
        zsets.set(key, arr);
        return 1;
      },
      async zrem(key: string, member: string) {
        const arr = zsets.get(key);
        if (!arr) return 0;
        zsets.set(
          key,
          arr.filter((i) => i.member !== member)
        );
        return 1;
      },
      async zrevrange(key: string, start: number, stop: number) {
        return (zsets.get(key) || []).slice(start, stop + 1).map((i) => i.member);
      },
      async expire() {
        return 1;
      },
    };

    const store = new RedisRoseChatStore(mockRedis);
    await store.appendTurnToConversation({
      userId: "user-redis-1",
      conversationId: "conv-r1",
      userMessage: "Hello Redis",
      assistantMessage: "Hello from Redis!",
      isGuest: false,
      role: "member",
      userEmail: "bob@machi.asia",
    });

    const list = await store.listAllConversationsForAdmin();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("conv-r1");
    expect(list[0].userEmail).toBe("bob@machi.asia");

    const singleton = await getRoseChatStore();
    expect(singleton).toBeDefined();
  });
});
