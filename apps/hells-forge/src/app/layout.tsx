import type { Metadata, Viewport } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ThemeProvider, ToastProvider } from "@mono/components";
import "./forge.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forge.machi-asia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hell's Forge — 2D Multiplayer Exploration World",
    template: "%s | Hell's Forge",
  },
  description:
    "High-performance 2D multiplayer exploration space powered by Pixi.js, spatial circle collisions, WASD movement, and @mono/sync realtime synchronization.",
  keywords: [
    "hells forge",
    "2D multiplayer",
    "pixi.js",
    "game exploration",
    "circle collision",
    "wasd movement",
    "realtime sync",
    "redis",
    "machi asia",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Hell's Forge",
    title: "Hell's Forge — 2D Multiplayer Exploration World",
    description:
      "High-performance 2D multiplayer exploration space powered by Pixi.js, spatial circle collisions, and @mono/sync.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hell's Forge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hell's Forge — 2D Multiplayer Exploration World",
    description:
      "High-performance 2D multiplayer exploration space powered by Pixi.js, spatial circle collisions, and @mono/sync.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AuthGate>{children}</AuthGate>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Hell's Forge",
              url: SITE_URL,
              description:
                "Realtime collaborative blacksmithing and event synchronization room powered by Redis and @mono/sync.",
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
            }),
          }}
        />
      </body>
    </html>
  );
}
