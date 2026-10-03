"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@mono/components";
import { useAuth, AccountSettings, SignInModal } from "@mono/auth";

interface AppNavbarProps {
  currentPath?: string;
}

function getDisplayName(user: { email?: string | null; is_anonymous?: boolean; user_metadata?: Record<string, unknown> }): string {
  const meta = user.user_metadata ?? {};
  const candidates = [
    meta.name,
    meta.full_name,
    meta.user_name,
    meta.username,
    meta.preferred_username,
    user.email,
  ];
  const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
  if (found) return found as string;
  return user.is_anonymous ? "Guest" : "User";
}

function getAvatarUrl(user: { user_metadata?: Record<string, unknown> }): string | undefined {
  const meta = user.user_metadata ?? {};
  const candidates = [meta.avatar_url, meta.picture, meta.avatar, meta.photo_url];
  const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
  return found as string | undefined;
}

export function AppNavbar({ currentPath = "/" }: AppNavbarProps) {
  const { user, accounts, switchAccount, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const links = [
    { label: "Home", href: "/", active: currentPath === "/" },
    { label: "Portfolio", href: "/portfolio", active: currentPath === "/portfolio" },
    { label: "Calculator", href: "https://calculator.machi-asia.com" },
    { label: "Rose AI", href: "https://rose.machi-asia.com" },
    { label: "Docs", href: process.env.NEXT_PUBLIC_DOCS_URL || "/docs" },
  ];

  return (
    <>
      <Navbar
        variant="floating"
        brand={
          <Link href="/" style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ color: "var(--color-primary)", fontWeight: 800 }}>✦</span>
            <span>Machi Asia</span>
          </Link>
        }
        links={links}
        auth={
          user
            ? {
                name: getDisplayName(user),
                email: user.email ?? undefined,
                avatar: getAvatarUrl(user),
                accounts: (accounts ?? []).map((acc) => ({
                  id: acc.id,
                  name: acc.name || "User",
                  email: acc.email,
                  avatar: acc.avatar,
                  active: acc.id === user.id,
                })),
                onSwitchAccount: (id) => switchAccount?.(id),
                onAddAccount: () => setAddAccountOpen(true),
                menuItems: [
                  {
                    label: "Account settings",
                    onClick: () => setSettingsOpen(true),
                  },
                ],
                onSignOut: () => signOut(),
              }
            : undefined
        }
      />
      <AccountSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {addAccountOpen ? (
        <SignInModal
          onClose={() => setAddAccountOpen(false)}
          title="Add another account"
          subtitle="Sign in with your other credentials to switch seamlessly."
        />
      ) : null}
    </>
  );
}

export function AppFooter() {
  return (
    <Footer
      links={[
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Documentation", href: process.env.NEXT_PUBLIC_DOCS_URL || "/docs" },
        { label: "Calculator", href: "https://calculator.machi-asia.com" },
        { label: "Rose AI", href: "https://rose.machi-asia.com" },
      ]}
      copyright="© 2026 Machi Asia. All rights reserved."
    />
  );
}
