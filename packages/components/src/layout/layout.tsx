"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "../tokens.css";
import "./layout.css";

type As = ElementType;

type Passthrough = Omit<HTMLAttributes<HTMLElement>, "style" | "children" | "as">;

export interface RowProps extends Passthrough {
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
  gap?: string | number;
  as?: As;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Row({
  align,
  justify,
  wrap = false,
  gap = "var(--space-4)",
  as,
  className,
  children,
  style,
  ...rest
}: RowProps) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      {...rest}
      className={className}
      data-mono="row"
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: wrap ? "wrap" : undefined,
        alignItems: align,
        justifyContent: justify,
        gap,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

const GRID_COLUMNS = 12;

export interface ColProps extends Passthrough {
  span?: number;
  offset?: number;
  as?: As;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Col({
  span,
  offset = 0,
  as,
  className,
  children,
  style,
  ...rest
}: ColProps) {
  const Tag = (as ?? "div") as ElementType;
  const width = span ? `${(span / GRID_COLUMNS) * 100}%` : undefined;
  const marginLeft = offset ? `${(offset / GRID_COLUMNS) * 100}%` : undefined;
  return (
    <Tag
      {...rest}
      className={className}
      data-mono="col"
      style={{
        flex: width ? `0 0 ${width}` : "1 1 0",
        maxWidth: width,
        marginLeft,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export interface CardProps extends Passthrough {
  elevated?: boolean;
  bordered?: boolean;
  padded?: boolean;
  as?: As;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Card({
  elevated = false,
  bordered = true,
  padded = true,
  as,
  className,
  children,
  style,
  ...rest
}: CardProps) {
  const Tag = (as ?? "section") as ElementType;
  const classes = ["m-card"]
    .concat(elevated ? "m-card-elevated" : [])
    .concat(bordered ? "m-card-bordered" : [])
    .concat(padded ? "m-card-padded" : [])
    .concat(className ? [className] : [])
    .join(" ");
  return (
    <Tag {...rest} className={classes} data-mono="card" style={style}>
      {children}
    </Tag>
  );
}
