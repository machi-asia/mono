"use client";

import { useState, useRef, useEffect, useLayoutEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./tooltip.css";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipVariant = "default" | "help";

export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  children?: ReactNode;
  triggerAriaLabel?: string;
  className?: string;
}

export function Tooltip({
  content,
  position = "top",
  variant = "default",
  children,
  triggerAriaLabel = "More information",
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = () => {
    if (!triggerRef.current) return null;
    const tRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const gap = 8;

    const tipRect = tooltipRef.current
      ? tooltipRef.current.getBoundingClientRect()
      : { width: variant === "help" ? 240 : 160, height: 36 };

    let top = 0;
    let left = 0;

    if (position === "bottom") {
      top = tRect.bottom + gap;
      left = tRect.left + tRect.width / 2 - tipRect.width / 2;
      if (top + tipRect.height > viewportHeight - 8 && tRect.top - tipRect.height - gap > 8) {
        top = tRect.top - tipRect.height - gap;
      }
    } else if (position === "left") {
      top = tRect.top + tRect.height / 2 - tipRect.height / 2;
      left = tRect.left - tipRect.width - gap;
    } else if (position === "right") {
      top = tRect.top + tRect.height / 2 - tipRect.height / 2;
      left = tRect.right + gap;
    } else {
      // default "top"
      top = tRect.top - tipRect.height - gap;
      left = tRect.left + tRect.width / 2 - tipRect.width / 2;
      if (top < 8 && tRect.bottom + tipRect.height + gap < viewportHeight - 8) {
        top = tRect.bottom + gap;
      }
    }

    // Horizontal boundaries
    if (left + tipRect.width > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - tipRect.width - 12);
    }
    if (left < 12) {
      left = 12;
    }

    // Vertical boundaries
    if (top < 8) top = 8;
    if (top + tipRect.height > viewportHeight - 8) {
      top = Math.max(8, viewportHeight - tipRect.height - 8);
    }

    return { top, left };
  };

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const initialPos = calculatePosition();
    if (initialPos) {
      setCoords(initialPos);
    }
    setVisible(true);
  }

  function hide() {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setCoords(null);
    }, 100);
  }

  function toggle() {
    if (visible) {
      hide();
    } else {
      show();
    }
  }

  useLayoutEffect(() => {
    if (visible && triggerRef.current) {
      const pos = calculatePosition();
      if (pos) {
        setCoords(pos);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const handleScrollOrResize = () => {
      const pos = calculatePosition();
      if (pos) {
        setCoords(pos);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [visible]);

  const trigger =
    variant === "help" && !children ? (
      <button
        type="button"
        className="m-tooltip-help-trigger"
        aria-label={triggerAriaLabel}
        onClick={toggle}
        tabIndex={0}
      >
        ?
      </button>
    ) : (
      children
    );

  const tooltipElement = visible ? (
    <span
      ref={tooltipRef}
      className={`m-tooltip m-tooltip--portal m-tooltip--${position} ${variant === "help" ? "m-tooltip--help" : ""}`}
      style={{
        position: "fixed",
        top: `${coords ? coords.top : (triggerRef.current ? triggerRef.current.getBoundingClientRect().top - 40 : 0)}px`,
        left: `${coords ? coords.left : (triggerRef.current ? triggerRef.current.getBoundingClientRect().left : 0)}px`,
        pointerEvents: "none",
        zIndex: 999999,
        visibility: "visible",
      }}
      role="tooltip"
    >
      {content}
    </span>
  ) : null;

  return (
    <span
      ref={triggerRef}
      className={`m-tooltip-wrap ${variant === "help" ? "m-tooltip-wrap--help" : ""} ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      {mounted && typeof document !== "undefined"
        ? createPortal(tooltipElement, document.body)
        : tooltipElement}
    </span>
  );
}
