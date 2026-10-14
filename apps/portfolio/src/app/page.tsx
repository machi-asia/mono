"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal, ScrollStack, ScrollSplit } from "@mono/components";
import Navbar from "../components/navbar";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import CertificatesSection from "../components/sections/CertificatesSection";
import SkillsSection from "../components/sections/SkillsSection";
import FeaturedWorksSection from "../components/sections/FeaturedWorksSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import VisitorsSection from "../components/sections/VisitorsSection";
import FaqSection from "../components/sections/FaqSection";
import Footer from "../components/sections/Footer";
import ContactDialog from "../components/sections/ContactDialog";

// Local Data
import type { GitHubRepo } from "../data/types";
import { faqItems, workCompanies, educationHistory } from "../data/experience";
import { featuredWorks } from "../data/featured-works";
import { certificatesData } from "../data/certificates";

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "mono",
    html_url: "https://github.com/machi-asia/mono",
    description: "Multi-platform enterprise monorepo housing cross-framework applications and shared design tokens.",
    language: "TypeScript",
    stargazers_count: 12,
    forks_count: 3,
    watchers_count: 12,
    homepage: null,
    topics: ["nextjs", "react", "monorepo", "design-system", "typescript"],
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-10-09T00:00:00Z",
    pushed_at: "2026-10-09T00:00:00Z",
  },
  {
    id: 2,
    name: "SAMS-Plus",
    html_url: "https://github.com/kamachi-dev/SAMS-Plus",
    description: "Student Attendance Management System powered by Yolov11n deep learning models and facial recognition.",
    language: "Python",
    stargazers_count: 8,
    forks_count: 2,
    watchers_count: 8,
    homepage: null,
    topics: ["computer-vision", "yolov11", "face-recognition", "python", "flask"],
    created_at: "2025-08-10T00:00:00Z",
    updated_at: "2026-09-20T00:00:00Z",
    pushed_at: "2026-09-20T00:00:00Z",
  },
  {
    id: 3,
    name: "TerraPrice",
    html_url: "https://github.com/kamachi-dev/TerraPrice",
    description: "Data-driven ML food price prediction engine combining geographical agriculture datasets with regression models.",
    language: "Python",
    stargazers_count: 5,
    forks_count: 1,
    watchers_count: 5,
    homepage: null,
    topics: ["machine-learning", "regression", "data-science", "analytics"],
    created_at: "2025-04-12T00:00:00Z",
    updated_at: "2026-08-15T00:00:00Z",
    pushed_at: "2026-08-15T00:00:00Z",
  },
  {
    id: 4,
    name: "machi",
    html_url: "https://github.com/kamachi-dev/machi",
    description: "Personal interactive portfolio with system architecture diagrams, custom theme builder, and visitor review center.",
    language: "TypeScript",
    stargazers_count: 15,
    forks_count: 4,
    watchers_count: 15,
    homepage: null,
    topics: ["portfolio", "react", "nextjs", "svg-diagrams", "tailwind"],
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-10-09T00:00:00Z",
    pushed_at: "2026-10-09T00:00:00Z",
  },
  {
    id: 5,
    name: "Unity-Passion-Projects",
    html_url: "https://github.com/kamachi-dev/Unity-Passion-Projects",
    description: "Collection of interactive 2D & 3D games developed with custom shader graphs and physics controllers.",
    language: "C#",
    stargazers_count: 6,
    forks_count: 1,
    watchers_count: 6,
    homepage: null,
    topics: ["unity", "csharp", "gamedev", "shaders", "physics"],
    created_at: "2024-11-05T00:00:00Z",
    updated_at: "2026-07-10T00:00:00Z",
    pushed_at: "2026-07-10T00:00:00Z",
  },
  {
    id: 6,
    name: "QuickNote-MCP",
    html_url: "https://github.com/kamachi-dev/quicknote-mcp",
    description: "Model Context Protocol knowledge graph notes system connecting ideas with bidirectional relationship edges.",
    language: "TypeScript",
    stargazers_count: 9,
    forks_count: 2,
    watchers_count: 9,
    homepage: null,
    topics: ["mcp", "knowledge-graph", "agentic-ai", "typescript"],
    created_at: "2026-03-18T00:00:00Z",
    updated_at: "2026-10-01T00:00:00Z",
    pushed_at: "2026-10-01T00:00:00Z",
  },
];

export default function HomePage() {
    const [contactOpen, setContactOpen] = useState(false);
    const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
    const [reposLoading, setReposLoading] = useState(false);
    const [reposError, setReposError] = useState<string | null>(null);

    // Fetch GitHub repos live (with graceful fallback to local cache)
    useEffect(() => {
        let isMounted = true;
        const fetchRepos = async () => {
            try {
                const res = await fetch("https://api.github.com/users/kamachi-dev/repos?sort=updated&per_page=100");
                if (!res.ok) {
                    if (isMounted) setRepos(FALLBACK_REPOS);
                    return;
                }
                const data = await res.json();
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    setRepos(data);
                }
            } catch {
                if (isMounted) setRepos(FALLBACK_REPOS);
            }
        };

        fetchRepos();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main className="page-container" style={{ position: "relative", width: "100%" }}>
            <Navbar onContactOpen={() => setContactOpen(true)} />

            <div id="hero">
                <HeroSection
                    onContactOpen={() => setContactOpen(true)}
                    repos={repos}
                    certificates={certificatesData}
                    workCompanies={workCompanies}
                />
            </div>

            <div id="about">
                <AboutSection
                    repos={repos}
                    certificates={certificatesData}
                    workCompanies={workCompanies}
                    education={educationHistory}
                />
            </div>

            <div id="featured">
                <FeaturedWorksSection featuredWorks={featuredWorks} />
            </div>

            <div id="skills">
                <SkillsSection />
            </div>

            <div id="certificates">
                <CertificatesSection certificates={certificatesData} />
            </div>

            <hr className="separator" />

            <ScrollReveal variant="fade-up">
                <div id="projects">
                    <ProjectsSection
                        repos={repos}
                        reposLoading={reposLoading}
                        reposError={reposError}
                    />
                </div>
            </ScrollReveal>

            <hr className="separator" />

            <ScrollReveal variant="fade-up">
                <div id="experience">
                    <ExperienceSection workCompanies={workCompanies} />
                </div>
            </ScrollReveal>

            <hr className="separator" />

            <ScrollReveal variant="fade-up">
                <div id="visitors">
                    <VisitorsSection />
                </div>
            </ScrollReveal>

            <hr className="separator" />

            <ScrollReveal variant="fade-up">
                <div id="faq">
                    <FaqSection faqItems={faqItems} />
                </div>
            </ScrollReveal>

            <hr className="separator" />

            <ScrollReveal variant="fade-up">
                <Footer onContactOpen={() => setContactOpen(true)} />
            </ScrollReveal>

            <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
        </main>
    );
}
