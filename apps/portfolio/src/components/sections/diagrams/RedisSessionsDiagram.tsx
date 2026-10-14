"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function RedisSessionsDiagram({ variant }: DiagramProps) {
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
                        <text x="50" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">App Nodes</text>
                    </g>
                    <g transform="translate(150, 30)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">Redis Primary</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Replicas</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Distributed Redis Replication Model (Expanded)</h5>
            <svg viewBox="0 0 500 280" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                    <marker id="arrow-sync" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                    </marker>
                </defs>

                {/* App connection to Redis Primary */}
                <path d="M 250 65 L 250 95" stroke="var(--card-border)" strokeWidth="2" strokeDasharray="3 3" fill="none" markerEnd="url(#arrow)" />

                {/* Replication Streams */}
                <motion.path
                    d="M 205 130 L 130 170"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow-sync)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <motion.path
                    d="M 295 130 L 370 170"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow-sync)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Sentinel Monitor Connections */}
                <path d="M 170 230 L 105 205" stroke="var(--card-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 250 230 L 250 140" stroke="var(--card-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 330 230 L 395 205" stroke="var(--card-border)" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Web Server instances */}
                <g transform="translate(140, 15)">
                    <rect width="220" height="45" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="110" y="24" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Distributed App Server Instances</text>
                    <text x="110" y="36" fill="var(--muted)" fontSize="8" textAnchor="middle">Next.js Dashboard & Python microservices</text>
                </g>

                {/* Redis Primary */}
                <g transform="translate(195, 95)">
                    <rect width="110" height="45" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="55" y="24" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="700">Redis Primary</text>
                    <text x="55" y="36" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Read / Write</text>
                </g>

                {/* Redis Replicas */}
                <g transform="translate(50, 170)">
                    <rect width="110" height="45" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="55" y="24" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Redis Replica 1</text>
                    <text x="55" y="36" fill="var(--muted)" fontSize="8" textAnchor="middle">Read Only Sync</text>
                </g>

                <g transform="translate(340, 170)">
                    <rect width="110" height="45" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="55" y="24" fill="var(--foreground)" fontSize="10" textAnchor="middle" fontWeight="600">Redis Replica 2</text>
                    <text x="55" y="36" fill="var(--muted)" fontSize="8" textAnchor="middle">Read Only Sync</text>
                </g>

                {/* Sentinel HA Monitor */}
                <g transform="translate(160, 230)">
                    <rect width="180" height="40" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1.5" />
                    <text x="90" y="16" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Redis Sentinel cluster</text>
                    <text x="90" y="28" fill="var(--accent-light)" fontSize="8" textAnchor="middle" fontWeight="600">Failover & Replication Monitor</text>
                </g>
            </svg>
        </div>
    );
}