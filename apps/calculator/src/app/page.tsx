import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import { GAMES_DATA } from "../data/games";
import "./calculator.css";

export const metadata: Metadata = {
  title: "Game Directory",
  description:
    "Explore crafting and production calculators across supported factory and sandbox games including Little Rocket Lab, Vanilla Furniture Expanded, Satisfactory, Factorio, Minecraft, and Dyson Sphere Program.",
  alternates: {
    canonical: "/",
  },
};

// Curated preview item IDs/names to display for each game card
const GAME_PREVIEW_ITEMS: Record<string, string[]> = {
  lrl: ["Boardwalk Plank", "Radio Antenna", "Roof Tile"],
  satisfactory: ["Iron Ingot", "Iron Plate", "Reinforced Iron Plate"],
  factorio: ["Iron Gear Wheel", "Electronic Circuit", "Transport Belt"],
  minecraft: ["Iron Ingot", "Wooden Plank", "Chest"],
  "dyson-sphere-program": ["Iron Ingot", "Magnetic Coil", "Circuit Board"],
  "vfe-factory": ["Mass-Produced Meal", "Processed Mince", "Canned Soup"],
};

export default function HomePage() {
  return (
    <div className="calc-page">
      <header className="calc-hub-header">
        <div className="calc-hub-hero">
          <div className="calc-hub-badge">
            <Layers size={14} aria-hidden="true" />
            <span>Multi-Game Production Suite</span>
          </div>
          <h1 className="calc-hub-title">Game Production Calculator</h1>
          <p className="calc-hub-subtitle">
            Select a game below to plan factory lines, optimize throughput ratios, calculate required building counts, and visualize full interactive recipe dependency trees.
          </p>
        </div>
      </header>

      <main className="calc-hub-main">
        <div className="calc-hub-grid">
          {GAMES_DATA.map((game) => {
            const preferredNames = GAME_PREVIEW_ITEMS[game.id] || [];
            const previewItems = (
              preferredNames.length > 0
                ? preferredNames.map((n) => game.items.find((i) => i.name === n || i.id === n)).filter(Boolean)
                : game.items.slice(0, 3)
            ) as typeof game.items;

            return (
              <Link
                key={game.id}
                href={`/${game.id}`}
                className="calc-game-card"
                aria-label={`Open calculator for ${game.name}`}
              >
                <div className="calc-game-card-preview">
                  <div className="calc-game-card-icon-mosaic">
                    {previewItems.map((item, idx) => (
                      <div key={item.id || idx} className="calc-game-mosaic-item">
                        {item.icon && item.icon.startsWith("/") ? (
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={36}
                            height={36}
                            className="calc-game-mosaic-img"
                          />
                        ) : (
                          <span className="calc-game-mosaic-emoji">{item.icon || "📦"}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="calc-game-card-body">
                  <div className="calc-game-card-header">
                    <h2 className="calc-game-card-title">{game.name}</h2>
                    <span className="calc-game-card-count">
                      {game.items.length} {game.items.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  <p className="calc-game-card-desc">{game.tagline}</p>

                  <div className="calc-game-card-footer">
                    <span>Open Calculator</span>
                    <span className="calc-game-card-arrow" aria-hidden="true">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}