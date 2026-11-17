"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Move, RotateCcw, Sliders } from "lucide-react";

type SpringPresetId = "snappy" | "elastic" | "heavy" | "zero-g";
type InversionShapeId = "circle-portal" | "architectural-slab" | "kinetic-ring";

interface SpringPreset {
    id: SpringPresetId;
    label: string;
    code: string;
    stiffness: number;
    damping: number;
    mass: number;
    description: string;
}

const SPRING_PRESETS: SpringPreset[] = [
    {
        id: "snappy",
        label: "SNAPPY",
        code: "K=520",
        stiffness: 520,
        damping: 28,
        mass: 0.7,
        description: "Crisp architectural snap with minimal overshoot.",
    },
    {
        id: "elastic",
        label: "ELASTIC",
        code: "K=260",
        stiffness: 260,
        damping: 10,
        mass: 0.9,
        description: "Underdamped harmonic rebound across axis.",
    },
    {
        id: "heavy",
        label: "HEAVY",
        code: "K=140",
        stiffness: 140,
        damping: 32,
        mass: 2.8,
        description: "High-inertia monolith mass with deliberate settle.",
    },
    {
        id: "zero-g",
        label: "ZERO-G",
        code: "K=65",
        stiffness: 65,
        damping: 8,
        mass: 1.6,
        description: "Low-restoring orbital drift and long decay tail.",
    },
];

interface InversionShapeConfig {
    id: InversionShapeId;
    label: string;
    code: string;
}

const INVERSION_SHAPES: InversionShapeConfig[] = [
    { id: "circle-portal", label: "Circle Portal", code: "S-01 // LENS" },
    { id: "architectural-slab", label: "Architectural Slab", code: "S-02 // MONOLITH" },
    { id: "kinetic-ring", label: "Kinetic Ring", code: "S-03 // TORUS" },
];

interface KineticTileConfig {
    id: string;
    code: string;
    title: string;
    detail: string;
    activeRotate: number;
    activeX: number;
    activeY: number;
}

const KINETIC_TILES: KineticTileConfig[] = [
    {
        id: "displace",
        code: "01 // TRANSLATE",
        title: "Axis Shift",
        detail: "Click to impulse lateral offset",
        activeRotate: -3,
        activeX: 10,
        activeY: -8,
    },
    {
        id: "rotate",
        code: "02 // TORQUE",
        title: "Angular Impulse",
        detail: "Spring-driven rotational snap",
        activeRotate: 12,
        activeX: 0,
        activeY: -6,
    },
    {
        id: "invert",
        code: "03 // POLARITY",
        title: "Surface Inversion",
        detail: "Toggles difference polarity plane",
        activeRotate: 0,
        activeX: -6,
        activeY: -6,
    },
    {
        id: "resonance",
        code: "04 // HARMONIC",
        title: "Damping Probe",
        detail: "Evaluates active spring settling",
        activeRotate: -8,
        activeX: 6,
        activeY: -10,
    },
];

export function InteractiveMotionLab() {
    const playgroundRef = useRef<HTMLDivElement | null>(null);

    const [activePresetId, setActivePresetId] = useState<SpringPresetId>("snappy");
    const [visibleShapes, setVisibleShapes] = useState<Record<InversionShapeId, boolean>>({
        "circle-portal": true,
        "architectural-slab": true,
        "kinetic-ring": true,
    });
    const [activeTileIds, setActiveTileIds] = useState<Record<string, boolean>>({});
    const [pulseCount, setPulseCount] = useState<number>(0);
    const [stageResetCount, setStageResetCount] = useState<number>(0);

    const activePreset =
        SPRING_PRESETS.find((preset) => preset.id === activePresetId) ?? SPRING_PRESETS[0];

    const springTransition = {
        type: "spring" as const,
        stiffness: activePreset.stiffness,
        damping: activePreset.damping,
        mass: activePreset.mass,
    };

    const handleToggleShape = (shapeId: InversionShapeId) => {
        setVisibleShapes((prev) => ({
            ...prev,
            [shapeId]: !prev[shapeId],
        }));
    };

    const handleToggleTile = (tileId: string) => {
        setActiveTileIds((prev) => ({
            ...prev,
            [tileId]: !prev[tileId],
        }));
        setPulseCount((prev) => prev + 1);
    };

    const handleResetStage = () => {
        setVisibleShapes({
            "circle-portal": true,
            "architectural-slab": true,
            "kinetic-ring": true,
        });
        setActiveTileIds({});
        setStageResetCount((prev) => prev + 1);
    };

    return (
        <section
            id="motion-lab"
            className="section swiss-grid-shell"
            data-testid="interactive-motion-lab"
            style={{
                position: "relative",
                backgroundColor: "var(--shade-abyss, #08080b)",
                borderTop: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                borderBottom: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                paddingTop: "5rem",
                paddingBottom: "5rem",
                maxWidth: "100%",
            }}
        >
            <div
                style={{
                    maxWidth: "1320px",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                        paddingBottom: "1.75rem",
                        borderBottom: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                        marginBottom: "2rem",
                    }}
                >
                    <div>
                        <div
                            className="swiss-index-tag mono-telemetry"
                            style={{
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: "0.75rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "var(--muted, #8e8e96)",
                                marginBottom: "0.625rem",
                            }}
                        >
                            05 // INTERACTIVE MOTION LAB
                        </div>
                        <h2
                            className="section-title"
                            style={{
                                margin: 0,
                                color: "var(--shade-inversion, #f4f4f0)",
                            }}
                        >
                            Interactive Motion Lab
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                        }}
                    >
                        <div
                            data-testid="motion-lab-pulse-count"
                            className="mono-telemetry"
                            style={{
                                padding: "0.45rem 0.85rem",
                                backgroundColor: "var(--shade-carbon, #0c0c10)",
                                border: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: "0.75rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--shade-inversion, #f4f4f0)",
                            }}
                        >
                            KINETIC PULSES // {String(pulseCount).padStart(2, "0")}
                        </div>

                        <button
                            type="button"
                            onClick={handleResetStage}
                            data-testid="motion-lab-reset-btn"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                padding: "0.45rem 0.85rem",
                                cursor: "pointer",
                                backgroundColor: "var(--shade-charcoal, #111116)",
                                border: "1px solid var(--hairline-strong, rgb(255 255 255 / 14%))",
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: "0.75rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "var(--shade-inversion, #f4f4f0)",
                            }}
                        >
                            <RotateCcw size={13} aria-hidden="true" />
                            <span>RESET STAGE</span>
                        </button>
                    </div>
                </div>

                {/* Shape Toggle Toolbar */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            fontSize: "0.75rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--muted, #8e8e96)",
                        }}
                    >
                        <Move size={14} aria-hidden="true" />
                        <span>DRAG OR TOGGLE DIFFERENCE-INVERSION SHAPES</span>
                    </div>

                    <div
                        role="group"
                        aria-label="Inversion Shapes"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                        }}
                    >
                        {INVERSION_SHAPES.map((shape) => {
                            const active = visibleShapes[shape.id];
                            return (
                                <button
                                    key={shape.id}
                                    type="button"
                                    aria-pressed={active}
                                    data-testid={`toggle-shape-${shape.id}`}
                                    onClick={() => handleToggleShape(shape.id)}
                                    style={{
                                        padding: "0.45rem 0.85rem",
                                        cursor: "pointer",
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        border: "1px solid var(--hairline-strong, rgb(255 255 255 / 14%))",
                                        backgroundColor: active
                                            ? "var(--shade-inversion, #f4f4f0)"
                                            : "var(--shade-charcoal, #111116)",
                                        color: active
                                            ? "var(--shade-void, #020203)"
                                            : "var(--muted, #8e8e96)",
                                        transition: "background-color 0.2s ease, color 0.2s ease",
                                    }}
                                >
                                    {shape.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Real-Time Background Inversion Playground (NO isolation: isolate) */}
                <div
                    key={stageResetCount}
                    ref={playgroundRef}
                    data-testid="inversion-playground-stage"
                    style={{
                        position: "relative",
                        minHeight: "340px",
                        overflow: "hidden",
                        backgroundColor: "var(--shade-void, #020203)",
                        border: "1px solid var(--hairline-strong, rgb(255 255 255 / 14%))",
                        backgroundImage:
                            "linear-gradient(to right, rgb(255 255 255 / 7%) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 7%) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2.5rem 1.5rem",
                        marginBottom: "2rem",
                    }}
                >
                    {/* High-Contrast Typographic Field Underneath Shapes */}
                    <div
                        style={{
                            position: "relative",
                            textAlign: "center",
                            userSelect: "none",
                            pointerEvents: "none",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: "0.75rem",
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                color: "var(--muted, #8e8e96)",
                                marginBottom: "0.75rem",
                            }}
                        >
                            OPTICAL DIFFERENCE SURFACE // DRAG GEOMETRY ACROSS AXIS
                        </div>
                        <div
                            style={{
                                fontSize: "clamp(2.25rem, 7vw, 5.75rem)",
                                fontWeight: 900,
                                letterSpacing: "-0.05em",
                                lineHeight: 0.92,
                                textTransform: "uppercase",
                                color: "var(--shade-inversion, #f4f4f0)",
                            }}
                        >
                            INVERT THE VOID
                        </div>
                        <div
                            style={{
                                marginTop: "0.85rem",
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: "0.8125rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "var(--foreground-muted, #d4d4d8)",
                            }}
                        >
                            MULTI-SHADE OBSIDIAN // REAL-TIME POLARITY SHIFT
                        </div>
                    </div>

                    {/* Draggable / Toggleable Inversion Geometry */}
                    <AnimatePresence>
                        {visibleShapes["circle-portal"] && (
                            <motion.div
                                key="circle-portal"
                                data-testid="inversion-shape-circle-portal"
                                data-cursor="INVERT"
                                className="invert-blend-shape invert-backdrop-lens"
                                drag
                                dragConstraints={playgroundRef}
                                dragElastic={0.18}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                whileHover={{ scale: 1.06 }}
                                whileDrag={{ scale: 1.12 }}
                                transition={springTransition}
                                aria-label="Circle Portal inversion shape"
                                style={{
                                    position: "absolute",
                                    top: "18%",
                                    left: "14%",
                                    width: "126px",
                                    height: "126px",
                                    borderRadius: "9999px",
                                    backgroundColor: "var(--shade-inversion, #f4f4f0)",
                                    mixBlendMode: "difference",
                                    backdropFilter: "invert(1)",
                                    WebkitBackdropFilter: "invert(1)",
                                    cursor: "grab",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                        fontSize: "0.625rem",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: "#000000",
                                        pointerEvents: "none",
                                    }}
                                >
                                    PORTAL
                                </span>
                            </motion.div>
                        )}

                        {visibleShapes["architectural-slab"] && (
                            <motion.div
                                key="architectural-slab"
                                data-testid="inversion-shape-architectural-slab"
                                data-cursor="INVERT"
                                className="invert-blend-shape invert-backdrop-lens"
                                drag
                                dragConstraints={playgroundRef}
                                dragElastic={0.18}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                whileHover={{ scale: 1.04 }}
                                whileDrag={{ scale: 1.08 }}
                                transition={springTransition}
                                aria-label="Architectural Slab inversion shape"
                                style={{
                                    position: "absolute",
                                    bottom: "16%",
                                    left: "40%",
                                    width: "210px",
                                    height: "68px",
                                    borderRadius: "2px",
                                    backgroundColor: "var(--shade-inversion, #f4f4f0)",
                                    mixBlendMode: "difference",
                                    backdropFilter: "invert(1)",
                                    WebkitBackdropFilter: "invert(1)",
                                    cursor: "grab",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0 0.9rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                        fontSize: "0.625rem",
                                        letterSpacing: "0.1em",
                                        color: "#000000",
                                        pointerEvents: "none",
                                    }}
                                >
                                    SLAB // 02
                                </span>
                                <span
                                    style={{
                                        fontFamily:
                                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                        fontSize: "0.625rem",
                                        color: "#000000",
                                        pointerEvents: "none",
                                    }}
                                >
                                    DRAG
                                </span>
                            </motion.div>
                        )}

                        {visibleShapes["kinetic-ring"] && (
                            <motion.div
                                key="kinetic-ring"
                                data-testid="inversion-shape-kinetic-ring"
                                data-cursor="INVERT"
                                className="invert-blend-shape invert-backdrop-lens"
                                drag
                                dragConstraints={playgroundRef}
                                dragElastic={0.2}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                whileHover={{ rotate: 45, scale: 1.06 }}
                                whileDrag={{ scale: 1.12, rotate: 90 }}
                                transition={springTransition}
                                aria-label="Kinetic Ring inversion shape"
                                style={{
                                    position: "absolute",
                                    top: "20%",
                                    right: "14%",
                                    width: "134px",
                                    height: "134px",
                                    borderRadius: "9999px",
                                    border: "14px solid var(--shade-inversion, #f4f4f0)",
                                    backgroundColor: "transparent",
                                    mixBlendMode: "difference",
                                    backdropFilter: "invert(1)",
                                    WebkitBackdropFilter: "invert(1)",
                                    cursor: "grab",
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Spring Physics Tuner & Kinetic Tiles */}
                <div
                    style={{
                        border: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                        backgroundColor: "var(--shade-carbon, #0c0c10)",
                        padding: "1.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "1rem",
                            paddingBottom: "1.25rem",
                            borderBottom: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                            marginBottom: "1.25rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.65rem",
                            }}
                        >
                            <Sliders size={15} aria-hidden="true" color="#f4f4f0" />
                            <span
                                style={{
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                    fontSize: "0.8125rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--shade-inversion, #f4f4f0)",
                                }}
                            >
                                SPRING PHYSICS TUNER
                            </span>
                        </div>

                        <div
                            role="group"
                            aria-label="Spring Physics Presets"
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.4rem",
                            }}
                        >
                            {SPRING_PRESETS.map((preset) => {
                                const isActive = activePresetId === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        data-testid={`spring-preset-${preset.id}`}
                                        onClick={() => setActivePresetId(preset.id)}
                                        style={{
                                            padding: "0.45rem 0.85rem",
                                            cursor: "pointer",
                                            fontFamily:
                                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            border: "1px solid var(--hairline-strong, rgb(255 255 255 / 14%))",
                                            backgroundColor: isActive
                                                ? "var(--shade-inversion, #f4f4f0)"
                                                : "var(--shade-charcoal, #111116)",
                                            color: isActive
                                                ? "var(--shade-void, #020203)"
                                                : "var(--shade-inversion, #f4f4f0)",
                                            transition: "background-color 0.2s ease, color 0.2s ease",
                                        }}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Spring Telemetry Bar */}
                    <div
                        data-testid="spring-telemetry"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            backgroundColor: "var(--shade-obsidian, #050507)",
                            border: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                            marginBottom: "1.25rem",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            fontSize: "0.75rem",
                            color: "var(--foreground-muted, #d4d4d8)",
                        }}
                    >
                        <span>
                            PRESET: <strong style={{ color: "var(--shade-inversion, #f4f4f0)" }}>{activePreset.label}</strong> —{" "}
                            {activePreset.description}
                        </span>
                        <span>
                            STIFFNESS {activePreset.stiffness} / DAMPING {activePreset.damping} / MASS{" "}
                            {activePreset.mass}
                        </span>
                    </div>

                    {/* Interactive Kinetic Tiles */}
                    <div
                        role="group"
                        aria-label="Interactive Kinetic Tiles"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                            gap: "1px",
                            backgroundColor: "var(--hairline, rgb(255 255 255 / 6%))",
                            border: "1px solid var(--hairline, rgb(255 255 255 / 6%))",
                        }}
                    >
                        {KINETIC_TILES.map((tile) => {
                            const isEngaged = Boolean(activeTileIds[tile.id]);
                            return (
                                <motion.button
                                    key={tile.id}
                                    type="button"
                                    data-testid={`kinetic-tile-${tile.id}`}
                                    aria-pressed={isEngaged}
                                    data-cursor="INVERT"
                                    onClick={() => handleToggleTile(tile.id)}
                                    animate={{
                                        x: isEngaged ? tile.activeX : 0,
                                        y: isEngaged ? tile.activeY : 0,
                                        rotate: isEngaged ? tile.activeRotate : 0,
                                        scale: isEngaged ? 1.02 : 1,
                                    }}
                                    whileHover={{ y: -4, scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={springTransition}
                                    style={{
                                        textAlign: "left",
                                        padding: "1.25rem",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        gap: "1.25rem",
                                        backgroundColor: isEngaged
                                            ? "var(--shade-inversion, #f4f4f0)"
                                            : "var(--shade-charcoal, #111116)",
                                        color: isEngaged
                                            ? "var(--shade-void, #020203)"
                                            : "var(--shade-inversion, #f4f4f0)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            fontFamily:
                                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                            fontSize: "0.6875rem",
                                            letterSpacing: "0.1em",
                                            opacity: isEngaged ? 0.78 : 0.65,
                                        }}
                                    >
                                        <span>{tile.code}</span>
                                        <span>{isEngaged ? "ENGAGED" : "IDLE"}</span>
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "1.0625rem",
                                                fontWeight: 700,
                                                letterSpacing: "-0.02em",
                                                marginBottom: "0.35rem",
                                            }}
                                        >
                                            {tile.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                opacity: isEngaged ? 0.85 : 0.72,
                                            }}
                                        >
                                            {tile.detail}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default InteractiveMotionLab;
