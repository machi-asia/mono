import type { TechStackNode, TechStackEdge } from "./types";

const ASSET_BASE = "";

export const techStackNodes: TechStackNode[] = [
    // ── Core framework ──
    {
        id: "nextjs",
        name: "Next.js",
        category: "Frameworks",
        color: "#ffffff",
        x: 450,
        y: 50,
        startYear: 2024,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/next.svg`,
        description: `Primary web application framework (v16 App Router).

> [!NOTE]
> Leveraged for server-rendered layouts, dynamic subdomains, and Turbopack bundling.

| Feature | Specification |
|---|---|
| **Version** | Next.js 16.2.7 |
| **Router** | App Router (\`app/\`) |`,
    },

    // ── Core dependencies ──
    {
        id: "react",
        name: "React",
        category: "Frameworks",
        color: "#61DAFB",
        x: 230,
        y: 175,
        startYear: 2024,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/react.svg`,
        description: `UI component architecture engine.

> [!TIP]
> Enables reactive hooks, state management, and portal modals (\`createPortal\`).

| Paradigm | Library |
|---|---|
| **State** | React Context & Hooks |
| **UI** | Functional Components |`,
    },
    {
        id: "typescript",
        name: "TypeScript",
        category: "Languages",
        color: "#3178C6",
        x: 670,
        y: 175,
        startYear: 2024,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/typescript.svg`,
        description: `Strict type-safe programming language.

> [!IMPORTANT]
> Enforces \`strict: true\` type safety across all codebase modules and agent tools.

| Config | Value |
|---|---|
| **Mode** | Strict |
| **Target** | ES2017 / Bundler |`,
    },

    // ── Frontend & UI (left cluster) ──
    {
        id: "radix",
        name: "Radix UI",
        category: "Frontend",
        color: "#6366f1",
        x: 70,
        y: 310,
        startYear: 2024,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/radix.svg`,
        description: `Unstyled, accessible UI component primitives.

> [!NOTE]
> Provides accessible dialogs, tooltips, dropdowns, and navigation primitives.

| Attribute | Detail |
|---|---|
| **Accessibility** | WAI-ARIA compliant |
| **Styling** | Custom CSS classes |`,
    },
    {
        id: "lucide",
        name: "Lucide",
        category: "Frontend",
        color: "#F56565",
        x: 200,
        y: 310,
        startYear: 2024,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/lucide.svg`,
        description: `Clean, modern vector icon set.

> [!TIP]
> Renders crisp SVG icons across chatbot badges, navigation menus, and starter cards.

| Library | Type |
|---|---|
| **Lucide React** | Feather-derived SVGs |`,
    },
    {
        id: "tailwind",
        name: "Tailwind",
        category: "Frontend",
        color: "#06B6D4",
        x: 350,
        y: 310,
        startYear: 2025,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/tailwind.svg`,
        description: `Utility-first CSS framework (v4).

> [!NOTE]
> Used alongside vanilla CSS custom properties for responsive utility layout styling.

| Version | Engine |
|---|---|
| **v4.0** | PostCSS Plugin |`,
    },
    {
        id: "css",
        name: "CSS",
        category: "Frontend",
        color: "#264de4",
        x: 70,
        y: 430,
        startYear: 2023,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/css.svg`,
        description: `Vanilla CSS custom properties and theme tokens.

> [!IMPORTANT]
> Raw color hex values are strictly forbidden; all components consume CSS theme variables.

| Variable Token | Target Surface |
|---|---|
| \`var(--background)\` | Page Canvas |
| \`var(--accent)\` | Glow & Accents |`,
    },
    {
        id: "gsap",
        name: "GSAP",
        category: "Frontend",
        color: "#88CE02",
        x: 200,
        y: 430,
        startYear: 2025,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/gsap.webp`,
        description: `GreenSock Animation Platform for high-performance visual timelines.

> [!NOTE]
> Powers landing page scroll triggers, hero reveals, and complex UI animations.

| Animation Engine | Capabilities |
|---|---|
| **GSAP Core** | Timelines & ScrollTrigger |`,
    },
    {
        id: "tsparticles",
        name: "tsParticles",
        category: "Frontend",
        color: "#0050FF",
        x: 340,
        y: 430,
        startYear: 2025,
        skillCategory: "frontend",
        description: `Lightweight interactive particle animation engine.

> [!TIP]
> Renders ambient floating particle backdrops behind main landing page sections.

| Engine | Particle Types |
|---|---|
| **tsParticles** | Interactive Orbs |`,
    },
    {
        id: "lenis",
        name: "Lenis",
        category: "Frontend",
        color: "#FF6B6B",
        x: 470,
        y: 430,
        startYear: 2025,
        skillCategory: "frontend",
        iconUrl: `${ASSET_BASE}/icons/lenis.webp`,
        description: `Smooth scroll library for modern web applications.

> [!NOTE]
> Provides fluid inertial scrolling across portfolio sections.

| Scroll Engine | Inertia |
|---|---|
| **Lenis Scroll** | Normalized Inertial Scroll |`,
    },

    // ── Backend & Data (right cluster) ──
    {
        id: "nodejs",
        name: "Node.js",
        category: "Backend",
        color: "#339933",
        x: 570,
        y: 310,
        startYear: 2025,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/node.webp`,
        description: `Asynchronous event-driven JavaScript server runtime.

> [!NOTE]
> Powers serverless Next.js API route handlers and background execution tasks.

| Runtime | Environment |
|---|---|
| **Node.js 20 LTS** | V8 Engine / Next.js Server |`,
    },
    {
        id: "restapi",
        name: "REST API",
        category: "Backend",
        color: "#FF9800",
        x: 710,
        y: 310,
        startYear: 2024,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/rest.webp`,
        description: `HTTP RESTful endpoint endpoints with JSON responses.

> [!IMPORTANT]
> Structured route handlers (\`route.ts\`) for contact messages, certificates, and site data.

| Protocol | Format |
|---|---|
| **HTTP / SSE** | JSON & Server-Sent Events |`,
    },
    {
        id: "supabase",
        name: "Supabase",
        category: "Backend",
        color: "#3ECF8E",
        x: 850,
        y: 310,
        startYear: 2023,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/supabase.svg`,
        description: `Open-source Firebase alternative with PostgreSQL, Auth, and Storage.

> [!NOTE]
> Stores contact messages, site data tables, and public webp assets in the \`assets\` bucket.

| Supabase Product | Usage |
|---|---|
| **Postgres Database** | \`contact_messages\`, \`site_data\` |
| **Storage Buckets** | \`assets/architecture.json\` |`,
    },
    {
        id: "python",
        name: "Python",
        category: "Languages",
        color: "#3572A5",
        x: 600,
        y: 430,
        startYear: 2019,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/python.svg`,
        description: `High-level language for machine learning, scripts, and API backends.

> [!TIP]
> Used in Prosperna AINA AI microservices, PyTorch models, and data pipeline scripts.

| Domain | Frameworks |
|---|---|
| **AI / ML** | PyTorch, Yolov11n, FastAPI |`,
    },
    {
        id: "githubapi",
        name: "GitHub API",
        category: "Backend",
        color: "#f0f6fc",
        x: 740,
        y: 430,
        startYear: 2024,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/github.svg`,
        description: `GitHub REST API integration.

> [!NOTE]
> Powers Machi Analytics live commit activity timelines and repository statistic tools.

| Endpoint | Target Data |
|---|---|
| **User Events** | Live commit logs & repos |`,
    },
    {
        id: "postgresql",
        name: "PostgreSQL",
        category: "Backend",
        color: "#336791",
        x: 870,
        y: 430,
        startYear: 2023,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/postgresql.svg`,
        description: `Relational database management system.

> [!NOTE]
> Backs Supabase data tables with strict JSONB schema support and RLS security policies.

| Feature | Details |
|---|---|
| **JSONB** | Dynamic site data storage |`,
    },

    // ── Specializations ──
    {
        id: "pandas",
        name: "Pandas",
        category: "ML / Data",
        color: "#150458",
        x: 120,
        y: 560,
        startYear: 2022,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/pandas.svg`,
        description: `Data analysis and manipulation library.

> [!NOTE]
> Used in TerraPrice and SAMS+ data preprocessing pipelines.

| Function | Domain |
|---|---|
| **Data Cleaning** | Agricultural price series |`,
    },
    {
        id: "pytorch",
        name: "PyTorch",
        category: "ML / Data",
        color: "#EE4C2C",
        x: 280,
        y: 560,
        startYear: 2023,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/pytorch.svg`,
        description: `Deep learning framework.

> [!IMPORTANT]
> Powers custom neural network architectures and computer vision model training.

| ML Model | Framework |
|---|---|
| **Vision Neural Nets** | PyTorch Core |`,
    },
    {
        id: "csharp",
        name: "C#",
        category: "Languages",
        color: "#239120",
        x: 490,
        y: 560,
        startYear: 2021,
        skillCategory: "backend",
        iconUrl: `${ASSET_BASE}/icons/csharp.svg`,
        description: `Object-oriented programming language for Unity game development.

> [!NOTE]
> Core scripting language for player movement mechanics, state machines, and shaders.

| Application | Engine |
|---|---|
| **Game Scripts** | Unity Engine |`,
    },
    {
        id: "unity",
        name: "Unity",
        category: "Game Dev",
        color: "#000000",
        x: 650,
        y: 560,
        startYear: 2021,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/unity.webp`,
        description: `Cross-platform 2D/3D game engine.

> [!TIP]
> Engine powering interactive game passion projects, physics simulations, and UI shaders.

| Engine Version | Platform Targets |
|---|---|
| **Unity 2022 LTS** | Windows / WebGL |`,
    },
    {
        id: "analytics",
        name: "Analytics",
        category: "Infrastructure",
        color: "#E91E63",
        x: 810,
        y: 560,
        startYear: 2025,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/vercel.svg`,
        description: `Machi Analytics custom graph and traffic monitoring service.

> [!NOTE]
> Monitors website performance, visitor metrics, and system graph node connections.

| System | Metrics |
|---|---|
| **Machi Analytics** | Graph connections & git activity |`,
    },

    // ── Infrastructure & Tools ──
    {
        id: "git",
        name: "Git",
        category: "Infrastructure",
        color: "#F05032",
        x: 100,
        y: 690,
        startYear: 2019,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/git.svg`,
        description: `Distributed version control system.

> [!IMPORTANT]
> All commits follow strict conventions formatted in \`latest.commit.txt\` and synced to architecture graphs.

| Workflow | Details |
|---|---|
| **Conventional Commits** | Title + Bullet Body |`,
    },
    {
        id: "docker",
        name: "Docker",
        category: "Infrastructure",
        color: "#2496ED",
        x: 280,
        y: 690,
        startYear: 2023,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/docker.svg`,
        description: `Containerization platform for isolated microservices.

> [!NOTE]
> Used for multi-instance Redis Sentinel and Python microservice local testbeds.

| Container Tech | Usage |
|---|---|
| **Docker Compose** | Multi-Redis Clusters |`,
    },
    {
        id: "vercel",
        name: "Vercel",
        category: "Infrastructure",
        color: "#ffffff",
        x: 450,
        y: 690,
        startYear: 2024,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/vercel.svg`,
        description: `Cloud deployment platform for Next.js web applications.

> [!TIP]
> Delivers instant global CDN edge distribution and automatic PR preview deployments.

| Platform | Deployment Target |
|---|---|
| **Vercel Edge** | Next.js Production |`,
    },
    {
        id: "figma",
        name: "Figma",
        category: "Tools",
        color: "#F24E1E",
        x: 630,
        y: 690,
        startYear: 2021,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/figma.svg`,
        description: `Collaborative UI/UX vector design tool.

> [!NOTE]
> Used to design wireframes, component design systems, and visual layouts.

| Tool | Focus |
|---|---|
| **Figma Desktop** | Wireframing & UI tokens |`,
    },
    {
        id: "vscode",
        name: "VS Code",
        category: "Tools",
        color: "#007ACC",
        x: 810,
        y: 690,
        startYear: 2019,
        skillCategory: "tools",
        iconUrl: `${ASSET_BASE}/icons/vscode.svg`,
        description: `Primary integrated development environment (IDE).

> [!IMPORTANT]
> Configured with strict ESLint, Stylelint, Vitest, and TypeScript extensions.

| IDE | Extensions |
|---|---|
| **VS Code** | ESLint, Tailwind, Vitest |`,
    },
];

export const techStackEdges: TechStackEdge[] = [
    // Core deps
    { from: "nextjs", to: "react" },
    { from: "nextjs", to: "typescript" },
    // React UI components
    { from: "react", to: "radix" },
    { from: "react", to: "lucide" },
    { from: "react", to: "tsparticles" },
    { from: "radix", to: "lucide" },
    // Styling
    { from: "nextjs", to: "tailwind" },
    { from: "nextjs", to: "css" },
    { from: "tailwind", to: "css" },
    { from: "typescript", to: "tailwind" },
    // API layer — Next.js route handlers expose REST endpoints
    { from: "nextjs", to: "restapi" },
    { from: "restapi", to: "supabase" },
    { from: "restapi", to: "githubapi" },
    { from: "typescript", to: "supabase" },
    // Animation & scroll
    { from: "nextjs", to: "gsap" },
    { from: "nextjs", to: "lenis" },
    { from: "gsap", to: "lenis" },
    { from: "gsap", to: "tsparticles" },
    // Deployment & monitoring
    { from: "nextjs", to: "vercel" },
    { from: "vercel", to: "analytics" },
    // Backend additions
    { from: "nextjs", to: "nodejs" },
    { from: "supabase", to: "postgresql" },
    { from: "restapi", to: "python" },
    // Tools
    { from: "git", to: "vercel" },
    { from: "docker", to: "vercel" },
    { from: "figma", to: "css" },
    { from: "vscode", to: "typescript" },
    // Game development
    { from: "csharp", to: "unity" },
    // Machine Learning & Data
    { from: "python", to: "pytorch" },
    { from: "python", to: "pandas" },
    { from: "pandas", to: "pytorch" },
];

export const techCategories = Array.from(
    new Map(techStackNodes.map(n => [n.category, n.color])).entries()
);

// Language color mapping
export const languageColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    Vue: "#41b883",
    Svelte: "#ff3e00",
};

// Hero titles for typing animation
export const heroTitles = [
    "Full Stack Developer",
    "Machine Learning Engineer",
    "Unity Game Developer"
];

// Tech stack icon mapping
export const techIconMap: Record<string, string> = {
    nextjs: `${ASSET_BASE}/icons/next.svg`,
    react: `${ASSET_BASE}/icons/react.svg`,
    typescript: `${ASSET_BASE}/icons/typescript.svg`,
    radix: `${ASSET_BASE}/icons/radix.svg`,
    lucide: `${ASSET_BASE}/icons/lucide.svg`,
    tailwind: `${ASSET_BASE}/icons/tailwind.svg`,
    css: `${ASSET_BASE}/icons/css.svg`,
    gsap: `${ASSET_BASE}/icons/gsap.webp`,
    lenis: `${ASSET_BASE}/icons/lenis.webp`,
    nodejs: `${ASSET_BASE}/icons/node.webp`,
    restapi: `${ASSET_BASE}/icons/rest.webp`,
    supabase: `${ASSET_BASE}/icons/supabase.svg`,
    python: `${ASSET_BASE}/icons/python.svg`,
    githubapi: `${ASSET_BASE}/icons/github.svg`,
    postgresql: `${ASSET_BASE}/icons/postgresql.svg`,
    vercel: `${ASSET_BASE}/icons/vercel.svg`,
    analytics: `${ASSET_BASE}/icons/vercel.svg`,
    git: `${ASSET_BASE}/icons/git.svg`,
    docker: `${ASSET_BASE}/icons/docker.svg`,
    figma: `${ASSET_BASE}/icons/figma.svg`,
    vscode: `${ASSET_BASE}/icons/vscode.svg`,
    csharp: `${ASSET_BASE}/icons/csharp.svg`,
    unity: `${ASSET_BASE}/icons/unity.webp`,
    pytorch: `${ASSET_BASE}/icons/pytorch.svg`,
    pandas: `${ASSET_BASE}/icons/pandas.svg`,
};

// Icons that need a white background circle behind them
export const darkIconIds = new Set([
    "restapi", "nextjs", "githubapi", "vercel", "analytics", "radix", "unity"
]);
