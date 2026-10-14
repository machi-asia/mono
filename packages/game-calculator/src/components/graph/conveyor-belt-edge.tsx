"use client";

import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { RecipeCustomEdge } from "../../types/graph";

function ConveyorBeltEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<RecipeCustomEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const belts = data?.belts ?? 1;
  const ratePerMinute = data?.ratePerMinute ?? 0;
  const beltIcon = data?.beltIcon;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex items-center gap-1.5 rounded-full bg-zinc-950/90 border border-zinc-800/90 px-2 py-0.5 text-[11px] font-medium text-zinc-200 shadow-md backdrop-blur-sm select-none"
        >
          {beltIcon ? (
            <img
              src={beltIcon}
              alt="Mechanical Belt"
              className="h-3.5 w-3.5 object-contain shrink-0"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <span className="text-xs">⚙️</span>
          )}
          <span>{belts} Belts</span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-indigo-400 font-semibold">{ratePerMinute}/m</span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const ConveyorBeltEdge = React.memo(ConveyorBeltEdgeComponent);
