"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Download,
    Terminal,
} from "lucide-react";
import Image from "next/image";
import Button from "../Button";
import Badge from "../Badge";
import Avatar from "../Avatar";
import { heroTitles } from "../../data/tech-stack";
import type { Certificate, GitHubRepo, WorkCompany } from "../../data/types";
import { calculateTotalExperience, formatExperience } from "../../utils/experienceCalculator";

interface HeroSectionProps {
    onContactOpen: () => void;
    repos?: GitHubRepo[];
    certificates?: Certificate[];
    workCompanies?: WorkCompany[];
}

const TECH_PILLS = [
    { name: "TypeScript", icon: "/icons/typescript.svg" },
    { name: "Next.js", icon: "/icons/next.svg" },
    { name: "React", icon: "/icons/react.svg" },
    { name: "Node.js", icon: "/icons/node.webp" },
    { name: "Python", icon: "/icons/python.svg" },
    { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
    { name: "Docker", icon: "/icons/docker.svg" },
    { name: "Supabase", icon: "/icons/supabase.svg" },
];

export default function HeroSection({
    onContactOpen,
    repos = [],
    certificates = [],
    workCompanies = [],
}: HeroSectionProps) {
    const heroRef = useRef<HTMLDivElement | null>(null);

    // Live ticking clock for Stewart & Partners architectural header
    const [currentTime, setCurrentTime] = useState("12:00:00");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            const s = String(now.getSeconds()).padStart(2, "0");
            setCurrentTime(`${h}:${m}:${s}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Scroll-driven curtain spacer calculation
    useEffect(() => {
        const el = heroRef.current;
        if (!el || typeof window === "undefined") return;

        let rafId: number;
        const updateCurtainProgress = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight || 1;
            const scrollDistance = Math.max(rect.height - vh, 1);
            const rawProgress = -rect.top / scrollDistance;
            const progress = Math.min(Math.max(rawProgress, 0), 1);
            el.style.setProperty("--sp-hero-progress", progress.toFixed(4));
        };

        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateCurtainProgress);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateCurtainProgress();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    // Typing animation state
    const [titleIndex, setTitleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate years and months of experience from work history
    const formattedExperience = useMemo(() => {
        if (!workCompanies || workCompanies.length === 0) return "0 mos";
        const periods = workCompanies.map((company) => company.period);
        const { years, months } = calculateTotalExperience(periods);
        return formatExperience(years, months);
    }, [workCompanies]);

    // Find ongoing company experience
    const ongoingCompany = useMemo(() => {
        if (!workCompanies || workCompanies.length === 0) return null;
        return workCompanies.find((company) => {
            if (!company.period) return false;
            const parts = company.period.split(/[-–—]| to /i).map((s) => s.trim());
            const endDate = parts[1] || parts[0];
            return /^present$/i.test(endDate);
        });
    }, [workCompanies]);

    const totalCertificates = useMemo(() => {
        return certificates.reduce((total, cert) => total + 1 + (cert.subCertificates?.length || 0), 0);
    }, [certificates]);

    // Typing animation effect
    useEffect(() => {
        const currentTitle = heroTitles[titleIndex] || "Full Stack Developer";
        const typingSpeed = isDeleting ? 15 : 45;
        const pauseTime = 2500;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayedText.length < currentTitle.length) {
                    setDisplayedText(currentTitle.slice(0, displayedText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                if (displayedText.length > 0) {
                    setDisplayedText(displayedText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setTitleIndex((prev) => (prev + 1) % heroTitles.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, titleIndex]);

    return (
        <section
            ref={heroRef}
            id="hero"
            className="sp-hero-container"
            style={{ position: "relative" }}
        >
            <div className="sp-hero-sticky-frame">
                {/* S&P Architectural Top Info Bar */}
                <div className="sp-hero-top-info">
                    <div>Software & Architecture</div>
                    <div>Full-Stack Systems</div>
                    <div className="sp-hero-top-coords">
                        14° 35&apos; 52.8&quot; N 121° 01&apos; 08.4&quot; E<br />
                        <span>{currentTime}</span>
                    </div>
                </div>

                {/* Main Interactive Stage */}
                <div className="sp-hero-main-layout">
                    {/* Left Typography Box */}
                    <div className="sp-hero-left-title-box">
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <Avatar
                                src="/images/standard-cut-hero.webp"
                                alt="Profile"
                                fallback="AJ"
                                size="md"
                                className="hero-avatar"
                            />
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span
                                    style={{
                                        width: "7px",
                                        height: "7px",
                                        borderRadius: "50%",
                                        background: "#10b981",
                                        display: "inline-block",
                                    }}
                                />
                                <Badge variant="default" size="sm">
                                    {ongoingCompany ? `At ${ongoingCompany.company}` : "Available for select projects"}
                                </Badge>
                            </div>
                        </div>

                        <h1 className="sp-hero-huge-title">
                            Angelo Justine D. Kamachi
                        </h1>

                        <div className="sp-hero-sub-meta">
                            <p className="hero-subtitle" style={{ margin: 0 }}>
                                <Terminal
                                    size={18}
                                    style={{ marginRight: "0.75rem", color: "var(--muted)", flexShrink: 0 }}
                                />
                                <span>
                                    <span className="typing-text">{displayedText}</span>
                                    <span className="typing-cursor">_</span>
                                </span>
                            </p>

                            <div className="hero-cta" style={{ marginBottom: "1rem" }}>
                                <Button
                                    variant="primary"
                                    onClick={onContactOpen}
                                    rightIcon={<ArrowUpRight size={16} />}
                                >
                                    <span className="flip-text-holder">
                                        <span className="flip-text-1">Get in Touch</span>
                                        <span className="flip-text-2" aria-hidden="true">
                                            Get in Touch
                                        </span>
                                    </span>
                                </Button>
                                <a href="#featured" className="btn btn-secondary">
                                    <span className="flip-text-holder">
                                        <span className="flip-text-1">View Work</span>
                                        <span className="flip-text-2" aria-hidden="true">
                                            View Work
                                        </span>
                                    </span>
                                </a>
                                <a
                                    href="/documents/prosperna_report.pdf"
                                    download
                                    className="btn btn-secondary"
                                >
                                    <Download size={16} />
                                    <span className="flip-text-holder">
                                        <span className="flip-text-1">Resume</span>
                                        <span className="flip-text-2" aria-hidden="true">
                                            Resume
                                        </span>
                                    </span>
                                </a>
                            </div>

                            {/* Tech ribbon */}
                            <div className="hero-tech-ribbon" style={{ marginBottom: "1rem" }}>
                                {TECH_PILLS.map((tech) => (
                                    <div key={tech.name} className="hero-tech-chip">
                                        <Image
                                            src={tech.icon}
                                            alt={tech.name}
                                            width={18}
                                            height={18}
                                            className="hero-tech-icon"
                                        />
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="hero-stats">
                                <div>
                                    <div className="hero-stat-value">{formattedExperience}</div>
                                    <div className="hero-stat-label">Experience</div>
                                </div>
                                <div>
                                    <div className="hero-stat-value">
                                        {repos.length > 0 ? `${repos.length}+` : "0"}
                                    </div>
                                    <div className="hero-stat-label">Projects</div>
                                </div>
                                <div>
                                    <div className="hero-stat-value">
                                        {totalCertificates > 0 ? `${totalCertificates}+` : "0"}
                                    </div>
                                    <div className="hero-stat-label">Certificates</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Wireframe Architectural Showreel Card */}
                    <a href="#featured" className="sp-hero-wireframe-box" aria-label="Watch Showreel">
                        <div className="sp-wireframe-diagonal" />
                        <div className="sp-wireframe-cross-v" />
                        <div className="sp-wireframe-cross-h" />
                        <div className="sp-wireframe-label">Showreel ©2026</div>
                    </a>
                </div>

                {/* S&P Curtain Spacer Collapse: Rises On Scroll & Slices Across Title */}
                <div className="sp-hero-curtain-overlay-wrap">
                    <div className="sp-hero-curtain-spacer" />
                    <div className="sp-hero-curtain-image-holder">
                        <Image
                            src="/images/preview.webp"
                            alt="Architectural Backdrop"
                            fill
                            className="sp-hero-curtain-img"
                            sizes="100vw"
                            priority
                        />
                        <div className="sp-hero-curtain-darken" />
                    </div>
                </div>
            </div>
        </section>
    );
}
