import type { Metadata, Viewport } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ToastProvider } from "@mono/components";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://machi-asia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Machi Asia",
    template: "%s | Machi Asia",
  },
  description:
    "Machi Asia — home of the Game Production Calculator and the Rose AI companion. Discover, try, and subscribe to Machi Asia's suite of productivity tools and AI applications.",
  keywords: [
    "Machi Asia",
    "Machi Asia apps",
    "Game Production Calculator",
    "Rose AI",
    "AI companion",
    "productivity tools",
    "subscription hub",
    "software suite",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Machi Asia",
    title: "Machi Asia",
    description:
      "Home of the Game Production Calculator and the Rose AI companion — discover and subscribe to Machi Asia's suite of productivity tools.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Machi Asia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Machi Asia",
    description:
      "Home of the Game Production Calculator and the Rose AI companion — discover and subscribe to Machi Asia's suite of productivity tools.",
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
        <ToastProvider>
          <AuthProvider>
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Machi Asia",
              url: SITE_URL,
              description:
                "Home of the Game Production Calculator and the Rose AI companion — discover and subscribe to Machi Asia's productivity tools.",
            }),
          }}
        />
      </body>
    </html>
  );
}
