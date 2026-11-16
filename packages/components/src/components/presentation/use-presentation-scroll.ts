"use client";

import type { RefObject } from "react";
import { useScroll, useSpring, type MotionValue } from "framer-motion";
import type { PresentationSpringConfig } from "./types";

const DEFAULT_SPRING: Required<PresentationSpringConfig> = {
  stiffness: 110,
  damping: 28,
  restDelta: 0.001,
};

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export function usePresentationScroll(
  targetRef: RefObject<HTMLElement | null>,
  options: {
    smooth?: boolean;
    springConfig?: PresentationSpringConfig;
    offset?: ScrollOffset;
  } = {}
): {
  progress: MotionValue<number>;
  rawProgress: MotionValue<number>;
} {
  const {
    smooth = true,
    springConfig,
    offset = ["start start", "end end"],
  } = options;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: springConfig?.stiffness ?? DEFAULT_SPRING.stiffness,
    damping: springConfig?.damping ?? DEFAULT_SPRING.damping,
    restDelta: springConfig?.restDelta ?? DEFAULT_SPRING.restDelta,
  });

  return {
    progress: smooth ? springProgress : scrollYProgress,
    rawProgress: scrollYProgress,
  };
}
