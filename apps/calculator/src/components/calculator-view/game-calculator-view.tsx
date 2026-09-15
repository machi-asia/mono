"use client";

import { useState, useMemo, useCallback, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, ChevronsUpDown, LayoutGrid, List, ArrowLeft } from "lucide-react";
import { Button, Card, Dropdown } from "@mono/components";
import { GAMES_DATA } from "../../data/games";
import type { GameItem, Recipe } from "../../data/types";
import { ItemDetailPopup } from "../item-detail-popup";
import { RecipeGraphView } from "../graph/recipe-graph";
import type { ProductionRequest } from "../../types/graph";
import "../../app/calculator.css";

type SortKey = "name" | "category";
type SortState = { key: SortKey; direction: "asc" | "desc" } | null;
type CatalogLayout = "gallery" | "list";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
];

function formatDate(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function categoryColor(category: string): string {
  let hash = 2166136261;
  for (let i = 0; i < category.length; i += 1) {
    hash ^= category.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hue = ((hash >>> 0) % 12) * 30;
  return `hsl(${hue} 55% 52%)`;
}

function ItemThumb({ item, eager }: { item: GameItem; eager: boolean }) {
  return (
    <div className="calc-item-icon" aria-hidden="true">
      {item.icon.startsWith("/") ? (
        <Image
          src={item.icon}
          alt={item.name}
          width={32}
          height={32}
          className="calc-item-icon-img"
          loading={eager ? "eager" : "lazy"}
          priority={eager}
        />
      ) : (
        item.icon
      )}
    </div>
  );
}

function ItemMeta({ item }: { item: GameItem }) {
  return (
    <div className="calc-item-title-wrap">
      <h3 className="calc-item-name">{item.name}</h3>
      <span className="calc-item-category">{item.category}</span>
      {item.lastUpdated && (
        <span className="calc-item-updated">Updated {formatDate(item.lastUpdated)}</span>
      )}
    </div>
  );
}

function ItemActions({
  item,
  activeRecipe,
  onRecipeSelect,
  onGraph,
}: {
  item: GameItem;
  activeRecipe?: Recipe;
  onRecipeSelect?: (recipeId: string) => void;
  onGraph: (itemId: string) => void;
}) {
  const recipeOptions = useMemo(() => {
    if (!item.recipes || item.recipes.length <= 1) return null;
    return item.recipes.map((r) => ({
      label: `${r.buildingRequired} (${r.processingTimeSeconds}s)`,
      value: r.id,
    }));
  }, [item.recipes]);

  return (
    <div className="calc-item-actions">
      {recipeOptions && recipeOptions.length > 0 ? (
        <div className="calc-recipe-select">
          <Dropdown
            items={recipeOptions}
            value={activeRecipe?.id || recipeOptions[0]?.value}
            placeholder="Recipe..."
            onChange={(val) => onRecipeSelect?.(val)}
          />
        </div>
      ) : (
        <span className="calc-rate-badge">{item.recipe?.buildingRequired || "Manual"}</span>
      )}
      <div className="calc-item-actions-group">
        <ItemDetailPopup item={item} recipe={activeRecipe} />
        <Button size="sm" variant="secondary" onClick={() => onGraph(item.id)}>
          Graph
        </Button>
      </div>
    </div>
  );
}

export interface GameCalculatorViewProps {
  gameId: string;
}

export function GameCalculatorView({ gameId }: GameCalculatorViewProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedGameId, setSelectedGameId] = useState<string>(gameId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortState, setSortState] = useState<SortState>(null);
  const [catalogLayout, setCatalogLayout] = useState<CatalogLayout>("gallery");
  const [activeView, setActiveView] = useState<"catalog" | "graph">("catalog");
  const [initialGraphRequests, setInitialGraphRequests] = useState<ProductionRequest[]>([]);
  const [recipeSelections, setRecipeSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (gameId && gameId !== selectedGameId) {
      setSelectedGameId(gameId);
      setSearchQuery("");
      setSortState(null);
      setInitialGraphRequests([]);
      setRecipeSelections({});
    }
  }, [gameId]);

  const handleGameChange = useCallback((newGameId: string) => {
    setSelectedGameId(newGameId);
    setSearchQuery("");
    setSortState(null);
    setInitialGraphRequests([]);
    setRecipeSelections({});

    const targetUrl = `/${newGameId}`;
    if (pathname !== targetUrl) {
      router.push(targetUrl);
    }
  }, [pathname, router]);

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
    const filtered = q
      ? currentGame.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        )
      : currentGame.items;

    if (!sortState) return filtered;

    const direction = sortState.direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const cmp = a[sortState.key].toLowerCase().localeCompare(b[sortState.key].toLowerCase());
      return cmp === 0 ? a.id.localeCompare(b.id) : cmp * direction;
    });
  }, [currentGame, searchQuery, sortState]);

  function handleSortKey(key: SortKey) {
    setSortState((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function handleCalculateItem(itemId: string) {
    const recipeId = recipeSelections[itemId];
    setInitialGraphRequests([{ itemId, targetQuantityPerMinute: 60, ...(recipeId ? { recipeId } : {}) }]);
    setActiveView("graph");
  }

  function handleRecipeSelect(itemId: string, recipeId: string) {
    setRecipeSelections((prev) => ({ ...prev, [itemId]: recipeId }));
  }

  function getActiveRecipe(item: GameItem): Recipe | undefined {
    if (!item.recipes || item.recipes.length === 0) return item.recipe;
    const selectedId = recipeSelections[item.id];
    if (selectedId) {
      return item.recipes.find((r) => r.id === selectedId) ?? item.recipes[0];
    }
    return item.recipes[0];
  }

  return (
    <div className="calc-page">
      <header className="calc-header">
        <div className="calc-header-inner">
          <div className="calc-title-row">
            <div className="calc-brand">
              <Link href="/" className="calc-back-hub-btn" aria-label="Back to all games directory">
                <ArrowLeft size={16} aria-hidden="true" />
                <span>All Games</span>
              </Link>
              <div className="calc-icon-badge" aria-hidden="true">
                ⚙️
              </div>
              <div>
                <h1 className="calc-title">{currentGame.name}</h1>
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

              <span className="calc-controls-label">Switch Game:</span>
              <Dropdown
                items={gameOptions}
                value={selectedGameId}
                onChange={handleGameChange}
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
            recipeOverrides={recipeSelections}
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

              <div className="calc-sort-group" role="group" aria-label="Sort items">
                {SORT_OPTIONS.map((opt) => {
                  const active = sortState?.key === opt.key;
                  const SortIcon =
                    active && sortState.direction === "asc"
                      ? ChevronUp
                      : active && sortState.direction === "desc"
                        ? ChevronDown
                        : ChevronsUpDown;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      className={`calc-sort-btn${active ? " active" : ""}`}
                      onClick={() => handleSortKey(opt.key)}
                      aria-pressed={active}
                    >
                      <span>{opt.label}</span>
                      <SortIcon size={14} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              <div className="calc-layout-toggle" role="group" aria-label="Catalog layout">
                <button
                  type="button"
                  className={`calc-layout-btn${catalogLayout === "gallery" ? " active" : ""}`}
                  onClick={() => setCatalogLayout("gallery")}
                  aria-pressed={catalogLayout === "gallery"}
                >
                  <LayoutGrid size={14} aria-hidden="true" />
                  <span>Gallery</span>
                </button>
                <button
                  type="button"
                  className={`calc-layout-btn${catalogLayout === "list" ? " active" : ""}`}
                  onClick={() => setCatalogLayout("list")}
                  aria-pressed={catalogLayout === "list"}
                >
                  <List size={14} aria-hidden="true" />
                  <span>List</span>
                </button>
              </div>
            </div>

            <div className={catalogLayout === "gallery" ? "calc-grid" : "calc-list"}>
              {filteredItems.map((item, idx) => (
                <Card
                  key={item.id}
                  className={catalogLayout === "gallery" ? "calc-item-card" : "calc-item-row"}
                  elevated={catalogLayout === "gallery"}
                  style={{ "--cat-color": categoryColor(item.category) } as CSSProperties}
                >
                  <div className="calc-item-header">
                    <ItemThumb item={item} eager={idx === 0} />
                    <ItemMeta item={item} />
                  </div>
                  <p className="calc-item-desc">{item.description}</p>
                  <ItemActions
                    item={item}
                    activeRecipe={getActiveRecipe(item)}
                    onRecipeSelect={(recipeId) => handleRecipeSelect(item.id, recipeId)}
                    onGraph={handleCalculateItem}
                  />
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}