import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItemList | Admin Portal",
  description: "Administrative moderation and issue reports oversight for ItemList calculators.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark min-h-screen">
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
