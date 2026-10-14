"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import Button from "../Button";
import Card from "../Card";
import Tooltip from "../Tooltip";
import FetchBoundary from "../FetchBoundary";
import GitHubRepoCard from "../GitHubRepoCard";
import TabIndicator from "../TabIndicator";
import { languageColors } from "../../data/tech-stack";
import type { GitHubRepo } from "../../data/types";

interface ProjectsSectionProps {
    repos: GitHubRepo[];
    reposLoading: boolean;
    reposError: string | null;
}

export default function ProjectsSection({ repos, reposLoading, reposError }: ProjectsSectionProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
    const [projectsPage, setProjectsPage] = useState(0);
    const projectsTabsRef = useRef<HTMLDivElement>(null);
    const PROJECTS_PER_PAGE = 6;

    const languages = Array.from(
        new Set(repos.filter((r) => r.language).map((r) => r.language as string))
    );

    const filteredRepos = (selectedLanguage === "all"
        ? repos
        : repos.filter((r) => r.language === selectedLanguage))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);

    const totalProjectPages = Math.ceil(filteredRepos.length / PROJECTS_PER_PAGE);
    const paginatedRepos = filteredRepos.slice(
        projectsPage * PROJECTS_PER_PAGE,
        (projectsPage + 1) * PROJECTS_PER_PAGE
    );

    const handleLanguageChange = (lang: string) => {
        setSelectedLanguage(lang);
        setProjectsPage(0);
    };

    return (
        <section
            id="projects"
            className="section"
            style={{ position: "relative" }}
        >
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-dots" />
            </div>

            <div className="section-header-wrap" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header-top">
                    <h2 className="section-title">
                        My <span className="gradient-text">GitHub Repos</span>
                    </h2>
                </div>
            </div>

            {reposLoading ? (
                <FetchBoundary loading={true} variant="card" lines={3} />
            ) : reposError ? (
                <Card className="projects-error">
                    <X size={40} className="projects-error-icon" />
                    <p className="projects-error-text">{reposError}</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="projects-error-btn"
                    >
                        Retry
                    </Button>
                </Card>
            ) : (
                <div className="tabs-root">
                    <div className="scroll-area-root" style={{ overflowX: "auto" }}>
                        <div className="tabs-list projects-tabs-list" ref={projectsTabsRef}>
                            <button
                                className={`tabs-trigger ${selectedLanguage === "all" ? "tabs-trigger-active" : ""}`}
                                data-state={selectedLanguage === "all" ? "active" : "inactive"}
                                onClick={() => handleLanguageChange("all")}
                            >
                                <span className="flip-text-holder">
                                    <span className="flip-text-1">All ({repos.length})</span>
                                    <span className="flip-text-2" aria-hidden="true">All ({repos.length})</span>
                                </span>
                            </button>
                            {languages.slice(0, 8).map((lang) => (
                                <button
                                    key={lang}
                                    className={`tabs-trigger projects-tab-trigger ${selectedLanguage === lang ? "tabs-trigger-active" : ""}`}
                                    data-state={selectedLanguage === lang ? "active" : "inactive"}
                                    onClick={() => handleLanguageChange(lang)}
                                >
                                    <span
                                        className="projects-lang-dot"
                                        style={{
                                            backgroundColor: languageColors[lang] || "#6e7681",
                                        }}
                                    />
                                    <span className="flip-text-holder">
                                        <span className="flip-text-1">{lang}</span>
                                        <span className="flip-text-2" aria-hidden="true">{lang}</span>
                                    </span>
                                </button>
                            ))}
                            <TabIndicator listRef={projectsTabsRef} />
                        </div>
                    </div>

                    <div className="projects-grid">
                        {paginatedRepos.map((repo) => (
                            <GitHubRepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>

                    {totalProjectPages > 1 && (
                        <div className="projects-pagination">
                            <Tooltip content="Previous page">
                                <Button
                                    variant="icon"
                                    onClick={() => setProjectsPage((prev) => Math.max(0, prev - 1))}
                                    disabled={projectsPage === 0}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={18} />
                                </Button>
                            </Tooltip>
                            <span className="projects-page-info">
                                Page {projectsPage + 1} of {totalProjectPages}
                            </span>
                            <Tooltip content="Next page">
                                <Button
                                    variant="icon"
                                    onClick={() => setProjectsPage((prev) => Math.min(totalProjectPages - 1, prev + 1))}
                                    disabled={projectsPage >= totalProjectPages - 1}
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
