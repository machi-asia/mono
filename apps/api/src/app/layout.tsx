import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@mono/auth";
import { ThemeProvider } from "@mono/components";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.machi-asia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Machi Asia API Service & Explorer",
    template: "%s | Machi Asia API",
  },
  description:
    "Centralized API microservice, endpoint explorer, real-time sync hub, and usage telemetry tracking for Machi Asia organization.",
  keywords: [
    "Machi Asia API",
    "API Explorer",
    "Rose AI API",
    "Realtime Sync API",
    "Usage Tracking",
    "Developer API",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Machi Asia API",
    title: "Machi Asia API Service & Explorer",
    description: "Centralized API gateway and interactive documentation explorer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Machi Asia API Service & Explorer",
    description: "Centralized API gateway and interactive documentation explorer.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
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
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
