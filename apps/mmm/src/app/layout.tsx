import type { Metadata, Viewport } from "next";
import { MonoAppShell } from "@mono/auth";
import "./mmm.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mmm.machi.asia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MMM — Collaborative Minecraft Mod Manager",
    template: "%s | MMM",
  },
  description:
    "Organization-based Minecraft modpack manager with Modrinth v2 integration, SHA-1 local .jar matching, orphaned dependency cleanup, and version-controlled mod history.",
  keywords: [
    "MMM",
    "Minecraft Mod Manager",
    "Modrinth modpack manager",
    "Fabric modpack collaboration",
    "Minecraft SMP mod list",
    "mod version control",
    "machi asia",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MMM — Minecraft Mod Manager",
    title: "MMM — Collaborative Minecraft Mod Manager",
    description:
      "Manage SMP modpacks together with Modrinth search, dependency resolution, and sequential modpack downloads.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MMM — Minecraft Mod Manager" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MMM — Collaborative Minecraft Mod Manager",
    description:
      "Manage SMP modpacks together with Modrinth search, dependency resolution, and sequential modpack downloads.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
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
      <body className="mmm-body">
        <MonoAppShell defaultTheme="dark">{children}</MonoAppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Minecraft Mod Manager (MMM)",
              url: SITE_URL,
              description:
                "Collaborative Minecraft organization modpack manager with Modrinth API integration and version control.",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </body>
    </html>
  );
}
