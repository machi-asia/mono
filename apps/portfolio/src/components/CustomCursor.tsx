"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CURSOR_SPRING = {
  stiffness: 420,
  damping: 32,
  mass: 0.4,
} as const;

const DEFAULT_SIZE = 14;
const EXPANDED_SIZE = 84;

interface CursorTargetState {
  active: boolean;
  label: string;
}

function subscribeCoarsePointer(onStoreChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(pointer: coarse)");
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", onStoreChange);
    return () => mediaQuery.removeEventListener("change", onStoreChange);
  }

  return () => {};
}

function getCoarsePointerSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return Boolean(window.matchMedia("(pointer: coarse)")?.matches);
}

function getCoarsePointerServerSnapshot(): boolean {
  return false;
}

function resolveCursorState(target: EventTarget | null): CursorTargetState {
  const node = target as Node | null;
  const element =
    node && typeof (node as Element).closest === "function"
      ? (node as Element)
      : (node?.parentElement ?? null);

  if (!element) {
    return { active: false, label: "" };
  }

  const cursorHost = element.closest("[data-cursor]");
  const invertHost = element.closest("[data-cursor-invert]");

  if (!cursorHost && !invertHost) {
    return { active: false, label: "" };
  }

  const rawCursor = cursorHost?.getAttribute("data-cursor")?.trim() ?? "";
  const rawInvert = invertHost?.getAttribute("data-cursor-invert")?.trim() ?? "";

  let label = "";
  if (invertHost && cursorHost && invertHost !== cursorHost && cursorHost.contains(invertHost)) {
    label = rawInvert && rawInvert.toLowerCase() !== "true" ? rawInvert.toUpperCase() : "INVERT";
  } else if (cursorHost) {
    if (rawCursor) {
      label = rawCursor.toUpperCase();
    } else if (invertHost) {
      label = rawInvert && rawInvert.toLowerCase() !== "true" ? rawInvert.toUpperCase() : "INVERT";
    }
  } else if (invertHost) {
    label = rawInvert && rawInvert.toLowerCase() !== "true" ? rawInvert.toUpperCase() : "INVERT";
  }

  return { active: true, label };
}

export function CustomCursor() {
  const isCoarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointerSnapshot,
    getCoarsePointerServerSnapshot
  );

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, CURSOR_SPRING);
  const springY = useSpring(cursorY, CURSOR_SPRING);

  const [cursorState, setCursorState] = useState<CursorTargetState>({
    active: false,
    label: "",
  });
  const [isPointerHidden, setIsPointerHidden] = useState(false);

  useEffect(() => {
    if (isCoarsePointer || typeof window === "undefined") {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (typeof event.clientX === "number" && typeof event.clientY === "number") {
        cursorX.set(event.clientX);
        cursorY.set(event.clientY);
      }

      setIsPointerHidden((prev) => (prev ? false : prev));

      const nextState = resolveCursorState(event.target);
      setCursorState((prev) => {
        if (prev.active === nextState.active && prev.label === nextState.label) {
          return prev;
        }
        return nextState;
      });
    };

    const handlePointerLeave = () => {
      setIsPointerHidden(true);
      setCursorState((prev) => (prev.active || prev.label ? { active: false, label: "" } : prev));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement?.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement?.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [isCoarsePointer, cursorX, cursorY]);

  if (isCoarsePointer) {
    return null;
  }

  const size = cursorState.active ? EXPANDED_SIZE : DEFAULT_SIZE;
  const offset = -size / 2;

  return (
    <motion.div
      data-testid="custom-cursor"
      data-active={cursorState.active ? "true" : "false"}
      data-size={String(size)}
      aria-hidden="true"
      initial={{
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        marginLeft: -DEFAULT_SIZE / 2,
        marginTop: -DEFAULT_SIZE / 2,
      }}
      animate={{
        width: size,
        height: size,
        marginLeft: offset,
        marginTop: offset,
        opacity: isPointerHidden ? 0 : 1,
      }}
      transition={{
        width: { type: "spring", stiffness: 360, damping: 28, mass: 0.4 },
        height: { type: "spring", stiffness: 360, damping: 28, mass: 0.4 },
        marginLeft: { type: "spring", stiffness: 360, damping: 28, mass: 0.4 },
        marginTop: { type: "spring", stiffness: 360, damping: 28, mass: 0.4 },
        opacity: { duration: 0.16 },
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        pointerEvents: "none",
        zIndex: 9999,
        borderRadius: "9999px",
        mixBlendMode: "difference",
        backdropFilter: "invert(1)",
        WebkitBackdropFilter: "invert(1)",
        border: cursorState.active
          ? "1px solid var(--shade-inversion, #f4f4f0)"
          : "1.5px solid var(--shade-inversion, #f4f4f0)",
        backgroundColor: cursorState.active
          ? "rgb(244 244 240 / 8%)"
          : "rgb(244 244 240 / 85%)",
        color: "var(--shade-inversion, #f4f4f0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {cursorState.active && cursorState.label ? (
        <span
          data-testid="custom-cursor-label"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            lineHeight: 1.15,
            textTransform: "uppercase",
            textAlign: "center",
            padding: "0 8px",
            color: "var(--shade-inversion, #f4f4f0)",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {cursorState.label}
        </span>
      ) : null}
    </motion.div>
  );
}

export default CustomCursor;
