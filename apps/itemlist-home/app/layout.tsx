import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItemList | Game Production Calculator",
  description: "Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
  keywords: ["game calculator", "recipe planner", "production tree", "automation ratio", "create mod", "rimworld"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    title: "ItemList — Game Production Calculator",
    description: "Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ItemList — Game Production Calculator",
    description: "Interactive production planners, recipe dependency graphs, and throughput calculators for automation and survival games.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2144375932551709"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
