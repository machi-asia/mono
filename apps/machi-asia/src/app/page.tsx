import type { Metadata } from "next";
import { AppNavbar, AppFooter } from "../components/app-nav";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "Product Showcase & Subscription Hub",
  description:
    "Discover and subscribe to Machi Asia products — the Game Production Calculator for factory games and Rose, your personal AI companion.",
};

export default function Home() {
  return (
    <div className="machi-page">
      <AppNavbar currentPath="/" />
      <HomeClient />
      <AppFooter />
    </div>
  );
}
