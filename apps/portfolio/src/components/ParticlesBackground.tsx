"use client";

import React, { useEffect, useRef } from "react";

export interface ParticlesBackgroundProps {
    variant?: "hero" | "fixed" | "fullscreen";
    className?: string;
    id?: string;
}

export const componentVariants = [
    { label: "Hero (Absolute)", props: { variant: "hero" as const } },
    { label: "Fixed Fullscreen", props: { variant: "fixed" as const } },
];

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
}

const ParticlesBackground = React.memo(function ParticlesBackground({
    variant = "hero",
    className = "",
    id,
}: ParticlesBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const isFixed = variant === "fixed" || variant === "fullscreen";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        const particleCount = isFixed ? 45 : 35;
        const maxDist = 140;

        const particles: Particle[] = Array.from({ length: particleCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.4 + 0.2,
        }));

        const handleResize = () => {
            if (!canvas || !canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener("resize", handleResize);
        const targetElement = isFixed ? window : canvas.parentElement || canvas;
        targetElement.addEventListener("mousemove", handleMouseMove as EventListener);
        targetElement.addEventListener("mouseleave", handleMouseLeave as EventListener);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Draw links
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.25;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Mouse grab link
                if (mx > 0 && my > 0) {
                    const mdx = particles[i].x - mx;
                    const mdy = particles[i].y - my;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < 130) {
                        const alpha = (1 - mdist / 130) * 0.6;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mx, my);
                        ctx.stroke();
                    }
                }

                // Update & draw particle
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            targetElement.removeEventListener("mousemove", handleMouseMove as EventListener);
            targetElement.removeEventListener("mouseleave", handleMouseLeave as EventListener);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isFixed]);

    return (
        <canvas
            ref={canvasRef}
            id={id || (isFixed ? "fixed-bg-particles" : "hero-particles")}
            className={`particles-canvas ${isFixed ? "particles-canvas-fixed" : ""} ${className}`.trim()}
            style={{
                position: isFixed ? "fixed" : "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: isFixed ? -1 : 0,
            }}
        />
    );
});

export default ParticlesBackground;
