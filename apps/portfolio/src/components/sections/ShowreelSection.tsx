"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import CinematicScrollShowcase from "./CinematicScrollShowcase";
import { MAIN_SHOWREEL } from "../../data/showcase-media";
import { featuredWorks as defaultFeaturedWorks } from "../../data/featured-works";
import type { FeaturedWork } from "../../data/types";

function safePlayVideo(videoEl: HTMLVideoElement | null): void {
    if (!videoEl || typeof videoEl.play !== "function") return;
    try {
        videoEl.play()?.catch(() => {});
    } catch {
        // Ignore JSDOM unimplemented media playback errors
    }
}

function safePauseVideo(videoEl: HTMLVideoElement | null): void {
    if (!videoEl || typeof videoEl.pause !== "function") return;
    try {
        videoEl.pause();
    } catch {
        // Ignore JSDOM unimplemented media pause errors
    }
}

export interface ShowreelSectionProps {
    featuredWorks?: FeaturedWork[];
}

export function ShowreelSection({ featuredWorks = defaultFeaturedWorks }: ShowreelSectionProps) {
    const portalContainerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isMuted, setIsMuted] = useState<boolean>(true);

    const { scrollYProgress } = useScroll({
        target: portalContainerRef,
        offset: ["start end", "center center"],
    });

    const portalScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
    const portalBorderRadius = useTransform(scrollYProgress, [0, 1], [16, 0]);
    const titleDriftX = useTransform(scrollYProgress, [0, 1], [-24, 10]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const handleTogglePlay = () => {
        const videoEl = videoRef.current;
        if (isPlaying) {
            safePauseVideo(videoEl);
            setIsPlaying(false);
        } else {
            safePlayVideo(videoEl);
            setIsPlaying(true);
        }
    };

    const handleToggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        if (videoRef.current) {
            videoRef.current.muted = nextMuted;
        }
    };

    return (
        <section
            id="showreel"
            data-testid="showreel-section"
            style={{
                position: "relative",
                backgroundColor: "var(--shade-obsidian, #050507)",
                paddingTop: "5rem",
                paddingBottom: "2rem",
                width: "100%",
            }}
        >
            {/* Master Showreel Portal */}
            <div
                style={{
                    maxWidth: "1320px",
                    margin: "0 auto",
                    padding: "0 1.5rem 4rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        marginBottom: "1.75rem",
                    }}
                >
                    <h2
                        className="section-title"
                        style={{
                            margin: 0,
                            color: "var(--shade-inversion, #f4f4f0)",
                        }}
                    >
                        Showreel
                    </h2>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                            type="button"
                            onClick={handleTogglePlay}
                            aria-label={isPlaying ? "Pause showreel" : "Play showreel"}
                            aria-pressed={isPlaying}
                            data-cursor="PLAY"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                padding: "0.5rem 0.95rem",
                                borderRadius: "9999px",
                                border: "none",
                                backgroundColor: "var(--shade-inversion, #f4f4f0)",
                                color: "var(--shade-void, #020203)",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                            <span>{isPlaying ? "Pause" : "Play"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleToggleMute}
                            aria-label={isMuted ? "Unmute showreel" : "Mute showreel"}
                            aria-pressed={!isMuted}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                padding: "0.5rem 0.95rem",
                                borderRadius: "9999px",
                                border: "none",
                                backgroundColor: "var(--shade-charcoal, #111116)",
                                color: "var(--shade-inversion, #f4f4f0)",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {isMuted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
                            <span>{isMuted ? "Unmute" : "Mute"}</span>
                        </button>
                    </div>
                </div>

                <div ref={portalContainerRef} data-testid="showreel-portal-container" style={{ position: "relative" }}>
                    <motion.div
                        data-testid="showreel-portal-frame"
                        style={{
                            scale: portalScale,
                            borderRadius: portalBorderRadius,
                            position: "relative",
                            overflow: "hidden",
                            backgroundColor: "var(--shade-void, #020203)",
                            border: "none",
                            aspectRatio: "16 / 9",
                            width: "100%",
                            transformOrigin: "center center",
                        }}
                    >
                        <video
                            ref={videoRef}
                            data-testid="showreel-video"
                            src={MAIN_SHOWREEL.videoUrl}
                            poster={MAIN_SHOWREEL.posterUrl}
                            muted={isMuted}
                            loop
                            playsInline
                            autoPlay
                            preload="metadata"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                filter: "contrast(1.06) brightness(0.88)",
                            }}
                        />

                        {/* Difference-blended minimal Showreel overlay title */}
                        <motion.div
                            className="invert-blend-text"
                            data-testid="showreel-kinetic-title"
                            style={{
                                position: "absolute",
                                bottom: "8%",
                                left: "4%",
                                x: titleDriftX,
                                mixBlendMode: "difference",
                                color: "var(--shade-inversion, #f4f4f0)",
                                pointerEvents: "none",
                                userSelect: "none",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "clamp(1.75rem, 5vw, 4.25rem)",
                                    fontWeight: 800,
                                    letterSpacing: "-0.04em",
                                    lineHeight: 0.95,
                                    textTransform: "uppercase",
                                }}
                            >
                                Selected Works
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Combined Borderless Featured Works Stream */}
            <CinematicScrollShowcase featuredWorks={featuredWorks} />
        </section>
    );
}

export default ShowreelSection;
