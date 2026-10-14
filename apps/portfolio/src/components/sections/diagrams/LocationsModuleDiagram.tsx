"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function LocationsModuleDiagram({ variant }: DiagramProps) {
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
                    <path d="M 110 55 L 140 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />
                    <path d="M 260 55 L 290 55" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-c)" />

                    <g transform="translate(10, 30)">
                        <rect width="100" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="50" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Dashboard</text>
                    </g>
                    <g transform="translate(150, 30)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Backend API</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Storefront</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Multi-Layer Locations Module Architecture (Expanded)</h5>
            <svg viewBox="0 0 500 300" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                </defs>

                {/* Horizontal flows */}
                <motion.path
                    d="M 160 85 L 210 85"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <motion.path
                    d="M 320 85 L 370 85"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Store picture upload flow */}
                <path d="M 395 130 L 395 160 L 120 160 L 120 130" stroke="var(--card-border)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" markerEnd="url(#arrow)" />

                {/* Dashboard Node */}
                <g transform="translate(30, 30)">
                    <rect width="130" height="110" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="65" y="22" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="700">Merchant Dashboard</text>
                    <text x="65" y="40" fill="var(--muted)" fontSize="8" textAnchor="middle">prosperna1</text>

                    <rect x="10" y="55" width="110" height="22" rx="4" fill="transparent" stroke="var(--card-border)" />
                    <text x="65" y="70" fill="var(--foreground)" fontSize="8" textAnchor="middle">Media upload modal</text>
                    <rect x="10" y="80" width="110" height="22" rx="4" fill="transparent" stroke="var(--card-border)" />
                    <text x="65" y="95" fill="var(--foreground)" fontSize="8" textAnchor="middle">Drag & drop reorder</text>
                </g>

                {/* Backend Node */}
                <g transform="translate(210, 55)">
                    <rect width="110" height="60" rx="8" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="55" y="22" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="700">Backend API</text>
                    <text x="55" y="36" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">business-profile-api</text>
                    <text x="55" y="50" fill="var(--muted)" fontSize="7" textAnchor="middle">storePicture schema</text>
                </g>

                {/* Storefront Node */}
                <g transform="translate(370, 30)">
                    <rect width="100" height="100" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="50" y="22" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="700">Buyer Storefront</text>
                    <text x="50" y="38" fill="var(--muted)" fontSize="8" textAnchor="middle">p1-customer</text>

                    <rect x="10" y="52" width="80" height="38" rx="4" fill="transparent" stroke="var(--accent)" strokeWidth="1" />
                    <text x="50" y="66" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Branch Photo</text>
                    <text x="50" y="78" fill="var(--muted)" fontSize="7" textAnchor="middle">hires location card</text>
                </g>

                {/* Database */}
                <g transform="translate(165, 210)">
                    <rect width="170" height="45" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="85" y="20" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">StoreLocation Records</text>
                    <text x="85" y="34" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Position index & storePicture</text>
                </g>
            </svg>
        </div>
    );
}