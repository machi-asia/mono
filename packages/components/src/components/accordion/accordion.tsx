"use client";

import { useState, type ReactNode } from "react";
import "./accordion.css";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number[];
}

export function Accordion({ items, multiple = false, defaultOpen = [] }: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set(defaultOpen));

  function toggle(index: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!multiple) next.clear();
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="m-accordion" data-mono="accordion">
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        return (
          <div key={i} className={`m-accordion-item ${isOpen ? "m-accordion-item--open" : ""}`}>
            <button
              type="button"
              className="m-accordion-trigger"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`m-accordion-panel-${i}`}
            >
              <span className="m-accordion-title">{item.title}</span>
              <span
                className={`m-accordion-icon ${isOpen ? "m-accordion-icon--rotated" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              id={`m-accordion-panel-${i}`}
              role="region"
              data-open={isOpen ? "true" : "false"}
              className={`m-accordion-content ${isOpen ? "m-accordion-content--open" : ""}`}
            >
              <div className="m-accordion-content-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
