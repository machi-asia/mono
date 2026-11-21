"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Button from "../Button";
import HeroInkSplash from "../HeroInkSplash";
import type { Certificate, GitHubRepo, WorkCompany } from "../../data/types";

export interface HeroSectionProps {
    onContactOpen: () => void;
    repos?: GitHubRepo[];
    certificates?: Certificate[];
    workCompanies?: WorkCompany[];
}

export default function HeroSection({ onContactOpen }: HeroSectionProps) {
    const heroRef = useRef<HTMLElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const smoothScroll = useSpring(scrollYProgress, {
        stiffness: 110,
        damping: 24,
        restDelta: 0.001,
    });

    // Part 1: Centra Squeeze Display Typography (top 18% of tall hero scroll)
    const squeezeScaleY = useTransform(smoothScroll, [0, 0.18], [4.23, 1.0], {
        clamp: true,
    });
    const squeezeWrapperHeight = useTransform(
        squeezeScaleY,
        (s) => `${Math.round(s * 130)}px`
    );

    // Part 2: Pure Upward-Only Multi-Speed Vertical Parallax Tracks (x = 0, every element travels strictly up at different speeds)
    const bgFrame1Y = useTransform(smoothScroll, [0, 1], [30, -80]);
    const bgFrame2Y = useTransform(smoothScroll, [0, 1], [50, -110]);
    const bgFrame3Y = useTransform(smoothScroll, [0, 1], [40, -95]);
    const midLayerY = useTransform(smoothScroll, [0, 1], [80, -160]);
    const nearLayerY = useTransform(smoothScroll, [0, 1], [110, -210]);
    const frontLayerY = useTransform(smoothScroll, [0, 1], [140, -260]);

    const topPanelY = useTransform(smoothScroll, [0, 1], [0, -100]);
    const bottomPanelY = useTransform(smoothScroll, [0, 1], [40, -140]);
    const invertShapeY = useTransform(smoothScroll, [0, 1], [90, -200]);
    const inkSplashY = useTransform(smoothScroll, [0, 1], [0, -180]);

    return (
        <section
            ref={heroRef}
            id="hero"
            data-testid="hero-section"
            className="centra-hero-section"
        >
            {/* Animated Ink Splash on the right (behind invert-masked hero typography) */}
            <HeroInkSplash parallaxY={inkSplashY} />

            {/* PART 1: Centra Squeeze Display Header */}
            <header className="centra-squeeze-header">
                <div
                    data-testid="hero-squeeze-runway"
                    className="centra-squeeze-runway"
                >
                    <motion.div
                        data-testid="hero-squeeze-wrapper"
                        className="centra-squeeze-wrapper"
                        style={{ height: squeezeWrapperHeight }}
                    >
                        <motion.h1
                            data-testid="hero-squeeze-heading"
                            className="centra-squeeze-heading invert-blend-text"
                            style={{
                                scaleY: squeezeScaleY,
                                transformOrigin: "50% 0%",
                                mixBlendMode: "difference",
                                color: "var(--shade-inversion, #f4f4f0)",
                            }}
                        >
                            Angelo Justine D. Kamachi
                        </motion.h1>
                    </motion.div>
                </div>

                <motion.p
                    data-testid="hero-eyebrow"
                    initial={{ opacity: 0.05, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="centra-eyebrow invert-blend-text"
                    style={{
                        mixBlendMode: "difference",
                        color: "var(--shade-inversion, #f4f4f0)",
                    }}
                >
                    Full-Stack Software Engineer
                </motion.p>

                <motion.h2
                    data-testid="hero-statement"
                    initial={{ opacity: 0.05, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="centra-paragraph-massive invert-blend-text"
                    style={{
                        mixBlendMode: "difference",
                        color: "var(--shade-inversion, #f4f4f0)",
                    }}
                >
                    Yes, it’s me. Kamachi. Engineering high-craft web platforms, AI agents, and interactive systems.
                </motion.h2>
            </header>

            {/* PART 2: Centra Tall Vertical Multi-Plane Parallax Canvas */}
            <div
                data-testid="hero-perspective-stage"
                className="centra-parallax-stage"
            >
                {/* Vertical-Only Obsidian Architectural Panels */}
                <motion.div
                    aria-hidden="true"
                    data-testid="hero-parallax-panel-top"
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "34vw",
                        height: "24vh",
                        backgroundColor: "var(--shade-abyss)",
                        opacity: 0.72,
                        y: topPanelY,
                        pointerEvents: "none",
                        willChange: "transform",
                        zIndex: 0,
                    }}
                />

                <motion.div
                    aria-hidden="true"
                    data-testid="hero-parallax-panel-bottom"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "40vw",
                        height: "22vh",
                        backgroundColor: "var(--shade-charcoal)",
                        opacity: 0.68,
                        y: bottomPanelY,
                        pointerEvents: "none",
                        willChange: "transform",
                        zIndex: 0,
                    }}
                />

                {/* Deep Background Plane (zIndex: 1, slower upward travel speeds) */}
                <motion.div
                    data-testid="hero-bg-frame-1"
                    className="centra-bg-frame centra-bg-frame-1"
                    style={{ y: bgFrame1Y, zIndex: 1 }}
                >
                    <Image
                        src="/images/standard-hero.webp"
                        alt="Angelo Justine D. Kamachi portrait"
                        fill
                        priority
                        sizes="(max-width: 640px) 180px, (max-width: 1024px) 260px, 340px"
                        style={{
                            objectFit: "cover",
                            objectPosition: "center 28%",
                            filter: "grayscale(100%) contrast(1.08) brightness(0.88)",
                        }}
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-bg-frame-2"
                    className="centra-bg-frame centra-bg-frame-2"
                    style={{ y: bgFrame2Y, zIndex: 1 }}
                >
                    <img
                        src="/images/tilt-hero.webp"
                        alt="Editorial portrait frame"
                        draggable={false}
                        className="centra-frame-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-bg-frame-3"
                    className="centra-bg-frame centra-bg-frame-3"
                    style={{ y: bgFrame3Y, zIndex: 1 }}
                >
                    <video
                        src="/videos/WebDev.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="centra-frame-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-bg-frame-4"
                    className="centra-bg-frame centra-bg-frame-4"
                    style={{ y: bgFrame1Y, zIndex: 1 }}
                >
                    <img
                        src="/experience/proj1a-system-architecture.webp"
                        alt="System architecture overview frame"
                        draggable={false}
                        className="centra-frame-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-bg-frame-5"
                    className="centra-bg-frame centra-bg-frame-5"
                    style={{ y: bgFrame3Y, zIndex: 1 }}
                >
                    <img
                        src="/experience/proj1j-marketplace-1.webp"
                        alt="Marketplace platform showcase frame"
                        draggable={false}
                        className="centra-frame-media"
                    />
                </motion.div>

                {/* Central Editorial Statement & CTAs */}
                <div
                    data-testid="hero-perspective-foreground"
                    className="centra-overlay-copy"
                >
                    <p
                        data-testid="hero-overlay-statement-primary"
                        className="centra-overlay-statement invert-blend-text"
                        style={{
                            mixBlendMode: "difference",
                            color: "var(--shade-inversion, #f4f4f0)",
                        }}
                    >
                        Crafted beyond conventional static templates.
                    </p>
                    <p
                        data-testid="hero-overlay-statement-secondary"
                        className="centra-overlay-statement centra-overlay-statement-muted invert-blend-text"
                        style={{
                            mixBlendMode: "difference",
                            color: "var(--shade-inversion, #f4f4f0)",
                        }}
                    >
                        An interactive operating system built for high-contrast software craftsmanship.
                    </p>

                    <div className="centra-cta-row">
                        <Button
                            variant="primary"
                            onClick={onContactOpen}
                            rightIcon={<ArrowUpRight size={16} />}
                            data-cursor="CONTACT"
                        >
                            <span className="flip-text-holder">
                                <span className="flip-text-1">Get in Touch</span>
                                <span className="flip-text-2" aria-hidden="true">
                                    Get in Touch
                                </span>
                            </span>
                        </Button>

                        <a
                            href="#featured"
                            className="btn btn-secondary"
                            data-cursor="WORKS"
                            style={{ border: "none", backgroundColor: "rgb(255 255 255 / 12%)" }}
                        >
                            <span className="flip-text-holder">
                                <span className="flip-text-1">Explore Works</span>
                                <span className="flip-text-2" aria-hidden="true">
                                    Explore Works
                                </span>
                            </span>
                            <ArrowDownRight size={15} />
                        </a>
                    </div>
                </div>

                {/* Vertical-Only Difference Lens (zIndex: 4) */}
                <motion.div
                    aria-hidden="true"
                    data-testid="hero-parallax-invert-shape"
                    className="invert-blend-shape"
                    style={{
                        position: "absolute",
                        top: "640px",
                        right: "26%",
                        width: "clamp(140px, 15vw, 220px)",
                        height: "clamp(140px, 15vw, 220px)",
                        borderRadius: "9999px",
                        backgroundColor: "var(--shade-inversion, #f4f4f0)",
                        mixBlendMode: "difference",
                        y: invertShapeY,
                        pointerEvents: "none",
                        willChange: "transform",
                        zIndex: 4,
                    }}
                />

                {/* Overlapping Foreground Depth Items (zIndex: 4-5, pure vertical parallax across frames) */}
                <motion.div
                    data-testid="hero-perspective-subject"
                    className="centra-depth-item centra-depth-item-1"
                    style={{ y: nearLayerY, zIndex: 4 }}
                >
                    <img
                        src="/images/tilt-cut-hero.webp"
                        alt="Angelo Kamachi foreground cutout portrait"
                        draggable={false}
                        className="centra-depth-cutout"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-2"
                    className="centra-depth-item centra-depth-item-2"
                    style={{ y: midLayerY, zIndex: 4 }}
                >
                    <video
                        src="/videos/GameDev.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="centra-depth-card-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-3"
                    className="centra-depth-item centra-depth-item-3"
                    style={{ y: frontLayerY, zIndex: 5 }}
                >
                    <img
                        src="/rose/happy.png"
                        alt="Rose AI Companion"
                        draggable={false}
                        className="centra-depth-cutout"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-4"
                    className="centra-depth-item centra-depth-item-4"
                    style={{ y: nearLayerY, zIndex: 5 }}
                >
                    <video
                        src="/videos/Blender.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="centra-depth-card-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-5"
                    className="centra-depth-item centra-depth-item-5"
                    style={{ y: frontLayerY, zIndex: 5 }}
                >
                    <img
                        src="/images/standard-cut-hero.webp"
                        alt="Full-stack systems cutout"
                        draggable={false}
                        className="centra-depth-cutout"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-6"
                    className="centra-depth-item centra-depth-item-6"
                    style={{ y: nearLayerY, zIndex: 4 }}
                >
                    <img
                        src="/images/preview.webp"
                        alt="Interactive portfolio preview card"
                        draggable={false}
                        className="centra-depth-card-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-7"
                    className="centra-depth-item centra-depth-item-7"
                    style={{ y: midLayerY, zIndex: 4 }}
                >
                    <video
                        src="/videos/Drawings.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="centra-depth-card-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-8"
                    className="centra-depth-item centra-depth-item-8"
                    style={{ y: nearLayerY, zIndex: 5 }}
                >
                    <img
                        src="/experience/proj1d-finance.webp"
                        alt="Financial analytics dashboard card"
                        draggable={false}
                        className="centra-depth-card-media"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-9"
                    className="centra-depth-item centra-depth-item-9"
                    style={{ y: frontLayerY, zIndex: 5 }}
                >
                    <img
                        src="/rose/coding.png"
                        alt="Rose AI coding assistant"
                        draggable={false}
                        className="centra-depth-cutout"
                    />
                </motion.div>

                <motion.div
                    data-testid="hero-depth-item-10"
                    className="centra-depth-item centra-depth-item-10"
                    style={{ y: midLayerY, zIndex: 4 }}
                >
                    <img
                        src="/experience/proj1a-croia-migration-1.webp"
                        alt="Enterprise migration showcase card"
                        draggable={false}
                        className="centra-depth-card-media"
                    />
                </motion.div>
            </div>
        </section>
    );
}
