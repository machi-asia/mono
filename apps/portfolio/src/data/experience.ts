import type { WorkCompany, Education } from "./types";

const ASSET_BASE = "";

// Work Companies with project carousels
export const workCompanies: WorkCompany[] = [
    {
        id: "company1",
        company: "Prosperna",
        companyLogo: `${ASSET_BASE}/icons/prosperna.svg`,
        companyUrl: "https://www.prosperna.com",
        role: "Full Stack Engineering Intern",
        period: "May 18, 2026 - Present",
        reportUrl: `${ASSET_BASE}/documents/prosperna_report.pdf`,
        projects: [
            {
                id: "proj1g",
                title: "Disaster Recovery: Storefront Restoration & S3 Asset Migration",
                description: "Emergency post-ransomware remediation of merchant storefronts, restoring corrupted catalogs and permanently migrating static assets from vulnerable AWS S3 into repository-backed storage.",
                technologies: ["AWS S3", "React", "Node.js", "PostgreSQL", "Asset Management", "Incident Response"],
                diagramType: "asset-migration",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1g-balipura-hero.webp`, caption: "Balipura storefront hero banner restoration" },
                    { src: `${ASSET_BASE}/experience/proj1g-balipura-catalog.webp`, caption: "Balipura product catalog & category grid recovery" },
                    { src: `${ASSET_BASE}/experience/proj1g-croia-hero.webp`, caption: "Croia jewelry hero banner & promotional recovery" },
                    { src: `${ASSET_BASE}/experience/proj1g-croia-products.webp`, caption: "Croia featured product grid restoration" },
                    { src: `${ASSET_BASE}/experience/proj1g-firehouse-menu.webp`, caption: "Firehouse Pizza brand showcase & menu recovery" },
                    { src: `${ASSET_BASE}/experience/proj1g-firehouse-specialties.webp`, caption: "Firehouse Pizza specialty offerings & order layout" },
                    { src: `${ASSET_BASE}/experience/proj1g-fruitgals-banner.webp`, caption: "Fruit Gals fresh harvest banner restoration" },
                    { src: `${ASSET_BASE}/experience/proj1g-fruitgals-catalog.webp`, caption: "Fruit Gals product catalog & inventory recovery" },
                    { src: `${ASSET_BASE}/experience/proj1g-tintin-banner.webp`, caption: "Tintin Bazar promotional banner recovery" },
                    { src: `${ASSET_BASE}/experience/proj1g-tintin-collection.webp`, caption: "Tintin Bazar product collection showcase" },
                    { src: `${ASSET_BASE}/experience/proj1g-s3-migration.webp`, caption: "Marketplace app icons & payment badges served from local repository assets" },
                    { src: `${ASSET_BASE}/experience/proj1g-balipura-2.webp`, caption: "Balipura storefront recovery documentation screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1g-balipura-5.webp`, caption: "Balipura category & product grid recovery follow-ups" },
                    { src: `${ASSET_BASE}/experience/proj1g-balipura-8.webp`, caption: "Balipura restoration verification captures" },
                    { src: `${ASSET_BASE}/experience/proj1g-firehouse-2.webp`, caption: "Firehouse Pizza menu restoration screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1g-firehouse-5.webp`, caption: "Firehouse Pizza ordering layout recovery captures" },
                    { src: `${ASSET_BASE}/experience/proj1g-firehouse-8.webp`, caption: "Firehouse Pizza storefront rebuild documentation" },
                    { src: `${ASSET_BASE}/experience/proj1g-fruitgals-2.webp`, caption: "Fruit Gals catalog restoration screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1g-fruitgals-5.webp`, caption: "Fruit Gals product feed recovery captures" },
                    { src: `${ASSET_BASE}/experience/proj1g-fruitgals-8.webp`, caption: "Fruit Gals storefront rebuild documentation" },
                    { src: `${ASSET_BASE}/experience/proj1g-tintin-2.webp`, caption: "Tintin Bazar promotional area recovery screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1g-tintin-5.webp`, caption: "Tintin Bazar collection grid restoration captures" },
                    { src: `${ASSET_BASE}/experience/proj1g-gonegosyo-2.webp`, caption: "GoNegosyo storefront restoration screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1g-gonegosyo-5.webp`, caption: "GoNegosyo promo banner recovery captures" },
                    { src: `${ASSET_BASE}/experience/proj1g-s3-1.webp`, caption: "Repository-based asset serving verification screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1g-s3-3.webp`, caption: "Local asset migration documentation captures" },
                ],
                longDescription: `Led emergency remediation and reconstruction of client storefronts following the 7/11 database ransomware incident. The attack corrupted binary image records and cloud storage references across Amazon S3, breaking hero carousels, category matrices, and product catalogs for live merchant sites.

> [!IMPORTANT]
> Restored stores: Balipura, Croia, Firehouse Pizza, Fruit Gals (98% catalog restoration), and Tintin Bazar.

| Recovery Initiative | Store | Restoration Outcome |
|---|---|---|
| **Website Restore** | Balipura | Hero imagery, product variant selectors, promo carousels |
| **Website Restore** | Croia | Collection matrices & catalog navigation graphics |
| **Website Restore** | Firehouse Pizza | Food menu structures & online ordering categories |
| **Website Restore** | Fruit Gals | 98% catalog restoration isolated from merchant feeds |
| **Website Revision** | Tintin Bazar | Promotional banners & collection grids |

Under the initiative \`Merchant Side | Images from S3 Bucket to Repository Based\`, I permanently relocated static application images across \`page-service-api\` and \`payment-integration-api\` — marketplace app icons, payment gateway badges (GCash, Maya, Stripe, COD), and theme preview illustrations — from external AWS S3 into version-controlled, repository-local assets (\`src/assets/theme\`), eliminating external S3 dependency for core platform UI.`,
                contributions: [
                    "Audited corrupted merchant databases across five recovery initiatives and systematically re-linked encrypted media records after the 7/11 ransomware attack.",
                    "Reconstructed hero carousels, product variant selectors, promotional banners, and category matrices for Balipura, Croia, Firehouse Pizza, Fruit Gals, and Tintin Bazar.",
                    "Recovered 98% of the Fruit Gals catalog by isolating unrecoverable items and replacing missing assets from merchant feeds.",
                    "Migrated marketplace app icons, payment badges, and theme preview illustrations from AWS S3 into repository-local assets across page-service-api and payment-integration-api.",
                    "Eliminated external S3 dependency for core merchant UI, preventing future asset loss from cloud outages or security incidents."
                ],
            },
            {
                id: "proj1d",
                title: "Migration: Bootstrap to Tailwind CSS",
                description: "Led the migration of Prosperna's merchant dashboard from legacy Bootstrap styling to Tailwind CSS using an isolated class namespace, significantly reducing CSS bundle overhead.",
                technologies: ["Tailwind CSS", "Bootstrap", "React", "CSS/SCSS", "Performance"],
                diagramType: "tailwind-migration",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1d-design-settings.webp`, caption: "Migrated Design Settings panel (Tailwind CSS v4)" },
                    { src: `${ASSET_BASE}/experience/proj1d-design-settings-2.webp`, caption: "Design Settings responsive card layout conversion" },
                    { src: `${ASSET_BASE}/experience/proj1d-finance.webp`, caption: "Migrated Finance overview & balances module" },
                    { src: `${ASSET_BASE}/experience/proj1d-finance-2.webp`, caption: "Finance module Tailwind utility structure" },
                    { src: `${ASSET_BASE}/experience/proj1d-tailwind-components-1.webp`, caption: "Unified Tailwind component foundation screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1d-tailwind-components-3.webp`, caption: "Tailwind conversion of dashboard components" },
                    { src: `${ASSET_BASE}/experience/proj1d-tailwind-components-5.webp`, caption: "Button & form element Tailwind restyling" },
                    { src: `${ASSET_BASE}/experience/proj1d-tailwind-components-7.webp`, caption: "Card component Tailwind migration captures" },
                    { src: `${ASSET_BASE}/experience/proj1d-tailwind-components-9.webp`, caption: "Utility-first class structure verification screenshots" },
                ],
                longDescription: `Pioneered a systematic migration plan to upgrade the legacy Bootstrap stylesheet grid to utility-first Tailwind CSS.

> [!NOTE]
> Utilizing a custom \`tw:\` namespace prefix prevented class conflicts while converting legacy Bootstrap layouts.

| Metric | Before (Bootstrap) | After (Tailwind CSS) | Improvement |
|---|---|---|---|
| **CSS Bundle Size** | 420 KB | 85 KB | 79.7% Reduction |
| **Render Speed** | 1.8s TTI | 0.4s TTI | 4.5x Faster |`,
                contributions: [
                    "Conducted style dependency audits to locate duplicate rules and eliminate conflicting Bootstrap selector overrides.",
                    "Refactored Bootstrap rows, columns, cards, and container elements into isolated Tailwind utility structures (e.g. tw:flex, tw:grid).",
                    "Stripped legacy inline styles and custom SCSS overrides from TotalSales.jsx, TopSellingProducts.jsx, and DailySales.jsx.",
                    "Removed obsolete legacy stylesheets, reducing overall dashboard CSS bundle size and improving initial page render speed."
                ],
            },
            {
                id: "proj1h",
                title: "Multi-Layer Locations Module Engineering",
                description: "End-to-end full-stack enhancement of the multi-branch Store Locations module across the merchant dashboard, backend microservice, and buyer storefront, adding custom store imagery and drag-to-reorder management.",
                technologies: ["React", "Node.js", "MySQL", "REST APIs", "HTML5 Drag & Drop", "File Upload"],
                diagramType: "locations-module",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1h-location-image-modal.webp`, caption: "Store location image upload modal with client-side compression" },
                    { src: `${ASSET_BASE}/experience/proj1h-location-image-form.webp`, caption: "Store image form & metadata preview" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-drag-reorder.webp`, caption: "Location table with drag-to-reorder rows & quick status toggles" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC01-store-locations-page.webp`, caption: "Store locations management page (TC01)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC02-add-location-cta.webp`, caption: "Add location CTA & store image upload (TC02)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC05-quick-filters.webp`, caption: "Quick filter chips on the locations table (TC05)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC15a-merchant-descending.webp`, caption: "Merchant-side alphabetical descending sort (TC15a)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC15b-storefront-after-reorder.webp`, caption: "Storefront grid after drag-to-reorder sync (TC15b)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC16b-storefront-picker.webp`, caption: "Customer storefront branch photo picker (TC16b)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC18-storefront-grid-view-image.webp`, caption: "Storefront grid-view with uploaded store imagery (TC18)" },
                    { src: `${ASSET_BASE}/experience/proj1h-locations-TC19b-storefront-grid-view-initials.webp`, caption: "Storefront grid initials fallback state (TC19b)" },
                    { src: `${ASSET_BASE}/experience/proj1h-location-image-form.webp`, caption: "Store image form & metadata preview" },
                ],
                longDescription: `Full-stack engineering across three repositories — \`prosperna1\` (merchant dashboard), \`business-profile-api\` (backend microservice), and \`p1-customer\` (public buyer storefront) — solving the sprint task \`Store Location | Cannot upload a store logo per location cards show auto-generated initials only\`.

> [!NOTE]
> Merchants previously could not upload custom store imagery, forcing customer-facing storefronts to render auto-generated initials on colored tiles.

| Architecture Layer | Repository | Contribution |
|---|---|---|
| **Dashboard** | \`prosperna1\` | Media upload modal with client-side compression & z-index fix |
| **Backend** | \`business-profile-api\` | \`storePicture\` attribute & validation schemas |
| **Storefront** | \`p1-customer\` | Dynamic high-resolution branch photo rendering |

Under the task \`Store Location | Arrange in Alphabetical Order and Update Store Logo\`, I additionally engineered an interactive HTML5 drag-and-drop table row re-ordering system synced to a bulk positional indexing endpoint, with optimistic status toggles and guards that disable reordering during active search or filters.`,
                contributions: [
                    "Added the storePicture attribute and validation schemas to the StoreLocation data model in business-profile-api.",
                    "Built the media upload modal in prosperna1 with client-side image compression and nested modal z-index resolution.",
                    "Updated p1-customer to dynamically render high-resolution branch photos inside the customer-side location selector.",
                    "Engineered an HTML5 drag-and-drop table row re-ordering system synchronized with a bulk positional indexing endpoint.",
                    "Added instant optimistic status toggle switches with defensive guards disabling drag reordering while filters are active."
                ],
            },
            {
                id: "proj1i",
                title: "Storefront Category Navigation & Responsive Polish",
                description: "Fixed severed product category menus on high-volume storefronts with scrollable, viewport-aware containers and unified shared UI behaviors across the platform.",
                technologies: ["React", "Tailwind CSS", "Responsive Design", "CSS", "UI/UX"],
                diagramType: "category-navigation",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1i-category-scroll.webp`, caption: "Customer storefront with scrollable category list navigation" },
                    { src: `${ASSET_BASE}/experience/proj1i-category-scroll-2.webp`, caption: "Category menu with custom WebKit scrollbar & viewport-aware height" },
                    { src: `${ASSET_BASE}/experience/proj1i-category-1.webp`, caption: "Category scroll fix storefront screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1i-category-3.webp`, caption: "Extended category list fully visible after fix" },
                    { src: `${ASSET_BASE}/experience/proj1i-category-5.webp`, caption: "Category navigation on high-volume storefront" },
                ],
                longDescription: `Resolved a critical usability defect on high-volume buyer storefronts (\`p1-customer\`) tracked in the sprint task \`Customer Side | Product Page | Make product categories list scrollable to show all items\`. The rigid product category menu previously severed the bottom six categories from buyer view.

> [!TIP]
> Responsive vertical scroll containers with custom WebKit scrollbar styling, dynamic viewport-height calculations, and desktop-to-mobile breakpoint listeners guarantee complete category accessibility.

| Fix | Implementation |
|---|---|
| **Category Scroll** | Custom vertical scroll containers & WebKit scrollbars |
| **Viewport Logic** | Dynamic viewport-height calculations across breakpoints |
| **App Wide Cleanup** | Unified pagination, tooltips, and date-range pickers |`,
                contributions: [
                    "Implemented responsive vertical scroll containers with customized WebKit scrollbar styling so full category lists stay reachable on high-volume storefronts.",
                    "Added dynamic viewport-height calculations and desktop-to-mobile breakpoint listeners to the product category menu.",
                    "Unified shared UI behaviors (table pagination, tooltips, date-range pickers) under the App Wide Cleanup initiative, eliminating inconsistent component forks.",
                ],
            },
            {
                id: "proj1j",
                title: "Marketplace, Payment & Integration Maintenance",
                description: "Refreshed marketplace integration badges and plan tiers across Lazada, Shopee, J&T, and Lalamove, and redesigned minimalist empty-state illustrations across eight merchant modules.",
                technologies: ["React", "SVG Illustration", "Stripe", "Marketplace APIs", "Branding"],
                diagramType: "marketplace-integrations",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1j-empty-state-icons.webp`, caption: "Redesigned minimalist SVG empty-state illustrations across merchant modules" },
                    { src: `${ASSET_BASE}/experience/proj1j-marketplace-1.webp`, caption: "Marketplace integrations plan tier badges (GROW/SCALE)" },
                    { src: `${ASSET_BASE}/experience/proj1j-marketplace-2.webp`, caption: "Lazada, Shopee, J&T & Lalamove integration cards" },
                    { src: `${ASSET_BASE}/experience/proj1j-multicurrency-1.webp`, caption: "Multi-currency Stripe checkout copy alignment" },
                    { src: `${ASSET_BASE}/experience/proj1j-multicurrency-2.webp`, caption: "Stripe currency toggle screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1j-integrations-1.webp`, caption: "Marketplace integrations maintenance screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1j-integrations-3.webp`, caption: "Courier service integration states" },
                    { src: `${ASSET_BASE}/experience/proj1j-settings-fixes-1.webp`, caption: "Settings module maintenance screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1j-settings-fixes-2.webp`, caption: "Plan tier & branding label updates" },
                ],
                longDescription: `Executed critical platform maintenance across third-party courier and payment integrations following the platform-wide plan tier restructuring (tasks \`Marketplace | LAZADA, SHOPEE, JNT, LALAMOVE\` and \`Marketplace | Multicurrency\`).

> [!IMPORTANT]
> Legacy \`PRO\` / \`PREMIUM\` plan labels migrated to the new \`GROW\` / \`SCALE\` tiers while streamlining Stripe multi-currency copy.

| Maintenance Area | Scope |
|---|---|
| **Marketplace Badges** | Lazada, Shopee, J&T Express & Lalamove plan labels |
| **Multi-Currency** | Stripe checkout copy alignment |
| **Empty States** | Redesigned minimalist SVG illustrations for 8 merchant views |
| **Navigation** | Section headers updated to \`Order Management\` / \`Product Reviews\` |`,
                contributions: [
                    "Migrated legacy plan labels (PRO/PREMIUM) to the GROW/SCALE tiers across Lazada, Shopee, J&T Express, and Lalamove marketplace badges while streamlining Stripe multi-currency copy.",
                    "Redesigned modern minimalist SVG empty-state illustrations across eight merchant listing views (Contacts, Orders, Inventory, Categories, Add-ons, Reviews, Discounts, Blogs).",
                    "Standardized empty-state copy, prevented awkward word wrapping across mobile viewports, and aligned navigation headers with updated brand terminology.",
                ],
            },
            {
                id: "proj1a",
                title: "AINA: Shared Business Tools & Profile Validation",
                description: "Centralized business profile validator and updater services in Prosperna's AI assistant backend (aina-service), enabling multi-agent reuse across onboarding v2 and general orchestrator channels.",
                technologies: ["Node.js", "Python", "FastAPI", "Redis", "Pytest", "OpenAI API"],
                diagramType: "business-tools",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1a-system-architecture.webp`, caption: "AINA system architecture overview for shared business tools" },
                    { src: `${ASSET_BASE}/experience/proj1a-onboarding-design.webp`, caption: "Onboarding v2 store design preview" },
                    { src: `${ASSET_BASE}/experience/proj1a-onboarding-upload.webp`, caption: "Onboarding store upload flow" },
                    { src: `${ASSET_BASE}/experience/proj1a-ocean-migration-1.webp`, caption: "Ocean of Youth Max AI assistant migration screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1a-ocean-migration-3.webp`, caption: "Legacy page builder to Max AI migration captures" },
                    { src: `${ASSET_BASE}/experience/proj1a-ocean-migration-5.webp`, caption: "Max AI assistant storefront migration screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1a-croia-migration-1.webp`, caption: "Croia Max AI page builder migration" },
                    { src: `${ASSET_BASE}/experience/proj1a-croia-migration-4.webp`, caption: "Croia legacy page builder to Max AI capture" },
                ],
                longDescription: `Consolidated business profile validation and updater tools in the AINA microservice ecosystem. Migrated tools from a nested sub-agent directory into a central, reusable shared library.

> [!NOTE]
> Standardizing validation rules across multi-agent pipelines eliminated code duplication and established consistent branding theme checks.

| Feature Layer | Technology | Details |
|---|---|---|
| **Validation Engine** | FastAPI / Python | Strict regex validation for hex color themes & operating hours |
| **Shared Library** | \`src/agents/shared\` | Reusable multi-agent tool modules |
| **Unit Test Suite** | Pytest | Isolated unit tests executing without live DB overhead |`,
                contributions: [
                    "Traced and refactored helper tool imports from src/agents/sub/business_profile to src/agents/shared/tools/business_profile.",
                    "Registered validators in the default Prosperna AI orchestrator v5 tools registry.",
                    "Strengthened input validation rules for hex color strings, custom branding themes, typography, and operational hours formats.",
                    "Wrote automated pytest unit suites to run validator functions in complete isolation without live database overhead.",
                    "Secured environment configuration settings by replacing hardcoded paths with repository-relative paths in Redis auth documentation."
                ],
            },
            {
                id: "proj1b",
                title: "AINA: Blog Writer Prompting Cleanup & Web Researcher",
                description: "Refined LLM prompt templates and integrated an automated web researcher tool pipeline in aina-service, parsing live search data into Next.js dashboard widgets.",
                technologies: ["Python", "LangChain", "Prompt Engineering", "React", "Next.js", "LLM"],
                diagramType: "blog-prompt",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1b-blog-1.webp`, caption: "First structured blog generation output" },
                    { src: `${ASSET_BASE}/experience/proj1b-blog-2.webp`, caption: "Blog prompt instruction retention during generation" },
                    { src: `${ASSET_BASE}/experience/proj1b-blog-3.webp`, caption: "Second blog generation with unified single-prompt execution" },
                    { src: `${ASSET_BASE}/experience/proj1b-blog-4.webp`, caption: "Blog output compared against Claude generation" },
                ],
                longDescription: `Audited and refactored the blog generator tool pipeline (covering titles, topics, and layout setups) to eliminate static assistant intro greetings that corrupted database records.

> [!TIP]
> Live search results are parsed dynamically into primary, secondary, and long-tail SEO keywords rendered inside Next.js dashboard widgets.

| Component | Responsibility | Output Format |
|---|---|---|
| **Blog Prompt Clean** | Strips hardcoded greetings | Pure JSON payloads |
| **Web Researcher** | Queries live search data | Markdown & LSI keywords |
| **Dashboard Hook** | Next.js \`useMaxAI\` hook | Structured state updates |`,
                contributions: [
                    "Eliminated hardcoded assistant greetings from BlogTitleGeneratorTool and BlogTopicGeneratorTool, delegating conversational transitions to the central LLM.",
                    "Implemented custom state parsing handlers in the Next.js useMaxAI hook to process structured keyword arrays.",
                    "Added keyword grouping logic in applyTextFieldValueToBlogWidget to join primary, secondary, and LSI terms into formatted form fields.",
                    "Wrote and refactored test_title_generator.py and test_topic_generator.py unit test suites to verify pure JSON output delivery."
                ],
            },
            {
                id: "proj1c",
                title: "AINA: Multi-Redis Sessions & Cluster Failover",
                description: "Researched and implemented multi-instance Redis session tracking architecture to support high-concurrency AI conversation persistence across distributed service nodes.",
                technologies: ["Redis", "Sentinel", "Cluster", "Node.js", "Python", "Distributed Systems"],
                diagramType: "redis-sessions",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1a-croia-migration-2.webp`, caption: "Croia page rebuild on the Max AI session-orchestrated workflow" },
                    { src: `${ASSET_BASE}/experience/proj1a-ocean-migration-2.webp`, caption: "Ocean of Youth page workflow running against the multi-node AI backend" },
                ],
                longDescription: `Conducted architectural research on multi-instance Redis topologies (Sentinel failover and Cluster partitioning) to resolve session state persistence and rate-limiting bottlenecks during high concurrent traffic.

> [!IMPORTANT]
> Sentinel primary-to-replica session replication ensures conversation persistence even during simulated node partition events.

| Topology | Node Count | Failover Strategy |
|---|---|---|
| **Sentinel Setup** | 1 Primary / 2 Replicas / 3 Sentinels | Automatic master promotion (< 2s) |
| **Cluster Mode** | 3 Primaries / 3 Replicas | Hash slot partitioning (16384 slots) |`,
                contributions: [
                    "Analyzed active AI conversation tracking session lifecycles, key expiration windows, and rate-limiting limits.",
                    "Researched multi-node connection pooling, Sentinel master-replica failovers, and cluster hash slot partitioning topologies.",
                    "Configured a local multi-instance Redis Docker cluster testbed and verified data replication consistency.",
                    "Authored Python test scripts asserting primary-to-replica session token synchronization during simulated split-brain events."
                ],
            },
            {
                id: "proj1k",
                title: "AI Tooling: Branding Centralization & SMS/Email Parity",
                description: "Centralized store branding tools (name, slogan, subdomain) into the shared LLM tool library in aina-service and aligned SMS transactional templates with email notification standards in orders-service-api.",
                technologies: ["Python", "FastAPI", "LangChain", "Node.js", "SMS Templates", "LLM Tooling"],
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1k-branding-1.webp`, caption: "Store branding tools hosted inside the shared tool library" },
                    { src: `${ASSET_BASE}/experience/proj1k-branding-2.webp`, caption: "Branding tool configuration exposed to the main orchestrator" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-1.webp`, caption: "SMS transactional notification before amount removal" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-2.webp`, caption: "SMS notification aligned with email security standards" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-3.webp`, caption: "Mobile SMS template parity verification" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-4.webp`, caption: "SMS transactional template review screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-6.webp`, caption: "SMS content parity with email notification standards" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-8.webp`, caption: "Transactional SMS short-code verification" },
                    { src: `${ASSET_BASE}/experience/proj1k-sms-10.webp`, caption: "SMS/email parity acceptance captures" },
                ],
                longDescription: `Refactored store branding capabilities (change name, slogan, subdomain) from isolated sub-agent modules into the centralized shared tools library, letting the main LLM orchestrator execute store modifications dynamically without inter-sub-agent routing delays.

> [!NOTE]
> Under \`Max AI: Blog | Max Copywriter Enhancements\`, the blog generation pipeline was optimized to produce structured long-form content (main copy, soft CTAs, 5 FAQs, and conclusion) in a single unified prompt execution.

| Service | Change | Outcome |
|---|---|---|
| **aina-service** | Branding tools relocated to shared library | Dynamic orchestrator execution |
| **aina-service** | Blog pipeline unified prompt execution | Structured long-form content |
| **orders-service-api** | SMS templates aligned with email | Payment amounts removed |`,
                contributions: [
                    "Refactored store branding capabilities (change name, slogan, subdomain) from isolated sub-agent modules into the centralized shared tools library in aina-service.",
                    "Enabled the main LLM orchestrator to execute store modifications dynamically without routing delays through sub-agents.",
                    "Optimized the Max AI blog copywriter to output main copy, soft CTAs, 5 FAQs, and a conclusion in a single structured prompt execution.",
                    "Updated SMS transactional templates in orders-service-api to remove raw payment amounts, matching email notification security standards.",
                ],
            },
            {
                id: "proj1e",
                title: "Standardization: Shared React Component Library",
                description: "Designed and built a type-safe library of shared UI components with Storybook integration and a dedicated /ui-showcase showcase route for component auditing.",
                technologies: ["React", "TypeScript", "Storybook", "Component Architecture", "CSS Variables"],
                diagramType: "react-components",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1e-showcase.webp`, caption: "Component library UI showcase page" },
                    { src: `${ASSET_BASE}/experience/proj1e-showcase-figure-1.webp`, caption: "Shared React component library showcase grid" },
                    { src: `${ASSET_BASE}/experience/proj1e-showcase-figure-2.webp`, caption: "Component library showcase inventory" },
                    { src: `${ASSET_BASE}/experience/proj1e-standardization-1.webp`, caption: "Front-end standardization working screenshots" },
                    { src: `${ASSET_BASE}/experience/proj1e-standardization-3.webp`, caption: "Shared component variant documentation" },
                    { src: `${ASSET_BASE}/experience/proj1e-standardization-5.webp`, caption: "Component standardization audit captures" },
                ],
                longDescription: `Designed and developed a shared, type-safe library of core interactive UI elements (buttons, text inputs, selectors, badges, modals).

> [!NOTE]
> All shared UI components accept a \`variant\` prop self-registering for automatic UI showcase discovery.

| Component | Variants Supported | Props Exposed |
|---|---|---|
| **Navbar** | \`main\`, \`sites\`, \`compact\` | \`variant\`, \`size\`, \`onEvent\` |
| **Button** | \`primary\`, \`secondary\`, \`outline\` | \`variant\`, \`size\`, \`intent\` |
| **Badge** | \`default\`, \`accent\`, \`status\` | \`variant\`, \`size\` |`,
                contributions: [
                    "Standardized button, input, select, and status badge components using variant, size, and intent props.",
                    "Wrote Storybook story files (.stories.tsx) to validate hover, active, loading, disabled, and error states.",
                    "Established a temporary /ui-showcase page rendering component variations for visual QA audits.",
                    "Mapped core UI styling configurations to CSS variable theme tokens (--background, --foreground, --accent)."
                ],
            },
            {
                id: "proj1f",
                title: "Enhancement: Mobile Viewport Audit & Navigation Drawer",
                description: "Audited and optimized merchant workflows across mobile viewports, introducing collapsible drawers, horizontal table wrappers, and stacked card viewports.",
                technologies: ["React", "Tailwind CSS", "Responsive Design", "Mobile UX", "Browser DevTools"],
                diagramType: "mobile-responsiveness",
                photos: [
                    { src: `${ASSET_BASE}/experience/proj1f-mobile-drawer.webp`, caption: "Mobile viewport with hamburger-triggered navigation drawer" },
                    { src: `${ASSET_BASE}/experience/proj1f-mobile-dashboard.webp`, caption: "Mobile dashboard stacked card layout" },
                    { src: `${ASSET_BASE}/experience/proj1f-mobile-blogs.webp`, caption: "Mobile blogs list with responsive tiles" },
                    { src: `${ASSET_BASE}/experience/proj1f-mobile-inventory.webp`, caption: "Mobile inventory table with horizontal scroll wrapper" },
                    { src: `${ASSET_BASE}/experience/proj1f-original-mobile-blogs.webp`, caption: "Original mobile blogs layout before responsive polish" },
                    { src: `${ASSET_BASE}/experience/proj1f-original-mobile-discounts.webp`, caption: "Original mobile discounts layout before responsive polish" },
                ],
                longDescription: `Executed a comprehensive mobile responsiveness audit for key merchant pathways.

> [!TIP]
> Responsive table wrappers enable smooth horizontal scrolling for dense order data tables without breaking mobile layouts.

| Viewport Range | Layout Strategy | Mobile Touch Targets |
|---|---|---|
| **Mobile (320px - 640px)** | Single-column stacked grid & mobile drawer | Min 44px tap targets |
| **Tablet (641px - 1024px)** | 2-column adaptive grid | Responsive margins |`,
                contributions: [
                    "Audited layout breaking points and text cut-off issues across viewports ranging from 320px to 1024px.",
                    "Refactored multi-column input forms into responsive stacked layouts using breakpoint prefixes (grid-cols-1 md:grid-cols-2).",
                    "Implemented overflow wrappers enabling smooth horizontal scrolling for order and inventory data tables.",
                    "Created an animated hamburger-triggered side drawer navigation menu with outside-click dismissal.",
                    "Validated tap targets and layout integrity across physical mobile hardware and simulated viewports."
                ],
            },
        ],
    },
];

// FAQ data
export const faqItems = [
    {
        id: "faq1",
        question: "What technologies do you specialize in?",
        answer: `I specialize in modern web and system technologies.

> [!NOTE]
> Primary stack: React, Next.js 16, TypeScript, Node.js, Python, Supabase, and Redis.

| Domain | Core Tools |
|---|---|
| **Frontend** | Next.js 16, React, Tailwind CSS v4, Framer Motion |
| **Backend & DB** | Node.js, Python, Supabase, PostgreSQL, Redis |
| **Game Dev & ML** | Unity, C#, PyTorch, Pandas, Yolov11n |`,
    },
    {
        id: "faq2",
        question: "Are you available for freelance work?",
        answer: `Yes! I am always open to discussing new projects, system architectures, and engineering roles.

> [!TIP]
> You can send a direct inquiry via the chat using the \`/contacts\` command or email me directly at angelo.kamachi03@gmail.com.`,
    },
    {
        id: "faq3",
        question: "What's your development process?",
        answer: `I follow an iterative agile methodology emphasizing clean code, type safety, and automated testing.

> [!IMPORTANT]
> All code changes pass through the 5-tool verification pipeline (Typecheck, ESLint, Stylelint, Vitest, and Build) before deployment.`,
    },
    {
        id: "faq4",
        question: "Do you work with remote teams?",
        answer: `Absolutely! I have extensive experience working with distributed engineering teams across different timezones. Communication, clear documentation, and GitHub CI/CD automation are second nature to me.`,
    },
];

// Education History
export const educationHistory: Education[] = [
    {
        id: "edu1",
        degree: "B.S. Computer Science",
        school: "Mapua Malayan Colleges Laguna",
        period: "2022 - 2026",
        icon: `${ASSET_BASE}/icons/college.svg`,
        description: `Bachelor of Science in Computer Science degree.

> [!NOTE]
> Specializing in Software Engineering, Machine Learning, and Game Development.

| Degree | Status | Institution |
|---|---|---|
| **B.S. Computer Science** | Graduating 2026 | Mapua Malayan Colleges Laguna |`,
    },
    {
        id: "edu2",
        degree: "Senior High School",
        school: "Mapua Malayan Colleges Laguna",
        period: "2020 - 2022",
        icon: `${ASSET_BASE}/icons/highschool.svg`,
        diplomaImages: [
            `${ASSET_BASE}/images/highschool-graduation.webp`,
            `${ASSET_BASE}/images/highschool-diploma.webp`,
        ],
        description: `Senior High School STEM Strand.

> [!IMPORTANT]
> Graduated with Academic High Distinction honors.

| Track | Honors | Institution |
|---|---|---|
| **STEM Strand** | High Distinction | Mapua Malayan Colleges Laguna |`,
    },
    {
        id: "edu3",
        degree: "Junior High School",
        school: "Dominican Colleges of Sta Rosa, Laguna",
        period: "2016 - 2020",
        icon: `${ASSET_BASE}/icons/highschool.svg`,
        diplomaImages: [
            `${ASSET_BASE}/images/moving-up.webp`,
            `${ASSET_BASE}/images/moving-up-certificate.webp`,
        ],
        description: `Junior High School Completion.

> [!NOTE]
> Completed junior high education with academic awards and science fair recognitions.

| Program | Standing | Institution |
|---|---|---|
| **Junior High** | Moving Up Honors | Dominican Colleges of Sta Rosa |`,
    },
    {
        id: "edu4",
        degree: "Elementary School",
        school: "Dominican Colleges of Sta Rosa, Laguna",
        period: "2010 - 2016",
        icon: `${ASSET_BASE}/icons/elementary.svg`,
        diplomaImages: [`${ASSET_BASE}/images/elementary-certificate.webp`],
        description: `Elementary Education Graduate.

> [!TIP]
> Foundational elementary education with active participation in campus organizations.

| Program | Period | Institution |
|---|---|---|
| **Elementary** | 2010 - 2016 | Dominican Colleges of Sta Rosa |`,
    },
    {
        id: "edu5",
        degree: "Kindergarten",
        school: "Agustinian School of Cabuyao",
        period: "2008 - 2010",
        icon: `${ASSET_BASE}/icons/kindergarten.svg`,
        diplomaImages: [`${ASSET_BASE}/images/kinder-graduation.webp`],
        description: `Early Childhood Education.

> [!NOTE]
> Early childhood primary education.

| Level | Period | Institution |
|---|---|---|
| **Kindergarten** | 2008 - 2010 | Agustinian School of Cabuyao |`,
    },
];
