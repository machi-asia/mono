"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export type RevealShapeVariant = "circle" | "slab" | "pill" | "diagonal";

export interface ParallaxChapterRevealProps {
    variant?: RevealShapeVariant;
    primaryShade?: string;
    secondaryShade?: string;
    align?: "left" | "right" | "center";
    testId?: string;
}

function getShapeGeometry(variant: RevealShapeVariant): React.CSSProperties {
    switch (variant) {
        case "circle":
            return {
                width: "140px",
                height: "140px",
                borderRadius: "9999px",
            };
        case "slab":
            return {
                width: "280px",
                height: "56px",
                borderRadius: "2px",
            };
        case "pill":
            return {
                width: "220px",
                height: "84px",
                borderRadius: "9999px",
            };
        case "diagonal":
            return {
                width: "260px",
                height: "64px",
                borderRadius: "4px",
            };
    }
}

export function ParallaxChapterReveal({
    variant = "circle",
    primaryShade = "var(--shade-carbon, #0c0c10)",
    secondaryShade = "var(--shade-graphite, #17171d)",
    align = "right",
    testId = "parallax-chapter-reveal",
}: ParallaxChapterRevealProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const panelOneX = useTransform(scrollYProgress, [0, 1], ["-8%", "6%"]);
    const panelTwoX = useTransform(scrollYProgress, [0, 1], ["8%", "-6%"]);
    const panelY = useTransform(scrollYProgress, [0, 1], [-18, 22]);
    const panelScaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.04, 0.92]);

    const shapeY = useTransform(scrollYProgress, [0, 1], [-50, 70]);
    const shapeX = useTransform(
        scrollYProgress,
        [0, 1],
        align === "left" ? [-36, 48] : align === "center" ? [-44, 44] : [36, -48]
    );
    const shapeRotate = useTransform(
        scrollYProgress,
        [0, 1],
        variant === "diagonal" ? [-18, 14] : [-8, 12]
    );

    const anchorPosition: React.CSSProperties =
        align === "left"
            ? { left: "6%" }
            : align === "center"
              ? { left: "50%", marginLeft: variant === "circle" ? "-70px" : "-120px" }
              : { right: "6%" };

    return (
        <div
            ref={containerRef}
            data-testid={testId}
            data-variant={variant}
            aria-hidden="true"
            style={{
                position: "relative",
                height: "clamp(110px, 16vh, 170px)",
                width: "100%",
                overflow: "visible",
                pointerEvents: "none",
                zIndex: 8,
            }}
        >
            {/* Primary Shade Parallax Shutter Panel */}
            <motion.div
                data-testid={`${testId}-primary-panel`}
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "-4%",
                    width: "76%",
                    height: "72%",
                    backgroundColor: primaryShade,
                    x: panelOneX,
                    y: panelY,
                    scaleX: panelScaleX,
                    transformOrigin: "left center",
                    willChange: "transform",
                }}
            />

            {/* Secondary Shade Parallax Counter Panel */}
            <motion.div
                data-testid={`${testId}-secondary-panel`}
                style={{
                    position: "absolute",
                    bottom: "4%",
                    right: "-4%",
                    width: "64%",
                    height: "62%",
                    backgroundColor: secondaryShade,
                    x: panelTwoX,
                    y: panelY,
                    scaleX: panelScaleX,
                    transformOrigin: "right center",
                    willChange: "transform",
                }}
            />

            {/* Real-Time Inverted Difference Shape Bridging Chapters */}
            <motion.div
                data-testid={`${testId}-invert-shape`}
                className="invert-blend-shape"
                style={{
                    position: "absolute",
                    top: "14%",
                    ...anchorPosition,
                    ...getShapeGeometry(variant),
                    backgroundColor: "var(--shade-inversion, #f4f4f0)",
                    mixBlendMode: "difference",
                    x: shapeX,
                    y: shapeY,
                    rotate: shapeRotate,
                    pointerEvents: "none",
                    willChange: "transform",
                    zIndex: 10,
                }}
            />
        </div>
    );
}

export default ParallaxChapterReveal;
