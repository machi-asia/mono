"use client";

import { useState, useCallback, type MouseEvent as ReactMouseEvent } from "react";

export function useWorkspaceResizer(initialWidth = 280) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(initialWidth);

  const startResizing = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = sidebarWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const clamped = Math.max(220, Math.min(440, startWidth + delta));
        setSidebarWidth(clamped);
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [sidebarWidth]
  );

  return { sidebarWidth, startResizing };
}
