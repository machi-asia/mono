import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Mod Calculator | ItemList",
  description: "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
  keywords: ["minecraft create mod", "create mod calculator", "kinetic power", "mechanical crafter", "itemlist"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    title: "Create Mod Calculator — ItemList",
    description: "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Create Mod Calculator — ItemList",
    description: "Kinetic automation, sequenced assembly, mechanical crafting, and throughput planner for Minecraft Create mod.",
  },
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-screen overflow-hidden">
      <head>
        <link rel="preconnect" href="https://raw.githubusercontent.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
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
