import type { Metadata, Viewport } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ThemeProvider, ToastProvider } from "@mono/components";
import { AdRail } from "../components/ads/ad-rail";
import { AdSenseScript } from "../components/ads/adsense-script";
import "reactflow/dist/style.css";
import "./calculator.css";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calculator.machi-asia.com";

const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "";
const adsenseConfigured =
  process.env.NODE_ENV === "production" &&
  !!ADSENSE_PUB_ID &&
  ADSENSE_PUB_ID !== "ca-pub-XXXXXXXXXXXXXXXX";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Game Production Calculator",
    template: "%s | Game Production Calculator",
  },
  description:
    "Free multi-game production and crafting recipe calculator for Satisfactory, Factorio, Minecraft, Dyson Sphere Program, and Little Rocket Lab. Plan factory rates, optimize recipes, and visualize dependency trees.",
  keywords: [
    "production calculator",
    "factory calculator",
    "crafting calculator",
    "recipe calculator",
    "satisfactory calculator",
    "factorio calculator",
    "dyson sphere program calculator",
    "minecraft crafting recipes",
    "factory rate planner",
    "recipe tree graph",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Game Production Calculator",
    title: "Game Production Calculator",
    description:
      "Free multi-game production and crafting recipe calculator for Satisfactory, Factorio, Minecraft, Dyson Sphere Program, and Little Rocket Lab.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Game Production Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Production Calculator",
    description:
      "Free multi-game production and crafting recipe calculator for Satisfactory, Factorio, Minecraft, Dyson Sphere Program, and Little Rocket Lab.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
  // Google-required account verification meta tag
  ...(adsenseConfigured && {
    other: { "google-adsense-account": ADSENSE_PUB_ID },
  }),
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
              <AuthGate>
                <div className="calc-app-shell">
                  {children}
                  <AdRail />
                </div>
              </AuthGate>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Game Production Calculator",
              url: SITE_URL,
              description:
                "Multi-game production and crafting recipe calculator for Satisfactory, Factorio, Minecraft, Dyson Sphere Program, and Little Rocket Lab.",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </body>
      {/* Script placed outside <body> — not in React's client hydration tree */}
      {adsenseConfigured && <AdSenseScript publisherId={ADSENSE_PUB_ID} />}
    </html>
  );
}
