"use client";

import React from "react";
import type { GameItem, Recipe, Ingredient, OutputItem } from "../types/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Clock, Factory, ArrowRight, Layers, Flag } from "lucide-react";
import { RAW_ITEM_ICONS } from "../data/raw-item-icons";

interface ItemDetailPopupProps {
  item: GameItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToPlanner?: (item: GameItem) => void;
  onReportIssue?: (item: GameItem) => void;
}

export function ItemDetailPopup({
  item,
  open,
  onOpenChange,
  onAddToPlanner,
  onReportIssue,
}: ItemDetailPopupProps) {
  if (!item) return null;

  const recipes = item.recipes || (item.recipe ? [item.recipe] : []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-2xl border border-zinc-700/80">
              {item.icon.startsWith("/") || item.icon.startsWith("http") ? (
                <img src={item.icon} alt={item.name} className="h-9 w-9 object-contain" />
              ) : (
                <span>{item.icon || "📦"}</span>
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300 border border-zinc-700">
                  {item.category}
                </span>
                {item.sourceMod && (
                  <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-indigo-300">
                    {item.sourceMod}
                  </span>
                )}
                {item.lastUpdated && (
                  <span className="text-xs text-zinc-500">Updated: {item.lastUpdated}</span>
                )}
              </div>
            </div>
          </div>
          <DialogDescription className="mt-2 text-zinc-400">
            {item.description || `Crafting recipes and specifications for ${item.name}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-400" />
              Production Recipes ({recipes.length})
            </h4>
            <div className="flex items-center gap-3">
              {onReportIssue && (
                <button
                  type="button"
                  onClick={() => {
                    onReportIssue(item);
                  }}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Report wrong recipe or throughput for this item"
                >
                  <Flag className="h-3 w-3" />
                  <span>Report</span>
                </button>
              )}
              {onAddToPlanner && (
                <button
                  type="button"
                  onClick={() => {
                    onAddToPlanner(item);
                    onOpenChange(false);
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  + Plan this Item
                </button>
              )}
            </div>
          </div>

          {recipes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-500">
              This item has no crafting recipes (Raw / Gathered resource).
            </div>
          ) : (
            <div className="space-y-3">
              {recipes.map((recipe: Recipe) => (
                <div
                  key={recipe.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-zinc-200">{recipe.name}</span>
                      {recipe.sourceMod && (
                        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
                          {recipe.sourceMod}
                        </span>
                      )}
                      {recipe.method && (
                        <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                          {recipe.method}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        {(() => {
                          const cleanName = (recipe.buildingRequired || "").replace(/ Loop$/, "");
                          const icon =
                            recipe.buildingIcon ||
                            RAW_ITEM_ICONS[recipe.buildingRequired] ||
                            RAW_ITEM_ICONS[cleanName];

                          if (icon && (icon.startsWith("/") || icon.startsWith("http"))) {
                            return (
                              <img
                                src={icon}
                                alt={recipe.buildingRequired}
                                className="h-4 w-4 object-contain pixelated shrink-0 rounded-[2px]"
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                loading="lazy"
                              />
                            );
                          }
                          if (icon) {
                            return <span className="text-xs shrink-0">{icon}</span>;
                          }
                          return <Factory className="h-3.5 w-3.5 text-zinc-500 shrink-0" />;
                        })()}
                        <span className="text-zinc-200 font-medium">{recipe.buildingRequired}</span>
                      </span>
                      {recipe.speedRpm && (
                        <span className="font-mono text-[11px] text-amber-400">
                          {recipe.speedRpm} RPM
                        </span>
                      )}
                      {recipe.processingTimeSeconds > 0 && (
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 text-zinc-500" />
                          {recipe.processingTimeSeconds}s
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-zinc-900">
                    <div>
                      <div className="text-[11px] font-medium text-zinc-500 mb-1.5">Inputs</div>
                      <div className="space-y-1">
                        {recipe.ingredients.map((ing: Ingredient) => (
                          <div
                            key={ing.itemId}
                            className="flex items-center justify-between rounded bg-zinc-900 px-2 py-1"
                          >
                            <span className="text-zinc-300 truncate">{ing.itemName}</span>
                            <span className="font-mono text-zinc-400">×{ing.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
                        <span>Outputs</span>
                        <ArrowRight className="h-3 w-3 text-zinc-500" />
                      </div>
                      <div className="space-y-1">
                        {recipe.outputs.map((out: OutputItem, idx: number) => (
                          <div
                            key={`${out.itemId}-${idx}`}
                            className="flex items-center justify-between rounded bg-zinc-900 px-2 py-1"
                          >
                            <span className="text-zinc-300 truncate">{out.itemName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-emerald-400 font-semibold">×{out.amount}</span>
                              {out.chance && out.chance < 100 && (
                                <span className="font-mono text-[10px] text-amber-400/90 bg-amber-950/40 px-1 py-0.5 rounded border border-amber-800/40">
                                  {out.chance}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
