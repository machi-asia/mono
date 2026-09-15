# ADR 014: Multi-Game Production Calculator App

- **Status**: Accepted
- **Date**: 2026-09-14

## Context

Players of automation, crafting, and sandbox factory games (such as Satisfactory, Factorio, Minecraft, and Dyson Sphere Program) regularly need to plan complex production lines, requiring quick reference to crafting recipes, processing times, required buildings, ingredient ratios, and output quantities.

The monorepo requires a dedicated calculator application under `/apps/calculator` that supports multi-game item exploration and recipe inspection while adhering to organization standards: `@mono/auth` authentication gate, `@mono/components` layout and interactive design primitives (`Dropdown`, `Popup`, `Card`, `Row`, `Col`, `Button`, `Tooltip`), dark-primary token-based theme, and files kept strictly under 500 lines.

## Decision

We introduce `@mono/calculator-app` in `/apps/calculator` as a Next.js application:

1. **Game Selection**: A header control utilizing `@mono/components`'s `Dropdown` allows switching between supported games (Little Rocket Lab (LRL), Satisfactory, Factorio, Minecraft, Dyson Sphere Program), with Little Rocket Lab configured as the default first game.
2. **Item Grid & Search**: An interactive catalog rendered via `Card`, `Row`, and `Col` layout primitives with search filtering across item names, categories, and descriptions, supporting both unicode emoji icons and photo assets (e.g. `/public/lrl/items/`).
3. **Item Recipe Popups**: Each item card features an inspection action using the `@mono/components` `Popup` component. Opening the popup reveals:
   - Recipe name and help tooltip (`<Tooltip variant="help">`).
   - Required crafting building (e.g. Assembler, Chemical Plant, Drill, Smelter, Constructor, Matrix Lab, Crafting Table).
   - Processing time per cycle (in seconds).
   - Input ingredients with exact required quantities.
   - Output items with yield counts.
4. **Data Modeling & Modular Organization**: Extensible TypeScript data structures (`GameDataset`, `GameItem`, `Recipe`, `Ingredient`, `OutputItem`) in `src/data/types.ts`. All game items are organized modularly in dedicated folders with file-based datasets (e.g. `data/lrl/items.xml`, `data/minecraft/items.xml`) and parsed by `parseGameDatasetXml` in `src/data/xml-parser.ts`.
5. **Interactive Recipe Tree Calculation Graph**: An interactive node-based calculation engine using React Flow and Dagre hierarchical layout:
   - Evaluates multi-tier production chains from requested target output rates.
   - Calculates exact machine requirements (`buildingCount`), processing durations, and conveyor belt saturation counts (`belts = ceil(rate / 90)`).
   - Prevents recursion deadlocks with cycle-detection guards.
   - Leverages `@mono/components` extensively (`Card`, `Button`, `Dropdown`, `Usage`, `Tooltip`) for node rendering, target controls, and machine capacity overviews.

## Consequences

- Users can switch between Catalog View and interactive Recipe Tree Graph View to calculate complex automation setups.
- Real-time recipe calculations instantly reflect changes in production target quantities.
- All code complies with organizational quality gates: Vitest unit testing, ESLint, Stylelint, TypeScript strict checking, and token styling.