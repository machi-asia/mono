"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = ["m-btn"]
    .concat(`m-btn--${variant}`)
    .concat(`m-btn--${size}`)
    .concat(loading ? "m-btn--loading" : [])
    .concat(!icon && children ? [] : [])
    .concat(className ? [className] : [])
    .join(" ");

  return (
    <button
      {...rest}
      className={classes}
      disabled={disabled || loading}
      data-mono="button"
    >
      {loading ? <span className="m-btn-spinner" aria-hidden="true" /> : null}
      {icon && !loading ? <span className="m-btn-icon">{icon}</span> : null}
      {children ? <span className="m-btn-label">{children}</span> : null}
    </button>
  );
}
