"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function ReactComponentsDiagram({ variant }: DiagramProps) {
    const isDetailed = variant === "detailed";

    if (!isDetailed) {
        return (
            <div className="exp-diagram-wrapper exp-diagram-wrapper-compact">
                <svg viewBox="0 0 400 100" className="exp-diagram-svg">
                    <defs>
                        <marker id="arrow-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                        </marker>
                    </defs>
                    <path d="M 110 50 L 140 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 260 50 L 290 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 25)">
                        <rect width="100" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="50" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">React Props</text>
                    </g>
                    <g transform="translate(150, 25)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Theme Resolver</text>
                    </g>
                    <g transform="translate(300, 25)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">DOM Output</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Prop-Driven Variant Resolver (Expanded)</h5>
            <svg viewBox="0 0 500 280" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                </defs>

                {/* Flow lines */}
                <path d="M 140 120 L 175 120" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                <path d="M 320 120 L 355 120" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* Vertical storybook flow */}
                <path d="M 75 165 L 75 190" stroke="var(--card-border)" strokeWidth="1.5" strokeDasharray="3 3" />

                <motion.path
                    d="M 140 120 L 355 120"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* React Component configuration */}
                <g transform="translate(15, 35)">
                    <rect width="125" height="120" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="12" y="25" fill="var(--foreground)" fontSize="11" fontWeight="700">&lt;Button /&gt;</text>

                    <text x="12" y="55" fill="var(--accent)" fontSize="9" fontFamily="monospace">{"variant=\"outline\""}</text>
                    <text x="12" y="75" fill="var(--accent)" fontSize="9" fontFamily="monospace">{"size=\"lg\""}</text>
                    <text x="12" y="95" fill="var(--accent)" fontSize="9" fontFamily="monospace">{"disabled={false}"}</text>
                    <text x="12" y="112" fill="var(--accent)" fontSize="9" fontFamily="monospace">{"intent=\"primary\""}</text>
                </g>

                {/* Storybook configuration */}
                <g transform="translate(15, 195)">
                    <rect width="125" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1.5" />
                    <text x="62.5" y="22" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Storybook Stories</text>
                    <text x="62.5" y="38" fill="var(--muted)" fontSize="8" textAnchor="middle">Visual Isolation Tests</text>
                </g>

                {/* Resolver logic block */}
                <g transform="translate(180, 35)">
                    <rect width="135" height="170" rx="8" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="67.5" y="25" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="700">Style Resolver</text>

                    <rect x="10" y="45" width="115" height="110" rx="4" fill="rgb(var(--accent-rgb), 0.05)" stroke="var(--card-border)" />
                    <text x="18" y="60" fill="var(--foreground)" fontSize="8">Resolves classes:</text>
                    <text x="18" y="76" fill="var(--accent-light)" fontSize="8" fontWeight="600">.btn--outline</text>
                    <text x="18" y="92" fill="var(--accent-light)" fontSize="8" fontWeight="600">.btn--lg</text>

                    <text x="18" y="115" fill="var(--foreground)" fontSize="8">Theme tokens maps:</text>
                    <text x="18" y="130" fill="var(--accent-light)" fontSize="8" fontWeight="600">{"var(--accent)"}</text>
                    <text x="18" y="145" fill="var(--accent-light)" fontSize="8" fontWeight="600">{"var(--card-bg)"}</text>
                </g>

                {/* Output element */}
                <g transform="translate(360, 55)">
                    <rect width="125" height="120" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="62.5" y="25" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">DOM Tree Output</text>

                    <rect x="15" y="45" width="95" height="40" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1.5" />
                    <text x="62.5" y="68" fill="var(--accent)" fontSize="9" textAnchor="middle" fontWeight="700">Button View</text>
                    <text x="62.5" y="105" fill="var(--muted)" fontSize="8" textAnchor="middle">{"class=\"btn btn--outline"}</text>
                    <text x="62.5" y="115" fill="var(--muted)" fontSize="8" textAnchor="middle">{" btn--lg\""}</text>
                </g>
            </svg>
        </div>
    );
}