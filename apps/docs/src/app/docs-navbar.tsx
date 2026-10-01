"use client";

import { useState } from "react";
import { Navbar } from "@mono/components";
import { useAuth, AccountSettings, SignInModal } from "@mono/auth";

const links = [
  { label: "Home", href: "/" },
  { label: "Auth", href: "/components/auth" },
  { label: "Components", href: "/components/components" },
  { label: "Database", href: "/components/database" },
  { label: "Rose", href: "/components/rose" },
  { label: "Sync", href: "/components/sync" },
];

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

export function DocsNavbar() {
  const { user, accounts, switchAccount, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  return (
    <>
      <Navbar
        brand={<span>Machi Asia Docs</span>}
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
