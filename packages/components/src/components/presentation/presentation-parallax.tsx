"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PresentationParallaxLayer, PresentationParallaxProps } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

function ParallaxLayerView({
  layer,
  progress,
}: {
  layer: PresentationParallaxLayer;
  progress: MotionValue<number>;
}) {
  const maxDrift = layer.speed * 180;
  const y = useTransform(progress, [0, 1], [-maxDrift, maxDrift]);
  const scaleRange = layer.scale ?? [1, 1];
  const scale = useTransform(progress, [0, 1], scaleRange);

  return (
    <motion.div
      className={cx("mono-pres-parallax-layer", layer.className)}
      style={{
        ...layer.style,
        y,
        scale,
      }}
    >
      {layer.content}
    </motion.div>
  );
}

export function PresentationParallax({
  children,
  height = "80vh",
  layers = [],
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { progress } = usePresentationScroll(ref, {
    smooth,
    springConfig,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      data-mono="presentation-parallax"
      className={cx("mono-pres-parallax", className)}
      style={{ height, ...style }}
      {...rest}
    >
      {layers.map((layer, index) => (
        <ParallaxLayerView
          key={layer.id ?? index}
          layer={layer}
          progress={progress}
        />
      ))}

      {children && <div className="mono-pres-parallax-content">{children}</div>}
    </div>
  );
}
