"use client";

import { useContext, useState, type ReactNode } from "react";
import {
  Navbar,
  type NavbarAuthMenuItem,
  type NavbarLink,
  type NavbarVariant,
} from "@mono/components";
import type { UsageMetric } from "@mono/database";
import { AuthContext } from "../provider/provider";
import { AccountSettings, type TopLevelTab } from "../account-settings/account-settings";
import { SignInModal } from "../sign-in-modal/sign-in-modal";
import { UsageTracker } from "../usage/usage-tracker";
import { getUserProfileInfo } from "../../utils/user-profile";

export interface AuthNavbarMenuItem extends NavbarAuthMenuItem {
  /** Optional AccountSettings tab to open when clicked */
  settingsTab?: TopLevelTab;
}

export interface AuthNavbarProps {
  brand?: ReactNode;
  links?: NavbarLink[];
  actions?: ReactNode;
  variant?: NavbarVariant;
  /** Optional metric key to render a compact live `<UsageTracker variant="compact" />` pill in the navbar actions */
  usageMetric?: UsageMetric;
  /** Extra menu items appended to or replacing the default Account Settings menu items */
  extraMenuItems?: AuthNavbarMenuItem[];
  /** Include "Usage & Quotas" shortcut in the user dropdown (defaults to true) */
  showUsageMenuItem?: boolean;
  /** Include "Display & theme" shortcut in the user dropdown (defaults to false) */
  showDisplayMenuItem?: boolean;
  forceMobile?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Drop-in, auth-aware `<AuthNavbar />` that automatically connects `useAuth()` to `@mono/components`'s `<Navbar />`,
 * renders `<AccountSettings />` (with direct shortcuts to Profile, Usage & Quotas, and Display),
 * renders `<SignInModal />` for multi-account switching ("Add another account") or guest sign-in,
 * and optionally displays a live compact `<UsageTracker />` pill in the action bar.
 */
export function AuthNavbar({
  brand,
  links = [],
  actions,
  variant = "default",
  usageMetric,
  extraMenuItems = [],
  showUsageMenuItem = true,
  showDisplayMenuItem = false,
  forceMobile = false,
  className,
  style,
}: AuthNavbarProps) {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const accounts = auth?.accounts;
  const switchAccount = auth?.switchAccount;
  const signOut = auth?.signOut;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<TopLevelTab>("profile");
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const profile = getUserProfileInfo(user);

  const builtInMenuItems: NavbarAuthMenuItem[] = [
    {
      label: "Account settings",
      onClick: () => {
        setSettingsTab("profile");
        setSettingsOpen(true);
      },
    },
  ];

  if (showUsageMenuItem) {
    builtInMenuItems.push({
      label: "Usage & quotas",
      onClick: () => {
        setSettingsTab("usage");
        setSettingsOpen(true);
      },
    });
  }

  if (showDisplayMenuItem) {
    builtInMenuItems.push({
      label: "Display & theme",
      onClick: () => {
        setSettingsTab("display");
        setSettingsOpen(true);
      },
    });
  }

  for (const extra of extraMenuItems) {
    builtInMenuItems.push({
      label: extra.label,
      onClick: () => {
        if (extra.settingsTab) {
          setSettingsTab(extra.settingsTab);
          setSettingsOpen(true);
        }
        extra.onClick?.();
      },
    });
  }

  const combinedActions =
    usageMetric || actions ? (
      <>
        {usageMetric ? <UsageTracker metric={usageMetric} variant="compact" /> : null}
        {actions}
      </>
    ) : undefined;

  return (
    <>
      <Navbar
        brand={brand}
        links={links}
        actions={combinedActions}
        variant={variant}
        forceMobile={forceMobile}
        className={className}
        style={style}
        auth={
          user
            ? {
                name: profile.displayName,
                email: profile.email,
                avatar: profile.avatarUrl,
                accounts: (accounts ?? []).map((acc) => ({
                  id: acc.id,
                  name: acc.name || "User",
                  email: acc.email,
                  avatar: acc.avatar,
                  active: acc.id === user.id,
                })),
                onSwitchAccount: (id) => switchAccount?.(id),
                onAddAccount: () => setAddAccountOpen(true),
                menuItems: builtInMenuItems,
                onSignOut: () => signOut?.(),
              }
            : undefined
        }
      />
      {user ? (
        <AccountSettings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          initialTab={settingsTab}
        />
      ) : null}
      {addAccountOpen && auth ? (
        <SignInModal
          onClose={() => setAddAccountOpen(false)}
          title="Add another account"
          subtitle="Sign in with your other credentials to switch seamlessly."
        />
      ) : null}
    </>
  );
}
