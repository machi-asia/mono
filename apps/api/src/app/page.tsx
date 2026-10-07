"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Server,
  Activity,
  Play,
  Copy,
  Check,
  Code2,
  Database,
  Bot,
  RefreshCw,
  Cpu,
  Layers,
  Shield,
  Zap,
} from "lucide-react";
import {
  Usage,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  Button,
} from "@mono/components";

interface EndpointDoc {
  id: string;
  category: "Rose AI" | "Realtime Sync" | "Usage & Metrics" | "System";
  method: "GET" | "POST";
  path: string;
  alias: string;
  description: string;
  defaultPayload?: string;
  requestHeaders?: Record<string, string>;
  responseSample: string;
}

const API_ENDPOINTS: EndpointDoc[] = [
  {
    id: "rose-chat",
    category: "Rose AI",
    method: "POST",
    path: "/rose/chat",
    alias: "/api/rose/chat",
    description: "Execute agentic chat turn with Rose AI companion, emotion analysis, and tool orchestration.",
    requestHeaders: { "Content-Type": "application/json" },
    defaultPayload: JSON.stringify(
      {
        messages: [{ role: "user", content: "Hello Rose! What tools do you have?" }],
        stream: false,
      },
      null,
      2
    ),
    responseSample: JSON.stringify(
      {
        id: "chat-12345",
        role: "assistant",
        content: "Hello! I have memory recall, web search, note-taking, and reasoning capabilities.",
        emotion: "friendly",
      },
      null,
      2
    ),
  },
  {
    id: "rose-settings",
    category: "Rose AI",
    method: "GET",
    path: "/rose/settings",
    alias: "/api/rose/settings",
    description: "Fetch user companion settings, memory indexes, active persona, and voice configuration.",
    responseSample: JSON.stringify(
      {
        persona: "friendly",
        voiceSpeed: 1.0,
        voicePitch: 1.0,
        memoryCount: 14,
      },
      null,
      2
    ),
  },
  {
    id: "rose-transcribe",
    category: "Rose AI",
    method: "POST",
    path: "/rose/transcribe",
    alias: "/api/rose/transcribe",
    description: "Zero-token server-side audio transcription via faster-whisper.",
    requestHeaders: { "Content-Type": "multipart/form-data" },
    defaultPayload: "// Form data with audio blob file under 'file' key",
    responseSample: JSON.stringify(
      {
        text: "This is the transcribed audio from your microphone input.",
        language: "en",
        duration: 2.4,
      },
      null,
      2
    ),
  },
  {
    id: "rose-usage",
    category: "Rose AI",
    method: "GET",
    path: "/rose/usage",
    alias: "/api/rose/usage",
    description: "Retrieve current user / guest daily and weekly Rose interaction limits and remaining quotas.",
    responseSample: JSON.stringify(
      {
        allowed: true,
        count: 12,
        limit: 50,
        week: "2026-W41",
        dailyCount: 3,
        dailyLimit: 10,
        day: "2026-10-06",
        remaining: 7,
        role: "guest",
      },
      null,
      2
    ),
  },
  {
    id: "sync-events",
    category: "Realtime Sync",
    method: "POST",
    path: "/sync/events",
    alias: "/api/sync/events",
    description: "Publish state synchronization events or join SSE stream for multiplayer room updates.",
    requestHeaders: { "Content-Type": "application/json" },
    defaultPayload: JSON.stringify(
      [
        {
          roomId: "forge-general",
          userId: "user-abc-123",
          type: "player_input",
          payload: { dx: 1, dy: 0, sequence: 42 },
        },
      ],
      null,
      2
    ),
    responseSample: JSON.stringify(
      {
        success: true,
        count: 1,
      },
      null,
      2
    ),
  },
  {
    id: "sync-rooms",
    category: "Realtime Sync",
    method: "GET",
    path: "/sync/rooms?roomId=forge-general",
    alias: "/api/sync/rooms?roomId=forge-general",
    description: "Inspect active room members, authoritative state snapshot, and tick rate.",
    responseSample: JSON.stringify(
      {
        roomId: "forge-general",
        members: ["user-abc-123", "user-def-456"],
        tickRate: 20,
        active: true,
      },
      null,
      2
    ),
  },
  {
    id: "usage-metrics",
    category: "Usage & Metrics",
    method: "GET",
    path: "/usage/metrics",
    alias: "/api/usage/metrics",
    description: "Global API usage metrics, telemetry counters, average latency, and rate limit telemetry.",
    responseSample: JSON.stringify(
      {
        status: "healthy",
        uptimeSeconds: 1420,
        totalRequests: 842,
        totalErrors: 2,
        endpoints: {
          "POST /rose/chat": { count: 320, avgLatencyMs: 142 },
          "POST /sync/events": { count: 480, avgLatencyMs: 12 },
        },
      },
      null,
      2
    ),
  },
  {
    id: "health",
    category: "System",
    method: "GET",
    path: "/health",
    alias: "/api/health",
    description: "Health check and uptime status verification endpoint.",
    responseSample: JSON.stringify(
      {
        status: "ok",
        service: "@mono/api",
        uptime: 1420,
      },
      null,
      2
    ),
  },
];

export default function ApiDocumentationPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc>(API_ENDPOINTS[0]);
  const [requestPayload, setRequestPayload] = useState<string>(API_ENDPOINTS[0].defaultPayload || "");
  const [responseOutput, setResponseOutput] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Load telemetry metrics on mount
  useEffect(() => {
    fetch("/usage/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => {
        // Fallback default metrics for initial render
        setMetrics({
          status: "healthy",
          uptimeSeconds: 120,
          totalRequests: 42,
          totalErrors: 0,
        });
      });
  }, []);

  const handleSelectEndpoint = (ep: EndpointDoc) => {
    setSelectedEndpoint(ep);
    setRequestPayload(ep.defaultPayload || "");
    setResponseOutput("");
    setResponseStatus(null);
    setResponseLatency(null);
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseOutput("");
    const startTime = performance.now();

    try {
      const url = selectedEndpoint.path;
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: selectedEndpoint.requestHeaders || {},
      };

      if (selectedEndpoint.method === "POST" && requestPayload && !requestPayload.startsWith("//")) {
        options.body = requestPayload;
      }

      const res = await fetch(url, options);
      const latency = Math.round(performance.now() - startTime);
      setResponseStatus(res.status);
      setResponseLatency(latency);

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setResponseOutput(JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        setResponseOutput(text || `Status: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      const latency = Math.round(performance.now() - startTime);
      setResponseStatus(500);
      setResponseLatency(latency);
      setResponseOutput(JSON.stringify({ error: err.message || "Failed to fetch endpoint" }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlSnippet = `curl -X ${selectedEndpoint.method} "http://localhost:3005${selectedEndpoint.path}" \\
${selectedEndpoint.requestHeaders ? Object.entries(selectedEndpoint.requestHeaders).map(([k, v]) => `  -H "${k}: ${v}" \\`).join("\n") : ""}
${selectedEndpoint.method === "POST" && requestPayload && !requestPayload.startsWith("//") ? `  -d '${requestPayload.replace(/\n/g, "")}'` : ""}`;

  return (
    <div className="api-container">
      {/* Header */}
      <header className="api-header">
        <div className="api-brand">
          <div style={{ padding: "0.5rem", background: "rgba(56, 189, 248, 0.15)", borderRadius: "10px", color: "var(--accent-cyan)" }}>
            <Server size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Machi Asia API Gateway</h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Centralized API Service, Realtime Engine & Usage Telemetry
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="api-badge-live">
            <div className="api-pulse" />
            API Gateway Online
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Port 3005</span>
        </div>
      </header>

      {/* Real-time Usage & Telemetry Overview */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={18} style={{ color: "var(--accent-emerald)" }} />
          Centralized Usage & Rate Limit Tracking
        </h2>

        {!metrics ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div className="api-card">
              <Usage
                label="Daily Global Requests"
                used={metrics.totalRequests || 42}
                total={10000}
                unit="req"
                size="md"
                warningThreshold={80}
                dangerThreshold={95}
                description="Global rate limit capacity across all monorepo applications"
              />
            </div>
            <div className="api-card">
              <Usage
                label="Rose AI Daily Guest Quota"
                used={3}
                total={10}
                unit="turns"
                size="md"
                warningThreshold={70}
                dangerThreshold={90}
                description="Default limit for unauthenticated companion chat sessions"
              />
            </div>
            <div className="api-card">
              <Usage
                label="Realtime SSE Connections"
                used={metrics.activeSseConnections || 1}
                total={500}
                unit="conns"
                size="md"
                warningThreshold={75}
                dangerThreshold={90}
                description="Simultaneous active event channels across rooms"
              />
            </div>
          </div>
        )}
      </section>

      {/* Main Grid: Catalog + Interactive Playground */}
      <div className="api-grid">
        {/* Left Column: Endpoints Catalog */}
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={18} style={{ color: "var(--accent-cyan)" }} />
            API Catalog & Endpoints
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {API_ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  style={{
                    background: isSelected ? "var(--bg-card-hover)" : "var(--bg-card)",
                    border: isSelected ? "1px solid var(--accent-cyan)" : "1px solid var(--border-color)",
                    borderRadius: "10px",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span className={`api-method-badge api-method-${ep.method.toLowerCase()}`}>
                        {ep.method}
                      </span>
                      <strong style={{ fontSize: "0.95rem", fontFamily: "monospace" }}>{ep.path}</strong>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {ep.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {ep.description}
                  </p>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    Alias: {ep.alias}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Playground & Code Generator */}
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={18} style={{ color: "var(--accent-amber)" }} />
            Interactive Playground & Schema
          </h2>

          <div className="api-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className={`api-method-badge api-method-${selectedEndpoint.method.toLowerCase()}`}>
                  {selectedEndpoint.method}
                </span>
                <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedEndpoint.path}</span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                <span>Send Request</span>
              </Button>
            </div>

            {/* Request Payload Editor */}
            {selectedEndpoint.method === "POST" && (
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                  Request Body (JSON)
                </label>
                <textarea
                  className="api-textarea"
                  rows={6}
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  placeholder="Enter JSON request payload..."
                />
              </div>
            )}

            {/* Response Viewer */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Response Output
                </label>
                {responseStatus && (
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem" }}>
                    <span style={{ color: responseStatus < 400 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 600 }}>
                      Status: {responseStatus}
                    </span>
                    {responseLatency && (
                      <span style={{ color: "var(--text-muted)" }}>
                        Latency: {responseLatency}ms
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div style={{ padding: "1rem", background: "var(--bg-primary)", borderRadius: "8px" }}>
                  <SkeletonText lines={4} />
                </div>
              ) : (
                <pre className="api-code-block" style={{ maxHeight: "240px" }}>
                  {responseOutput || selectedEndpoint.responseSample}
                </pre>
              )}
            </div>

            {/* Code Snippet */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Code2 size={14} />
                  cURL Command
                </label>
                <button
                  onClick={() => copySnippet(curlSnippet)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {copied ? <Check size={12} style={{ color: "var(--accent-emerald)" }} /> : <Copy size={12} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <pre className="api-code-block" style={{ fontSize: "0.75rem" }}>
                {curlSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
