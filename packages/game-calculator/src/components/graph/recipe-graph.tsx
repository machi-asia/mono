"use client";

import React, { useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import { RecipeProcessNode } from "./recipe-process-node";
import { ConveyorBeltEdge } from "./conveyor-belt-edge";
import type { GraphCalculationResult, RecipeCustomNode } from "../../types/graph";
import { Cpu, Boxes } from "lucide-react";

import type { GameItem } from "../../types/data";

interface RecipeGraphViewProps {
  calculation: GraphCalculationResult;
  onNodeClick?: (item: GameItem) => void;
  onSwitchIngredient?: (groupKey: string, chosenOptionId: string) => void;
  onToggleRawInput?: (itemId: string) => void;
  initialPositions?: Record<string, { x: number; y: number }>;
  onPositionsChange?: (positions: Record<string, { x: number; y: number }>) => void;
}

const nodeTypes: NodeTypes = {
  recipeProcess: RecipeProcessNode,
};

const edgeTypes: EdgeTypes = {
  conveyorBelt: ConveyorBeltEdge,
};

export function RecipeGraphView({
  calculation,
  onNodeClick,
  onSwitchIngredient,
  onToggleRawInput,
  initialPositions,
  onPositionsChange,
}: RecipeGraphViewProps) {
  const { nodes: rawNodes, edges: initialEdges, totalBuildings, rawIngredients } = calculation;

  // Track user-dragged or customized positions across recalculations
  const positionsRef = React.useRef<Map<string, { x: number; y: number }>>(new Map());

  // Initialize positionsRef from initialPositions if provided
  useEffect(() => {
    if (initialPositions) {
      for (const [id, pos] of Object.entries(initialPositions)) {
        positionsRef.current.set(id, pos);
      }
    }
  }, [initialPositions]);

  const initialNodes = useMemo(() => {
    return rawNodes.map((node) => {
      const savedPos = positionsRef.current.get(node.id) || initialPositions?.[node.id];
      return {
        ...node,
        position: savedPos || node.position,
        data: {
          ...node.data,
          onSwitchIngredient,
          onToggleRawInput,
          onNodeClick,
        },
      };
    });
  }, [rawNodes, onSwitchIngredient, onToggleRawInput, onNodeClick, initialPositions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state whenever recalculated graph updates (targets, recipes, or items change),
  // merging updated node data while preserving existing node positions so they don't jump back!
  useEffect(() => {
    setNodes((prevNodes) => {
      const currentPosMap = new Map<string, { x: number; y: number }>();
      for (const n of prevNodes) {
        currentPosMap.set(n.id, n.position);
        positionsRef.current.set(n.id, n.position);
      }

      return initialNodes.map((node) => {
        const retainedPos = currentPosMap.get(node.id) || positionsRef.current.get(node.id);
        return {
          ...node,
          position: retainedPos || node.position,
        };
      });
    });

    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const totalMachineCount = useMemo(() => {
    return Object.values(totalBuildings).reduce((sum, count) => sum + count, 0);
  }, [totalBuildings]);

  if (initialNodes.length === 0) {
    return (
      <div className="flex flex-1 h-full min-h-0 w-full flex-col items-center justify-center p-8 text-center text-zinc-500">
        <Boxes className="h-10 w-10 text-zinc-600 mb-3" />
        <h3 className="text-base font-medium text-zinc-300">No Target Products Selected</h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Add items to your production targets above to generate the full crafting and dependency graph.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-0 flex-1">
      {/* Metrics Row - Hidden on mobile view (< sm) to preserve canvas space */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 py-1 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium text-zinc-400">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Facilities ({totalMachineCount.toFixed(1)}):</span>
          </span>
          {Object.keys(totalBuildings).length === 0 ? (
            <span className="text-zinc-500">None</span>
          ) : (
            (calculation.buildingDetails || Object.entries(totalBuildings).map(([name, count]) => ({ name, count, icon: undefined, pairedCatalystIcon: undefined }))).map((bldg) => {
              const icon = bldg.icon;
              const isImg = icon && (icon.startsWith("/") || icon.startsWith("http"));
              const catIcon = bldg.pairedCatalystIcon;
              const isCatImg = catIcon && (catIcon.startsWith("/") || catIcon.startsWith("http"));
              return (
                <span
                  key={bldg.name}
                  className="inline-flex items-center gap-1.5 rounded bg-white/[0.04] px-2 py-0.5 text-zinc-200"
                >
                  <div className="flex items-center gap-0.5 shrink-0">
                    {isImg ? (
                      <img
                        src={icon}
                        alt={bldg.name}
                        className="h-3.5 w-3.5 object-contain shrink-0"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        loading="lazy"
                      />
                    ) : icon ? (
                      <span className="text-xs leading-none">{icon}</span>
                    ) : null}
                    {isCatImg ? (
                      <img
                        src={catIcon}
                        alt="Catalyst"
                        className="h-3.5 w-3.5 object-contain shrink-0 rounded-[2px]"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <span>{bldg.name}</span>
                  <span className="font-mono font-semibold text-indigo-400">×{bldg.count}</span>
                </span>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium text-zinc-400">
            <Boxes className="h-3.5 w-3.5 text-emerald-400" />
            <span>Raw Inputs:</span>
          </span>
          {rawIngredients.length === 0 ? (
            <span className="text-zinc-500">None</span>
          ) : (
            rawIngredients.map((raw) => {
              const icon = raw.icon;
              const isImg = icon && (icon.startsWith("/") || icon.startsWith("http"));
              return (
                <span
                  key={raw.itemId}
                  className="inline-flex items-center gap-1.5 rounded bg-white/[0.04] px-2 py-0.5 text-zinc-200"
                >
                  {isImg ? (
                    <img
                      src={icon}
                      alt={raw.itemName}
                      className="h-3.5 w-3.5 object-contain shrink-0"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                  ) : icon ? (
                    <span className="text-xs leading-none">{icon}</span>
                  ) : null}
                  <span>{raw.itemName}</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {raw.requiredPerMinute}/m
                  </span>
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Graph Canvas - Sleek & Borderless */}
      <div className="flex-1 h-full min-h-0 w-full rounded-lg overflow-hidden relative touch-none">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={true}
          panOnDrag={true}
          panOnScroll={false}
          zoomOnPinch={true}
          preventScrolling={true}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeDragStop={(_e, node) => {
            if (node.position) {
              positionsRef.current.set(node.id, { x: node.position.x, y: node.position.y });
              if (onPositionsChange) {
                const updated: Record<string, { x: number; y: number }> = {};
                positionsRef.current.forEach((pos, key) => {
                  updated[key] = pos;
                });
                onPositionsChange(updated);
              }
            }
          }}
          onNodeClick={(_e, node) => {
            if (onNodeClick && (node as RecipeCustomNode).data?.item) {
              onNodeClick((node as RecipeCustomNode).data.item as GameItem);
            }
          }}
          onNodeContextMenu={(e, node) => {
            e.preventDefault();
            if (onToggleRawInput && (node as RecipeCustomNode).data?.item) {
              onToggleRawInput((node as RecipeCustomNode).data.item.id);
            }
          }}
          fitView
          fitViewOptions={{ maxZoom: 1 }}
          colorMode="dark"
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#27272a" gap={16} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-zinc-900/80 !border-0 !text-white [&>button]:!fill-white [&>button]:!border-0" />
          <MiniMap
            className="!hidden sm:!block !bg-zinc-900/60 !border-0 rounded-lg overflow-hidden"
            nodeColor="#6366f1"
            maskColor="rgba(0, 0, 0, 0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
