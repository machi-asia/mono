"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAdminSupabaseClient } from "../lib/supabase";
import {
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Filter,
  Search,
  Check,
  Users,
} from "lucide-react";

interface IssueReportRow {
  id: string;
  game_id: string;
  item_id: string;
  item_name: string;
  issue_type: string;
  description: string | null;
  suggested_fix: string | null;
  reporter_hash: string;
  corrections: {
    recipeMethod?: string;
    machineRequired?: string;
    outputAmount?: number;
    ingredients?: Array<{ name: string; amount: number }>;
    processingTimeSeconds?: number;
    speedRpm?: number;
    intendedItemsPerMin?: number;
    iconUrl?: string;
  };
  consensus_key: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [reports, setReports] = useState<IssueReportRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gameFilter, setGameFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthAndLoadData() {
      const supabase = getAdminSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserEmail(session.user.email || null);

      // Verify admin role in public.user_roles or RPC is_admin
      const { data: adminCheck } = await supabase.rpc("is_admin");
      if (!adminCheck) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Fetch issue reports
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from("issue_reports") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load issue reports:", error);
      } else {
        setReports(data || []);
      }

      setLoading(false);
    }

    checkAuthAndLoadData();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = getAdminSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleUpdateStatus = async (reportId: string, newStatus: "pending" | "resolved" | "rejected") => {
    setUpdatingId(reportId);
    const supabase = getAdminSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("issue_reports") as any)
      .update({ status: newStatus })
      .eq("id", reportId);

    if (!error) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
    } else {
      alert(`Error updating report: ${error.message}`);
    }
    setUpdatingId(null);
  };

  // Group reports by consensus_key to identify crowd-sourced overrides
  const consensusCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of reports) {
      if (r.status !== "rejected") {
        map.set(r.consensus_key, (map.get(r.consensus_key) || 0) + 1);
      }
    }
    return map;
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        !search.trim() ||
        r.item_name.toLowerCase().includes(search.toLowerCase()) ||
        r.item_id.toLowerCase().includes(search.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
        (r.suggested_fix && r.suggested_fix.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesGame = gameFilter === "all" || r.game_id === gameFilter;

      return matchesSearch && matchesStatus && matchesGame;
    });
  }, [reports, search, statusFilter, gameFilter]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Verifying administrator authorization...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-red-800/80 rounded-2xl p-6 text-center space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-red-950/80 text-red-400 border border-red-700/60">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-xs text-zinc-400">
            Authenticated as <span className="text-zinc-200 font-mono">{userEmail}</span>, but your account is not registered in <span className="font-mono text-zinc-300">public.user_roles</span> with the <span className="font-mono text-red-400">&apos;admin&apos;</span> role.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const consensusOverriddenCount = Array.from(consensusCounts.values()).filter((c) => c >= 3).length;

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-zinc-950">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>ItemList Admin Portal</span>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                Staff
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-zinc-400 hidden sm:inline">
            Logged in as <span className="text-zinc-200 font-medium">{userEmail}</span>
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4">
            <span className="text-xs text-zinc-400 font-medium">Total Issue Reports</span>
            <p className="text-2xl font-bold text-white mt-1">{reports.length}</p>
          </div>
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4">
            <span className="text-xs text-zinc-400 font-medium">Pending Review</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4">
            <span className="text-xs text-zinc-400 font-medium">Active Consensus Overrides (≥3 Reports)</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{consensusOverriddenCount}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search reports by item name, ID, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-zinc-800 focus:border-indigo-500 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Game Filter */}
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="bg-black/40 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Games</option>
              <option value="create">Create Mod</option>
              <option value="rimworld">RimWorld</option>
            </select>
          </div>
        </div>

        {/* Reports Table / Card List */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/30">
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No issue reports match your filters.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {filteredReports.map((report) => {
                const count = consensusCounts.get(report.consensus_key) || 1;
                const hasConsensus = count >= 3;

                return (
                  <div key={report.id} className="p-4 sm:p-5 hover:bg-zinc-900/50 transition-colors space-y-3">
                    {/* Top Row: Item Details, Tags, Consensus Indicator */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{report.item_name}</span>
                        <span className="font-mono text-[11px] text-zinc-500">({report.item_id})</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {report.game_id}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {report.issue_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasConsensus && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-600/50 px-2 py-0.5 rounded-full"
                            title="3+ reports with identical expected fields trigger automatic graph override"
                          >
                            <Users className="h-3 w-3" />
                            <span>Consensus Active ({count} reports)</span>
                          </span>
                        )}

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                            report.status === "resolved"
                              ? "bg-emerald-950/40 text-emerald-300 border-emerald-600/40"
                              : report.status === "rejected"
                              ? "bg-red-950/40 text-red-400 border-red-700/40"
                              : "bg-amber-950/40 text-amber-300 border-amber-600/40"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>

                    {/* Report Notes */}
                    <div className="text-xs space-y-1 text-zinc-300 bg-black/30 p-3 rounded-lg border border-zinc-800/80">
                      {report.description && (
                        <p>
                          <span className="text-zinc-500 font-medium">Description: </span>
                          {report.description}
                        </p>
                      )}
                      {report.suggested_fix && (
                        <p>
                          <span className="text-zinc-500 font-medium">Suggested Fix: </span>
                          {report.suggested_fix}
                        </p>
                      )}

                      {/* Structured Corrections Preview */}
                      {report.corrections && Object.keys(report.corrections).length > 0 && (
                        <div className="pt-2 mt-2 border-t border-zinc-800 text-[11px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {report.corrections.recipeMethod && (
                            <div>
                              <span className="text-zinc-500">Method: </span>
                              <span className="text-indigo-300">{report.corrections.recipeMethod}</span>
                            </div>
                          )}
                          {report.corrections.machineRequired && (
                            <div>
                              <span className="text-zinc-500">Facility: </span>
                              <span className="text-indigo-300">{report.corrections.machineRequired}</span>
                            </div>
                          )}
                          {report.corrections.outputAmount !== undefined && (
                            <div>
                              <span className="text-zinc-500">Output Qty: </span>
                              <span className="text-indigo-300 font-mono">{report.corrections.outputAmount}</span>
                            </div>
                          )}
                          {report.corrections.processingTimeSeconds !== undefined && (
                            <div>
                              <span className="text-zinc-500">Processing Time: </span>
                              <span className="text-indigo-300 font-mono">{report.corrections.processingTimeSeconds}s</span>
                            </div>
                          )}
                          {report.corrections.speedRpm !== undefined && (
                            <div>
                              <span className="text-zinc-500">Required Speed: </span>
                              <span className="text-indigo-300 font-mono">{report.corrections.speedRpm} RPM</span>
                            </div>
                          )}
                          {report.corrections.ingredients && report.corrections.ingredients.length > 0 && (
                            <div className="col-span-full">
                              <span className="text-zinc-500">Ingredients: </span>
                              <span className="text-zinc-300">
                                {report.corrections.ingredients.map((i) => `${i.name} (×${i.amount})`).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row: Reporter info, timestamp, status buttons */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="text-zinc-500">
                        <span>Reported {new Date(report.created_at).toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono text-zinc-600">ID: {report.id.substring(0, 8)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {report.status !== "resolved" && (
                          <button
                            type="button"
                            disabled={updatingId === report.id}
                            onClick={() => handleUpdateStatus(report.id, "resolved")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 transition-colors cursor-pointer text-xs disabled:opacity-50"
                          >
                            <Check className="h-3 w-3" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                        {report.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={updatingId === report.id}
                            onClick={() => handleUpdateStatus(report.id, "rejected")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/50 transition-colors cursor-pointer text-xs disabled:opacity-50"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        )}
                        {report.status !== "pending" && (
                          <button
                            type="button"
                            disabled={updatingId === report.id}
                            onClick={() => handleUpdateStatus(report.id, "pending")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer text-xs disabled:opacity-50"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reset to Pending</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
