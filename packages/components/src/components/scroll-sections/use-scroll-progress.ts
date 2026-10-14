"use client";

import { useEffect, useRef, type RefObject } from "react";

export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Global centralized RAF scroll engine for @mono/components
 * Runs a single high-performance RAF loop and dispatches to all active subscribers.
 * Works across window scroll, document scroll, touch, wheel, resize, and Lenis momentum scroll.
 * Always active and never gated by reduced-motion settings.
 */
class GlobalScrollEngine {
  private subscribers = new Set<() => void>();
  private rafId = 0;
  private isListening = false;

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    this.startListening();
    // Run an immediate tick on subscription
    this.scheduleTick();

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stopListening();
      }
    };
  }

  public scheduleTick = () => {
    if (this.rafId) return;
    if (typeof window === "undefined") return;

    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      this.subscribers.forEach((cb) => {
        try {
          cb();
        } catch (err) {
          console.error("[GlobalScrollEngine] subscriber error:", err);
        }
      });
    });
  };

  private startListening() {
    if (this.isListening || typeof window === "undefined") return;
    this.isListening = true;

    window.addEventListener("scroll", this.scheduleTick, { passive: true });
    document.addEventListener("scroll", this.scheduleTick, { passive: true });
    window.addEventListener("wheel", this.scheduleTick, { passive: true });
    window.addEventListener("touchmove", this.scheduleTick, { passive: true });
    window.addEventListener("resize", this.scheduleTick, { passive: true });
    window.addEventListener("orientationchange", this.scheduleTick, { passive: true });

    // Initial tick on start
    this.scheduleTick();
  }

  private stopListening() {
    if (!this.isListening || typeof window === "undefined") return;
    this.isListening = false;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }

    window.removeEventListener("scroll", this.scheduleTick);
    document.removeEventListener("scroll", this.scheduleTick);
    window.removeEventListener("wheel", this.scheduleTick);
    window.removeEventListener("touchmove", this.scheduleTick);
    window.removeEventListener("resize", this.scheduleTick);
    window.removeEventListener("orientationchange", this.scheduleTick);
  }
}

export const globalScrollEngine = new GlobalScrollEngine();

export function useScrollLoop<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onFrame: () => void,
  enabled = true
) {
  const frameRef = useRef(onFrame);
  frameRef.current = onFrame;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const tick = () => {
      const el = ref.current;
      if (!el || !el.isConnected) return;
      frameRef.current();
    };

    // Subscribe to global engine
    const unsubscribe = globalScrollEngine.subscribe(tick);

    // Initial frame on mount
    tick();

    return () => {
      unsubscribe();
    };
  }, [ref, enabled]);
}

export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true) {
  useScrollLoop(
    ref,
    () => {
      const el = ref.current;
      if (!el || typeof window === "undefined") return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const progress = clamp01((vh - rect.top) / Math.max(rect.height + vh, 1));
      el.style.setProperty("--m-progress", progress.toFixed(4));
    },
    enabled
  );
}

export function usePinProgress<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true) {
  useScrollLoop(
    ref,
    () => {
      const el = ref.current;
      if (!el || typeof window === "undefined") return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const progress = clamp01(-rect.top / Math.max(rect.height - vh, 1));
      el.style.setProperty("--m-progress", progress.toFixed(4));
    },
    enabled
  );
}
