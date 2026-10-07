"use client";

import { useState, type ReactNode, type ChangeEvent } from "react";
import "./showcase.css";

export interface ShowcasePropOption {
  label?: string;
  value: string;
}

export interface ShowcasePropControl {
  prop: string;
  options: (string | ShowcasePropOption)[];
  defaultValue?: string;
  label?: string;
}

export interface ShowcaseItem {
  name: string;
  description?: string;
  uses?: string;
  propControls?: ShowcasePropControl[];
  render: (values: Record<string, string>) => ReactNode;
}

export interface ComponentShowcaseProps {
  packageName: string;
  description?: string;
  components: ShowcaseItem[];
}

function normalizeOption(o: string | ShowcasePropOption): ShowcasePropOption {
  return typeof o === "string" ? { value: o, label: o } : o;
}

export function ComponentShowcase({
  packageName,
  description,
  components,
}: ComponentShowcaseProps) {
  return (
    <section className="showcase">
      <header className="showcase-header">
        <h1 className="showcase-title">@{packageName}</h1>
        {description ? <p className="showcase-description">{description}</p> : null}
      </header>

      <ul className="showcase-list">
        {components.map((item) => (
          <ShowcaseItemRow key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

function ShowcaseItemRow({ item }: { item: ShowcaseItem }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const control of item.propControls ?? []) {
      const options = control.options.map(normalizeOption);
      initial[control.prop] = control.defaultValue ?? options[0]?.value ?? "";
    }
    return initial;
  });

  function handleChange(prop: string, event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    setValues((previous) => ({ ...previous, [prop]: next }));
  }

  const controls = item.propControls ?? [];

  return (
    <li className="showcase-item">
      <h2 className="showcase-item-name">{item.name}</h2>
      {item.uses ? <p className="showcase-item-uses">{item.uses}</p> : null}
      {item.description ? (
        <p className="showcase-item-description">{item.description}</p>
      ) : null}

      {controls.length > 0 ? (
        <div className="showcase-controls">
          {controls.map((control) => {
            const options = control.options.map(normalizeOption);
            return (
              <label key={control.prop} className="showcase-control">
                <span className="showcase-control-label">
                  {control.label ?? control.prop}
                </span>
                <select
                  className="showcase-control-select"
                  value={values[control.prop] ?? ""}
                  onChange={(event) => handleChange(control.prop, event)}
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      ) : null}

      <div className="showcase-item-live">{item.render(values)}</div>
    </li>
  );
}
