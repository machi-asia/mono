"use client";

import { useState } from "react";
import type { TocEntry } from "../../data/wiki-types";

export interface WikiTocProps {
  entries: TocEntry[];
}

interface TocGroup {
  h2: TocEntry;
  h3s: TocEntry[];
}

function groupEntries(entries: TocEntry[]): TocGroup[] {
  const groups: TocGroup[] = [];
  let current: TocGroup | null = null;

  for (const entry of entries) {
    if (entry.level === 2) {
      if (current) groups.push(current);
      current = { h2: entry, h3s: [] };
    } else if (entry.level === 3 && current) {
      current.h3s.push(entry);
    }
  }
  if (current) groups.push(current);
  return groups;
}

export function WikiToc({ entries }: WikiTocProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (entries.length === 0) return null;

  const groups = groupEntries(entries);

  return (
    <nav className="wiki-toc-container" aria-label="Table of contents">
      <div className="wiki-toc-header">
        <span className="wiki-toc-title">Contents</span>
        <button
          type="button"
          className="wiki-toc-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <ul className="wiki-toc-list">
          <li className="wiki-toc-item wiki-toc-top">
            <a href="#top" className="wiki-toc-link">
              (Top)
            </a>
          </li>
          {groups.map((group, i) => (
            <li key={group.h2.id} className="wiki-toc-item wiki-toc-h2">
              <a href={`#${group.h2.id}`} className="wiki-toc-link">
                <span className="wiki-toc-index">{i + 1}</span>
                <span className="wiki-toc-text">{group.h2.title}</span>
              </a>
              {group.h3s.length > 0 && (
                <ul className="wiki-toc-sublist">
                  {group.h3s.map((h3, j) => (
                    <li key={h3.id} className="wiki-toc-item wiki-toc-h3">
                      <a href={`#${h3.id}`} className="wiki-toc-link">
                        <span className="wiki-toc-index">
                          {i + 1}.{j + 1}
                        </span>
                        <span className="wiki-toc-text">{h3.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
