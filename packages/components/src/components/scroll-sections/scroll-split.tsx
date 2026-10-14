"use client";

import { useRef } from "react";
import type { ScrollSplitProps } from "./types";
import { cx, usePinProgress } from "./use-scroll-progress";
import "./scroll-split.css";

export function ScrollSplit({
  children,
  length = 2,
  direction = "horizontal",
  panelA,
  panelB,
  panelClassName,
  panelStyle,
  className,
  style,
  ...rest
}: ScrollSplitProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePinProgress(ref);

  const hasPanelContent = Boolean(panelA || panelB);

  return (
    <div
      ref={ref}
      data-mono="scroll-split"
      data-split-direction={direction}
      className={cx("mono-scroll-split", direction, className)}
      style={{ height: `${Math.max(length, 1) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-split-viewport">
        <div className="mono-split-content">{children}</div>
        <div className="mono-split-panels" aria-hidden={hasPanelContent ? undefined : true}>
          <div className={cx("mono-split-panel", "mono-split-panelA", panelClassName)} style={panelStyle}>
            {panelA}
          </div>
          <div className={cx("mono-split-panel", "mono-split-panelB", panelClassName)} style={panelStyle}>
            {panelB}
          </div>
        </div>
      </div>
    </div>
  );
}
