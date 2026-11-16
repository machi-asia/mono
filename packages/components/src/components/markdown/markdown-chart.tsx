"use client";

import { useMemo, useState } from "react";

export type ChartType = "bar" | "line" | "area" | "pie" | "donut";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartSpec {
  type?: ChartType;
  title?: string;
  data: ChartDataPoint[];
}

const DEFAULT_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

function parseChartSpec(raw: string): ChartSpec | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data) || parsed.data.length === 0) {
      return null;
    }
    return {
      type: parsed.type ?? "bar",
      title: parsed.title,
      data: parsed.data.map((d: ChartDataPoint, idx: number) => {
        const rawNum = typeof d.value === "number" ? d.value : parseFloat(String(d.value ?? ""));
        return {
          label: String(d.label ?? `#${idx + 1}`),
          value: Number.isFinite(rawNum) ? rawNum : 0,
          color: d.color || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length],
        };
      }),
    };
  } catch {
    return null;
  }
}

/**
 * Renders interactive SVG data charts (bar, line, area, pie, donut) from a JSON ```chart block.
 */
export function MarkdownChart({ code }: { code: string }) {
  const spec = useMemo(() => parseChartSpec(code), [code]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!spec) {
    return (
      <pre className="m-md-pre">
        <code>{code}</code>
      </pre>
    );
  }

  const { type = "bar", title, data } = spec;
  const rawMax = Math.max(...data.map((d) => d.value));
  const maxVal = rawMax > 0 ? rawMax : 1;
  const total = data.reduce((sum, d) => sum + Math.max(d.value, 0), 0) || 1;

  const width = 520;
  const height = 240;
  const pad = { top: 20, right: 20, bottom: 36, left: 44 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  return (
    <div className="m-md-chart" role="figure" aria-label={title || `${type} chart`}>
      {title && <div className="m-md-chart-title">{title}</div>}

      {(type === "pie" || type === "donut") ? (
        <div className="m-md-chart-pie-wrap">
          <svg viewBox="0 0 220 220" className="m-md-chart-pie-svg">
            {(() => {
              let startAngle = -Math.PI / 2;
              const cx = 110;
              const cy = 110;
              const r = 88;
              const innerR = type === "donut" ? 50 : 0;

              return data.map((d, idx) => {
                const sliceAngle = (Math.max(d.value, 0) / total) * Math.PI * 2;
                const endAngle = startAngle + sliceAngle;
                const largeArc = sliceAngle > Math.PI ? 1 : 0;

                const x1 = cx + r * Math.cos(startAngle);
                const y1 = cy + r * Math.sin(startAngle);
                const x2 = cx + r * Math.cos(endAngle);
                const y2 = cy + r * Math.sin(endAngle);

                const pathData =
                  innerR > 0
                    ? [
                        `M ${cx + innerR * Math.cos(startAngle)} ${cy + innerR * Math.sin(startAngle)}`,
                        `L ${x1} ${y1}`,
                        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
                        `L ${cx + innerR * Math.cos(endAngle)} ${cy + innerR * Math.sin(endAngle)}`,
                        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${cx + innerR * Math.cos(startAngle)} ${cy + innerR * Math.sin(startAngle)}`,
                        "Z",
                      ].join(" ")
                    : [
                        `M ${cx} ${cy}`,
                        `L ${x1} ${y1}`,
                        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
                        "Z",
                      ].join(" ");

                startAngle = endAngle;
                const isHovered = hoveredIdx === idx;
                return (
                  <path
                    key={d.label}
                    d={pathData}
                    fill={d.color}
                    opacity={hoveredIdx === null || isHovered ? 1 : 0.45}
                    className="m-md-chart-slice"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <title>{`${d.label}: ${d.value}`}</title>
                  </path>
                );
              });
            })()}
          </svg>
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="m-md-chart-svg">
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = pad.top + plotH * (1 - t);
            return (
              <g key={t}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={width - pad.right}
                  y2={y}
                  className="m-md-chart-grid"
                />
                <text x={pad.left - 8} y={y + 4} className="m-md-chart-axis-text" textAnchor="end">
                  {Number((maxVal * t).toPrecision(3))}
                </text>
              </g>
            );
          })}

          {type === "bar" &&
            data.map((d, idx) => {
              const barGap = 12;
              const barW = Math.max(12, plotW / data.length - barGap);
              const x = pad.left + idx * (plotW / data.length) + barGap / 2;
              const barH = (Math.max(d.value, 0) / maxVal) * plotH;
              const y = pad.top + plotH - barH;
              return (
                <g
                  key={d.label}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={4}
                    fill={d.color}
                    opacity={hoveredIdx === null || hoveredIdx === idx ? 1 : 0.45}
                  >
                    <title>{`${d.label}: ${d.value}`}</title>
                  </rect>
                  <text
                    x={x + barW / 2}
                    y={height - 12}
                    className="m-md-chart-axis-text"
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}

          {(type === "line" || type === "area") && (() => {
            const points = data.map((d, idx) => {
              const x =
                data.length === 1
                  ? pad.left + plotW / 2
                  : pad.left + (idx / (data.length - 1)) * plotW;
              const y = pad.top + plotH - (Math.max(d.value, 0) / maxVal) * plotH;
              return { x, y, ...d };
            });
            const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + plotH} L ${points[0].x} ${pad.top + plotH} Z`;
            const strokeColor = data[0]?.color || DEFAULT_PALETTE[0];

            return (
              <>
                {type === "area" && (
                  <path d={areaPath} fill={strokeColor} fillOpacity={0.18} />
                )}
                <path
                  d={linePath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((p, idx) => (
                  <g
                    key={p.label}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <circle cx={p.x} cy={p.y} r={hoveredIdx === idx ? 6 : 4} fill={p.color}>
                      <title>{`${p.label}: ${p.value}`}</title>
                    </circle>
                    <text
                      x={p.x}
                      y={height - 12}
                      className="m-md-chart-axis-text"
                      textAnchor="middle"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      )}

      <div className="m-md-chart-legend">
        {data.map((d, idx) => (
          <span
            key={d.label}
            className={`m-md-chart-legend-item ${hoveredIdx === idx ? "is-active" : ""}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="m-md-chart-swatch" style={{ backgroundColor: d.color }} />
            <span>{d.label}: <strong>{d.value}</strong></span>
          </span>
        ))}
      </div>
    </div>
  );
}
