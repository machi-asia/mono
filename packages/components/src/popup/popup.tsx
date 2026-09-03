"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useMotionMount } from "../motion/motion";
import "./popup.css";

export type PopupPosition = "top" | "bottom" | "left" | "right";
const POPUP_DURATION = 200;

export interface PopupProps {
  trigger: ReactNode;
  children: ReactNode;
  position?: PopupPosition;
}

export function Popup({ trigger, children, position = "bottom" }: PopupProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, entered } = useMotionMount(open, POPUP_DURATION);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="m-popup" data-mono="popup">
      <span onClick={() => setOpen(!open)} className="m-popup-trigger">
        {trigger}
      </span>
      {mounted ? (
        <div
          className={`m-popup-content m-popup-content--${position} ${entered ? "m-popup-content--entered" : ""}`}
          role="dialog"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
