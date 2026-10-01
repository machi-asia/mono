"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useMotionMount } from "../motion/motion";
import "./navbar.css";

export interface NavbarLink {
  label: string;
  href?: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

const NAVBAR_DURATION = 160;

export interface NavbarAuthMenuItem {
  label: string;
  onClick?: () => void;
}

export interface NavbarAccount {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  active?: boolean;
}

export interface NavbarAuth {
  name: string;
  email?: string;
  avatar?: string;
  accounts?: NavbarAccount[];
  onSwitchAccount?: (accountId: string) => void;
  onAddAccount?: () => void;
  menuItems?: NavbarAuthMenuItem[];
  onSignOut?: () => void;
}

export type NavbarVariant = "default" | "tabs" | "compact" | "floating";

export interface NavbarProps {
  brand?: ReactNode;
  links?: NavbarLink[];
  actions?: ReactNode;
  auth?: NavbarAuth;
  variant?: NavbarVariant;
  className?: string;
  style?: React.CSSProperties;
}

function AvatarFallback({ name, className = "" }: { name: string; className?: string }) {
  const normalized = (name ?? "").trim();
  const initials = normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
  return <span className={`m-navbar-avatar-fallback ${className}`.trim()}>{initials}</span>;
}

export function Navbar({
  brand,
  links = [],
  actions,
  auth,
  variant = "default",
  className = "",
  style,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mounted, entered } = useMotionMount(menuOpen, NAVBAR_DURATION);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const navClasses = [
    "m-navbar",
    `m-navbar--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  const linksListRef = useRef<HTMLUListElement>(null);

  // Position indicator to hovered item, or fallback to active item if present
  const updateIndicatorToElement = (el: HTMLElement | null) => {
    if (!el || !linksListRef.current) {
      // Check if there is an active item to fallback to
      const activeEl = linksListRef.current?.querySelector<HTMLElement>(".m-navbar-link--active");
      if (activeEl && linksListRef.current) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
      return;
    }

    setIndicatorStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
  };

  useEffect(() => {
    // Initial sync with active link
    if (linksListRef.current) {
      const activeEl = linksListRef.current.querySelector<HTMLElement>(".m-navbar-link--active");
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      }
    }
  }, [links]);

  const effectiveAccounts: NavbarAccount[] =
    auth?.accounts && auth.accounts.length > 0
      ? auth.accounts
      : auth
        ? [
            {
              id: "current",
              name: auth.name,
              email: auth.email,
              avatar: auth.avatar,
              active: true,
            },
          ]
        : [];

  return (
    <nav className={navClasses} style={style} data-mono="navbar">
      <div className="m-navbar-inner">
        {brand ? <div className="m-navbar-brand">{brand}</div> : null}
        <ul
          ref={linksListRef}
          className="m-navbar-links"
          role={variant === "tabs" ? "tablist" : undefined}
          onMouseLeave={() => updateIndicatorToElement(null)}
        >
          <li
            className="m-navbar-indicator"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
            aria-hidden="true"
          />
          {links.map((link, idx) => {
            const isButton = Boolean(link.onClick && !link.href);
            const activeClass = link.active ? "m-navbar-link--active" : "";
            const linkClass = `m-navbar-link ${activeClass}`.trim();
            const itemKey = link.href || `${link.label}-${idx}`;

            return (
              <li key={itemKey} role={variant === "tabs" ? "presentation" : undefined}>
                {isButton ? (
                  <button
                    type="button"
                    className={linkClass}
                    onClick={link.onClick}
                    onMouseEnter={(e) => updateIndicatorToElement(e.currentTarget)}
                    role={variant === "tabs" ? "tab" : "button"}
                    aria-selected={variant === "tabs" ? Boolean(link.active) : undefined}
                  >
                    {link.icon ? <span className="m-navbar-link-icon">{link.icon}</span> : null}
                    <span>{link.label}</span>
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className={linkClass}
                    onClick={link.onClick}
                    onMouseEnter={(e) => updateIndicatorToElement(e.currentTarget)}
                  >
                    {link.icon ? <span className="m-navbar-link-icon">{link.icon}</span> : null}
                    <span>{link.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <div className="m-navbar-actions">
          {actions}
          {auth ? (
            <div ref={menuRef} className="m-navbar-auth">
              <button
                type="button"
                className="m-navbar-auth-trigger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {auth.avatar ? (
                  <img src={auth.avatar} alt={auth.name} className="m-navbar-avatar" />
                ) : (
                  <AvatarFallback name={auth.name} />
                )}
                <span className="m-navbar-auth-name">{auth.name}</span>
                <span className="m-navbar-auth-chevron" aria-hidden="true">▾</span>
              </button>
              {mounted ? (
                <div className={`m-navbar-auth-menu ${entered ? "m-navbar-auth-menu--entered" : ""}`} role="menu">
                  <div className="m-navbar-auth-menu-header">
                    {auth.avatar ? (
                      <img src={auth.avatar} alt="" className="m-navbar-auth-menu-avatar" />
                    ) : (
                      <AvatarFallback name={auth.name} />
                    )}
                    <div className="m-navbar-auth-menu-userinfo">
                      <span className="m-navbar-auth-menu-name">{auth.name}</span>
                      {auth.email ? <span className="m-navbar-auth-menu-email">{auth.email}</span> : null}
                    </div>
                  </div>
                  {effectiveAccounts.length > 0 ? (
                    <>
                      <div className="m-navbar-auth-menu-divider" />
                      <div className="m-navbar-auth-section-title">Switch Account</div>
                      <div className="m-navbar-auth-accounts" role="group" aria-label="Switch account">
                        {effectiveAccounts.map((acc) => {
                          const isCurrent = Boolean(acc.active);
                          return (
                            <button
                              key={acc.id}
                              type="button"
                              className={`m-navbar-auth-account-item ${isCurrent ? "m-navbar-auth-account-item--active" : ""}`}
                              role="menuitem"
                              disabled={isCurrent}
                              onClick={() => {
                                setMenuOpen(false);
                                auth.onSwitchAccount?.(acc.id);
                              }}
                            >
                              {acc.avatar ? (
                                <img src={acc.avatar} alt="" className="m-navbar-auth-account-avatar" />
                              ) : (
                                <AvatarFallback name={acc.name} className="m-navbar-auth-account-avatar" />
                              )}
                              <div className="m-navbar-auth-account-meta">
                                <span className="m-navbar-auth-account-name">{acc.name}</span>
                                {acc.email ? (
                                  <span className="m-navbar-auth-account-email">{acc.email}</span>
                                ) : null}
                              </div>
                              {isCurrent ? (
                                <span className="m-navbar-auth-account-badge" aria-label="Current account">✓</span>
                              ) : null}
                            </button>
                          );
                        })}
                        {auth.onAddAccount ? (
                          <button
                            type="button"
                            className="m-navbar-auth-add-btn"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              auth.onAddAccount?.();
                            }}
                          >
                            <span className="m-navbar-auth-add-icon" aria-hidden="true">+</span>
                            <span>Add another account</span>
                          </button>
                        ) : null}
                      </div>
                    </>
                  ) : auth.onAddAccount ? (
                    <>
                      <div className="m-navbar-auth-menu-divider" />
                      <button
                        type="button"
                        className="m-navbar-auth-add-btn"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          auth.onAddAccount?.();
                        }}
                      >
                        <span className="m-navbar-auth-add-icon" aria-hidden="true">+</span>
                        <span>Add another account</span>
                      </button>
                    </>
                  ) : null}
                  <div className="m-navbar-auth-menu-divider" />
                  {auth.menuItems?.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      className="m-navbar-auth-menu-item"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        item.onClick?.();
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                  {auth.menuItems?.length ? (
                    <div className="m-navbar-auth-menu-divider" />
                  ) : null}
                  <button
                    type="button"
                    className="m-navbar-auth-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      auth.onSignOut?.();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
