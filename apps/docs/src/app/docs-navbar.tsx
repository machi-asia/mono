"use client";

import { useRouter } from "next/navigation";
import { AuthNavbar } from "@mono/auth";
import { Dropdown } from "@mono/components";

const links = [{ label: "Docs Wiki", href: "/docs" }];

const FRAMEWORK_ITEMS = [
  { value: "/components/components", label: "Components" },
  { value: "/components/sections", label: "Scroll Sections" },
  { value: "/components/presentation", label: "Presentation" },
  { value: "/components/auth", label: "Auth" },
  { value: "/components/database", label: "Database" },
  { value: "/components/rose", label: "Rose" },
  { value: "/components/sync", label: "Sync" },
];

export function DocsNavbar() {
  const router = useRouter();

  return (
    <AuthNavbar
      brand={<span>Machi Asia Docs</span>}
      links={links}
      actions={
        <Dropdown
          placeholder="Framework"
          items={FRAMEWORK_ITEMS}
          onChange={(value: string) => router.push(value)}
        />
      }
      showDisplayMenuItem
    />
  );
}
