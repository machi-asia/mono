"use client";

import { useState } from "react";
import "./timepicker.css";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseHourText(raw: string, use24Hour: boolean): number | null {
  const n = parseInt(raw.trim(), 10);
  if (Number.isNaN(n)) return null;
  if (use24Hour) return n >= 0 && n <= 23 ? n : null;
  return n >= 1 && n <= 12 ? n : null;
}

function parseMinuteText(raw: string): number | null {
  const n = parseInt(raw.trim(), 10);
  if (Number.isNaN(n)) return null;
  return n >= 0 && n <= 59 ? n : null;
}

export interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  disabled?: boolean;
  use24Hour?: boolean;
}

interface UnitFieldProps {
  value: number;
  display: (v: number) => string;
  options: number[];
  parse: (raw: string) => number | null;
  onCommit: (v: number) => void;
  disabled?: boolean;
  label: string;
}

function UnitField({ value, display, options, parse, onCommit, disabled = false, label }: UnitFieldProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  const shown = editing ? text : display(value);

  function commitRaw() {
    const parsed = parse(text);
    if (parsed !== null) {
      onCommit(parsed);
      return true;
    }
    return false;
  }

  function close() {
    setOpen(false);
    setEditing(false);
    setText("");
  }

  return (
    <div className="m-timepicker-field">
      <span className="m-timepicker-field-label">{label}</span>
      <div className="m-timepicker-combo">
        <input
          type="text"
          className="m-timepicker-combo-input"
          value={shown}
          disabled={disabled}
          aria-label={label}
          placeholder={label}
          onChange={(e) => {
            setEditing(true);
            setText(e.target.value);
          }}
          onFocus={() => {
            setEditing(true);
            setText(display(value));
            setOpen(true);
          }}
          onBlur={() => {
            if (editing && commitRaw()) {
              // value committed; revert handled by parent value
            }
            close();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitRaw();
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Escape") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
        <button
          type="button"
          className="m-timepicker-combo-btn"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          aria-label={`${label} options`}
          tabIndex={-1}
        >
          ▾
        </button>
      </div>
      {open ? (
        <div className="m-timepicker-combo-list">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`m-timepicker-combo-item ${opt === value ? "m-timepicker-combo-item--selected" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onCommit(opt);
                close();
              }}
            >
              {display(opt)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TimePicker({ value = "", onChange, disabled = false, use24Hour = false }: TimePickerProps) {
  const [hours, setHours] = useState(() => {
    if (!value) return 12;
    return parseInt(value.split(":")[0], 10);
  });
  const [minutes, setMinutes] = useState(() => {
    if (!value) return 0;
    return parseInt(value.split(":")[1] ?? "0", 10);
  });

  function emitChange(h: number, m: number) {
    onChange?.(`${pad(h)}:${pad(m)}`);
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = use24Hour ? hours : hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  function commitHour(displayValue: number) {
    let internal: number;
    if (use24Hour) {
      internal = displayValue;
    } else if (period === "PM") {
      internal = displayValue === 12 ? 12 : displayValue + 12;
    } else {
      internal = displayValue === 12 ? 0 : displayValue;
    }
    setHours(internal);
    emitChange(internal, minutes);
  }

  function commitMinute(m: number) {
    setMinutes(m);
    emitChange(hours, m);
  }

  function commitPeriod(next: "AM" | "PM") {
    if (next === period) return;
    const internal = (hours + 12) % 24;
    setHours(internal);
    emitChange(internal, minutes);
  }

  const hourOptions = use24Hour
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);
  const periodOptions = ["AM", "PM"] as const;

  return (
    <div className="m-timepicker" data-mono="timepicker">
      <UnitField
        label="Hour"
        value={displayHour}
        display={(v) => pad(v)}
        options={hourOptions}
        parse={(raw) => parseHourText(raw, use24Hour)}
        onCommit={commitHour}
        disabled={disabled}
      />
      <span className="m-timepicker-sep">:</span>
      <UnitField
        label="Minute"
        value={minutes}
        display={(v) => pad(v)}
        options={minuteOptions}
        parse={parseMinuteText}
        onCommit={commitMinute}
        disabled={disabled}
      />
      {!use24Hour ? (
        <div className="m-timepicker-field m-timepicker-field--period">
          <span className="m-timepicker-field-label">Period</span>
          <div className="m-timepicker-period">
            {periodOptions.map((p) => (
              <button
                key={p}
                type="button"
                className={`m-timepicker-period-btn ${p === period ? "m-timepicker-period-btn--active" : ""}`}
                onClick={() => commitPeriod(p)}
                disabled={disabled}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
