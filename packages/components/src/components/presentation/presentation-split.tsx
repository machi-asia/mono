"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import type { PresentationSplitProps } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

export function PresentationSplit({
  children,
  length = 2,
  direction = "horizontal",
  panelA,
  panelB,
  panelClassName,
  panelStyle,
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationSplitProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { progress } = usePresentationScroll(ref, { smooth, springConfig });

  const shiftA = useTransform(progress, [0, 0.85, 1], ["0%", "-102%", "-102%"]);
  const shiftB = useTransform(progress, [0, 0.85, 1], ["0%", "102%", "102%"]);
  const contentScale = useTransform(progress, [0, 0.85, 1], [0.88, 1, 1]);
  const contentOpacity = useTransform(progress, [0, 0.4, 0.85], [0.35, 0.85, 1]);

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={ref}
      data-mono="presentation-split"
      data-split-direction={direction}
      className={cx("mono-pres-split", className)}
      style={{ height: `${Math.max(length, 1.2) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-pres-split-viewport">
        <motion.div
          className="mono-pres-split-content"
          style={{ scale: contentScale, opacity: contentOpacity }}
        >
          {children}
        </motion.div>

        <div className="mono-pres-split-panels" aria-hidden="true">
          <motion.div
            className={cx("mono-pres-split-panel", panelClassName)}
            data-dir={direction}
            data-side="a"
            style={{
              ...panelStyle,
              x: isHorizontal ? shiftA : 0,
              y: isHorizontal ? 0 : shiftA,
            }}
          >
            {panelA}
          </motion.div>

          <motion.div
            className={cx("mono-pres-split-panel", panelClassName)}
            data-dir={direction}
            data-side="b"
            style={{
              ...panelStyle,
              x: isHorizontal ? shiftB : 0,
              y: isHorizontal ? 0 : shiftB,
            }}
          >
            {panelB}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
