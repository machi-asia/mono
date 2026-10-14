import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const minecraftFont = localFont({
  src: "./fonts/Minecraft.ttf",
  variable: "--font-minecraft",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://create.itemlist.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Create Mod Calculator | ItemList",
    template: "%s | Create Mod Calculator",
  },
  description:
    "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
  keywords: [
    "minecraft create mod",
    "create mod calculator",
    "kinetic power",
    "mechanical crafter",
    "sequenced assembly",
    "itemlist",
    "minecraft recipes",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Create Mod Calculator",
    title: "Create Mod Calculator | ItemList",
    description:
      "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Create Mod Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Mod Calculator | ItemList",
    description:
      "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
  referrer: "no-referrer",
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
    <html lang="en" className={`dark h-screen overflow-hidden ${minecraftFont.variable} ${minecraftFont.className}`}>
      <head>
        <link rel="preconnect" href="https://raw.githubusercontent.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
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
              name: "Create Mod Calculator",
              url: SITE_URL,
              description:
                "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
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
