"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function AssetMigrationDiagram({ variant }: DiagramProps) {
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
                    <path d="M 105 55 L 140 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 260 55 L 290 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 30)">
                        <rect width="95" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="47.5" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">AWS S3 Cloud</text>
                    </g>
                    <g transform="translate(150, 30)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Restore & Audit</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Repo Assets</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Ransomware Recovery & S3 Asset Migration Pipeline (Expanded)</h5>
            <svg viewBox="0 0 520 300" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                    <marker id="arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                    </marker>
                </defs>

                <motion.path
                    d="M 170 90 L 230 125"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow-accent)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <path d="M 385 125 L 330 90" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                <path d="M 250 190 L 250 220" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                {/* Corrupted Cloud Source */}
                <g transform="translate(35, 45)">
                    <rect width="130" height="90" rx="8" fill="var(--card-bg)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="65" y="22" fill="#fb7185" fontSize="11" textAnchor="middle" fontWeight="700">AWS S3 Cloud</text>
                    <text x="65" y="44" fill="var(--foreground)" fontSize="8" textAnchor="middle">Corrupted image records</text>
                    <text x="65" y="58" fill="var(--foreground)" fontSize="8" textAnchor="middle">after 7/11 ransomware</text>
                    <text x="65" y="78" fill="var(--muted)" fontSize="8" textAnchor="middle">- Encrypted binaries</text>
                </g>

                {/* Migration Pipeline */}
                <g transform="translate(235, 125)">
                    <rect width="135" height="75" rx="8" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="67.5" y="22" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="700">Asset Migration</text>
                    <text x="67.5" y="36" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">S3 → Repository Based</text>
                    <text x="67.5" y="55" fill="var(--muted)" fontSize="8" textAnchor="middle">page-service-api</text>
                    <text x="67.5" y="67" fill="var(--muted)" fontSize="8" textAnchor="middle">payment-integration-api</text>
                </g>

                {/* Repository Assets */}
                <g transform="translate(285, 45)">
                    <rect width="130" height="90" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="65" y="22" fill="var(--foreground)" fontSize="11" textAnchor="middle" fontWeight="600">Repository Assets</text>
                    <text x="65" y="40" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">src/assets/theme</text>
                    <text x="65" y="58" fill="var(--muted)" fontSize="8" textAnchor="middle">• Marketplace icons</text>
                    <text x="65" y="70" fill="var(--muted)" fontSize="8" textAnchor="middle">• GCash / Maya / Stripe</text>
                    <text x="65" y="82" fill="var(--muted)" fontSize="8" textAnchor="middle">• Theme previews</text>
                </g>

                {/* Restored Merchant Stores */}
                <g transform="translate(60, 225)">
                    <rect width="400" height="65" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1.5" />
                    <text x="200" y="18" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="700">Restored Merchant Storefronts</text>

                    <rect x="15" y="30" width="70" height="25" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1" />
                    <text x="50" y="45" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Balipura</text>

                    <rect x="93" y="30" width="70" height="25" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1" />
                    <text x="128" y="45" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Croia</text>

                    <rect x="171" y="30" width="70" height="25" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1" />
                    <text x="206" y="45" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Firehouse Pizza</text>

                    <rect x="249" y="30" width="70" height="25" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1" />
                    <text x="284" y="45" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Fruit Gals</text>

                    <rect x="327" y="30" width="60" height="25" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1" />
                    <text x="357" y="45" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Tintin</text>
                </g>
            </svg>
        </div>
    );
}