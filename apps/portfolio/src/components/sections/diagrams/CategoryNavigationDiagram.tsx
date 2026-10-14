"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function CategoryNavigationDiagram({ variant }: DiagramProps) {
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
                    <path d="M 115 55 L 150 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 270 55 L 290 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 30)">
                        <rect width="105" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="52.5" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Rigid Menu</text>
                    </g>
                    <g transform="translate(160, 30)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Scroll Container</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Full Catalog</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Storefront Category Scroll Resolution (Expanded)</h5>
            <svg viewBox="0 0 500 280" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                </defs>

                <motion.path
                    d="M 225 120 L 265 120"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Broken Category Menu */}
                <g transform="translate(25, 25)">
                    <rect width="180" height="220" rx="8" fill="var(--card-bg)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="15" y="25" fill="#fb7185" fontSize="11" fontWeight="700">Rigid Category Menu</text>

                    {[50, 80, 110, 140, 170, 200].map((y, i) => (
                        <rect key={i} x="15" y={y} width="150" height="18" rx="4" fill={i > 2 ? "rgba(244, 63, 94, 0.08)" : "rgba(244, 63, 94, 0.04)"} stroke="rgba(244, 63, 94, 0.35)" />
                    ))}
                    <rect x="15" y="150" width="150" height="60" rx="4" fill="rgba(244, 63, 94, 0.15)" />
                    <text x="90" y="168" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="600">6 Categories</text>
                    <text x="90" y="182" fill="#f43f5e" fontSize="9" textAnchor="middle">Severed from view</text>
                </g>

                {/* Scroll Logic */}
                <g transform="translate(260, 60)">
                    <rect width="175" height="150" rx="8" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="87.5" y="24" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="700">Scrollable Container</text>

                    <text x="15" y="48" fill="var(--accent-light)" fontSize="8" fontWeight="600">• WebKit scrollbar styling</text>
                    <text x="15" y="66" fill="var(--accent-light)" fontSize="8" fontWeight="600">• Dynamic vh calculation</text>
                    <text x="15" y="84" fill="var(--accent-light)" fontSize="8" fontWeight="600">• Breakpoint listeners</text>

                    <rect x="15" y="98" width="145" height="38" rx="4" fill="transparent" stroke="var(--card-border)" />
                    <text x="87.5" y="113" fill="var(--foreground)" fontSize="8" textAnchor="middle" fontWeight="600">Desktop ↔ Mobile</text>
                    <text x="87.5" y="127" fill="var(--muted)" fontSize="8" textAnchor="middle">complete category access</text>
                </g>

                {/* App Wide Cleanup */}
                <g transform="translate(260, 55)">
                    <rect width="175" height="40" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1.5" strokeDasharray="3 3" transform="translate(0, 225)" />
                    <text x="87.5" y="15" transform="translate(0, 225)" fill="var(--foreground)" fontSize="8" textAnchor="middle" fontWeight="600">App Wide Cleanup</text>
                    <text x="87.5" y="29" transform="translate(0, 225)" fill="var(--muted)" fontSize="8" textAnchor="middle">Pagination • Tooltips • Pickers</text>
                </g>
            </svg>
        </div>
    );
}