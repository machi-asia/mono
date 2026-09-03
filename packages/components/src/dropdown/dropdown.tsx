"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useMotionMount } from "../motion/motion";
import "./dropdown.css";

const DROPDOWN_DURATION = 260;

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function Dropdown({
  items,
  value,
  placeholder = "Select...",
  onChange,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, entered } = useMotionMount(open, DROPDOWN_DURATION);

  const selected = items.find((i) => i.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    }
  }

  return (
    <div ref={ref} className="m-dropdown" data-mono="dropdown">
      <button
        type="button"
        className={`m-dropdown-trigger ${open ? "m-dropdown-trigger--open" : ""}`}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="m-dropdown-value">
          {selected ? selected.label : placeholder}
        </span>
        <span className="m-dropdown-chevron" aria-hidden="true">▾</span>
      </button>
      {mounted ? (
        <ul
          className={`m-dropdown-menu ${entered ? "m-dropdown-menu--entered" : ""}`}
          role="listbox"
        >
          {items.map((item) => (
            <li
              key={item.value}
              className={`m-dropdown-item ${item.value === value ? "m-dropdown-item--selected" : ""} ${item.disabled ? "m-dropdown-item--disabled" : ""}`}
              role="option"
              aria-selected={item.value === value}
              onClick={() => {
                if (!item.disabled) {
                  onChange?.(item.value);
                  setOpen(false);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
