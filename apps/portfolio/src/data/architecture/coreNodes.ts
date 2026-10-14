import type { ArchitectureNode } from "../types";

export const coreNodes: ArchitectureNode[] = [
  {
    id: "Portfolio Architecture",
    title: "Portfolio Architecture",
    type: "index",
    tags: ["architecture", "index", "portfolio"],
    links: [
      "Tech Stack & Directories",
      "Design System & Visuals",
      "AI Chatbot Engine",
      "WebP Image Pipeline",
      "Subdomain Routing",
      "Testing & CI Pipeline",
      "Visitors & Reviews",
      "QuickNote Site",
      "Commissions Subsite",
      "MMM Subsite",
      "Rose Agent Data",
      "Grafana & Supabase Observability",
      "Guest Authentication & Prompt",
      "Data Privacy & Governance",
      "Commit History"
    ],
    content: `Welcome to the knowledge base for the Angelo Justine Kamachi Portfolio website. This graph maps out the key components, design patterns, and features of the system.

> [!NOTE]
> The portfolio system is built around strict data-agent-wiki parity and dynamic execution pipelines. All static content originates in \`/data\` and is exposed to the AI agent runtime and Machi Analytics graph.

### Architectural Core Overview

| Module | Primary Responsibility | Storage / State |
|---|---|---|
| **App Shell & Routing** | Next.js 16 App Router with dynamic subdomains | Edge Middleware / Client Layouts |
| **Agentic AI Engine** | ReAct orchestrator with SSE real-time tool tracking | Google Gemini 2.5 / Supabase Sessions |
| **Data & Storage** | Parity data directory & remote sync pipelines | Local \`/data\` / Supabase Storage Bucket |
| **Verification & QA** | 5-Tool verification pipeline + Playwright E2E test suites | Vitest JSDom / Playwright Chromium / GitHub Actions CI/CD |

Use the Graph View in Machi Analytics to visualize how these architectural nodes connect to one another.`
  },
  {
    id: "Tech Stack & Directories",
    title: "Tech Stack & Directories",
    type: "core",
    tags: ["tech-stack", "project-structure"],
    links: ["Portfolio Architecture"],
    content: `This node documents the core framework, libraries, and directory layout of the portfolio codebase.

> [!NOTE]
> The project leverages Next.js 16 (using App Router) and Turbopack for lightning-fast compilation and static exports.

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | High-performance React framework supporting server/client layouts |
| **Styling** | Tailwind CSS v4 & Vanilla CSS | BEM-structured CSS custom properties for custom mode styling |
| **UI Kit** | Radix UI Themes | Fully accessible, responsive components |
| **Animations** | Framer Motion | Declarative micro-interactions and transitions |
| **Testing** | Vitest & Playwright | Fast unit tests on JSDom + complete Playwright E2E browser suites |

> [!TIP]
> All reusable global UI components accept a \`variant\` prop self-registering in \`componentVariants\` for automatic discovery.`
  },
  {
    id: "Design System & Visuals",
    title: "Design System & Visuals",
    type: "frontend",
    tags: ["design", "styling", "customizer", "visuals"],
    links: ["Portfolio Architecture"],
    content: `This node documents the premium design system, custom typography, micro-interactions, and visual features.

> [!IMPORTANT]
> Raw colors are prohibited. Always reference variable tokens like \`var(--background)\`, \`var(--foreground)\`, \`var(--accent)\`, or \`var(--card-bg)\`.

### Theme Customizer Tokens

| Token Variable | Light Mode | Dark Mode | Purpose |
|---|---|---|---|
| \`var(--background)\` | \`#F8FAFC\` | \`#0F172A\` | Canvas background |
| \`var(--foreground)\` | \`#0F172A\` | \`#F8FAFC\` | Primary typography |
| \`var(--accent)\` | Tailored Palette | Tailored Palette | Highlighting & glows |
| \`var(--card-bg)\` | \`#FFFFFF\` | \`#1E293B\` | Glass & card surfaces |

> [!NOTE]
> Visual features include keyframe moving grid backdrops, ambient pulsing glowing backdrops, interactive theme customizers, unified MarkdownRenderer with one-click code copying and GitHub callouts, and silhouette drop-shadow glow filters.`
  },
  {
    id: "AI Chatbot Engine",
    title: "AI Chatbot Engine",
    type: "agent",
    tags: ["gemini", "chatbot", "react-agent", "parallel-tools", "slash-commands", "interactive-options"],
    links: ["Portfolio Architecture"],
    content: `This node describes the agentic chatbot backend that operates on the portfolio landing page, powered by Google Gemini.

> [!NOTE]
> Tool execution steps are tracked live per message turn via Server-Sent Events (SSE). Active reasoning steps automatically dissolve once responses finalize.

### Agent Tool Capabilities

| Tool Name | Action & Functionality | Target Storage / Data |
|---|---|---|
| \`sendInquiry\` / \`createContactMessage\` | Prompts & inserts message row | Supabase \`contact_messages\` table |
| \`askQuestion\` | Renders interactive choice buttons | Frontend Chat UI Modal |
| \`getProjects\` / \`getCertificates\` | Fetches portfolio & credential data | Root \`/data\` directory |
| \`getArchitecture\` | Reads system architecture graph nodes | Supabase Storage Bucket |
| \`getRose\` | Returns Rose's identity, emotions, capabilities & commands | \`data/rose.ts\` |

> [!TIP]
> Users can type slash commands like \`/projects\`, \`/experience\`, \`/certificates\`, or \`/contacts\` to quickly trigger specialized AI prompt workflows.`
  },
  {
    id: "WebP Image Pipeline",
    title: "WebP Image Pipeline",
    type: "optimization",
    tags: ["sharp", "webp", "images", "asset-pipeline"],
    links: ["Portfolio Architecture"],
    content: `This node documents the media optimization pipeline that keeps page load times fast.

> [!NOTE]
> All PNG and JPEG static images are processed through Sharp before being uploaded to Supabase Storage.

### Compression Workflow
- High resolution source images are received.
- Sharp converts buffers to WebP format at 80% compression quality.
- Converted payloads are mirrored to Supabase Storage CDN.

### Experience Project Photo Galleries
Internship screenshots (narrative captures + ClickUp task attachments) are converted to WebP and stored in \`public/experience/\`, then uploaded to \`assets/experience/*.webp\` and referenced as \`ASSET_BASE/experience/...\`. The Experience section renders them as a captioned "Screenshots & Results" gallery inside each project's detail modal and uses the first photo as the card cover for diagram-less projects (e.g., AI Tooling branding & SMS).
- **Data**: \`WorkProject.photos\` (\`WorkProjectPhoto[]\`) in \`data/types.ts\`, populated in \`data/experience.ts\`
- **Render**: \`app/(pages)/(main)/sections/ExperienceSection.tsx\` + gallery styles in \`experience.css\`
- **Sync**: \`scripts/sync-all-to-supabase.mjs\` mirrors the whole \`public/\` tree into the \`assets\` bucket; the repository's data-agent-wiki parity is preserved since \`data/experience.ts\` is exposed to the agent via \`getExperienceTool\` and reflected in the wiki`
  },
  {
    id: "Subdomain Routing",
    title: "Subdomain Routing",
    type: "infrastructure",
    tags: ["subdomains", "routing", "middleware"],
    links: ["Portfolio Architecture"],
    content: `This node describes the dynamic hostname inspection logic configured in Next.js edge middleware.

| Subdomain Pattern | Rewritten Target Path | Feature Scope |
|---|---|---|
| \`wiki.<domain>\` | \`app/(pages)/sites/wiki/page.tsx\` | Developer Knowledge Base |
| \`quicknote.<domain>\` | \`app/(pages)/sites/quicknote/page.tsx\` | Markdown QuickNote App |
| \`uoweme.<domain>\` | \`app/(pages)/sites/uoweme/page.tsx\` | UOweMe Debt Tracker |
| \`analytics.<domain>\` | \`app/(pages)/sites/analytics/page.tsx\` | Portfolio Analytics & Graph |`
  },
  {
    id: "Testing & CI Pipeline",
    title: "Testing & CI Pipeline",
    type: "quality",
    tags: ["vitest", "playwright", "e2e", "github-actions", "linting", "typecheck"],
    links: ["Portfolio Architecture"],
    content: `This node documents the verification, test automation, sync, and deployment pipelines that keep the system healthy.

> [!IMPORTANT]
> Tasks are never complete until all verification tools and Playwright E2E suites execute without errors.

### Verification Tools

| Tool Step | Script Command | Target Checks |
|---|---|---|
| **TypeScript** | \`npm run typecheck\` | Static type safety (\`tsc --noEmit\`) |
| **ESLint** | \`npm run lint\` | Code quality & syntax validation |
| **StyleLint** | \`npm run lint:style\` | CSS rules & variable consistency |
| **Vitest** | \`npx vitest run\` | 69 test files (464 unit/integration tests) |
| **Playwright E2E** | \`npm run test:e2e\` | 12 full-coverage E2E specs across all pages, subsites, APIs, & mobile |
| **Next.js Build** | \`npm run build\` | Turbopack production compilation |

### Playwright E2E Test Suite (\`e2e/\`)

| Spec File | Target Scope |
|---|---|
| \`e2e/home.spec.ts\` | Home sections, modals, contact form, chatbot launcher, theme customizer |
| \`e2e/auth.spec.ts\` | Login (/login), Sign-up (/signup), Privacy (/privacy), Guest modal |
| \`e2e/sites-wiki.spec.ts\` | Wiki index, real-time search, category filters, article detail reader |
| \`e2e/sites-quicknote.spec.ts\` | QuickNote app, note editor, live preview toggle, sidebar, tags |
| \`e2e/sites-uoweme.spec.ts\` | UOweMe expense tracker, balance cards, public debt share (/share/uoweme) |
| \`e2e/sites-mmm.spec.ts\` | Minecraft Mod Manager, Modrinth search, Scan & Upload modals, join flow |
| \`e2e/sites-subsites.spec.ts\` | Analytics DAG pipeline graph, Commissions booking form, Visitors, AI Game |
| \`e2e/test-galleries.spec.ts\` | Test Hub, UI Component Gallery, Email Templates Studio, Loaders |
| \`e2e/admin.spec.ts\` | Admin Dashboard route protection and layout access control |
| \`e2e/api-routes.spec.ts\` | Public GET status checks, auth boundaries (401/403), input validation (400) |
| \`e2e/responsive-mobile.spec.ts\` | Mobile viewport (375x667), layout wrapping, mobile chatbot usability |

### GitHub Actions Workflows (\`.github/workflows/\`)

| Workflow File | Trigger Event | Primary Purpose & Pipeline Nodes |
|---|---|---|
| **\`ci.yml\`** | \`push [main]\`, \`pull_request [main]\` | Multi-stage pipeline: Fan-in Quality (TypeScript, ESLint, StyleLint, Vitest) → Next.js Turbopack Build → Deploy (Vercel) & Sync /data to Supabase → Playwright E2E (Endform) → Rollback Vercel on failure |
| **\`jules-ci-fixer.yml\`** | \`workflow_run [CI failure]\` | AI Auto-Fixer: Listens for CI failures, invokes Jules AI to fetch logs, reproduce & fix errors locally, verify with \`npm test\`, and open a PR |
| **\`jules-automerge.yml\`** | \`pull_request [opened, reopened]\` | Auto-Merge: Automatically enables GitHub squash auto-merge on PRs submitted by \`jules-bot\` |

> [!NOTE]
> Machi Analytics (\`/sites/analytics\`) features an interactive DAG workflow graph component (\`app/components/WorkflowPipelineGraph.tsx\`) with tab switching for all three GitHub Actions workflows, showing job dependencies, status badges, and execution step durations.`
  },
  {
    id: "Guest Authentication & Prompt",
    title: "Guest Authentication & Prompt",
    type: "core",
    tags: ["auth", "guest", "supabase", "anonymous-login", "dialog"],
    links: ["Portfolio Architecture"],
    content: `This node documents the unauthenticated visitor prompt system and anonymous Supabase session flow.

\`\`\`mermaid
flowchart TD
    Visit["Unauthenticated Visitor Navigates to Site"] --> Modal["AuthPromptModal Appears (Site-wide)"]
    Modal --> Choice{"User Decision"}
    Choice -->|Click Sign In| LoginRoute["Redirect to /login Form"]
    Choice -->|Click Remain as Guest| AnonAuth["Supabase signInAnonymously()"]
    AnonAuth -->|Session Created| AuthContext["AuthContext Updates State (is_anonymous=true)"]
    AuthContext --> Dismiss["Modal Automatically Dismisses"]
\`\`\`

### Guest & Anonymous Authentication Workflow

| Feature | Implementation | Notes |
|---|---|---|
| **Global Enforcement** | Mounted in \`RootLayout\` via \`AuthPromptModal\` | Triggered when \`!loading && !user\` across any page |
| **Strict Modal Mode** | No close button (X), escape key & outside clicks prevented | Visitors must choose between Sign In and Guest |
| **Supabase Anonymous Auth** | \`supabase.auth.signInAnonymously()\` via \`AuthContext\` | Issues anonymous session without requiring email |
| **Auth Page Exemption** | Checks \`usePathname()\` for \`/login\`, \`/signup\`, \`/auth\` | Avoids overlaying authentication forms |`
  },
  {
    id: "Data Privacy & Governance",
    title: "Data Privacy & Governance",
    type: "core",
    tags: ["privacy", "telemetry", "transparency", "governance", "security"],
    links: ["Portfolio Architecture"],
    content: `This node documents the data privacy catalog and telemetry disclosures across all pages.

\`\`\`mermaid
flowchart LR
    Visitor["Visitor / Client"] --> Page["Any Page / Subsite"]
    Page --> Decision{"Action Triggered?"}
    Decision -->|Browse Only| LocalOnly["Zero PII / LocalStorage UI State"]
    Decision -->|Submit Form / Post| Storage["RLS-Protected Supabase Store"]
    Storage --> Admin["Strict Admin / User Scoped Access"]
\`\`\`

### Data Governance Guarantees
- **Transparency**: Page-by-page disclosure in \`/privacy\` and \`data/privacy.ts\` with required vs optional flags.
- **Row-Level Security**: PostgreSQL RLS policies isolate user ledger rows, notes, and messages.
- **Zero Ad Tracking**: No third-party ad pixels, trackers, or marketing brokers.`
  }
];
