"use client";

import { useState, useEffect, useRef } from "react";

export interface UseMotionMountResult {
  mounted: boolean;
  entered: boolean;
  closing: boolean;
}

export function useMotionMount(open: boolean, duration: number): UseMotionMountResult {
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setClosing(false);
      setMounted(true);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setEntered(true);
        });
      });
    } else {
      if (mounted) {
        setEntered(false);
        setClosing(true);
        timerRef.current = setTimeout(() => {
          setMounted(false);
          setClosing(false);
        }, duration);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, mounted, duration]);

  return { mounted, entered, closing };
}
