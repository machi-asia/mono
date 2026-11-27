import type { Metadata, Viewport } from "next";
import { MonoAppShell } from "@mono/auth";
import "./quicknote.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://notes.machi.asia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Machi Notes — Graph-Linked Markdown Workspace",
    template: "%s | Machi Notes",
  },
  description:
    "Hierarchical tabbed markdown notebook with live wikilink backlinks, force-directed knowledge graph visualization, AI drafting, and Supabase synchronization.",
  keywords: [
    "Machi Notes",
    "QuickNote",
    "Markdown knowledge graph",
    "PKM workspace",
    "bidirectional links",
    "zettel notes",
    "machi asia",
  ],
  authors: [{ name: "Machi Asia" }],
  creator: "Machi Asia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Machi Notes",
    title: "Machi Notes — Graph-Linked Markdown Workspace",
    description:
      "Connect ideas with nested markdown folders, tabbed split preview, wikilink relations, and an interactive force graph.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Machi Notes Workspace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Machi Notes — Graph-Linked Markdown Workspace",
    description:
      "Connect ideas with nested markdown folders, tabbed split preview, wikilink relations, and an interactive force graph.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
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
      <body className="qn-body">
        <MonoAppShell defaultTheme="dark">{children}</MonoAppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Machi Notes",
              url: SITE_URL,
              description:
                "Graph-linked hierarchical markdown notebook with tabbed editing, split preview, and AI drafting.",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </body>
    </html>
  );
}
