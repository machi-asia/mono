"use client";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function MobileResponsivenessDiagram({ variant }: DiagramProps) {
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
                    <path d="M 120 55 L 160 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 270 55 L 290 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 30)">
                        <rect width="100" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="50" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Desktop Grid</text>
                    </g>
                    <g transform="translate(170, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Audit Shifts</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Mobile Stack</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Responsive Device Layout Shifts (Expanded)</h5>
            <svg viewBox="0 0 500 240" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow-sync" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                    </marker>
                </defs>

                {/* Desktop View */}
                <g transform="translate(10, 35)">
                    <rect width="190" height="150" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <rect x="0" y="0" width="190" height="16" fill="var(--card-border)" rx="2" />
                    <circle cx="8" cy="8" r="2.5" fill="#f43f5e" />
                    <circle cx="15" cy="8" r="2.5" fill="#fbbf24" />
                    <circle cx="22" cy="8" r="2.5" fill="#34d399" />
                    <text x="95" y="11" fill="var(--muted)" fontSize="7" textAnchor="middle">Desktop - Multi Column</text>

                    {/* Sidebar nav */}
                    <rect x="8" y="24" width="30" height="116" rx="3" fill="rgba(255, 255, 255, 0.03)" stroke="var(--card-border)" />
                    <line x1="12" y1="36" x2="34" y2="36" stroke="var(--card-border)" strokeWidth="1.5" />
                    <line x1="12" y1="46" x2="34" y2="46" stroke="var(--card-border)" strokeWidth="1.5" />
                    <line x1="12" y1="56" x2="34" y2="56" stroke="var(--card-border)" strokeWidth="1.5" />

                    {/* Layout grid */}
                    <rect x="46" y="24" width="60" height="50" rx="3" fill="rgba(255, 255, 255, 0.02)" stroke="var(--card-border)" />
                    <rect x="114" y="24" width="68" height="50" rx="3" fill="rgba(255, 255, 255, 0.02)" stroke="var(--card-border)" />
                    <rect x="46" y="80" width="136" height="56" rx="3" fill="rgba(255, 255, 255, 0.02)" stroke="var(--card-border)" />
                </g>

                {/* Transformation Flow */}
                <path d="M 215 110 L 255 110" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 3" fill="none" markerEnd="url(#arrow-sync)" />
                <g transform="translate(205, 125)">
                    <rect width="60" height="35" rx="4" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="1" />
                    <text x="30" y="12" fill="var(--accent-light)" fontSize="7" textAnchor="middle" fontWeight="600">Breakpoints</text>
                    <text x="30" y="24" fill="var(--muted)" fontSize="7" textAnchor="middle">320px - 1024px</text>
                </g>

                {/* Mobile View */}
                <g transform="translate(285, 20)">
                    <rect width="200" height="190" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="15" y="25" fill="var(--foreground)" fontSize="10" fontWeight="700">Mobile Adaptation Features</text>

                    <rect x="15" y="40" width="170" height="40" rx="4" fill="transparent" stroke="var(--card-border)" />
                    <text x="25" y="56" fill="var(--foreground)" fontSize="9" fontWeight="600">Responsive Grids</text>
                    <text x="25" y="70" fill="var(--muted)" fontSize="8">Single-column form layout shifts</text>

                    <rect x="15" y="90" width="170" height="40" rx="4" fill="transparent" stroke="var(--card-border)" />
                    <text x="25" y="106" fill="var(--foreground)" fontSize="9" fontWeight="600">Table Scrolling</text>
                    <text x="25" y="120" fill="var(--muted)" fontSize="8">Horizontal scroll wrappers for data lists</text>

                    <rect x="15" y="140" width="170" height="40" rx="4" fill="transparent" stroke="var(--card-border)" />
                    <text x="25" y="156" fill="var(--foreground)" fontSize="9" fontWeight="600">Mobile Navigation</text>
                    <text x="25" y="170" fill="var(--muted)" fontSize="8">Hamburger sliding side drawer navigation</text>
                </g>
            </svg>
        </div>
    );
}