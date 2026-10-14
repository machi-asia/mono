import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rimworld.itemlist.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RimWorld Calculator | ItemList",
    template: "%s | RimWorld Calculator",
  },
  description:
    "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
  keywords: [
    "rimworld calculator",
    "colony production",
    "fabrication bench",
    "recipe planner",
    "itemlist",
    "rimworld crafting",
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
    siteName: "RimWorld Calculator",
    title: "RimWorld Calculator | ItemList",
    description:
      "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "RimWorld Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RimWorld Calculator | ItemList",
    description:
      "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
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
    <html lang="en" className="dark h-screen overflow-hidden">
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
              name: "RimWorld Calculator",
              url: SITE_URL,
              description:
                "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </head>
      <body className="antialiased h-screen overflow-hidden bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
