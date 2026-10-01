import type { SyncEventPayload } from "../types";
import { getSyncStore } from "./redis";
import { getAuthoritativeRoomSimulation } from "./authoritative";

/**
 * Handle incoming SSE connections or POST event dispatch for /api/sync/events
 */
export async function handleSyncEventsRoute(req: Request): Promise<Response> {
  const store = await getSyncStore();

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (Array.isArray(body)) {
        if (!body.length) {
          return new Response(JSON.stringify({ success: true, count: 0 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        const first = body[0] as SyncEventPayload;
        const roomId = first?.roomId;
        if (!roomId) {
          return new Response(JSON.stringify({ error: "Missing roomId in batch payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Deduplicate batch: find the latest player_input for each userId in this batch
        const latestInputMap = new Map<string, SyncEventPayload>();
        const otherEvents: SyncEventPayload[] = [];

        for (const evt of body as SyncEventPayload[]) {
          if (evt.trigger === "player_input" && evt.payload) {
            const existing = latestInputMap.get(evt.userId);
            const evtTime = (evt.payload as any).timestamp ?? evt.timestamp ?? 0;
            const existingTime = existing ? ((existing.payload as any).timestamp ?? existing.timestamp ?? 0) : -1;
            if (evtTime >= existingTime) {
              latestInputMap.set(evt.userId, evt);
            }
          } else {
            otherEvents.push(evt);
          }
        }

        const eventsToPublish: SyncEventPayload[] = [...otherEvents];
        const sim = getAuthoritativeRoomSimulation(roomId);

        // Process only the latest inputs from this batch
        for (const evt of latestInputMap.values()) {
          const input = evt.payload as any;
          const inputTimestamp = input.timestamp ?? evt.timestamp ?? Date.now();
          const state = sim.processPlayerInput(evt.userId, {
            x: input.x,
            y: input.y,
            angle: input.angle,
            name: input.name,
            color: input.color,
            weapon: input.weapon,
            dash: input.dash,
            timestamp: inputTimestamp,
          });

          // Only broadcast if the server processed this input (i.e. not skipped as stale)
          if (state) {
            eventsToPublish.push({
              eventId: `srv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              roomId,
              userId: evt.userId,
              phase: "press",
              inputType: "custom",
              trigger: "server_player_state",
              actionId: "server_player_state",
              payload: {
                id: state.id,
                name: state.name,
                x: Math.round(state.x * 10) / 10,
                y: Math.round(state.y * 10) / 10,
                vx: Math.round(state.vx * 100) / 100,
                vy: Math.round(state.vy * 100) / 100,
                angle: Math.round(state.angle * 100) / 100,
                color: state.color,
                bloodVolume: state.bloodVolume,
                weapon: state.weapon,
                isDashing: state.isDashing,
                timestamp: state.lastUpdated,
              },
              timestamp: state.lastUpdated,
            });
          }
        }

        if (eventsToPublish.length > 0) {
          await store.publishEvents(roomId, eventsToPublish);
        }
        return new Response(JSON.stringify({ success: true, count: eventsToPublish.length }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const single = body as SyncEventPayload;
      if (!single.roomId || !single.trigger) {
        return new Response(JSON.stringify({ error: "Missing roomId or trigger" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check if event is a player input intent
      if (single.trigger === "player_input" && single.payload) {
        const sim = getAuthoritativeRoomSimulation(single.roomId);
        const input = single.payload as any;
        const inputTimestamp = input.timestamp ?? single.timestamp ?? Date.now();
        const state = sim.processPlayerInput(single.userId, {
          x: input.x,
          y: input.y,
          angle: input.angle,
          name: input.name,
          color: input.color,
          weapon: input.weapon,
          dash: input.dash,
          timestamp: inputTimestamp,
        });

        // If stale/out-of-order, skip processing and return early without dispatching
        if (!state) {
          return new Response(JSON.stringify({ success: true, skipped: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const authoritativeEvent: SyncEventPayload = {
          eventId: `srv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          roomId: single.roomId,
          userId: single.userId,
          phase: "press",
          inputType: "custom",
          trigger: "server_player_state",
          actionId: "server_player_state",
          payload: {
            id: state.id,
            name: state.name,
            x: Math.round(state.x * 10) / 10,
            y: Math.round(state.y * 10) / 10,
            vx: Math.round(state.vx * 100) / 100,
            vy: Math.round(state.vy * 100) / 100,
            angle: Math.round(state.angle * 100) / 100,
            color: state.color,
            bloodVolume: state.bloodVolume,
            weapon: state.weapon,
            isDashing: state.isDashing,
            timestamp: state.lastUpdated,
          },
          timestamp: state.lastUpdated,
        };

        await store.publishEvent(single.roomId, authoritativeEvent);
        return new Response(JSON.stringify({ success: true, eventId: authoritativeEvent.eventId }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      await store.publishEvent(single.roomId, single);
      return new Response(JSON.stringify({ success: true, eventId: single.eventId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || "Invalid request body" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Handle SSE GET
  if (req.method === "GET") {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");
    const userId = url.searchParams.get("userId") || `anon_${Date.now()}`;
    const userName = url.searchParams.get("userName") || "Guest";

    if (!roomId) {
      return new Response(JSON.stringify({ error: "Missing roomId query parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    let cleanup: (() => void) | null = null;
    let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

    const stream = new ReadableStream({
      async start(controller) {
        // Register member in room
        const members = await store.joinRoom(roomId, {
          userId,
          name: userName,
          joinedAt: Date.now(),
          lastActiveAt: Date.now(),
        });

        // Broadcast updated member list to ALL subscribers in the room
        await store.publishEvent(roomId, {
          eventId: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          roomId,
          userId,
          phase: "press",
          inputType: "custom",
          trigger: "room_members_update",
          payload: { members },
          timestamp: Date.now(),
        });

        // Send initial member list to the newly connected subscriber
        controller.enqueue(
          encoder.encode(`event: room-members\ndata: ${JSON.stringify({ members })}\n\n`)
        );

        // Periodic keepalive comment every 15 seconds to prevent browser/proxy connection drop or buffer stalls
        keepAliveTimer = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: keepalive\n\n`));
          } catch {
            if (keepAliveTimer) clearInterval(keepAliveTimer);
          }
        }, 15000);

        // Subscribe to events
        const unsubscribe = await store.subscribeEvents(roomId, (event) => {
          try {
            // Forward room members update as dedicated room-members event
            if (event.trigger === "room_members_update" && event.payload) {
              controller.enqueue(
                encoder.encode(`event: room-members\ndata: ${JSON.stringify(event.payload)}\n\n`)
              );
              return;
            }

            controller.enqueue(
              encoder.encode(`event: sync-event\ndata: ${JSON.stringify(event)}\n\n`)
            );
          } catch {
            // Controller closed
          }
        });

        cleanup = async () => {
          if (keepAliveTimer) {
            clearInterval(keepAliveTimer);
            keepAliveTimer = null;
          }
          unsubscribe();
          const remainingMembers = await store.leaveRoom(roomId, userId);
          // Broadcast member departure to room
          await store.publishEvent(roomId, {
            eventId: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            roomId,
            userId,
            phase: "release",
            inputType: "custom",
            trigger: "room_members_update",
            payload: { members: remainingMembers },
            timestamp: Date.now(),
          }).catch(() => {});
        };
      },
      cancel() {
        if (cleanup) cleanup();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

/**
 * Handle room membership and information for /api/sync/rooms
 */
export async function handleSyncRoomsRoute(req: Request): Promise<Response> {
  const store = await getSyncStore();
  const url = new URL(req.url);
  const roomId = url.searchParams.get("roomId");

  if (!roomId) {
    return new Response(JSON.stringify({ error: "Missing roomId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const members = await store.getRoomMembers(roomId);
    return new Response(JSON.stringify({ roomId, members }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
