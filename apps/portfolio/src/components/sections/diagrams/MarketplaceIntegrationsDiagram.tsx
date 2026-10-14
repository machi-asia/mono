"use client";

import { motion } from "framer-motion";

interface DiagramProps {
    variant: "compact" | "detailed";
}

export default function MarketplaceIntegrationsDiagram({ variant }: DiagramProps) {
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
                        <text x="50" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Legacy Plans</text>
                    </g>
                    <g transform="translate(150, 30)">
                        <rect width="110" height="50" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="55" y="30" fill="var(--accent-light)" fontSize="9" textAnchor="middle" fontWeight="700">GROW / SCALE</text>
                    </g>
                    <g transform="translate(300, 30)">
                        <rect width="90" height="50" rx="6" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                        <text x="45" y="30" fill="var(--foreground)" fontSize="9" textAnchor="middle" fontWeight="600">Integrations</text>
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="exp-diagram-wrapper exp-diagram-wrapper-detailed">
            <h5 className="exp-diagram-title">Marketplace Plan Tier & Empty-State Refresh (Expanded)</h5>
            <svg viewBox="0 0 520 280" className="exp-diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--card-border)" />
                    </marker>
                    <marker id="arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
                    </marker>
                </defs>

                {/* Flow */}
                <path d="M 260 95 L 260 130" stroke="var(--card-border)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                <motion.path
                    d="M 260 170 L 260 200"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow-accent)"
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [100, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Integrations */}
                <g transform="translate(40, 20)">
                    <rect width="440" height="75" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="2" />
                    <text x="15" y="22" fill="var(--foreground)" fontSize="10" fontWeight="700">Marketplace & Payment Integrations</text>

                    {["Lazada", "Shopee", "J&T", "Lalamove", "Stripe"].map((name, i) => (
                        <rect key={name} x={15 + i * 86} y="34" width="76" height="30" rx="4" fill="transparent" stroke="var(--card-border)" />
                    ))}
                    <text x="53" y="52" fill="var(--foreground)" fontSize="8" textAnchor="middle">Lazada</text>
                    <text x="139" y="52" fill="var(--foreground)" fontSize="8" textAnchor="middle">Shopee</text>
                    <text x="225" y="52" fill="var(--foreground)" fontSize="8" textAnchor="middle">J&T Express</text>
                    <text x="311" y="52" fill="var(--foreground)" fontSize="8" textAnchor="middle">Lalamove</text>
                    <text x="397" y="52" fill="var(--foreground)" fontSize="8" textAnchor="middle">Stripe</text>
                </g>

                {/* Tier Migration */}
                <g transform="translate(175, 130)">
                    <rect width="170" height="40" rx="6" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="2" />
                    <text x="15" y="26" fill="#fb7185" fontSize="9" fontWeight="600">PRO / PREMIUM</text>
                    <text x="100" y="25" fill="var(--accent-light)" fontSize="9" fontWeight="700">→ GROW / SCALE</text>
                </g>

                {/* Empty-State Icons */}
                <g transform="translate(40, 200)">
                    <rect width="440" height="65" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1.5" />
                    <text x="15" y="22" fill="var(--foreground)" fontSize="10" fontWeight="700">Redesigned Empty-State SVG Illustrations</text>
                    {["Contacts", "Orders", "Inventory", "Categories", "Add-ons", "Reviews", "Discounts", "Blogs"].map((name, i) => (
                        <rect key={name} x={15 + i * 54} y="32" width="46" height="24" rx="4" fill="transparent" stroke="var(--card-border)" />
                    ))}
                    <text x="38" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Contacts</text>
                    <text x="92" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Orders</text>
                    <text x="146" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Inventory</text>
                    <text x="200" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Categories</text>
                    <text x="254" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Add-ons</text>
                    <text x="308" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Reviews</text>
                    <text x="362" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Discounts</text>
                    <text x="416" y="48" fill="var(--muted)" fontSize="6" textAnchor="middle">Blogs</text>
                </g>
            </svg>
        </div>
    );
}