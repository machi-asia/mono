import type { ChatMessage, RunAgentResult } from "../agent/agentRunner";

export interface DisplayMessage {
  id: string;
  role: "user" | "model";
  text: string;
  emotion?: string;
  traces?: string[];
  optionsPayload?: RunAgentResult["optionsPayload"];
  variant?: "normal" | "error" | "warning";
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: DisplayMessage[];
  history: ChatMessage[];
  lastEmotion?: string;
}

export const DEFAULT_WELCOME_TEXT = `### Hello, I'm Rose! ✨
I am your general-purpose AI companion and assistant. I can help you search the web, analyze technical concepts, brainstorm ideas, write notes, and explore questions.

> [!tip] Quick Tip
> You can type \`/\` in the input box to open quick commands, or ask me for topic suggestions!`;

export function createNewConversation(initialMessage = DEFAULT_WELCOME_TEXT): Conversation {
  const now = new Date().toISOString();
  return {
    id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: "New Conversation",
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: "welcome",
        role: "model",
        text: initialMessage,
        emotion: "happy",
      },
    ],
    history: [],
    lastEmotion: "happy",
  };
}

export function loadConversations(userId = "guest", initialMessage?: string): {
  conversations: Conversation[];
  activeId: string;
} {
  if (typeof window === "undefined") {
    const defaultConv = createNewConversation(initialMessage);
    return { conversations: [defaultConv], activeId: defaultConv.id };
  }

  try {
    const raw = localStorage.getItem(`rose_conversations_${userId}`);
    const activeStored = localStorage.getItem(`rose_active_conv_${userId}`);
    if (raw) {
      const parsed: Conversation[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sanitizedConvs = parsed.map((conv) => ({
          ...conv,
          messages: (conv.messages || []).filter((m) => !m.text.startsWith("[Rose used tool")),
          history: (conv.history || []).filter((h) =>
            !h.parts?.some((p) => p.text?.startsWith("[Rose used tool"))
          ),
        }));
        const found = activeStored && sanitizedConvs.some((c) => c.id === activeStored);
        return {
          conversations: sanitizedConvs,
          activeId: found ? (activeStored as string) : sanitizedConvs[0].id,
        };
      }
    }
  } catch {
    // ignore
  }

  const defaultConv = createNewConversation(initialMessage);
  return { conversations: [defaultConv], activeId: defaultConv.id };
}

export function saveConversations(
  userId = "guest",
  conversations: Conversation[],
  activeId: string
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`rose_conversations_${userId}`, JSON.stringify(conversations));
    localStorage.setItem(`rose_active_conv_${userId}`, activeId);
  } catch {
    // ignore
  }
}

export function generateConversationTitle(prompt: string): string {
  const clean = prompt.trim().replace(/^[/]\w+\s*/, "").replace(/[#*_`]/g, "");
  if (!clean) return "New Conversation";
  if (clean.length <= 32) return clean;
  return clean.slice(0, 32).trim() + "…";
}

function buildConversationSyncHeaders(accessToken?: string, userId?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  if (userId && userId !== "guest") {
    headers["x-user-id"] = userId;
  }
  return headers;
}

export function mergeConversations(
  localConvs: Conversation[],
  remoteConvs: Conversation[]
): Conversation[] {
  const merged = new Map<string, Conversation>();
  for (const c of localConvs) {
    if (c?.id) merged.set(c.id, c);
  }
  for (const remote of remoteConvs) {
    if (!remote?.id) continue;
    const local = merged.get(remote.id);
    if (!local) {
      merged.set(remote.id, remote);
      continue;
    }
    const localTime = new Date(local.updatedAt || 0).getTime();
    const remoteTime = new Date(remote.updatedAt || 0).getTime();
    const localMsgLen = local.messages?.length ?? 0;
    const remoteMsgLen = remote.messages?.length ?? 0;
    if (remoteTime > localTime || (remoteTime === localTime && remoteMsgLen > localMsgLen)) {
      merged.set(remote.id, remote);
    }
  }
  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
}

export async function syncConversationsFromServer(
  apiBasePath: string,
  userId = "guest",
  accessToken?: string
): Promise<Conversation[] | null> {
  if (typeof fetch === "undefined") return null;
  try {
    const res = await fetch(`${apiBasePath}/conversations`, {
      method: "GET",
      headers: buildConversationSyncHeaders(accessToken, userId),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; conversations?: Conversation[] };
    if (!Array.isArray(data?.conversations)) return null;
    return data.conversations;
  } catch {
    return null;
  }
}

export async function pushConversationsToServer(
  apiBasePath: string,
  conversations: Conversation[],
  accessToken?: string,
  userId?: string
): Promise<boolean> {
  if (typeof fetch === "undefined") return false;
  try {
    const res = await fetch(`${apiBasePath}/conversations`, {
      method: "POST",
      headers: buildConversationSyncHeaders(accessToken, userId),
      body: JSON.stringify({ conversations, originApp: "rose" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteConversationOnServer(
  apiBasePath: string,
  conversationId: string,
  accessToken?: string,
  userId?: string
): Promise<boolean> {
  if (typeof fetch === "undefined") return false;
  try {
    const res = await fetch(
      `${apiBasePath}/conversations?id=${encodeURIComponent(conversationId)}`,
      {
        method: "DELETE",
        headers: buildConversationSyncHeaders(accessToken, userId),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
