import Link from "next/link";
import { ArrowRight, Layers, Sparkles, Cpu, Cog, AlertTriangle } from "lucide-react";
import { GAMES_METADATA } from "@mono/game-calculator/data";
import { RightAdSidebar } from "@mono/game-calculator";
import { APPS_CONFIG } from "@mono/app-config";

const GAMES = [
  {
    ...GAMES_METADATA.create,
    config: APPS_CONFIG.create,
    appUrl: "https://create.itemlist.online",
    icon: <Cog className="h-6 w-6 text-amber-400" />,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    badge: "Minecraft Mod",
    previewIcons: ["⚙️", "🥢", "🔨", "⏱️"],
  },
  {
    ...GAMES_METADATA.rimworld,
    config: APPS_CONFIG.rimworld,
    appUrl: "https://rimworld.itemlist.online",
    icon: <Cpu className="h-6 w-6 text-cyan-400" />,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    badge: "Colony Sim",
    previewIcons: ["⚙️", "🎛️", "💊", "👁️"],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-row selection:bg-indigo-500 selection:text-white">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Banner */}
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">Game Production Suite</span>
              <span className="ml-2 text-xs text-zinc-400 border border-zinc-800 rounded px-1.5 py-0.5">Directory Hub</span>
            </div>
          </div>
          <div className="text-xs text-zinc-500">
            Next.js Turborepo Architecture
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Factory & Crafting Dependency Calculators
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Select Your Game
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Plan production rates, calculate required building counts, avoid manufacturing bottlenecks, and visualize full interactive recipe dependency trees.
          </p>
        </div>

        {/* Game Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {GAMES.map((game) => {
            const isDev = Boolean(game.config?.underDevelopment);
            return (
              <a
                key={game.id}
                href={game.appUrl}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />

                {/* Caution / Construction Tape Overlay if Under Development */}
                {isDev && (
                  <div className="absolute -right-12 top-7 rotate-45 z-30 pointer-events-none shadow-lg">
                    <div
                      className="px-14 py-1 text-[11px] font-black uppercase tracking-wider text-black text-center border-y-2 border-black/40 shadow-inner"
                      style={{
                        background: "repeating-linear-gradient(45deg, #eab308, #eab308 12px, #dc2626 12px, #dc2626 24px)",
                        color: "#ffffff",
                        textShadow: "0 1px 2px rgba(0,0,0,0.8)"
                      }}
                    >
                      Under Development
                    </div>
                  </div>
                )}
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/80 shadow-md">
                      {game.icon}
                    </div>
                    <span className="rounded-full bg-zinc-800/90 border border-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      <span>{game.name}</span>
                      {isDev && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                          <AlertTriangle className="h-3 w-3 text-amber-400" />
                          WIP
                        </span>
                      )}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                      {game.tagline}
                    </p>
                  </div>

                  {/* Preview Icons Mosaic */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-zinc-500 font-medium">Key Items:</span>
                    <div className="flex items-center gap-1.5">
                      {game.previewIcons.map((icon, idx) => (
                        <span
                          key={idx}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800/80 text-sm border border-zinc-700/60"
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <span className="text-xs font-mono text-zinc-500">
                    {game.itemCount} Registered Items
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all">
                    Launch Calculator
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
          Multi-App Production Calculator Monorepo • Powered by Turborepo & Next.js
        </footer>
      </div>

      {/* Right Ad Sidebar (Always Visible) */}
      <RightAdSidebar client="ca-pub-2144375932551709" className="min-h-screen" />
    </div>
  );
}
