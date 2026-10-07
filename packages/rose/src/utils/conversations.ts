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
