"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function BlogPromptDiagram({ variant }: DiagramProps) {
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
                    <path d="M 85 50 L 115 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 200 50 L 230 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 315 50 L 335 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 25)">
                        <rect width="75" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="37.5" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Web Scraper</text>
                    </g>
                    <g transform="translate(125, 25)">
                        <rect width="75" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="37.5" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Bypass Filter</text>
                    </g>
                    <g transform="translate(240, 25)">
                        <rect width="75" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="37.5" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Central LLM</text>
                    </g>
                    <g transform="translate(345, 30)">
                        <circle cx="20" cy="20" r="18" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="20" y="24" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">UI Form</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Blog Researcher Prompt Pipeline (Expanded)</h5>
            <svg viewBox="0 0 540 260" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                </defs>

                {/* Ingestion & Parsing */}
                <path d="M 90 80 L 130 80" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                {/* Parsing to Keyword Grid */}
                <path d="M 215 80 L 235 80" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* Keyword selection flowing to Filter */}
                <path d="M 375 80 L 400 80" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                {/* Filter to LLM */}
                <path d="M 440 110 L 440 145" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                {/* LLM to Nextjs Client */}
                <path d="M 390 175 L 340 175" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                {/* Client state to UI Form */}
                <path d="M 190 175 L 120 175" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                <motion.path
                    d="M 90 80 L 130 80 L 215 80 L 235 80"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <motion.path
                    d="M 375 80 L 440 80 L 440 175 L 390 175 L 120 175"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Node 1: Web Scraper */}
                <g transform="translate(10, 50)">
                    <rect width="80" height="60" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="40" y="28" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Web</text>
                    <text x="40" y="42" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Scraper</text>
                </g>

                {/* Node 2: Markdown Parser */}
                <g transform="translate(135, 50)">
                    <rect width="80" height="60" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="40" y="28" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Markdown</text>
                    <text x="40" y="42" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Parser</text>
                </g>

                {/* Node 3: Structured Keyword Arrays */}
                <g transform="translate(245, 35)">
                    <rect width="120" height="90" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="60" y="18" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Keywords Array</text>
                    <text x="15" y="38" fill="var(--foreground)" fontSize="8">{"• Primary"}</text>
                    <text x="15" y="53" fill="var(--foreground)" fontSize="8">{"• Secondary"}</text>
                    <text x="15" y="68" fill="var(--foreground)" fontSize="8">{"• LSI & Long-Tail"}</text>
                </g>

                {/* Node 4: Keyword Bypass Filter */}
                <g transform="translate(400, 50)">
                    <rect width="80" height="60" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="40" y="28" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Bypass</text>
                    <text x="40" y="42" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Filter</text>
                </g>

                {/* Node 5: Central LLM */}
                <g transform="translate(390, 145)">
                    <rect width="100" height="60" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="50" y="28" fill="var(--accent-light)" fontSize="10" textAnchor="middle" fontWeight="700">Central LLM</text>
                    <text x="50" y="42" fill="var(--muted)" fontSize="8" textAnchor="middle">Prompt Context</text>
                </g>

                {/* Node 6: Next.js Client useMaxAI Hook */}
                <g transform="translate(200, 145)">
                    <rect width="140" height="60" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="70" y="26" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">useMaxAI Event Hook</text>
                    <text x="70" y="40" fill="var(--muted)" fontSize="8" textAnchor="middle">Parser: comma-separated</text>
                    <text x="70" y="50" fill="var(--muted)" fontSize="8" textAnchor="middle">keyword string payload</text>
                </g>

                {/* Node 7: UI Widget */}
                <g transform="translate(30, 150)">
                    <rect width="80" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="40" y="26" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Blog Form</text>
                    <text x="40" y="38" fill="var(--muted)" fontSize="8" textAnchor="middle">Form Fields</text>
                </g>
            </svg>
        </div>
    );
}