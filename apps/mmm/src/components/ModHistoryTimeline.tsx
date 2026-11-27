"use client";

import { History } from "lucide-react";
import type { MmmModHistory } from "@/data/mmm-catalog";

interface ModHistoryTimelineProps {
  history: MmmModHistory[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ModHistoryTimeline({ history }: ModHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="mmm-card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
        <History size={28} style={{ margin: "0 auto 0.75rem", color: "var(--muted)" }} />
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
          No changelog activity recorded yet for this modpack.
        </p>
      </div>
    );
  }

  return (
    <div className="mmm-timeline" data-testid="mod-history-timeline">
      {history.map((entry) => (
        <div key={entry.id} className="mmm-timeline-item">
          <div className={`mmm-timeline-dot ${entry.action}`} />
          <div className="mmm-timeline-header">
            <strong style={{ fontSize: "0.9rem" }}>{entry.mod_name}</strong>
            <span className="mmm-timeline-time">{formatDate(entry.created_at)}</span>
          </div>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
            {entry.message || `${entry.action.toUpperCase()} ${entry.mod_name}`}
          </p>
        </div>
      ))}
    </div>
  );
}
