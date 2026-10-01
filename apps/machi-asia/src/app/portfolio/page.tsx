import type { Metadata } from "next";
import { AppNavbar, AppFooter } from "../../components/app-nav";
import { PortfolioClient } from "./portfolio-client";

export const metadata: Metadata = {
  title: "Portfolio & Engineering Works",
  description:
    "Explore the portfolio, full-stack architecture, distributed systems, and modern web applications developed by Machi Asia.",
};

export default function PortfolioPage() {
  return (
    <div className="machi-page">
      <AppNavbar currentPath="/portfolio" />
      <PortfolioClient />
      <AppFooter />
    </div>
  );
}
