"use client";

import { useRef } from "react";
import type { ScrollZoomProps } from "./types";
import { cx, usePinProgress } from "./use-scroll-progress";
import "./scroll-zoom.css";

export function ScrollZoom({
  children,
  length = 2,
  mode = "zoom-out",
  className,
  style,
  ...rest
}: ScrollZoomProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePinProgress(ref);

  return (
    <div
      ref={ref}
      data-mono="scroll-zoom"
      data-zoom-mode={mode}
      className={cx("mono-scroll-zoom", className)}
      style={{ height: `${Math.max(length, 1) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-zoom-viewport">
        <div className={cx("mono-zoom-content", mode === "zoom-out" ? "zoomOut" : "zoomIn")}>
          {children}
        </div>
      </div>
    </div>
  );
}
