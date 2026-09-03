"use client";

import { useState, useRef, type ReactNode } from "react";
import "./tooltip.css";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  children: ReactNode;
}

export function Tooltip({ content, position = "top", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  }

  function hide() {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  }

  return (
    <span
      className="m-tooltip-wrap"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible ? (
        <span className={`m-tooltip m-tooltip--${position}`} role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  );
}
