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
import { Check, Clock, Factory } from "lucide-react";
import { RAW_ITEM_ICONS } from "../data/raw-item-icons";

interface RecipeChooserModalProps {
  item: GameItem | null;
  currentRecipeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export function RecipeChooserModal({
  item,
  currentRecipeId,
  open,
  onOpenChange,
  onSelectRecipe,
}: RecipeChooserModalProps) {
  if (!item) return null;

  const recipes = item.recipes || (item.recipe ? [item.recipe] : []);
  const activeRecipeId = currentRecipeId || recipes[0]?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden flex flex-col p-5 bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader className="shrink-0 pb-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 p-1 border border-zinc-700/60">
              {item.icon.startsWith("/") || item.icon.startsWith("http") ? (
                <img src={item.icon} alt={item.name} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-xl">{item.icon || "📦"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Select Recipe for {item.name}</span>
                <span className="text-xs font-normal text-zinc-500 font-mono">
                  ({recipes.length} available)
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                Choose the manufacturing process to use in the automation dependency tree.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Recipe Cards List */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 py-3 pr-1">
          {recipes.map((rec) => {
            const isSelected = rec.id === activeRecipeId;

            return (
              <div
                key={rec.id}
                onClick={() => {
                  onSelectRecipe(rec);
                  onOpenChange(false);
                }}
                className={`relative flex flex-col gap-2 p-3 rounded-lg border transition-all cursor-pointer group select-none ${
                  isSelected
                    ? "bg-indigo-950/30 border-indigo-500/70 shadow-sm"
                    : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40"
                }`}
              >
                {/* Header row: Recipe Name, Mod, Method, Selected indicator */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="font-semibold text-xs text-zinc-200 group-hover:text-white transition-colors">
                      {rec.name}
                    </span>
                    {rec.sourceMod && (
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[9px] font-medium text-zinc-300">
                        {rec.sourceMod}
                      </span>
                    )}
                    {rec.method && (
                      <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-medium text-indigo-300">
                        {rec.method}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isSelected && (
                      <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Machine and Timing */}
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    {(() => {
                      const cleanName = (rec.buildingRequired || "").replace(/ Loop$/, "");
                      const icon =
                        rec.buildingIcon ||
                        RAW_ITEM_ICONS[rec.buildingRequired] ||
                        RAW_ITEM_ICONS[cleanName];

                      if (icon && (icon.startsWith("/") || icon.startsWith("http"))) {
                        return (
                          <img
                            src={icon}
                            alt={rec.buildingRequired}
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
                    <span className="text-zinc-200 font-medium">{rec.buildingRequired}</span>
                  </span>
                  {rec.speedRpm && (
                    <span className="font-mono text-amber-400">
                      {rec.speedRpm} RPM
                    </span>
                  )}
                  {rec.processingTimeSeconds > 0 && (
                    <span className="flex items-center gap-1 font-mono text-zinc-400">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      {rec.processingTimeSeconds}s
                    </span>
                  )}
                </div>

                {/* Ingredients and Outputs summary */}
                <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-zinc-800/40 text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
                    <span className="text-zinc-500 shrink-0">Inputs:</span>
                    {rec.ingredients.length === 0 ? (
                      <span className="text-zinc-500">None</span>
                    ) : (
                      rec.ingredients.map((ing: Ingredient, idx) => (
                        <span
                          key={ing.itemId + idx}
                          className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-1.5 py-0.5 text-zinc-300 text-[10px]"
                        >
                          <span>{ing.itemName}</span>
                          <span className="font-mono text-zinc-400">×{ing.amount}</span>
                        </span>
                      ))
                    )}
                  </div>

                  {rec.outputs.length > 1 && (
                    <div className="flex items-center gap-1 shrink-0 text-[10px] text-zinc-500">
                      <span>Byproducts:</span>
                      <span className="font-mono text-zinc-400">+{rec.outputs.length - 1}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
          <span>Click any recipe to use it in the production calculation.</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-3 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
