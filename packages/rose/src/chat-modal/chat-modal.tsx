"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  X,
  MessageCircle,
  Send,
  Sparkles,
  Search,
  ListChecks,
  Wrench,
  RotateCcw,
  User as UserIcon,
  Plus,
  MessageSquare,
  Trash2,
  PanelLeft,
  PanelLeftClose,
  Settings,
  Mic,
  MicOff,
} from "lucide-react";
import { useAuth } from "@mono/auth";
import { MarkdownRenderer, Button } from "@mono/components";
import { runAgentChat, formatErrorCallout, type ChatMessage, type RunAgentResult } from "../agent/agentRunner";
import { ROSE_EMOTIONS, extractEmotion } from "../agent/roseEmotions";
import { getAgentCommandCategories, type CommandCategory } from "../agent/commandRegistry";
import { RoseSettingsModal } from "./settings-modal";
import { RoseVoiceOverlay } from "./voice-overlay";
import { useVoiceChat } from "../voice/useVoiceChat";
import { cleanTextForSpeech } from "../voice/speechService";
import { UsageBar } from "../usage/usage-bar";
import type { RoseUsage } from "../usage/usage";
import {
  type Conversation,
  type DisplayMessage,
  DEFAULT_WELCOME_TEXT,
  loadConversations,
  saveConversations,
  createNewConversation,
  generateConversationTitle,
} from "./conversations";
import "./chat-modal.css";

export type { Conversation, DisplayMessage };

/* ------------------------------------------------------------------ */
/*  Context & Provider                                                */
/* ------------------------------------------------------------------ */

export interface RoseChatModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const RoseChatModalContext = createContext<RoseChatModalContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function useRoseChatModal() {
  return useContext(RoseChatModalContext);
}

export interface RoseChatModalProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function RoseChatModalProvider({
  children,
  defaultOpen = false,
}: RoseChatModalProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <RoseChatModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </RoseChatModalContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Triggers                                                          */
/* ------------------------------------------------------------------ */

export interface RoseChatModalActionButtonProps {
  label?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RoseChatModalActionButton({
  label = "Chat with Rose",
  icon,
  className = "",
  onClick,
}: RoseChatModalActionButtonProps) {
  const { open } = useRoseChatModal();

  const handleClick = () => {
    onClick?.();
    open();
  };

  return (
    <Button
      variant="primary"
      size="md"
      className={`m-rose-action-btn ${className}`}
      onClick={handleClick}
      icon={icon || <MessageCircle size={18} />}
    >
      {label}
    </Button>
  );
}

export interface RoseChatModalFloatingButtonProps {
  icon?: ReactNode;
  badgeText?: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export function RoseChatModalFloatingButton({
  icon,
  badgeText,
  className = "",
  ariaLabel = "Open Rose AI Chat",
  onClick,
}: RoseChatModalFloatingButtonProps) {
  const { open } = useRoseChatModal();

  const handleClick = () => {
    onClick?.();
    open();
  };

  return (
    <button
      type="button"
      className={`m-rose-fab ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <div className="m-rose-fab-icon">
        {icon || <Sparkles size={24} />}
      </div>
      {badgeText ? <span className="m-rose-fab-badge">{badgeText}</span> : null}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Rose Chat View with Side Panel                                    */
/* ------------------------------------------------------------------ */

export interface RoseChatProps {
  apiBasePath?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  showUsage?: boolean;
  initialMessage?: string;
  defaultSidebarOpen?: boolean;
  className?: string;
  onClose?: () => void;
}

export function RoseChat({
  apiBasePath = "/api/rose",
  title = "Rose AI",
  subtitle = "General-purpose AI Companion",
  placeholder = "Message Rose… (type / for commands)",
  showUsage = true,
  initialMessage = DEFAULT_WELCOME_TEXT,
  defaultSidebarOpen = true,
  className = "",
  onClose,
}: RoseChatProps) {
  const { user, session } = useAuth();
  const userId = user?.id || "guest";

  const [conversationState, setConversationState] = useState<{
    conversations: Conversation[];
    activeId: string;
  }>(() => loadConversations(userId, initialMessage));

  const { conversations, activeId } = conversationState;
  const activeConv =
    conversations.find((c) => c.id === activeId) || conversations[0] || createNewConversation(initialMessage);

  const [messages, setMessages] = useState<DisplayMessage[]>(activeConv.messages);
  const [history, setHistory] = useState<ChatMessage[]>(activeConv.history);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(activeConv.lastEmotion || "happy");
  const [traces, setTraces] = useState<string[]>([]);
  const [currentUsage, setCurrentUsage] = useState<RoseUsage | undefined>(undefined);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(defaultSidebarOpen);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSlashIndex, setActiveSlashIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const refreshUsageRef = useRef<((newUsage?: RoseUsage) => void) | null>(null);
  const handleSendMessageRef = useRef<(text: string) => Promise<void> | void>(() => {});

  // Setup Voice Mode
  const {
    isVoiceMode,
    isListening,
    isSpeaking,
    transcript,
    micStream,
    autoSpeak,
    toggleVoiceMode,
    toggleAutoSpeak,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoiceChat({
    onFinalSpoken: (spokenText) => {
      if (spokenText && spokenText.trim()) {
        handleSendMessageRef.current(spokenText.trim());
      }
    },
  });

  const commandCategories = getAgentCommandCategories();
  const allCommands = commandCategories.flatMap((c) =>
    c.items.map((it) => ({ ...it, categoryName: c.label, cmd: c.command }))
  );

  const filteredCommands = input.startsWith("/")
    ? allCommands.filter(
        (c) =>
          c.cmd.toLowerCase().includes(input.toLowerCase().slice(1)) ||
          c.title.toLowerCase().includes(input.toLowerCase().slice(1))
      )
    : [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, traces, scrollToBottom]);

  // Helper to persist conversation updates
  const updateActiveConversation = useCallback(
    (updater: (prev: Conversation) => Conversation) => {
      setConversationState((prev) => {
        const nextConvs = prev.conversations.map((c) =>
          c.id === prev.activeId ? updater(c) : c
        );
        saveConversations(userId, nextConvs, prev.activeId);
        return { ...prev, conversations: nextConvs };
      });
    },
    [userId]
  );

  const handleSelectConversation = (id: string) => {
    if (id === activeId) return;
    const target = conversations.find((c) => c.id === id);
    if (!target) return;

    setConversationState((prev) => {
      saveConversations(userId, prev.conversations, id);
      return { ...prev, activeId: id };
    });

    setMessages(target.messages);
    setHistory(target.history);
    setCurrentEmotion(target.lastEmotion || "happy");
    setTraces([]);
  };

  const handleNewConversation = () => {
    const newConv = createNewConversation(initialMessage);
    setConversationState((prev) => {
      const nextConvs = [newConv, ...prev.conversations];
      saveConversations(userId, nextConvs, newConv.id);
      return { conversations: nextConvs, activeId: newConv.id };
    });

    setMessages(newConv.messages);
    setHistory(newConv.history);
    setCurrentEmotion("happy");
    setTraces([]);
  };

  const handleDeleteConversation = (id: string, e: ReactMouseEvent) => {
    e.stopPropagation();
    setConversationState((prev) => {
      const filtered = prev.conversations.filter((c) => c.id !== id);
      const nextConvs = filtered.length > 0 ? filtered : [createNewConversation(initialMessage)];
      const nextActiveId =
        prev.activeId === id ? nextConvs[0].id : prev.activeId;

      saveConversations(userId, nextConvs, nextActiveId);

      if (prev.activeId === id) {
        const nextActive = nextConvs[0];
        setMessages(nextActive.messages);
        setHistory(nextActive.history);
        setCurrentEmotion(nextActive.lastEmotion || "happy");
        setTraces([]);
      }

      return { conversations: nextConvs, activeId: nextActiveId };
    });
  };

  const handleClearCurrentConversation = () => {
    const freshConv = createNewConversation(initialMessage);
    setMessages(freshConv.messages);
    setHistory([]);
    setCurrentEmotion("happy");
    setTraces([]);

    updateActiveConversation((prev) => ({
      ...prev,
      messages: freshConv.messages,
      history: [],
      lastEmotion: "happy",
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    setInput("");
    setShowSlashMenu(false);
    setIsLoading(true);
    setTraces(["thinking"]);
    setCurrentEmotion("thinking");

    const userMsgId = `user-${Date.now()}`;
    const modelMsgId = `model-${Date.now()}`;

    const newMessages: DisplayMessage[] = [
      ...messages,
      { id: userMsgId, role: "user", text },
      {
        id: modelMsgId,
        role: "model",
        text: "",
        emotion: "thinking",
        traces: ["thinking"],
      },
    ];

    setMessages(newMessages);

    // Auto-title active conversation on first user prompt if still default
    updateActiveConversation((conv) => {
      const isFirstPrompt = conv.title === "New Conversation";
      return {
        ...conv,
        title: isFirstPrompt ? generateConversationTitle(text) : conv.title,
        messages: newMessages,
        updatedAt: new Date().toISOString(),
      };
    });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      if (user?.id) {
        headers["x-user-id"] = user.id;
      }

      const res = await fetch(`${apiBasePath}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: text, history, stream: true }),
      });      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const isQuota = res.status === 429 || errData?.error?.code === "usage_limit_exceeded";
        const actualErrorMsg =
          errData?.error?.message ||
          errData?.text ||
          errData?.message ||
          `HTTP Error ${res.status}: ${res.statusText || "Request failed"}`;

        const errText = isQuota
          ? `> [!warning] Daily Usage Limit Reached\n> You have reached your message quota for today. Your daily limit will reset at midnight (12:00 AM). <emotion>sleeping</emotion>`
          : formatErrorCallout("System Error", actualErrorMsg);

        const { cleanText, emotion } = extractEmotion(errText);
        const variant: "warning" | "error" = isQuota ? "warning" : "error";
        setCurrentEmotion(emotion || (isQuota ? "sleeping" : "sad"));
        setMessages((prev) => {
          const updated: DisplayMessage[] = prev.map((msg) =>
            msg.id === modelMsgId
              ? { ...msg, text: cleanText, emotion: emotion || (isQuota ? "sleeping" : "sad"), variant }
              : msg
          );
          updateActiveConversation((c) => ({
            ...c,
            messages: updated,
            lastEmotion: emotion || (isQuota ? "sleeping" : "sad"),
            updatedAt: new Date().toISOString(),
          }));
          return updated;
        });
        return;
      }

      const isStream =
        res.headers.get("content-type")?.includes("text/event-stream") &&
        res.body;

      if (isStream && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedStreamText = "";
        const accumulatedTraces: string[] = ["thinking"];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const dataStr = trimmed.replace(/^data:\s*/, "");
            if (!dataStr) continue;

            try {
              const event = JSON.parse(dataStr);

              if (event.type === "trace" && event.trace) {
                if (!accumulatedTraces.includes(event.trace)) {
                  accumulatedTraces.push(event.trace);
                  setTraces([...accumulatedTraces]);
                }
                const newEmotion =
                  event.emotion ||
                  (event.trace.toLowerCase().includes("search") ? "researching" : "thinking");
                setCurrentEmotion(newEmotion);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === modelMsgId
                      ? {
                          ...msg,
                          emotion: newEmotion,
                          traces: [...accumulatedTraces],
                        }
                      : msg
                  )
                );
              } else if (event.type === "delta" && typeof event.text === "string") {
                accumulatedStreamText += event.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === modelMsgId
                      ? { ...msg, text: accumulatedStreamText }
                      : msg
                  )
                );
              } else if (event.type === "done") {
                const nextHistory = event.history || [];
                setHistory(nextHistory);
                const finalEmotion = event.emotion || "happy";
                setCurrentEmotion(finalEmotion);

                const finalMsgText = event.text || accumulatedStreamText;
                const isWarn = finalMsgText.includes("[!warning]");
                const isErr = finalMsgText.includes("[!danger]") || finalMsgText.includes("[!error]");
                const variant: "normal" | "warning" | "error" = isWarn
                  ? "warning"
                  : isErr
                  ? "error"
                  : "normal";

                setMessages((prev) => {
                  const updated = prev.map((msg) =>
                    msg.id === modelMsgId
                      ? {
                          ...msg,
                          text: finalMsgText,
                          emotion: finalEmotion,
                          traces: event.traces || accumulatedTraces,
                          optionsPayload: event.optionsPayload,
                          variant,
                        }
                      : msg
                  );

                  updateActiveConversation((c) => ({
                    ...c,
                    messages: updated,
                    history: nextHistory,
                    lastEmotion: finalEmotion,
                    updatedAt: new Date().toISOString(),
                  }));

                  return updated;
                });

                if (isVoiceMode && autoSpeak) {
                  const toSpeak = cleanTextForSpeech(finalMsgText);
                  if (toSpeak) speak(toSpeak);
                }

                if (event.usage) {
                  setCurrentUsage(event.usage);
                  refreshUsageRef.current?.(event.usage);
                } else {
                  refreshUsageRef.current?.();
                }
              } else if (event.type === "error") {
                const errorMsg = event.message || event.text || "An unexpected error occurred.";
                const { cleanText, emotion } = extractEmotion(
                  event.text || formatErrorCallout("System Error", errorMsg)
                );
                setCurrentEmotion(emotion || "sad");
                setMessages((prev) => {
                  const updated: DisplayMessage[] = prev.map((msg) =>
                    msg.id === modelMsgId
                      ? { ...msg, text: cleanText, emotion: emotion || "sad", variant: "error" as const }
                      : msg
                  );
                  updateActiveConversation((c) => ({
                    ...c,
                    messages: updated,
                    lastEmotion: emotion || "sad",
                    updatedAt: new Date().toISOString(),
                  }));
                  return updated;
                });
                if (isVoiceMode && autoSpeak) {
                  speak(cleanText);
                }
              }
            } catch {
              // ignore malformed SSE line
            }
          }
        }
      } else {
        const result: RunAgentResult = await res.json();
        const nextHistory = result.history || [];
        setHistory(nextHistory);
        const finalEmotion = result.emotion || "happy";
        setCurrentEmotion(finalEmotion);

        const isWarn = result.text.includes("[!warning]");
        const isErr = result.text.includes("[!danger]") || result.text.includes("[!error]");
        const variant: "normal" | "warning" | "error" = isWarn
          ? "warning"
          : isErr
          ? "error"
          : "normal";

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === modelMsgId
              ? {
                  ...msg,
                  text: result.text,
                  emotion: finalEmotion,
                  traces: result.traces,
                  optionsPayload: result.optionsPayload,
                  variant,
                }
              : msg
          );

          updateActiveConversation((c) => ({
            ...c,
            messages: updated,
            history: nextHistory,
            lastEmotion: finalEmotion,
            updatedAt: new Date().toISOString(),
          }));

          return updated;
        });

        if (isVoiceMode && autoSpeak) {
          const toSpeak = cleanTextForSpeech(result.text);
          if (toSpeak) speak(toSpeak);
        }

        if ((result as any).usage) {
          setCurrentUsage((result as any).usage);
          refreshUsageRef.current?.((result as any).usage);
        } else {
          refreshUsageRef.current?.();
        }
      }
    } catch {
      // Fallback for mock/test environments
      try {
        const result = await runAgentChat(history, text, (trace, emotion) => {
          setTraces((prev) => [...prev, trace]);
          if (emotion) {
            setCurrentEmotion(emotion);
          }
        });
        const nextHistory = result.history;
        setHistory(nextHistory);
        const finalEmotion = result.emotion || "happy";
        setCurrentEmotion(finalEmotion);
        const isWarn = result.text.includes("[!warning]");
        const isErr = result.text.includes("[!danger]") || result.text.includes("[!error]");
        const variant: "normal" | "warning" | "error" = isWarn
          ? "warning"
          : isErr
          ? "error"
          : "normal";

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === modelMsgId
              ? {
                  ...msg,
                  text: result.text,
                  emotion: finalEmotion,
                  traces: result.traces,
                  optionsPayload: result.optionsPayload,
                  variant,
                }
              : msg
          );
          updateActiveConversation((c) => ({
            ...c,
            messages: updated,
            history: nextHistory,
            lastEmotion: finalEmotion,
            updatedAt: new Date().toISOString(),
          }));
          return updated;
        });

        if (isVoiceMode && autoSpeak) {
          const toSpeak = cleanTextForSpeech(result.text);
          if (toSpeak) speak(toSpeak);
        }
      } catch (err: any) {
        const errorMsg =
          err?.message || String(err) || "An unexpected error occurred while communicating with the assistant.";
        const fallbackText = formatErrorCallout("System Error", errorMsg, "Please verify your configuration or check server logs.");
        const { cleanText, emotion } = extractEmotion(fallbackText);
        setCurrentEmotion(emotion || "sad");
        setMessages((prev) => {
          const updated: DisplayMessage[] = prev.map((msg) =>
            msg.id === modelMsgId
              ? { ...msg, text: cleanText, emotion: emotion || "sad", variant: "error" as const }
              : msg
          );
          updateActiveConversation((c) => ({
            ...c,
            messages: updated,
            lastEmotion: emotion || "sad",
            updatedAt: new Date().toISOString(),
          }));
          return updated;
        });
        if (isVoiceMode && autoSpeak) {
          speak(cleanText);
        }
      }
    } finally {
      setIsLoading(false);
      setTraces([]);
    }
  };

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSlashIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSlashIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const cmd = filteredCommands[activeSlashIndex];
        setInput(cmd.promptText);
        setShowSlashMenu(false);
        textareaRef.current?.focus();
        return;
      }
      if (e.key === "Escape") {
        setShowSlashMenu(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const currentAvatar = ROSE_EMOTIONS[currentEmotion] || "/rose/happy.png";

  return (
    <div className={`m-rose-chat-container ${className}`} data-mono="rose-chat">
      {/* Top Header */}
      <header className="m-rose-chat-header">
        <div className="m-rose-chat-header-left">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`m-rose-header-icon-btn m-rose-sidebar-toggle ${showSidebar ? "active" : ""}`}
            onClick={() => setShowSidebar((prev) => !prev)}
            title={showSidebar ? "Hide conversations panel" : "Show conversations panel"}
            aria-label={showSidebar ? "Hide conversations panel" : "Show conversations panel"}
            aria-expanded={showSidebar}
            icon={showSidebar ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          />

          <div className="m-rose-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentAvatar}
              alt="Rose"
              className="m-rose-avatar-img"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="m-rose-status-dot" />
          </div>

          <div className="m-rose-header-meta">
            <h2 className="m-rose-header-title">{title}</h2>
            <p className="m-rose-header-subtitle">
              {isLoading ? "Rose is thinking…" : subtitle}
            </p>
          </div>
        </div>

        <div className="m-rose-header-actions">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="m-rose-header-icon-btn"
            onClick={handleNewConversation}
            title="Start new conversation"
            aria-label="Start new conversation"
            icon={<Plus size={16} />}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="m-rose-header-icon-btn"
            onClick={handleClearCurrentConversation}
            title="Reset active conversation"
            aria-label="Reset active conversation"
            icon={<RotateCcw size={16} />}
          />
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="m-rose-header-icon-btn"
              onClick={onClose}
              title="Close chat"
              aria-label="Close chat"
              icon={<X size={18} />}
            />
          )}
        </div>
      </header>

      {/* Main Body with Side Panel */}
      <div className="m-rose-chat-body">
        {/* Conversations Side Panel */}
        {showSidebar && (
          <aside className="m-rose-sidebar" aria-label="Conversation history">
            <div className="m-rose-sidebar-header">
              <div className="m-rose-sidebar-title-wrap">
                <MessageSquare size={14} className="m-rose-sidebar-icon" />
                <span className="m-rose-sidebar-title">Chats</span>
                <span className="m-rose-sidebar-count">{conversations.length}</span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="m-rose-sidebar-new-btn"
                onClick={handleNewConversation}
                title="New Chat"
                aria-label="New Chat"
                icon={<Plus size={14} />}
              >
                New
              </Button>
            </div>

            <div className="m-rose-sidebar-list" role="list">
              {conversations.map((c) => {
                const isActive = c.id === activeId;
                const userMsgCount = c.messages.filter((m) => m.role === "user").length;
                return (
                  <div
                    key={c.id}
                    role="listitem"
                    className={`m-rose-sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectConversation(c.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectConversation(c.id);
                      }
                    }}
                  >
                    <div className="m-rose-sidebar-item-content">
                      <span className="m-rose-sidebar-item-title">{c.title}</span>
                      <span className="m-rose-sidebar-item-meta">
                        {userMsgCount} {userMsgCount === 1 ? "message" : "messages"}
                      </span>
                    </div>

                    {conversations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="m-rose-sidebar-delete-btn"
                        onClick={(e) => handleDeleteConversation(c.id, e)}
                        title="Delete chat"
                        aria-label={`Delete conversation ${c.title}`}
                        icon={<Trash2 size={13} />}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer with Settings Button */}
            <div className="m-rose-sidebar-footer">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="m-rose-sidebar-settings-btn"
                onClick={() => setShowSettings(true)}
                title="Open Settings"
                aria-label="Open Settings"
                icon={<Settings size={15} />}
              >
                Settings
              </Button>
            </div>
          </aside>
        )}

        {/* Rose Settings Modal */}
        <RoseSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          apiBasePath={apiBasePath}
        />

        {/* Chat Main Area */}
        <div className="m-rose-chat-main">
          {/* Usage Bar */}
          {showUsage && (
            <div className="m-rose-chat-usage-strip">
              <UsageBar
                usage={currentUsage}
                apiBasePath={apiBasePath}
                onRefreshRef={refreshUsageRef}
                size="sm"
              />
            </div>
          )}

          {/* Message Feed */}
          <div className="m-rose-messages-feed" role="log" aria-live="polite">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const avatarSrc = isUser ? null : ROSE_EMOTIONS[msg.emotion || "happy"] || currentAvatar;
              const isError = msg.variant === "error" || msg.text?.includes("[!danger]") || msg.text?.includes("[!error]");
              const isWarning = msg.variant === "warning" || msg.text?.includes("[!warning]");
              const bubbleVariantClass = isError
                ? "m-rose-msg-bubble--error"
                : isWarning
                ? "m-rose-msg-bubble--warning"
                : "";

              return (
                <div
                  key={msg.id}
                  className={`m-rose-msg-row ${isUser ? "m-rose-msg-row--user" : "m-rose-msg-row--model"}`}
                >
                  {!isUser && (
                    <div className="m-rose-msg-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarSrc!}
                        alt="Rose"
                        className="m-rose-msg-avatar-img"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className={`m-rose-msg-bubble ${bubbleVariantClass}`.trim()}>
                    {isUser ? (
                      <p className="m-rose-msg-user-text">{msg.text}</p>
                    ) : (
                      <>
                        {msg.text ? (
                          <MarkdownRenderer content={msg.text} />
                        ) : (
                          <div className="m-rose-action-indicator">
                            <Sparkles size={14} className="m-rose-action-sparkle" />
                            <span className="m-rose-action-text">
                              {msg.traces && msg.traces.length > 0
                                ? msg.traces[msg.traces.length - 1]
                                : traces.length > 0
                                ? traces[traces.length - 1]
                                : "Thinking"}
                            </span>
                            <span className="m-rose-wave-dots" aria-hidden="true">
                              <span className="m-rose-wave-dot" style={{ animationDelay: "0s" }}>.</span>
                              <span className="m-rose-wave-dot" style={{ animationDelay: "0.2s" }}>.</span>
                              <span className="m-rose-wave-dot" style={{ animationDelay: "0.4s" }}>.</span>
                            </span>
                          </div>
                        )}

                        {/* Option Picker interactive buttons */}
                        {msg.optionsPayload && (
                          <div className="m-rose-options-picker">
                            <div className="m-rose-options-picker-label">
                              <ListChecks size={14} />
                              <span>Select an option:</span>
                            </div>
                            <div className="m-rose-options-buttons">
                              {msg.optionsPayload.options.map((option, idx) => (
                                 <Button
                                   key={idx}
                                   type="button"
                                   variant="secondary"
                                   size="sm"
                                   className="m-rose-option-btn"
                                   onClick={() => handleSendMessage(option)}
                                 >
                                   {option}
                                 </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {isUser && (
                    <div className="m-rose-user-avatar">
                      <UserIcon size={22} />
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="m-rose-input-container">
            {/* Slash Menu */}
            {showSlashMenu && filteredCommands.length > 0 && (
              <div className="m-rose-slash-menu">
                <div className="m-rose-slash-header">Available Commands</div>
                <div className="m-rose-slash-list">
                  {filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      type="button"
                      className={`m-rose-slash-item ${idx === activeSlashIndex ? "active" : ""}`}
                      onClick={() => {
                        setInput(cmd.promptText);
                        setShowSlashMenu(false);
                        textareaRef.current?.focus();
                      }}
                    >
                      <div className="m-rose-slash-icon">
                        {cmd.cmd === "web" ? (
                          <Search size={14} />
                        ) : cmd.cmd === "picker" ? (
                          <ListChecks size={14} />
                        ) : (
                          <Wrench size={14} />
                        )}
                      </div>
                      <div className="m-rose-slash-meta">
                        <span className="m-rose-slash-title">{cmd.title}</span>
                        <span className="m-rose-slash-desc">{cmd.subtitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="m-rose-input-bar">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  const val = e.target.value;
                  setInput(val);
                  if (val.startsWith("/")) {
                    setShowSlashMenu(true);
                    setActiveSlashIndex(0);
                  } else {
                    setShowSlashMenu(false);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="m-rose-input-textarea"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="m-rose-send-btn"
                aria-label="Send message"
                icon={<Send size={16} />}
              />
              <Button
                type="button"
                variant={isVoiceMode ? "primary" : "secondary"}
                size="sm"
                className={`m-rose-voice-btn ${isVoiceMode ? "active" : ""}`}
                onClick={() => toggleVoiceMode()}
                title={isVoiceMode ? "Voice Mode active — tap to close" : "Start Voice Mode (Talk & Listen)"}
                aria-label={isVoiceMode ? "Exit Voice Mode" : "Start Voice Mode"}
                icon={isVoiceMode ? <MicOff size={16} /> : <Mic size={16} />}
              >
                <span className="m-rose-voice-btn-label">Voice</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Voice Mode Full-Screen Dimmed Overlay */}
      <RoseVoiceOverlay
        isOpen={isVoiceMode}
        onClose={() => {
          stopSpeaking();
          stopListening();
          toggleVoiceMode();
        }}
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        currentEmotion={currentEmotion}
        autoSpeak={autoSpeak}
        micStream={micStream}
        onToggleAutoSpeak={toggleAutoSpeak}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rose Chat Modal                                                   */
/* ------------------------------------------------------------------ */

export interface RoseChatModalProps extends Omit<RoseChatProps, "onClose"> {
  className?: string;
}

export function RoseChatModal({ className = "", ...chatProps }: RoseChatModalProps) {
  const { isOpen, close } = useRoseChatModal();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className={`m-rose-modal-backdrop ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="Rose AI Chat Modal"
    >
      <div className="m-rose-modal-card">
        <RoseChat {...chatProps} onClose={close} />
      </div>
    </div>
  );
}

export default RoseChatModal;
