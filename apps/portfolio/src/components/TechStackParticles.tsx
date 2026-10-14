"use client";

import React, { useEffect, useRef } from "react";

const SPACING = 24;
const DOT_RADIUS = 1.2;
const BASE_OPACITY = 0.35;
const GLOW_RADIUS = 120;
const GLOW_OPACITY = 0.55;
const GLOW_SIZE = 2.2;
const JITTER = 1.5;
const REPEL_RADIUS = 100; // cursor repulsion range
const REPEL_STRENGTH = 18; // max px displacement
const SNAP_SPEED = 0.12; // lerp factor for snapping back (0-1)
const RIPPLE_DURATION = 1200;
const RIPPLE_MAX_RADIUS = 250;
const RIPPLE_REPEL = 12; // extra push from ripple wavefront

interface Ripple {
    x: number;
    y: number;
    startTime: number;
}

const TechStackGrid = React.memo(function TechStackGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const rafRef = useRef<number>(0);
    const ripplesRef = useRef<Ripple[]>([]);
    // Store per-dot displacement offsets for smooth snapping
    const displaceRef = useRef<Float32Array | null>(null);
    const colorRef = useRef<[number, number, number]>([212, 175, 55]);

    // Update dynamic color matching theme
    useEffect(() => {
        const updateColor = () => {
            if (typeof window === "undefined") return;
            const rootStyles = getComputedStyle(document.documentElement);
            const r = parseInt(rootStyles.getPropertyValue("--accent-r").trim(), 10);
            const g = parseInt(rootStyles.getPropertyValue("--accent-g").trim(), 10);
            const b = parseInt(rootStyles.getPropertyValue("--accent-b").trim(), 10);
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                colorRef.current = [r, g, b];
            }
        };

        window.addEventListener("theme-change", updateColor);
        updateColor(); // Initial check

        return () => {
            window.removeEventListener("theme-change", updateColor);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let time = 0;
        let prevCols = 0;
        let prevRows = 0;

        const draw = () => {
            time += 0.008;
            const now = performance.now();
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            const [colorR, colorG, colorB] = colorRef.current;

            if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            ctx.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Clean up expired ripples
            ripplesRef.current = ripplesRef.current.filter(
                (r) => now - r.startTime < RIPPLE_DURATION
            );

            const cols = Math.floor(w / SPACING) + 1;
            const rows = Math.floor(h / SPACING) + 1;
            const offsetX = (w - (cols - 1) * SPACING) / 2;
            const offsetY = (h - (rows - 1) * SPACING) / 2;

            // Allocate / resize displacement buffer (2 floats per dot: dx, dy)
            if (!displaceRef.current || cols !== prevCols || rows !== prevRows) {
                displaceRef.current = new Float32Array(cols * rows * 2);
                prevCols = cols;
                prevRows = rows;
            }
            const displace = displaceRef.current;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const idx = (row * cols + col) * 2;
                    const seed = col * 7.13 + row * 13.37;
                    const jx = Math.sin(time + seed) * JITTER;
                    const jy = Math.cos(time * 1.3 + seed * 0.7) * JITTER;
                    const baseX = offsetX + col * SPACING + jx;
                    const baseY = offsetY + row * SPACING + jy;

                    // Compute target displacement from cursor repulsion
                    const dx = baseX - mx;
                    const dy = baseY - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    let targetDx = 0;
                    let targetDy = 0;

                    if (dist < REPEL_RADIUS && dist > 0.1) {
                        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
                        targetDx = (dx / dist) * force;
                        targetDy = (dy / dist) * force;
                    }

                    // Ripple wavefront push
                    for (const ripple of ripplesRef.current) {
                        const rdx = baseX - ripple.x;
                        const rdy = baseY - ripple.y;
                        const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
                        const progress = (now - ripple.startTime) / RIPPLE_DURATION;
                        const rippleRadius = progress * RIPPLE_MAX_RADIUS;
                        const ringDist = Math.abs(rDist - rippleRadius);
                        const ringWidth = 35;
                        if (ringDist < ringWidth && rDist > 0.1) {
                            const ringT = 1 - ringDist / ringWidth;
                            const fade = 1 - progress;
                            const push = ringT * fade * RIPPLE_REPEL;
                            targetDx += (rdx / rDist) * push;
                            targetDy += (rdy / rDist) * push;
                        }
                    }

                    // Lerp current displacement toward target (smooth snap-back)
                    displace[idx] += (targetDx - displace[idx]) * SNAP_SPEED;
                    displace[idx + 1] += (targetDy - displace[idx + 1]) * SNAP_SPEED;

                    const drawX = baseX + displace[idx];
                    const drawY = baseY + displace[idx + 1];

                    // Glow brightness based on proximity
                    const t = Math.max(0, 1 - dist / GLOW_RADIUS);

                    // Ripple glow boost
                    let rippleBoost = 0;
                    for (const ripple of ripplesRef.current) {
                        const rdx2 = baseX - ripple.x;
                        const rdy2 = baseY - ripple.y;
                        const rDist2 = Math.sqrt(rdx2 * rdx2 + rdy2 * rdy2);
                        const progress = (now - ripple.startTime) / RIPPLE_DURATION;
                        const rippleRadius = progress * RIPPLE_MAX_RADIUS;
                        const ringDist = Math.abs(rDist2 - rippleRadius);
                        const ringWidth = 30 + progress * 20;
                        if (ringDist < ringWidth) {
                            const ringT = 1 - ringDist / ringWidth;
                            const fade = 1 - progress;
                            rippleBoost = Math.max(rippleBoost, ringT * fade * 0.6);
                        }
                    }

                    const totalT = Math.min(1, t + rippleBoost);
                    const opacity = BASE_OPACITY + (GLOW_OPACITY - BASE_OPACITY) * totalT;
                    const radius = DOT_RADIUS + (GLOW_SIZE - DOT_RADIUS) * totalT;

                    ctx.beginPath();
                    ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${opacity})`;
                    ctx.fill();
                }
            }

            // Draw ripple rings
            for (const ripple of ripplesRef.current) {
                const progress = (now - ripple.startTime) / RIPPLE_DURATION;
                const rippleRadius = progress * RIPPLE_MAX_RADIUS;
                const fade = 1 - progress;
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, rippleRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${fade * 0.3})`;
                ctx.lineWidth = 1.5 * (1 - progress * 0.5);
                ctx.stroke();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // Use document-level pointer tracking so interactions work even when
    // the cursor is over content layered above the canvas (tabs, diagram, etc.)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onPointerMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Only track when cursor is within the section bounds
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                mouseRef.current = { x, y };
            } else {
                mouseRef.current = { x: -1000, y: -1000 };
            }
        };

        const onClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                ripplesRef.current.push({
                    x,
                    y,
                    startTime: performance.now(),
                });
            }
        };

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("click", onClick);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
});

export default TechStackGrid;
