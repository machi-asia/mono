import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itemlist.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ItemList | Game Production Calculator",
    template: "%s | ItemList",
  },
  description:
    "Free multi-game production and crafting recipe calculator. Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
  keywords: [
    "game calculator",
    "production calculator",
    "recipe planner",
    "production tree",
    "automation ratio",
    "factory calculator",
    "crafting calculator",
    "create mod",
    "rimworld",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ItemList",
    title: "ItemList | Game Production Calculator",
    description:
      "Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ItemList" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ItemList | Game Production Calculator",
    description:
      "Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2144375932551709"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ItemList",
              url: SITE_URL,
              description:
                "Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
