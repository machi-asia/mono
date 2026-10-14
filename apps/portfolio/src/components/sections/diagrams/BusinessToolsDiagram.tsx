"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function BusinessToolsDiagram({ variant }: DiagramProps) {
    const isDetailed = variant === "detailed";

    if (!isDetailed) {
        return (
            <div className="exp-diagram-wrapper exp-diagram-wrapper-compact">
                <svg viewBox="0 0 400 110" className="exp-diagram-svg">
                    <defs>
                        <marker id="arrow-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                        </marker>
                    </defs>
                    <path d="M 100 55 L 140 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 260 55 L 290 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">AI Client Flows</text>
                    </g>
                    <g transform="translate(150, 30)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Shared Tools</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">State / Cache</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Shared Tools Integration Architecture (Expanded)</h5>
            <svg viewBox="0 0 500 280" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                    <marker id="arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                    </marker>
                </defs>

                {/* Flow Paths with flowing dots */}
                <path d="M 120 70 L 220 100" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                <path d="M 380 70 L 280 100" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* Active highlighted flows from tools to sub-modules */}
                <path d="M 250 150 L 250 175" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />

                {/* Active flows to storage layers */}
                <motion.path
                    d="M 230 200 L 140 230"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow-accent)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <motion.path
                    d="M 270 200 L 360 230"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow-accent)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Nodes - Top Level Clients */}
                <g transform="translate(40, 20)">
                    <rect width="130" height="50" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="65" y="30" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="600">Onboarding Flow</text>
                    <text x="65" y="42" fill="var(--muted)" fontSize="9" textAnchor="middle">aina-service v2</text>
                </g>

                <g transform="translate(330, 20)">
                    <rect width="130" height="50" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="65" y="30" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="600">General AI Orchestrator</text>
                    <text x="65" y="42" fill="var(--muted)" fontSize="9" textAnchor="middle">aina-service v5</text>
                </g>

                {/* Central Node - Migrated Shared Tools */}
                <g transform="translate(180, 95)">
                    <motion.rect
                        width="140"
                        height="55"
                        rx="8"
                        fill="var(--card-bg)"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        animate={{ strokeWidth: [2, 3, 2], strokeOpacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                    <text x="70" y="22" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="700">Shared Business Tools</text>
                    <text x="70" y="34" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="600">src/agents/shared/tools</text>
                    <text x="70" y="46" fill="var(--muted)" fontSize="8" textAnchor="middle">Central Validation Endpoint</text>
                </g>

                {/* Expanded Inner Sub-modules */}
                <g transform="translate(160, 165)">
                    <rect width="180" height="40" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="90" y="16" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Validators | Updaters | Tests</text>
                    <text x="90" y="28" fill="var(--muted)" fontSize="8" textAnchor="middle">Branding Logic & Regex Profiles</text>
                </g>

                {/* Bottom Level Systems */}
                <g transform="translate(50, 220)">
                    <rect width="120" height="45" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="60" y="26" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="600">Redis Cache</text>
                    <text x="60" y="37" fill="var(--muted)" fontSize="9" textAnchor="middle">Conversation State</text>
                </g>

                <g transform="translate(330, 220)">
                    <rect width="120" height="45" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="60" y="26" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="600">PostgreSQL DB</text>
                    <text x="60" y="37" fill="var(--muted)" fontSize="9" textAnchor="middle">Merchant Profiles</text>
                </g>
            </svg>
        </div>
    );
}