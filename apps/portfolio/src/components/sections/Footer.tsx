"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import Button from "../Button";
import Avatar from "../Avatar";
import Tooltip from "../Tooltip";
import { GithubIcon, LinkedinIcon } from "../social-icons";
import { profile } from "../../data/profile";

export interface FooterProps {
    onContactOpen?: () => void;
}

export default function Footer({ onContactOpen }: FooterProps) {
    const [footerAvatarSrc, setFooterAvatarSrc] = useState("/images/standard-cut-hero.webp");
    const [isFooterGlitching, setIsFooterGlitching] = useState(false);
    const [copied, setCopied] = useState(false);
    const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Ambient avatar glitch effect with full timer cleanup
    useEffect(() => {
        const images = ["/images/standard-cut-hero.webp", "/icons/logo.svg"];
        let glitchTimeout: ReturnType<typeof setTimeout> | undefined;
        let swapInterval: ReturnType<typeof setInterval> | undefined;
        let resetTimeout: ReturnType<typeof setTimeout> | undefined;

        const triggerGlitch = () => {
            setIsFooterGlitching(true);
            let swapCount = 0;
            const maxSwaps = Math.floor(Math.random() * 6) + 4;

            swapInterval = setInterval(() => {
                setFooterAvatarSrc(images[Math.floor(Math.random() * 2)]);
                swapCount++;

                if (swapCount >= maxSwaps) {
                    if (swapInterval) clearInterval(swapInterval);
                    setFooterAvatarSrc(images[Math.floor(Math.random() * 2)]);
                    resetTimeout = setTimeout(() => {
                        setIsFooterGlitching(false);
                    }, 100);
                }
            }, 50 + Math.random() * 50);
        };

        const scheduleNextGlitch = () => {
            const delay = 4000 + Math.random() * 5000;
            return setTimeout(() => {
                triggerGlitch();
                glitchTimeout = scheduleNextGlitch();
            }, delay);
        };

        glitchTimeout = scheduleNextGlitch();

        return () => {
            if (glitchTimeout) clearTimeout(glitchTimeout);
            if (swapInterval) clearInterval(swapInterval);
            if (resetTimeout) clearTimeout(resetTimeout);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (copyResetRef.current) clearTimeout(copyResetRef.current);
        };
    }, []);

    const handleCopyEmail = async () => {
        const email = profile.email.professional;
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(email);
            }
        } catch {
            // Clipboard permission may be unavailable in restricted contexts
        }
        setCopied(true);
        if (copyResetRef.current) clearTimeout(copyResetRef.current);
        copyResetRef.current = setTimeout(() => {
            setCopied(false);
        }, 2200);
    };

    const contactEmail = profile.email.professional;

    return (
        <footer
            className="footer footer-sp-reveal chapter-shade-void"
            style={{
                position: "relative",
                backgroundColor: "var(--shade-void, #020203)",
                color: "var(--shade-inversion, #f4f4f0)",
                borderTop: "none",
                overflowX: "clip",
            }}
        >
            <div className="footer-container" style={{ position: "relative", zIndex: 2 }}>
                <div className="footer-main-grid">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
                            <Avatar
                                src={footerAvatarSrc}
                                alt={profile.name}
                                fallback="AJ"
                                size="md"
                                isGlitching={isFooterGlitching}
                            />
                            <div style={{ display: "flex", flexDirection: "column", fontSize: "0.875rem" }}>
                                <span style={{ color: "var(--shade-inversion, #f4f4f0)", fontWeight: 600 }}>
                                    {profile.name}
                                </span>
                                <span style={{ color: "var(--muted, #8e8e96)" }}>
                                    {profile.title}
                                </span>
                            </div>
                        </div>

                        <h2
                            className="footer-statement invert-blend-text"
                            style={{
                                mixBlendMode: "difference",
                                color: "var(--shade-inversion, #f4f4f0)",
                            }}
                        >
                            Let&apos;s Work Together
                        </h2>
                        <p className="footer-subtitle">
                            Available for software engineering, architecture consulting, and full-stack contracts.
                        </p>
                    </div>

                    <div className="footer-actions">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onContactOpen}
                            rightIcon={<ArrowUpRight size={18} />}
                            data-cursor="CONTACT"
                        >
                            <span className="flip-text-holder">
                                <span className="flip-text-1">Start a Conversation</span>
                                <span className="flip-text-2" aria-hidden="true">
                                    Start a Conversation
                                </span>
                            </span>
                        </Button>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                data-cursor="COPY"
                                aria-label={`Copy email ${contactEmail}`}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.55rem",
                                    padding: "0.6rem 1rem",
                                    backgroundColor: copied
                                        ? "var(--shade-inversion, #f4f4f0)"
                                        : "var(--shade-charcoal, #111116)",
                                    color: copied
                                        ? "var(--shade-void, #020203)"
                                        : "var(--shade-inversion, #f4f4f0)",
                                    border: "none",
                                    borderRadius: "9999px",
                                    cursor: "pointer",
                                    fontSize: "0.8125rem",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copied ? "Copied" : contactEmail}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Colophon */}
                <div className="footer-bottom" style={{ borderTop: "none" }}>
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} {profile.name}. All rights reserved.
                    </p>

                    <div className="footer-social">
                        <Tooltip content="GitHub Profile">
                            <a
                                href={profile.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link"
                                aria-label="GitHub Profile"
                            >
                                <GithubIcon size={18} />
                            </a>
                        </Tooltip>

                        <Tooltip content="LinkedIn Profile">
                            <a
                                href={profile.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link"
                                aria-label="LinkedIn Profile"
                            >
                                <LinkedinIcon size={18} />
                            </a>
                        </Tooltip>

                        <Tooltip content="Direct Email">
                            <a
                                href={`mailto:${contactEmail}`}
                                className="footer-social-link"
                                aria-label="Direct Email"
                            >
                                <Mail size={18} />
                            </a>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </footer>
    );
}
