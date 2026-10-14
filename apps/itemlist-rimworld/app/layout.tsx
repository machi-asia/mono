import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RimWorld Calculator | ItemList",
  description: "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
  keywords: ["rimworld calculator", "colony production", "fabrication bench", "recipe planner", "itemlist"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    title: "RimWorld Calculator — ItemList",
    description: "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RimWorld Calculator — ItemList",
    description: "Colony manufacturing, fabrication bench, bill management, and recipe throughput planner for RimWorld.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-screen overflow-hidden">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2144375932551709"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased h-screen overflow-hidden bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
