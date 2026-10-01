import { describe, it, expect, beforeEach, vi } from "vitest";
import { syncRegistry, registerSyncAction } from "../registry";
import type { SyncEventPayload } from "../types";

describe("ActionRegistry", () => {
  beforeEach(() => {
    syncRegistry.clear();
  });

  it("registers and executes actions by trigger", async () => {
    const handler = vi.fn((ctx) => `Executed for ${ctx.event.trigger}`);
    registerSyncAction("strike_anvil", {
      trigger: "F",
      inputType: "key",
      handler,
      description: "Strike the anvil with a hammer",
    });

    const event: SyncEventPayload = {
      eventId: "evt_1",
      roomId: "room_1",
      userId: "user_a",
      phase: "press",
      inputType: "key",
      trigger: "F",
      timestamp: Date.now(),
    };

    const res = await syncRegistry.execute(event, false);
    expect(res).toBe("Executed for F");
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        isRemote: false,
        event,
      })
    );
  });

  it("finds action case-insensitively", async () => {
    const handler = vi.fn();
    registerSyncAction("strike_anvil", {
      trigger: "f",
      inputType: "key",
      handler,
    });

    const event: SyncEventPayload = {
      eventId: "evt_2",
      roomId: "room_1",
      userId: "user_b",
      phase: "press",
      inputType: "key",
      trigger: "F",
      timestamp: Date.now(),
    };

    await syncRegistry.execute(event, true);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        isRemote: true,
      })
    );
  });

  it("unregisters actions properly", async () => {
    const handler = vi.fn();
    const unregister = registerSyncAction("quench", {
      trigger: "Q",
      inputType: "key",
      handler,
    });

    unregister();

    const event: SyncEventPayload = {
      eventId: "evt_3",
      roomId: "room_1",
      userId: "user_c",
      phase: "press",
      inputType: "key",
      trigger: "Q",
      timestamp: Date.now(),
    };

    const res = await syncRegistry.execute(event, false);
    expect(res).toBeNull();
    expect(handler).not.toHaveBeenCalled();
  });
});
