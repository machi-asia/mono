"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const isScrollableNode = (node: HTMLElement): boolean => {
      if (!node || !(node instanceof HTMLElement) || node === document.body || node === document.documentElement) {
        return false;
      }

      // 1. Explicit lenis-prevent attributes
      if (
        node.hasAttribute("data-lenis-prevent") ||
        node.hasAttribute("data-lenis-prevent-wheel") ||
        node.hasAttribute("data-lenis-prevent-touch")
      ) {
        return true;
      }

      // 2. Form elements
      const tagName = node.tagName;
      if (tagName === "TEXTAREA" || tagName === "SELECT") {
        return true;
      }

      // 3. Fast bounds check for scrollable overflow
      const hasScrollY = node.scrollHeight > node.clientHeight;
      const hasScrollX = node.scrollWidth > node.clientWidth;
      if (!hasScrollY && !hasScrollX) {
        return false;
      }

      // 4. Computed style overflow check
      const style = window.getComputedStyle(node);
      if (hasScrollY && (style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowY === "overlay")) {
        return true;
      }
      if (hasScrollX && (style.overflowX === "auto" || style.overflowX === "scroll" || style.overflowX === "overlay")) {
        return true;
      }

      return false;
    };

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      allowNestedScroll: true,
      prevent: (node) => isScrollableNode(node as HTMLElement),
    });

    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
