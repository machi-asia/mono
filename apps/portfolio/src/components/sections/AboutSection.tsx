"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Briefcase, Code, Award, GraduationCap, Maximize2 } from "lucide-react";
import Card from "../Card";
import Dialog from "../Dialog";
import type { Certificate, GitHubRepo, WorkCompany, Education } from "../../data/types";
import { calculateTotalExperience, formatExperience, formatExperienceLong } from "../../utils/experienceCalculator";

export interface AboutSectionProps {
    repos?: GitHubRepo[];
    certificates?: Certificate[];
    workCompanies?: WorkCompany[];
    education?: Education[];
}

interface SelectedDiploma {
    title: string;
    school: string;
    images: string[];
}

const MANIFESTO_TEXT =
    "Our software engineering practice builds scalable architecture, robust distributed backends, and intuitive reactive interfaces. Driven by curiosity and craft, we believe enduring technical solutions synchronize deep systems analysis with thoughtful aesthetic restraint.";

const MANIFESTO_WORDS = MANIFESTO_TEXT.split(" ");

interface ManifestoWordProps {
    word: string;
    index: number;
    total: number;
    progress: MotionValue<number>;
}

function ManifestoWord({ word, index, total, progress }: ManifestoWordProps) {
    const start = (index / total) * 0.72;
    const end = Math.min(start + 0.28, 1);
    const opacity = useTransform(progress, [start, end], [0.45, 1]);
    const y = useTransform(progress, [start, end], [6, 0]);

    return (
        <motion.span
            data-testid="manifesto-word"
            style={{
                opacity,
                y,
                display: "inline-block",
                marginRight: "0.28em",
                willChange: "opacity, transform",
            }}
        >
            {word}
        </motion.span>
    );
}

export default function AboutSection({
    repos = [],
    certificates = [],
    workCompanies = [],
    education = [],
}: AboutSectionProps = {}) {
    const [selectedDiploma, setSelectedDiploma] = useState<SelectedDiploma | null>(null);
    const manifestoRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: manifestoRef,
        offset: ["start 0.85", "end 0.35"],
    });

    const backingPanelY = useTransform(scrollYProgress, [0, 1], [-24, 32]);
    const invertSlabX = useTransform(scrollYProgress, [0, 1], ["-12%", "64%"]);
    const invertSlabY = useTransform(scrollYProgress, [0, 1], ["12%", "76%"]);

    const { formattedExperience, formattedExperienceLong } = useMemo(() => {
        if (!workCompanies || workCompanies.length === 0) {
            return { formattedExperience: "0 mos", formattedExperienceLong: "0 months" };
        }
        const periods = workCompanies.map((company) => company.period);
        const { years, months } = calculateTotalExperience(periods);
        return {
            formattedExperience: formatExperience(years, months),
            formattedExperienceLong: formatExperienceLong(years, months),
        };
    }, [workCompanies]);

    const totalCertificates = useMemo(() => {
        return certificates.reduce((total, cert) => total + 1 + (cert.subCertificates?.length || 0), 0);
    }, [certificates]);

    return (
        <section
            id="about"
            className="section chapter-shade-abyss"
            style={{
                position: "relative",
                backgroundColor: "var(--shade-abyss, #08080b)",
                border: "none",
            }}
        >
            {/* Scroll-Scrubbed Engineering Manifesto Stage */}
            <div
                ref={manifestoRef}
                className="sp-editorial-intro-layout"
                style={{
                    position: "relative",
                    zIndex: 2,
                    borderBottom: "none",
                }}
            >
                {/* Graphite Parallax Backing Panel */}
                <motion.div
                    aria-hidden="true"
                    data-testid="about-parallax-panel"
                    style={{
                        position: "absolute",
                        top: "14%",
                        right: "-3%",
                        width: "74%",
                        height: "76%",
                        backgroundColor: "var(--shade-graphite, #17171d)",
                        y: backingPanelY,
                        pointerEvents: "none",
                        willChange: "transform",
                        zIndex: 0,
                    }}
                />

                <div className="sp-editorial-left" style={{ position: "relative", zIndex: 2 }}>
                    <div className="sp-editorial-pinned-name">Angelo Kamachi</div>
                </div>

                <div className="sp-editorial-right" style={{ position: "relative", zIndex: 2 }}>
                    {/* Scroll-Driven Inverted Slab Inverting Manifesto Words */}
                    <motion.div
                        aria-hidden="true"
                        data-testid="about-parallax-invert-shape"
                        className="invert-blend-shape"
                        style={{
                            position: "absolute",
                            top: invertSlabY,
                            left: invertSlabX,
                            width: "clamp(130px, 18vw, 230px)",
                            height: "52px",
                            borderRadius: "9999px",
                            backgroundColor: "var(--shade-inversion, #f4f4f0)",
                            mixBlendMode: "difference",
                            pointerEvents: "none",
                            willChange: "transform",
                            zIndex: 4,
                        }}
                    />

                    <p
                        className="sp-editorial-statement"
                        style={{
                            position: "relative",
                            zIndex: 2,
                            color: "var(--shade-inversion, #f4f4f0)",
                        }}
                    >
                        {MANIFESTO_WORDS.map((word, idx) => (
                            <ManifestoWord
                                key={`${word}-${idx}`}
                                word={word}
                                index={idx}
                                total={MANIFESTO_WORDS.length}
                                progress={scrollYProgress}
                            />
                        ))}
                    </p>
                </div>
            </div>

            {/* Split Stage: Profile & Borderless Stats on Left, Education Timeline on Right */}
            <div className="sp-about-split-stage" style={{ position: "relative", zIndex: 2 }}>
                <div className="sp-about-pinned-col">
                    <div className="section-header-wrap" style={{ marginBottom: "0.75rem" }}>
                        <h2 className="section-title">
                            About <span className="gradient-text">Me</span>
                        </h2>
                    </div>

                    <div>
                        <p className="about-statement">
                            Architecting modern web applications and developer infrastructure with craft and precision.
                        </p>
                        <p className="about-text">
                            I&apos;m a passionate Full Stack Developer and software architect with over {formattedExperienceLong} of experience building enterprise web applications, high-concurrency APIs, machine learning pipelines, and fluid reactive UI systems.
                        </p>
                    </div>

                    {/* Borderless Multi-Shade Stat Strip */}
                    <div
                        className="about-stats-grid"
                        style={{
                            border: "none",
                            backgroundColor: "transparent",
                            gap: "0.75rem",
                        }}
                    >
                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Card
                                className="about-stat-card"
                                style={{ backgroundColor: "var(--shade-carbon, #0c0c10)", border: "none", borderRadius: "6px" }}
                            >
                                <Briefcase className="about-stat-icon" />
                                <div className="about-stat-value">{formattedExperience}</div>
                                <div className="about-stat-label">Experience</div>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Card
                                className="about-stat-card"
                                style={{ backgroundColor: "var(--shade-charcoal, #111116)", border: "none", borderRadius: "6px" }}
                            >
                                <Code className="about-stat-icon" />
                                <div className="about-stat-value">{repos.length > 0 ? `${repos.length}+` : "0"}</div>
                                <div className="about-stat-label">Projects</div>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Card
                                className="about-stat-card"
                                style={{ backgroundColor: "var(--shade-graphite, #17171d)", border: "none", borderRadius: "6px" }}
                            >
                                <Award className="about-stat-icon" />
                                <div className="about-stat-value">{totalCertificates > 0 ? `${totalCertificates}+` : "0"}</div>
                                <div className="about-stat-label">Certificates</div>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Borderless Education & Credentials List */}
                <div className="sp-about-scroll-col">
                    <div
                        className="education-card"
                        style={{
                            border: "none",
                            background: "var(--shade-carbon, #0c0c10)",
                            padding: "1.75rem",
                            borderRadius: "8px",
                        }}
                    >
                        <div className="education-header" style={{ marginBottom: "1.5rem", borderBottom: "none" }}>
                            <h3 className="education-title" style={{ fontSize: "1.125rem" }}>
                                <GraduationCap className="education-icon" />
                                Education &amp; Credentials
                            </h3>
                        </div>

                        {education.length === 0 ? (
                            <p style={{ fontSize: "0.875rem", color: "var(--muted, #8e8e96)" }}>
                                Academic credentials updated dynamically.
                            </p>
                        ) : (
                            <div
                                className="education-list"
                                style={{
                                    position: "relative",
                                    gap: "0.75rem",
                                }}
                            >
                                {education.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0.08, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: "some" }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="education-item"
                                        style={{
                                            position: "relative",
                                            backgroundColor:
                                                idx % 2 === 0
                                                    ? "var(--shade-charcoal, #111116)"
                                                    : "var(--shade-graphite, #17171d)",
                                            border: "none",
                                            borderRadius: "6px",
                                            padding: "1.25rem",
                                        }}
                                    >
                                        {item.icon && (
                                            <div className="education-item-icon-wrapper">
                                                <div
                                                    className="education-item-icon"
                                                    style={{
                                                        WebkitMaskImage: `url(${item.icon})`,
                                                        maskImage: `url(${item.icon})`,
                                                    }}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        )}

                                        <div className="education-item-content">
                                            <div className="education-item-title">{item.degree}</div>
                                            <div className="education-item-subtitle">
                                                {item.school} • {item.period}
                                            </div>

                                            {item.diplomaImages && item.diplomaImages.length > 0 && (
                                                <div className="education-diploma-strip" style={{ marginTop: "1rem" }}>
                                                    {item.diplomaImages.map((imgSrc, imgIdx) => (
                                                        <button
                                                            key={imgIdx}
                                                            type="button"
                                                            className="education-diploma-thumb-wrap"
                                                            data-cursor="INSPECT"
                                                            aria-label={`View ${item.degree} diploma ${imgIdx + 1}`}
                                                            onClick={() =>
                                                                setSelectedDiploma({
                                                                    title: item.degree,
                                                                    school: item.school,
                                                                    images: item.diplomaImages || [],
                                                                })
                                                            }
                                                            style={{
                                                                border: "none",
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <Image
                                                                src={imgSrc}
                                                                alt={`${item.degree} preview`}
                                                                fill
                                                                className="education-diploma-thumb-img"
                                                                sizes="96px"
                                                            />
                                                            <span className="education-diploma-overlay">
                                                                <Maximize2 size={12} />
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactive Diploma Inspection Dialog */}
            <Dialog
                open={selectedDiploma !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedDiploma(null);
                }}
                className="diploma-preview-dialog"
            >
                {selectedDiploma && (
                    <div className="diploma-modal-content">
                        <div className="diploma-modal-header">
                            <h3 className="diploma-modal-title">{selectedDiploma.title}</h3>
                            <p className="diploma-modal-subtitle">{selectedDiploma.school}</p>
                        </div>
                        <div className="diploma-modal-gallery">
                            {selectedDiploma.images.map((imgSrc, idx) => (
                                <div key={idx} className="diploma-modal-image-wrap">
                                    <Image
                                        src={imgSrc}
                                        alt={selectedDiploma.title}
                                        fill
                                        className="diploma-modal-image"
                                        sizes="(max-width: 768px) 100vw, 800px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Dialog>
        </section>
    );
}
