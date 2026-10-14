"use client";

import BusinessToolsDiagram from "./diagrams/BusinessToolsDiagram";
import BlogPromptDiagram from "./diagrams/BlogPromptDiagram";
import RedisSessionsDiagram from "./diagrams/RedisSessionsDiagram";
import TailwindMigrationDiagram from "./diagrams/TailwindMigrationDiagram";
import ReactComponentsDiagram from "./diagrams/ReactComponentsDiagram";
import MobileResponsivenessDiagram from "./diagrams/MobileResponsivenessDiagram";
import AssetMigrationDiagram from "./diagrams/AssetMigrationDiagram";
import LocationsModuleDiagram from "./diagrams/LocationsModuleDiagram";
import CategoryNavigationDiagram from "./diagrams/CategoryNavigationDiagram";
import MarketplaceIntegrationsDiagram from "./diagrams/MarketplaceIntegrationsDiagram";

interface DiagramProps {
    type:
        | "business-tools"
        | "blog-prompt"
        | "redis-sessions"
        | "tailwind-migration"
        | "react-components"
        | "mobile-responsiveness"
        | "asset-migration"
        | "locations-module"
        | "category-navigation"
        | "marketplace-integrations";
    variant: "compact" | "detailed";
}

const diagramMap: Record<DiagramProps["type"], React.ComponentType<{ variant: "compact" | "detailed" }>> = {
    "business-tools": BusinessToolsDiagram,
    "blog-prompt": BlogPromptDiagram,
    "redis-sessions": RedisSessionsDiagram,
    "tailwind-migration": TailwindMigrationDiagram,
    "react-components": ReactComponentsDiagram,
    "mobile-responsiveness": MobileResponsivenessDiagram,
    "asset-migration": AssetMigrationDiagram,
    "locations-module": LocationsModuleDiagram,
    "category-navigation": CategoryNavigationDiagram,
    "marketplace-integrations": MarketplaceIntegrationsDiagram,
};

export default function ExperienceDiagram({ type, variant }: DiagramProps) {
    const Diagram = diagramMap[type];
    return Diagram ? <Diagram variant={variant} /> : null;
}