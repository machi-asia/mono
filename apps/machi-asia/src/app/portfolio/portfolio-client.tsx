"use client";

import { Row, Col, Card, Button, Tooltip, Link as MonoLink } from "@mono/components";
import { GithubIcon } from "@mono/auth";
import {
  Code,
  Terminal,
  Cpu,
  Layers,
  ExternalLink,
  Mail,
  Workflow,
  Sparkles,
  Server,
  Zap,
  Boxes,
} from "lucide-react";

interface ProjectItem {
  title: string;
  category: string;
  role: string;
  period: string;
  summary: string;
  tags: string[];
  metrics: string;
  url?: string;
  repo?: string;
}

const PROJECTS: ProjectItem[] = [
  {
    title: "Game Production Calculator & Graph Visualizer",
    category: "Full-Stack Web Application",
    role: "Lead Architect & Developer",
    period: "2026",
    summary:
      "A high-throughput factory rate planner and interactive recipe dependency tree visualization tool. Engineered using React Flow, Dagre directed acyclic graph layout algorithms, and a custom edge-routing renderer.",
    tags: ["Next.js", "TypeScript", "React Flow", "Dagre", "Algorithms", "CSS Design Tokens"],
    metrics: "Sub-16ms layout calculations for 500+ node graph trees",
    url: "https://calculator.machi-asia.com",
  },
  {
    title: "Rose AI - Companion Agent with Memory & Voice",
    category: "AI Agent & Multimodal System",
    role: "Full-Stack AI Engineer",
    period: "2026",
    summary:
      "Autonomous conversational companion featuring streaming audio transcription (Faster-Whisper on CPU/GPU), long-term vector memory recall, emotion detection, and tool calling with Langfuse observability.",
    tags: ["Next.js", "Gemini API", "Faster-Whisper", "Langfuse", "Web Audio API", "Supabase"],
    metrics: "Streaming response latency < 350ms, multi-turn vector recall",
    url: "https://rose.machi-asia.com",
  },
  {
    title: "Hell's Forge - Realtime Multiplayer Engine",
    category: "Distributed Game & Realtime Systems",
    role: "Systems & Graphics Developer",
    period: "2026",
    summary:
      "Server-authoritative 2D multiplayer exploration space built with Pixi.js, spatial circle collisions, custom input dressing, and Redis room state synchronization.",
    tags: ["Pixi.js", "Redis", "WebSockets", "Spatial Collision", "Server-Authoritative Sync"],
    metrics: "60 FPS render loop with deterministic server tick physics",
    url: "https://forge.machi-asia.com",
  },
  {
    title: "Machi Asia Design System & Component Library",
    category: "Frontend Infrastructure & UI Systems",
    role: "Design System Engineer",
    period: "2026",
    summary:
      "Unified design system and UI primitive package (`@mono/components`) built with CSS custom properties, accessible primitives, auto-layout rows/cols/cards, interactive widgets, and full test suites.",
    tags: ["React 19", "CSS Custom Properties", "Accessibility", "Vitest", "Turborepo"],
    metrics: "100% token adherence across all monorepo micro-apps",
    url: "https://docs.machi-asia.com",
  },
];

const SKILLS = [
  {
    category: "Frontend & Architecture",
    icon: <Code size={20} />,
    items: ["React 19", "Next.js (App Router)", "TypeScript", "Design Systems", "Web Audio API", "Pixi.js"],
  },
  {
    category: "Backend & Distributed Systems",
    icon: <Server size={20} />,
    items: ["Node.js", "Supabase / Postgres", "Redis Pub/Sub", "Realtime WebSockets", "REST & RPC APIs"],
  },
  {
    category: "AI & Machine Learning",
    icon: <Cpu size={20} />,
    items: ["LLM Tool Calling", "Gemini & Groq APIs", "Whisper STT", "Vector Search / RAG", "Langfuse Observability"],
  },
  {
    category: "Engineering & Tooling",
    icon: <Terminal size={20} />,
    items: ["Turborepo", "Vitest / Testing Library", "ESLint / Stylelint", "Docker & CI/CD", "Git Monorepos"],
  },
];

export function PortfolioClient() {
  return (
    <main className="machi-main">
      {/* Portfolio Hero Header */}
      <section className="portfolio-hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-primary)" }}>
          <Sparkles size={16} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Machi Asia Engineering & Works
          </span>
        </div>

        <h1 className="portfolio-name">
          Building Software with Elegance & Precision
        </h1>

        <p className="portfolio-bio">
          I design and build production-grade web applications, interactive visual graph planners, real-time distributed spaces, and conversational AI agents. Passionate about clean architecture, reusable design systems, and resilient engineering.
        </p>

        <div className="portfolio-tags">
          <span className="portfolio-tag">Senior Full-Stack Engineer</span>
          <span className="portfolio-tag">Systems & Graph Visualization</span>
          <span className="portfolio-tag">AI Agent Architect</span>
          <span className="portfolio-tag">Open Source Monorepos</span>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
          <a href="https://github.com/machi-asia" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="md" icon={<GithubIcon size={16} />}>
              GitHub Organization
            </Button>
          </a>
          <a href="mailto:contact@machi-asia.com" style={{ textDecoration: "none" }}>
            <Button variant="secondary" size="md" icon={<Mail size={16} />}>
              Get in Touch
            </Button>
          </a>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="machi-section">
        <div className="machi-section-header">
          <h2 className="machi-section-title">Featured Works & Case Studies</h2>
          <p className="machi-section-subtitle">
            Notable applications and technical systems designed, built, and maintained across this monorepo.
          </p>
        </div>

        <Row wrap gap="var(--space-6)">
          {PROJECTS.map((proj, idx) => (
            <Col key={idx} span={6}>
              <Card elevated bordered padded className="machi-product-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-2)" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>
                      {proj.category}
                    </span>
                    <h3 style={{ margin: "var(--space-1) 0", fontSize: "1.25rem", fontWeight: 700 }}>
                      {proj.title}
                    </h3>
                    <div style={{ display: "flex", gap: "var(--space-2)", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                      <span>{proj.role}</span>
                      <span>•</span>
                      <span>{proj.period}</span>
                    </div>
                  </div>
                  <Tooltip variant="help" content={proj.metrics} position="left" />
                </div>

                <p className="machi-card-desc" style={{ marginTop: "var(--space-2)" }}>
                  {proj.summary}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", margin: "var(--space-2) 0" }}>
                  {proj.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--color-surface-2)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="machi-card-footer">
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    {proj.metrics}
                  </span>
                  {proj.url && (
                    <a href={proj.url} target={proj.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <Button variant="primary" size="sm" icon={<ExternalLink size={14} />}>
                        Live Demo
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Technical Skills & Expertise */}
      <section className="machi-section">
        <div className="machi-section-header">
          <h2 className="machi-section-title">Technical Expertise</h2>
          <p className="machi-section-subtitle">
            Core competencies across modern frontend, server architecture, and machine learning integration.
          </p>
        </div>

        <Row wrap gap="var(--space-5)">
          {SKILLS.map((skillGroup, idx) => (
            <Col key={idx} span={3}>
              <Card bordered padded style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                  {skillGroup.icon}
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)" }}>
                    {skillGroup.category}
                  </h3>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {skillGroup.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span style={{ color: "var(--color-primary)", fontSize: "0.75rem" }}>◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Engineering Principles & Monorepo Architecture */}
      <section className="machi-section">
        <Card elevated bordered padded>
          <Row align="center" justify="space-between" wrap gap="var(--space-6)">
            <Col span={8}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <Boxes size={22} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: "1.3rem" }}>Architectural Philosophy</h3>
                </div>
                <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Every project in Machi Asia adheres to strict separation of concerns: centralized authentication in <code style={{ color: "var(--color-primary)" }}>@mono/auth</code>, isolated data models in <code style={{ color: "var(--color-primary)" }}>@mono/database</code>, tokenized design systems in <code style={{ color: "var(--color-primary)" }}>@mono/components</code>, and deterministic state sync in <code style={{ color: "var(--color-primary)" }}>@mono/sync</code>.
                </p>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-2)" }}>
                  <MonoLink href="https://docs.machi-asia.com" external variant="underline">
                    Read Architecture Docs
                  </MonoLink>
                  <MonoLink href="/" variant="default">
                    Back to Ecosystem Showcase
                  </MonoLink>
                </div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ textAlign: "center", padding: "var(--space-4)", background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                <Zap size={32} color="var(--color-primary)" style={{ margin: "0 auto var(--space-2)" }} />
                <h4 style={{ margin: "0 0 var(--space-1)", fontSize: "1.1rem" }}>Open for Collaboration</h4>
                <p style={{ margin: "0 0 var(--space-3)", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                  Available for select software architecture consulting and product development.
                </p>
                <a href="mailto:contact@machi-asia.com" style={{ textDecoration: "none" }}>
                  <Button variant="primary" size="sm">
                    Inquire Availability
                  </Button>
                </a>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
    </main>
  );
}
