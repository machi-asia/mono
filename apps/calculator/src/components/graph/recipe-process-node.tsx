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

  // Shorten "Automated X" → "X" when a building icon is present to save space
  const buildingLabel = isBuildingImage
    ? data.building?.replace(/^Automated\s+/, "")
    : data.building;

  return (
    <div className={`recipe-graph-node ${data.isRequested ? "recipe-graph-node-requested" : ""}`}>
      <Handle type="target" position={Position.Left} className="recipe-node-handle" />

      {/* Two-column layout */}
      <div className="recipe-node-body">

        {/* Left: large item icon */}
        <div className="recipe-node-icon-col" aria-hidden="true">
          {isImage ? (
            <Image
              src={data.itemIcon}
              alt={data.label}
              width={48}
              height={48}
              className="recipe-node-icon-img"
            />
          ) : (
            <span className="recipe-node-icon-emoji">{data.itemIcon}</span>
          )}
        </div>

        {/* Right: name, rate, building */}
        <div className="recipe-node-content">
          <Tooltip content={`${data.label} · ${data.outputPerMinute}/min`} position="top">
            <h4 className="recipe-node-name">{data.label}</h4>
          </Tooltip>

          <span className="recipe-node-rate">{data.outputPerMinute}<span className="recipe-node-rate-unit">/m</span></span>

          {data.building && (
            <Tooltip content={`${data.buildingCount ?? 1}× ${data.building}`} position="bottom">
              <div className="recipe-node-building-row">
                {isBuildingImage ? (
                  <Image
                    src={data.buildingIcon || ""}
                    alt={data.building}
                    width={16}
                    height={16}
                    className="recipe-node-building-img"
                  />
                ) : null}
                <span className="recipe-node-building-text">
                  <strong>{data.buildingCount ?? 1}×</strong> {buildingLabel}
                </span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {data.isRequested && (
        <div className="recipe-node-requested-pill">Target Demand</div>
      )}

      <Handle type="source" position={Position.Right} className="recipe-node-handle" />
    </div>
  );
}

