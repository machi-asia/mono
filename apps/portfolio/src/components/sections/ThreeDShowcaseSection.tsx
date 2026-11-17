"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Interactive3DCanvas from "../Interactive3DCanvas";
import {
    SHOWCASE_3D_MODELS,
    type Model3DAsset,
    type RenderMode3D,
} from "../../data/showcase-media";

const RENDER_MODES: { mode: RenderMode3D; label: string }[] = [
    { mode: "shaded", label: "Shaded" },
    { mode: "wireframe", label: "Wireframe" },
    { mode: "vertex", label: "Vertex" },
];

export function ThreeDShowcaseSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const initialModel: Model3DAsset = SHOWCASE_3D_MODELS[0];
    const [activeModel, setActiveModel] = useState<Model3DAsset>(initialModel);
    const [renderMode, setRenderMode] = useState<RenderMode3D>(initialModel.defaultMode);
    const [bumpCount, setBumpCount] = useState<number>(0);

    const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const backdropPanelLeftY = useTransform(scrollYProgress, [0, 1], [-36, 44]);
    const backdropPanelRightY = useTransform(scrollYProgress, [0, 1], [44, -36]);
    const invertPanelX = useTransform(scrollYProgress, [0, 1], ["-18%", "22%"]);
    const invertPanelRotate = useTransform(scrollYProgress, [0, 1], [-12, 16]);

    return (
        <section
            ref={sectionRef}
            id="3d-showcase"
            className="section"
            data-testid="three-d-showcase-section"
            style={{
                position: "relative",
                backgroundColor: "var(--shade-abyss, #08080b)",
                paddingTop: "5rem",
                paddingBottom: "5rem",
                maxWidth: "100%",
                overflowX: "clip",
            }}
        >
            {/* Multi-Shade Black Parallax Backdrop Panels */}
            <motion.div
                aria-hidden="true"
                data-testid="three-d-parallax-panel-left"
                style={{
                    position: "absolute",
                    top: "18%",
                    left: "4%",
                    width: "44%",
                    height: "58%",
                    backgroundColor: "var(--shade-carbon, #0c0c10)",
                    y: backdropPanelLeftY,
                    pointerEvents: "none",
                    willChange: "transform",
                    zIndex: 0,
                }}
            />

            <motion.div
                aria-hidden="true"
                data-testid="three-d-parallax-panel-right"
                style={{
                    position: "absolute",
                    bottom: "12%",
                    right: "4%",
                    width: "48%",
                    height: "54%",
                    backgroundColor: "var(--shade-graphite, #17171d)",
                    y: backdropPanelRightY,
                    pointerEvents: "none",
                    willChange: "transform",
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: "1320px",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                }}
            >
                {/* Clean Borderless Header */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1.25rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h2
                        className="section-title"
                        style={{
                            margin: 0,
                            color: "var(--shade-inversion, #f4f4f0)",
                        }}
                    >
                        3D Showcase
                    </h2>

                    {/* Minimal Render Mode Toggles */}
                    <div
                        role="group"
                        aria-label="Render Mode"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.25rem",
                            borderRadius: "9999px",
                            backgroundColor: "var(--shade-charcoal, #111116)",
                        }}
                    >
                        {RENDER_MODES.map(({ mode, label }) => {
                            const active = renderMode === mode;
                            return (
                                <button
                                    key={mode}
                                    type="button"
                                    aria-pressed={active}
                                    data-testid={`render-mode-${mode}`}
                                    onClick={() => setRenderMode(mode)}
                                    style={{
                                        padding: "0.45rem 0.95rem",
                                        borderRadius: "9999px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.8125rem",
                                        fontWeight: 600,
                                        backgroundColor: active
                                            ? "var(--shade-inversion, #f4f4f0)"
                                            : "transparent",
                                        color: active
                                            ? "var(--shade-void, #020203)"
                                            : "var(--muted, #8e8e96)",
                                        transition: "background-color 0.2s ease, color 0.2s ease",
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Borderless Full-Width Interactive 3D Stage with Scroll-Driven Inversion Panel */}
                <div
                    ref={canvasWrapperRef}
                    data-bump-count={String(bumpCount)}
                    style={{
                        width: "100%",
                        position: "relative",
                        marginBottom: "2rem",
                    }}
                >
                    <div style={{ position: "relative", zIndex: 2 }}>
                        <Interactive3DCanvas
                            preset={activeModel.preset}
                            renderMode={renderMode}
                            modelUrl={activeModel.modelUrl}
                            height={500}
                            interactiveOrbit={true}
                            scrollWeight={1.15}
                            onBump={(nextCount) => setBumpCount(nextCount)}
                            label={activeModel.title}
                        />
                    </div>

                    {/* Inverted Contrast Shape Translating Across the 3D Stage on Scroll */}
                    <motion.div
                        aria-hidden="true"
                        data-testid="three-d-invert-panel"
                        className="invert-blend-shape"
                        style={{
                            position: "absolute",
                            top: "14%",
                            left: "50%",
                            width: "clamp(140px, 18vw, 240px)",
                            height: "clamp(140px, 18vw, 240px)",
                            marginLeft: "calc(clamp(140px, 18vw, 240px) / -2)",
                            borderRadius: "9999px",
                            backgroundColor: "var(--shade-inversion, #f4f4f0)",
                            mixBlendMode: "difference",
                            x: invertPanelX,
                            rotate: invertPanelRotate,
                            pointerEvents: "none",
                            willChange: "transform",
                            zIndex: 3,
                        }}
                    />
                </div>

                {/* Clean Borderless Model Switcher Tabs */}
                <div
                    role="tablist"
                    aria-label="3D Models"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                    }}
                >
                    {SHOWCASE_3D_MODELS.map((model) => {
                        const isActive = activeModel.id === model.id;
                        return (
                            <button
                                key={model.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                data-testid={`model-tab-${model.id}`}
                                data-cursor="INSPECT"
                                onClick={() => setActiveModel(model)}
                                style={{
                                    padding: "0.6rem 1.15rem",
                                    borderRadius: "9999px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: isActive ? 600 : 500,
                                    backgroundColor: isActive
                                        ? "var(--shade-inversion, #f4f4f0)"
                                        : "var(--shade-charcoal, #111116)",
                                    color: isActive
                                        ? "var(--shade-void, #020203)"
                                        : "var(--foreground-muted, #d4d4d8)",
                                    transition: "background-color 0.2s ease, color 0.2s ease",
                                }}
                            >
                                {model.title}
                            </button>
                        );
                    })}
                </div>

                {/* Brief 1-Line Active Model Description */}
                <motion.p
                    key={activeModel.id}
                    initial={{ opacity: 0.25, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{
                        margin: 0,
                        fontSize: "0.9375rem",
                        lineHeight: 1.6,
                        color: "var(--muted, #8e8e96)",
                        maxWidth: "68ch",
                    }}
                >
                    {activeModel.description}
                </motion.p>
            </div>
        </section>
    );
}

export default ThreeDShowcaseSection;
