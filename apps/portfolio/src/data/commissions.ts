import { type CommissionService, type CommissionOverview, type CommissionProcessStep } from "./types";

/**
 * Commission Overview & Philosophy
 * Purely custom, bespoke software engineering services with zero prebuilt or rigid packages.
 */
export const commissionOverview: CommissionOverview = {
    model: "100% Bespoke & Purely Custom Engineering",
    philosophy: "No prebuilt options or rigid templates. Every project is scoped, architected, and built from scratch tailored specifically to your unique requirements, architecture, and business goals.",
    pricing: "Custom quoted based on project complexity, scope, deliverables, and timeline. Clients provide their proposed budget in their commission booking request.",
    turnaround: "Tailored to client milestones, sprint schedules, and project complexity.",
    process: [
        {
            step: 1,
            title: "Discovery & Requirements Scoping",
            description: "Submit your custom project vision, functional requirements, wireframes, and proposed budget. We review the scope and establish clear technical objectives."
        },
        {
            step: 2,
            title: "Architecture & Feasibility Evaluation",
            description: "Detailed evaluation of technical feasibility, database design, tech stack selection, milestone schedules, and transparent effort estimation."
        },
        {
            step: 3,
            title: "Iterative Milestone Development",
            description: "End-to-end bespoke development with interactive staging previews, regular progress updates, and agile feedback iterations."
        },
        {
            step: 4,
            title: "Testing, Polish & Production Deployment",
            description: "Rigorous automated testing, performance profiling, security checks, production cloud deployment, and comprehensive handover documentation."
        }
    ]
};

export const customCommissionProcess: CommissionProcessStep[] = commissionOverview.process;

/**
 * Custom Commission Engineering Domains & Focus Areas
 */
export const commissionServices: CommissionService[] = [
    {
        id: "custom-fullstack-app",
        title: "Custom Full-Stack Web Applications",
        description: "Bespoke end-to-end web applications engineered from scratch with Next.js, React, TypeScript, PostgreSQL/Supabase, custom APIs, role-based auth, and scalable cloud infrastructure.",
        customScope: "SaaS platforms, client portals, multi-tenant dashboards, business operations software, and internal tools.",
        capabilities: [
            "Tailored database schema design & migrations",
            "Custom RESTful & GraphQL API routes",
            "Secure authentication & RBAC authorization",
            "Payment gateway & third-party service integrations",
            "Production cloud deployment & CI/CD pipelines"
        ],
        deliverables: [
            "Full source code repository with comprehensive documentation",
            "Production-ready deployment & environment configurations",
            "Automated unit & integration test suites",
            "Database architecture diagrams & schema definitions",
            "Handover walkthrough & deployment maintenance support"
        ]
    },
    {
        id: "custom-ai-agents",
        title: "Bespoke AI Agents & Intelligent Automation",
        description: "Autonomous multi-agent workflows, Gemini & OpenAI LLM integrations, Model Context Protocol (MCP) servers, intelligent scrapers, and task automation pipelines.",
        customScope: "Domain-specific AI assistants, MCP tool servers, agentic planning loops, conversational analytics, and automated data pipelines.",
        capabilities: [
            "Gemini & OpenAI tool-calling pipelines",
            "Custom Model Context Protocol (MCP) server development",
            "Multi-step autonomous agent execution loops",
            "RAG pipelines & vector knowledge base integration",
            "Automated background workers, webhooks & cron jobs"
        ],
        deliverables: [
            "Complete custom AI agent & tool codebase",
            "MCP server configurations & schema declarations",
            "Prompt engineering & system directive documentation",
            "Interactive chat & playground interface",
            "Error handling, rate limiting & logging infrastructure"
        ]
    },
    {
        id: "custom-ui-ux-frontend",
        title: "Custom UI/UX Engineering & Design Systems",
        description: "Pixel-perfect, accessible, and high-performance frontend interfaces, custom component libraries, responsive layouts, and fluid micro-interactions tailored to your brand.",
        customScope: "Interactive web applications, responsive portfolio sites, custom design systems, data visualization dashboards, and modern marketing surfaces.",
        capabilities: [
            "Figma-to-code bespoke component implementation",
            "Tailwind CSS & CSS custom properties theming",
            "Accessible Radix UI & keyboard navigation patterns",
            "Fluid animations with Framer Motion & CSS transitions",
            "Responsive, mobile-first cross-browser engineering"
        ],
        deliverables: [
            "Modular, reusable UI component library",
            "Theme customizer & design token architecture",
            "Interactive component showcase & gallery",
            "Lighthouse performance & accessibility optimization report",
            "Cross-browser & cross-device compatibility verification"
        ]
    },
    {
        id: "custom-backend-apis",
        title: "Custom Backend, APIs & Database Engineering",
        description: "High-throughput server architectures, custom REST & GraphQL endpoints, optimized relational databases, real-time channels, and secure webhook processors.",
        customScope: "Custom backend microservices, database migrations, webhook event ingestion, real-time messaging, and Redis caching layers.",
        capabilities: [
            "Secure, type-safe API route handlers",
            "PostgreSQL indexing, query optimization & RLS security",
            "Real-time subscriptions & WebSocket channels",
            "Webhook listeners with cryptographic signature validation",
            "Redis cache layers, rate limiters & queue handlers"
        ],
        deliverables: [
            "Documented API endpoints with request/response schemas",
            "PostgreSQL migrations, indexes & RLS policies",
            "Automated API route test coverage",
            "Webhook integration guides & security specifications",
            "Postman / OpenAPI collection documentation"
        ]
    },
    {
        id: "custom-consulting-architecture",
        title: "Technical Consulting, Code Audits & Architecture",
        description: "Specialized architectural consulting, legacy codebase refactoring, performance profiling, security audits, and technical roadmap planning.",
        customScope: "Architecture evaluations, performance troubleshooting, code quality audits, and technical feasibility studies.",
        capabilities: [
            "In-depth code quality & maintainability audit",
            "Runtime performance profiling & bundle optimization",
            "Database bottleneck identification & query tuning",
            "Security vulnerability & authorization review",
            "System architecture diagramming & technology selection"
        ],
        deliverables: [
            "Comprehensive technical audit report with priority matrix",
            "Step-by-step refactoring & modernization plan",
            "Architectural flowcharts & Mermaid diagrams",
            "1-on-1 walkthrough review sessions & PR reviews"
        ]
    }
];

/**
 * Budget & Timeline Guidance for Custom Commissions
 */
export const budgetOptions = [
    { value: "custom-offer", label: "Client-Proposed Custom Budget" },
    { value: "milestone-based", label: "Milestone-Based Billing" },
    { value: "consultation-quote", label: "Custom Quoted After Evaluation" }
];

export const timelineOptions = [
    { value: "urgent", label: "Targeted Sprint (Urgent / 1-2 Weeks)" },
    { value: "milestone", label: "Milestone-Driven (2-4 Weeks)" },
    { value: "flexible", label: "Flexible Schedule (Open / Long-Term)" }
];
