import React from "react";
import type { GameDataset } from "../types/data";
import { GameHeader } from "./game-header";
import { GameCalculatorView } from "./game-calculator-view";
import { RightAdSidebar } from "./right-ad-sidebar";

export interface GameCalculatorAppProps {
  dataset: GameDataset;
}

export function GameCalculatorApp({ dataset }: GameCalculatorAppProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 flex flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Main App Workspace */}
      <main className="flex-1 w-full h-full min-w-0 min-h-0 overflow-hidden">
        <GameCalculatorView dataset={dataset} />
      </main>

      {/* Outer Right Ad Sidebar (Always Visible) */}
      <RightAdSidebar client="ca-pub-2144375932551709" className="h-full" />
    </div>
  );
}
