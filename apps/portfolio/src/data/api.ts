import { type ApiEndpoint } from "./types";

/**
 * Static documentation registry of all API endpoints across the Machi portfolio & web application.
 */
export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "admin-assets",
    path: "/api/admin/assets",
    methods: ["GET", "POST", "DELETE"],
    description: "Manage storage bucket assets (list files, upload assets, and delete files) for administrative controls.",
    authRequired: true,
    category: "Admin",
    parameters: ["query (GET)", "file / formData (POST)", "filename (DELETE)"],
    responseDescription: "JSON array of storage assets or status object confirming upload/deletion."
  },
  {
    id: "admin-conversations-user",
    path: "/api/admin/conversations/[userId]",
    methods: ["GET"],
    description: "Retrieve complete chat conversation history for a specific target user ID or guest/unauthenticated visitors.",
    authRequired: true,
    category: "Admin",
    parameters: ["userId (path parameter: registered user ID, 'guest', or 'unauthenticated')"],
    responseDescription: "JSON array of conversation objects and message transcripts for the user or guest visitors."
  },
  {
    id: "admin-messages",
    path: "/api/admin/messages",
    methods: ["GET", "PATCH"],
    description: "Fetch list of user contact messages or update message resolution/read status.",
    authRequired: true,
    category: "Admin",
    parameters: ["status filter (GET)", "messageId & isRead (PATCH)"],
    responseDescription: "JSON list of contact inquiries or updated message record."
  },
  {
    id: "admin-profiles",
    path: "/api/admin/profiles",
    methods: ["GET", "PATCH"],
    description: "List registered user profiles or update profile roles and access privileges.",
    authRequired: true,
    category: "Admin",
    parameters: ["userId, role, status (PATCH)"],
    responseDescription: "JSON array of user profiles or updated profile entity."
  },
  {
    id: "admin-site-data",
    path: "/api/admin/site-data",
    methods: ["GET", "PATCH", "DELETE"],
    description: "Retrieve full administrative site data, apply system configuration updates, or purge site cache.",
    authRequired: true,
    category: "Admin",
    parameters: ["config payload (PATCH)", "targetKey (DELETE)"],
    responseDescription: "JSON object representing site configuration status."
  },
  {
    id: "agents-commands",
    path: "/api/agents/commands",
    methods: ["GET"],
    description: "Retrieve registered Machi AI agent command categories and executable prompt actions.",
    authRequired: false,
    category: "Agents",
    responseDescription: "JSON array of agent command categories with descriptions and prompt templates."
  },
  {
    id: "certificates",
    path: "/api/certificates",
    methods: ["GET"],
    description: "Fetch professional credentials, academic certifications, and digital badges.",
    authRequired: false,
    category: "Certificates",
    responseDescription: "JSON list of Certificate objects matching data/certificates.ts."
  },
  {
    id: "chat",
    path: "/api/chat",
    methods: ["POST"],
    description: "Send prompt text to the Machi AI agent system, executing specialist tools and returning formatted response.",
    authRequired: false,
    category: "Chat",
    parameters: ["message (string)", "conversationId (string, optional)"],
    responseDescription: "JSON response object containing agent text response and metadata."
  },
  {
    id: "contact",
    path: "/api/contact",
    methods: ["POST"],
    description: "Submit visitor contact inquiry message to portfolio owner.",
    authRequired: false,
    category: "Contact",
    parameters: ["name (string)", "email (string)", "message (string)"],
    responseDescription: "JSON object confirming message delivery status."
  },
  {
    id: "conversations-id",
    path: "/api/conversations/[id]",
    methods: ["GET", "DELETE"],
    description: "Retrieve message history for a specific conversation ID or delete the conversation session.",
    authRequired: true,
    category: "Conversations",
    parameters: ["id (path parameter)"],
    responseDescription: "JSON conversation object with message thread or deletion confirmation."
  },
  {
    id: "conversations",
    path: "/api/conversations",
    methods: ["GET", "POST"],
    description: "List all active chat conversations for the current user or create a new conversation context.",
    authRequired: true,
    category: "Conversations",
    parameters: ["title (string, optional POST)"],
    responseDescription: "JSON list of user conversations or created conversation metadata."
  },
  {
    id: "site-data",
    path: "/api/site-data",
    methods: ["GET"],
    description: "Fetch public site configuration, system features, and architectural metadata.",
    authRequired: false,
    category: "Site Data",
    responseDescription: "JSON object containing public site settings and metadata."
  },
  {
    id: "uoweme-id",
    path: "/api/uoweme/[id]",
    methods: ["PATCH", "DELETE"],
    description: "Update payment/settlement status of a UoweMe debt split item or delete the entry.",
    authRequired: true,
    category: "UoweMe",
    parameters: ["id (path parameter)", "status / paidAmount (PATCH)"],
    responseDescription: "JSON object with updated item or deletion status."
  },
  {
    id: "uoweme",
    path: "/api/uoweme",
    methods: ["GET", "POST"],
    description: "Fetch list of bill split records or create a new UoweMe debt sharing entry.",
    authRequired: true,
    category: "UoweMe",
    parameters: ["title, amount, debtor, creditor (POST)"],
    responseDescription: "JSON array of debt entries or newly created UoweMe record."
  },
  {
    id: "visits",
    path: "/api/visits",
    methods: ["POST"],
    description: "Log portfolio page view visit count and analytics event.",
    authRequired: false,
    category: "Visits",
    parameters: ["path (string, optional)"],
    responseDescription: "JSON object with updated total visit count."
  },
  {
    id: "reports",
    path: "/api/reports",
    methods: ["POST", "OPTIONS"],
    description: "Generate AI weekly technical report from git logs or handle manual report file uploads to Supabase storage.",
    authRequired: true,
    category: "Reports",
    parameters: ["x-api-key (Header)", "date (JSON string YYYY-MM-DD)", "file (multipart/form-data)"],
    responseDescription: "JSON object containing generated report data or uploaded public storage URL."
  },
  {
    id: "reviews",
    path: "/api/reviews",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Fetch visitor reviews with summary stats, or submit/update/delete star reviews and comments.",
    authRequired: false,
    category: "Reviews",
    parameters: ["rating (1-5, POST/PATCH)", "comment (string, POST/PATCH)"],
    responseDescription: "JSON array of reviews and rating stats (GET) or inserted/updated/deleted review confirmation."
  },
  {
    id: "auth-callback",
    path: "/auth/callback",
    methods: ["GET"],
    description: "OAuth callback handler exchanging authorization code for Supabase auth session token.",
    authRequired: false,
    category: "Auth",
    parameters: ["code (URL query param)"],
    responseDescription: "HTTP 302 Redirect to destination route with set-cookie headers."
  },
  {
    id: "auth-signout",
    path: "/auth/signout",
    methods: ["POST", "GET"],
    description: "Signs out active user session and clears authentication cookies.",
    authRequired: true,
    category: "Auth",
    responseDescription: "HTTP 302 Redirect to home page with expired auth cookies."
  },
  {
    id: "quicknote-notes",
    path: "/api/quicknote/notes",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Full CRUD for private user Markdown notes stored in the quicknote_notes Supabase table. All operations require authentication; RLS ensures users can only access their own notes.",
    authRequired: true,
    category: "Notes",
    parameters: [
      "id (PATCH & DELETE — note ID)",
      "title (POST & PATCH)",
      "content (POST & PATCH)",
      "tags (POST & PATCH — array of strings)"
    ],
    responseDescription: "GET: JSON array of QuickNote objects. POST: created note object with status 201. PATCH: updated note object. DELETE: { success: true }."
  },
  {
    id: "quicknote-relations",
    path: "/api/quicknote/relations",
    methods: ["GET", "POST", "DELETE"],
    description: "Manage explicit bidirectional note-to-note relations stored in quicknote_note_relations. GET returns related note IDs and a paginated picker list of all other notes. POST inserts both directions atomically. DELETE removes both direction rows.",
    authRequired: true,
    category: "Notes",
    parameters: [
      "noteId (all methods — the source note ID)",
      "relatedNoteId (POST body & DELETE query param)",
      "page (GET, default 1)",
      "limit (GET, default 8, max 50)",
      "search (GET — filter picker notes by title)"
    ],
    responseDescription: "GET: { relatedIds: number[], notes: QuickNote[], total: number, page: number, limit: number }. POST: { success: true } with status 201. DELETE: { success: true }."
  },
  {
    id: "quicknote-generate",
    path: "/api/quicknote/generate",
    methods: ["POST"],
    description: "Generates a full Markdown note with a structured title and rich content based on a short description/prompt using Gemini 2.0 Flash.",
    authRequired: true,
    category: "Notes",
    parameters: [
      "prompt (POST body — short description/topic, string <= 1000 chars)"
    ],
    responseDescription: "POST: { title: string, content: string }."
  },
  {
    id: "quicknote-mcp-clickup",
    path: "/api/quicknote/mcp/clickup",
    methods: ["POST"],
    description: "Connects and verifies ClickUp personal access token for AI MCP server integration and note task export.",
    authRequired: true,
    category: "Notes",
    parameters: [
      "token (POST body — ClickUp Personal API Token pk_...)",
      "title (POST body, optional)",
      "content (POST body, optional)"
    ],
    responseDescription: "POST: { success: true, user: { username, email }, message: string }."
  },
  {
    id: "webhooks-paymongo",
    path: "/api/webhooks/paymongo",
    methods: ["POST", "OPTIONS"],
    description: "PayMongo webhook event listener for tracking link payment status and automatically deducting matching UoweMe debt balances.",
    authRequired: false,
    category: "UoweMe",
    parameters: [
      "paymongo-signature (Header — webhook HMAC signature)",
      "data.attributes.type (JSON body — event type e.g. payment.paid)",
      "data.attributes.data.attributes.amount (JSON body — payment amount in centavos)",
      "data.attributes.data.attributes.remarks (JSON body — debt target ID reference)"
    ],
    responseDescription: "POST: { success: true, eventType: string, paidAmount: number, targetDebtId: string | null }."
  },
  {
    id: "uoweme-checkout",
    path: "/api/uoweme/checkout",
    methods: ["POST"],
    description: "Creates a PayMongo Checkout Session for settling a specific UoweMe transaction with fixed line items matching the debt amount.",
    authRequired: true,
    category: "UoweMe",
    parameters: [
      "debtId (POST body — ID of the transaction to settle)"
    ],
    responseDescription: "POST: { checkoutUrl: string, mode: 'api' | 'fallback' }."
  },
  {
    id: "cron-uoweme-reminders",
    path: "/api/cron/uoweme-reminders",
    methods: ["GET", "OPTIONS"],
    description: "Vercel Cron endpoint scheduled daily at 7:00 AM PHT to evaluate due debt records and send styled HTML email notifications to users.",
    authRequired: false,
    category: "UoweMe",
    parameters: [
      "Authorization (Header — Bearer CRON_SECRET for Vercel execution verification)"
    ],
    responseDescription: "GET: { success: true, totalUnsettledCount: number, totalDueCount: number, emailsDispatched: number }."
  },
  {
    id: "uoweme-users",
    path: "/api/uoweme/users",
    methods: ["GET"],
    description: "Fetches list of registered user email addresses for auto-suggestion dropdown in UOweMe debt creation.",
    authRequired: true,
    category: "UoweMe",
    responseDescription: "GET: { users: Array<{ id: string, email: string, full_name: string | null }> }."
  },
  {
    id: "test-send-email",
    path: "/api/test/send-email",
    methods: ["POST"],
    description: "Developer testing route to trigger and verify HTML email template rendering and delivery via Resend.",
    authRequired: false,
    category: "Developer",
    parameters: ["personEmail", "templateType", "amount", "direction", "note", "settled", "source"],
    responseDescription: "POST: { success: boolean, data?: object, mock?: boolean, message?: string }."
  },
  {
    id: "commissions",
    path: "/api/commissions",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    description: "Commission request management and booking pipeline. GET retrieves requests (all for admins, user-scoped for clients). POST validates and saves bookings to Supabase with automated email dispatch to admins. PATCH updates request status/notes (admin). DELETE purges commission requests (admin).",
    authRequired: false,
    category: "Commissions",
    parameters: [
      "name, email, service_type, title, description, budget, deadline (POST body)",
      "id, status, admin_notes (PATCH body)",
      "id (DELETE query parameter)"
    ],
    responseDescription: "GET: { commissions: CommissionRequest[], isAdmin: boolean }. POST: { commission: CommissionRequest, success: true } (201). PATCH: { commission: CommissionRequest, success: true }. DELETE: { success: true }."
  },
  {
    id: "media-upload",
    path: "/api/media/upload",
    methods: ["POST"],
    description: "Uploads an image file via FormData, automatically converts raster images to optimized WebP format with Sharp, stores in the Supabase assets bucket under /media-library, and returns the public CDN URL for embedding in rich text editors and emails.",
    authRequired: false,
    category: "Commissions",
    parameters: ["file (File/Blob in FormData)", "folder (string, optional, defaults to 'media-library')"],
    responseDescription: "POST: { success: boolean, url: string, filename: string, storagePath: string } (200)."
  },
  {
    id: "mmm-organizations",
    path: "/api/mmm/organizations",
    methods: ["GET", "POST"],
    description: "Lists organizations for the authenticated user or creates a new organization with a default mod list and auto-generated invite code.",
    authRequired: true,
    category: "MMM",
    parameters: ["name, description, minecraft_version, modloader (POST body)"],
    responseDescription: "GET: { organizations: MmmOrganization[] }. POST: { organization: MmmOrganization, modList: MmmModList } (201)."
  },
  {
    id: "mmm-organization-detail",
    path: "/api/mmm/organizations/[id]",
    methods: ["GET", "PATCH", "DELETE"],
    description: "Fetches organization details (including members and mod lists), updates settings (name, minecraft_version, modloader), or deletes the organization (owner only).",
    authRequired: true,
    category: "MMM",
    parameters: ["id (path param)", "name, description, minecraft_version, modloader (PATCH body)"],
    responseDescription: "GET: { organization: MmmOrganization, members: MmmOrganizationMember[], modLists: MmmModList[], userRole: string }. PATCH: { organization: MmmOrganization }. DELETE: { success: true }."
  },
  {
    id: "mmm-organizations-join",
    path: "/api/mmm/organizations/join",
    methods: ["POST"],
    description: "Joins an organization using its unique invite code.",
    authRequired: true,
    category: "MMM",
    parameters: ["invite_code (POST body)"],
    responseDescription: "POST: { organization: MmmOrganization, member: MmmOrganizationMember, message: string } (200)."
  },
  {
    id: "mmm-mod-list-mods",
    path: "/api/mmm/mod-lists/[id]/mods",
    methods: ["GET", "POST", "DELETE"],
    description: "Lists all installed mods in a mod list, adds a mod from Modrinth or custom source (recording history log 'add'), or removes a mod (recording history log 'remove').",
    authRequired: true,
    category: "MMM",
    parameters: [
      "id (path param)",
      "modrinth_id, modrinth_slug, name, summary, icon_url, author, download_url, filename, version_number, minecraft_version, modloader (POST body)",
      "modId (DELETE query parameter)"
    ],
    responseDescription: "GET: { mods: MmmMod[] }. POST: { mod: MmmMod, success: true } (201). DELETE: { success: true, removedModId: string }."
  },
  {
    id: "mmm-mod-list-history",
    path: "/api/mmm/mod-lists/[id]/history",
    methods: ["GET"],
    description: "Fetches git-like version control change history for a mod list (added/removed/updated mods log).",
    authRequired: true,
    category: "MMM",
    parameters: ["id (path param)"],
    responseDescription: "GET: { history: MmmModHistory[] }."
  },
  {
    id: "mmm-modrinth-search",
    path: "/api/mmm/modrinth/search",
    methods: ["GET"],
    description: "Queries Modrinth v2 API to search mods matching Minecraft version and modloader filters.",
    authRequired: false,
    category: "MMM",
    parameters: ["query, version, loader, limit, offset (GET query params)"],
    responseDescription: "GET: { hits: ModrinthSearchResult[], total_hits: number }."
  },
  {
    id: "mmm-modrinth-match-files",
    path: "/api/mmm/modrinth/match-files",
    methods: ["POST"],
    description: "Takes an array of local .jar filenames or SHA-1 hashes and cross-references them against Modrinth's version hash index and search API to resolve metadata, download URLs, and version numbers.",
    authRequired: false,
    category: "MMM",
    parameters: ["filenames (string[]), hashes (string[]), version (string), loader (string)"],
    responseDescription: "POST: { matched: MmmMod[], unmatched: string[], count: number } (200)."
  },
  {
    id: "mmm-scan-local",
    path: "/api/mmm/scan-local",
    methods: ["POST"],
    description: "Scans local Minecraft mods directory (%AppData%\\.minecraft\\mods on Windows or ~/.minecraft/mods on Linux/macOS) directly, extracts file hashes, and resolves them against Modrinth.",
    authRequired: false,
    category: "MMM",
    parameters: ["customPath (optional), version (string), loader (string)"],
    responseDescription: "POST: { exists: boolean, path: string, foundFiles: string[], matched: MmmMod[], unmatched: string[], count: number } (200)."
  },
  {
    id: "mmm-upload",
    path: "/api/mmm/upload",
    methods: ["POST"],
    description: "Uploads custom Minecraft mod .jar or .zip files directly to Supabase storage bucket ('assets/mmm-mods/'), saves metadata, and adds the mod to the organization's mod list.",
    authRequired: true,
    category: "MMM",
    parameters: ["file (File), mod_list_id (string), org_id (string), name (string), summary (string), author (string), version_number (string), minecraft_version (string), modloader (string), dependencies (JSON string) (POST FormData)"],
    responseDescription: "POST: { success: true, mod: MmmMod, download_url: string } (201)."
  }
];

export function getApiEndpointsByCategory(category: ApiEndpoint["category"]): ApiEndpoint[] {
  return apiEndpoints.filter((endpoint) => endpoint.category === category);
}

export function getApiEndpointByPath(path: string): ApiEndpoint | undefined {
  return apiEndpoints.find((endpoint) => endpoint.path === path);
}

