import type { RoomMember, RoomState, SyncEventPayload } from "./types";

export interface SyncStore {
  joinRoom(roomId: string, member: RoomMember): Promise<string[]>;
  leaveRoom(roomId: string, userId: string): Promise<string[]>;
  getRoomMembers(roomId: string): Promise<string[]>;
  publishEvent(roomId: string, event: SyncEventPayload): Promise<void>;
  publishEvents(roomId: string, events: SyncEventPayload[]): Promise<void>;
  subscribeEvents(
    roomId: string,
    callback: (event: SyncEventPayload) => void
  ): Promise<() => void>;
}

// In-Memory Dev Store Fallback
class MemorySyncStore implements SyncStore {
  private rooms = new Map<string, RoomState>();
  private listeners = new Map<string, Set<(event: SyncEventPayload) => void>>();

  async joinRoom(roomId: string, member: RoomMember): Promise<string[]> {
    let room = this.rooms.get(roomId);
    const now = Date.now();
    if (!room) {
      room = {
        roomId,
        members: {},
        createdAt: now,
        updatedAt: now,
      };
      this.rooms.set(roomId, room);
    }
    room.members[member.userId] = {
      ...member,
      lastActiveAt: now,
    };
    room.updatedAt = now;
    return Object.keys(room.members);
  }

  async leaveRoom(roomId: string, userId: string): Promise<string[]> {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    delete room.members[userId];
    room.updatedAt = Date.now();
    return Object.keys(room.members);
  }

  async getRoomMembers(roomId: string): Promise<string[]> {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Object.keys(room.members);
  }

  async publishEvent(roomId: string, event: SyncEventPayload): Promise<void> {
    const subs = this.listeners.get(roomId);
    if (subs) {
      subs.forEach((cb) => cb(event));
    }
  }

  async publishEvents(roomId: string, events: SyncEventPayload[]): Promise<void> {
    if (!events.length) return;
    const subs = this.listeners.get(roomId);
    if (subs) {
      for (const ev of events) {
        subs.forEach((cb) => cb(ev));
      }
    }
  }

  async subscribeEvents(
    roomId: string,
    callback: (event: SyncEventPayload) => void
  ): Promise<() => void> {
    if (!this.listeners.has(roomId)) {
      this.listeners.set(roomId, new Set());
    }
    const subs = this.listeners.get(roomId)!;
    subs.add(callback);

    return () => {
      subs.delete(callback);
      if (subs.size === 0) {
        this.listeners.delete(roomId);
      }
    };
  }
}

// Redis Adapter Store
class RedisSyncStore implements SyncStore {
  private redisClient: any;
  private subClient: any;
  private listeners = new Map<string, Set<(event: SyncEventPayload) => void>>();

  constructor(client: any, subClient: any) {
    this.redisClient = client;
    this.subClient = subClient;

    this.subClient.on("message", (channel: string, message: string) => {
      if (channel.startsWith("mono:sync:events:")) {
        const roomId = channel.replace("mono:sync:events:", "");
        try {
          const parsed = JSON.parse(message);
          const subs = this.listeners.get(roomId);
          if (subs) {
            subs.forEach((cb) => cb(parsed));
          }
        } catch (e) {
          console.error("[RedisSyncStore] Failed parsing message:", e);
        }
      }
    });
  }

  private memberKey(roomId: string): string {
    return `mono:sync:room:${roomId}:members`;
  }

  private channelKey(roomId: string): string {
    return `mono:sync:events:${roomId}`;
  }

  async joinRoom(roomId: string, member: RoomMember): Promise<string[]> {
    const key = this.memberKey(roomId);
    await this.redisClient.hset(key, member.userId, JSON.stringify(member));
    await this.redisClient.expire(key, 86400); // 24 hours
    return this.getRoomMembers(roomId);
  }

  async leaveRoom(roomId: string, userId: string): Promise<string[]> {
    const key = this.memberKey(roomId);
    await this.redisClient.hdel(key, userId);
    return this.getRoomMembers(roomId);
  }

  async getRoomMembers(roomId: string): Promise<string[]> {
    const key = this.memberKey(roomId);
    const result = await this.redisClient.hkeys(key);
    return result || [];
  }

  async publishEvent(roomId: string, event: SyncEventPayload): Promise<void> {
    const channel = this.channelKey(roomId);
    await this.redisClient.publish(channel, JSON.stringify(event));
  }

  async publishEvents(roomId: string, events: SyncEventPayload[]): Promise<void> {
    if (!events.length) return;
    const channel = this.channelKey(roomId);
    // Use pipeline if available for maximum throughput
    if (typeof this.redisClient.pipeline === "function") {
      const pipeline = this.redisClient.pipeline();
      for (const ev of events) {
        pipeline.publish(channel, JSON.stringify(ev));
      }
      await pipeline.exec();
    } else {
      await Promise.all(
        events.map((ev) => this.redisClient.publish(channel, JSON.stringify(ev)))
      );
    }
  }

  async subscribeEvents(
    roomId: string,
    callback: (event: SyncEventPayload) => void
  ): Promise<() => void> {
    const channel = this.channelKey(roomId);
    if (!this.listeners.has(roomId)) {
      this.listeners.set(roomId, new Set());
      await this.subClient.subscribe(channel);
    }

    const subs = this.listeners.get(roomId)!;
    subs.add(callback);

    return () => {
      subs.delete(callback);
      if (subs.size === 0) {
        this.listeners.delete(roomId);
        this.subClient.unsubscribe(channel).catch(() => {});
      }
    };
  }
}

let syncStoreInstance: SyncStore | null = null;

export async function getSyncStore(): Promise<SyncStore> {
  if (syncStoreInstance) return syncStoreInstance;

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      // Dynamic import to avoid crash if optional dependency or node environment
      const RedisModule = await import("ioredis");
      const Redis = RedisModule.default || RedisModule;
      const pub = new (Redis as any)(redisUrl);
      const sub = new (Redis as any)(redisUrl);
      syncStoreInstance = new RedisSyncStore(pub, sub);
      return syncStoreInstance;
    } catch (err) {
      console.warn("[getSyncStore] Failed initializing Redis, using in-memory store:", err);
    }
  }

  // Fallback to in-memory store
  syncStoreInstance = new MemorySyncStore();
  return syncStoreInstance;
}
