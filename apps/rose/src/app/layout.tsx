import type { Metadata, Viewport } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ToastProvider } from "@mono/components";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rose.machi-asia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rose AI",
    template: "%s | Rose AI",
  },
  description:
    "Chat with Rose, a custom AI companion with voice mode, long-term memory, and personalized conversations. Your private AI agent that remembers what matters to you.",
  keywords: [
    "AI companion",
    "AI agent",
    "AI chatbot",
    "AI assistant",
    "voice AI",
    "conversational AI",
    "personal AI assistant",
    "AI with memory",
    "custom AI agent",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Rose AI",
    title: "Rose AI",
    description:
      "Chat with Rose — a custom AI companion with voice mode, long-term memory, and personalized conversations. Free to try.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Rose AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rose AI",
    description:
      "Chat with Rose — a custom AI companion with voice mode, long-term memory, and personalized conversations. Free to try.",
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
              "@type": "WebApplication",
              name: "Rose AI",
              url: SITE_URL,
              description:
                "Custom AI companion with voice mode, long-term memory, and personalized conversations.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </body>
    </html>
  );
}
