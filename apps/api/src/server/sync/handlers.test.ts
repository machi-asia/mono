import { describe, it, expect } from "vitest";
import { handleSyncEventsRoute, handleSyncRoomsRoute } from "./handlers";

describe("Realtime Sync Route Handlers", () => {
  it("rejects batch event payloads exceeding 100 events", async () => {
    const oversizedBatch = Array.from({ length: 101 }, (_, idx) => ({
      eventId: `evt_${idx}`,
      roomId: "test-room",
      userId: "u1",
      phase: "press",
      inputType: "custom",
      trigger: "ping",
      timestamp: Date.now(),
    }));

    const req = new Request("http://localhost:3005/sync/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oversizedBatch),
    });

    const res = await handleSyncEventsRoute(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Batch size exceeds maximum limit");
  });

  it("requires roomId on GET /sync/rooms", async () => {
    const req = new Request("http://localhost:3005/sync/rooms");
    const res = await handleSyncRoomsRoute(req);
    expect(res.status).toBe(400);
  });

  it("blocks clients from spoofing server-only broadcast triggers", async () => {
    const req = new Request("http://localhost:3005/sync/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: "forged_1",
        roomId: "arena-1",
        userId: "attacker",
        phase: "press",
        inputType: "custom",
        trigger: "server_player_state",
        payload: { x: 999, y: 999 },
        timestamp: Date.now(),
      }),
    });

    const res = await handleSyncEventsRoute(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Forbidden trigger");
  });
});
