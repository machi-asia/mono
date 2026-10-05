import type { WikiArticle, WikiCategory } from "./wiki-types";

const WIKI_REPORTING_STANDARD: WikiArticle = {
  slug: "standard-wiki-reporting",
  title: "Standard: Mandatory Wiki Reporting",
  description: "Every significant change must be documented in the /docs wiki before it ships.",
  category: "Standards & Guidelines",
  updatedAt: "2026-10-03",
  author: "Machi Asia Architecture Guild",
  readTime: "2 min read",
  tags: ["standards", "documentation", "wiki", "governance"],
  content: `# Standard: Mandatory Wiki Reporting

## Policy

Every significant change MUST be reported in the Documentation Wiki. Significant changes include new architectural patterns, altered public package interfaces, new deployable applications, ADR additions, and organization policy updates.

> [!IMPORTANT] No Undocumented Changes
> Shipping structural changes, public APIs, new package components, or service behaviors without a wiki entry is prohibited.

## Requirements

1. Add or update the article in \`apps/docs/src/data/wiki-articles.ts\` with accurate title, category, tags, read time, author, and updated date.
2. Keep matching markdown under \`docs/\` (\`ARCHITECTURE.md\`, \`API.md\`, \`adr/\`) in sync.
3. Give every code block a valid language identifier so it is color coded.

\`\`\`ts
export const article = {
  slug: "my-change",
  category: "Architecture & Core",
  updatedAt: "2026-10-03",
};
\`\`\``,
};

export const WIKI_CATEGORIES: WikiCategory[] = [
  "Architecture & Core",
  "Architecture Decisions (ADR)",
  "Packages & Libraries",
  "Standards & Guidelines",
  "Applications & Services",
];

export const CATEGORY_DESCRIPTIONS: Record<WikiCategory, string> = {
  "Architecture & Core": "High-level monorepo topologies, workspace boundaries, API routing, and build systems",
  "Architecture Decisions (ADR)": "Historical record of architectural choices, constraints, alternatives, and trade-offs",
  "Packages & Libraries": "In-depth developer guides for shared packages across authentication, UI, database, and AI",
  "Standards & Guidelines": "Mandatory organization policies for icons, skeleton loading, privacy disclosures, and code style",
  "Applications & Services": "Operational manuals, runtime workflows, and service architectures for deployable apps",
};

export const wikiArticles: WikiArticle[] = [
  WIKI_REPORTING_STANDARD,
  {
    slug: "api-endpoints",
    title: "API Endpoint Reference",
    description: "Every HTTP endpoint in the monorepo: Rose chat, settings, transcription, usage, and Sync events and rooms, with request and response shapes.",
    category: "Architecture & Core",
    updatedAt: "2026-10-03",
    author: "Machi Asia Engineering",
    readTime: "5 min read",
    tags: ["api", "endpoints", "rose", "sync", "sse"],
    content: `# API Endpoint Reference

## Overview

All routes are Next.js App Router handlers that delegate to \`@mono/rose/server\` or \`@mono/sync/server\`. Full reference lives in \`docs/API-ENDPOINTS.md\`.

| Method | Path | App | Purpose |
|---|---|---|---|
| POST | \`/api/rose/chat\` | rose, docs | Chat with the agent (SSE or JSON) |
| GET | \`/api/rose/settings\` | rose, docs | Read memories and personalization |
| POST | \`/api/rose/settings\` | rose, docs | Save personalization, add/update/delete memory |
| POST | \`/api/rose/transcribe\` | rose, docs | Speech-to-text |
| GET | \`/api/rose/usage\` | rose, docs | Quota metrics |
| GET | \`/api/sync/events\` | hells-forge | SSE stream for a room |
| POST | \`/api/sync/events\` | hells-forge | Publish single or batch events |
| GET | \`/api/sync/rooms\` | hells-forge | List room members |

## Rose Errors

\`\`\`json
{ "error": { "code": "bad_request", "message": "A 'message' string is required." } }
\`\`\`

## Chat

### Request

\`\`\`json
{
  "message": "Hello Rose",
  "history": [],
  "conversationId": "abc123",
  "stream": true
}
\`\`\`

Responses: \`200\` (SSE or JSON), \`400 bad_request\`, \`429 usage_limit_exceeded\`, \`500\`.

## Settings

\`POST /api/rose/settings\` selects an operation with \`action\`: \`save_personalization\`, \`add_memory\`, \`update_memory\`, or \`delete_memory\`.

\`\`\`json
{ "action": "add_memory", "index": "hobbies", "content": "Likes chess", "importance": "high" }
\`\`\`

## Transcribe

Accepts multipart \`audio\` (plus optional \`language\`) or base64 JSON. Returns \`{ "ok": true, "transcript": "...", "provider": "faster-whisper" }\`.

> [!NOTE] Client Fallback
> If the native binary is unavailable, a 200 error body is returned so the client falls back to the Web Speech API.

## Sync Events

\`GET /api/sync/events?roomId=...&userId=...&userName=...\` opens an SSE stream emitting \`room-members\` and \`sync-event\`, with a keepalive every 15 seconds.

\`\`\`bash
curl -N "http://localhost:3000/api/sync/events?roomId=lobby&userId=u1"
\`\`\`

\`POST /api/sync/events\` publishes events; \`player_input\` triggers go through the authoritative simulation.

\`\`\`json
{ "roomId": "lobby", "userId": "u1", "trigger": "player_input", "payload": { "x": 10, "y": 20, "angle": 1.5 } }
\`\`\`

## Sync Rooms

\`GET /api/sync/rooms?roomId=lobby\` returns \`{ "roomId": "lobby", "members": [] }\`.`,
  },
  // ── Architecture & Core ──
  {
    slug: "architecture",
    title: "System Architecture & Monorepo Layout",
    description: "Comprehensive blueprint of the Machi Asia monorepo layout, workspace boundaries, application runtimes, and package dependencies.",
    category: "Architecture & Core",
    updatedAt: "2026-10-03",
    author: "Machi Asia Engineering",
    readTime: "6 min read",
    tags: ["architecture", "monorepo", "turborepo", "workspaces", "nextjs"],
    content: `# System Architecture & Monorepo Layout

## Overview

The Machi Asia platform is structured as an enterprise-grade Turborepo monorepo using npm workspaces. Every application and shared library is maintained in a centralized repository to guarantee type safety, atomic commits, unified design tokens, and rapid cross-package development.

> [!NOTE] Workspace Organization
> Applications live in \`apps/\`, shared modules live in \`packages/\`, and root-level documentation resides in \`docs/\`.

\`\`\`
mono/
├── apps/
│   ├── calculator/     # Multi-game production & recipe calculator
│   ├── docs/           # Documentation portal & live component showcases
│   ├── hells-forge/    # Production web game application
│   ├── machi-asia/     # Showcase hub & subscription billing portal
│   ├── portfolio/      # Interactive developer portfolio & resume
│   └── rose/           # Standalone conversational AI agent app
├── packages/
│   ├── auth/           # Multi-account auth, Supabase SSR & RLS utilities
│   ├── components/     # Shared design system, UI components & Markdown
│   ├── database/       # Supabase database clients, schemas & stores
│   ├── rose/           # AI companion engine, memory indexer & voice mode
│   └── sync/           # Realtime broadcast & cross-tab state synchronization
└── docs/               # Architecture specs, ADRs, and API guidelines
\`\`\`

## Workspace Boundaries

### Deployable Applications (\`apps/\`)
- **\`machi-asia\`**: The flagship showcase portal and billing hub. Users authenticate here and manage product subscriptions.
- **\`docs\`**: The developer documentation portal, interactive component showcase playground, and knowledge wiki.
- **\`rose\`**: Dedicated companion application powered by Gemini and Groq AI models.
- **\`calculator\`**: Factory automation and crafting recipe calculator supporting Satisfactory, Factorio, Minecraft, and Dyson Sphere Program.
- **\`portfolio\`**: High-performance personal portfolio showcasing works and technical achievements.
- **\`hells-forge\`**: Interactive real-time browser game.

### Shared Packages (\`packages/\`)
1. **\`@mono/auth\`**: The single source of truth for identity, authentication state, multi-account switching, and guest sign-in.
2. **\`@mono/components\`**: The canonical design system, exporting buttons, dropdowns, pickers, skeletons, cards, and Obsidian Markdown renderers.
3. **\`@mono/database\`**: Strict server-side database access layer interfacing Supabase Postgres with full RLS policy enforcement.
4. **\`@mono/rose\`**: AI companion library with multimodal support, emotion analysis, vector memory, and Web Speech voice mode.
5. **\`@mono/sync\`**: Cross-tab messaging and Supabase Realtime channel synchronization.

## Data Flow & Invariants

All apps in the monorepo follow strict architectural rules:

1. **Authentication Gate**: Every application layout must wrap its children with \`AuthProvider\` and \`AuthGate\` from \`@mono/auth\`. Unauthenticated visitors are presented with the \`SignInModal\` allowing Google, email, or instant Guest access.
2. **Server-Side Data Operations**: Client components never directly execute raw database queries. All persistent data queries flow through Server Actions, Route Handlers, or \`@mono/database/server\`.
3. **Canonical Icon System**: All user interfaces must standardize on \`lucide-react\`. Third-party icon sets are strictly prohibited.
4. **Mandatory Skeleton States**: Every asynchronous data fetch must render a skeleton component from \`@mono/components\` before data resolution.`,
  },
  {
    slug: "api-specs",
    title: "API Standards & Response Format",
    description: "Guidelines and conventions for App Router API routes, JSON response structures, error handling, and authentication validation.",
    category: "Architecture & Core",
    updatedAt: "2026-10-03",
    author: "Machi Asia Engineering",
    readTime: "4 min read",
    tags: ["api", "http", "json", "rest", "routing"],
    content: `# API Standards & Response Format

## Overview

All backend endpoints in the Machi Asia ecosystem follow the Next.js App Router route handler convention. Endpoints reside within \`app/api/<resource>/route.ts\` files and communicate exclusively via JSON.

## Standard Response Format

Every API endpoint returns a standardized payload shape with predictable top-level keys:

### Success Response
\`\`\`json
{
  "data": {
    "id": "item_12345",
    "name": "Recipe Matrix",
    "status": "ready"
  },
  "error": null
}
\`\`\`

### Error Response
\`\`\`json
{
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token expired or missing."
  }
}
\`\`\`

## Endpoint Design Principles

- **Route Placement**: API routes must live inside the application package that owns the domain logic.
- **Auth Verification**: Endpoints requiring protected access must verify the session using \`createClient()\` from \`@mono/auth/server\` or \`getUser()\`.
- **Validation**: Request bodies and query parameters must be strictly validated before executing downstream operations.
- **Status Codes**: Use standard HTTP response codes (\`200 OK\`, \`201 Created\`, \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`500 Internal Server Error\`).`,
  },

  // ── Packages & Libraries ──
  {
    slug: "package-auth",
    title: "@mono/auth: Centralized Authentication",
    description: "Architecture, session management, multi-account switching, RLS helpers, and the Data & Privacy Collection Registry.",
    category: "Packages & Libraries",
    updatedAt: "2026-10-03",
    author: "Machi Asia Security Team",
    readTime: "5 min read",
    tags: ["auth", "supabase", "sessions", "privacy", "security"],
    content: `# @mono/auth: Centralized Authentication

## Overview

The \`@mono/auth\` package provides unified authentication, authorization, and privacy controls across all applications in the organization. No application is permitted to build custom auth forms or direct token handlers.

## Core Exports

### React Components & Context
- \`<AuthProvider>\`: Context provider maintaining active user state, session cookies, guest flag, and linked multi-accounts.
- \`<AuthGate>\`: Boundary component that intercepts unauthenticated rendering and displays \`<SignInModal />\`.
- \`<SignInModal>\`: Modal supporting Google OAuth, email/password signup/login, and one-click anonymous guest sessions.
- \`<AccountSettings>\`: Modal with tabs for Security, Connected Accounts, and the mandatory **Data & Privacy Registry**.

### Hooks & Functions
\`\`\`tsx
import { useAuth } from "@mono/auth";

export function UserHeader() {
  const { user, isGuest, accounts, switchAccount, signOut } = useAuth();
  
  return (
    <div className="user-profile">
      <span>{user?.email ?? "Guest User"}</span>
      {accounts.map((acc) => (
        <button key={acc.id} onClick={() => switchAccount(acc.id)}>
          Switch to {acc.name}
        </button>
      ))}
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
}
\`\`\`

## Data & Privacy Registry

In accordance with organization privacy compliance rules, any app collecting telemetry or user data must register its disclosures with \`@mono/auth\` so users can inspect and toggle non-essential telemetry from Account Settings.`,
  },
  {
    slug: "package-components",
    title: "@mono/components: Shared Design System",
    description: "Design system primitives, color tokens, layout containers, accessible controls, skeleton states, and Obsidian Markdown renderer.",
    category: "Packages & Libraries",
    updatedAt: "2026-10-03",
    author: "Machi Asia UI/UX Team",
    readTime: "6 min read",
    tags: ["design-system", "ui", "components", "markdown", "skeleton"],
    content: `# @mono/components: Shared Design System

## Overview

\`@mono/components\` is the canonical design system and UI component package for Machi Asia. It enforces consistent spacing, typography, theme tokens (slate-dark with gold accents), accessible keyboard navigation, and responsive layouts.

## Exported Primitives

| Component | Description |
|---|---|
| \`Button\` | Primary, secondary, outline, ghost, and danger variants with loading states |
| \`Card\` | Surface card container with bordered, elevated, and interactive hover variants |
| \`Navbar\` | Global responsive navigation bar with multi-account dropdown and brand slot |
| \`Footer\` | Standardized footer with copyright notice and navigation links |
| \`MarkdownRenderer\` | Obsidian-flavored Markdown engine supporting callouts, code blocks, tables, and wikilinks |
| \`Skeleton\` | Skeleton loading primitives (\`SkeletonText\`, \`SkeletonCircle\`, \`SkeletonButton\`, \`SkeletonCard\`) |
| \`MediaLibrary\` | Asset manager with upload, grid view, filter tabs, and metadata inspection |
| \`ComponentShowcase\` | Interactive component catalog harness with live prop controls |

## Obsidian Markdown Engine

\`MarkdownRenderer\` parses rich Markdown syntax including:
- **Obsidian Callouts**: \`> [!NOTE]\`, \`> [!TIP]\`, \`> [!WARNING]\`, \`> [!CAUTION]\`, \`> [!IMPORTANT]\`
- **Interactive Checklists**: \`- [x] Done\` and \`- [ ] Pending\` with \`onTaskToggle\` callback
- **GFM Tables**: Clean responsive data tables
- **Code Highlighting**: Syntax-highlighted code blocks with copy-to-clipboard button
- **Internal Wikilinks**: \`[[Page Name]]\` with \`onWikilinkClick\` event handling`,
  },
  {
    slug: "package-database",
    title: "@mono/database: Supabase Data Store",
    description: "Server-side Supabase clients, schema definitions, typed query builders, and database migrations.",
    category: "Packages & Libraries",
    updatedAt: "2026-10-03",
    author: "Machi Asia Backend Team",
    readTime: "4 min read",
    tags: ["database", "supabase", "postgres", "sql", "migrations"],
    content: `# @mono/database: Supabase Data Store

## Overview

\`@mono/database\` encapsulates all PostgreSQL schema definitions, migration scripts, Supabase client constructors, and store abstractions.

## Architecture Guidelines

> [!IMPORTANT] Server-Side Only
> To guarantee database integrity and prevent leak of privileged keys, database clients must be executed exclusively in server environments (Server Components, Route Handlers, or Server Actions).

\`\`\`ts
import { createServerClient } from "@mono/database/server";

export async function getUserProfile(userId: string) {
  const db = await createServerClient();
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
\`\`\`

## Row Level Security (RLS)
All tables in the Postgres database must have Row Level Security enabled. Every table enforces ownership policies ensuring users can only read and mutate records matching their authenticated \`auth.uid()\`.`,
  },
  {
    slug: "package-rose",
    title: "@mono/rose: AI Agent & Companion Library",
    description: "Multimodal conversational agent engine, vector memory retrieval, emotion tagging, Groq tool processing, and voice transcription.",
    category: "Packages & Libraries",
    updatedAt: "2026-10-03",
    author: "Machi Asia AI Lab",
    readTime: "7 min read",
    tags: ["ai", "rose", "gemini", "groq", "voice", "agents"],
    content: `# @mono/rose: AI Agent & Companion Library

## Overview

\`@mono/rose\` is an advanced conversational AI library designed for companion workflows, long-term memory retrieval, emotion tracking, and real-time voice interactions.

## Architecture

1. **Primary LLM Orchestrator**: Google Gemini serves as the core reasoning engine.
2. **Tool Processing & Synthesis**: Groq provides ultra-low-latency structured tool output processing and emotion synthesis into Obsidian-formatted responses.
3. **Long-Term Memory**: Vector-indexed memory layer that records past user conversations, user preferences, and relationship context.
4. **Voice Mode**: Real-time voice interaction engine using Web Speech API synthesis alongside Whisper transcription.

## UI Components
- \`<RoseChatModal>\`: Full-featured overlay modal supporting chat history, streaming responses, and speech toggling.
- \`<RoseChatModalFloatingButton>\`: Ambient floating action button that opens Rose from any page corner.
- \`<UsageBar>\`: Tiered quota progress indicator displaying remaining message allowance.`,
  },
  {
    slug: "package-sync",
    title: "@mono/sync: Realtime State Coordination",
    description: "Cross-tab messaging, Supabase Realtime broadcast channels, and collaborative event synchronizers.",
    category: "Packages & Libraries",
    updatedAt: "2026-10-03",
    author: "Machi Asia Engineering",
    readTime: "3 min read",
    tags: ["sync", "realtime", "broadcast", "cross-tab"],
    content: `# @mono/sync: Realtime State Coordination

## Overview

\`@mono/sync\` provides lightweight synchronization mechanisms across browser tabs and distributed client sessions using BroadcastChannel and Supabase Realtime WebSocket streams.

## Features
- **Cross-Tab Synchronization**: Automatic state synchronization across multiple open tabs (e.g. auth login/logout, media uploads, active theme changes).
- **Realtime Channels**: Type-safe pub/sub wrapper around Supabase Realtime broadcasts.
- **Heartbeat & Presence**: Lightweight presence indicator hooks.`,
  },

  // ── Applications ──
  {
    slug: "app-calculator",
    title: "Multi-Game Production Calculator",
    description: "Architecture and feature set of the production and crafting recipe calculator supporting Satisfactory, Factorio, Minecraft, and Dyson Sphere Program.",
    category: "Applications & Services",
    updatedAt: "2026-10-03",
    author: "Machi Asia Gaming Tools",
    readTime: "5 min read",
    tags: ["calculator", "gaming", "recipes", "crafting", "factory"],
    content: `# Multi-Game Production Calculator

## Overview

The \`calculator\` application (\`apps/calculator\`) is a specialized web tool built for factory-building and survival crafting simulation games. It allows players to calculate resource chains, recipe ratios, building counts, power requirements, and production bottlenecks.

## Supported Games
- **Satisfactory**: Full alternate recipe matrices, overclocking math, machine power graphs, and fluid packing.
- **Factorio**: Assembler tiers, speed/productivity modules, beacon configurations, and raw ore throughput.
- **Minecraft**: Crafting grid decompositions, smelt times, and netherite processing requirements.
- **Dyson Sphere Program**: Matrix lab research speeds, planetary logistics demand, and solar sail production.

## Technology Stack
- Next.js App Router
- \`@mono/components\` design system and layout cards
- Client-side reactive recipe solver and item search index`,
  },

  // ── Standards & Guidelines ──
  {
    slug: "standard-lucide-icons",
    title: "Standard: Unified Icon Library (lucide-react)",
    description: "Organization-wide mandate requiring lucide-react as the sole icon package across all applications and packages.",
    category: "Standards & Guidelines",
    updatedAt: "2026-10-03",
    author: "Machi Asia Architecture Guild",
    readTime: "2 min read",
    tags: ["standards", "icons", "lucide-react", "ui"],
    content: `# Standard: Unified Icon Library (lucide-react)

## Policy

All applications under \`apps/\` and packages under \`packages/\` **MUST** standardize on \`lucide-react\` as the single canonical icon library across the organization.

> [!CAUTION] Competing Icon Libraries Prohibited
> Do NOT install or introduce competing icon packages (e.g., \`react-icons\`, \`@tabler/icons-react\`, \`@heroicons/react\`, \`font-awesome\`, etc.).

## Rationale
- Prevents bundle bloat caused by redundant SVG wrapper libraries.
- Ensures identical visual language, stroke weights, and bounding boxes.
- Eliminates naming conflicts and import fragmentation across workspaces.`,
  },
  {
    slug: "standard-skeleton-loading",
    title: "Standard: Mandatory Skeleton Loading",
    description: "Guidelines and requirements for skeleton placeholders during asynchronous fetches and database loading states.",
    category: "Standards & Guidelines",
    updatedAt: "2026-10-03",
    author: "Machi Asia Architecture Guild",
    readTime: "3 min read",
    tags: ["standards", "skeleton", "ux", "accessibility"],
    content: `# Standard: Mandatory Skeleton Loading

## Policy

All components and pages that load data asynchronously from an API fetch or database query **MUST** render a skeleton component from \`@mono/components\` before the request completes.

> [!IMPORTANT] No Blank Screens or Bare Spinners
> Never leave an unstyled spinner, plain text "Loading...", or blank empty container while waiting for asynchronous operations.

## Available Skeleton Components
- \`<Skeleton>\`: Generic rectangular placeholder with configurable width, height, and border radius.
- \`<SkeletonText>\`: Multi-line text block mimicking paragraph line heights.
- \`<SkeletonCircle>\`: Circular avatar and icon placeholder.
- \`<SkeletonButton>\`: Button-shaped placeholder matching standard button dimensions.
- \`<SkeletonCard>\`: Full card container placeholder with header, body, and action areas.`,
  },
  {
    slug: "standard-privacy-registry",
    title: "Standard: Data & Privacy Collection Registry",
    description: "Enforcement guidelines for user data collection disclosures, purpose statements, and user opt-in/opt-out controls.",
    category: "Standards & Guidelines",
    updatedAt: "2026-10-03",
    author: "Machi Asia Privacy Guild",
    readTime: "4 min read",
    tags: ["standards", "privacy", "compliance", "gdpr", "telemetry"],
    content: `# Standard: Data & Privacy Collection Registry

## Policy

Every application or package that collects, processes, transmits, or stores user data must declare that collection in the centralized **Data & Privacy Registry** located in \`@mono/auth\` Account Settings.

## Mandatory Disclosure Criteria
1. **Specific Data Collected**: Clearly name the fields (e.g., email address, chat history, recipe presets).
2. **Purpose**: State the exact operational or diagnostic purpose.
3. **Requirement Level**: Explicitly mark as **Required** (core operation) or **Optional** (enhancements/analytics).
4. **Interactive User Control**: Any optional collection must provide an accessible opt-out toggle with persistent state.`,
  },

  // ── ADRs ──
  {
    slug: "adr-001-nextjs-framework",
    title: "ADR-001: Next.js as the Universal Framework",
    description: "Decision to standardize all deployable web applications and shared packages on Next.js and the React ecosystem.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-01",
    author: "Machi Asia Architecture Team",
    readTime: "2 min read",
    tags: ["adr", "nextjs", "react", "framework"],
    content: `# ADR-001: Next.js as the Universal Framework

## Status
**Accepted** (2026-09-01)

## Context
All applications and packages in the Machi Asia monorepo require a uniform web framework offering server-side rendering, static generation, API routes, and first-class React ecosystem support.

## Decision
All web applications (\`machi-asia\`, \`rose\`, \`docs\`, \`calculator\`, \`portfolio\`) and shared React packages will be built with **Next.js**.

## Consequences
- Single development model and mental map across all teams.
- Turborepo pipelines are uniformly tuned for Next.js caching and builds.
- Alternative web frameworks cannot be introduced without formal ADR amendment.`,
  },
  {
    slug: "adr-002-monorepo-structure",
    title: "ADR-002: Monorepo Architecture with Turborepo",
    description: "Architectural rationale for unifying all organization codebases into a single Turborepo with npm workspaces.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-01",
    author: "Machi Asia Architecture Team",
    readTime: "3 min read",
    tags: ["adr", "monorepo", "turborepo", "workspaces"],
    content: `# ADR-002: Monorepo Architecture with Turborepo

## Status
**Accepted** (2026-09-01)

## Context
Managing separate repositories for authentication, components, database models, and web applications led to version mismatch, delayed feature propagation, and duplicated tooling.

## Decision
Consolidate all repositories into a unified Turborepo monorepo with \`apps/\` and \`packages/\` workspaces.

## Consequences
- Instant propagation of shared package changes across all consumer apps.
- Single source of truth for dependencies, TypeScript config, and linting rules.
- Turborepo remote caching accelerates continuous integration builds.`,
  },
  {
    slug: "adr-003-centralized-auth-and-database",
    title: "ADR-003: Centralized Auth and Database Layer",
    description: "Decoupling authentication state and database clients into dedicated packages with strict boundary rules.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-02",
    author: "Machi Asia Architecture Team",
    readTime: "3 min read",
    tags: ["adr", "auth", "database", "supabase"],
    content: `# ADR-003: Centralized Auth and Database Layer

## Status
**Accepted** (2026-09-02)

## Context
Applications previously handled independent Supabase clients, causing fragmented session handling, divergent authentication modals, and potential security leaks.

## Decision
Create \`@mono/auth\` and \`@mono/database\` as the centralized packages. All apps must route authentication through \`@mono/auth\` and server queries through \`@mono/database\`.

## Consequences
- Uniform login experience and multi-account switching across all sites.
- Complete enforcement of Row Level Security (RLS) policies.`,
  },
  {
    slug: "adr-004-component-showcase-pages",
    title: "ADR-004: Interactive Component Showcase Pages",
    description: "Mandating live interactive showcase pages for all exported UI components in the documentation app.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-02",
    author: "Machi Asia Architecture Team",
    readTime: "3 min read",
    tags: ["adr", "components", "showcase", "docs"],
    content: `# ADR-004: Interactive Component Showcase Pages

## Status
**Accepted** (2026-09-02)

## Context
Developers needed a real-time environment to test components across different themes, prop configurations, and mock states without deploying individual applications.

## Decision
Every package exporting UI components must provide a live showcase page in \`apps/docs/src/app/components/<package>/page.tsx\` powered by \`<ComponentShowcase />\`.

## Consequences
- Every component is tested interactively against all enum prop variations.
- Live documentation remains in sync with the codebase.`,
  },
  {
    slug: "adr-005-design-system-theming",
    title: "ADR-005: Design System and Theming Tokens",
    description: "Standardizing on slate-dark surfaces with warm gold accents and CSS custom property token cascades.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-03",
    author: "Machi Asia Architecture Team",
    readTime: "3 min read",
    tags: ["adr", "design-system", "tokens", "theming"],
    content: `# ADR-005: Design System and Theming Tokens

## Status
**Accepted** (2026-09-03)

## Context
Inconsistent hex colors, arbitrary border radii, and fragmented CSS variables caused visual disharmony between apps.

## Decision
Declare canonical design tokens in \`@mono/components\` using standard CSS variables (\`--color-surface\`, \`--color-background\`, \`--color-primary\`, \`--color-border\`) and wrap all layouts in \`<ThemeProvider />\`.

## Consequences
- Seamless aesthetic cohesion across all apps.
- Easy global theme customizations without refactoring component internals.`,
  },
  {
    slug: "adr-007-obsidian-markdown-renderer",
    title: "ADR-007: Obsidian-Flavored Markdown Renderer",
    description: "Custom lightweight Markdown rendering engine supporting Obsidian callouts, code syntax highlighting, and checklists.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-03",
    author: "Machi Asia Architecture Team",
    readTime: "3 min read",
    tags: ["adr", "markdown", "obsidian", "callout"],
    content: `# ADR-007: Obsidian-Flavored Markdown Renderer

## Status
**Accepted** (2026-09-03)

## Context
AI assistant responses, documentation wikis, and notes required rich Markdown formatting with callout boxes and interactive checkboxes without heavy external dependencies.

## Decision
Implement a custom, highly performant \`<MarkdownRenderer />\` in \`@mono/components\` supporting Obsidian callout styles, fenced code blocks, GFM tables, and wikilinks.

## Consequences
- Zero heavy third-party parsing dependencies.
- Native styling that effortlessly matches design tokens.`,
  },
  {
    slug: "adr-008-rose-agent-package",
    title: "ADR-008: Rose AI Agent Package Architecture",
    description: "Separation of AI orchestration, tool execution, emotion analysis, and chat UI into @mono/rose.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-09-03",
    author: "Machi Asia AI Team",
    readTime: "4 min read",
    tags: ["adr", "ai", "rose", "gemini", "groq"],
    content: `# ADR-008: Rose AI Agent Package Architecture

## Status
**Accepted** (2026-09-03)

## Context
The Rose companion agent needed to be embedded in multiple applications (home portal, companion app, docs) while maintaining persistent state and modular tooling.

## Decision
Package Rose into \`@mono/rose\`, combining Gemini for core reasoning, Groq for ultra-fast tool formatting, and shared chat modal components.

## Consequences
- Any app in the monorepo can embed Rose with a single component import.
- Centralized quota management and usage tracking.`,
  },
  {
    slug: "adr-015-skeleton-loading-state-enforcement",
    title: "ADR-015: Skeleton Loading State Enforcement",
    description: "Mandatory implementation of skeleton placeholder components for all asynchronous operations.",
    category: "Architecture Decisions (ADR)",
    updatedAt: "2026-10-03",
    author: "Machi Asia Architecture Team",
    readTime: "3 min read",
    tags: ["adr", "skeleton", "ux", "loading"],
    content: `# ADR-015: Skeleton Loading State Enforcement

## Status
**Accepted** (2026-10-03)

## Context
Asynchronous content loading previously resulted in jarring layout shifts, spinner fatigue, or unstyled flash of empty containers.

## Decision
Mandate the use of \`<Skeleton>\` components from \`@mono/components\` across all applications. Layout containers must render skeleton geometry matching the resolved content dimensions.

## Consequences
- Perceived loading latency is significantly reduced.
- Eliminates Cumulative Layout Shift (CLS) across the platform.`,
  },
];

// Helper functions
export function getAllArticles(): WikiArticle[] {
  return wikiArticles;
}

export function getArticleBySlug(slug: string): WikiArticle | undefined {
  return wikiArticles.find((article) => article.slug === slug);
}

export function searchArticles(query: string): WikiArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return wikiArticles;

  return wikiArticles.filter((article) => {
    return (
      article.title.toLowerCase().includes(q) ||
      article.description.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      article.content.toLowerCase().includes(q)
    );
  });
}

export function getArticlesByCategory(category: WikiCategory): WikiArticle[] {
  return wikiArticles.filter((article) => article.category === category);
}

export function getCategories(): WikiCategory[] {
  return WIKI_CATEGORIES;
}

export function getRecentArticles(limit = 6): WikiArticle[] {
  return [...wikiArticles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
