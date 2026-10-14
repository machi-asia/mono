"use client";

import React, { useState, useEffect, useCallback, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselVariant = "featured" | "compact";

interface CarouselProps {
    variant?: CarouselVariant;
    visibleCount?: number;
    gap?: string;
    className?: string;
    children: React.ReactNode;
}

export const componentVariants = [
    { label: "Featured", props: { variant: "featured" as const, children: [1, 2, 3, 4].map((i) => <div key={i} style={{ height: 200, background: "var(--card-bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground)" }}>Slide {i}</div>) } },
    { label: "Compact", props: { variant: "compact" as const, visibleCount: 2, children: [1, 2, 3, 4].map((i) => <div key={i} style={{ height: 150, background: "var(--card-bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground)" }}>Slide {i}</div>) } },
];

function getEffectiveVisible(visibleCount: number): number {
    if (typeof window === "undefined") return visibleCount;
    const width = window.innerWidth;
    if (width <= 639) return 1;
    if (width <= 1023) return Math.min(visibleCount, 2);
    return visibleCount;
}

function subscribeResize(callback: () => void) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
}

export default function Carousel({
    variant = "featured",
    visibleCount = 3,
    gap = "1.5rem",
    className = "",
    children,
}: CarouselProps) {
    const [index, setIndex] = useState(0);
    const effectiveVisible = React.useSyncExternalStore(
        subscribeResize,
        () => getEffectiveVisible(visibleCount),
        () => visibleCount
    );
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const total = Children.count(children);
    const maxIndex = Math.max(0, total - effectiveVisible);
    const currentIndex = Math.min(index, maxIndex);

    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) {
            setIndex((prev) => Math.min(maxIndex, prev + 1));
        } else if (distance < -minSwipeDistance) {
            setIndex((prev) => Math.max(0, prev - 1));
        }
    };

    const dotsCount = maxIndex + 1;

    return (
        <div className={`carousel-root carousel-root--${variant} ${className}`}>
            <div className={`carousel-wrapper carousel-wrapper--${variant}`}>
                <button
                    className="carousel-nav-btn carousel-nav-prev"
                    onClick={() => setIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    aria-label="Previous"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    className="carousel-container"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={`carousel-grid carousel-grid--${variant}`}
                        style={{
                            "--carousel-index": currentIndex,
                            "--carousel-gap": gap,
                            "--carousel-visible": visibleCount,
                            "--effective-visible": effectiveVisible,
                        } as React.CSSProperties}
                    >
                        {children}
                    </div>
                </div>

                <button
                    className="carousel-nav-btn carousel-nav-next"
                    onClick={() => setIndex(Math.min(maxIndex, currentIndex + 1))}
                    disabled={currentIndex >= maxIndex}
                    aria-label="Next"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {dotsCount > 1 && (
                <div className="carousel-dots">
                    {Array.from({ length: dotsCount }, (_, i) => (
                        <button
                            key={i}
                            className={`carousel-dot ${i === currentIndex ? "carousel-dot-active" : ""}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

