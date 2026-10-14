"use client";

import React, { useState } from "react";
import { Navbar as MonoNavbar } from "@mono/components";
import { useAuth, AccountSettings, SignInModal } from "@mono/auth";
import { profile } from "../data/profile";
import { GithubIcon, LinkedinIcon } from "./social-icons";

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

export interface NavbarProps {
  onContactOpen?: () => void;
}

export function Navbar({ onContactOpen }: NavbarProps) {
  const auth = useAuth();
  const user = auth?.user;
  const accounts = auth?.accounts;
  const switchAccount = auth?.switchAccount;
  const signOut = auth?.signOut;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "security" | "privacy" | "support">("profile");
  const [signInOpen, setSignInOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const links = [
    { label: "About", href: "#about" },
    { label: "Certificates", href: "#certificates" },
    { label: "Skills", href: "#skills" },
    { label: "Works", href: "#featured" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Reviews", href: "#visitors" },
    { label: "FAQ", href: "#faq" },
  ];

  const brand = (
    <a
      href="#"
      className="portfolio-nav-brand"
      style={{
        textDecoration: "none",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 700,
        color: "var(--foreground)",
      }}
    >
      AJDK
    </a>
  );

  const actions = (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0 0.25rem" }}>
      <a
        href={profile.socials.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        style={{ display: "inline-flex", color: "var(--color-text-muted, #a1a1aa)" }}
      >
        <GithubIcon size={18} />
      </a>
      <a
        href={profile.socials.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        style={{ display: "inline-flex", color: "var(--color-text-muted, #a1a1aa)" }}
      >
        <LinkedinIcon size={18} />
      </a>
      {!user ? (
        <button
          type="button"
          onClick={() => setSignInOpen(true)}
          style={{
            background: "none",
            border: "1px solid var(--color-border, rgba(255,255,255,0.15))",
            color: "var(--color-text, #fff)",
            borderRadius: "var(--radius-pill, 999px)",
            padding: "0.25rem 0.75rem",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: "0.25rem",
          }}
        >
          Sign in
        </button>
      ) : null}
    </div>
  );

  const authConfig = user
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
        onSwitchAccount: (id: string) => switchAccount?.(id),
        onAddAccount: () => setAddAccountOpen(true),
        menuItems: [
          {
            label: "Account settings",
            onClick: () => {
              setSettingsTab("profile");
              setSettingsOpen(true);
            },
          },
          ...(onContactOpen
            ? [
                {
                  label: "Contact Me",
                  onClick: onContactOpen,
                },
              ]
            : []),
        ],
        onSignOut: () => signOut?.(),
      }
    : undefined;

  return (
    <>
      <MonoNavbar
        variant="floating"
        brand={brand}
        links={links}
        actions={actions}
        auth={authConfig}
        className="portfolio-navbar"
      />
      <AccountSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab={settingsTab}
      />
      {signInOpen ? (
        <SignInModal
          onClose={() => setSignInOpen(false)}
        />
      ) : null}
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

export default Navbar;
