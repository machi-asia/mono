"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { PresentationPinnedSectionProps, PresentationPinnedStep } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

interface StepItemProps {
  step: PresentationPinnedStep;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function PinnedStepView({ step, index, total, progress }: StepItemProps) {
  const slice = 1 / Math.max(total, 1);
  const start = index * slice;
  const end = (index + 1) * slice;
  const fadeInEnd = start + slice * 0.22;
  const fadeOutStart = end - slice * 0.22;

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, fadeOutStart, end]
      : index === total - 1
        ? [start, fadeInEnd, 1]
        : [start, fadeInEnd, fadeOutStart, end],
    index === 0
      ? [1, 1, 0]
      : index === total - 1
        ? [0, 1, 1]
        : [0, 1, 1, 0]
  );

  const y = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [index === 0 ? 0 : 40, 0, 0, index === total - 1 ? 0 : -40]
  );

  const scale = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [index === 0 ? 1 : 0.94, 1, 1, index === total - 1 ? 1 : 0.96]
  );

  return (
    <motion.div
      className="mono-pres-pinned-step"
      style={{ opacity, y, scale }}
      data-step-index={index}
    >
      <div>
        {step.badge && <span className="mono-pres-pinned-step-badge">{step.badge}</span>}
        <h3 className="mono-pres-pinned-step-title">{step.title}</h3>
        {step.description && <div className="mono-pres-pinned-step-desc">{step.description}</div>}
      </div>
      {step.visual && <div>{step.visual}</div>}
    </motion.div>
  );
}

function StepDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slice = 1 / Math.max(total, 1);
  const start = index * slice;
  const end = (index + 1) * slice;
  const scaleX = useTransform(progress, [start, end], [0, 1]);

  return (
    <div className="mono-pres-pinned-dot">
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0% 50%",
          height: "100%",
          width: "100%",
          background: "var(--color-primary, #d4af37)",
        }}
      />
    </div>
  );
}

export function PresentationPinnedSection({
  children,
  length,
  background,
  steps = [],
  header,
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationPinnedSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const totalSteps = Math.max(steps.length, 1);
  const runway = length ?? Math.max(totalSteps + 0.5, 2.5);

  const { progress } = usePresentationScroll(ref, { smooth, springConfig });
  const bgScale = useTransform(progress, [0, 1], [1, 1.12]);

  return (
    <div
      ref={ref}
      data-mono="presentation-pinned"
      className={cx("mono-pres-pinned", className)}
      style={{ height: `${Math.max(runway, 1.2) * 100}vh`, ...style }}
      {...rest}
    >
      <div className="mono-pres-pinned-viewport">
        {background && (
          <motion.div className="mono-pres-pinned-bg" style={{ scale: bgScale }}>
            {background}
          </motion.div>
        )}

        {header && <div className="mono-pres-pinned-header">{header}</div>}

        <div className="mono-pres-pinned-stage">
          {steps.length > 0
            ? steps.map((step, index) => (
                <PinnedStepView
                  key={step.id ?? index}
                  step={step}
                  index={index}
                  total={steps.length}
                  progress={progress}
                />
              ))
            : children}
        </div>

        {steps.length > 1 && (
          <div className="mono-pres-pinned-dots" aria-hidden="true">
            {steps.map((step, index) => (
              <StepDot
                key={step.id ?? index}
                index={index}
                total={steps.length}
                progress={progress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
