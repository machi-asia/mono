"use client";

import { Children, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import type { PresentationHorizontalProps } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

export function PresentationHorizontal({
  children,
  header,
  length,
  gap = "0px",
  showProgress = true,
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationHorizontalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const items = Children.toArray(children);
  const count = Math.max(items.length, 1);
  const scrollLength = length ?? count;

  const { progress } = usePresentationScroll(ref, { smooth, springConfig });

  const endPercent = count > 1 ? -((count - 1) / count) * 100 : 0;
  const x = useTransform(progress, [0, 1], ["0%", `${endPercent}%`]);

  return (
    <div
      ref={ref}
      data-mono="presentation-horizontal"
      className={cx("mono-pres-horizontal", className)}
      style={{ height: `${Math.max(scrollLength, 1) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-pres-horizontal-viewport">
        {header && <div className="mono-pres-horizontal-header">{header}</div>}

        <motion.div
          className="mono-pres-horizontal-track"
          style={{
            x,
            width: `${count * 100}vw`,
            gap,
          }}
        >
          {items.map((child, index) => (
            <div
              key={index}
              className="mono-pres-horizontal-slide"
              data-slide-index={index}
            >
              {child}
            </div>
          ))}
        </motion.div>

        {showProgress && count > 1 && (
          <div className="mono-pres-horizontal-progress-wrap" aria-hidden="true">
            <motion.div
              className="mono-pres-horizontal-progress-fill"
              style={{ scaleX: progress }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
