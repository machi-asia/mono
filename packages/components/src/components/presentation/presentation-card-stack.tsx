"use client";

import { Children, useRef, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PresentationCardStackProps } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

interface StackCardItemProps {
  child: ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
  itemHeight: string | number;
  scaleStep: number;
  topOffsetStep: number;
}

function StackCardItem({
  child,
  index,
  total,
  progress,
  itemHeight,
  scaleStep,
  topOffsetStep,
}: StackCardItemProps) {
  const start = index / Math.max(total, 1);
  const targetScale = Math.max(0.75, 1 - (total - 1 - index) * scaleStep);

  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const opacity = useTransform(
    progress,
    [start, 1],
    [1, index === total - 1 ? 1 : 0.82]
  );

  return (
    <div
      className="mono-pres-stack-card-slot"
      style={{
        height: itemHeight,
        top: `${index * topOffsetStep}px`,
        zIndex: index + 1,
      }}
      data-stack-index={index}
    >
      <motion.div
        className="mono-pres-stack-card-inner"
        style={{ scale, opacity }}
      >
        {child}
      </motion.div>
    </div>
  );
}

export function PresentationCardStack({
  children,
  itemHeight = "82vh",
  scaleStep = 0.06,
  topOffsetStep = 24,
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationCardStackProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const items = Children.toArray(children);
  const total = Math.max(items.length, 1);

  const { progress } = usePresentationScroll(ref, {
    smooth,
    springConfig,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      data-mono="presentation-card-stack"
      className={cx("mono-pres-stack", className)}
      style={style}
      {...rest}
    >
      {items.map((child, index) => (
        <StackCardItem
          key={index}
          child={child}
          index={index}
          total={total}
          progress={progress}
          itemHeight={itemHeight}
          scaleStep={scaleStep}
          topOffsetStep={topOffsetStep}
        />
      ))}
    </div>
  );
}
