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

export interface NavbarAuth {
  name: string;
  avatar?: string;
  menuItems?: NavbarAuthMenuItem[];
  onSignOut?: () => void;
}

export type NavbarVariant = "default" | "tabs" | "compact";

export interface NavbarProps {
  brand?: ReactNode;
  links?: NavbarLink[];
  actions?: ReactNode;
  auth?: NavbarAuth;
  variant?: NavbarVariant;
  className?: string;
  style?: React.CSSProperties;
}

function AvatarFallback({ name }: { name: string }) {
  const normalized = (name ?? "").trim();
  const initials = normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
  return <span className="m-navbar-avatar-fallback">{initials}</span>;
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

  return (
    <nav className={navClasses} style={style} data-mono="navbar">
      <div className="m-navbar-inner">
        {brand ? <div className="m-navbar-brand">{brand}</div> : null}
        <ul className="m-navbar-links" role={variant === "tabs" ? "tablist" : undefined}>
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
                    <span className="m-navbar-auth-menu-name">{auth.name}</span>
                  </div>
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
