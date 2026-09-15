"use client";

import React from "react";
import Image from "next/image";
import { Handle, Position, type NodeProps } from "reactflow";
import type { RecipeNodeData } from "../../types/graph";
import { Tooltip } from "@mono/components";

export function RecipeProcessNode(props: NodeProps<RecipeNodeData>) {
  const data = props.data;
  const isImage = data.itemIcon.startsWith("/");
  const isBuildingImage = data.buildingIcon && data.buildingIcon.startsWith("/");

  return (
    <div
      className={`recipe-graph-node ${data.isRequested ? "recipe-graph-node-requested" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="recipe-node-handle" />

      <div className="recipe-node-header">
        <div className="recipe-node-icon-box" aria-hidden="true">
          {isImage ? (
            <Image
              src={data.itemIcon}
              alt={data.label}
              width={28}
              height={28}
              className="recipe-node-icon-img"
            />
          ) : (
            <span>{data.itemIcon}</span>
          )}
        </div>

        <div className="recipe-node-title-group">
          <Tooltip content={`${data.label} (${data.outputPerMinute}/min required)`} position="top">
            <h4 className="recipe-node-name">{data.label}</h4>
          </Tooltip>
          <span className="recipe-node-rate">{data.outputPerMinute}/m</span>
        </div>
      </div>

      {data.building && (
        <div className="recipe-node-building-badge">
          {isBuildingImage ? (
            <Image
              src={data.buildingIcon || ""}
              alt=""
              width={16}
              height={16}
              className="recipe-node-building-img"
            />
          ) : null}
          <span className="recipe-node-building-text">
            <strong>{data.buildingCount ?? 1}x</strong> {data.building}
          </span>
        </div>
      )}

      {data.isRequested && (
        <div className="recipe-node-requested-pill">
          Target Demand
        </div>
      )}

      <Handle type="source" position={Position.Right} className="recipe-node-handle" />
    </div>
  );
}

