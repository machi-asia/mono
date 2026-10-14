"use client";

import React from "react";
import { motion } from "framer-motion";
import Tooltip from "./Tooltip";
import { MarkdownRenderer } from "@mono/components";
import { getYearsSince } from "../utils/duration";
import {
    techStackNodes,
    techStackEdges,
    techIconMap,
    darkIconIds,
} from "../data/tech-stack";
import "../styles/techstack-diagram.css";

// Organized, multi-directional coordinates (diagram clusters)
const nodePositions: Record<string, { x: number; y: number }> = {
    // Column 1: DevOps & Tools (x = 50)
    vscode: { x: 50, y: 80 },
    figma: { x: 50, y: 210 },
    git: { x: 50, y: 340 },
    docker: { x: 50, y: 470 },

    // Row 1: Languages & Core (y = 70)
    typescript: { x: 250, y: 70 },
    nodejs: { x: 400, y: 70 },
    python: { x: 600, y: 70 },
    csharp: { x: 750, y: 70 },

    // Row 2: Frameworks & Engines (y = 250)
    nextjs: { x: 250, y: 230 },
    react: { x: 400, y: 230 },
    vercel: { x: 550, y: 230 },
    unity: { x: 750, y: 230 },

    // Row 3 (Left): UI & Animation (x = 240 / 390)
    tailwind: { x: 240, y: 420 },
    css: { x: 390, y: 420 },
    radix: { x: 240, y: 490 },
    lucide: { x: 390, y: 490 },
    gsap: { x: 240, y: 560 },
    lenis: { x: 390, y: 560 },
    tsparticles: { x: 315, y: 620 },

    // Row 3 (Right): Data & Services (x = 610 / 780)
    restapi: { x: 610, y: 420 },
    githubapi: { x: 780, y: 420 },
    supabase: { x: 610, y: 490 },
    postgresql: { x: 780, y: 490 },
    pandas: { x: 610, y: 560 },
    pytorch: { x: 780, y: 560 },
    analytics: { x: 695, y: 620 },
};

// Rich technical descriptions for nodes
const nodeDetails: Record<
    string,
    {
        description: string;
        roles: string[];
    }
> = {
    nextjs: {
        description: "Next.js is Angelo's primary React framework for building fast, SEO-optimized production web apps using the App Router, Server Components, and API Route Handlers.",
        roles: ["Full-Stack Routing", "Server-Side Rendering (SSR)", "API route orchestration"]
    },
    react: {
        description: "React is the foundation of Angelo's frontend architecture, enabling modular, stateful UI development with hooks and concurrent rendering features.",
        roles: ["UI Component Model", "Client-Side State Management", "Declarative Views"]
    },
    typescript: {
        description: "TypeScript provides the static type safety, interfaces, and compile-time check protections that make the codebase scalable and self-documenting.",
        roles: ["Type Safety", "Developer Tooling", "Modern JS Syntax"]
    },
    radix: {
        description: "Radix UI Primitives supply unstyled, accessible UI components (dialogs, tabs, dropdowns) that serve as the layout bones for the custom styled elements.",
        roles: ["WAI-ARIA Accessibility", "Headless Primitives", "Modal & Tab Orchestration"]
    },
    lucide: {
        description: "Lucide React provides clean, responsive vector-based icons that scale automatically with the theme fonts and layout styles.",
        roles: ["SVG Iconography", "Visual Direction", "Vector Icons"]
    },
    tailwind: {
        description: "Tailwind CSS v4 is used for atomic visual styling, enabling fast styling iterations directly inside TSX markup via a highly performant utility engine.",
        roles: ["Utility-First Styling", "Responsive Layout Utilities", "Theme Integration"]
    },
    css: {
        description: "Vanilla CSS is written in specialized stylesheets to handle complex custom behaviors, keyframe animations, and custom theme variable triggers.",
        roles: ["Custom Layout Overrides", "Keyframe Animations", "Theme CSS Variables"]
    },
    gsap: {
        description: "GSAP (GreenSock Animation Platform) drives advanced scroll-bound animations, interactive UI morphing, and premium vector page transitions.",
        roles: ["ScrollTrigger Timelines", "Micro-interactions", "High-Performance Tweening"]
    },
    tsparticles: {
        description: "tsParticles powers the interactive particle background of the landing page, handling canvas canvas rendering and mouse repulsion calculations.",
        roles: ["Interactive Canvas Background", "Cursor Repulsion Physics", "Ambient Particle Fields"]
    },
    lenis: {
        description: "Lenis scroll provides the smooth, non-disruptive inertial scrolling engine that coordinates with GSAP ScrollTriggers for layout animations.",
        roles: ["Smooth Inertial Scroll", "Scroll Synchronization", "Improved UX Physics"]
    },
    nodejs: {
        description: "Node.js runs the runtime execution environment for serverless backend scripts, NPM tooling, and dev execution servers.",
        roles: ["Backend Runtime Environment", "API Operations", "NPM Ecosystem"]
    },
    restapi: {
        description: "REST APIs serve structured HTTP endpoints for public inquiries, GitHub live sync, and admin dashboard controls.",
        roles: ["JSON Endpoint Routing", "Method Validation (GET/POST)", "Status Codes Control"]
    },
    supabase: {
        description: "Supabase provides the backend platform, managing user authentication, row-level security (RLS), and database query clients.",
        roles: ["User Authentication (JWT)", "Database Client SDK", "Session Middleware Integration"]
    },
    python: {
        description: "Python is Angelo's scripting language of choice for machine learning development, data pipeline parsing, and automated server workflows.",
        roles: ["Data Science & ML Coding", "Automation Scripts", "Backend API Integration"]
    },
    githubapi: {
        description: "GitHub API is integrated to dynamically pull repository details, activity streams, and commit metrics for the live showcase sections.",
        roles: ["Dynamic Feed Ingestion", "REST Query Fetching", "Rate-limit Caching"]
    },
    postgresql: {
        description: "PostgreSQL serves as the core relational database storing conversation threads, contact messages, user profiles, and logs.",
        roles: ["Relational Data Storage", "Row-Level Security (RLS)", "Auto-increment Queries"]
    },
    pandas: {
        description: "Pandas is used for importing, transforming, and analyzing tabular datasets in Python data analytics pipelines.",
        roles: ["Dataframe Restructuring", "Data Cleaning", "Data Analytics Engine"]
    },
    pytorch: {
        description: "PyTorch powers the machine learning model definition, tensor math, and neural network training processes.",
        roles: ["Deep Learning Models", "Tensor Calculations", "AI Model Execution"]
    },
    csharp: {
        description: "C# is the programming language utilized for Unity scripting, powering game logic, state loops, and mechanics.",
        roles: ["Object-Oriented Coding", "Game Logic Scripting", "Unity Class References"]
    },
    unity: {
        description: "Unity is the 3D/2D game engine used to build interactive desktop/mobile games, compiling C# scripts into binaries.",
        roles: ["Game Development Lifecycle", "Cross-Platform Compiles", "Asset & Sprite Management"]
    },
    analytics: {
        description: "Vercel Web Analytics tracks page visits, user clicks, and duration metrics to analyze site interactions.",
        roles: ["Telemetry Audits", "User Interaction Logging", "Privacy-First Tracking"]
    },
    git: {
        description: "Git tracks version history, coordinates code changes, and integrates with remote repositories for CD pipeline triggers.",
        roles: ["Version Control System", "Branch Merge Workflows", "Commit History Log"]
    },
    docker: {
        description: "Docker containerizes application environments, ensuring identical runtime setups across developer machines and cloud hosts.",
        roles: ["Container Packaging", "Environment Isolation", "Multi-Stage Dockerfiles"]
    },
    vercel: {
        description: "Vercel hosts the portfolio website, automating deployment from Git commits, hosting serverless edge functions, and serving edge caches.",
        roles: ["Continuous Deployment (CD)", "Edge Functions Hosting", "SSL & CDN Management"]
    },
    figma: {
        description: "Figma is the design board where Angelo prototypes layouts, checks typographies, and refines colors before coding components.",
        roles: ["UX/UI Design Prototyping", "Vector Asset Exporting", "Layout Sizing Blueprints"]
    },
    vscode: {
        description: "VS Code is Angelo's main development editor, customized with syntax linters, debugger bindings, and version control hooks.",
        roles: ["Source Code Editor", "Extensions Toolchain", "Integrated Terminal Debug"]
    }
};

// Comprehensive edge relationship explanations
const edgeDetails: Record<string, string> = {
    "nextjs-react": "Next.js uses React's component library and virtual DOM to construct page templates, handling layouts and routing on top of React views.",
    "nextjs-typescript": "Next.js integrates TypeScript natively, generating page route types and compiling strongly typed server components for safety.",
    "react-radix": "React mounts Radix UI primitives as unstyled base elements, wrapping them with interactive hooks and custom styled states.",
    "react-lucide": "React renders Lucide SVGs as lightweight responsive icon components that adapt dynamically to state and font sizes.",
    "react-tsparticles": "React embeds the tsParticles canvas viewport as a background element, managing canvas sizing events and state lifecycles.",
    "radix-lucide": "Radix UI accessible elements (like triggers and accordions) utilize Lucide vector icons internally to guide user actions.",
    "nextjs-tailwind": "Next.js loads Tailwind CSS variables during static page builds, compiling atomic classes into fast-loading static stylesheets.",
    "nextjs-css": "Next.js pages import custom CSS files for page-specific layout overrides, keyframe animations, and custom theme switches.",
    "tailwind-css": "Tailwind CSS v4 processes and compiles atomic classes directly into vanilla CSS stylesheets during the build output phase.",
    "typescript-tailwind": "TypeScript verifies class names, theme configurations, and layout variables within Tailwind's config definitions.",
    "nextjs-restapi": "Next.js Route Handlers serve custom REST API endpoints (like message submissions and conversation list retrievals).",
    "restapi-supabase": "REST API route handlers invoke the Supabase server client, authorizing database queries via session cookies and JWT checks.",
    "restapi-githubapi": "REST API endpoints fetch real-time repository data from the GitHub API, returning cached payloads to client components.",
    "typescript-supabase": "TypeScript types the Supabase client wrapper, ensuring that database queries return strongly-typed table responses.",
    "nextjs-gsap": "Next.js client-side pages initialize GSAP timelines inside useEffect blocks, animating local DOM references on page mount.",
    "nextjs-lenis": "Next.js wraps its layout container with a Lenis scroll provider, controlling window scroll events across client sub-pages.",
    "gsap-lenis": "GSAP ScrollTrigger hooks directly into the Lenis scroll timeline, synchronizing layout animations with smooth viewport scrolls.",
    "gsap-tsparticles": "GSAP animates particle overlay panels and can trigger canvas hover transition states on the tsParticles matrix.",
    "nextjs-vercel": "Next.js projects deploy natively to Vercel, which optimizes Server Components into serverless edge function execution endpoints.",
    "vercel-analytics": "Vercel automatically injects its Web Analytics telemetry scripts into the compiled production HTML header.",
    "nextjs-nodejs": "Next.js executes its dev server and local API compilers inside the Node.js process environment.",
    "supabase-postgresql": "Supabase manages the PostgreSQL server, handling security policies, database triggers, and indexes on Postgres tables.",
    "restapi-python": "REST API routes can invoke Python background scripts to execute batch tasks or query data science modules.",
    "git-vercel": "Git repository pushes automatically trigger Vercel's continuous integration and deployment (CD) builds to update the live site.",
    "docker-vercel": "Docker local containers mirror the Node.js runtime environment used by Vercel serverless containers for parity.",
    "figma-css": "Figma layout specs (margins, padding, colors) are translated into custom CSS theme variable tokens inside the stylesheet.",
    "vscode-typescript": "VS Code provides real-time TypeScript syntax highlights, autocomplete suggestions, and lint formatting inline.",
    "csharp-unity": "C# serves as the scripting language for Unity games, defining class bindings, gameplay mechanics, and state loops.",
    "python-pytorch": "Python invokes the PyTorch library to load neural network weights, construct tensor arrays, and execute model predictions.",
    "python-pandas": "Python uses Pandas to import raw datasets, clean formatting, and restructure arrays before feeding them to ML models.",
    "pandas-pytorch": "Pandas formats tables and inputs into clean arrays that are converted into PyTorch tensor tensors for model training."
};

const getPosition = (id: string) => {
    return nodePositions[id] || { x: 100, y: 100 };
};

// Calculate connector endpoints cleanly along card borders based on direction
const getConnectorPoints = (fromId: string, toId: string) => {
    const fromP = getPosition(fromId);
    const toP = getPosition(toId);

    let x1 = fromP.x + 55;
    let y1 = fromP.y + 21;
    let x2 = toP.x + 55;
    let y2 = toP.y + 21;

    if (Math.abs(fromP.y - toP.y) < 10) {
        if (fromP.x < toP.x) {
            x1 = fromP.x + 110;
            x2 = toP.x;
        } else {
            x1 = fromP.x;
            x2 = toP.x + 110;
        }
    } else {
        if (fromP.y < toP.y) {
            y1 = fromP.y + 42;
            y2 = toP.y;
        } else {
            y1 = fromP.y;
            y2 = toP.y + 42;
        }
    }

    return { x1, y1, x2, y2 };
};

const diagramGroups = [
    { label: "DevOps & Tools", x: 15, y: 20, width: 180, height: 660 },
    { label: "Languages", x: 215, y: 20, width: 730, height: 110 },
    { label: "Frameworks & Engines", x: 215, y: 150, width: 730, height: 190 },
    { label: "UI & Animation", x: 215, y: 360, width: 350, height: 320 },
    { label: "Data & Services", x: 585, y: 360, width: 360, height: 320 },
];

export function CategoryLegendIcon({
    category,
    color,
    active,
}: {
    category: string;
    color: string;
    active: boolean;
}) {
    const strokeColor = active ? color : "var(--muted)";
    const fillColor = active ? "var(--card-bg)" : "transparent";

    if (category === "Languages") {
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}>
                <rect x="1" y="1" width="12" height="12" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
                <rect x="3" y="3" width="8" height="8" rx="1" fill="none" stroke={strokeColor} strokeWidth="1" />
            </svg>
        );
    }
    if (category === "Backend" || category === "ML / Data") {
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}>
                <rect x="3" y="3" width="9" height="9" rx="2" fill={fillColor} stroke="var(--card-border)" strokeWidth="1" />
                <rect x="1" y="1" width="9" height="9" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
            </svg>
        );
    }
    if (category === "Infrastructure") {
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}>
                <rect x="1" y="1" width="12" height="12" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" strokeDasharray="2 1.5" />
            </svg>
        );
    }
    if (category === "Frameworks" || category === "Game Dev") {
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}>
                <rect x="1" y="1" width="12" height="12" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            </svg>
        );
    }
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}>
            <rect x="1" y="1" width="12" height="12" rx="2" fill={fillColor} stroke="var(--card-border)" strokeWidth="1" />
            <line x1="3" y1="2" x2="3" y2="12" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
    );
}

export default function TechStackDiagram({
    hoveredTech,
    setHoveredTech,
    activeCategories,
    selectedTech,
    onSelectTech,
}: {
    hoveredTech: string | null;
    setHoveredTech: (id: string | null) => void;
    activeCategories: Set<string>;
    selectedTech?: string | null;
    onSelectTech?: (id: string | null) => void;
}) {
    const inspectorTechId = selectedTech ?? hoveredTech;
    const inspectorNode = techStackNodes.find((n) => n.id === inspectorTechId);
    const details = inspectorNode ? nodeDetails[inspectorNode.id] : null;

    // Filter relation edges connected to the currently inspected node
    const relations = inspectorNode
        ? techStackEdges
              .filter((e) => e.from === inspectorNode.id || e.to === inspectorNode.id)
              .map((e) => {
                  const isFrom = e.from === inspectorNode.id;
                  const otherId = isFrom ? e.to : e.from;
                  const otherNode = techStackNodes.find((n) => n.id === otherId);
                  const reason =
                      edgeDetails[`${e.from}-${e.to}`] ||
                      edgeDetails[`${e.to}-${e.from}`] ||
                      "Architectural link";
                  return { node: otherNode, reason };
              })
              .filter((r) => r.node && activeCategories.has(r.node.category))
        : [];

    return (
        <div className="techstack-split-container" data-testid="techstack-diagram-container">
            {/* Left Column: Interactive Architecture SVG */}
            <div className="techstack-diagram-pane">
                <svg
                    viewBox="0 0 960 710"
                    className="techstack-graph"
                    data-testid="techstack-diagram-svg"
                    onMouseLeave={() => setHoveredTech(null)}
                    onClick={(e) => { if (e.target === e.currentTarget) onSelectTech?.(null); }}
                >
                    <defs>
                        <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                        </marker>
                    </defs>

                    {/* Diagram Groups */}
                    {diagramGroups.map((lane, i) => (
                        <g key={`lane-${i}`}>
                            <rect
                                x={lane.x}
                                y={lane.y}
                                width={lane.width}
                                height={lane.height}
                                rx={8}
                                fill="rgba(255, 255, 255, 0.01)"
                                stroke="var(--card-border)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={lane.x + 15}
                                y={lane.y + 24}
                                fill="var(--muted)"
                                fontSize="9"
                                fontWeight="700"
                                textAnchor="start"
                                style={{ userSelect: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}
                            >
                                {lane.label}
                            </text>
                        </g>
                    ))}

                    {/* Connection Edges */}
                    {techStackEdges.map((edge, i) => {
                        const fromNode = techStackNodes.find((n) => n.id === edge.from);
                        const toNode = techStackNodes.find((n) => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const fromVisible = activeCategories.has(fromNode.category);
                        const toVisible = activeCategories.has(toNode.category);
                        const edgeVisible = fromVisible && toVisible;

                        const isHighlighted =
                            edgeVisible &&
                            hoveredTech !== null &&
                            (edge.from === hoveredTech || edge.to === hoveredTech);
                        const isDimmed = !edgeVisible || (hoveredTech !== null && !isHighlighted);

                        const { x1, y1, x2, y2 } = getConnectorPoints(edge.from, edge.to);

                        return (
                            <line
                                key={`edge-${i}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={isHighlighted ? "var(--accent)" : "var(--card-border)"}
                                strokeWidth={isHighlighted ? "1.8" : "1"}
                                markerEnd="url(#arrow)"
                                opacity={isHighlighted ? 0.75 : isDimmed ? 0.03 : 0.12}
                                style={{ transition: "all 0.2s ease" }}
                            />
                        );
                    })}

                    {/* Node Cards */}
                    {techStackNodes.map((node) => {
                        const isCategoryActive = activeCategories.has(node.category);
                        const isHovered = hoveredTech === node.id;
                        const isConnected =
                            hoveredTech !== null &&
                            techStackEdges.some(
                                (e) =>
                                    (e.from === hoveredTech && e.to === node.id) ||
                                    (e.to === hoveredTech && e.from === node.id)
                            );
                        const isDimmed =
                            !isCategoryActive || (hoveredTech !== null && !isHovered && !isConnected);

                        const pos = getPosition(node.id);
                        const isDarkIcon = darkIconIds.has(node.id);
                        const iconSrc = techIconMap[node.id];

                        return (
                            <g
                                key={node.id}
                                className={`techstack-node ${isDimmed ? "techstack-node-dimmed" : ""}`}
                                onMouseEnter={() => setHoveredTech(node.id)}
                                onClick={(e) => { e.stopPropagation(); onSelectTech?.(node.id); }}
                                style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                            >
                                {isHovered && (
                                    <rect
                                        x={pos.x - 4}
                                        y={pos.y - 4}
                                        width={118}
                                        height={50}
                                        rx={10}
                                        fill="var(--accent)"
                                        opacity="0.15"
                                        style={{ filter: "blur(6px)" }}
                                    />
                                )}

                                {(node.category === "Backend" || node.category === "ML / Data") && (
                                    <rect
                                        x={pos.x + 3}
                                        y={pos.y + 3}
                                        width={110}
                                        height={42}
                                        rx={8}
                                        fill="none"
                                        stroke="var(--card-border)"
                                        strokeWidth="1.5"
                                        opacity="0.4"
                                    />
                                )}

                                <rect
                                    x={pos.x}
                                    y={pos.y}
                                    width={110}
                                    height={42}
                                    rx={8}
                                    fill="var(--card-bg)"
                                    stroke={isHovered ? "var(--accent)" : "var(--card-border)"}
                                    strokeWidth={isHovered ? 2.5 : 1.5}
                                    strokeDasharray={node.category === "Infrastructure" ? "4 2.5" : undefined}
                                    style={{ transition: "stroke 0.2s ease" }}
                                />

                                {node.category === "Languages" && (
                                    <rect
                                        x={pos.x + 3}
                                        y={pos.y + 3}
                                        width={104}
                                        height={36}
                                        rx={6}
                                        fill="none"
                                        stroke={node.color}
                                        strokeWidth="1"
                                        opacity={isHovered ? 0.8 : 0.35}
                                        style={{ transition: "opacity 0.2s ease" }}
                                    />
                                )}

                                {(node.category === "Frameworks" || node.category === "Game Dev") && (
                                    <rect
                                        x={pos.x}
                                        y={pos.y}
                                        width={110}
                                        height={42}
                                        rx={8}
                                        fill="none"
                                        stroke={node.color}
                                        strokeWidth={isHovered ? 2.5 : 1.5}
                                        opacity="0.6"
                                    />
                                )}

                                {node.category !== "Languages" &&
                                    node.category !== "Frameworks" &&
                                    node.category !== "Game Dev" && (
                                        <rect
                                            x={pos.x + 3.5}
                                            y={pos.y + 3.5}
                                            width="3"
                                            height="35"
                                            fill={node.color}
                                            rx="1.5"
                                        />
                                    )}

                                {iconSrc && (
                                    <>
                                        {isDarkIcon && (
                                            <circle cx={pos.x + 22} cy={pos.y + 21} r={11} fill="white" />
                                        )}
                                        <image
                                            href={iconSrc}
                                            x={pos.x + 12}
                                            y={pos.y + 11}
                                            width={20}
                                            height={20}
                                        />
                                    </>
                                )}

                                <text
                                    x={pos.x + (iconSrc ? 40 : 15)}
                                    y={pos.y + 25}
                                    fill="var(--foreground)"
                                    fontSize="10"
                                    fontWeight="600"
                                    textAnchor="start"
                                >
                                    {node.name}
                                </text>

                                {node.startYear != null && (
                                    <foreignObject
                                        x={pos.x}
                                        y={pos.y}
                                        width={110}
                                        height={42}
                                        style={{ overflow: "visible" }}
                                    >
                                        <Tooltip content={`${getYearsSince(node.startYear)} ${getYearsSince(node.startYear) === 1 ? "year" : "years"} of experience`}>
                                            <div style={{ width: "100%", height: "100%", borderRadius: "8px", cursor: "pointer" }} />
                                        </Tooltip>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Right Column: Architectural Inspector Pane */}
            <div className="techstack-inspector-pane">
                {inspectorNode && details ? (
                    <motion.div
                        className="techstack-inspector-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <div className="techstack-inspector-header">
                            <span
                                className="techstack-inspector-dot"
                                style={{ backgroundColor: inspectorNode.color, color: inspectorNode.color }}
                            />
                            <div>
                                <h4 className="techstack-inspector-title">{inspectorNode.name}</h4>
                                <span className="techstack-inspector-subtitle">{inspectorNode.category}</span>
                            </div>
                        </div>

                        <div className="techstack-inspector-exp">
                            {getYearsSince(inspectorNode.startYear)} {getYearsSince(inspectorNode.startYear) === 1 ? "Year" : "Years"} of Experience
                        </div>

                        <div className="techstack-inspector-desc">
                            <MarkdownRenderer content={details.description} />
                        </div>

                        <div className="techstack-inspector-section">
                            <h5 className="techstack-inspector-section-title">Core Focus & Roles</h5>
                            <div className="techstack-inspector-tags">
                                {details.roles.map((role: string, idx: number) => (
                                    <span key={idx} className="techstack-inspector-tag">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {relations.length > 0 && (
                            <div className="techstack-inspector-section">
                                <h5 className="techstack-inspector-section-title">Architectural Connections</h5>
                                <div className="techstack-inspector-relations">
                                    {relations.map((rel, idx: number) => (
                                        <div key={idx} className="techstack-inspector-relation-item">
                                            <div className="techstack-inspector-relation-header">
                                                <span
                                                    className="techstack-inspector-relation-dot"
                                                    style={{ backgroundColor: rel.node?.color }}
                                                />
                                                <span className="techstack-inspector-relation-name">
                                                    {rel.node?.name}
                                                </span>
                                                <span className="techstack-inspector-relation-cat">
                                                    ({rel.node?.category})
                                                </span>
                                            </div>
                                            <div className="techstack-inspector-relation-reason">
                                                <MarkdownRenderer content={rel.reason} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="techstack-inspector-placeholder">
                        <div className="techstack-placeholder-icon">🔍</div>
                        <h4>Architectural Inspector</h4>
                        <p>
                            Hover or click any technology in the diagram to inspect its role, proficiency, and detailed system
                            relationships.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
