"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type NodeChange,
  type EdgeProps,
} from "reactflow";
import "reactflow/dist/style.css";

import type { GameItem } from "../../data/types";
import type { ProductionRequest } from "../../types/graph";
import { calculateRecipeGraph } from "../../lib/graph-builder";
import { RecipeProcessNode } from "./recipe-process-node";
import { Button, Card, Dropdown, Usage } from "@mono/components";

const nodeTypes = {
  recipeProcess: RecipeProcessNode,
};

function RecipeFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label ? (
        <EdgeLabelRenderer>
          <div
            className="recipe-edge-label"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

const edgeTypes = {
  recipeEdge: RecipeFlowEdge,
};

export interface RecipeGraphViewProps {
  items: GameItem[];
  gameName: string;
  onBackToCatalog?: () => void;
  initialRequests?: ProductionRequest[];
  recipeOverrides?: Record<string, string>;
}

function GraphCanvas({
  nodes,
  edges,
  onNodesChange,
}: {
  nodes: ReturnType<typeof calculateRecipeGraph>["nodes"];
  edges: ReturnType<typeof calculateRecipeGraph>["edges"];
  onNodesChange: (changes: NodeChange[]) => void;
}) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    // When nodes change or render for the first time, center the view
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 250 });
    }, 50);
    return () => clearTimeout(timer);
  }, [nodes.length, edges.length, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      fitView
      fitViewOptions={{ padding: 0.25 }}
      minZoom={0.2}
      maxZoom={2}
edgeTypes={edgeTypes}
      defaultEdgeOptions={{
        type: "recipeEdge",
        animated: true,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Background color="var(--color-border)" gap={20} size={1} />
      <Controls className="recipe-flow-controls" />
      <MiniMap
        nodeColor="var(--color-surface-2)"
        maskColor="rgba(0, 0, 0, 0.4)"
        className="recipe-flow-minimap"
      />
    </ReactFlow>
  );
}

export function RecipeGraphView({
  items,
  gameName,
  onBackToCatalog,
  initialRequests = [],
  recipeOverrides,
}: RecipeGraphViewProps) {
  const [requests, setRequests] = useState<ProductionRequest[]>(() => {
    if (initialRequests.length > 0) return initialRequests;
    const firstCraftable = items.find((i) => i.recipe && i.recipe.ingredients.length > 0) || items[0];
    return firstCraftable ? [{ itemId: firstCraftable.id, targetQuantityPerMinute: 60 }] : [];
  });

  const [selectedToAdd, setSelectedToAdd] = useState<string>(items[0]?.id || "");

  const itemOptions = useMemo(() => {
    return items.map((it) => ({
      label: it.name,
      value: it.id,
    }));
  }, [items]);

  const calculationResult = useMemo(() => {
    return calculateRecipeGraph(items, requests, recipeOverrides);
  }, [items, requests, recipeOverrides]);

  const [nodePositionOverrides, setNodePositionOverrides] = useState<Record<string, { x: number; y: number }>>({});

  const nodes = useMemo(() => {
    return calculationResult.nodes.map((node) => {
      const override = nodePositionOverrides[node.id];
      if (override) {
        return {
          ...node,
          position: override,
        };
      }
      return node;
    });
  }, [calculationResult.nodes, nodePositionOverrides]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodePositionOverrides((prev) => {
      const next = { ...prev };
      for (const change of changes) {
        if (change.type === "position" && change.position) {
          next[change.id] = change.position;
        }
      }
      return next;
    });
  }, []);

  function handleQuantityChange(itemId: string, qty: number) {
    setRequests((prev) => {
      const existingIdx = prev.findIndex((r) => r.itemId === itemId);
      if (qty <= 0) {
        return prev.filter((r) => r.itemId !== itemId);
      }
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], targetQuantityPerMinute: qty };
        return updated;
      }
      return [...prev, { itemId, targetQuantityPerMinute: qty }];
    });
  }

  function handleAddTarget() {
    if (!selectedToAdd) return;
    handleQuantityChange(selectedToAdd, 60);
  }

  function handleRemoveTarget(itemId: string) {
    setRequests((prev) => prev.filter((r) => r.itemId !== itemId));
  }

  const totalMachineCount = useMemo(() => {
    return Object.values(calculationResult.totalBuildings).reduce((acc, count) => acc + count, 0);
  }, [calculationResult.totalBuildings]);

  return (
    <div className="recipe-graph-container">
      <div className="recipe-graph-sidebar">
        <div className="recipe-sidebar-section">
          <div className="recipe-sidebar-header">
            <h3 className="recipe-sidebar-title">Production Targets</h3>
            {onBackToCatalog && (
              <Button size="sm" variant="secondary" onClick={onBackToCatalog}>
                Back to Catalog
              </Button>
            )}
          </div>
          <p className="recipe-sidebar-hint">
            Specify desired output rates for {gameName} products to automatically calculate the production tree.
          </p>
        </div>

        <div className="recipe-sidebar-add-row">
          <div className="recipe-sidebar-dropdown-wrap">
            <Dropdown
              items={itemOptions}
              value={selectedToAdd}
              onChange={(val: string) => setSelectedToAdd(val)}
            />
          </div>
          <Button size="sm" variant="primary" onClick={handleAddTarget}>
            + Add Target
          </Button>
        </div>

        <div className="recipe-targets-list">
          {requests.map((req) => {
            const item = items.find((it) => it.id === req.itemId);
            if (!item) return null;
            const isImage = item.icon.startsWith("/");
            return (
              <Card key={req.itemId} className="recipe-target-card" elevated>
                <div className="recipe-target-info">
                  <div className="recipe-target-icon">
                    {isImage ? (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="calc-item-icon-img"
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                  <div className="recipe-target-details">
                    <span className="recipe-target-name">{item.name}</span>
                    <span className="recipe-target-sub">{item.category}</span>
                  </div>
                </div>

                <div className="recipe-target-controls">
                  <div className="recipe-target-qty-input-wrap">
                    <input
                      type="number"
                      min="1"
                      className="recipe-target-qty-input"
                      value={req.targetQuantityPerMinute}
                      onChange={(e) =>
                        handleQuantityChange(req.itemId, Math.max(0, parseInt(e.target.value) || 0))
                      }
                      aria-label={`${item.name} quantity per minute`}
                    />
                    <span className="recipe-target-qty-unit">/min</span>
                  </div>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveTarget(req.itemId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="recipe-sidebar-metrics">
          <h4 className="recipe-metrics-title">Machine Overview</h4>
          <Usage
            label="Total Machines Required"
            used={Number(totalMachineCount.toFixed(1))}
            total={Math.max(50, Math.ceil(totalMachineCount * 1.25))}
            unit=" units"
            size="sm"
          />

          <div className="recipe-buildings-breakdown">
            {Object.entries(calculationResult.totalBuildings).map(([building, count]) => (
              <div key={building} className="recipe-building-row">
                <span className="recipe-building-name">{building}</span>
                <span className="recipe-building-qty">{count}x</span>
              </div>
            ))}
          </div>

          {calculationResult.rawIngredients.length > 0 && (
            <div className="recipe-raw-section">
              <h4 className="recipe-metrics-title">Raw Input Demands</h4>
              <div className="recipe-raw-list">
                {calculationResult.rawIngredients.map((raw) => (
                  <div key={raw.itemId} className="recipe-raw-row">
                    <span className="recipe-raw-name">{raw.itemName}</span>
                    <span className="recipe-raw-qty">{raw.requiredPerMinute}/m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="recipe-graph-canvas-wrap">
        <ReactFlowProvider>
          <GraphCanvas
            nodes={nodes}
            edges={calculationResult.edges}
            onNodesChange={onNodesChange}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
