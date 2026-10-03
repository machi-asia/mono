"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "../tokens.css";
import "./skeleton.css";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | "none";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  count?: number;
  gap?: string | number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function formatDimension(value?: string | number): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function Skeleton({
  variant = "text",
  animation = "pulse",
  width,
  height,
  borderRadius,
  count = 1,
  gap = "var(--space-2)",
  as,
  className,
  style,
  children,
  role,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-busy": ariaBusy,
  ...rest
}: SkeletonProps) {
  const Tag = (as ?? (variant === "text" ? "span" : "div")) as ElementType;

  const resolvedWidth = formatDimension(width);
  const resolvedHeight = formatDimension(
    height ?? (variant === "circular" ? width : undefined)
  );
  const resolvedBorderRadius = formatDimension(borderRadius);

  const classes = [
    "m-skeleton",
    `m-skeleton--${variant}`,
    `m-skeleton--${animation}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const combinedStyle: CSSProperties = {
    width: resolvedWidth,
    height: resolvedHeight,
    borderRadius: resolvedBorderRadius,
    ...style,
  };

  const defaultRole = ariaHidden ? undefined : role ?? "status";
  const defaultAriaBusy = ariaHidden ? undefined : (ariaBusy ?? "true");
  const defaultAriaLabel = ariaHidden ? undefined : (ariaLabel || "Loading");

  if (count > 1) {
    return (
      <div
        className="m-skeleton-group"
        style={{ gap: formatDimension(gap) }}
        role={defaultRole}
        aria-label={defaultAriaLabel}
        aria-busy={defaultAriaBusy}
        aria-hidden={ariaHidden}
        data-mono="skeleton-group"
      >
        {Array.from({ length: count }).map((_, index) => (
          <Tag
            key={index}
            {...rest}
            className={classes}
            style={combinedStyle}
            aria-hidden="true"
            data-mono="skeleton"
          >
            {children}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <Tag
      {...rest}
      className={classes}
      style={combinedStyle}
      role={defaultRole}
      aria-label={defaultAriaLabel}
      aria-busy={defaultAriaBusy}
      aria-hidden={ariaHidden}
      data-mono="skeleton"
    >
      {children}
    </Tag>
  );
}

export interface SkeletonTextProps {
  lines?: number;
  gap?: string | number;
  lastLineWidth?: string | number;
  lineHeight?: string | number;
  animation?: SkeletonAnimation;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonText({
  lines = 3,
  gap = "var(--space-2)",
  lastLineWidth = "60%",
  lineHeight = "1rem",
  animation = "pulse",
  className,
  style,
}: SkeletonTextProps) {
  return (
    <div
      className={`m-skeleton-group ${className || ""}`}
      style={{ gap: formatDimension(gap), ...style }}
      role="status"
      aria-label="Loading text"
      aria-busy="true"
      data-mono="skeleton-text"
    >
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        const width = isLast && lines > 1 ? lastLineWidth : "100%";
        return (
          <Skeleton
            key={index}
            variant="text"
            animation={animation}
            width={width}
            height={lineHeight}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export interface SkeletonCircleProps {
  size?: string | number;
  animation?: SkeletonAnimation;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonCircle({
  size = 40,
  animation = "pulse",
  className,
  style,
}: SkeletonCircleProps) {
  const dimension = formatDimension(size);
  return (
    <Skeleton
      variant="circular"
      animation={animation}
      width={dimension}
      height={dimension}
      className={className}
      style={style}
    />
  );
}

export interface SkeletonButtonProps {
  size?: "sm" | "md" | "lg";
  width?: string | number;
  animation?: SkeletonAnimation;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonButton({
  size = "md",
  width,
  animation = "pulse",
  className,
  style,
}: SkeletonButtonProps) {
  const classes = ["m-skeleton-button", `m-skeleton-button--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Skeleton
      variant="rounded"
      animation={animation}
      width={width}
      className={classes}
      style={style}
    />
  );
}

export interface SkeletonCardProps {
  hasImage?: boolean;
  imageHeight?: string | number;
  hasHeader?: boolean;
  hasAvatar?: boolean;
  lines?: number;
  hasActions?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonCard({
  hasImage = false,
  imageHeight = 160,
  hasHeader = true,
  hasAvatar = false,
  lines = 3,
  hasActions = false,
  animation = "pulse",
  className,
  style,
}: SkeletonCardProps) {
  return (
    <div
      className={`m-skeleton-card ${className || ""}`}
      style={style}
      role="status"
      aria-label="Loading card content"
      aria-busy="true"
      data-mono="skeleton-card"
    >
      {hasImage && (
        <Skeleton
          variant="rounded"
          animation={animation}
          width="100%"
          height={imageHeight}
          aria-hidden="true"
        />
      )}

      {hasHeader && (
        <div className="m-skeleton-card-header" aria-hidden="true">
          {hasAvatar && (
            <SkeletonCircle size={36} animation={animation} aria-hidden="true" />
          )}
          <div style={{ flex: 1 }}>
            <Skeleton
              variant="text"
              animation={animation}
              width="50%"
              height="1.1rem"
              aria-hidden="true"
            />
            <Skeleton
              variant="text"
              animation={animation}
              width="30%"
              height="0.8rem"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {lines > 0 && (
        <div className="m-skeleton-card-body" aria-hidden="true">
          <SkeletonText lines={lines} animation={animation} aria-hidden="true" />
        </div>
      )}

      {hasActions && (
        <div className="m-skeleton-card-actions" aria-hidden="true">
          <SkeletonButton size="sm" width={80} animation={animation} aria-hidden="true" />
          <SkeletonButton size="sm" width={60} animation={animation} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
