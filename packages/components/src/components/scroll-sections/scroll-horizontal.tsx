"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import type { ScrollHorizontalProps } from "./types";
import { cx, usePinProgress } from "./use-scroll-progress";
import "./scroll-horizontal.css";

export function ScrollHorizontal({
  children,
  header,
  length,
  itemWidth,
  gap = "2rem",
  className,
  style,
  ...rest
}: ScrollHorizontalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const count = Array.isArray(children) ? Math.max(children.length, 1) : 1;
  const scrollLength = length ?? count;

  usePinProgress(ref);

  const hasCustomWidth = Boolean(itemWidth);

  return (
    <div
      ref={ref}
      data-mono="scroll-horizontal"
      className={cx("mono-scroll-horizontal", className)}
      style={{ height: `${scrollLength * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-horizontal-viewport">
        {header && <div className="mono-horizontal-header">{header}</div>}
        <div
          className="mono-horizontal-track"
          style={
            hasCustomWidth
              ? ({
                  width: "max-content",
                  gap,
                  padding: `0 max(0px, calc((100vw - (${itemWidth})) / 2))`,
                  "--m-track-shift": `calc(${count - 1} * (${itemWidth} + ${gap}))`,
                } as CSSProperties)
              : ({
                  width: `${count * 100}%`,
                  "--m-track-shift": `${((count - 1) / count) * 100}%`,
                } as CSSProperties)
          }
        >
          {(Array.isArray(children) ? children : [children]).map((child, index) => (
            <div
              key={index}
              className="mono-horizontal-slide"
              style={hasCustomWidth ? { width: itemWidth, flex: "none" } : undefined}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
