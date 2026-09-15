import type { Metadata, Viewport } from "next";
import { AuthProvider, AuthGate } from "@mono/auth";
import { ThemeProvider } from "@mono/components";
import { DocsNavbar } from "./docs-navbar";
import "./global.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.machi-asia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Machi Asia Docs",
    template: "%s | Machi Asia Docs",
  },
  description:
    "Developer documentation and user manuals for Machi Asia products. Explore the design system, shared React UI components, authentication, database packages, and the Rose AI agent library.",
  keywords: [
    "Machi Asia docs",
    "component library",
    "design system",
    "React components",
    "UI library documentation",
    "developer reference",
    "API documentation",
    "auth components",
    "Rose AI documentation",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Machi Asia Docs",
    title: "Machi Asia Docs",
    description:
      "Developer documentation and user manuals for Machi Asia products — component library, design system, and API references.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Machi Asia Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Machi Asia Docs",
    description:
      "Developer documentation and user manuals for Machi Asia products — component library, design system, and API references.",
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
          <AuthProvider>
            <DocsNavbar />
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Machi Asia Docs",
              url: SITE_URL,
              description:
                "Developer documentation and user manuals for Machi Asia products — component library, design system, and API references.",
            }),
          }}
        />
      </body>
    </html>
  );
}
