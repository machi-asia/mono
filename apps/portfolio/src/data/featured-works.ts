import type { FeaturedWork } from "./types";

// Featured Works data
export const featuredWorks: FeaturedWork[] = [
    {
        id: "work1",
        title: "SAMS+",
        description: `Thesis project using ensemble deep learning to recognize students in class and automate real-time attendance plotting.

### Overview & Architecture
SAMS+ (Smart Attendance Monitoring System) replaces manual roll calls with a continuous multi-stage computer vision pipeline designed for live classroom feeds. Frame captures pass through a lightweight object detector before crops are normalized and matched against enrolled student embeddings in real time.

### Key Highlights
- **Ensemble Pipeline**: Combines **Yolov11n** bounding-box detection for fast multi-person localization with deep facial embedding verification to eliminate false positives across varied lighting and seating angles.
- **Automated Ledger Plotting**: Confirmed student identifications are de-duplicated per session window and streamed straight to the class attendance dashboard with timestamped confidence logs.
- **Classroom-Ready Throughput**: Tuned inference batching keeps frame latency low enough for standard webcam and CCTV classroom deployments.

> [!NOTE]
> Leverages Yolov11n computer vision models paired with facial recognition pipelines.

| Model / Tech | Function | Performance |
|---|---|---|
| **Yolov11n** | Student Detection | 98.4% Accuracy |
| **Facial Recognition** | Attendance Plotting | Real-time |`,
        videoUrl: "/videos/WebDev.mp4",
        tags: ["Yolov11n", "Facial Recognition", "Web Development"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work2",
        title: "Unity Passion Projects",
        description: `A collection of interactive 2D & 3D games developed in Unity, showcasing creativity, gameplay mechanics, and physics programming.

### Overview & Architecture
Built as rapid, playable vertical slices exploring responsive character controllers, deterministic physics interactions, and stylized shader pipelines across both 2D and 3D scenes.

### Key Highlights
- **Custom Gameplay Systems**: Modular C# state machines for player movement, combat feel, enemy behavior trees, and input buffering.
- **Technical Art & Shaders**: Authored custom **Unity Shader Graph** materials for rim lighting, dissolve effects, and stylized environmental feedback.
- **Cross-Platform Profiling**: Optimized draw calls, sprite atlases, and physics step budgets for smooth frame pacing on both desktop and mobile targets.

> [!TIP]
> Built using C# and custom Unity Shader Graph materials.

| Component | Technology | Target Platform |
|---|---|---|
| **Game Engine** | Unity Engine | PC & Mobile |
| **Scripting** | C# | Multi-platform |`,
        videoUrl: "/videos/GameDev.mp4",
        tags: ["Unity", "C#", "Game Dev"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work3",
        title: "Blender 3D Models",
        description: `Portfolio of 3D models created using Blender, demonstrating low-poly and high-poly modeling, UV unwrapping, texturing, and rendering.

### Overview & Workflow
A curated body of hard-surface props, stylized assets, and sculpted studies crafted end-to-end in Blender—from initial blockout and topology cleanup through UV packing, baking, and look-dev lighting.

### Key Highlights
- **Production Topology**: Clean quad-flow modeling for subdivision surfaces alongside decimated, game-ready low-poly LOD meshes.
- **UV & Material Authoring**: Non-overlapping UV layouts paired with procedural shader nodes and baked normal, roughness, and ambient occlusion maps.
- **Engine-Ready Export**: Standardized scale, origin pivots, and PBR material channels verified for direct import into Unity and web 3D viewers.

> [!NOTE]
> All 3D assets are optimized for real-time game engines like Unity.

| Art Asset | Workflow | Output Format |
|---|---|---|
| **3D Modeling** | Blender | FBX / OBJ |
| **Texturing** | UV unwrapping & procedural shaders | PBR Textures |`,
        videoUrl: "/videos/Blender.mp4",
        tags: ["Blender", "3D Modeling", "Texturing"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work4",
        title: "Drawings",
        description: `Artistic hobby and digital illustrations created to equip game projects and UI mockups with custom assets and original concept art.

### Overview & Creative Process
Original character studies, anatomical sketches, and illustrated visual assets produced to give personal software and game prototypes a cohesive, hand-crafted aesthetic without relying on generic stock media.

### Key Highlights
- **Concept-to-Asset Pipeline**: Gesture thumbnails and value studies refined into clean line art, layered shading, and reusable visual props.
- **Game & UI Integration**: Prepared with transparent alpha channels and balanced contrast ratios so illustrations integrate cleanly into HUDs, splash screens, and dark-mode interfaces.
- **Style Exploration**: Spans painterly portrait studies, monochrome ink silhouettes, and crisp stylized sprites.

> [!TIP]
> Digital art assets are drawn natively and exported as high-resolution PNGs.

| Discipline | Focus | Deliverable |
|---|---|---|
| **Concept Art** | Character & Anatomy Studies | Layered Digital Illustrations |
| **UI & Game Assets** | Custom Sprites & Silhouettes | Transparent High-Res PNGs |`,
        videoUrl: "/videos/Drawings.mp4",
        tags: ["Art", "Media"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work5",
        title: "TerraPrice",
        description: `Spatial AI agricultural food price forecaster predicting regional market prices across the Philippines via WebGL2 GPU heatmaps and Matérn-3/2 Regression Kriging.

### Overview & Architecture
TerraPrice models spatial and temporal commodity price dynamics across Philippine regions, giving analysts and stakeholders an interactive geospatial canvas to inspect localized forecasts and variance surfaces in real time.

### Key Highlights
- **Hybrid Spatial AI**: Pairs an **89-feature Spatial Fourier neural network** with **Matérn-3/2 Regression Kriging** so global seasonal/macro patterns are calibrated locally against observed market residuals.
- **WebGL2 GPU Heatmaps**: Custom GLSL fragment shaders evaluate kriging weights and render continuous per-pixel heatmap overlays smoothly inside interactive map viewports.
- **Interactive Forecast Controls**: Filter by commodity, date horizon, and geographic coordinates to inspect point predictions alongside spatial uncertainty.

> [!IMPORTANT]
> Combines an 89-feature Spatial Fourier neural network with Gaussian Process spatial calibration.

| Component | Framework | Purpose |
|---|---|---|
| **Web App** | Next.js / TypeScript | Interactive Map & Forecaster |
| **GPU Engine** | WebGL2 Fragment Shader | Per-Pixel Spatial Heatmap |`,
        videoUrl: "/videos/TerraPrice.mp4",
        tags: ["Next.js", "TypeScript", "WebGL2", "Machine Learning"],
        link: "https://terraprice.machi.asia",
    },
    {
        id: "work6",
        title: "ItemList",
        description: `Multi-game production and crafting dependency calculator featuring interactive recipe flow graphs, throughput planning, and community overrides.

### Overview & Architecture
ItemList unifies complex multi-tier crafting calculators under a shared TypeScript graph engine (\`@mono/game-calculator\`), backing dedicated web apps for games such as Satisfactory, Factorio, Create, RimWorld, and LRL.

### Key Highlights
- **Interactive Flow Solver**: Traverses cyclic and branching recipe DAGs to compute exact machine counts, belt/pipe throughput rates, power draw, and raw resource totals as target rates change.
- **Node-Graph Canvas**: Built on **React Flow** so players can pan, inspect, alternate-recipe-swap, and trace upstream/downstream bottlenecks visually.
- **Community Recipe Overrides**: Backed by authenticated moderation workflows allowing verified contributors to submit and approve recipe corrections without redeploying the solver.

> [!TIP]
> Computes multi-tier ingredient trees, machine counts, and raw resource totals in real time.

| Component | Technology | Capability |
|---|---|---|
| **Graph Engine** | React Flow / TypeScript | Recipe Dependency Trees |
| **Platform** | Next.js Monorepo | Multi-Game Calculators |`,
        videoUrl: "/videos/ItemList.mp4",
        tags: ["Next.js", "TypeScript", "React Flow", "Graph Solver"],
        link: "https://itemlist.online",
    },
    {
        id: "work7",
        title: "Smarter Home",
        description: `AI-assisted IoT smart home control citadel for web and Android, uniting multi-zone climate, lighting scenes, Raspberry Pi GPIO/MQTT telemetry, and CCTV security monitoring.

### Overview & Architecture
Smarter Home connects a responsive Next.js and Capacitor mobile frontend to Supabase Realtime and Raspberry Pi edge controllers (\`smarter-home-pi\`) for synchronized domestic automation across every room.

### Key Highlights
- **Multi-Zone Telemetry & Control**: Tracks room-by-room temperature, humidity, AC switches, Kelvin lighting presets, and BCM GPIO relay bindings in real time.
- **Security Citadel & CCTV HUD**: Streams camera snapshots with bounding-box overlays, perimeter arming schedules, and filterable security event logs.
- **Homer AI Assistant**: Translates natural-language commands into safe device actions alongside live voice playback.

> [!IMPORTANT]
> Features a natural-language Homer AI assistant, real-time sensor syncing, and multi-room camera alerts.

| Component | Stack | Capability |
|---|---|---|
| **Control Hub** | Next.js / Capacitor | Web & Android Dashboard |
| **Hardware & AI** | MQTT / Gemini AI | GPIO Actuators & Voice Control |`,
        videoUrl: "/videos/SmarterHome.mp4",
        tags: ["Next.js", "Capacitor", "IoT / MQTT", "Gemini AI"],
        link: "https://github.com/kamachi-dev/smarter-home",
    },
    {
        id: "work8",
        title: "MMM",
        description: `Collaborative Minecraft modpack manager that eliminates version drift across multiplayer servers and friend groups.

Create an organization pinned to a specific Minecraft release and modloader, browse Modrinth v2 directly from the pack workspace, match local .jar files from your mods folder, audit required runtime dependencies, and track every update in a git-style changelog timeline.`,
        videoUrl: "/videos/MMM.mp4",
        tags: ["Next.js", "Supabase", "Modrinth API", "Minecraft"],
        link: "https://mmm.machi.asia",
    },
    {
        id: "work9",
        title: "Machi Notes",
        description: `Graph-linked markdown workspace built for structured technical documentation and fast networked thought.

Organize nested markdown folders across multi-tab split panes, follow clickable [[wikilinks]] between specs, draft structured outlines with AI assistance, and explore clusters in a force-directed SVG knowledge graph.`,
        videoUrl: "/videos/Notes.mp4",
        tags: ["Next.js", "Supabase", "Knowledge Graph", "Gemini AI"],
        link: "https://notes.machi.asia",
    },
    {
        id: "work10",
        title: "U Owe Me",
        description: `Peer-to-peer IOU ledger and group expense settlement tracker designed to keep shared tabs effortless.

Log receivables and payables with receipt memos and due dates, collapse overlapping group expenses into net per-contact balances, settle full friend tabs in one click, and generate shareable ledger statements.`,
        videoUrl: "/videos/UOweMe.mp4",
        tags: ["Next.js", "Supabase", "Social Ledger", "TypeScript"],
        link: "https://uoweme.machi.asia",
    },
    {
        id: "work11",
        title: "Rose AI",
        description: `Personal AI companion built with streaming reasoning traces, persistent long-term memory, and expressive Voice Mode across web and Android.

Combines Supabase-backed conversation history and memory tools with built-in slash commands for live web search, architecture documentation lookup, usage quota tracking, and hands-free spoken conversations.`,
        videoUrl: "/videos/Rose.mp4",
        tags: ["Next.js", "Capacitor", "AI Agent", "Voice AI"],
        link: "https://rose.machi.asia",
    },
];
