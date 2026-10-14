export interface DataPrivacyCollectionItem {
  name: string;
  description: string;
  required: boolean;
  purpose: string;
  retention: string;
}

export interface PageDataPrivacy {
  id: string;
  pageTitle: string;
  route: string;
  category: "core" | "auth" | "subsite" | "utility" | "test";
  description: string;
  summary: string;
  dataCollected: DataPrivacyCollectionItem[];
}

export const dataPrivacyPages: PageDataPrivacy[] = [
  {
    id: "home-portfolio",
    pageTitle: "Home / Portfolio Landing",
    route: "/",
    category: "core",
    description: "The primary portfolio showcase featuring interactive projects, tech stack, visitor reviews, and AI chatbot.",
    summary: "Collects anonymous aggregate visit telemetry, optional contact form inquiries, interactive chat turns, and local theme preferences.",
    dataCollected: [
      {
        name: "Anonymous Visit Telemetry",
        description: "Hashed IP address, user-agent string, referrer URL, and visit timestamp.",
        required: false,
        purpose: "Aggregated site visitor counters, geo-distribution insights, and bot prevention.",
        retention: "Persisted indefinitely in Supabase visits table as non-personally identifiable aggregate logs.",
      },
      {
        name: "Contact Inquiries",
        description: "Sender name, email address, optional organization, and inquiry message body.",
        required: false,
        purpose: "Direct correspondence and client contact inquiries sent via /api/contact.",
        retention: "Stored in Supabase contact_messages and forwarded to admin via Resend email.",
      },
      {
        name: "AI Chatbot Conversation",
        description: "User chat prompts, AI model responses, and active session identifiers.",
        required: false,
        purpose: "Maintains multi-turn context for the Gemini AI assistant and enables admin conversation reviews.",
        retention: "Stored in Redis cache (ephemeral TTL) and archived in Supabase conversations table.",
      },
      {
        name: "Theme Customizer Preferences",
        description: "Dark/light mode state and selected accent color palette (gold, indigo, emerald, rose).",
        required: false,
        purpose: "Restores visual UI theme upon return visits.",
        retention: "Stored exclusively in the browser's localStorage; never transmitted to the server.",
      },
    ],
  },
  {
    id: "login-page",
    pageTitle: "Sign In / Authentication",
    route: "/login",
    category: "auth",
    description: "Account login interface supporting email/password and OAuth providers (Google, GitHub).",
    summary: "Collects user credentials or OAuth identifiers to authenticate identities and issue secure session tokens.",
    dataCollected: [
      {
        name: "Email & Password Hash",
        description: "User email address and salted bcrypt password hash.",
        required: true,
        purpose: "Authenticates registered user accounts.",
        retention: "Managed by Supabase Auth with encrypted storage; plaintext passwords are never stored.",
      },
      {
        name: "OAuth Profile Data",
        description: "OAuth provider ID, verified email address, full name, and avatar image URL.",
        required: true,
        purpose: "Authenticates identities via Google or GitHub OAuth flows.",
        retention: "Synced to Supabase profiles table for account personalization.",
      },
      {
        name: "Session JWT Tokens",
        description: "Signed JWT access tokens and refresh tokens.",
        required: true,
        purpose: "Maintains secure authenticated session across site navigation.",
        retention: "Stored in HttpOnly secure browser cookies; auto-refreshed until sign-out.",
      },
    ],
  },
  {
    id: "signup-page",
    pageTitle: "Sign Up / Registration",
    route: "/signup",
    category: "auth",
    description: "New user account onboarding portal for email sign-up and OAuth registration.",
    summary: "Collects registration credentials to initialize a new user profile in the database.",
    dataCollected: [
      {
        name: "Account Credentials",
        description: "Email address, password, and chosen display name.",
        required: true,
        purpose: "Creates a new Supabase Auth user record and associated profile.",
        retention: "Persisted until account deletion requested by user or admin.",
      },
      {
        name: "Verification Timestamp",
        description: "Email confirmation token and account creation timestamp.",
        required: true,
        purpose: "Verifies account legitimacy and prevents spam registrations.",
        retention: "Permanent audit record in Supabase auth.users.",
      },
    ],
  },
  {
    id: "admin-dashboard",
    pageTitle: "Admin Dashboard",
    route: "/admin",
    category: "core",
    description: "Restricted administrative console for managing messages, review moderation, and system telemetry.",
    summary: "Requires administrator authentication and accesses platform-wide moderation data.",
    dataCollected: [
      {
        name: "Admin Role Verification",
        description: "JWT claim verifying profiles.role === 'admin'.",
        required: true,
        purpose: "Enforces strict authorization for sensitive administrative endpoints.",
        retention: "Verified on every request through Supabase server client and RLS policies.",
      },
      {
        name: "Admin Activity Logs",
        description: "Timestamps of message status updates, review moderation actions, and user role modifications.",
        required: false,
        purpose: "Administrative audit trail and change tracking.",
        retention: "Persisted in database transaction records.",
      },
    ],
  },
  {
    id: "commissions-subsite",
    pageTitle: "Commissions Subsite",
    route: "/sites/commissions",
    category: "subsite",
    description: "Custom software engineering booking platform with interactive scope intake and client offers.",
    summary: "Collects client project specifications, proposed budgets, and contact details for bespoke proposals.",
    dataCollected: [
      {
        name: "Client Booking Information",
        description: "Client name, contact email, project title, detailed description, and timeline requirements.",
        required: true,
        purpose: "Generates custom project proposals and initiates development consultations.",
        retention: "Stored in Supabase commissions table and sent to admin inbox via Resend.",
      },
      {
        name: "Client Proposed Budget",
        description: "Custom budget amount proposed in Philippine Pesos (₱) or USD.",
        required: true,
        purpose: "Establishes commercial scope and pricing expectations.",
        retention: "Persisted within commission record.",
      },
      {
        name: "Project Mockups & Media Attachments",
        description: "Uploaded architecture sketches, wireframes, and image references.",
        required: false,
        purpose: "Clarifies feature expectations and visual requirements.",
        retention: "Stored in Supabase Storage media bucket (assets/media-library/).",
      },
    ],
  },
  {
    id: "uoweme-subsite",
    pageTitle: "U Owe Me (Debt & Expense Tracker)",
    route: "/sites/uoweme",
    category: "subsite",
    description: "Collaborative ledger tracking debts, loans, and shared expenses between peers.",
    summary: "Stores debt ledger records, peer contact info, settlement statuses, and optional PayMongo checkout sessions.",
    dataCollected: [
      {
        name: "User Debt Records",
        description: "Creditor/debtor names, amount, currency, description, due date, and payment status.",
        required: true,
        purpose: "Powers user ledger balances, settlement history, and financial reminders.",
        retention: "Stored in Supabase debts table with Row-Level Security (RLS) strictly scoped to user.",
      },
      {
        name: "Peer Email & Notifications",
        description: "Peer email address for automated payment reminder notifications.",
        required: false,
        purpose: "Dispatches 7:00 AM daily reminder emails for upcoming and overdue balances via Resend.",
        retention: "Linked to debt records until settled or deleted by user.",
      },
      {
        name: "PayMongo Payment Metadata",
        description: "Checkout session IDs, payment intent tokens, and payment confirmation webhooks.",
        required: false,
        purpose: "Enables online debt settlement via e-wallets, cards, and bank transfers.",
        retention: "Payment transaction IDs logged in database; raw card numbers are never stored.",
      },
    ],
  },
  {
    id: "uoweme-share",
    pageTitle: "U Owe Me Public Share View",
    route: "/share/uoweme",
    category: "utility",
    description: "Public read-only invoice and ledger view for shared debt links.",
    summary: "Resolves shared debt tokens for read-only view without exposing other user accounts.",
    dataCollected: [
      {
        name: "Share Token Identifier",
        description: "Cryptographic share token passed in URL query.",
        required: true,
        purpose: "Fetches specific shared debt metadata without requiring peer login.",
        retention: "Read-only lookup from Supabase debts table.",
      },
    ],
  },
  {
    id: "wiki-knowledge-base",
    pageTitle: "Wiki Knowledge Base",
    route: "/sites/wiki",
    category: "subsite",
    description: "Interactive encyclopedia covering technical specifications, system architecture, and career history.",
    summary: "Read-only static knowledge base with client-side search and browser-local view history.",
    dataCollected: [
      {
        name: "Client Search Terms",
        description: "In-memory query string entered into the wiki filter search bar.",
        required: false,
        purpose: "Filters article list live in the browser.",
        retention: "Ephemeral in React component state; never transmitted to the server.",
      },
      {
        name: "Recent Article Views",
        description: "List of recently visited article slugs.",
        required: false,
        purpose: "Populates 'Recent Updates' and quick navigation links.",
        retention: "Stored locally in browser sessionStorage.",
      },
    ],
  },
  {
    id: "machi-analytics",
    pageTitle: "Machi Analytics & Observability",
    route: "/sites/analytics",
    category: "subsite",
    description: "Repository features graph, git commit history timeline, and Grafana Prometheus metrics dashboard.",
    summary: "Visualizes application architecture and infrastructure metrics; collects no personal user data.",
    dataCollected: [
      {
        name: "Architecture Graph Telemetry",
        description: "Fetches public static architecture dataset assets/architecture.json.",
        required: false,
        purpose: "Renders the interactive SVG node topology and system architecture DAG.",
        retention: "Public static JSON file hosted in Supabase Storage.",
      },
      {
        name: "Prometheus Database Metrics",
        description: "Aggregated PostgreSQL performance metrics (QPS, pooler connections, memory, cache hit ratio).",
        required: false,
        purpose: "Streams system health and observability telemetry to GrafanaDashboard.",
        retention: "Real-time read-only metrics feed; contains zero user PII.",
      },
    ],
  },
  {
    id: "visitors-reviews",
    pageTitle: "Visitors & Reviews",
    route: "/sites/visitors",
    category: "subsite",
    description: "Community feedback forum for leaving star ratings and testimonials for the portfolio.",
    summary: "Collects public star ratings, user comments, author names, and avatars.",
    dataCollected: [
      {
        name: "Review Testimonial",
        description: "Star rating (1 to 5), written feedback comment, and submission timestamp.",
        required: true,
        purpose: "Displayed publicly in the community reviews section.",
        retention: "Stored in Supabase reviews table; editable or deletable by author or admin.",
      },
      {
        name: "Reviewer Profile Identity",
        description: "Author display name, avatar URL, and authenticated user ID.",
        required: true,
        purpose: "Attributes reviews to authenticated community members.",
        retention: "Publicly visible on the visitors page alongside review content.",
      },
    ],
  },
  {
    id: "quicknote-subsite",
    pageTitle: "QuickNote (Encrypted Markdown Notes)",
    route: "/sites/quicknote",
    category: "subsite",
    description: "Private Markdown note-taking workspace with tag graphs, folders, and AI summarization.",
    summary: "Stores private user notes, markdown bodies, categorization tags, and optional ClickUp task synchronizations.",
    dataCollected: [
      {
        name: "Private Note Documents",
        description: "Note titles, markdown content, tags, folder IDs, pinned status, and favorites.",
        required: true,
        purpose: "Powers personal knowledge base and encrypted note management.",
        retention: "Protected by Supabase RLS; accessible strictly by the note author.",
      },
      {
        name: "AI Prompt / Generation Input",
        description: "Prompts provided to the AI note assistant for auto-generating outlines and tags.",
        required: false,
        purpose: "Processed via Gemini API in /api/quicknote/generate to create structured notes.",
        retention: "Ephemeral during generation; only final saved note is persisted.",
      },
    ],
  },
  {
    id: "mmm-subsite",
    pageTitle: "MMM (Minecraft Mod Manager)",
    route: "/sites/mmm",
    category: "subsite",
    description: "Collaborative mod list manager with organization multi-tenancy, Modrinth search, and bulk downloader.",
    summary: "Collects organization memberships, mod lists, change audit history, and optional custom mod file binaries.",
    dataCollected: [
      {
        name: "Organization & Membership",
        description: "Organization name, slug, member user IDs, and role permissions.",
        required: true,
        purpose: "Manages multi-tenant teams and mod list access control.",
        retention: "Stored in Supabase mmm_organizations and mmm_organization_members tables.",
      },
      {
        name: "Mod List & History Audit Trail",
        description: "Mod names, Modrinth project slugs, loaders (Fabric/Forge), game versions, and changelog revisions.",
        required: true,
        purpose: "Maintains git-style immutable history log of all mod updates and configuration changes.",
        retention: "Stored in Supabase mmm_mod_history table.",
      },
      {
        name: "Custom Mod Binaries (.jar / .zip)",
        description: "User-uploaded third-party mod files and metadata.",
        required: false,
        purpose: "Enables hosting custom mods for organization-wide download.",
        retention: "Stored in Supabase Storage assets/mmm-mods/ bucket with author user ID metadata.",
      },
      {
        name: "Local Mods Directory File Hashes",
        description: "SHA-1 hashes of local .jar files in %AppData%/.minecraft/mods.",
        required: false,
        purpose: "Cross-references local files against Modrinth database during one-click folder scans.",
        retention: "Computed in-browser; hashes are queried in memory and never stored.",
      },
    ],
  },
  {
    id: "mmm-join",
    pageTitle: "MMM Organization Invite Join",
    route: "/sites/mmm/join",
    category: "subsite",
    description: "Invite link acceptance landing page for Minecraft Mod Manager organizations.",
    summary: "Validates invite tokens and registers user into the organization member list.",
    dataCollected: [
      {
        name: "Invite Token",
        description: "Unique invite code passed via URL query parameter (?code=...).",
        required: true,
        purpose: "Validates membership authorization.",
        retention: "Checked against Supabase mmm_organizations.invite_code.",
      },
      {
        name: "Membership Association",
        description: "Authenticated user ID and assigned member role.",
        required: true,
        purpose: "Adds user to organization team upon confirmation.",
        retention: "Stored in Supabase mmm_organization_members table.",
      },
    ],
  },
  {
    id: "subdomains-ai-game",
    pageTitle: "AI Game Showcase Subdomain",
    route: "/subdomains/ai-game",
    category: "utility",
    description: "Interactive browser game demo showcasing AI gameplay mechanics.",
    summary: "Runs in-browser game loops and stores local high scores in browser storage.",
    dataCollected: [
      {
        name: "Gameplay State & High Scores",
        description: "Current game level, player score, and settings.",
        required: false,
        purpose: "Restores previous player game progress.",
        retention: "Stored in browser localStorage; no server tracking.",
      },
    ],
  },
  {
    id: "test-gallery",
    pageTitle: "Design System Showcase & Test Hub",
    route: "/test",
    category: "test",
    description: "Interactive component gallery, email studio, and loader showcase for engineering inspection.",
    summary: "Development testing sandbox with zero persistent tracking.",
    dataCollected: [
      {
        name: "Test Email Recipient",
        description: "Recipient email entered into Email Studio for testing preview rendering.",
        required: false,
        purpose: "Dispatches sample rendered transactional emails via Resend for inspection.",
        retention: "One-shot dispatch; email address is not stored in database.",
      },
    ],
  },
];

export function getPagePrivacyByRoute(route: string): PageDataPrivacy | undefined {
  return dataPrivacyPages.find((p) => p.route === route);
}
