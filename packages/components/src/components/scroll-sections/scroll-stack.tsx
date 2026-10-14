"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import type { ScrollStackProps } from "./types";
import { clamp01, cx, useScrollLoop } from "./use-scroll-progress";
import "./scroll-stack.css";

export function ScrollStack({
  children,
  itemHeight = "100vh",
  scaleAmount = 0.12,
  dimAmount = 0.35,
  className,
  style,
  ...rest
}: ScrollStackProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useScrollLoop(ref, () => {
    const container = ref.current;
    if (!container) return;
    const layers = Array.from(container.children) as HTMLElement[];
    if (layers.length < 2) return;
    const vh = window.innerHeight || document.documentElement.clientHeight || 1;
    const span = Math.max(vh, 1);
    const arrivals = layers.map((layer) => clamp01((span - layer.getBoundingClientRect().top) / span));
    const MAX_DEPTH = 3;
    for (let i = 0; i < layers.length - 1; i++) {
      const card = layers[i].firstElementChild as HTMLElement | null;
      if (!card) continue;
      let depth = 0;
      for (let j = i + 1; j < layers.length; j++) depth += arrivals[j];
      card.style.setProperty("--m-depth", Math.min(depth, MAX_DEPTH).toFixed(4));
      card.style.setProperty("--m-cover", arrivals[i + 1].toFixed(4));
    }
  });

  return (
    <div
      ref={ref}
      data-mono="scroll-stack"
      className={cx("stack", className)}
      style={
        {
          "--m-stack-scale": scaleAmount,
          "--m-stack-dim": dimAmount,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div key={index} className="mono-stack-layer" style={{ height: itemHeight }}>
              <div className="mono-stack-card">{child}</div>
            </div>
          ))
        : children}
    </div>
  );
}
