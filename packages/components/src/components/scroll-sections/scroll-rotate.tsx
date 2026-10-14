"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import type { ScrollRotateProps } from "./types";
import { cx, usePinProgress } from "./use-scroll-progress";
import "./scroll-rotate.css";

export function ScrollRotate({
  children,
  length = 2,
  angle = 180,
  className,
  style,
  ...rest
}: ScrollRotateProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePinProgress(ref);

  return (
    <div
      ref={ref}
      data-mono="scroll-rotate"
      className={cx("mono-scroll-rotate", className)}
      style={{ height: `${Math.max(length, 1) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-rotate-viewport">
        <div
          className="mono-rotate-content"
          style={{ "--m-rotate-angle": `${angle}deg` } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
