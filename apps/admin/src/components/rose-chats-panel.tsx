"use client";

import { useMemo, useState } from "react";
import type { AdminRoseConversation } from "@mono/api-client";
import { Button, Card, MarkdownRenderer, Row } from "@mono/components";
import { Bot, MessageSquare, Search, Sparkles, Trash2, User as UserIcon } from "lucide-react";

export interface RoseChatsPanelProps {
  conversations: AdminRoseConversation[];
  onDeleteConversation: (userId: string, conversationId: string) => Promise<void>;
  deletingId?: string | null;
}

export function RoseChatsPanel({
  conversations,
  onDeleteConversation,
  deletingId,
}: RoseChatsPanelProps) {
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<"all" | "users" | "guests">("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations.filter((conv) => {
      if (audienceFilter === "users" && conv.isGuest) return false;
      if (audienceFilter === "guests" && !conv.isGuest) return false;
      if (!q) return true;
      return (
        conv.title.toLowerCase().includes(q) ||
        conv.userId.toLowerCase().includes(q) ||
        (conv.userEmail || "").toLowerCase().includes(q) ||
        (conv.userName || "").toLowerCase().includes(q) ||
        conv.messages.some((m) => m.text.toLowerCase().includes(q))
      );
    });
  }, [audienceFilter, conversations, search]);

  const activeConv = useMemo(() => {
    if (filtered.length === 0) return null;
    if (selectedKey) {
      const match = filtered.find((c) => `${c.userId}::${c.id}` === selectedKey);
      if (match) return match;
    }
    return filtered[0];
  }, [filtered, selectedKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div className="admin-toolbar">
        <div className="admin-input-wrap">
          <Search size={15} className="admin-input-icon" />
          <input
            type="text"
            aria-label="Search Rose AI conversations"
            placeholder="Search Rose chats by message content, user email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input admin-input-with-icon"
          />
        </div>

        <select
          aria-label="Filter Rose chat audience"
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value as typeof audienceFilter)}
          className="admin-select"
        >
          <option value="all">All Chats ({conversations.length})</option>
          <option value="users">Logged-in Users ({conversations.filter((c) => !c.isGuest).length})</option>
          <option value="guests">Guests ({conversations.filter((c) => c.isGuest).length})</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="admin-muted" style={{ margin: 0, textAlign: "center" }}>
            No Redis-stored Rose AI conversations match your search.
          </p>
        </Card>
      ) : (
        <div className="admin-chat-layout">
          <div className="admin-chat-list" role="list" aria-label="Rose AI conversation list">
            {filtered.map((conv) => {
              const key = `${conv.userId}::${conv.id}`;
              const isSelected = activeConv ? `${activeConv.userId}::${activeConv.id}` === key : false;
              return (
                <button
                  key={key}
                  type="button"
                  className="admin-chat-item"
                  data-selected={isSelected}
                  onClick={() => setSelectedKey(key)}
                >
                  <Row justify="space-between" align="center" gap="var(--space-2)">
                    <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{conv.title}</span>
                    <span className={conv.isGuest ? "admin-badge admin-badge-guest" : "admin-badge"}>
                      {conv.isGuest ? "Guest" : conv.role}
                    </span>
                  </Row>
                  <span className="admin-muted" style={{ fontSize: "0.78rem" }}>
                    {conv.userName || conv.userEmail || conv.userId}
                  </span>
                  <Row justify="space-between" className="admin-muted" style={{ fontSize: "0.72rem" }}>
                    <span>
                      {conv.totalTurns} turns • ~{conv.estimatedTokens} tok
                    </span>
                    <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                  </Row>
                </button>
              );
            })}
          </div>

          {activeConv ? (
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <Row justify="space-between" align="flex-start" wrap gap="var(--space-3)">
                  <div>
                    <h3 style={{ margin: "0 0 var(--space-1)", fontSize: "1.1rem" }}>
                      {activeConv.title}
                    </h3>
                    <Row wrap gap="var(--space-2)" className="admin-muted" style={{ fontSize: "0.8rem" }}>
                      <span>
                        User: <strong>{activeConv.userEmail || activeConv.userName || activeConv.userId}</strong>
                      </span>
                      <span>•</span>
                      <span>Role: {activeConv.role}</span>
                      <span>•</span>
                      <span>Turns: {activeConv.totalTurns}</span>
                      <span>•</span>
                      <span>Tokens: ~{activeConv.estimatedTokens}</span>
                      {activeConv.lastEmotion ? (
                        <>
                          <span>•</span>
                          <span>Emotion: {activeConv.lastEmotion}</span>
                        </>
                      ) : null}
                    </Row>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    loading={deletingId === activeConv.id}
                    icon={<Trash2 size={14} />}
                    onClick={() => void onDeleteConversation(activeConv.userId, activeConv.id)}
                  >
                    Delete Chat
                  </Button>
                </Row>

                <div className="admin-chat-thread">
                  {activeConv.messages.map((msg) => (
                    <div key={msg.id} className="admin-chat-msg" data-role={msg.role}>
                      <Row justify="space-between" align="center" style={{ marginBottom: "0.4rem" }}>
                        <Row align="center" gap="0.4rem" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                          {msg.role === "user" ? <UserIcon size={13} /> : <Bot size={13} />}
                          <span>{msg.role === "user" ? "User / Guest" : "Rose AI"}</span>
                          {msg.emotion ? (
                            <span className="admin-badge">
                              <Sparkles size={11} /> {msg.emotion}
                            </span>
                          ) : null}
                        </Row>
                        {msg.createdAt ? (
                          <span className="admin-muted" style={{ fontSize: "0.72rem" }}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        ) : null}
                      </Row>

                      <div style={{ fontSize: "0.88rem" }}>
                        <MarkdownRenderer content={msg.text || "(empty)"} />
                      </div>

                      {msg.traces && msg.traces.length > 0 ? (
                        <Row wrap gap="0.3rem" style={{ marginTop: "0.5rem" }}>
                          {msg.traces.map((t, idx) => (
                            <span key={`${t}-${idx}`} className="admin-badge admin-mono">
                              <MessageSquare size={11} /> {t}
                            </span>
                          ))}
                        </Row>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
