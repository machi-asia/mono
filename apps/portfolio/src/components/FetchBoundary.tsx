"use client";

import React, { ReactNode } from "react";
import Skeleton from "./Skeleton";

export interface FetchBoundaryProps {
  variant?: "card" | "table" | "text" | "rect" | "circle" | "avatar" | "button";
  loading: boolean;
  children?: ReactNode;
  fallback?: ReactNode;
  lines?: number;
  height?: string | number;
  width?: string | number;
  className?: string;
}

export default function FetchBoundary({
  variant = "card",
  loading,
  children,
  fallback,
  lines = 3,
  height,
  width,
  className = "",
}: FetchBoundaryProps) {
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className={`fetch-boundary-skeleton ${className}`}>
        <Skeleton variant={variant} lines={lines} height={height} width={width} />
      </div>
    );
  }

  return <>{children}</>;
}

export const componentVariants = [
  { label: "Card Loading Skeleton", props: { variant: "card" as const, loading: true } },
  { label: "Table Loading Skeleton", props: { variant: "table" as const, loading: true, lines: 4 } },
  { label: "Content Loaded State", props: { variant: "card" as const, loading: false, children: "Data Loaded Successfully" } },
];
