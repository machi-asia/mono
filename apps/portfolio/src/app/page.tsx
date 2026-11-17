"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "../components/navbar";
import CustomCursor from "../components/CustomCursor";
import ParallaxChapterReveal from "../components/ParallaxRevealPanels";
import HeroSection from "../components/sections/HeroSection";
import FeaturedWorksSection from "../components/sections/FeaturedWorksSection";
import AboutSection from "../components/sections/AboutSection";
import ThreeDShowcaseSection from "../components/sections/ThreeDShowcaseSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import SkillsSection from "../components/sections/SkillsSection";
import CertificatesSection from "../components/sections/CertificatesSection";
import VisitorsSection from "../components/sections/VisitorsSection";
import FaqSection from "../components/sections/FaqSection";
import Footer from "../components/sections/Footer";
import ContactDialog from "../components/sections/ContactDialog";

// Local Data & Supabase
import type { GitHubRepo } from "../data/types";
import { createClient } from "@mono/auth";
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
  const [reposLoading] = useState(false);
  const [reposError] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  // Fetch cached GitHub repos from Supabase (populated daily at 12:00 AM by cron)
  useEffect(() => {
    let isMounted = true;
    const fetchRepos = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("portfolio_github_cache")
          .select("repos")
          .eq("id", "kamachi-dev")
          .maybeSingle();

        const row = data as { repos?: unknown } | null;
        if (error || !row || !Array.isArray(row.repos) || row.repos.length === 0) {
          if (isMounted) setRepos(FALLBACK_REPOS);
          return;
        }
        if (isMounted) {
          setRepos(row.repos as GitHubRepo[]);
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
    <main className="page-container">
      <CustomCursor />

      {/* Scroll-linked progress hairline */}
      <div
        className="scroll-progress-rail"
        data-testid="scroll-progress-rail"
        aria-hidden="true"
      >
        <motion.div
          className="scroll-progress-fill"
          style={{ scaleX: smoothProgress }}
        />
      </div>

      <Navbar onContactOpen={() => setContactOpen(true)} />

      {/* HERO */}
      <div className="chapter-shade-void">
        <HeroSection
          onContactOpen={() => setContactOpen(true)}
          repos={repos}
          certificates={certificatesData}
          workCompanies={workCompanies}
        />
      </div>

      <ParallaxChapterReveal
        variant="circle"
        primaryShade="var(--shade-carbon)"
        secondaryShade="var(--shade-graphite)"
        align="right"
        testId="reveal-hero-works"
      />

      {/* FEATURED WORKS */}
      <div className="chapter-shade-obsidian">
        <FeaturedWorksSection featuredWorks={featuredWorks} />
      </div>

      <ParallaxChapterReveal
        variant="slab"
        primaryShade="var(--shade-charcoal)"
        secondaryShade="var(--shade-slate-dark)"
        align="left"
        testId="reveal-works-about"
      />

      {/* ABOUT */}
      <div className="chapter-shade-abyss">
        <AboutSection
          repos={repos}
          certificates={certificatesData}
          workCompanies={workCompanies}
          education={educationHistory}
        />
      </div>

      <ParallaxChapterReveal
        variant="pill"
        primaryShade="var(--shade-carbon)"
        secondaryShade="var(--shade-graphite)"
        align="center"
        testId="reveal-about-3d"
      />

      {/* 3D SHOWCASE */}
      <div className="chapter-shade-carbon">
        <ThreeDShowcaseSection />
      </div>

      <ParallaxChapterReveal
        variant="diagonal"
        primaryShade="var(--shade-abyss)"
        secondaryShade="var(--shade-charcoal)"
        align="right"
        testId="reveal-3d-experience"
      />

      {/* EXPERIENCE */}
      <div className="chapter-shade-obsidian">
        <ExperienceSection workCompanies={workCompanies} />
      </div>

      {/* PROJECTS */}
      <div className="chapter-shade-carbon">
        <ProjectsSection
          repos={repos}
          reposLoading={reposLoading}
          reposError={reposError}
        />
      </div>

      <ParallaxChapterReveal
        variant="slab"
        primaryShade="var(--shade-carbon)"
        secondaryShade="var(--shade-slate-dark)"
        align="left"
        testId="reveal-projects-skills"
      />

      {/* SKILLS */}
      <div className="chapter-shade-abyss">
        <SkillsSection />
      </div>

      {/* CERTIFICATES */}
      <div className="chapter-shade-charcoal">
        <CertificatesSection certificates={certificatesData} />
      </div>

      {/* VISITORS / REVIEWS */}
      <div className="chapter-shade-obsidian">
        <VisitorsSection />
      </div>

      {/* FAQ */}
      <div className="chapter-shade-carbon">
        <FaqSection faqItems={faqItems} />
      </div>

      <ParallaxChapterReveal
        variant="circle"
        primaryShade="var(--shade-abyss)"
        secondaryShade="var(--shade-graphite)"
        align="right"
        testId="reveal-faq-footer"
      />

      {/* CONTACT FOOTER */}
      <div id="contact" className="chapter-shade-void">
        <Footer onContactOpen={() => setContactOpen(true)} />
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </main>
  );
}
