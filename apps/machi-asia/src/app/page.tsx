import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Showcase & Subscription Hub",
  description:
    "Discover and subscribe to Machi Asia products — the Game Production Calculator for factory games and Rose, your personal AI companion.",
};

export default function Home() {
  return (
    <main>
      <h1>Machi Asia</h1>
      <p>Showcase and subscription billing hub for Machi Asia products.</p>
    </main>
  );
}
