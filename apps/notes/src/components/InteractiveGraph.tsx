"use client";

import { useMemo, useState } from "react";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import {
  computeNoteGraphLayout,
  type GraphEdgeInput,
  type GraphNodeInput,
} from "./graphLayout";

interface InteractiveGraphProps {
  nodes: GraphNodeInput[];
  edges: GraphEdgeInput[];
  activeNodeId?: number | null;
  onSelectNode: (nodeId: number) => void;
}

export function InteractiveGraph({
  nodes,
  edges,
  activeNodeId,
  onSelectNode,
}: InteractiveGraphProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const layout = useMemo(
    () => computeNoteGraphLayout(nodes, edges, 860, 520),
    [nodes, edges]
  );

  const focusedId = hoveredId ?? activeNodeId ?? null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "460px" }}>
      <div
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          zIndex: 10,
          display: "flex",
          gap: "0.35rem",
        }}
      >
        <button
          type="button"
          className="qn-icon-btn"
          aria-label="Zoom in graph"
          onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
        >
          <ZoomIn size={14} />
        </button>
        <button
          type="button"
          className="qn-icon-btn"
          aria-label="Zoom out graph"
          onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.15).toFixed(2))))}
        >
          <ZoomOut size={14} />
        </button>
        <button
          type="button"
          className="qn-icon-btn"
          aria-label="Reset graph zoom"
          onClick={() => setZoom(1)}
        >
          <Maximize2 size={14} />
        </button>
      </div>

      <svg
        viewBox="0 0 860 520"
        className="qn-graph-canvas"
        role="img"
        aria-label="Knowledge graph visualization"
      >
        <g transform={`translate(430 260) scale(${zoom}) translate(-430 -260)`}>
          {layout.edges.map((edge, idx) => {
            const isHighlighted =
              focusedId !== null &&
              (edge.source === focusedId || edge.target === focusedId);
            return (
              <line
                key={`${edge.source}-${edge.target}-${idx}`}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke={isHighlighted ? "var(--qn-accent-light)" : "var(--qn-border)"}
                strokeWidth={isHighlighted ? 2.4 : 1.4}
                strokeOpacity={focusedId !== null && !isHighlighted ? 0.35 : 0.85}
              />
            );
          })}

          {layout.nodes.map((node) => {
            const isSelected = node.id === activeNodeId;
            const isHovered = node.id === hoveredId;
            const isConnected =
              focusedId !== null &&
              (node.id === focusedId ||
                layout.edges.some(
                  (e) =>
                    (e.source === focusedId && e.target === node.id) ||
                    (e.target === focusedId && e.source === node.id)
                ));

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{ cursor: "pointer" }}
                opacity={focusedId !== null && !isConnected ? 0.45 : 1}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectNode(node.id)}
              >
                <circle
                  r={node.radius + (isSelected || isHovered ? 4 : 0)}
                  fill={node.color}
                  fillOpacity={0.22}
                />
                <circle
                  r={node.radius}
                  fill={node.color}
                  stroke={isSelected ? "#ffffff" : "var(--qn-surface)"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <text
                  y={node.radius + 16}
                  textAnchor="middle"
                  fill="var(--qn-text)"
                  fontSize="12"
                  fontWeight={isSelected ? "700" : "500"}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
