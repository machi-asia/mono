"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Briefcase, Code, Award, GraduationCap, Maximize2 } from "lucide-react";
import Card from "../Card";
import Dialog from "../Dialog";
import type { Certificate, GitHubRepo, WorkCompany, Education } from "../../data/types";
import { calculateTotalExperience, formatExperience, formatExperienceLong } from "../../utils/experienceCalculator";

interface AboutSectionProps {
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

export default function AboutSection({
    repos = [],
    certificates = [],
    workCompanies = [],
    education = [],
}: AboutSectionProps = {}) {
    const [selectedDiploma, setSelectedDiploma] = useState<SelectedDiploma | null>(null);

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
        <section id="about" className="section" style={{ position: "relative" }}>
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-diagonal" />
            </div>

            {/* S&P Editorial Manifesto Transition (Screenshot 2) */}
            <div className="sp-editorial-intro-layout">
                <div className="sp-editorial-left">
                    <div className="sp-editorial-code">a120/03<br />AK_dev</div>
                    <div className="sp-editorial-pinned-name">Angelo Kamachi</div>
                </div>
                <div className="sp-editorial-right">
                    <h2 className="sp-editorial-statement">
                        Our software engineering practice builds scalable architecture, robust distributed backends, and intuitive reactive interfaces. Driven by curiosity and craft, we believe enduring technical solutions synchronise deep systems analysis with thoughtful aesthetic restraint.
                    </h2>
                </div>
            </div>

            {/* Pinned Split-Screen Stage: Overview Pinned on Left, Milestones Scrolling on Right */}
            <div className="sp-about-split-stage">
                <div className="sp-about-pinned-col">
                    <div className="section-header-wrap" style={{ marginBottom: "1rem" }}>
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

                    <div className="about-stats-grid">
                        <Card className="about-stat-card">
                            <Briefcase className="about-stat-icon" />
                            <div className="about-stat-value">{formattedExperience}</div>
                            <div className="about-stat-label">Experience</div>
                        </Card>
                        <Card className="about-stat-card">
                            <Code className="about-stat-icon" />
                            <div className="about-stat-value">{repos.length > 0 ? `${repos.length}+` : "0"}</div>
                            <div className="about-stat-label">Projects</div>
                        </Card>
                        <Card className="about-stat-card">
                            <Award className="about-stat-icon" />
                            <div className="about-stat-value">{totalCertificates > 0 ? `${totalCertificates}+` : "0"}</div>
                            <div className="about-stat-label">Certificates</div>
                        </Card>
                    </div>
                </div>

                <div className="sp-about-scroll-col">
                    <div className="education-card" style={{ border: "none", background: "transparent", padding: 0 }}>
                        <div className="education-header" style={{ marginBottom: "1.5rem" }}>
                            <h3 className="education-title" style={{ fontSize: "1.25rem" }}>
                                <GraduationCap className="education-icon" />
                                Education & Credentials
                            </h3>
                        </div>

                        <div className="education-list">
                            {education.map((item) => (
                                <div key={item.id} className="education-item" style={{ borderBottom: "1px solid var(--hairline)", padding: "1.5rem 0" }}>
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
                                        <div className="education-item-title">
                                            {item.degree}
                                        </div>
                                        <div className="education-item-subtitle">
                                            {item.school} • {item.period}
                                        </div>

                                        {item.diplomaImages && item.diplomaImages.length > 0 && (
                                            <div className="education-diploma-strip" style={{ marginTop: "1rem" }}>
                                                {item.diplomaImages.map((imgSrc, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="education-diploma-thumb-wrap"
                                                        onClick={() =>
                                                            setSelectedDiploma({
                                                                title: item.degree,
                                                                school: item.school,
                                                                images: item.diplomaImages || [],
                                                            })
                                                        }
                                                        title="Click to expand diploma preview"
                                                    >
                                                        <Image
                                                            src={imgSrc}
                                                            alt={`${item.degree} preview`}
                                                            fill
                                                            className="education-diploma-thumb-img"
                                                            sizes="96px"
                                                        />
                                                        <div className="education-diploma-overlay">
                                                            <Maximize2 size={12} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
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
