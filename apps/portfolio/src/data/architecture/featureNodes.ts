import type { ArchitectureNode } from "../types";

export const featureNodes: ArchitectureNode[] = [
  {
    id: "Visitors & Reviews",
    title: "Visitors & Reviews",
    type: "feature",
    tags: ["reviews", "visitors", "ratings", "supabase", "auth"],
    links: ["Portfolio Architecture", "Tech Stack & Directories"],
    content: `This node documents the Visitors & Reviews system feature where authenticated users can leave star ratings and short comments.

> [!NOTE]
> Powered by Supabase database storage (\`public.reviews\` table) with Row Level Security (RLS) policies guaranteeing user ownership checks.

\`\`\`mermaid
flowchart TD
    A[Visitor / User] --> B{Authenticated?}
    B -- Yes --> C[Submit/Update Star Review & Comment]
    B -- No --> D[View Reviews & Prompt to Sign In]
    C --> E[POST /api/reviews]
    D --> F[GET /api/reviews]
    E --> G[(Supabase reviews Table)]
    F --> G
\`\`\`

| Component | Responsibility | Location |
|---|---|---|
| **VisitorsSection** | Main portfolio landing section placed after Experience | \`app/(pages)/(main)/sections/VisitorsSection.tsx\` |
| **VisitorsPage** | Standalone site page for community reviews | \`app/(pages)/sites/visitors/page.tsx\` |
| **StarRating** | Reusable 1-5 star rating component | \`app/components/StarRating.tsx\` |
| **ReviewCard** | Reusable review display card | \`app/components/ReviewCard.tsx\` |
| **API Route** | Review fetching, creation, & deletion | \`app/(pages)/api/reviews/route.ts\` |`
  },
  {
    id: "QuickNote Site",
    title: "QuickNote Site",
    type: "integration",
    tags: ["quicknote", "notes", "markdown", "graph", "supabase"],
    links: ["Portfolio Architecture"],
    content: `QuickNote is a private per-user Markdown notes application at \`/sites/quicknote\`.

> [!NOTE]
> Notes are owner-private, enforced at the database level via Row-Level Security on the \`quicknote_notes\` table.

### System Flow

\`\`\`mermaid
flowchart TD
    A[Authenticated User] --> B[QuickNote Page]
    B --> C{Select/Create Note}
    C --> D[NoteList sidebar]
    C --> E[NoteEditor split-pane]
    E --> F[Markdown textarea]
    E --> G[Live Preview]
    B --> H[NoteGraph SVG]
    H --> I{Shared Tags?}
    I -- Yes --> J[Edge between notes]
    I -- No --> K[Isolated node]
    E --> L[POST/PATCH /api/quicknote/notes]
    D --> M[GET /api/quicknote/notes]
    L --> N[(Supabase quicknote_notes)]
    M --> N
\`\`\`

| Component | Responsibility | Location |
|---|---|---|
| **QuickNotePage** | Auth gate, state orchestration, CRUD wiring | \`app/(pages)/sites/quicknote/page.tsx\` |
| **NoteList** | Filterable sidebar with tag chips | \`app/(pages)/sites/quicknote/components/NoteList.tsx\` |
| **NoteEditor** | Split-pane editor: raw Markdown + live preview | \`app/(pages)/sites/quicknote/components/NoteEditor.tsx\` |
| **NoteGraph** | SVG graph: notes as nodes, shared tags as edges | \`app/(pages)/sites/quicknote/components/NoteGraph.tsx\` |
| **API Route** | Full CRUD for \`quicknote_notes\` | \`app/(pages)/api/quicknote/notes/route.ts\` |
| **Migration** | Table, RLS, GIN tag index, updated_at trigger | \`supabase/migrations/20260805000001_create_quicknote.sql\` |`
  },
  {
    id: "Rose Agent Data",
    title: "Rose Agent Data",
    type: "agent",
    tags: ["rose", "agent", "identity", "emotions", "capabilities", "data-parity"],
    links: ["Portfolio Architecture", "AI Chatbot Engine"],
    content: `This node documents \`data/rose.ts\` — the static data file that defines Rose's full identity, personality, emotion set, tool capabilities, domain specialists, slash commands, and system rules.

> [!NOTE]
> \`data/rose.ts\` follows the same data-agent-wiki parity pattern as all other \`/data\` files. It is exposed to the agent runtime via \`getRoseTool\` and reflected in the wiki knowledge base as the 'Rose — AI Portfolio Companion' article.

### System Flow

\`\`\`mermaid
flowchart TD
    A["User asks: 'Who are you?'"] --> B[Rose calls getRose tool]
    B --> C[getRoseTool.execute]
    C --> D[Import rose from data/rose.ts]
    D --> E["Return JSON: identity + emotions + capabilities"]
    E --> F[Rose compiles final Markdown response]
    F --> G[Chat UI displays Rose profile]
    H[Wiki articles.ts] --> D
    I[data/rose.ts] --> D
    I --> J[data/architecture.ts Rose Agent Data node]
\`\`\`

| Section | Key Fields | Count |
|---|---|---|
| **Identity** | name, role, owner, model, deployedAt | 6 fields |
| **Personality Traits** | trait, description | 6 traits |
| **Emotion States** | name, imagePath, description, triggerCondition | 9 emotions |
| **Capabilities** | toolName, label, description, category | 23 tools |
| **Specialists** | key, name, description, expertise | 3 specialists |
| **Slash Commands** | command, label, description, icon | 10 commands |
| **System Rules** | Formatting & behaviour rules | 8 rules |`
  },
  {
    id: "Commissions Subsite",
    title: "Commissions Subsite & Booking System",
    type: "subsite",
    tags: ["commissions", "booking", "subsite", "admin", "resend", "supabase"],
    links: ["Portfolio Architecture"],
    content: `This node documents the Commissions subsite (\`/sites/commissions\`), client booking form, Supabase integration, admin requests manager, and automated Resend email dispatch system.

> [!NOTE]
> When visited by an admin (\`role === 'admin'\`), the page automatically switches to the Requests Manager Dashboard with full status control, admin notes, and client form preview toggling.

### Architecture & Data Flow

\`\`\`mermaid
flowchart TD
    Client["Client / Visitor"] -->|Visits /sites/commissions| Form["CommissionBookingForm"]
    Form -->|POST /api/commissions| API["Commissions API Route"]
    API -->|Insert Row| DB[("Supabase 'commissions' Table")]
    API -->|Trigger Notification| Resend["Resend SDK Email Controller"]
    Resend -->|Dispatch HTML Email| Admins["All Portfolio Admins"]
    
    AdminUser["Admin User"] -->|Visits /sites/commissions| Dashboard["CommissionAdminDashboard"]
    Dashboard -->|GET /api/commissions| API
    Dashboard -->|PATCH /api/commissions| API
    Dashboard -->|DELETE /api/commissions| API
\`\`\`

| Feature | Description | Target Module |
|---|---|---|
| **Custom Scope & Booking Form** | Client-defined project scope, requirements, proposed budget, and target completion date | \`CommissionBookingForm.tsx\` / \`data/commissions.ts\` |
| **Bespoke Engineering Domains** | Purely custom offerings (Full-Stack, AI Agents, UI/UX, Backend APIs, Consulting) with no prebuilt tiers | \`data/commissions.ts\` |
| **Admin Request Manager** | Filter by status, search by client/title, view scope & budget | \`CommissionAdminDashboard.tsx\` |
| **Status Progression** | Update status (Pending, In Progress, Approved, Completed, Declined) | \`PATCH /api/commissions\` |
| **Internal Admin Notes** | Add private notes, rates, and milestone tracking | Supabase \`admin_notes\` column |
| **Automated Email Dispatch** | Responsive HTML emails sent to all admins on submission | \`CommissionNotificationTemplate.ts\` |`
  },
  {
    id: "Grafana & Supabase Observability",
    title: "Grafana & Supabase Observability",
    type: "analytics",
    tags: ["grafana", "supabase", "prometheus", "observability", "metrics"],
    links: ["Portfolio Architecture"],
    content: `This node documents the Grafana observability suite and real-time Prometheus metrics pipeline integrated into Machi Analytics.

\`\`\`mermaid
flowchart TD
    PG[("Postgres Database & Engine")] -->|Internal Stats| MetricsAPI["Supabase Metrics API (/customer/v1/privileged/metrics)"]
    MetricsAPI -->|HTTP Basic Auth Scrape (60s)| Scraper["Prometheus Scraper / Grafana Cloud"]
    Scraper -->|Metrics Ingestion| Grafana["Grafana Observability Engine"]
    Grafana -->|Telemetry & Kiosk View| AnalyticsDash["Machi Analytics / GrafanaDashboard.tsx"]
    
    subgraph Machi Analytics Suite
        GrafanaDash -->|Live Sparklines| Panels["Postgres TPS, Latency, IOPS, Pool Saturation"]
        GrafanaDash -->|Kiosk Iframe| LiveEmbed["Interactive Grafana Cloud Embed"]
    end
\`\`\`

### Telemetry Categories

| Category | Monitored Metrics | PromQL Source |
|---|---|---|
| **Database & Queries** | Latency (0.82ms), Throughput (148 TPS), Buffer Cache Hit (99.85%), Row Locks | \`rate(pg_stat_database_xact_commit[1m])\` |
| **Compute & Resources** | CPU Utilization (14.2%), RAM Buffers (264MB), Disk IOPS (24 IOPS), Disk Space | \`node_cpu_utilization\` / \`node_disk_read_bytes_total\` |
| **Connection Pooler** | Active Clients (12/100), Idle in TX (0), Pool Waiting (0), Churn Rate | \`pgbouncer_pools_cl_waiting\` / \`pg_stat_activity_count\` |
| **WAL & Storage** | WAL Generation Rate (1.4MB/m), Table Bloat (0.3%), Replication Lag (0ms), Vacuum | \`rate(pg_stat_database_xact_commit[5m])\` |`
  },
  {
    id: "MMM Subsite",
    title: "MMM Subsite",
    type: "subsite",
    tags: ["minecraft", "mod-manager", "modrinth", "version-control", "organizations", "bulk-downloader"],
    links: ["Portfolio Architecture"],
    content: `This node documents the architecture, database models, and workflows of the MMM (Minecraft Mod Manager) collaborative platform.

\`\`\`mermaid
flowchart TD
    User["User / Admin"] -->|Create Org & Invite Links| OrgEngine["MMM Organizations & RLS"]
    User -->|Search & Add Mods| ModrinthAPI["Modrinth REST API v2 (/api/mmm/modrinth/search)"]
    ModrinthAPI -->|Resolve Game & Loader Files| ModListEngine["Mod List & Dependencies"]
    ModListEngine -->|Audit Trail Log| HistoryEngine["Git-style Version Control History (mmm_mod_history)"]
    User -->|Sequential Direct Download| BulkDownloader["Sequential Browser/FS Stream Saver (No Zip)"]
    BulkDownloader -->|Local Install| ModsFolder["%appdata%/.minecraft/mods"]
\`\`\`

### System Capabilities

| Capability | Implementation Detail | Storage / Layer |
|---|---|---|
| **Organization Multi-Tenancy** | Unique invite links (\`/sites/mmm/join?code=XYZ\`) and role-based permissions | Supabase \`mmm_organizations\` & \`mmm_organization_members\` |
| **Mod List Version Control** | Immutable audit log of every added, removed, or updated mod | Supabase \`mmm_mod_history\` table |
| **Modrinth v2 Integration** | Live searching and version resolution matching Minecraft version & loader | \`/api/mmm/modrinth/search\` |
| **Local Mods Folder Scanner** | Native directory picker and file hasher that cross-references \`%AppData%\\.minecraft\\mods\` against Modrinth | \`/api/mmm/modrinth/match-files\` & \`ScanModsModal.tsx\` |
| **Supabase Custom Mod Uploader** | Securely uploads third-party/custom \`.jar\` and \`.zip\` mods to Supabase Storage bucket (\`assets/mmm-mods/\`) and binds to active mod list | \`/api/mmm/upload\` & \`UploadModModal.tsx\` |
| **Sequential Bulk Downloader** | Native browser/filesystem stream saves one-by-one directly to local mods folder | Sequential Download Streamer |`
  },
  {
    id: "Email Notification System & Sender Registry",
    title: "Email Notification System & Sender Registry",
    type: "feature",
    tags: ["emails", "resend", "notifications", "templates", "senders", "uoweme", "commissions"],
    links: ["Portfolio Architecture", "Tech Stack & Directories"],
    content: `This node documents the centralized email notification system, sender profile registry (\`data/emails.ts\`), and multi-identity Resend dispatch controllers.

\`\`\`mermaid
flowchart TD
    A[Event Trigger: Cron / Transaction / Settlement / Commission] --> B[Email Controller / API Handler]
    B --> C[data/emails.ts: getSenderEmail]
    C --> D{Specific Env Set?}
    D -- Yes e.g. RESEND_FROM_COMMISSIONS --> E[Use Template Custom Sender]
    D -- No --> F{RESEND_FROM_EMAIL Set?}
    F -- Yes --> G[Use Global Env Sender]
    F -- No --> H[Use Default Profile Sender & Onboarding Fallback]
    E --> I[Resend API Dispatch]
    G --> I
    H --> I
    I --> J[HTML Template Render: Commission / Transaction / Settlement / Reminder]
    J --> K[Recipient Inbox]
\`\`\`

### Email Sender Profiles Registry

| Template ID | Default Sender Name | Env Override Key | Fallback Address | Description |
|---|---|---|---|---|
| **reminder** | UOweMe Reminders | \`RESEND_FROM_REMINDERS\` | \`onboarding@resend.dev\` | Daily automated debt summaries and pending obligation digests |
| **transaction** | UOweMe | \`RESEND_FROM_TRANSACTIONS\` | \`onboarding@resend.dev\` | Real-time balance notices for newly logged debts/credits |
| **settlement** | UOweMe Payments | \`RESEND_FROM_SETTLEMENTS\` | \`onboarding@resend.dev\` | Settlement updates and PayMongo payment receipt notices |
| **commission** | Machi Commissions | \`RESEND_FROM_COMMISSIONS\` | \`onboarding@resend.dev\` | Bespoke client software booking requests sent to admin |

### System Integration Matrix

| Component | Responsibility | Location |
|---|---|---|
| **Email Registry** | Centralized sender configuration, profile definitions, and address resolver | \`data/emails.ts\` |
| **Email Controllers** | Dispatches transactional notices with specific sender resolution | \`app/emails/index.ts\` |
| **HTML Templates** | High-aesthetic email HTML generators for each notification type | \`app/emails/templates/\` |
| **Email Templates Studio** | Live UI preview studio with template switching & sender profile inspector | \`app/(pages)/test/emails/page.tsx\` |
| **Test Dispatcher API** | Protected test email endpoint utilizing dynamic sender resolution | \`app/(pages)/api/test/send-email/route.ts\` |
| **Daily Cron Route** | 7:00 AM PHT scheduled automated debt digest dispatch | \`app/api/cron/uoweme-reminders/route.ts\` |`
  }
];

