import type { Metadata } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ThemeProvider, ToastProvider } from "@mono/components";
import { AdRail } from "../components/ads/ad-rail";
import { AdSenseScript } from "../components/ads/adsense-script";
import "reactflow/dist/style.css";
import "./calculator.css";

export const dynamic = "force-dynamic";

const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "";
const adsenseConfigured =
  process.env.NODE_ENV === "production" &&
  !!ADSENSE_PUB_ID &&
  ADSENSE_PUB_ID !== "ca-pub-XXXXXXXXXXXXXXXX";

export const metadata: Metadata = {
  title: "Game Production Calculator",
  description: "Multi-game production and crafting recipe calculator",
  // Google-required account verification meta tag
  ...(adsenseConfigured && {
    other: { "google-adsense-account": ADSENSE_PUB_ID },
  }),
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
      </body>
      {/* Script placed outside <body> — not in React's client hydration tree */}
      {adsenseConfigured && <AdSenseScript publisherId={ADSENSE_PUB_ID} />}
    </html>
  );
}
