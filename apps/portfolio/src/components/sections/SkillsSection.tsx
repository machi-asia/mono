"use client";

import React, { useState, useRef } from "react";
import { Code, Server, Palette, Database } from "lucide-react";
import Image from "next/image";
import Card from "../Card";
import TechStackGrid from "../TechStackParticles";
import SkillProgress from "../SkillProgress";
import TabIndicator from "../TabIndicator";
import { getYearsSince } from "../../utils/duration";
import {
    techStackNodes,
    techCategories,
} from "../../data/tech-stack";
import TechStackDiagram, { CategoryLegendIcon } from "../TechStackDiagram";

const FRONTEND_ICONS = [
    { name: "React", icon: "/icons/react.svg" },
    { name: "Next.js", icon: "/icons/next.svg" },
    { name: "TypeScript", icon: "/icons/typescript.svg" },
    { name: "Tailwind CSS", icon: "/icons/tailwind.svg" },
    { name: "CSS3", icon: "/icons/css.svg" },
    { name: "GSAP", icon: "/icons/gsap.webp" },
];

const BACKEND_ICONS = [
    { name: "Node.js", icon: "/icons/node.webp" },
    { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
    { name: "Supabase", icon: "/icons/supabase.svg" },
    { name: "Python", icon: "/icons/python.svg" },
    { name: "C#", icon: "/icons/csharp.svg" },
    { name: "REST API", icon: "/icons/rest.webp" },
];

const TOOL_ICONS = [
    { name: "Docker", icon: "/icons/docker.svg" },
    { name: "Git", icon: "/icons/git.svg" },
    { name: "GitHub", icon: "/icons/github.svg" },
    { name: "VS Code", icon: "/icons/vscode.svg" },
    { name: "Figma", icon: "/icons/figma.svg" },
    { name: "Unity", icon: "/icons/unity.webp" },
];

export default function SkillsSection() {
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);
    const [selectedTech, setSelectedTech] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"databases" | "frontend" | "backend" | "tools">("databases");
    const [activeCategories, setActiveCategories] = useState<Set<string>>(
        () => new Set(techStackNodes.map(n => n.category))
    );
    const skillsTabsRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="skills"
            className="section techstack-section"
            style={{ position: "relative" }}
        >
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-circuit" />
            </div>

            {/* Grid floor bg */}
            <div className="techstack-bg">
                <TechStackGrid />
                <div className="techstack-bg-fade" />
            </div>

            <div className="section-header-wrap" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header-top">
                    <h2 className="section-title">
                        My <span className="gradient-text">Skills</span>
                    </h2>
                </div>
            </div>

            <div className="tabs-root">
                <div className="tabs-list skills-tabs-list" ref={skillsTabsRef}>
                    <button
                        className={`tabs-trigger skills-tab-trigger ${activeTab === "databases" ? "tabs-trigger-active" : ""}`}
                        data-state={activeTab === "databases" ? "active" : "inactive"}
                        onClick={() => setActiveTab("databases")}
                    >
                        <Database size={16} /> All Blueprint
                    </button>
                    <button
                        className={`tabs-trigger skills-tab-trigger ${activeTab === "frontend" ? "tabs-trigger-active" : ""}`}
                        data-state={activeTab === "frontend" ? "active" : "inactive"}
                        onClick={() => setActiveTab("frontend")}
                    >
                        <Code size={16} /> Frontend
                    </button>
                    <button
                        className={`tabs-trigger skills-tab-trigger ${activeTab === "backend" ? "tabs-trigger-active" : ""}`}
                        data-state={activeTab === "backend" ? "active" : "inactive"}
                        onClick={() => setActiveTab("backend")}
                    >
                        <Server size={16} /> Backend
                    </button>
                    <button
                        className={`tabs-trigger skills-tab-trigger ${activeTab === "tools" ? "tabs-trigger-active" : ""}`}
                        data-state={activeTab === "tools" ? "active" : "inactive"}
                        onClick={() => setActiveTab("tools")}
                    >
                        <Palette size={16} /> Tooling & Cloud
                    </button>
                    <TabIndicator listRef={skillsTabsRef} />
                </div>

                {activeTab === "frontend" && (
                    <div className="tabs-content">
                        <div className="skills-content-grid">
                            <Card>
                                <h3 className="skills-card-title">
                                    <Code className="skills-card-icon" />
                                    Frontend Technologies
                                </h3>
                                {techStackNodes.filter(n => n.skillCategory === 'frontend').map((node) => (
                                    <SkillProgress key={node.name} name={node.name} years={getYearsSince(node.startYear)} />
                                ))}
                                <div className="skills-icon-grid">
                                    {FRONTEND_ICONS.map((tech) => (
                                        <div key={tech.name} className="skills-icon-badge">
                                            <Image src={tech.icon} alt={tech.name} width={20} height={20} className="skills-icon-img" />
                                            <span className="skills-icon-text">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card className="skills-card-center">
                                <div className="skills-card-center-content">
                                    <Image src="/icons/react.svg" alt="React" width={56} height={56} className="skills-card-icon-img" />
                                    <h3 className="skills-card-center-title">React & Next.js Core</h3>
                                    <p className="skills-card-center-subtitle">Enterprise frontend engineering & SSR architecture</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "backend" && (
                    <div className="tabs-content">
                        <div className="skills-content-grid">
                            <Card>
                                <h3 className="skills-card-title">
                                    <Server className="skills-card-icon" />
                                    Backend Technologies
                                </h3>
                                {techStackNodes.filter(n => n.skillCategory === 'backend').map((node) => (
                                    <SkillProgress key={node.name} name={node.name} years={getYearsSince(node.startYear)} />
                                ))}
                                <div className="skills-icon-grid">
                                    {BACKEND_ICONS.map((tech) => (
                                        <div key={tech.name} className="skills-icon-badge">
                                            <Image src={tech.icon} alt={tech.name} width={20} height={20} className="skills-icon-img" />
                                            <span className="skills-icon-text">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card className="skills-card-center">
                                <div className="skills-card-center-content">
                                    <Image src="/icons/rest.webp" alt="REST API" width={56} height={56} className="skills-card-icon-img-invert" />
                                    <h3 className="skills-card-center-title">API Architecture</h3>
                                    <p className="skills-card-center-subtitle">High-throughput RESTful, RPC & PostgreSQL systems</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "tools" && (
                    <div className="tabs-content">
                        <div className="skills-content-grid">
                            <Card>
                                <h3 className="skills-card-title">
                                    <Palette className="skills-card-icon" />
                                    Tools & Infrastructure
                                </h3>
                                {techStackNodes.filter(n => n.skillCategory === 'tools').map((node) => (
                                    <SkillProgress key={node.name} name={node.name} years={getYearsSince(node.startYear)} />
                                ))}
                                <div className="skills-icon-grid">
                                    {TOOL_ICONS.map((tech) => (
                                        <div key={tech.name} className="skills-icon-badge">
                                            <Image src={tech.icon} alt={tech.name} width={20} height={20} className="skills-icon-img" />
                                            <span className="skills-icon-text">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card className="skills-card-center">
                                <div className="skills-card-center-content">
                                    <Image src="/icons/cloud.svg" alt="Cloud" width={56} height={56} className="skills-card-icon-img-invert" />
                                    <h3 className="skills-card-center-title">DevOps & Cloud Systems</h3>
                                    <p className="skills-card-center-subtitle">Automated CI/CD pipelines, Docker & containerization</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "databases" && (
                    <div className="tabs-content">
                        <div className="techstack-legend">
                            {techCategories.map(([category, color]: [string, string]) => {
                                const isActive = activeCategories.has(category);
                                return (
                                    <button
                                        key={category}
                                        className={`techstack-legend-item ${!isActive ? 'techstack-legend-item-inactive' : ''}`}
                                        onClick={() => {
                                            setActiveCategories(prev => {
                                                const next = new Set(prev);
                                                if (next.has(category)) {
                                                    next.delete(category);
                                                } else {
                                                    next.add(category);
                                                }
                                                return next;
                                            });
                                        }}
                                    >
                                        <CategoryLegendIcon category={category} color={color} active={isActive} />
                                        <span>{category}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="techstack-graph-container">
                            <TechStackDiagram
                                hoveredTech={hoveredTech}
                                setHoveredTech={setHoveredTech}
                                activeCategories={activeCategories}
                                selectedTech={selectedTech}
                                onSelectTech={setSelectedTech}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
