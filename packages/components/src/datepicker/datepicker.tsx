"use client";

import { useState } from "react";
import "./datepicker.css";

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function DatePicker({ value, onChange, min, max, disabled = false }: DatePickerProps) {
  const parsed = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());
  const [text, setText] = useState(value ?? "");

  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  function parseDateText(raw: string): string | null {
    const m = raw.trim().match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    );
    if (!m) return null;
    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const day = parseInt(m[3], 10);
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > daysInMonth(year, month - 1)) return null;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function handleTextChange(raw: string) {
    setText(raw);
    const normalized = parseDateText(raw);
    if (normalized) {
      setViewYear(parseInt(normalized.slice(0, 4), 10));
      setViewMonth(parseInt(normalized.slice(5, 7), 10) - 1);
      onChange?.(normalized);
    }
  }

  function handleTextBlur() {
    setText(value ?? "");
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="m-datepicker" data-mono="datepicker">
      <input
        type="text"
        className="m-datepicker-input"
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleTextBlur}
        disabled={disabled}
        aria-label="Date"
        placeholder="YYYY-MM-DD"
      />
      <div className="m-datepicker-header">
        <button type="button" className="m-datepicker-nav" onClick={prevMonth} disabled={disabled} aria-label="Previous month">‹</button>
        <span className="m-datepicker-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" className="m-datepicker-nav" onClick={nextMonth} disabled={disabled} aria-label="Next month">›</button>
      </div>
      <div className="m-datepicker-grid">
        {DAYS.map((d) => (
          <span key={d} className="m-datepicker-weekday">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />;
          const dateStr = formatDate(viewYear, viewMonth, day);
          const isSelected = dateStr === value;
          const isDisabled = (min && dateStr < min) || (max && dateStr > max);
          return (
            <button
              key={day}
              type="button"
              className={`m-datepicker-day ${isSelected ? "m-datepicker-day--selected" : ""} ${isDisabled ? "m-datepicker-day--disabled" : ""}`}
              onClick={() => {
                if (!isDisabled && !disabled) {
                  setText(dateStr);
                  onChange?.(dateStr);
                }
              }}
              disabled={isDisabled || disabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
