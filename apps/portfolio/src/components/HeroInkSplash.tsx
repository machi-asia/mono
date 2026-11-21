"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

export interface HeroInkSplashProps {
    parallaxY?: MotionValue<number>;
}

const INK_SHADES = [
    "#171715",
    "#292926",
    "#3d3d39",
    "#50504b",
    "#252522",
];

export default function HeroInkSplash({ parallaxY }: HeroInkSplashProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let simulation: WebGLFluidEnhanced | null = null;
        let inkIntervalId: number | undefined;
        let stirIntervalId: number | undefined;
        let animationFrameId: number | undefined;

        try {
            simulation = new WebGLFluidEnhanced(container);

            simulation.setConfig({
                // Resolution
                simResolution: 256,
                dyeResolution: 1024,

                // Fluid physics
                densityDissipation: 0,
                velocityDissipation: 0.15,
                pressure: 0.8,
                pressureIterations: 25,
                curl: 25,

                // Splat behavior
                splatRadius: 0.22,
                splatForce: 2500,

                // Rendering
                shading: true,
                colorful: false,
                bloom: false,
                sunrays: false,
                brightness: 0.9,

                // Background (solid void black so multiply-blended silhouette only appears inside ink)
                backgroundColor: "#020203",
                transparent: false,

                // Interaction
                hover: false,
            });

            simulation.start();
        } catch (error) {
            console.warn("WebGL Fluid initialization failed:", error);
            return;
        }

        let step = 0;
        let elapsedSec = 0;

        const getDimensions = () => {
            const rect = container.getBoundingClientRect();

            return {
                width: rect.width || 960,
                height: rect.height || 860,
            };
        };

        // Inject an ink plume from the right side.
        const emitInk = () => {
            if (!simulation) return;

            const { width, height } = getDimensions();

            const x = width * (0.88 + Math.random() * 0.08);
            const y = height * (0.2 + Math.random() * 0.6);

            const angle = Math.PI + (Math.random() - 0.5) * 0.7;
            const force = 1200 + Math.random() * 900;

            const shade = INK_SHADES[step % INK_SHADES.length];
            step++;

            simulation.splatAtLocation(
                x,
                y,
                Math.cos(angle) * force,
                Math.sin(angle) * force,
                shade
            );
        };

        // Gently fold existing ink into organic swirling patterns.
        const stirInk = () => {
            if (!simulation) return;

            const { width, height } = getDimensions();

            const x = width * (0.45 + Math.cos(elapsedSec * 0.35) * 0.2);
            const y = height * (0.5 + Math.sin(elapsedSec * 0.45) * 0.2);

            const angle = elapsedSec * 1.2;

            simulation.splatAtLocation(
                x,
                y,
                Math.cos(angle) * 500,
                Math.sin(angle) * 500,
                "#000000"
            );
        };

        // Initial ink formation.
        emitInk();

        window.setTimeout(() => emitInk(), 250);
        window.setTimeout(() => emitInk(), 550);
        window.setTimeout(() => emitInk(), 900);

        if (prefersReducedMotion) {
            return () => {
                simulation?.stop();
            };
        }

        const startTime = performance.now();

        // Continuous timing.
        const updateTime = () => {
            elapsedSec = (performance.now() - startTime) / 1000;
            animationFrameId = requestAnimationFrame(updateTime);
        };

        animationFrameId = requestAnimationFrame(updateTime);

        // Slowly introduce fresh ink.
        inkIntervalId = window.setInterval(() => {
            emitInk();
        }, 1400);

        // Gentle fluid movement.
        stirIntervalId = window.setInterval(() => {
            stirInk();
        }, 450);

        return () => {
            if (inkIntervalId !== undefined) {
                window.clearInterval(inkIntervalId);
            }

            if (stirIntervalId !== undefined) {
                window.clearInterval(stirIntervalId);
            }

            if (animationFrameId !== undefined) {
                cancelAnimationFrame(animationFrameId);
            }

            simulation?.stop();
        };
    }, [prefersReducedMotion]);

    return (
        <motion.div
            aria-hidden="true"
            data-testid="hero-ink-splash"
            className="centra-hero-ink-splash"
            style={parallaxY ? { y: parallaxY } : undefined}
        >
            <div
                ref={containerRef}
                data-testid="hero-ink-canvas"
                className="centra-hero-ink-canvas"
            />
            <img
                src="/images/hero-ink-silhouette.png"
                alt=""
                draggable={false}
                data-testid="hero-ink-silhouette"
                className="centra-hero-ink-silhouette"
            />
        </motion.div>
    );
}