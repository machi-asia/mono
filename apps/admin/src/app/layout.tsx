import type { Metadata, Viewport } from "next";
import { MonoAppShell } from "@mono/auth";
import { AdminNavbar } from "../components/admin-navbar";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://admin.machi.asia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Machi Asia Admin",
    template: "%s | Machi Asia Admin",
  },
  description:
    "Unified Machi Asia administration portal for monitoring active users, guests, traffic origins, API quotas, Redis-backed Rose AI chats, user roles, and per-site portals.",
  keywords: [
    "Machi Asia Admin",
    "admin portal",
    "visitor analytics",
    "Rose AI monitoring",
    "usage quotas",
    "role management",
    "ItemList moderation",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Machi Asia Admin",
    title: "Machi Asia Admin",
    description:
      "Unified Machi Asia administration portal for user/guest origin tracking, quota management, Rose AI chat monitoring, and per-site administration.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Machi Asia Admin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Machi Asia Admin",
    description:
      "Unified Machi Asia administration portal for user/guest origin tracking, quota management, Rose AI chat monitoring, and per-site administration.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0a",
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
        <MonoAppShell requireAuth header={<AdminNavbar />}>
          {children}
        </MonoAppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Machi Asia Admin",
              url: SITE_URL,
              description:
                "Unified Machi Asia administration portal for user and guest monitoring, origin analytics, role management, and Rose AI inspection.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any",
            }),
          }}
        />
      </body>
    </html>
  );
}
