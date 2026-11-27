import type { Metadata, Viewport } from "next";
import { MonoAppShell } from "@mono/auth";
import "./uoweme.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uoweme.machi.asia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "U Owe Me — Social Ledger & Smart Expense Settlement",
    template: "%s | U Owe Me",
  },
  description:
    "Track peer-to-peer IOUs, view net contact balances in PHP/USD, trigger one-click batch checkouts, and generate shareable ledger statements.",
  keywords: [
    "U Owe Me",
    "UOweMe",
    "debt tracker",
    "IOU ledger",
    "group expense settlement",
    "bill split tracker",
    "machi asia",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "U Owe Me",
    title: "U Owe Me — Social Ledger & Smart Expense Settlement",
    description:
      "Clear shared tabs faster with netted per-contact balances, overdue reminders, and itemized settlement links.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "U Owe Me Social Ledger" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "U Owe Me — Social Ledger & Smart Expense Settlement",
    description:
      "Clear shared tabs faster with netted per-contact balances, overdue reminders, and itemized settlement links.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
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
      <body className="uow-body">
        <MonoAppShell defaultTheme="dark">{children}</MonoAppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "U Owe Me",
              url: SITE_URL,
              description:
                "Peer-to-peer IOU ledger and shared expense settlement tracker powered by Supabase.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </body>
    </html>
  );
}
