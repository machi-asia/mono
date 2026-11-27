"use client";

import NextLink from "next/link";
import { Footer, resolveHref } from "@mono/components";
import { AuthNavbar } from "@mono/auth";

interface AppNavbarProps {
  currentPath?: string;
}

export function AppNavbar({ currentPath = "/" }: AppNavbarProps) {
  const docsHref = resolveHref(process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.machi.asia");

  const links = [
    { label: "Home", href: "/", active: currentPath === "/" },
    { label: "Portfolio", href: "/portfolio", active: currentPath === "/portfolio" },
    { label: "Calculator", href: resolveHref("https://calculator.machi-asia.com") },
    { label: "TerraPrice", href: resolveHref("https://terraprice.machi.asia") },
    { label: "MMM", href: resolveHref("https://mmm.machi.asia") },
    { label: "Notes", href: resolveHref("https://notes.machi.asia") },
    { label: "UOweMe", href: resolveHref("https://uoweme.machi.asia") },
    { label: "Rose AI", href: resolveHref("https://rose.machi-asia.com") },
    { label: "Docs", href: docsHref },
  ];

  return (
    <AuthNavbar
      variant="floating"
      brand={
        <NextLink
          href="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span style={{ color: "var(--color-primary)", fontWeight: 800 }}>✦</span>
          <span>Machi Asia</span>
        </NextLink>
      }
      links={links}
    />
  );
}

export function AppFooter() {
  const docsHref = resolveHref(process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.machi.asia");

  return (
    <Footer
      links={[
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Documentation", href: docsHref },
        { label: "Calculator", href: resolveHref("https://calculator.machi-asia.com") },
        { label: "TerraPrice", href: resolveHref("https://terraprice.machi.asia") },
        { label: "MMM", href: resolveHref("https://mmm.machi.asia") },
        { label: "Notes", href: resolveHref("https://notes.machi.asia") },
        { label: "UOweMe", href: resolveHref("https://uoweme.machi.asia") },
        { label: "Rose AI", href: resolveHref("https://rose.machi-asia.com") },
      ]}
      copyright="© 2026 Machi Asia. All rights reserved."
    />
  );
}
