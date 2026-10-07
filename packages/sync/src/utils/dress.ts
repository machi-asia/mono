import type {
  SyncActionPhase,
  SyncEventPayload,
  SyncInputType,
} from "../types";
import { syncRegistry, registerSyncAction } from "./registry";

export interface SyncDispatchOptions {
  roomId: string;
  userId: string;
  apiEndpoint?: string;
  broadcastRemote?: boolean;
  executeLocal?: boolean;
}

let defaultDispatchOptions: Partial<SyncDispatchOptions> = {
  apiEndpoint: "/api/sync/events",
  broadcastRemote: true,
  executeLocal: true,
};

export function configureSyncDefaults(options: Partial<SyncDispatchOptions>): void {
  defaultDispatchOptions = { ...defaultDispatchOptions, ...options };
}

// Active stream transport sink (e.g. WebRTC UDP DataChannel)
let activeTransportSink: ((event: SyncEventPayload) => boolean | void) | null = null;

export function registerSyncTransportSink(
  sink: ((event: SyncEventPayload) => boolean | void) | null
): void {
  activeTransportSink = sink;
}

// Outbound event queue for micro-batching high-frequency events (e.g. movement)
interface QueuedSyncEvent {
  event: SyncEventPayload;
  endpoint: string;
}

let pendingBatchQueue: QueuedSyncEvent[] = [];
let batchFlushTimer: ReturnType<typeof setTimeout> | null = null;
let batchFlushRaf: number | null = null;

/**
 * Immediately flushes all queued sync events in batched POST requests grouped by endpoint.
 */
export function flushSyncEvents(): void {
  if (batchFlushTimer) {
    clearTimeout(batchFlushTimer);
    batchFlushTimer = null;
  }
  if (batchFlushRaf && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(batchFlushRaf);
    batchFlushRaf = null;
  }

  if (pendingBatchQueue.length === 0) return;

  const toFlush = pendingBatchQueue;
  pendingBatchQueue = [];

  if (typeof fetch !== "function") return;

  // Group events by api endpoint
  const endpointMap = new Map<string, SyncEventPayload[]>();
  for (const item of toFlush) {
    const list = endpointMap.get(item.endpoint);
    if (list) {
      list.push(item.event);
    } else {
      endpointMap.set(item.endpoint, [item.event]);
    }
  }

  for (const [endpoint, events] of endpointMap.entries()) {
    try {
      const body = events.length === 1 ? JSON.stringify(events[0]) : JSON.stringify(events);
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }).catch((err) => {
        console.warn("[Sync] Failed to flush sync events batch:", err);
      });
    } catch (err) {
      console.warn("[Sync] Failed to dispatch batch:", err);
    }
  }
}

function scheduleFlush(): void {
  if (batchFlushTimer || batchFlushRaf) return;

  if (typeof requestAnimationFrame === "function") {
    batchFlushRaf = requestAnimationFrame(() => {
      batchFlushRaf = null;
      flushSyncEvents();
    });
  } else {
    batchFlushTimer = setTimeout(() => {
      batchFlushTimer = null;
      flushSyncEvents();
    }, 16);
  }
}

/**
 * Sends a press or release event to the server to notify all users in the room.
 */
export async function sendSyncEvent(
  phase: SyncActionPhase,
  inputType: SyncInputType,
  trigger: string,
  options?: Partial<SyncDispatchOptions> & {
    actionId?: string;
    payload?: Record<string, unknown>;
    immediate?: boolean;
  }
): Promise<SyncEventPayload> {
  const merged: SyncDispatchOptions = {
    roomId: options?.roomId ?? defaultDispatchOptions.roomId ?? "default-room",
    userId: options?.userId ?? defaultDispatchOptions.userId ?? "anonymous-user",
    apiEndpoint: options?.apiEndpoint ?? defaultDispatchOptions.apiEndpoint ?? "/api/sync/events",
    broadcastRemote: options?.broadcastRemote ?? defaultDispatchOptions.broadcastRemote ?? true,
    executeLocal: options?.executeLocal ?? defaultDispatchOptions.executeLocal ?? true,
  };

  const event: SyncEventPayload = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    roomId: merged.roomId,
    userId: merged.userId,
    phase,
    inputType,
    trigger,
    actionId: options?.actionId,
    payload: options?.payload,
    timestamp: Date.now(),
  };

  // If local execution is requested, execute registered action handler immediately
  if (merged.executeLocal) {
    try {
      syncRegistry.execute(event, false);
    } catch (err) {
      console.error("[Sync] Error running local handler:", err);
    }
  }

  // Broadcast to transport (WebRTC UDP or /api endpoint)
  if (merged.broadcastRemote && typeof window !== "undefined") {
    // If an active UDP stream transport is connected, deliver directly to it
    if (activeTransportSink) {
      try {
        const handled = activeTransportSink(event);
        if (handled !== false) {
          return event;
        }
      } catch (err) {
        console.warn("[Sync] Active transport send failed, falling back to HTTP:", err);
      }
    }

    // High-priority discrete actions (e.g. slashes, damage, button clicks) flush immediately.
    // Continuous movements and input intents can be micro-batched into a 16ms frame window.
    const isHighPriority =
      options?.immediate ??
      (phase !== "hold" &&
        options?.actionId !== "player_move" &&
        options?.actionId !== "player_input" &&
        trigger !== "player_move" &&
        trigger !== "player_input");

    const endpoint = merged.apiEndpoint || "/api/sync/events";

    if (isHighPriority) {
      // If we have pending buffered movements, flush them alongside this high-priority event
      pendingBatchQueue.push({ event, endpoint });
      flushSyncEvents();
    } else {
      pendingBatchQueue.push({ event, endpoint });
      // Cap buffer size to avoid unbounded memory if loop stalls
      if (pendingBatchQueue.length > 50) {
        flushSyncEvents();
      } else {
        scheduleFlush();
      }
    }
  }

  return event;
}

export function userOnPress(
  inputType: SyncInputType,
  trigger: string,
  options?: Partial<SyncDispatchOptions> & {
    actionId?: string;
    payload?: Record<string, unknown>;
  }
): Promise<SyncEventPayload> {
  return sendSyncEvent("press", inputType, trigger, options);
}

export function userOnHold(
  inputType: SyncInputType,
  trigger: string,
  durationMs?: number,
  options?: Partial<SyncDispatchOptions> & {
    actionId?: string;
    payload?: Record<string, unknown>;
  }
): Promise<SyncEventPayload> {
  return sendSyncEvent("hold", inputType, trigger, {
    ...options,
    payload: {
      ...options?.payload,
      durationMs,
    },
  });
}

export function userOnRelease(
  inputType: SyncInputType,
  trigger: string,
  options?: Partial<SyncDispatchOptions> & {
    actionId?: string;
    payload?: Record<string, unknown>;
  }
): Promise<SyncEventPayload> {
  return sendSyncEvent("release", inputType, trigger, options);
}

export interface DressOptions<TArgs extends any[] = any[], TReturn = any> {
  actionId?: string;
  trigger: string;
  inputType?: SyncInputType;
  roomId?: string;
  userId?: string;
  apiEndpoint?: string;
  executeOn?: SyncActionPhase | "both" | "any";
  registerOnLoad?: boolean;
  preventDefault?: boolean;
  description?: string;
}

/**
 * Dresses any function so that when invoked, pressed, held, or released,
 * it notifies /api as userOnPress/userOnHold/userOnRelease and coordinates across the room.
 */
export function dressSyncFunction<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: DressOptions<TArgs, TReturn>
): {
  (...args: TArgs): Promise<TReturn>;
  onPress: (...args: TArgs) => Promise<SyncEventPayload>;
  onHold: (durationMs?: number, ...args: TArgs) => Promise<SyncEventPayload>;
  onRelease: (...args: TArgs) => Promise<SyncEventPayload>;
  trigger: string;
  inputType: SyncInputType;
  actionId: string;
  unregister: () => void;
} {
  const inputType = options.inputType ?? "key";
  const actionId = options.actionId ?? `action_${options.trigger}_${Math.random().toString(36).slice(2, 7)}`;
  const executeOn = options.executeOn ?? "press";

  // Register in the registry if requested
  const unregister = registerSyncAction(actionId, {
    trigger: options.trigger,
    inputType,
    description: options.description,
    handler: ({ event }, ...args) => {
      if (executeOn === "any" || executeOn === "both" || event.phase === executeOn) {
        return fn(...(args as unknown as TArgs));
      }
      return null;
    },
    preventDefault: options.preventDefault,
  });

  const onPress = async (...args: TArgs): Promise<SyncEventPayload> => {
    const payload = args.length > 0 && typeof args[0] === "object" && !(args[0] instanceof Event)
      ? (args[0] as Record<string, unknown>)
      : undefined;

    return userOnPress(inputType, options.trigger, {
      actionId,
      roomId: options.roomId,
      userId: options.userId,
      apiEndpoint: options.apiEndpoint,
      payload,
    });
  };

  const onHold = async (durationMs?: number, ...args: TArgs): Promise<SyncEventPayload> => {
    const payload = args.length > 0 && typeof args[0] === "object" && !(args[0] instanceof Event)
      ? (args[0] as Record<string, unknown>)
      : undefined;

    return userOnHold(inputType, options.trigger, durationMs, {
      actionId,
      roomId: options.roomId,
      userId: options.userId,
      apiEndpoint: options.apiEndpoint,
      payload,
    });
  };

  const onRelease = async (...args: TArgs): Promise<SyncEventPayload> => {
    const payload = args.length > 0 && typeof args[0] === "object" && !(args[0] instanceof Event)
      ? (args[0] as Record<string, unknown>)
      : undefined;

    return userOnRelease(inputType, options.trigger, {
      actionId,
      roomId: options.roomId,
      userId: options.userId,
      apiEndpoint: options.apiEndpoint,
      payload,
    });
  };

  // Wrapped function execution: triggers onPress and runs original function
  const dressed = async (...args: TArgs): Promise<TReturn> => {
    await onPress(...args);
    return fn(...args);
  };

  dressed.onPress = onPress;
  dressed.onHold = onHold;
  dressed.onRelease = onRelease;
  dressed.trigger = options.trigger;
  dressed.inputType = inputType;
  dressed.actionId = actionId;
  dressed.unregister = unregister;

  return dressed;
}
