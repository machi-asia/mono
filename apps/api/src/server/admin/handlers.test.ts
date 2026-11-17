import { describe, it, expect, beforeEach } from "vitest";
import {
  recordAndCheckUsage,
  recordVisitorSession,
  resetFallbackSupportTickets,
  resetFallbackUsageLedger,
  resetFallbackUserRoles,
  resetFallbackVisitorSessions,
  seedFallbackSupportTicket,
  updateUserRole,
} from "@mono/database";
import { getRoseChatStore, resetRoseChatStoreForTests } from "../rose/chat-store";
import {
  handleAdminOverviewRoute,
  handleAdminRoseChatsRoute,
  handleAdminTicketsRoute,
  handleAdminUsageRoute,
  handleAdminUsersRoute,
} from "./handlers";

const adminHeaders = {
  "Content-Type": "application/json",
  "x-user-id": "admin-root-1",
  "x-test-role": "admin",
};

const memberHeaders = {
  "Content-Type": "application/json",
  "x-user-id": "member-1",
  "x-test-role": "member",
};

describe("Admin API Handlers", () => {
  beforeEach(() => {
    resetFallbackUserRoles();
    resetFallbackUsageLedger();
    resetFallbackVisitorSessions();
    resetFallbackSupportTickets();
    resetRoseChatStoreForTests();
  });

  it("blocks non-admin requests across all admin endpoints", async () => {
    const req1 = new Request("http://localhost:3005/admin/overview", { headers: memberHeaders });
    expect((await handleAdminOverviewRoute(req1)).status).toBe(401);

    const req2 = new Request("http://localhost:3005/admin/users", { headers: memberHeaders });
    expect((await handleAdminUsersRoute(req2)).status).toBe(401);

    const req3 = new Request("http://localhost:3005/admin/usage", { headers: memberHeaders });
    expect((await handleAdminUsageRoute(req3)).status).toBe(401);

    const req4 = new Request("http://localhost:3005/admin/rose-chats", { headers: memberHeaders });
    expect((await handleAdminRoseChatsRoute(req4)).status).toBe(401);

    const req5 = new Request("http://localhost:3005/admin/tickets", { headers: memberHeaders });
    expect((await handleAdminTicketsRoute(req5)).status).toBe(401);
  });

  it("aggregates visitors, origins, roles, usage, and Rose chats in GET /admin/overview", async () => {
    await updateUserRole("user-alice", "member");
    await recordVisitorSession({
      userId: "user-alice",
      visitorId: "user-alice",
      isGuest: false,
      email: "alice@machi.asia",
      displayName: "Alice",
      role: "member",
      app: "rose",
      referrer: "https://google.com",
      country: "SG",
      city: "Singapore",
      deviceType: "desktop",
    });

    await recordAndCheckUsage({
      userId: "user-alice",
      app: "rose",
      metric: "turns",
      amount: 3,
      role: "member",
    });

    const chatStore = await getRoseChatStore();
    await chatStore.appendTurnToConversation({
      userId: "user-alice",
      conversationId: "conv-alice-1",
      userMessage: "Hi Rose",
      assistantMessage: "Hello Alice!",
      isGuest: false,
      role: "member",
      userEmail: "alice@machi.asia",
      userName: "Alice",
      estimatedTokens: 45,
    });

    seedFallbackSupportTicket({
      id: "ticket-a1",
      user_id: "user-alice",
      user_email: "alice@machi.asia",
      type: "bug_report",
      app: "rose",
      subject: "Test bug",
      message: "Details",
      status: "open",
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const req = new Request("http://localhost:3005/admin/overview", { headers: adminHeaders });
    const res = await handleAdminOverviewRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.stats.totalUsers).toBeGreaterThanOrEqual(1);
    expect(json.stats.onlineVisitors).toBe(1);
    expect(json.stats.totalRoseChats).toBe(1);
    expect(json.stats.openTickets).toBe(1);
    expect(json.breakdowns.byCountry.SG).toBe(1);
    expect(json.breakdowns.byReferrer["google.com"]).toBe(1);
  });

  it("changes user roles while preventing admin self-demotion", async () => {
    await updateUserRole("target-user-1", "member");

    // Self-demotion blocked
    const selfDemoteReq = new Request("http://localhost:3005/admin/users", {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ userId: "admin-root-1", role: "member" }),
    });
    const selfRes = await handleAdminUsersRoute(selfDemoteReq);
    expect(selfRes.status).toBe(400);
    const selfJson = await selfRes.json();
    expect(selfJson.error.code).toBe("self_demotion_forbidden");

    // Promoting another user succeeds
    const promoteReq = new Request("http://localhost:3005/admin/users", {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ userId: "target-user-1", role: "admin" }),
    });
    const promoteRes = await handleAdminUsersRoute(promoteReq);
    expect(promoteRes.status).toBe(200);
    const promoteJson = await promoteRes.json();
    expect(promoteJson.role).toBe("admin");
  });

  it("resets and overrides user usage quotas, deletes Rose chats, and updates support tickets", async () => {
    await recordAndCheckUsage({
      userId: "usage-user-1",
      app: "calculator",
      metric: "blueprint_exports",
      amount: 4,
      role: "member",
    });

    const limitReq = new Request("http://localhost:3005/admin/usage", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        userId: "usage-user-1",
        app: "calculator",
        metric: "blueprint_exports",
        action: "set_limits",
        dailyLimit: 200,
        monthlyLimit: 2000,
      }),
    });
    const limitRes = await handleAdminUsageRoute(limitReq);
    expect(limitRes.status).toBe(200);
    expect((await limitRes.json()).dailyLimit).toBe(200);

    const resetReq = new Request("http://localhost:3005/admin/usage", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        userId: "usage-user-1",
        app: "calculator",
        metric: "blueprint_exports",
        action: "reset",
      }),
    });
    const resetRes = await handleAdminUsageRoute(resetReq);
    expect(resetRes.status).toBe(200);
    expect((await resetRes.json()).dailyCount).toBe(0);

    const chatStore = await getRoseChatStore();
    await chatStore.appendTurnToConversation({
      userId: "chat-user-1",
      conversationId: "conv-del-1",
      userMessage: "Delete me",
      assistantMessage: "Okay",
      isGuest: false,
      role: "member",
    });

    const delChatReq = new Request(
      "http://localhost:3005/admin/rose-chats?userId=chat-user-1&conversationId=conv-del-1",
      { method: "DELETE", headers: adminHeaders }
    );
    const delChatRes = await handleAdminRoseChatsRoute(delChatReq);
    expect(delChatRes.status).toBe(200);
    expect((await delChatRes.json()).deleted).toBe(true);

    seedFallbackSupportTicket({
      id: "ticket-u1",
      user_id: "usage-user-1",
      user_email: "u@machi.asia",
      type: "general_support",
      app: "machi-asia",
      subject: "Question",
      message: "Help",
      status: "open",
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const patchTicketReq = new Request("http://localhost:3005/admin/tickets", {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ ticketId: "ticket-u1", status: "resolved" }),
    });
    const patchTicketRes = await handleAdminTicketsRoute(patchTicketReq);
    expect(patchTicketRes.status).toBe(200);
    expect((await patchTicketRes.json()).ticket.status).toBe("resolved");
  });
});
