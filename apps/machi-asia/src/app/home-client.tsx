"use client";

import { useRouter } from "next/navigation";
import { Row, Col, Card, Button, Tooltip, Accordion, Usage } from "@mono/components";
import { ArrowRight, Bot, Calculator, Check, Sparkles, Zap, Shield, HelpCircle, Code2, Globe } from "lucide-react";

const PRODUCTS = [
  {
    id: "calculator",
    name: "Game Production Calculator",
    category: "Factory & Crafting Planner",
    badge: "Free + Pro",
    url: "https://calculator.machi-asia.com",
    icon: <Calculator size={22} />,
    description:
      "Comprehensive multi-game recipe dependency tree graph and factory rate planner supporting Satisfactory, Factorio, Minecraft, Dyson Sphere Program, and Little Rocket Lab.",
    features: [
      "Interactive DAG recipe tree visualization",
      "Dynamic machine count and throughput planning",
      "Item catalog with sorting and filter controls",
      "Per-item update tracking and recipe specs",
    ],
    tierInfo: "Unlimited recipe views and catalog search included on free tier.",
  },
  {
    id: "rose",
    name: "Rose AI",
    category: "Personal AI Companion",
    badge: "Free Tier Available",
    url: "https://rose.machi-asia.com",
    icon: <Bot size={22} />,
    description:
      "Custom conversational AI agent with real-time voice mode, long-term memory, customizable personality, and automated search capabilities.",
    features: [
      "Voice mode with streaming audio transcription",
      "Long-term memory retention and recall tools",
      "Multi-provider LLM orchestration",
      "Real-time usage and tier quota monitoring",
    ],
    tierInfo: "Guest limit: 10/day, User: 20/day, Pro: Unlimited.",
  },
  {
    id: "hells-forge",
    name: "Hell's Forge",
    category: "Realtime Multiplayer Space",
    badge: "Tech Preview",
    url: "https://forge.machi-asia.com",
    icon: <Zap size={22} />,
    description:
      "High-performance 2D multiplayer exploration canvas powered by Pixi.js, spatial collision detection, and server-authoritative room state sync.",
    features: [
      "Authoritative physics simulation and input dressing",
      "Realtime WebSocket and WebRTC state sync",
      "Smooth camera tracking and dash particle visuals",
      "Minimal latency redis room orchestration",
    ],
    tierInfo: "Currently in open access community preview.",
  },
  {
    id: "portfolio",
    name: "Developer Portfolio",
    category: "Projects & Career",
    badge: "Personal Showcase",
    url: "/portfolio",
    icon: <Code2 size={22} />,
    description:
      "Explore engineering projects, full-stack architectural design patterns, distributed systems experiments, and personal technical works.",
    features: [
      "Interactive architecture & technology showcase",
      "Live monorepo packages & service status",
      "Technical case studies & engineering principles",
      "Direct contact & social connection links",
    ],
    tierInfo: "Free public access to all works and case studies.",
  },
];

const SUBSCRIPTION_PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever free",
    description: "Essential access to all Machi Asia web applications.",
    popular: false,
    tooltip: "Free guest and user tier limits apply across all apps.",
    features: [
      "Access to Game Production Calculator",
      "Rose AI basic chat (20 messages / day)",
      "Hell's Forge public multiplayer access",
      "Obsidian markdown & docs reading",
      "Community support",
    ],
    cta: "Get Started Free",
    variant: "secondary" as const,
  },
  {
    name: "Pro Builder",
    price: "$9",
    period: "/ month",
    description: "Uncapped usage, premium AI features, and cloud saves.",
    popular: true,
    tooltip: "Includes unlimited voice mode, custom agent memory, and priority compute.",
    features: [
      "Unlimited Rose AI messages & voice mode",
      "Extended Rose long-term vector memory",
      "Cloud factory blueprint saving & sharing",
      "Zero advertisements across all web applications",
      "Early access to new experimental features",
      "Priority customer and developer support",
    ],
    cta: "Upgrade to Pro",
    variant: "primary" as const,
  },
  {
    name: "Studio / Team",
    price: "$29",
    period: "/ month",
    description: "For teams, content creators, and power automation users.",
    popular: false,
    tooltip: "Team workspace licenses with shared memory and export tools.",
    features: [
      "Everything included in Pro Builder",
      "Multi-user shared workspaces and sync",
      "Custom system agent personality prompts",
      "API access for automation & data extraction",
      "High-bandwidth room hosting in Hell's Forge",
      "Dedicated Discord VIP support channel",
    ],
    cta: "Upgrade to Team",
    variant: "secondary" as const,
  },
];

const FAQ_ITEMS = [
  {
    title: "How do subscriptions work across the different apps?",
    content: (
      <p style={{ margin: 0, lineHeight: 1.6, color: "var(--color-text-muted)" }}>
        A single Machi Asia subscription unlocks pro capabilities across all connected applications in the monorepo, including unlimited queries in Rose AI, ad-free factory planning in Game Production Calculator, and premium workspace access.
      </p>
    ),
  },
  {
    title: "Can I use Machi Asia applications for free?",
    content: (
      <p style={{ margin: 0, lineHeight: 1.6, color: "var(--color-text-muted)" }}>
        Yes! All of our core tools provide generous free tiers or guest access. You can calculate game production chains, test out Rose AI, and play in multiplayer rooms without entering credit card details.
      </p>
    ),
  },
  {
    title: "How do I upgrade or cancel my subscription?",
    content: (
      <p style={{ margin: 0, lineHeight: 1.6, color: "var(--color-text-muted)" }}>
        You can manage, change, or cancel your subscription at any time through your Account Settings menu in the top right navigation bar. Your benefits remain active until the end of your billing cycle.
      </p>
    ),
  },
  {
    title: "Where can I view developer documentation for the components?",
    content: (
      <p style={{ margin: 0, lineHeight: 1.6, color: "var(--color-text-muted)" }}>
        Developer documentation, design tokens, and live interactive component playgrounds are hosted in our documentation app at <a href="https://docs.machi-asia.com" style={{ color: "var(--color-primary)" }}>docs.machi-asia.com</a>.
      </p>
    ),
  },
];

export function HomeClient() {
  const router = useRouter();

  return (
    <main className="machi-main">
      {/* Hero Section */}
      <section className="machi-hero">
        <div className="machi-hero-badge">
          <Sparkles size={16} />
          <span>The Machi Asia Ecosystem</span>
        </div>
        <h1 className="machi-hero-title">
          Modern Applications & <span>Intelligent Tools</span>
        </h1>
        <p className="machi-hero-subtitle">
          Welcome to Machi Asia. Discover high-efficiency game production calculators, personalized AI companion agents, realtime multiplayer spaces, and engineering work.
        </p>
        <div className="machi-hero-actions">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            onClick={() => {
              const el = document.getElementById("apps");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Applications
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<Code2 size={18} />}
            onClick={() => {
              router.push("/portfolio");
            }}
          >
            View Portfolio
          </Button>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="apps" className="machi-section">
        <div className="machi-section-header">
          <h2 className="machi-section-title">Featured Applications</h2>
          <p className="machi-section-subtitle">
            Crafted with modern web technologies, shared design tokens, and synchronized cloud storage.
          </p>
        </div>

        <Row wrap gap="var(--space-6)">
          {PRODUCTS.map((prod) => (
            <Col key={prod.id} span={6}>
              <Card elevated bordered padded className="machi-product-card">
                <div className="machi-card-header">
                  <div className="machi-card-title-group">
                    <div className="machi-card-icon">{prod.icon}</div>
                    <div>
                      <h3 className="machi-card-title">{prod.name}</h3>
                      <span className="machi-card-badge">{prod.category}</span>
                    </div>
                  </div>
                  <Tooltip variant="help" content={prod.tierInfo} position="left" />
                </div>

                <p className="machi-card-desc">{prod.description}</p>

                <ul className="machi-feature-list">
                  {prod.features.map((feat, i) => (
                    <li key={i} className="machi-feature-item">
                      <span className="machi-feature-bullet">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="machi-card-footer">
                  <span style={{ fontSize: "0.82rem", color: "var(--color-primary)", fontWeight: 600 }}>
                    {prod.badge}
                  </span>
                  <a href={prod.url} style={{ textDecoration: "none" }}>
                    <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                      Launch App
                    </Button>
                  </a>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Subscription Plans Section */}
      <section id="pricing" className="machi-section">
        <div className="machi-section-header">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <h2 className="machi-section-title">Subscription Upgrades</h2>
            <Tooltip
              variant="help"
              content="All plans come with a 14-day money-back guarantee. Cancel anytime with a single click."
              position="right"
            />
          </div>
          <p className="machi-section-subtitle">
            One unified subscription unlocks pro benefits across every tool and AI application in the ecosystem.
          </p>
        </div>

        <Row wrap gap="var(--space-6)">
          {SUBSCRIPTION_PLANS.map((plan, idx) => (
            <Col key={idx} span={4}>
              <Card
                elevated={plan.popular}
                bordered
                padded
                className={`machi-pricing-card ${plan.popular ? "machi-pricing-popular" : ""}`}
              >
                {plan.popular && <div className="machi-popular-tag">Most Popular</div>}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 var(--space-1)", fontSize: "1.3rem" }}>{plan.name}</h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                      {plan.description}
                    </p>
                  </div>
                  <Tooltip variant="help" content={plan.tooltip} position="top" />
                </div>

                <div style={{ margin: "var(--space-3) 0" }}>
                  <span className="machi-price-amount">{plan.price}</span>
                  <span className="machi-price-period"> {plan.period}</span>
                </div>

                <ul className="machi-feature-list">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="machi-feature-item">
                      <Check size={16} color="var(--color-primary)" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "auto", paddingTop: "var(--space-4)" }}>
                  <Button
                    variant={plan.variant}
                    size="md"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => {
                      alert(`Subscription tier selected: ${plan.name}. Connect billing flow.`);
                    }}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Quota & Ecosystem Transparency Showcase */}
      <section className="machi-section">
        <Card elevated bordered padded>
          <Row align="center" justify="space-between" wrap gap="var(--space-6)">
            <Col span={7}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <Shield size={20} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Transparent Resource Quotas</h3>
                </div>
                <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                  We believe in explicit limits without hidden throttling. Every authenticated account enjoys transparent quota tracking backed by Supabase and Langfuse observability.
                </p>
                <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Usage
                    label="Rose AI Free Daily Quota"
                    used={14}
                    total={20}
                    unit="messages"
                    size="sm"
                    description="Resets daily at 00:00 UTC. Upgraded plans have no daily cap."
                  />
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div style={{ background: "var(--color-surface-2)", padding: "var(--space-5)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "1rem" }}>Developer & Enterprise</h4>
                <p style={{ margin: "0 0 var(--space-4)", fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  Looking for custom on-premises LLM deployment, high-throughput batch recalculation, or custom game support?
                </p>
                <a href="mailto:contact@machi-asia.com" style={{ textDecoration: "none" }}>
                  <Button variant="secondary" size="sm" icon={<Globe size={14} />}>
                    Contact Engineering
                  </Button>
                </a>
              </div>
            </Col>
          </Row>
        </Card>
      </section>

      {/* FAQ Accordion */}
      <section className="machi-section">
        <div className="machi-section-header">
          <h2 className="machi-section-title">Frequently Asked Questions</h2>
          <p className="machi-section-subtitle">
            Common questions about accounts, subscription billing, and application features.
          </p>
        </div>
        <Card bordered padded>
          <Accordion items={FAQ_ITEMS} defaultOpen={[0]} />
        </Card>
      </section>
    </main>
  );
}
