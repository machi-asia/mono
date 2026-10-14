"use client";

import React from "react";
import { Skeleton as MonoSkeleton, SkeletonCard, SkeletonText } from "@mono/components";

export interface SkeletonProps {
  variant?: "card" | "table" | "text" | "rect" | "circle" | "avatar" | "button";
  lines?: number;
  height?: string | number;
  width?: string | number;
  className?: string;
}

export default function Skeleton({
  variant = "rect",
  lines = 3,
  height,
  width,
  className = "",
}: SkeletonProps) {
  if (variant === "card") {
    return <SkeletonCard lines={lines} className={className} />;
  }
  if (variant === "text") {
    return <SkeletonText lines={lines} className={className} />;
  }
  if (variant === "circle" || variant === "avatar") {
    return (
      <MonoSkeleton
        variant="circular"
        width={width || 40}
        height={height || 40}
        className={className}
      />
    );
  }
  return (
    <MonoSkeleton
      variant="rectangular"
      width={width || "100%"}
      height={height || 48}
      className={className}
    />
  );
}
