"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button, Card, Dropdown } from "@mono/components";
import { GAMES_DATA } from "../data/games";
import { ItemDetailPopup } from "../components/item-detail-popup";
import { RecipeGraphView } from "../components/graph/recipe-graph";
import type { ProductionRequest } from "../types/graph";
import "./calculator.css";

export default function CalculatorPage() {
  const [selectedGameId, setSelectedGameId] = useState<string>(GAMES_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeView, setActiveView] = useState<"catalog" | "graph">("catalog");
  const [initialGraphRequests, setInitialGraphRequests] = useState<ProductionRequest[]>([]);

  const currentGame = useMemo(() => {
    return GAMES_DATA.find((g) => g.id === selectedGameId) || GAMES_DATA[0];
  }, [selectedGameId]);

  const gameOptions = useMemo(() => {
    return GAMES_DATA.map((g) => ({
      label: g.name,
      value: g.id,
    }));
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return currentGame.items;
    return currentGame.items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [currentGame, searchQuery]);

  function handleCalculateItem(itemId: string) {
    setInitialGraphRequests([{ itemId, targetQuantityPerMinute: 60 }]);
    setActiveView("graph");
  }

  return (
    <div className="calc-page">
      <header className="calc-header">
        <div className="calc-header-inner">
          <div className="calc-title-row">
            <div className="calc-brand">
              <div className="calc-icon-badge" aria-hidden="true">
                ⚙️
              </div>
              <div>
                <h1 className="calc-title">Game Production Calculator</h1>
                <p className="calc-tagline">{currentGame.tagline}</p>
              </div>
            </div>

            <div className="calc-controls">
              <div className="calc-view-toggle" role="group" aria-label="View Switcher">
                <button
                  type="button"
                  className={`calc-view-toggle-btn ${activeView === "catalog" ? "active" : ""}`}
                  onClick={() => setActiveView("catalog")}
                >
                  Catalog View
                </button>
                <button
                  type="button"
                  className={`calc-view-toggle-btn ${activeView === "graph" ? "active" : ""}`}
                  onClick={() => setActiveView("graph")}
                >
                  Recipe Tree Graph
                </button>
              </div>

              <span className="calc-controls-label">Select Game:</span>
              <Dropdown
                items={gameOptions}
                value={selectedGameId}
                onChange={(val: string) => {
                  setSelectedGameId(val);
                  setSearchQuery("");
                  setInitialGraphRequests([]);
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className={`calc-main ${activeView === "graph" ? "calc-main-graph" : ""}`}>
        {activeView === "graph" ? (
          <RecipeGraphView
            items={currentGame.items}
            gameName={currentGame.name}
            initialRequests={initialGraphRequests}
            onBackToCatalog={() => setActiveView("catalog")}
          />
        ) : (
          <>
            <div className="calc-filter-bar">
              <input
                type="text"
                className="calc-search-input"
                placeholder={`Search ${currentGame.name} items...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter items"
              />
              <span className="calc-count">
                Showing {filteredItems.length} of {currentGame.items.length} items
              </span>
            </div>

            <div className="calc-grid">
              {filteredItems.map((item, idx) => (
                <Card key={item.id} className="calc-item-card" elevated>
                  <div className="calc-item-header">
                    <div className="calc-item-icon" aria-hidden="true">
                      {item.icon.startsWith("/") ? (
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="calc-item-icon-img"
                          loading={idx === 0 ? "eager" : "lazy"}
                          priority={idx === 0}
                        />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div className="calc-item-title-wrap">
                      <h3 className="calc-item-name">{item.name}</h3>
                      <span className="calc-item-category">{item.category}</span>
                    </div>
                  </div>

                  <p className="calc-item-desc">{item.description}</p>

                  <div className="calc-item-actions">
                    <span className="calc-rate-badge">
                      {item.recipe?.buildingRequired || "Manual"}
                    </span>
                    <div className="calc-item-actions-group">
                      <ItemDetailPopup item={item} />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCalculateItem(item.id)}
                      >
                        Graph
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
