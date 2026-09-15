"use client";

import { Popup, Button, Tooltip } from "@mono/components";
import type { GameItem } from "../data/types";

interface ItemDetailPopupProps {
  item: GameItem;
}

export function ItemDetailPopup({ item }: ItemDetailPopupProps) {
  const recipe = item.recipe;

  return (
    <Popup
      position="bottom"
      trigger={
        <Button size="sm" variant="secondary">
          View Recipe
        </Button>
      }
    >
      <div className="calc-popup-box">
        <div className="calc-popup-header">
          <h4 className="calc-popup-title">{item.name} Recipe</h4>
          <Tooltip
            variant="help"
            position="left"
            triggerAriaLabel="Recipe information"
            content="Standard production specification including required building, cycle duration, and ingredient proportions."
          />
        </div>

        {recipe ? (
          <>
            <div className="calc-popup-specs">
              <div className="calc-spec-item">
                <span className="calc-spec-label">Building Required</span>
                <span className="calc-spec-value">{recipe.buildingRequired}</span>
              </div>
              <div className="calc-spec-item">
                <span className="calc-spec-label">Processing Time</span>
                <span className="calc-spec-value">{recipe.processingTimeSeconds}s / cycle</span>
              </div>
            </div>

            <div>
              <div className="calc-section-label">
                <span>Ingredients</span>
                <span className="calc-rate-badge">Inputs</span>
              </div>
              <ul className="calc-ingredients-list">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.itemId} className="calc-ingredient-row">
                    <span>{ing.itemName}</span>
                    <span className="calc-ingredient-amount">x {ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="calc-section-label">
                <span>Output</span>
                <span className="calc-rate-badge">Yield</span>
              </div>
              <ul className="calc-ingredients-list">
                {recipe.outputs.map((out) => (
                  <li key={out.itemId} className="calc-ingredient-row">
                    <span>{out.itemName}</span>
                    <span className="calc-ingredient-amount">x {out.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="calc-item-desc">No recipe data available for this item.</p>
        )}
      </div>
    </Popup>
  );
}