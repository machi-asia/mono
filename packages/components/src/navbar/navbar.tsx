"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useMotionMount } from "../motion/motion";
import "./navbar.css";

export interface NavbarLink {
  label: string;
  href?: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
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
  forceMobile?: boolean;
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
  forceMobile = false,
  className = "",
  style,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mounted, entered } = useMotionMount(menuOpen, NAVBAR_DURATION);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAuthOpen, setMobileAuthOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { mounted: mobileMounted, entered: mobileEntered } = useMotionMount(mobileOpen, NAVBAR_DURATION);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (menuOpen) setMenuOpen(false);
        if (mobileOpen) setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      setMobileAuthOpen(false);
    }
  }, [mobileOpen]);

  const navClasses = [
    "m-navbar",
    `m-navbar--${variant}`,
    forceMobile ? "m-navbar--mobile-forced" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasNavLinksOrActions = (links && links.length > 0) || Boolean(actions) || Boolean(auth);

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
                    className="m-navbar-auth-menu-item m-navbar-auth-menu-item--signout"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      auth.onSignOut?.();
                    }}
                  >
                    <LogOut size={15} aria-hidden="true" className="m-navbar-signout-icon" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {hasNavLinksOrActions ? (
          <button
            ref={burgerRef}
            type="button"
            className={`m-navbar-burger ${mobileOpen ? "m-navbar-burger--open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="m-navbar-mobile-menu"
          >
            <span className="m-navbar-burger-box" aria-hidden="true">
              <span className="m-navbar-burger-bar" />
              <span className="m-navbar-burger-bar" />
              <span className="m-navbar-burger-bar" />
            </span>
          </button>
        ) : null}

        {mobileMounted && hasNavLinksOrActions ? (
          <div
            id="m-navbar-mobile-menu"
            ref={mobileMenuRef}
            className={`m-navbar-mobile-menu ${mobileEntered ? "m-navbar-mobile-menu--entered" : ""}`}
            role="dialog"
            aria-label="Navigation menu"
          >
            {links && links.length > 0 ? (
              <ul className="m-navbar-mobile-links">
                {links.map((link, idx) => {
                  const isButton = Boolean(link.onClick && !link.href);
                  const activeClass = link.active ? "m-navbar-mobile-link--active" : "";
                  const linkClass = `m-navbar-mobile-link ${activeClass}`.trim();
                  const itemKey = link.href || `${link.label}-${idx}`;

                  return (
                    <li key={itemKey}>
                      {isButton ? (
                        <button
                          type="button"
                          className={linkClass}
                          onClick={link.onClick}
                        >
                          {link.icon ? <span className="m-navbar-link-icon">{link.icon}</span> : null}
                          <span>{link.label}</span>
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className={linkClass}
                          onClick={(e) => {
                            setMobileOpen(false);
                            link.onClick?.(e);
                          }}
                        >
                          {link.icon ? <span className="m-navbar-link-icon">{link.icon}</span> : null}
                          <span>{link.label}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {actions ? (
              <>
                {links && links.length > 0 ? <div className="m-navbar-mobile-divider" /> : null}
                <div className="m-navbar-mobile-actions" onClick={() => setMobileOpen(false)}>
                  {actions}
                </div>
              </>
            ) : null}

            {auth ? (
              <>
                {(links && links.length > 0) || actions ? (
                  <div className="m-navbar-mobile-divider" />
                ) : null}
                <div className="m-navbar-mobile-auth">
                  <button
                    type="button"
                    className={`m-navbar-mobile-auth-trigger ${mobileAuthOpen ? "m-navbar-mobile-auth-trigger--open" : ""}`}
                    onClick={() => setMobileAuthOpen(!mobileAuthOpen)}
                    aria-expanded={mobileAuthOpen}
                    aria-haspopup="true"
                  >
                    <div className="m-navbar-mobile-auth-trigger-user">
                      {auth.avatar ? (
                        <img src={auth.avatar} alt={auth.name} className="m-navbar-avatar" />
                      ) : (
                        <AvatarFallback name={auth.name} />
                      )}
                      <span className="m-navbar-mobile-auth-trigger-name">{auth.name}</span>
                    </div>
                    <span className="m-navbar-auth-chevron" aria-hidden="true">
                      {mobileAuthOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  {mobileAuthOpen ? (
                    <div className="m-navbar-mobile-auth-dropdown">
                      {auth.email ? (
                        <div className="m-navbar-mobile-auth-email">{auth.email}</div>
                      ) : null}

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
                                    setMobileOpen(false);
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
                          </div>
                        </>
                      ) : null}

                      {auth.onAddAccount ? (
                        <button
                          type="button"
                          className="m-navbar-auth-add-btn"
                          role="menuitem"
                          onClick={() => {
                            setMobileOpen(false);
                            auth.onAddAccount?.();
                          }}
                        >
                          <span className="m-navbar-auth-add-icon" aria-hidden="true">+</span>
                          <span>Add another account</span>
                        </button>
                      ) : null}

                      {auth.menuItems?.length ? (
                        <div className="m-navbar-auth-menu-divider" />
                      ) : null}

                      {auth.menuItems?.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          className="m-navbar-mobile-menu-item"
                          role="menuitem"
                          onClick={() => {
                            setMobileOpen(false);
                            item.onClick?.();
                          }}
                        >
                          {item.label}
                        </button>
                      ))}

                      <div className="m-navbar-auth-menu-divider" />

                      <button
                        type="button"
                        className="m-navbar-mobile-menu-item m-navbar-mobile-menu-item--signout"
                        role="menuitem"
                        onClick={() => {
                          setMobileOpen(false);
                          auth.onSignOut?.();
                        }}
                      >
                        <LogOut size={15} aria-hidden="true" className="m-navbar-signout-icon" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
