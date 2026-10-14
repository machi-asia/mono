"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Briefcase, ExternalLink, Download } from "lucide-react";
import Carousel from "../Carousel";
import Card from "../Card";
import Badge from "../Badge";
import Dialog from "../Dialog";
import { MarkdownRenderer } from "@mono/components";
import ExperienceDiagram from "./ExperienceDiagrams";
import type { WorkCompany, WorkProject } from "../../data/types";

interface ExperienceSectionProps {
    workCompanies?: WorkCompany[];
}

export default function ExperienceSection({ workCompanies = [] }: ExperienceSectionProps) {
    const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);

    return (
        <section id="experience" className="experience-scroll-section" style={{ position: "relative" }}>
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-grid" />
            </div>

            <div className="section" style={{ paddingBottom: "1.5rem", position: "relative", zIndex: 1 }}>
                <div className="section-header-wrap">
                    <div className="section-header-top">
                        <h2 className="section-title">
                            Work <span className="gradient-text">Experience</span>
                        </h2>
                    </div>
                </div>
            </div>

            {workCompanies.length === 0 ? (
                <div className="section">
                    <Card padding="lg" style={{ textAlign: "center" }}>
                        <Briefcase size={40} style={{ opacity: 0.5, marginBottom: "1rem" }} />
                        <p style={{ opacity: 0.7, fontSize: "1.05rem" }}>No work experience to display yet.</p>
                        <p style={{ opacity: 0.5, fontSize: "0.875rem", marginTop: "0.5rem" }}>Check back soon for updates!</p>
                    </Card>
                </div>
            ) : (
                <div className="section" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingTop: 0 }}>
                    {workCompanies.map((company) => (
                        <div key={company.id} className="experience-company">
                            <div className="experience-company-header">
                                {company.companyUrl ? (
                                    <a
                                        href={company.companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="experience-company-logo-link"
                                    >
                                        <img
                                            className="experience-company-logo"
                                            src={company.companyLogo}
                                            alt={`${company.company} logo`}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        className="experience-company-logo"
                                        src={company.companyLogo}
                                        alt={`${company.company} logo`}
                                    />
                                )}
                                <div className="experience-company-info">
                                    <h3 className="experience-company-name">{company.company}</h3>
                                    <p className="experience-company-role">
                                        {company.role} <span className="experience-company-separator">•</span> {company.period}
                                    </p>
                                    {company.reportUrl && (
                                        <a
                                            href={company.reportUrl}
                                            download
                                            className="experience-company-report"
                                        >
                                            <Download size={13} />
                                            Download Internship Report
                                        </a>
                                    )}
                                </div>
                            </div>

                            <Carousel variant="compact" visibleCount={2} gap="1.25rem">
                                {company.projects.map((project) => (
                                    <Card
                                        key={project.id}
                                        padding="none"
                                        variant="interactive"
                                        className="exp-project-card"
                                        onClick={() => setSelectedProject(project)}
                                    >
                                        {project.photos && project.photos.length > 0 ? (
                                            <div className="exp-project-image-wrapper">
                                                <img
                                                    className="exp-project-image"
                                                    src={project.photos[0].src}
                                                    alt={project.photos[0].caption || project.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : project.diagramType ? (
                                            <div className="exp-project-image-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgb(255 255 255 / 2%)" }}>
                                                <ExperienceDiagram type={project.diagramType} variant="compact" />
                                            </div>
                                        ) : null}

                                        <div className="exp-project-content">
                                            <h4 className="exp-project-title">{project.title}</h4>
                                            <p className="exp-project-desc">{project.description}</p>
                                            <div className="exp-project-tags">
                                                {project.technologies.slice(0, 4).map((tech) => (
                                                    <Badge key={tech} variant="default" size="sm">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                                {project.technologies.length > 4 && (
                                                    <Badge variant="default" size="sm">
                                                        +{project.technologies.length - 4}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </Carousel>
                        </div>
                    ))}
                </div>
            )}

            {/* Project Details Modal */}
            <Dialog
                open={selectedProject !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedProject(null);
                }}
                className="dialog-content-admin"
            >
                {selectedProject && (
                    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>
                                {selectedProject.title}
                            </h3>
                        </div>

                        {selectedProject.diagramType && (
                            <div style={{ padding: "1.5rem", background: "#000", border: "1px solid var(--card-border)", borderRadius: "4px", overflowX: "auto" }}>
                                <ExperienceDiagram type={selectedProject.diagramType} variant="detailed" />
                            </div>
                        )}

                        <div style={{ color: "var(--foreground-muted)", fontSize: "0.9375rem", lineHeight: "1.7" }}>
                            <MarkdownRenderer content={selectedProject.description} />
                        </div>

                        <div>
                            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                                Technologies Utilized
                            </span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                {selectedProject.technologies.map((tech) => (
                                    <Badge key={tech} variant="default" size="sm">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {selectedProject.link && (
                            <div style={{ marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid var(--hairline)" }}>
                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: "100%" }}
                                >
                                    Inspect Live Deployment <ExternalLink size={16} />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </section>
    );
}
