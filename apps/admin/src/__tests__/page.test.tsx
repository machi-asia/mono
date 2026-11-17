import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import type { AdminOverviewResponse } from "@mono/api-client";
import { AdminDashboard } from "../components/admin-dashboard";
import { AdminNavbar } from "../components/admin-navbar";
import { ItemListAdminView } from "../components/itemlist-admin-view";
import RoseAdminPage from "../app/rose/page";
import SiteAdminPage from "../app/[siteId]/page";

const mockAuthState = {
  user: { id: "admin-1", email: "admin@machi.asia", user_metadata: { name: "Super Admin" } },
  role: "admin",
  isLoading: false,
  isGuest: false,
  refreshRole: vi.fn().mockResolvedValue("admin"),
  signOut: vi.fn().mockResolvedValue(undefined),
};

const mockOverview: AdminOverviewResponse = {
  ok: true,
  siteId: "all",
  stats: {
    totalUsers: 2,
    totalGuests: 1,
    onlineVisitors: 2,
    totalSessions: 3,
    totalApiRequests: 142,
    totalRoseChats: 1,
    openTickets: 1,
    pendingReports: 1,
  },
  breakdowns: {
    byApp: { rose: 2, calculator: 1 },
    byReferrer: { "google.com": 2, "Direct / Bookmark": 1 },
    byCountry: { SG: 2, JP: 1 },
    byDevice: { desktop: 2, mobile: 1 },
  },
  users: [
    {
      userId: "admin-1",
      email: "admin@machi.asia",
      displayName: "Super Admin",
      avatarUrl: null,
      role: "admin",
      isGuest: false,
      isOnline: true,
      currentApp: "admin",
      hostname: "admin.machi.asia",
      pathname: "/",
      referrer: "https://machi.asia",
      utmSource: null,
      country: "SG",
      region: "01",
      city: "Singapore",
      ipAddress: "203.0.113.10",
      deviceType: "desktop",
      browser: "Chrome 126",
      os: "Windows 11",
      lastSeenAt: "2026-11-17T09:00:00.000Z",
      createdAt: "2026-11-01T00:00:00.000Z",
      totalDailyUsage: 12,
      totalMonthlyUsage: 120,
      roseChatCount: 0,
      providers: ["google"],
      canChangeRole: true,
    },
    {
      userId: "22222222-2222-4222-8222-222222222222",
      email: "alice@machi.asia",
      displayName: "Alice",
      avatarUrl: null,
      role: "member",
      isGuest: false,
      isOnline: true,
      currentApp: "rose",
      hostname: "rose.machi.asia",
      pathname: "/chat",
      referrer: "https://google.com",
      utmSource: "organic",
      country: "JP",
      region: "13",
      city: "Tokyo",
      ipAddress: "198.51.100.8",
      deviceType: "mobile",
      browser: "Safari 17",
      os: "iOS 17",
      lastSeenAt: "2026-11-17T09:01:00.000Z",
      createdAt: "2026-11-10T00:00:00.000Z",
      totalDailyUsage: 5,
      totalMonthlyUsage: 42,
      roseChatCount: 1,
      providers: ["email"],
      canChangeRole: true,
    },
    {
      userId: "ip:192.0.2.50",
      email: null,
      displayName: "Guest",
      avatarUrl: null,
      role: "guest",
      isGuest: true,
      isOnline: false,
      currentApp: "calculator",
      hostname: "calculator.machi.asia",
      pathname: "/satisfactory",
      referrer: "https://reddit.com",
      utmSource: null,
      country: "SG",
      region: "01",
      city: "Singapore",
      ipAddress: "192.0.2.50",
      deviceType: "desktop",
      browser: "Firefox 129",
      os: "Linux",
      lastSeenAt: "2026-11-17T07:00:00.000Z",
      createdAt: "2026-11-17T07:00:00.000Z",
      totalDailyUsage: 3,
      totalMonthlyUsage: 3,
      roseChatCount: 0,
      providers: [],
      canChangeRole: false,
    },
  ],
  visitors: [],
  usages: [
    {
      id: "u1",
      user_id: "22222222-2222-4222-8222-222222222222",
      app: "rose",
      metric: "turns",
      period_type: "daily",
      period_key: "2026-11-17",
      count: 5,
      usage_limit: 60,
      created_at: "2026-11-17T08:00:00.000Z",
      updated_at: "2026-11-17T09:00:00.000Z",
    },
    {
      id: "u2",
      user_id: "22222222-2222-4222-8222-222222222222",
      app: "rose",
      metric: "turns",
      period_type: "monthly",
      period_key: "2026-11",
      count: 42,
      usage_limit: 1200,
      created_at: "2026-11-01T00:00:00.000Z",
      updated_at: "2026-11-17T09:00:00.000Z",
    },
  ],
  registeredMetrics: [],
  systemSummary: {},
  roseChats: [
    {
      id: "conv-rose-1",
      userId: "22222222-2222-4222-8222-222222222222",
      userEmail: "alice@machi.asia",
      userName: "Alice",
      isGuest: false,
      role: "member",
      title: "Redis chat test",
      createdAt: "2026-11-17T08:30:00.000Z",
      updatedAt: "2026-11-17T09:00:00.000Z",
      messages: [
        { id: "m1", role: "user", text: "Hello Rose from mobile!" },
        { id: "m2", role: "model", text: "Hi Alice! Synced in Redis.", emotion: "happy", traces: ["memory"] },
      ],
      history: [],
      lastEmotion: "happy",
      totalTurns: 1,
      estimatedTokens: 64,
      originApp: "rose",
    },
  ],
  tickets: [
    {
      id: "ticket-1",
      user_id: "22222222-2222-4222-8222-222222222222",
      user_email: "alice@machi.asia",
      type: "bug_report",
      app: "rose",
      subject: "Sample ticket",
      message: "Checking ticket triage",
      status: "open",
      metadata: {},
      created_at: "2026-11-17T08:40:00.000Z",
      updated_at: "2026-11-17T08:40:00.000Z",
    },
  ],
  reports: [],
};

const mockApiClient = {
  admin: {
    getOverview: vi.fn(),
    updateUserRole: vi.fn(),
    manageUsage: vi.fn(),
    deleteRoseChat: vi.fn(),
    updateTicketStatus: vi.fn(),
  },
  itemlist: {
    admin: {
      getReports: vi.fn(),
      updateReportStatus: vi.fn(),
    },
  },
};

vi.mock("@mono/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mono/auth")>();
  return {
    ...actual,
    useAuth: () => mockAuthState,
    useApiClient: () => mockApiClient,
    AuthNavbar: ({ brand, links, actions }: any) => (
      <nav data-testid="mock-auth-navbar">
        {brand}
        {(links || []).map((l: any) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {actions}
      </nav>
    ),
    SignInModal: ({ title }: any) => <div data-testid="mock-signin-modal">{title || "Sign In"}</div>,
  };
});

describe("Machi Asia Admin Portal (apps/admin)", () => {
  beforeEach(() => {
    mockAuthState.user = {
      id: "admin-1",
      email: "admin@machi.asia",
      user_metadata: { name: "Super Admin" },
    };
    mockAuthState.role = "admin";
    mockAuthState.isLoading = false;
    mockAuthState.isGuest = false;
    mockApiClient.admin.getOverview.mockResolvedValue(mockOverview);
    mockApiClient.admin.updateUserRole.mockResolvedValue({ ok: true, userId: "22222222-2222-4222-8222-222222222222", role: "admin" });
    mockApiClient.admin.manageUsage.mockResolvedValue({
      ok: true,
      success: true,
      dailyCount: 0,
      dailyLimit: 60,
      monthlyCount: 0,
      monthlyLimit: 1200,
    });
    mockApiClient.admin.deleteRoseChat.mockResolvedValue({ ok: true, deleted: true });
    mockApiClient.admin.updateTicketStatus.mockResolvedValue({ ok: true, ticket: mockOverview.tickets[0] });
    mockApiClient.itemlist.admin.getReports.mockResolvedValue([
      {
        id: "rep-1",
        game_id: "create",
        item_id: "cogwheel",
        item_name: "Cogwheel",
        issue_type: "recipe_wrong",
        description: "Needs planks",
        suggested_fix: "1 shaft + 1 plank",
        reporter_hash: "h1",
        corrections: {},
        consensus_key: "cogwheel::{}",
        status: "pending",
        created_at: "2026-11-17T08:00:00.000Z",
      },
    ]);
    mockApiClient.itemlist.admin.updateReportStatus.mockResolvedValue({ ok: true, success: true });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders AdminNavbar with global and per-site links", () => {
    render(<AdminNavbar />);
    expect(screen.getByText("Machi Asia Admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Rose AI" })).toHaveAttribute("href", "/rose");
    expect(screen.getByRole("link", { name: "ItemList" })).toHaveAttribute("href", "/itemlist");
  });

  it("blocks non-admin accounts behind the AdminGate", async () => {
    mockAuthState.role = "member";
    mockAuthState.refreshRole.mockResolvedValue("member");
    render(<AdminDashboard />);
    expect(await screen.findByText("Administrator Access Required")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch \/ Sign In Admin/i })).toBeInTheDocument();
  });

  it("monitors visitors, origins, changes roles, resets usage, and inspects Rose AI Redis chats", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Machi Asia Admin Portal")).toBeInTheDocument();
    });

    expect(screen.getByText("google.com")).toBeInTheDocument();
    expect(screen.getByText("Per-Site Admin Portals")).toBeInTheDocument();
    expect(screen.getByText("*.machi.asia")).toBeInTheDocument();
    expect(screen.getByText("*.itemlist.online")).toBeInTheDocument();
    expect(screen.getByText("Machi Asia Ecosystem")).toBeInTheDocument();
    expect(screen.getByText("ItemList Online Ecosystem")).toBeInTheDocument();

    // Switch to Users, Guests & Roles tab
    fireEvent.click(screen.getByRole("tab", { name: /Users, Guests & Roles/i }));
    expect(screen.getByText("alice@machi.asia")).toBeInTheDocument();
    expect(screen.getByText(/Tokyo, 13, JP/i)).toBeInTheDocument();
    expect(screen.getByText(/From: https:\/\/google\.com/i)).toBeInTheDocument();
    expect(screen.getByText("IP Guest")).toBeInTheDocument();

    // Promote Alice to Admin
    const makeAdminBtns = screen.getAllByRole("button", { name: /Make Admin/i });
    fireEvent.click(makeAdminBtns[0]);
    await waitFor(() => {
      expect(mockApiClient.admin.updateUserRole).toHaveBeenCalledWith(
        "22222222-2222-4222-8222-222222222222",
        "admin"
      );
    });

    // Switch to Usage & Quotas tab and reset
    fireEvent.click(screen.getByRole("tab", { name: /Usage & Quotas/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Reset$/i }));
    await waitFor(() => {
      expect(mockApiClient.admin.manageUsage).toHaveBeenCalledWith({
        userId: "22222222-2222-4222-8222-222222222222",
        app: "rose",
        metric: "turns",
        action: "reset",
      });
    });

    // Switch to Rose AI Chats (Redis) tab
    fireEvent.click(screen.getByRole("tab", { name: /Rose AI Chats/i }));
    expect(screen.getByRole("heading", { name: "Redis chat test" })).toBeInTheDocument();
    expect(screen.getByText("Hi Alice! Synced in Redis.")).toBeInTheDocument();
  });

  it("renders dedicated /rose, /itemlist, and dynamic /[siteId] admin pages", async () => {
    render(<RoseAdminPage />);
    await waitFor(() => {
      expect(screen.getByText("Rose AI Admin")).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Redis chat test" })).toBeInTheDocument();
    cleanup();

    render(<ItemListAdminView />);
    await waitFor(() => {
      expect(screen.getByText("Cogwheel")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Mark Resolved/i }));
    await waitFor(() => {
      expect(mockApiClient.itemlist.admin.updateReportStatus).toHaveBeenCalledWith("rep-1", "resolved");
    });
    cleanup();

    const SitePageEl = await SiteAdminPage({ params: Promise.resolve({ siteId: "calculator" }) });
    render(SitePageEl);
    await waitFor(() => {
      expect(screen.getByText("Production Calculator Admin")).toBeInTheDocument();
    });
  });
});
