"use client";

import React from "react";
import { Tooltip as MonoTooltip, type TooltipPosition } from "@mono/components";

export type TooltipVariant = "default" | "hotkey" | "compact" | "accent";

export interface TooltipProps {
  variant?: TooltipVariant;
  content: React.ReactNode;
  hotkey?: string;
  side?: "top" | "bottom" | "left" | "right";
  delayDuration?: number;
  children: React.ReactNode;
  className?: string;
}

export const componentVariants = [
  {
    label: "Default",
    props: { variant: "default" as TooltipVariant, content: "Quick Note Tooltip", children: <button>Hover me</button> },
  },
  {
    label: "Hotkey",
    props: { variant: "hotkey" as TooltipVariant, content: "Create New Note", hotkey: "Alt+N", children: <button>New Note</button> },
  },
];

export default function Tooltip({
  variant = "default",
  content,
  hotkey,
  side = "top",
  children,
  className = "",
}: TooltipProps) {
  const tooltipContent = (
    <div className={`tooltip-inner tooltip-${variant} ${className}`.trim()}>
      <span className="tooltip-label">{content}</span>
      {hotkey && (
        <kbd className="tooltip-kbd" aria-label={`Keyboard shortcut: ${hotkey}`}>
          {hotkey}
        </kbd>
      )}
    </div>
  );

  return (
    <MonoTooltip
      content={tooltipContent}
      position={side as TooltipPosition}
      className={className}
    >
      {children}
    </MonoTooltip>
  );
}
