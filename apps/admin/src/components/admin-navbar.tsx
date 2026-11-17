"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthNavbar } from "@mono/auth";
import { ShieldCheck } from "lucide-react";
import { getSitesByDomainGroup } from "../lib/site-registry";

export function AdminNavbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const links = [
    { label: "Overview", href: "/", active: pathname === "/" },
    { label: "Rose AI", href: "/rose", active: pathname.startsWith("/rose") },
    { label: "ItemList", href: "/itemlist", active: pathname.startsWith("/itemlist") },
    { label: "Calculator", href: "/calculator", active: pathname.startsWith("/calculator") },
    { label: "Hell's Forge", href: "/hells-forge", active: pathname.startsWith("/hells-forge") },
    { label: "Machi Hub", href: "/machi-asia", active: pathname.startsWith("/machi-asia") },
    { label: "Docs", href: "/docs", active: pathname.startsWith("/docs") },
  ];

  return (
    <AuthNavbar
      variant="floating"
      showUsageMenuItem
      showDisplayMenuItem
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
          <span style={{ color: "var(--color-primary)", display: "inline-flex" }}>
            <ShieldCheck size={20} />
          </span>
          <span style={{ fontWeight: 800 }}>Machi Asia Admin</span>
        </NextLink>
      }
      links={links}
      actions={
        <select
          aria-label="Jump to site admin page"
          className="admin-select"
          value={pathname === "/" ? "/" : pathname}
          onChange={(e) => {
            const dest = e.target.value;
            if (dest) router.push(dest);
          }}
        >
          <option value="/">All Sites (Global)</option>
          {getSitesByDomainGroup().map((section) => (
            <optgroup key={section.id} label={section.pattern}>
              {section.sites.map((site) => (
                <option key={site.id} value={site.adminPath}>
                  {site.name} ({site.domain})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      }
    />
  );
}
