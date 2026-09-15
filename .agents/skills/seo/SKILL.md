---
name: seo
description: "Use for ANY task involving search engine optimization, metadata, Open Graph tags, Twitter cards, canonical URLs, sitemaps, robots.txt, structured data (JSON-LD), or improving visitor acquisition through search. Triggers: editing layout.tsx metadata in Next.js apps, adding metadataBase/openGraph/twitter metadata, creating sitemap.ts or robots.ts files, writing SEO descriptions/titles/keywords, optimizing pages for discoverability, or updating any .md documentation that governs SEO rules. Enforces the mandatory SEO conventions every app in this monorepo must carry."
metadata:
  author: machi-asia
  version: "1.0.0"
---

# SEO Standards for Machi Asia Monorepo

## When to Use

Load this skill **before** touching any of these in a Machi Asia app:

- `src/app/layout.tsx` — root `metadata` export additions/changes
- `src/app/*/page.tsx` — per-page `metadata` exports
- `src/app/robots.ts` / `src/app/robots.txt` — crawler directives
- `src/app/sitemap.ts` — sitemap routes
- `src/app/manifest.ts` / manifest — PWA/web-app configuration
- Any `.md` file that states SEO rules (AGENTS.md, CONTRIBUTING.md, README.md)
- Creating new routes/pages that need discoverability

## Mandatory SEO Checklist (Every App, Every Page)

### 1. Root Layout (`src/app/layout.tsx`) MUST export all of these:

```ts
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "<App-specific title>",
    template: "%s | <Brand>",
  },
  description: "<App-specific, keyword-rich description derived from function and purpose>",
  keywords: ["<app-function keywords>", "<target audience>", "<related terms>"],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "<Brand>",
    title: "<App-specific OG title>",
    description: "<App-specific OG description — mirrors meta description>",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "<Brand>" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "<App-specific Twitter title>",
    description: "<App-specific Twitter description — mirrors meta description>",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};
```

**Every layout must define:** `metadataBase`, `title.default` + `title.template`, `description`, `keywords`, `openGraph` (with `type`, `locale`, `url`, `siteName`, `images`), `twitter` (with `card`), and `alternates.canonical`.

### 2. robots.ts (File: `src/app/robots.ts`)

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

### 3. sitemap.ts (File: `src/app/sitemap.ts`)

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

All public, indexable routes MUST be listed. Internal/app-level routes behind AuthGate remain in the sitemap (they are indexable marketing routes — do not exclude them unless they are genuinely private).

### 4. Per-Page Metadata

Every public page must export its own `metadata`:

```ts
export const metadata: Metadata = {
  title: "<Specific Page Title — describes this page, not just the app>",
  description: "<Page-specific description: what the user gets on THIS page>",
};
```

Title must use the layout template (`%s | <Brand>`). Never duplicate the root `title.default` verbatim on a page.

### 5. Structured Data (JSON-LD)

Add a `SoftwareApplication` JSON-LD script for app tools (like the calculator), `WebSite` for brand hubs, and `Organization` for the company — injected via a `<script type="application/ld+json">` in the root layout or per-page.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Machi Asia Calculator",
      url: SITE_URL,
      description: "...",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
    }),
  }}
/>
```

## App-Specific SEO Requirements (Function → Keywords)

### Calculator (`@mono/calculator-app`) — "Game Production Calculator"

**Function:** Multi-game production and crafting recipe calculator for factory games (Satisfactory, Factorio, Minecraft, Dyson Sphere Program, Little Rocket Lab).

**Mandatory SEO strings:**

- Title: `Game Production Calculator` (default), template `%s | Game Production Calculator`
- Description: `Multi-game production and crafting recipe calculator for Satisfactory, Factorio, Minecraft, Dyson Sphere Program, and Little Rocket Lab. Calculate factory rates, plan production lines, and visualize recipe dependency trees.`
- Keywords: `production calculator, factory calculator, crafting calculator, recipe calculator, satisfactory calculator, factorio calculator, dyson sphere program calculator, satisfactory production planning, factorio recipes, factory rate planner, recipe tree graph`
- OG/Twitter title: `Game Production Calculator` — images: `/og.png`
- JSON-LD: `WebApplication` with `applicationCategory: "UtilityApplication"`

### Rose (`@mono/rose-app`) — "Rose AI"

**Function:** Custom AI agent/companion application with voice mode, long-term memory, personalization.

**Mandatory SEO strings:**

- Title: `Rose AI` (default), template `%s | Rose AI`
- Description: `Chat with Rose, a custom AI companion with voice mode, long-term memory, and personalized conversations. Your private AI agent that remembers what matters to you.`
- Keywords: `AI companion, AI agent, AI chatbot, AI assistant, voice AI, conversational AI, personal AI assistant, AI with memory, custom AI agent`
- OG/Twitter title: `Rose AI` — images: `/og.png`
- JSON-LD: `WebApplication` with `applicationCategory: "BusinessApplication"`

### Machi Asia (`@mono/machi-asia`) — "Machi Asia"

**Function:** Home site, showcase and subscription billing hub for all Machi Asia products.

**Mandatory SEO strings:**

- Title: `Machi Asia` (default), template `%s | Machi Asia`
- Description: `Machi Asia — home of Game Production Calculator and Rose AI. Discover, try, and subscribe to Machi Asia's suite of productivity tools and AI applications.`
- Keywords: `Machi Asia, Machi Asia apps, game production calculator, Rose AI, AI companion, productivity tools, subscription hub, software suite`
- OG/Twitter title: `Machi Asia` — images: `/og.png`
- JSON-LD: `Organization` (`Organization` name `Machi Asia`, `url`, `sameAs`)

### Docs (`@mono/docs`) — "Machi Asia Docs"

**Function:** Documentation site — component library docs and user manuals.

**Mandatory SEO strings:**

- Title: `Machi Asia Docs` (default), template `%s | Machi Asia Docs`
- Description: `Component library documentation, developer references, and user manuals for Machi Asia products. Explore the design system, shared UI components, authentication, and database packages.`
- Keywords: `Machi Asia docs, component library, design system, React components, UI library documentation, developer reference, API documentation, Machi Asia`
- OG/Twitter title: `Machi Asia Docs` — images: `/og.png`
- JSON-LD: `WebSite` where pages are documentation references

## Site URL Resolution

Every app MUST resolve `SITE_URL` consistently:

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://<app-domain>";
```

Whatever default is used must be the production domain. `metadataBase` must always be `new URL(SITE_URL)`.

## .md File Enforcement Rules

These rules are extracted verbatim from the repo's governing docs and MUST be honored:

1. **README.md (`Conventions`)** — "All apps and packages are Next.js-based." SEO metadata uses Next.js `Metadata` API only.
2. **README.md (`Conventions`)** — "All `.md` files in the repo must be kept up to date as the project evolves." When you change SEO behavior, update relevant `.md` files in the same change.
3. **CONTRIBUTING.md (`Documentation`)** — "All `.md` files in the repo must be updated when relevant code changes." SEO changes are code changes — update docs.
4. **DESIGN.md (`Content Density`)** — "Pages are high-image, low-text: emphasize visuals and minimize prose." Use OG images, icons, and visual metadata — do not stuff prose into meta descriptions.
5. **AGENTS.md (`Mandatory Duties`)** — "Update `README.md` for every major feature change." Adding a mandated SEO layer is a major feature — document it.
6. **AGENTS.md (`Mandatory Duties`)** — "Keep `latest.commit.txt` in sync with uncommitted work." Describe SEO changes there before ending a session.
7. **README.md (`Apps` table)** — Every app's `description` in the table must match its SEO function/purpose statement. Keep them consistent.
8. **Any app/page that can be indexed** must follow the checklist in this skill. No exceptions for "small" or "demo" pages.

## Verification

After implementing SEO changes, verify:

1. `npm run lint` and `npm run typecheck` pass (Metadata/Viewport types are strict).
2. `npm run test` passes at monorepo root.
3. Each app's `layout.tsx` contains `metadataBase`, `openGraph`, `twitter`, and `alternates` when public.
4. No hardcoded `!DOCTYPE`/duplicate meta tags; use Next.js `Metadata` exclusively.