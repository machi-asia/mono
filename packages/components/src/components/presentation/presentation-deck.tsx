"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PresentationDeckProps } from "./types";
import { usePresentationScroll } from "./use-presentation-scroll";
import { cx } from "../scroll-sections/use-scroll-progress";
import "./presentation.css";

export function PresentationDeck({
  children,
  sections = [],
  showProgressBar = true,
  showNavDots = true,
  smooth = true,
  springConfig,
  className,
  style,
  ...rest
}: PresentationDeckProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { progress } = usePresentationScroll(ref, { smooth, springConfig });
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0 || typeof window === "undefined") return;

    const handleScroll = () => {
      const viewportCenter = window.innerHeight * 0.45;
      let current = sections[0]?.id ?? "";

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter) {
          current = sec.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    if (typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      ref={ref}
      data-mono="presentation-deck"
      className={cx("mono-pres-deck", className)}
      style={style}
      {...rest}
    >
      {showProgressBar && (
        <motion.div
          className="mono-pres-progress-bar"
          style={{ scaleX: progress }}
          data-testid="presentation-progress-bar"
        />
      )}

      {showNavDots && sections.length > 0 && (
        <nav className="mono-pres-nav-dots" aria-label="Presentation sections">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="mono-pres-nav-dot"
              data-active={activeId === section.id}
              title={section.label}
              aria-label={`Jump to ${section.label}`}
              onClick={() => scrollToSection(section.id)}
            />
          ))}
        </nav>
      )}

      {children}
    </div>
  );
}
