"use client";

import { type AnchorHTMLAttributes, type ReactNode } from "react";
import "./link.css";

export type LinkVariant = "default" | "underline" | "ghost";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  external?: boolean;
  children?: ReactNode;
}

export function Link({
  variant = "default",
  external = false,
  children,
  className,
  ...rest
}: LinkProps) {
  const classes = ["m-link"]
    .concat(`m-link--${variant}`)
    .concat(className ? [className] : [])
    .join(" ");

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a {...rest} {...externalProps} className={classes} data-mono="link">
      {children}
      {external ? <span className="m-link-external" aria-hidden="true"> ↗</span> : null}
    </a>
  );
}
