"use client";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function TailwindMigrationDiagram({ variant }: DiagramProps) {
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
                    <path d="M 120 50 L 150 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 270 50 L 290 50" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 25)">
                        <rect width="100" height="50" rx="6" fill="var(--card-bg)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                        <text x="50" y="30" fill="#fb7185" fontSize="9" textAnchor="middle" fontWeight="600">Bootstrap CSS</text>
                    </g>
                    <g transform="translate(160, 25)">
                        <rect width="100" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="50" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Purge & Audit</text>
                    </g>
                    <g transform="translate(298, 25)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Tailwind v4</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Bootstrap Grid vs Tailwind Utility Structure (Expanded)</h5>
            <svg viewBox="0 0 520 250" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow-sync" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                    </marker>
                </defs>

                {/* Center Migration Arrow */}
                <path d="M 230 120 L 280 120" stroke="var(--accent)" strokeWidth="3" fill="none" markerEnd="url(#arrow-sync)" />

                {/* Left: Bootstrap Block */}
                <g transform="translate(10, 20)">
                    <rect width="200" height="210" rx="8" fill="var(--card-bg)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="15" y="25" fill="#fb7185" fontSize="11" fontWeight="700">Legacy Bootstrap Layout</text>

                    <rect x="15" y="45" width="170" height="30" rx="4" fill="rgba(244, 63, 94, 0.05)" stroke="rgba(244, 63, 94, 0.3)" />
                    <text x="25" y="63" fill="#f43f5e" fontSize="9" fontFamily="monospace">{"<div class=\"container\">"}</text>

                    <rect x="25" y="85" width="150" height="30" rx="4" fill="rgba(244, 63, 94, 0.05)" stroke="rgba(244, 63, 94, 0.3)" />
                    <text x="35" y="103" fill="#f43f5e" fontSize="9" fontFamily="monospace">{"<div class=\"row g-3\">"}</text>

                    <rect x="35" y="125" width="130" height="30" rx="4" fill="rgba(244, 63, 94, 0.05)" stroke="rgba(244, 63, 94, 0.3)" />
                    <text x="45" y="143" fill="#f43f5e" fontSize="9" fontFamily="monospace">{"<div class=\"col-md-6\">"}</text>

                    <rect x="45" y="165" width="110" height="30" rx="4" fill="rgba(244, 63, 94, 0.05)" stroke="rgba(244, 63, 94, 0.3)" />
                    <text x="55" y="183" fill="#f43f5e" fontSize="9" fontFamily="monospace">{"<div class=\"card border-0\">"}</text>
                </g>

                {/* Center: Processing Steps */}
                <g transform="translate(225, 25)">
                    <rect width="65" height="60" rx="4" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1.5" />
                    <text x="32.5" y="20" fill="var(--foreground)" fontSize="8" textAnchor="middle">Purge CSS</text>
                    <text x="32.5" y="35" fill="var(--foreground)" fontSize="8" textAnchor="middle">Map grid</text>
                    <text x="32.5" y="50" fill="var(--foreground)" fontSize="8" textAnchor="middle">variables</text>
                </g>

                {/* Right: Tailwind CSS v4 Block */}
                <g transform="translate(305, 20)">
                    <rect width="200" height="210" rx="8" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="15" y="25" fill="var(--accent-light)" fontSize="11" fontWeight="700">Refactored Tailwind CSS v4</text>

                    <rect x="15" y="45" width="170" height="150" rx="6" fill="rgb(var(--accent-rgb), 0.04)" stroke="rgb(var(--accent-rgb), 0.2)" />
                    <text x="25" y="65" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600">{"class=\"grid grid-cols-1"}</text>
                    <text x="25" y="83" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600"> md:grid-cols-2</text>
                    <text x="25" y="101" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600"> gap-6</text>
                    <text x="25" y="119" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600"> rounded-2xl</text>
                    <text x="25" y="137" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600"> border border-card-border</text>
                    <text x="25" y="155" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600"> p-6</text>
                    <text x="25" y="173" fill="var(--foreground)" fontSize="9" fontFamily="monospace" fontWeight="600">{" bg-card-bg\""}</text>
                </g>
            </svg>
        </div>
    );
}