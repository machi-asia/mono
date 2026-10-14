"use client";

import React, { useState } from "react";
import type { GameDataset, GameItem } from "../types/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Flag, CheckCircle2, Send, Plus, Trash2, Wrench, Clock, Image, Layers } from "lucide-react";
import { submitIssueReport } from "../lib/supabase-client";

export type ReportIssueType = "wrong_recipe" | "wrong_throughput" | "missing_recipe" | "wrong_icon" | "other";

interface ReportIssueModalProps {
  dataset: GameDataset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedItem?: GameItem | null;
}

export function ReportIssueModal({
  dataset,
  open,
  onOpenChange,
  preselectedItem,
}: ReportIssueModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(preselectedItem?.id || "");
  const [issueType, setIssueType] = useState<ReportIssueType>("wrong_recipe");
  const [description, setDescription] = useState("");
  const [suggestedFix, setSuggestedFix] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic Correction Fields:
  // 1. Wrong Recipe / Missing Recipe corrections
  const [recipeMethod, setRecipeMethod] = useState("");
  const [machineRequired, setMachineRequired] = useState("");
  const [outputAmount, setOutputAmount] = useState<string>("1");
  const [intendedIngredients, setIntendedIngredients] = useState<Array<{ name: string; amount: string }>>([
    { name: "", amount: "1" },
  ]);

  // 2. Wrong Throughput / Rate corrections
  const [intendedProcessingTime, setIntendedProcessingTime] = useState("");
  const [intendedRpm, setIntendedRpm] = useState("");
  const [intendedItemsPerMin, setIntendedItemsPerMin] = useState("");

  // 3. Wrong / Missing Icon corrections
  const [intendedIconUrl, setIntendedIconUrl] = useState("");

  // Current selected item details
  const selectedItem = dataset.items.find((i) => i.id === selectedItemId);

  // Sync if preselectedItem changes when opened
  React.useEffect(() => {
    if (open) {
      if (preselectedItem?.id) {
        setSelectedItemId(preselectedItem.id);
      }
      setSubmitted(false);
    }
  }, [open, preselectedItem]);

  // Auto-populate some recipe details if item is selected
  React.useEffect(() => {
    if (selectedItem && selectedItem.recipes && selectedItem.recipes.length > 0) {
      const rec = selectedItem.recipes[0]!;
      if (!recipeMethod) setRecipeMethod(rec.method || "");
      if (!machineRequired) setMachineRequired(rec.buildingRequired || "");
      if (rec.outputs && rec.outputs.length > 0) {
        setOutputAmount(String(rec.outputs[0]?.amount || 1));
      }
      if (rec.processingTimeSeconds && !intendedProcessingTime) {
        setIntendedProcessingTime(String(rec.processingTimeSeconds));
      }
      if (rec.speedRpm && !intendedRpm) {
        setIntendedRpm(String(rec.speedRpm));
      }
    }
  }, [selectedItem]);

  const handleAddIngredientRow = () => {
    setIntendedIngredients((prev) => [...prev, { name: "", amount: "1" }]);
  };

  const handleRemoveIngredientRow = (idx: number) => {
    setIntendedIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (idx: number, field: "name" | "amount", val: string) => {
    setIntendedIngredients((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Filter out empty ingredient rows
    const cleanedIngredients = intendedIngredients
      .filter((row) => row.name.trim().length > 0)
      .map((row) => ({
        name: row.name.trim(),
        amount: parseFloat(row.amount) || 1,
      }));

    const reportPayload = {
      gameId: dataset.id,
      itemId: selectedItemId || "general",
      itemName: selectedItem?.name || "General / Not Specified",
      issueType,
      description: description.trim(),
      suggestedFix: suggestedFix.trim(),
      // Contextual correction details
      corrections: {
        recipeMethod: recipeMethod.trim() || undefined,
        machineRequired: machineRequired.trim() || undefined,
        outputAmount: outputAmount ? parseFloat(outputAmount) : undefined,
        ingredients: cleanedIngredients.length > 0 ? cleanedIngredients : undefined,
        processingTimeSeconds: intendedProcessingTime ? parseFloat(intendedProcessingTime) : undefined,
        speedRpm: intendedRpm ? parseFloat(intendedRpm) : undefined,
        intendedItemsPerMin: intendedItemsPerMin ? parseFloat(intendedItemsPerMin) : undefined,
        iconUrl: intendedIconUrl.trim() || undefined,
      },
    };

    // Send to Supabase asynchronously
    submitIssueReport(reportPayload).catch((e) => {
      console.warn("Could not save issue report to Supabase:", e);
    });

    try {
      const existing = JSON.parse(localStorage.getItem("game_calc_reports") || "[]");
      existing.push({ ...reportPayload, timestamp: new Date().toISOString() });
      localStorage.setItem("game_calc_reports", JSON.stringify(existing));
    } catch {
      // localStorage may fail in private mode
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setDescription("");
    setSuggestedFix("");
    setRecipeMethod("");
    setMachineRequired("");
    setOutputAmount("1");
    setIntendedIngredients([{ name: "", amount: "1" }]);
    setIntendedProcessingTime("");
    setIntendedRpm("");
    setIntendedItemsPerMin("");
    setIntendedIconUrl("");
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-5 bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
        <DialogHeader className="pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                Report Recipe / Data Issue
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                Notice an incorrect recipe, wrong throughput, missing method, or wrong icon in {dataset.name}? Fill in any known corrections below.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">Report Submitted</h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Thank you! Your feedback and correction details have been saved and will be used to improve the dataset.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 px-4 py-1.5 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
            {/* Top row: Item Selector & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Item Selector */}
              <div className="space-y-1">
                <label htmlFor="report-item-select" className="text-xs font-medium text-zinc-300">
                  Related Item / Machine
                </label>
                <select
                  id="report-item-select"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 truncate"
                >
                  <option value="">General (Not item specific)</option>
                  {dataset.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Type */}
              <div className="space-y-1">
                <label htmlFor="report-issue-type" className="text-xs font-medium text-zinc-300">
                  Issue Category
                </label>
                <select
                  id="report-issue-type"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as ReportIssueType)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="wrong_recipe">Wrong Recipe / Ingredients</option>
                  <option value="wrong_throughput">Incorrect Throughput / Time / Ratios</option>
                  <option value="missing_recipe">Missing Recipe or Alternate Method</option>
                  <option value="wrong_icon">Missing or Wrong Icon / Image</option>
                  <option value="other">Other / Calculation Bug</option>
                </select>
              </div>
            </div>

            {/* Context-Specific Correction Fields */}
            {(issueType === "wrong_recipe" || issueType === "missing_recipe") && (
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-indigo-500/20 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Recipe Correction Details (Optional)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Crafting Method</label>
                    <input
                      type="text"
                      value={recipeMethod}
                      onChange={(e) => setRecipeMethod(e.target.value)}
                      placeholder="e.g. Mechanical Crafter, Compacting..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Machine / Facility</label>
                    <input
                      type="text"
                      value={machineRequired}
                      onChange={(e) => setMachineRequired(e.target.value)}
                      placeholder="e.g. Mixer, Press, Drill..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Output Amount Produced</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={outputAmount}
                      onChange={(e) => setOutputAmount(e.target.value)}
                      placeholder="e.g. 1"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Intended Ingredients Section */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                      <Layers className="h-3 w-3 text-zinc-400" />
                      <span>Intended Ingredients & Quantities</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddIngredientRow}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      <span>Add Ingredient</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
                    {intendedIngredients.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                          placeholder="Ingredient item name (e.g. Andesite, Iron Ingot)..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                        />
                        <div className="w-24 flex items-center gap-1">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={row.amount}
                            onChange={(e) => handleIngredientChange(idx, "amount", e.target.value)}
                            placeholder="Qty"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 text-right"
                          />
                          <span className="text-[10px] text-zinc-500">x</span>
                        </div>
                        {intendedIngredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredientRow(idx)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove ingredient"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Throughput / Speed Specific Fields */}
            {issueType === "wrong_throughput" && (
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Throughput & Rate Corrections (Optional)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Time per Craft (seconds)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={intendedProcessingTime}
                      onChange={(e) => setIntendedProcessingTime(e.target.value)}
                      placeholder="e.g. 4.0"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Operational Speed (RPM)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={intendedRpm}
                      onChange={(e) => setIntendedRpm(e.target.value)}
                      placeholder="e.g. 128"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Intended Items/Min</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={intendedItemsPerMin}
                      onChange={(e) => setIntendedItemsPerMin(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Icon / Asset Specific Fields */}
            {issueType === "wrong_icon" && (
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                  <Image className="h-3.5 w-3.5" />
                  <span>Correct Icon / Image Link (Optional)</span>
                </div>
                <div>
                  <input
                    type="text"
                    value={intendedIconUrl}
                    onChange={(e) => setIntendedIconUrl(e.target.value)}
                    placeholder="https://... image URL or wiki asset path"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="report-description" className="text-xs font-medium text-zinc-300">
                What is incorrect? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="report-description"
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what's wrong with the recipe, machine, or rate calculation..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Suggested Fix / Source URL (Optional) */}
            <div className="space-y-1">
              <label htmlFor="report-fix" className="text-xs font-medium text-zinc-300">
                Reference Source or Wiki URL (Optional)
              </label>
              <input
                id="report-fix"
                type="text"
                value={suggestedFix}
                onChange={(e) => setSuggestedFix(e.target.value)}
                placeholder="e.g. https://create.fandom.com/wiki/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow transition-colors cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
