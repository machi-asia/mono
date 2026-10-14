"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import type { ScrollDepthProps } from "./types";
import { cx, usePinProgress } from "./use-scroll-progress";
import "./scroll-depth.css";

export function ScrollDepth({
  children,
  length = 3,
  className,
  style,
  ...rest
}: ScrollDepthProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const items = Array.isArray(children) ? children : [children];
  const count = Math.max(items.length, 1);

  usePinProgress(ref);

  return (
    <div
      ref={ref}
      data-mono="scroll-depth"
      className={cx("mono-scroll-depth", className)}
      style={{ height: `${Math.max(length, 1) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-depth-viewport">
        {items.map((child, index) => (
          <div
            key={index}
            className="mono-depth-layer"
            style={
              {
                "--m-layer-start": (index / count) * 0.55,
                zIndex: count - index,
              } as CSSProperties
            }
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
