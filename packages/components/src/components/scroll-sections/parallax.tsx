"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import type { ParallaxProps } from "./types";
import { cx, useScrollProgress } from "./use-scroll-progress";
import "./parallax.css";

export function Parallax({ children, speed = -0.2, className, style, ...rest }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollProgress(ref);

  return (
    <div
      ref={ref}
      data-mono="parallax"
      className={cx("parallax", className)}
      style={{ "--m-parallax-speed": speed, ...style } as CSSProperties}
      {...rest}
    >
      <div className="mono-parallax-inner">{children}</div>
    </div>
  );
}
