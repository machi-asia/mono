"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, ArrowUpRight } from "lucide-react";
import Button from "../Button";
import Avatar from "../Avatar";
import Tooltip from "../Tooltip";
import { GithubIcon, LinkedinIcon } from "../social-icons";
import { profile } from "../../data/profile";

interface FooterProps {
    onContactOpen?: () => void;
}

export default function Footer({ onContactOpen }: FooterProps) {
    const [footerAvatarSrc, setFooterAvatarSrc] = useState("/images/standard-cut-hero.webp");
    const [isFooterGlitching, setIsFooterGlitching] = useState(false);

    useEffect(() => {
        const images = ["/images/standard-cut-hero.webp", "/icons/logo.svg"];
        let glitchTimeout: ReturnType<typeof setTimeout>;

        const triggerGlitch = () => {
            setIsFooterGlitching(true);
            let swapCount = 0;
            const maxSwaps = Math.floor(Math.random() * 6) + 4;

            const swapInterval = setInterval(() => {
                setFooterAvatarSrc(images[Math.floor(Math.random() * 2)]);
                swapCount++;

                if (swapCount >= maxSwaps) {
                    clearInterval(swapInterval);
                    setFooterAvatarSrc(images[Math.floor(Math.random() * 2)]);
                    setTimeout(() => {
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

        return () => clearTimeout(glitchTimeout);
    }, []);

    const [currentTime, setCurrentTime] = useState("12:00:00");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            const s = String(now.getSeconds()).padStart(2, "0");
            setCurrentTime(`${h}:${m}:${s}`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="footer footer-sp-reveal" style={{ position: "relative", overflow: "hidden" }}>
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-topography" />
            </div>

            <div className="footer-container" style={{ position: "relative", zIndex: 1 }}>
                <div className="footer-main-grid">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
                            <Avatar
                                src={footerAvatarSrc}
                                alt="Angelo Justine D. Kamachi"
                                fallback="AJ"
                                size="md"
                                isGlitching={isFooterGlitching}
                            />
                        </div>
                        <h2 className="footer-statement">
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
                        >
                            <span className="flip-text-holder">
                                <span className="flip-text-1">Start a Conversation</span>
                                <span className="flip-text-2" aria-hidden="true">Start a Conversation</span>
                            </span>
                        </Button>
                        <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                            Direct inquiries: <a href="mailto:ajdkamachi@gmail.com" style={{ color: "var(--foreground)", textDecoration: "none" }}>ajdkamachi@gmail.com</a>
                        </span>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} {profile.name}. All rights reserved.
                    </p>
                    <span className="footer-sp-clock">MANILA • {currentTime}</span>

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
                                href={`mailto:${profile.email}`}
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
