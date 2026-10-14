"use client";

import { useRef } from "react";
import type { ScrollCurtainProps } from "./types";
import { cx, usePinProgress } from "./use-scroll-progress";
import "./scroll-curtain.css";

export function ScrollCurtain({
  children,
  length = 2,
  direction = "up",
  curtain,
  className,
  style,
  ...rest
}: ScrollCurtainProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePinProgress(ref);

  return (
    <div
      ref={ref}
      data-mono="scroll-curtain"
      data-curtain-direction={direction}
      className={cx("mono-scroll-curtain", direction, className)}
      style={{ height: `${Math.max(length, 1) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-curtain-viewport">
        <div className="mono-curtain-content">{children}</div>
        <div className="mono-curtain-panel">{curtain}</div>
      </div>
    </div>
  );
}
