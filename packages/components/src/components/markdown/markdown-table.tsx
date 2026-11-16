"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

export interface MarkdownTableProps {
  headers: string[];
  rows: string[][];
  renderCell: (text: string, keyPrefix: string) => ReactNode;
}

type SortDirection = "asc" | "desc" | null;

function stripMarkdownForSort(raw: string): string {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[\[([^|\]]+\|)?([^\]]+)\]\]/g, "$2")
    .replace(/[*_~`=#]/g, "")
    .trim();
}

function parseNumericValue(text: string): number | null {
  const cleaned = text.replace(/[,$\s€£¥%]/g, "").trim();
  if (!cleaned) return null;
  const suffixMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)([KMBT])?$/i);
  if (!suffixMatch) return null;
  const base = Number(suffixMatch[1]);
  if (Number.isNaN(base)) return null;
  const suffix = suffixMatch[2]?.toUpperCase();
  const multipliers: Record<string, number> = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };
  return base * (suffix ? multipliers[suffix] ?? 1 : 1);
}

function compareCells(aRaw: string, bRaw: string): number {
  const aText = stripMarkdownForSort(aRaw);
  const bText = stripMarkdownForSort(bRaw);

  const aNum = parseNumericValue(aText);
  const bNum = parseNumericValue(bText);

  if (aNum !== null && bNum !== null) {
    return aNum - bNum;
  }

  return aText.localeCompare(bText, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function MarkdownTable({ headers, rows, renderCell }: MarkdownTableProps) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = (colIdx: number) => {
    if (sortCol !== colIdx) {
      setSortCol(colIdx);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortCol(null);
      setSortDir(null);
    }
  };

  const sortedRows = useMemo(() => {
    if (sortCol === null || sortDir === null) return rows;
    return [...rows].sort((a, b) => {
      const cmp = compareCells(a[sortCol] ?? "", b[sortCol] ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortCol, sortDir]);

  return (
    <div className="m-md-table-wrap">
      <table className="m-md-table">
        <thead>
          <tr>
            {headers.map((cell, idx) => {
              const isActive = sortCol === idx;
              const ariaSort = isActive
                ? sortDir === "asc"
                  ? "ascending"
                  : "descending"
                : "none";

              return (
                <th key={`th-${idx}`} aria-sort={ariaSort}>
                  <button
                    type="button"
                    className={`m-md-th-btn ${isActive ? "is-sorted" : ""}`}
                    onClick={() => handleSort(idx)}
                    aria-label={`Sort by ${stripMarkdownForSort(cell) || `column ${idx + 1}`}`}
                  >
                    <span className="m-md-th-label">{renderCell(cell, `th-${idx}`)}</span>
                    <span className="m-md-sort-icon" aria-hidden="true">
                      {isActive && sortDir === "asc" ? (
                        <ChevronUp size={14} />
                      ) : isActive && sortDir === "desc" ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronsUpDown size={13} />
                      )}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((rowCells, rIdx) => (
            <tr key={`tr-${rIdx}`}>
              {rowCells.map((cell, cIdx) => (
                <td key={`td-${rIdx}-${cIdx}`}>{renderCell(cell, `td-${rIdx}-${cIdx}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
