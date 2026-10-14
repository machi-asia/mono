"use client";

import { useRef } from "react";
import type { ScrollRevealProps } from "./types";
import { clamp01, cx, useScrollLoop } from "./use-scroll-progress";
import "./scroll-reveal.css";

const DEFAULT_ENTER_WINDOW = 0.35;

export function ScrollReveal({
  children,
  variant = "fade-up",
  className,
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useScrollLoop(ref, () => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 1;
    const entered = Math.max(vh - rect.top, 0);
    const progress = clamp01(entered / (vh * DEFAULT_ENTER_WINDOW));
    el.style.setProperty("--m-progress", progress.toFixed(4));
  });

  return (
    <div
      ref={ref}
      data-mono="scroll-reveal"
      data-variant={variant}
      className={cx("reveal", variant, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
