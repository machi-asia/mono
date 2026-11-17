export interface StoredRoseMessage {
  id: string;
  role: "user" | "model";
  text: string;
  emotion?: string;
  traces?: string[];
  optionsPayload?: unknown;
  variant?: "normal" | "error" | "warning";
  createdAt?: string;
}

export interface StoredRoseHistoryItem {
  role: "user" | "model" | "tool";
  parts: Array<{
    text?: string;
    functionCall?: {
      name: string;
      args: unknown;
    };
    functionResponse?: {
      name: string;
      response: unknown;
    };
  }>;
}

export interface StoredRoseConversation {
  id: string;
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  isGuest: boolean;
  role: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredRoseMessage[];
  history: StoredRoseHistoryItem[];
  lastEmotion?: string;
  totalTurns: number;
  estimatedTokens: number;
  originApp?: string;
}

export interface AppendTurnInput {
  userId: string;
  conversationId?: string;
  title?: string;
  userMessage: string;
  assistantMessage: string;
  emotion?: string;
  traces?: string[];
  history?: StoredRoseHistoryItem[];
  estimatedTokens?: number;
  userEmail?: string | null;
  userName?: string | null;
  isGuest: boolean;
  role: string;
  originApp?: string;
}

export interface RoseChatStore {
  getUserConversations(userId: string): Promise<StoredRoseConversation[]>;
  saveUserConversations(
    userId: string,
    conversations: StoredRoseConversation[],
    meta?: {
      email?: string | null;
      name?: string | null;
      isGuest?: boolean;
      role?: string;
      originApp?: string;
    }
  ): Promise<void>;
  appendTurnToConversation(input: AppendTurnInput): Promise<StoredRoseConversation>;
  deleteConversation(userId: string, conversationId: string): Promise<boolean>;
  listAllConversationsForAdmin(options?: {
    search?: string;
    userId?: string;
    limit?: number;
  }): Promise<StoredRoseConversation[]>;
}

function deriveTitle(prompt: string): string {
  const clean = prompt.trim().replace(/^[/]\w+\s*/, "").replace(/[#*_`]/g, "");
  if (!clean) return "New Conversation";
  if (clean.length <= 40) return clean;
  return `${clean.slice(0, 40).trim()}…`;
}

function sortByUpdatedDesc(convs: StoredRoseConversation[]): StoredRoseConversation[] {
  return [...convs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function filterConversationsForAdmin(
  all: StoredRoseConversation[],
  options?: { search?: string; userId?: string; limit?: number }
): StoredRoseConversation[] {
  const search = options?.search?.trim().toLowerCase() || "";
  const userIdFilter = options?.userId?.trim() || "";
  const limit = Math.max(1, Math.min(options?.limit ?? 200, 1000));

  return sortByUpdatedDesc(all)
    .filter((conv) => {
      if (userIdFilter && conv.userId !== userIdFilter) return false;
      if (!search) return true;
      const inTitle = conv.title.toLowerCase().includes(search);
      const inUser =
        conv.userId.toLowerCase().includes(search) ||
        (conv.userEmail || "").toLowerCase().includes(search) ||
        (conv.userName || "").toLowerCase().includes(search);
      const inMessages = conv.messages.some((m) => m.text.toLowerCase().includes(search));
      return inTitle || inUser || inMessages;
    })
    .slice(0, limit);
}

export class MemoryRoseChatStore implements RoseChatStore {
  private readonly userConvs = new Map<string, Map<string, StoredRoseConversation>>();

  async getUserConversations(userId: string): Promise<StoredRoseConversation[]> {
    const map = this.userConvs.get(userId);
    if (!map) return [];
    return sortByUpdatedDesc(Array.from(map.values()));
  }

  async saveUserConversations(
    userId: string,
    conversations: StoredRoseConversation[],
    meta?: {
      email?: string | null;
      name?: string | null;
      isGuest?: boolean;
      role?: string;
      originApp?: string;
    }
  ): Promise<void> {
    const map = new Map<string, StoredRoseConversation>();
    const existingMap = this.userConvs.get(userId);

    for (const conv of conversations) {
      if (!conv?.id) continue;
      const prev = existingMap?.get(conv.id);
      const userTurnCount = Array.isArray(conv.messages)
        ? conv.messages.filter((m) => m.role === "user").length
        : 0;
      map.set(conv.id, {
        ...conv,
        userId,
        userEmail: meta?.email ?? conv.userEmail ?? prev?.userEmail ?? null,
        userName: meta?.name ?? conv.userName ?? prev?.userName ?? null,
        isGuest: meta?.isGuest ?? conv.isGuest ?? prev?.isGuest ?? true,
        role: meta?.role ?? conv.role ?? prev?.role ?? "guest",
        originApp: meta?.originApp ?? conv.originApp ?? prev?.originApp ?? "rose",
        totalTurns: Math.max(conv.totalTurns || 0, prev?.totalTurns || 0, userTurnCount),
        estimatedTokens: conv.estimatedTokens ?? prev?.estimatedTokens ?? 0,
      });
    }

    this.userConvs.set(userId, map);
  }

  async appendTurnToConversation(input: AppendTurnInput): Promise<StoredRoseConversation> {
    const now = new Date().toISOString();
    const convId = input.conversationId || `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    let map = this.userConvs.get(input.userId);
    if (!map) {
      map = new Map<string, StoredRoseConversation>();
      this.userConvs.set(input.userId, map);
    }

    const existing = map.get(convId);
    const messages: StoredRoseMessage[] = existing ? [...existing.messages] : [];
    messages.push(
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: input.userMessage,
        createdAt: now,
      },
      {
        id: `model-${Date.now() + 1}`,
        role: "model",
        text: input.assistantMessage,
        emotion: input.emotion || "happy",
        traces: input.traces || [],
        createdAt: now,
      }
    );

    const updated: StoredRoseConversation = {
      id: convId,
      userId: input.userId,
      userEmail: input.userEmail ?? existing?.userEmail ?? null,
      userName: input.userName ?? existing?.userName ?? null,
      isGuest: input.isGuest,
      role: input.role,
      title:
        existing?.title && existing.title !== "New Conversation"
          ? existing.title
          : input.title || deriveTitle(input.userMessage),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      messages,
      history: input.history || existing?.history || [],
      lastEmotion: input.emotion || existing?.lastEmotion || "happy",
      totalTurns: (existing?.totalTurns || 0) + 1,
      estimatedTokens: (existing?.estimatedTokens || 0) + (input.estimatedTokens || 0),
      originApp: input.originApp ?? existing?.originApp ?? "rose",
    };

    map.set(convId, updated);
    return updated;
  }

  async deleteConversation(userId: string, conversationId: string): Promise<boolean> {
    const map = this.userConvs.get(userId);
    if (!map) return false;
    return map.delete(conversationId);
  }

  async listAllConversationsForAdmin(options?: {
    search?: string;
    userId?: string;
    limit?: number;
  }): Promise<StoredRoseConversation[]> {
    const all: StoredRoseConversation[] = [];
    for (const map of this.userConvs.values()) {
      for (const conv of map.values()) {
        all.push(conv);
      }
    }
    return filterConversationsForAdmin(all, options);
  }
}

interface RedisLikeClient {
  hvals(key: string): Promise<string[]>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, field: string, value: string): Promise<unknown>;
  hdel(key: string, field: string): Promise<number>;
  del(key: string): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<unknown>;
  zrem(key: string, member: string): Promise<unknown>;
  zrevrange(key: string, start: number, stop: number): Promise<string[]>;
  expire(key: string, seconds: number): Promise<unknown>;
  ping?(): Promise<string>;
}

const CONVERSATION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const GLOBAL_INDEX_KEY = "mono:rose:index:convs";

export class RedisRoseChatStore implements RoseChatStore {
  private readonly redis: RedisLikeClient;
  private readonly fallback = new MemoryRoseChatStore();

  constructor(redisClient: RedisLikeClient) {
    this.redis = redisClient;
  }

  private userConvsKey(userId: string): string {
    return `mono:rose:convs:${userId}`;
  }

  private indexMember(userId: string, conversationId: string): string {
    return `${userId}::${conversationId}`;
  }

  async getUserConversations(userId: string): Promise<StoredRoseConversation[]> {
    try {
      const rawList = await this.redis.hvals(this.userConvsKey(userId));
      const parsed: StoredRoseConversation[] = [];
      for (const raw of rawList || []) {
        try {
          parsed.push(JSON.parse(raw) as StoredRoseConversation);
        } catch {
          // skip corrupted entry
        }
      }
      return sortByUpdatedDesc(parsed);
    } catch {
      return this.fallback.getUserConversations(userId);
    }
  }

  async saveUserConversations(
    userId: string,
    conversations: StoredRoseConversation[],
    meta?: {
      email?: string | null;
      name?: string | null;
      isGuest?: boolean;
      role?: string;
      originApp?: string;
    }
  ): Promise<void> {
    await this.fallback.saveUserConversations(userId, conversations, meta);
    try {
      const key = this.userConvsKey(userId);
      const existing = await this.getUserConversations(userId);
      const existingById = new Map(existing.map((c) => [c.id, c]));
      const nextIds = new Set<string>();

      for (const conv of conversations) {
        if (!conv?.id) continue;
        nextIds.add(conv.id);
        const prev = existingById.get(conv.id);
        const userTurnCount = Array.isArray(conv.messages)
          ? conv.messages.filter((m) => m.role === "user").length
          : 0;
        const normalized: StoredRoseConversation = {
          ...conv,
          userId,
          userEmail: meta?.email ?? conv.userEmail ?? prev?.userEmail ?? null,
          userName: meta?.name ?? conv.userName ?? prev?.userName ?? null,
          isGuest: meta?.isGuest ?? conv.isGuest ?? prev?.isGuest ?? true,
          role: meta?.role ?? conv.role ?? prev?.role ?? "guest",
          originApp: meta?.originApp ?? conv.originApp ?? prev?.originApp ?? "rose",
          totalTurns: Math.max(conv.totalTurns || 0, prev?.totalTurns || 0, userTurnCount),
          estimatedTokens: conv.estimatedTokens ?? prev?.estimatedTokens ?? 0,
        };
        await this.redis.hset(key, conv.id, JSON.stringify(normalized));
        const score = new Date(normalized.updatedAt || Date.now()).getTime() || Date.now();
        await this.redis.zadd(GLOBAL_INDEX_KEY, score, this.indexMember(userId, conv.id));
      }

      // Remove conversations that were deleted on the client
      for (const prev of existing) {
        if (!nextIds.has(prev.id)) {
          await this.redis.hdel(key, prev.id);
          await this.redis.zrem(GLOBAL_INDEX_KEY, this.indexMember(userId, prev.id));
        }
      }

      await this.redis.expire(key, CONVERSATION_TTL_SECONDS);
    } catch {
      // fallback already populated
    }
  }

  async appendTurnToConversation(input: AppendTurnInput): Promise<StoredRoseConversation> {
    const fallbackResult = await this.fallback.appendTurnToConversation(input);
    try {
      const key = this.userConvsKey(input.userId);
      const existingRaw = input.conversationId
        ? await this.redis.hget(key, input.conversationId)
        : null;
      let existing: StoredRoseConversation | null = null;
      if (existingRaw) {
        try {
          existing = JSON.parse(existingRaw) as StoredRoseConversation;
        } catch {
          existing = null;
        }
      }

      const convId = existing?.id || fallbackResult.id;
      const now = new Date().toISOString();
      const messages: StoredRoseMessage[] = existing ? [...existing.messages] : [];
      messages.push(
        {
          id: `user-${Date.now()}`,
          role: "user",
          text: input.userMessage,
          createdAt: now,
        },
        {
          id: `model-${Date.now() + 1}`,
          role: "model",
          text: input.assistantMessage,
          emotion: input.emotion || "happy",
          traces: input.traces || [],
          createdAt: now,
        }
      );

      const updated: StoredRoseConversation = {
        id: convId,
        userId: input.userId,
        userEmail: input.userEmail ?? existing?.userEmail ?? null,
        userName: input.userName ?? existing?.userName ?? null,
        isGuest: input.isGuest,
        role: input.role,
        title:
          existing?.title && existing.title !== "New Conversation"
            ? existing.title
            : input.title || deriveTitle(input.userMessage),
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        messages,
        history: input.history || existing?.history || [],
        lastEmotion: input.emotion || existing?.lastEmotion || "happy",
        totalTurns: (existing?.totalTurns || 0) + 1,
        estimatedTokens: (existing?.estimatedTokens || 0) + (input.estimatedTokens || 0),
        originApp: input.originApp ?? existing?.originApp ?? "rose",
      };

      await this.redis.hset(key, convId, JSON.stringify(updated));
      await this.redis.expire(key, CONVERSATION_TTL_SECONDS);
      await this.redis.zadd(GLOBAL_INDEX_KEY, Date.now(), this.indexMember(input.userId, convId));
      return updated;
    } catch {
      return fallbackResult;
    }
  }

  async deleteConversation(userId: string, conversationId: string): Promise<boolean> {
    const fbDeleted = await this.fallback.deleteConversation(userId, conversationId);
    try {
      const removed = await this.redis.hdel(this.userConvsKey(userId), conversationId);
      await this.redis.zrem(GLOBAL_INDEX_KEY, this.indexMember(userId, conversationId));
      return removed > 0 || fbDeleted;
    } catch {
      return fbDeleted;
    }
  }

  async listAllConversationsForAdmin(options?: {
    search?: string;
    userId?: string;
    limit?: number;
  }): Promise<StoredRoseConversation[]> {
    try {
      if (options?.userId) {
        const userConvs = await this.getUserConversations(options.userId);
        return filterConversationsForAdmin(userConvs, options);
      }

      const fetchCount = Math.max(200, options?.limit ?? 200);
      const members = await this.redis.zrevrange(GLOBAL_INDEX_KEY, 0, fetchCount - 1);
      if (!members || members.length === 0) {
        return this.fallback.listAllConversationsForAdmin(options);
      }

      const records: StoredRoseConversation[] = [];
      for (const member of members) {
        const sepIdx = member.lastIndexOf("::");
        if (sepIdx === -1) continue;
        const uid = member.slice(0, sepIdx);
        const cid = member.slice(sepIdx + 2);
        const raw = await this.redis.hget(this.userConvsKey(uid), cid);
        if (!raw) continue;
        try {
          records.push(JSON.parse(raw) as StoredRoseConversation);
        } catch {
          // ignore parse error
        }
      }

      return filterConversationsForAdmin(records, options);
    } catch {
      return this.fallback.listAllConversationsForAdmin(options);
    }
  }
}

let chatStoreInstance: RoseChatStore | null = null;
const memoryFallbackStore = new MemoryRoseChatStore();

export function resetRoseChatStoreForTests(): void {
  chatStoreInstance = null;
  // Clear memory store by re-instantiating via helper
  const fresh = new MemoryRoseChatStore();
  chatStoreInstance = fresh;
}

export async function getRoseChatStore(): Promise<RoseChatStore> {
  if (chatStoreInstance) return chatStoreInstance;

  const isTest =
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST));

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl && !isTest) {
    try {
      const RedisModule = await import("ioredis");
      const Redis = RedisModule.default || RedisModule;
      const client = new (Redis as any)(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
        connectTimeout: 1500,
      });
      client.on("error", () => {
        // Prevent unhandled error events when Redis is offline
      });
      await client.connect();
      await client.ping();
      chatStoreInstance = new RedisRoseChatStore(client);
      return chatStoreInstance;
    } catch (err) {
      console.warn("[getRoseChatStore] Redis unavailable, falling back to in-memory store:", err);
    }
  }

  chatStoreInstance = memoryFallbackStore;
  return chatStoreInstance;
}
