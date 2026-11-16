"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import type { PresentationZoomProps } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

export function PresentationZoom({
  children,
  length = 2.5,
  mode = "portal",
  overlay,
  backdrop,
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationZoomProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { progress } = usePresentationScroll(ref, { smooth, springConfig });

  const scale = useTransform(
    progress,
    [0, 0.75, 1],
    mode === "zoom-out"
      ? [1, 0.55, 0.28]
      : mode === "zoom-in"
        ? [0.35, 1, 1.08]
        : [0.55, 1.8, 3.2]
  );

  const targetOpacity = useTransform(
    progress,
    [0, 0.4, 0.85, 1],
    mode === "zoom-out"
      ? [1, 0.85, 0.35, 0.1]
      : mode === "zoom-in"
        ? [0.15, 0.85, 1, 1]
        : [1, 1, 0.95, 0.85]
  );

  const borderRadius = useTransform(
    progress,
    [0, 0.7, 1],
    mode === "portal" ? ["28px", "12px", "0px"] : ["20px", "20px", "20px"]
  );

  const overlayOpacity = useTransform(progress, [0.48, 0.78, 1], [0, 1, 1]);
  const overlayY = useTransform(progress, [0.48, 0.78, 1], [32, 0, 0]);

  return (
    <div
      ref={ref}
      data-mono="presentation-zoom"
      data-zoom-mode={mode}
      className={cx("mono-pres-zoom", className)}
      style={{ height: `${Math.max(length, 1.2) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-pres-zoom-viewport">
        {backdrop && <div className="mono-pres-zoom-backdrop">{backdrop}</div>}

        <motion.div
          className="mono-pres-zoom-target"
          style={{
            scale,
            opacity: targetOpacity,
            borderRadius,
          }}
        >
          {children}
        </motion.div>

        {overlay && (
          <motion.div
            className="mono-pres-zoom-overlay"
            style={{ opacity: overlayOpacity, y: overlayY }}
          >
            {overlay}
          </motion.div>
        )}
      </div>
    </div>
  );
}
