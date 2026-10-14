"use client";

import React from "react";
import { User, Trash2, Pencil, Quote } from "lucide-react";
import StarRating from "./StarRating";
import Card from "./Card";
import type { VisitorReview } from "../data/types";

export type ReviewCardVariant = "standard" | "compact" | "featured";

export interface ReviewCardProps {
    variant?: ReviewCardVariant;
    review: VisitorReview;
    onDelete?: (id: string | number) => void;
    onEdit?: (review: VisitorReview) => void;
    isOwnerOrAdmin?: boolean;
    className?: string;
}

const sampleReview: VisitorReview = {
    id: "sample-1",
    user_id: "user-1",
    user_name: "Sarah Jenkins",
    user_avatar: "/images/standard-cut-hero.webp",
    rating: 5,
    comment: "Outstanding portfolio! The agentic AI features and clean design system make this one of the most impressive developer showcases I've seen.",
    created_at: "2026-07-28T14:32:00Z"
};

export const componentVariants = [
    { label: "Standard", props: { variant: "standard" as const, review: sampleReview } },
    { label: "Compact", props: { variant: "compact" as const, review: sampleReview } },
    { label: "Featured", props: { variant: "featured" as const, review: sampleReview } },
];

export default function ReviewCard({
    variant = "standard",
    review,
    onDelete,
    onEdit,
    isOwnerOrAdmin = false,
    className = "",
}: ReviewCardProps) {
    const formattedDate = new Date(review.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const cardClasses = [
        "review-card",
        `review-card--${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Card
            padding={variant === "compact" ? "sm" : "md"}
            variant="default"
            className={cardClasses}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {review.user_avatar ? (
                            <img
                                src={review.user_avatar}
                                alt={review.user_name}
                                style={{
                                    width: variant === "compact" ? 32 : 40,
                                    height: variant === "compact" ? 32 : 40,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "1px solid var(--card-border)",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: variant === "compact" ? 32 : 40,
                                    height: variant === "compact" ? 32 : 40,
                                    borderRadius: "50%",
                                    backgroundColor: "var(--card-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--muted)",
                                }}
                            >
                                <User size={variant === "compact" ? 16 : 20} />
                            </div>
                        )}
                        <div>
                            <h4
                                style={{
                                    margin: 0,
                                    fontSize: variant === "compact" ? "0.9rem" : "1rem",
                                    fontWeight: 600,
                                    color: "var(--foreground)",
                                }}
                            >
                                {review.user_name}
                            </h4>
                            <span
                                style={{
                                    fontSize: "0.75rem",
                                    color: "var(--muted)",
                                }}
                            >
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                    {isOwnerOrAdmin && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={() => onEdit(review)}
                                    title="Edit review"
                                    aria-label="Edit review"
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--muted)",
                                        cursor: "pointer",
                                        padding: "0.25rem",
                                        borderRadius: "4px",
                                        transition: "color 0.2s ease",
                                    }}
                                >
                                    <Pencil size={15} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(review.id)}
                                    title="Delete review"
                                    aria-label="Delete review"
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--muted)",
                                        cursor: "pointer",
                                        padding: "0.25rem",
                                        borderRadius: "4px",
                                        transition: "color 0.2s ease",
                                    }}
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <StarRating
                        variant="display"
                        rating={review.rating}
                        size={variant === "compact" ? "sm" : "md"}
                    />
                </div>

                <div style={{ position: "relative" }}>
                    {variant === "featured" && (
                        <Quote
                            size={28}
                            style={{
                                position: "absolute",
                                top: "-6px",
                                left: "-4px",
                                opacity: 0.15,
                                color: "var(--accent)",
                            }}
                        />
                    )}
                    <p
                        style={{
                            margin: 0,
                            fontSize: variant === "compact" ? "0.85rem" : "0.95rem",
                            lineHeight: 1.5,
                            color: "var(--foreground)",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {review.comment}
                    </p>
                </div>
            </div>
        </Card>
    );
}
