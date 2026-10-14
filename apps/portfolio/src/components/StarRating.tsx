"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export type StarRatingVariant = "display" | "interactive" | "compact";
export type StarRatingSize = "sm" | "md" | "lg";

export interface StarRatingProps {
    variant?: StarRatingVariant;
    rating?: number;
    maxStars?: number;
    size?: StarRatingSize;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export const componentVariants = [
    { label: "Display", props: { variant: "display" as const, rating: 5, size: "md" as const } },
    { label: "Interactive", props: { variant: "interactive" as const, rating: 4, size: "lg" as const } },
    { label: "Compact", props: { variant: "compact" as const, rating: 4.5, size: "sm" as const } },
];

export default function StarRating({
    variant = "display",
    rating = 5,
    maxStars = 5,
    size = "md",
    onRatingChange,
    className = "",
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const activeRating = hoverRating !== null ? hoverRating : rating;
    const isInteractive = variant === "interactive" && Boolean(onRatingChange);

    const sizePxMap: Record<StarRatingSize, number> = {
        sm: 14,
        md: 18,
        lg: 24,
    };

    const iconSize = sizePxMap[size];

    const containerClasses = [
        "star-rating-container",
        `star-rating--${variant}`,
        `star-rating--${size}`,
        isInteractive ? "star-rating--interactive" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={containerClasses}
            role={isInteractive ? "radiogroup" : "img"}
            aria-label={`Rating: ${rating} out of ${maxStars} stars`}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
            }}
        >
            {Array.from({ length: maxStars }, (_, idx) => {
                const starValue = idx + 1;
                const isFilled = starValue <= Math.floor(activeRating);
                const isHalf = !isFilled && starValue === Math.ceil(activeRating) && activeRating % 1 !== 0;

                return (
                    <button
                        key={starValue}
                        type="button"
                        disabled={!isInteractive}
                        onClick={() => isInteractive && onRatingChange?.(starValue)}
                        onMouseEnter={() => isInteractive && setHoverRating(starValue)}
                        onMouseLeave={() => isInteractive && setHoverRating(null)}
                        aria-label={`${starValue} Star${starValue > 1 ? "s" : ""}`}
                        style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            cursor: isInteractive ? "pointer" : "default",
                            color: isFilled || isHalf ? "var(--accent)" : "var(--muted)",
                            opacity: isFilled || isHalf ? 1 : 0.4,
                            transition: "all 0.15s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Star
                            size={iconSize}
                            fill={isFilled ? "currentColor" : isHalf ? "url(#star-half-grad)" : "none"}
                            stroke="currentColor"
                        />
                    </button>
                );
            })}
            {variant === "compact" && (
                <span
                    style={{
                        marginLeft: "0.25rem",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--foreground)",
                    }}
                >
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
