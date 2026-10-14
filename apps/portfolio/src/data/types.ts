/**
 * # Type System Schema Documentation
 * 
 * > [!NOTE]
 * > Interface declarations defining structural contracts across static data files and agent tools.
 * 
 * | Interface | Purpose | Target Storage |
 * |---|---|---|
 * | **GitHubRepo** | Repository metadata schema | GitHub API / Agent Tools |
 * | **WorkCompany** | Company experience with project carousels | \`data/experience.ts\` |
 * | **WorkProject** | Sub-projects with diagram types & contributions | \`data/experience.ts\` |
 * | **Certificate** | Academic & professional credentials | \`data/certificates.ts\` |
 * | **FeaturedWork** | Showcase portfolio projects | \`data/featured-works.ts\` |
 * | **TechStackNode** | Visual tech stack graph nodes | \`data/tech-stack.ts\` |
 * | **ArchitectureNode** | Obsidian vault architecture graph nodes | `data/architecture.ts` |
 * | **ApiEndpoint** | Website API endpoint documentation schema | `data/api.ts` |
 */

// GitHub Repository type
export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    topics: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string;
}

// Experience interface (legacy — kept for backward compatibility)
export interface Experience {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    achievements: string[];
}

// Work Project — a project or task within a company
export interface WorkProjectPhoto {
    src: string;
    caption?: string;
}

// Work Project — a project or task within a company
export interface WorkProject {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    imageUrl?: string;
    photos?: WorkProjectPhoto[];
    longDescription?: string;
    contributions?: string[];
    diagramType?: "business-tools" | "blog-prompt" | "redis-sessions" | "tailwind-migration" | "react-components" | "mobile-responsiveness" | "asset-migration" | "locations-module" | "category-navigation" | "marketplace-integrations";
}

// Work Company — an employer entry with a carousel of projects
export interface WorkCompany {
    id: string;
    company: string;
    companyLogo: string;
    role: string;
    period: string;
    projects: WorkProject[];
    companyUrl?: string;
    reportUrl?: string;
}

// Certificate type
export interface Certificate {
    id: string;
    name: string;
    image: string;
    source: "google" | "coursera" | "physical" | "wadhwani";
    url?: string;
    description?: string;
    subCertificates?: Certificate[];
}

// Featured Work type
export interface FeaturedWork {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    tags: string[];
    link?: string;
}

// Tech Stack data types
export interface TechStackNode {
    id: string;
    name: string;
    category: string;
    color: string;
    x: number;
    y: number;
    startYear: number;
    skillCategory?: 'frontend' | 'backend' | 'tools';
    iconUrl?: string;
    description?: string;
}

export interface TechStackEdge {
    from: string;
    to: string;
}

// Education interface
export interface Education {
    id: string;
    degree: string;
    school: string;
    period: string;
    icon?: string;
    description?: string;
    diplomaImages?: string[];
}

// Architecture Node type
export interface ArchitectureNode {
    id: string;
    title: string;
    type: string;
    tags: string[];
    links: string[];
    content: string;
}

// API Endpoint documentation schema
export interface ApiEndpoint {
    id: string;
    path: string;
    methods: Array<"GET" | "POST" | "PATCH" | "DELETE" | "PUT" | "OPTIONS">;
    description: string;
    authRequired: boolean;
    category: "Admin" | "Agents" | "Certificates" | "Chat" | "Commissions" | "Contact" | "Conversations" | "Notes" | "Reports" | "Reviews" | "Site Data" | "UoweMe" | "Visits" | "Auth" | "Developer" | "MMM";
    parameters?: string[];
    responseDescription?: string;
}

// Visitor Review interface
export interface VisitorReview {
    id: string | number;
    user_id: string;
    user_name: string;
    user_avatar?: string | null;
    rating: number;
    comment: string;
    created_at: string;
    updated_at?: string;
}

// Review Statistics interface
export interface ReviewStats {
    average_rating: number;
    total_count: number;
    breakdown: { [stars: number]: number };
}
// QuickNote — a private user markdown note
export interface QuickNote {
    id: number;
    user_id: string;
    title: string;
    content: string;
    tags: string[];
    folder?: string;
    order_index?: number;
    created_at: string;
    updated_at: string;
}

// Explicit note-to-note relation stored in quicknote_note_relations
export interface NoteRelation {
    note_id: number;
    related_note_id: number;
    created_at: string;
}

// Custom Commission Process Step
export interface CommissionProcessStep {
    step: number;
    title: string;
    description: string;
}

// Custom Commission Overview schema
export interface CommissionOverview {
    model: string;
    philosophy: string;
    pricing: string;
    turnaround: string;
    process: CommissionProcessStep[];
}

// Custom Commission Service offering
export interface CommissionService {
    id: string;
    title: string;
    description: string;
    customScope: string;
    capabilities: string[];
    deliverables: string[];
}

// Commission Request entity stored in Supabase
export interface CommissionRequest {
    id: number;
    user_id: string | null;
    name: string;
    email: string;
    title: string;
    service_type: string;
    description: string;
    budget: string;
    deadline?: string | null;
    status: "pending" | "in_progress" | "approved" | "completed" | "declined";
    admin_notes?: string | null;
    created_at: string;
    updated_at: string;
}

// Minecraft Mod Manager (MMM) types
export type MinecraftModLoader = "fabric" | "forge" | "neoforge" | "quilt";

export interface MmmOrganization {
    id: string;
    name: string;
    slug: string;
    description: string;
    invite_code: string;
    minecraft_version: string;
    modloader: MinecraftModLoader;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
    members_count?: number;
}

export interface MmmOrganizationMember {
    id: string;
    organization_id: string;
    user_id: string;
    role: "owner" | "admin" | "member";
    joined_at: string;
    user_email?: string;
}

export interface MmmModList {
    id: string;
    organization_id: string;
    name: string;
    description: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface MmmModDependency {
    id?: string;
    name: string;
    type?: "required" | "optional" | "incompatible";
}

export interface MmmMod {
    id: string;
    mod_list_id: string;
    modrinth_id: string;
    modrinth_slug: string;
    name: string;
    summary: string;
    icon_url: string;
    author: string;
    download_url: string;
    filename: string;
    version_number: string;
    minecraft_version: string;
    modloader: string;
    dependencies: MmmModDependency[];
    added_at: string;
    added_by?: string | null;
}

export interface MmmModHistory {
    id: string;
    mod_list_id: string;
    action: "add" | "remove" | "update";
    mod_name: string;
    modrinth_id: string;
    previous_version?: string;
    new_version?: string;
    message?: string;
    performed_by?: string | null;
    created_at: string;
}

export interface ModrinthSearchResult {
    project_id: string;
    slug: string;
    title: string;
    description: string;
    categories: string[];
    client_side: string;
    server_side: string;
    icon_url: string;
    downloads: number;
    follows: number;
    author: string;
    versions: string[];
}

// Email Sender Configuration & Template Types
export type EmailTemplateKey = "reminder" | "transaction" | "settlement" | "commission";

export interface EmailSenderConfig {
    id: EmailTemplateKey;
    name: string;
    defaultSenderName: string;
    defaultEmail: string;
    fallbackAddress: string;
    envOverrideKey: string;
    subjectPrefix: string;
    description: string;
}



