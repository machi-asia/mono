"use client";

import React, { useState } from "react";

type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
    className?: string;
    isGlitching?: boolean;
}

export const componentVariants = [
    { label: "With Image", props: { src: "/icons/logo.svg", alt: "Avatar", fallback: "AJ" } },
    { label: "Fallback Only", props: { fallback: "AJ" } },
];

export default function Avatar({
    src,
    alt = "Avatar",
    fallback,
    size = "md",
    className = "",
    isGlitching = false,
}: AvatarProps) {
    const [hasError, setHasError] = useState(false);

    const sizeMap: Record<AvatarSize, { width: number; height: number }> = {
        sm: { width: 32, height: 32 },
        md: { width: 48, height: 48 },
        lg: { width: 64, height: 64 },
    };

    const dims = sizeMap[size];
    const fallbackText = fallback || alt.charAt(0).toUpperCase() || "?";

    return (
        <div
            className={`avatar-root avatar--${size} ${isGlitching ? "glitch-active" : ""} ${className}`.trim()}
            style={{ width: dims.width, height: dims.height }}
        >
            {src && !hasError ? (
                <img
                    className={`avatar-image ${isGlitching ? "glitch-image" : ""}`}
                    src={src}
                    alt={alt}
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="avatar-fallback">{fallbackText}</div>
            )}
        </div>
    );
}
