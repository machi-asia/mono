import { describe, it, expect, beforeEach } from "vitest";
import {
  listAllSupportTickets,
  updateSupportTicketStatus,
  seedFallbackSupportTicket,
  resetFallbackSupportTickets,
} from "../support";

describe("database support tickets admin helpers", () => {
  beforeEach(() => {
    resetFallbackSupportTickets();
  });

  it("lists and updates support tickets across apps in offline test mode", async () => {
    seedFallbackSupportTicket({
      id: "ticket-1",
      user_id: "user-1",
      user_email: "alice@machi.asia",
      type: "bug_report",
      app: "calculator",
      subject: "Graph zoom bug",
      message: "Zoom resets on node click",
      status: "open",
      metadata: {},
      created_at: "2026-11-17T08:00:00.000Z",
      updated_at: "2026-11-17T08:00:00.000Z",
    });

    seedFallbackSupportTicket({
      id: "ticket-2",
      user_id: null,
      user_email: "bob@machi.asia",
      type: "recommendation",
      app: "rose",
      subject: "Voice shortcut",
      message: "Add spacebar push to talk",
      status: "resolved",
      metadata: {},
      created_at: "2026-11-17T09:00:00.000Z",
      updated_at: "2026-11-17T09:00:00.000Z",
    });

    const all = await listAllSupportTickets();
    expect(all.error).toBeNull();
    expect(all.data).toHaveLength(2);

    const calcOnly = await listAllSupportTickets({ app: "calculator" });
    expect(calcOnly.data).toHaveLength(1);
    expect(calcOnly.data[0].id).toBe("ticket-1");

    const updated = await updateSupportTicketStatus("ticket-1", "in_progress");
    expect(updated.error).toBeNull();
    expect(updated.data?.status).toBe("in_progress");
  });
});
