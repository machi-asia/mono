"use client";

import { useState } from "react";
import { Navbar } from "@mono/components";
import { useAuth, AccountSettings } from "@mono/auth";

const links = [
  { label: "Home", href: "/" },
  { label: "Auth", href: "/components/auth" },
  { label: "Components", href: "/components/components" },
  { label: "Database", href: "/components/database" },
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
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Navbar
        brand={<span>Machi Asia Docs</span>}
        links={links}
        auth={
          user
            ? {
                name: getDisplayName(user),
                avatar: getAvatarUrl(user),
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
    </>
  );
}
