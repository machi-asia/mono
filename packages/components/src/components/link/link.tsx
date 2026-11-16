"use client";

import { useState, useEffect, type AnchorHTMLAttributes, type ReactNode } from "react";
import { resolveHref, resolveAppHref, type AppId, type LocalLinkOptions } from "@mono/app-config";
import "./link.css";

export type LinkVariant = "default" | "underline" | "ghost";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  external?: boolean;
  children?: ReactNode;
}

export function useResolvedHref(href: string | undefined, options?: LocalLinkOptions): string | undefined {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!href) return href;
  if (typeof options?.forceLocal === "boolean" || options?.currentHostname !== undefined) {
    return resolveHref(href, options);
  }
  if (!mounted) {
    return href;
  }
  return resolveHref(href);
}

export function Link({
  variant = "default",
  external = false,
  children,
  className,
  href,
  ...rest
}: LinkProps) {
  const resolvedHref = useResolvedHref(href);

  const classes = ["m-link"]
    .concat(`m-link--${variant}`)
    .concat(className ? [className] : [])
    .join(" ");

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a {...rest} href={resolvedHref} {...externalProps} className={classes} data-mono="link">
      {children}
      {external ? <span className="m-link-external" aria-hidden="true"> ↗</span> : null}
    </a>
  );
}

export { resolveHref, resolveAppHref, type AppId, type LocalLinkOptions };
