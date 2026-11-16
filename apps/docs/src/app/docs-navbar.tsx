"use client";

import { AuthNavbar } from "@mono/auth";

const links = [
  { label: "Docs Wiki", href: "/docs" },
  { label: "Components", href: "/components/components" },
  { label: "Scroll Sections", href: "/components/sections" },
  { label: "Presentation", href: "/components/presentation" },
  { label: "Auth", href: "/components/auth" },
  { label: "Database", href: "/components/database" },
  { label: "Rose", href: "/components/rose" },
  { label: "Sync", href: "/components/sync" },
];

export function DocsNavbar() {
  return (
    <AuthNavbar
      brand={<span>Machi Asia Docs</span>}
      links={links}
      showDisplayMenuItem
    />
  );
}
