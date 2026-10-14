"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Badge from "../Badge";
import Dialog from "../Dialog";
import { MarkdownRenderer } from "@mono/components";
import type { FeaturedWork } from "../../data/types";

// Asymmetric column parallax configuration (modeled from Stewart & Partners)
const CARD_CONFIGS = [
    {
        className: "sp-cinematic-item-1 sp-cinematic-layer-above",
        frameClass: "sp-cinematic-media-frame-portrait",
        speed: "140vh",
        aspectRatio: "3 / 4",
    },
    {
        className: "sp-cinematic-item-2 sp-cinematic-layer-below",
        frameClass: "sp-cinematic-media-frame-landscape",
        speed: "95vh",
        aspectRatio: "16 / 10",
    },
    {
        className: "sp-cinematic-item-3 sp-cinematic-layer-below",
        frameClass: "sp-cinematic-media-frame-portrait",
        speed: "185vh",
        aspectRatio: "3 / 4",
    },
    {
        className: "sp-cinematic-item-4 sp-cinematic-layer-above",
        frameClass: "sp-cinematic-media-frame-landscape",
        speed: "115vh",
        aspectRatio: "16 / 10",
    },
    {
        className: "sp-cinematic-item-5 sp-cinematic-layer-below",
        frameClass: "sp-cinematic-media-frame-portrait",
        speed: "165vh",
        aspectRatio: "3 / 4",
    },
];

interface CinematicScrollShowcaseProps {
    featuredWorks: FeaturedWork[];
}

export default function CinematicScrollShowcase({ featuredWorks }: CinematicScrollShowcaseProps) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [hoveredWorkId, setHoveredWorkId] = useState<string | null>(null);
    const [selectedWork, setSelectedWork] = useState<FeaturedWork | null>(null);

    // High performance RAF scroll position calculation
    useEffect(() => {
        const el = stageRef.current;
        if (!el || typeof window === "undefined") return;

        let rafId: number;
        const updateProgress = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight || 1;
            const scrollDistance = Math.max(rect.height - vh, 1);
            const rawProgress = -rect.top / scrollDistance;
            const progress = Math.min(Math.max(rawProgress, 0), 1);
            el.style.setProperty("--sp-progress", progress.toFixed(4));
        };

        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateProgress);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateProgress();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <section
            ref={stageRef}
            id="featured"
            className="sp-cinematic-stage"
            data-testid="cinematic-scroll-showcase"
        >
            <div className="sp-cinematic-sticky">
                {/* Pinned Title on Left */}
                <div className="sp-cinematic-pinned-title-holder">
                    <p className="sp-cinematic-section-eyebrow">Creative Showcases</p>
                    <h2 className="sp-cinematic-brand-title">Angelo Kamachi</h2>
                    <h3 className="section-title sr-only">Featured Works</h3>
                </div>

                {/* Floating Counter on Right */}
                <div className="sp-cinematic-floating-counter">
                    <div className="sp-cinematic-counter-label">
                        Feature Work<br />({featuredWorks.length < 10 ? `0${featuredWorks.length}` : featuredWorks.length})
                    </div>
                    <span className="sp-cinematic-counter-sub">Curated Studio Ledger</span>
                </div>

                {/* Scattered Multi-Column Overlapping Grid */}
                <div
                    className={`sp-cinematic-photo-grid ${hoveredWorkId ? "is-hovering" : ""}`}
                    role="region"
                    aria-label="Featured Works Showcase"
                >
                    {featuredWorks.map((work, index) => {
                        const config = CARD_CONFIGS[index % CARD_CONFIGS.length];
                        const isHovered = hoveredWorkId === work.id;
                        const isFaded = hoveredWorkId !== null && !isHovered;
                        const numStr = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

                        return (
                            <div
                                key={work.id}
                                className={`sp-cinematic-grid-item ${config.className} ${
                                    isHovered ? "highlight" : ""
                                } ${isFaded ? "fadeout" : ""}`}
                                style={
                                    {
                                        "--sp-speed": config.speed,
                                        transform:
                                            "translate3d(0, calc((0.5 - var(--sp-progress, 0)) * var(--sp-speed)), 0)",
                                    } as React.CSSProperties
                                }
                                onMouseEnter={() => setHoveredWorkId(work.id)}
                                onMouseLeave={() => setHoveredWorkId(null)}
                            >
                                <button
                                    type="button"
                                    className="sp-cinematic-item-hit"
                                    onClick={() => setSelectedWork(work)}
                                    aria-label={`Inspect ${work.title}`}
                                />

                                <div className={`sp-cinematic-media-frame ${config.frameClass}`}>
                                    {work.videoUrl ? (
                                        <video
                                            className="sp-cinematic-media-video"
                                            src={work.videoUrl}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="auto"
                                        />
                                    ) : (
                                        <Image
                                            src="/images/preview.webp"
                                            alt={work.title}
                                            fill
                                            className="sp-cinematic-media-img"
                                        />
                                    )}
                                </div>

                                <div className="sp-cinematic-meta-bar">
                                    <span className="sp-cinematic-num">{numStr}</span>
                                    <span className="sp-cinematic-work-name">{work.title}</span>
                                    {work.tags?.[0] && (
                                        <span className="sp-cinematic-work-tag">{work.tags[0]}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Inspection Dialog */}
            <Dialog
                open={selectedWork !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedWork(null);
                }}
                className="featured-work-dialog"
            >
                {selectedWork && (
                    <div className="featured-dialog-wrapper">
                        {selectedWork.videoUrl && (
                            <div className="featured-dialog-video-container">
                                <video
                                    src={selectedWork.videoUrl}
                                    controls
                                    autoPlay
                                    className="featured-dialog-video"
                                />
                            </div>
                        )}
                        <div className="featured-dialog-content">
                            <div className="featured-dialog-header">
                                <h2 className="featured-dialog-title">{selectedWork.title}</h2>
                                {selectedWork.link && (
                                    <a
                                        href={selectedWork.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="featured-dialog-link"
                                    >
                                        Inspect Source <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                            <div className="featured-dialog-tags">
                                {selectedWork.tags.map((tag) => (
                                    <Badge key={tag} variant="default" size="sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="featured-dialog-description markdown-content">
                                <MarkdownRenderer content={selectedWork.description} />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </section>
    );
}
