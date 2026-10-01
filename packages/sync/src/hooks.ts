"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { SyncEventPayload, SyncInputType } from "./types";
import { syncRegistry } from "./registry";
import {
  userOnPress,
  userOnHold,
  userOnRelease,
  sendSyncEvent,
  configureSyncDefaults,
  registerSyncTransportSink,
} from "./dress";
import { WebRTCUDPTransport, TransportProtocol } from "./transport";

export interface UseSyncRoomOptions {
  roomId: string;
  userId?: string;
  userName?: string;
  eventsUrl?: string;
  preferUdp?: boolean;
  autoConnect?: boolean;
  onEventReceived?: (event: SyncEventPayload) => void;
  onMemberChange?: (members: string[]) => void;
}

export function useSyncRoom(options: UseSyncRoomOptions) {
  const {
    roomId,
    userId = typeof window !== "undefined"
      ? (window.sessionStorage.getItem("mono_sync_uid") ||
         (() => {
           const id = `user_${Math.random().toString(36).slice(2, 9)}`;
           window.sessionStorage.setItem("mono_sync_uid", id);
           return id;
         })())
      : "guest",
    userName = "Guest",
    eventsUrl = "/api/sync/events",
    preferUdp = true,
    autoConnect = true,
    onEventReceived,
    onMemberChange,
  } = options;

  const [connected, setConnected] = useState(false);
  const [protocol, setProtocol] = useState<TransportProtocol>("sse");
  const [members, setMembers] = useState<string[]>([]);
  const [recentEvents, setRecentEvents] = useState<SyncEventPayload[]>([]);
  const transportRef = useRef<WebRTCUDPTransport | null>(null);

  // Sync defaults so userOnPress / userOnRelease use current room/user
  useEffect(() => {
    configureSyncDefaults({
      roomId,
      userId,
      apiEndpoint: eventsUrl,
    });
  }, [roomId, userId, eventsUrl]);

  const handleEvent = useCallback(
    (payload: SyncEventPayload) => {
      setRecentEvents((prev) => [payload, ...prev].slice(0, 50));
      onEventReceived?.(payload);

      // Execute action if it came from a remote user
      if (payload.userId !== userId) {
        syncRegistry.execute(payload, true);
      }
    },
    [onEventReceived, userId]
  );

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !autoConnect) return;

    if (transportRef.current) {
      transportRef.current.disconnect();
    }

    const transport = new WebRTCUDPTransport({
      roomId,
      userId,
      userName,
      signalingUrl: eventsUrl,
      onEventReceived: handleEvent,
      onMemberChange: (memberList) => {
        setMembers(memberList);
        onMemberChange?.(memberList);
      },
      onStatusChange: (isConnected, currentProtocol) => {
        setConnected(isConnected);
        setProtocol(currentProtocol);
      },
    });

    transportRef.current = transport;

    // Register transport sink for sendSyncEvent
    registerSyncTransportSink((event) => {
      if (transport.connected) {
        transport.send(event);
        return true;
      }
      return false; // Fall back to HTTP if not connected yet
    });

    transport.connect();
  }, [roomId, userId, userName, eventsUrl, autoConnect, handleEvent, onMemberChange]);

  const disconnect = useCallback(() => {
    registerSyncTransportSink(null);
    if (transportRef.current) {
      transportRef.current.disconnect();
      transportRef.current = null;
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [connect, disconnect, autoConnect]);

  const broadcastEvent = useCallback(
    (actionId: string, payload?: Record<string, unknown>, phase: "press" | "hold" | "release" = "press") => {
      const event: SyncEventPayload = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        roomId,
        userId,
        phase,
        inputType: "custom",
        trigger: actionId,
        actionId,
        payload,
        timestamp: Date.now(),
      };

      // Fast-path: if UDP transport is connected, deliver directly with zero queuing
      if (transportRef.current && transportRef.current.connected) {
        transportRef.current.send(event);
        return Promise.resolve(event);
      }

      return sendSyncEvent(phase, "custom", actionId, {
        actionId,
        payload,
        roomId,
        userId,
        apiEndpoint: eventsUrl,
      });
    },
    [roomId, userId, eventsUrl]
  );

  return {
    connected,
    protocol,
    members,
    recentEvents,
    connect,
    disconnect,
    broadcastEvent,
    userId,
    roomId,
  };
}

export interface KeyBindingConfig {
  inputType?: SyncInputType;
  actionId?: string;
  description?: string;
  preventDefault?: boolean;
  payload?: Record<string, unknown>;
  holdThresholdMs?: number;
  emitHoldRepeat?: boolean;
  holdRepeatIntervalMs?: number;
}

export interface KeyBindingMap {
  [keyOrButton: string]: KeyBindingConfig;
}

/**
 * Hook to automatically bind keydown/keyup and mousedown/mouseup to registered actions,
 * supporting distinct userOnPress, userOnHold, and userOnRelease events.
 */
export function useSyncInput(bindings: KeyBindingMap, enabled = true) {
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const pressStartTimes = new Map<string, number>();
    const holdTimers = new Map<string, ReturnType<typeof setTimeout>>();
    const holdIntervals = new Map<string, ReturnType<typeof setInterval>>();
    const heldKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore native OS auto-repeat events while key is held down
      if (e.repeat) {
        return;
      }

      const target = e.target as HTMLElement | null;
      // Skip if typing in an input or textarea
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      const key = e.key.toUpperCase();
      const currentBindings = bindingsRef.current;
      const binding = currentBindings[key] || currentBindings[e.code] || currentBindings[e.key];

      if (binding && !pressStartTimes.has(key)) {
        const startTime = Date.now();
        pressStartTimes.set(key, startTime);

        if (binding.preventDefault) {
          e.preventDefault();
        }

        // 1. Fire distinct userOnPress
        userOnPress(binding.inputType ?? "key", key, {
          actionId: binding.actionId,
          payload: binding.payload,
        });

        // 2. Set timer to trigger userOnHold
        const threshold = binding.holdThresholdMs ?? 300;
        const timer = setTimeout(() => {
          heldKeys.add(key);
          const duration = Date.now() - startTime;
          userOnHold(binding.inputType ?? "key", key, duration, {
            actionId: binding.actionId,
            payload: binding.payload,
          });

          if (binding.emitHoldRepeat) {
            const interval = setInterval(() => {
              const currentDuration = Date.now() - startTime;
              userOnHold(binding.inputType ?? "key", key, currentDuration, {
                actionId: binding.actionId,
                payload: binding.payload,
              });
            }, binding.holdRepeatIntervalMs ?? 200);
            holdIntervals.set(key, interval);
          }
        }, threshold);

        holdTimers.set(key, timer);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const currentBindings = bindingsRef.current;
      const binding = currentBindings[key] || currentBindings[e.code] || currentBindings[e.key];

      if (binding && pressStartTimes.has(key)) {
        const timer = holdTimers.get(key);
        if (timer) {
          clearTimeout(timer);
          holdTimers.delete(key);
        }

        const interval = holdIntervals.get(key);
        if (interval) {
          clearInterval(interval);
          holdIntervals.delete(key);
        }

        const wasHeld = heldKeys.has(key);
        heldKeys.delete(key);
        pressStartTimes.delete(key);

        if (binding.preventDefault) {
          e.preventDefault();
        }

        // 3. Only fire userOnRelease if the input was actually held (avoiding redundancy on quick taps)
        if (wasHeld) {
          userOnRelease(binding.inputType ?? "key", key, {
            actionId: binding.actionId,
            payload: binding.payload,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      holdTimers.forEach((t) => clearTimeout(t));
      holdIntervals.forEach((i) => clearInterval(i));
      holdTimers.clear();
      holdIntervals.clear();
      pressStartTimes.clear();
      heldKeys.clear();
    };
  }, [enabled]);
}

export interface HoldButtonHandlers {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

/**
 * Helper hook to attach press, hold, and release to interactive UI buttons/cards.
 */
export function useSyncHoldButton(
  dressedAction: {
    onPress: (...args: any[]) => Promise<any>;
    onHold: (durationMs?: number, ...args: any[]) => Promise<any>;
    onRelease: (...args: any[]) => Promise<any>;
  },
  options?: {
    holdThresholdMs?: number;
    emitHoldRepeat?: boolean;
    holdRepeatIntervalMs?: number;
  }
): HoldButtonHandlers {
  const startTimeRef = useRef<number | null>(null);
  const wasHeldRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearHold = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    clearHold();
    const startTime = Date.now();
    startTimeRef.current = startTime;
    wasHeldRef.current = false;

    // Fire userOnPress
    dressedAction.onPress();

    // Start timer for userOnHold
    const threshold = options?.holdThresholdMs ?? 300;
    timerRef.current = setTimeout(() => {
      wasHeldRef.current = true;
      const duration = Date.now() - startTime;
      dressedAction.onHold(duration);

      if (options?.emitHoldRepeat) {
        intervalRef.current = setInterval(() => {
          const currentDuration = Date.now() - startTime;
          dressedAction.onHold(currentDuration);
        }, options?.holdRepeatIntervalMs ?? 200);
      }
    }, threshold);
  }, [dressedAction, options, clearHold]);

  const handleEnd = useCallback(() => {
    clearHold();
    if (startTimeRef.current !== null) {
      startTimeRef.current = null;
      // Only fire userOnRelease if the user was holding (suppress for quick taps)
      if (wasHeldRef.current) {
        wasHeldRef.current = false;
        dressedAction.onRelease();
      }
    }
  }, [dressedAction, clearHold]);

  useEffect(() => {
    return () => {
      clearHold();
    };
  }, [clearHold]);

  return {
    onMouseDown: handleStart,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: handleStart,
    onTouchEnd: handleEnd,
  };
}
