import { describe, it, expect, beforeEach, vi } from "vitest";
import { dressSyncFunction, flushSyncEvents } from "../dress";
import { syncRegistry } from "../registry";

describe("dressSyncFunction", () => {
  beforeEach(() => {
    syncRegistry.clear();
    flushSyncEvents();
    // mock window and fetch
    vi.stubGlobal("window", {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}")));
  });

  it("wraps a function, emits userOnPress, and runs normal function", async () => {
    const rawFn = vi.fn((strikePower: number) => `Forged with power ${strikePower}`);

    const dressedFn = dressSyncFunction(rawFn, {
      trigger: "F",
      inputType: "key",
      actionId: "forge_strike",
      roomId: "forge-1",
      userId: "smith-1",
    });

    expect(dressedFn.trigger).toBe("F");
    expect(dressedFn.inputType).toBe("key");
    expect(dressedFn.actionId).toBe("forge_strike");

    const result = await dressedFn(100);
    expect(result).toBe("Forged with power 100");
    expect(rawFn).toHaveBeenCalledWith(100);

    // Verify action was also registered in syncRegistry and can be executed via remote trigger
    const registered = syncRegistry.getAction("forge_strike");
    expect(registered).toBeDefined();

    // Trigger remotely
    await syncRegistry.execute(
      {
        eventId: "remote_1",
        roomId: "forge-1",
        userId: "smith-2",
        phase: "press",
        inputType: "key",
        trigger: "F",
        timestamp: Date.now(),
      },
      true,
      50
    );

    expect(rawFn).toHaveBeenCalledWith(50);
  });

  it("provides onPress and onRelease event generators", async () => {
    const rawFn = vi.fn();
    const dressed = dressSyncFunction(rawFn, {
      trigger: "mouse0",
      inputType: "mouse",
      roomId: "forge-test",
    });

    const pressEvt = await dressed.onPress({ x: 10, y: 20 });
    expect(pressEvt.phase).toBe("press");
    expect(pressEvt.inputType).toBe("mouse");
    expect(pressEvt.trigger).toBe("mouse0");
    expect(pressEvt.payload).toEqual({ x: 10, y: 20 });

    const releaseEvt = await dressed.onRelease({ x: 10, y: 20 });
    expect(releaseEvt.phase).toBe("release");
    expect(releaseEvt.inputType).toBe("mouse");

    const holdEvt = await dressed.onHold(500, { x: 10, y: 20 });
    expect(holdEvt.phase).toBe("hold");
    expect(holdEvt.inputType).toBe("mouse");
    expect(holdEvt.payload).toEqual({ x: 10, y: 20, durationMs: 500 });
  });

  it("triggers function on hold phase when configured", async () => {
    const holdFn = vi.fn();
    const dressed = dressSyncFunction(holdFn, {
      trigger: "B",
      inputType: "key",
      actionId: "charge_bellows",
      executeOn: "hold",
    });

    await syncRegistry.execute({
      eventId: "hold_1",
      roomId: "forge-1",
      userId: "user_a",
      phase: "hold",
      inputType: "key",
      trigger: "B",
      timestamp: Date.now(),
    });

    expect(holdFn).toHaveBeenCalledTimes(1);
  });

  it("batches continuous movements and flushes them together", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    const { sendSyncEvent, flushSyncEvents } = await import("../dress");

    // Send 3 rapid movement events (actionId: player_move)
    await sendSyncEvent("hold", "custom", "player_move", {
      actionId: "player_move",
      roomId: "room-1",
      payload: { x: 10, y: 20 },
    });
    await sendSyncEvent("hold", "custom", "player_move", {
      actionId: "player_move",
      roomId: "room-1",
      payload: { x: 12, y: 22 },
    });
    await sendSyncEvent("hold", "custom", "player_move", {
      actionId: "player_move",
      roomId: "room-1",
      payload: { x: 15, y: 25 },
    });

    // Before flush, fetch should not have been called yet (buffered for rAF/timer)
    expect(fetchMock).not.toHaveBeenCalled();

    // Now manually trigger flush
    flushSyncEvents();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [endpoint, reqInit] = fetchMock.mock.calls[0];
    expect(endpoint).toBe("/api/sync/events");
    const sentEvents = JSON.parse(reqInit.body);
    expect(Array.isArray(sentEvents)).toBe(true);
    expect(sentEvents.length).toBe(3);
    expect(sentEvents[0].payload).toEqual({ x: 10, y: 20 });
    expect(sentEvents[2].payload).toEqual({ x: 15, y: 25 });
  });

  it("flushes immediately when a high-priority action occurs", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    const { sendSyncEvent } = await import("../dress");

    // 1 queued movement
    await sendSyncEvent("hold", "custom", "player_move", {
      actionId: "player_move",
      roomId: "room-1",
      payload: { x: 10, y: 20 },
    });

    // High priority attack action (e.g. player_slash)
    await sendSyncEvent("press", "mouse", "attack", {
      actionId: "player_slash",
      roomId: "room-1",
      payload: { attackerId: "p1" },
    });

    // Should have flushed immediately in a single batch
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, reqInit] = fetchMock.mock.calls[0];
    const sentEvents = JSON.parse(reqInit.body);
    expect(Array.isArray(sentEvents)).toBe(true);
    expect(sentEvents.length).toBe(2);
    expect(sentEvents[0].actionId).toBe("player_move");
    expect(sentEvents[1].actionId).toBe("player_slash");
  });

  it("routes events directly through active transport sink when registered", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    const { sendSyncEvent, registerSyncTransportSink } = await import("../dress");
    const sinkMock = vi.fn().mockReturnValue(true);

    registerSyncTransportSink(sinkMock);

    await sendSyncEvent("press", "custom", "player_move", {
      actionId: "player_move",
      roomId: "room-1",
      payload: { x: 50, y: 100 },
    });

    // Transport sink was called directly with the event payload
    expect(sinkMock).toHaveBeenCalledTimes(1);
    expect(sinkMock.mock.calls[0][0].payload).toEqual({ x: 50, y: 100 });
    // fetch was not touched at all because UDP sink handled it
    expect(fetchMock).not.toHaveBeenCalled();

    registerSyncTransportSink(null);
  });
});
