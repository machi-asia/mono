"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { Bug, Lightbulb, HelpCircle, Send } from "lucide-react";
import { createClient } from "../client";

interface SupportSectionProps {
  user: User;
}

type SupportTicketType = "bug_report" | "recommendation" | "general_support";
type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

interface SupportTicket {
  id: string;
  type: SupportTicketType;
  app: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  created_at: string;
}

const APPS_LIST = [
  { value: "machi-asia", label: "Machi Asia (Home & Billing Hub)" },
  { value: "calculator", label: "Game Production Calculator" },
  { value: "rose", label: "Rose AI (Personal Companion)" },
  { value: "hells-forge", label: "Hell's Forge (2D Exploration)" },
  { value: "docs", label: "Documentation & Developer Hub" },
  { value: "auth", label: "Authentication & Account Settings" },
  { value: "general", label: "General / Other" },
];

const CATEGORIES: { value: SupportTicketType; label: string }[] = [
  { value: "bug_report", label: "Bug Report" },
  { value: "recommendation", label: "Feature Recommendation" },
  { value: "general_support", label: "General Support" },
];

/**
 * Auto-detects the active application site from window.location.
 */
export function detectCurrentApp(): string {
  if (typeof window === "undefined") {
    return "machi-asia";
  }

  try {
    const { hostname, port, pathname } = window.location;
    const host = hostname.toLowerCase();
    const path = pathname.toLowerCase();

    // Check dev / preview ports
    if (port === "3001" || port === "3101") return "rose";
    if (port === "3002" || port === "3102") return "calculator";
    if (port === "3003" || port === "3103") return "docs";
    if (port === "3004" || port === "3104") return "hells-forge";
    if (port === "3000" || port === "3100") return "machi-asia";

    // Check hostname / subdomain
    if (host.includes("rose")) return "rose";
    if (host.includes("calc") || host.includes("calculator")) return "calculator";
    if (host.includes("doc")) return "docs";
    if (host.includes("forge") || host.includes("hell")) return "hells-forge";
    if (host.includes("auth")) return "auth";

    // Check path routing prefix
    if (path.startsWith("/rose")) return "rose";
    if (path.startsWith("/calc") || path.startsWith("/calculator")) return "calculator";
    if (path.startsWith("/doc")) return "docs";
    if (path.startsWith("/forge") || path.startsWith("/hells-forge")) return "hells-forge";
  } catch {
    // ignore
  }

  return "machi-asia";
}

export function SupportSection({ user }: SupportSectionProps) {
  const [ticketType, setTicketType] = useState<SupportTicketType>("bug_report");
  const [targetApp, setTargetApp] = useState<string>(() => detectCurrentApp());
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    fetchUserTickets();
  }, [user.id]);

  async function fetchUserTickets() {
    setLoadingTickets(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("support_tickets")
        .select("id, type, app, subject, message, status, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        setTickets(data as SupportTicket[]);
      }
    } catch {
      // ignore
    } finally {
      setLoadingTickets(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSuccess(false);

    if (!subject.trim() || !message.trim()) {
      setError("Please provide both a subject and a description.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        user_id: user.id,
        user_email: user.email || null,
        type: ticketType,
        app: targetApp,
        subject: subject.trim(),
        message: message.trim(),
        metadata: {
          userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
          submittedUrl: typeof window !== "undefined" ? window.location.href : undefined,
        },
      };

      const { data, error: insertError } = await supabase
        .from("support_tickets")
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
      } else {
        setSuccess(true);
        setSubject("");
        setMessage("");
        if (data) {
          setTickets((prev) => [data as SupportTicket, ...prev]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit support request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-settings-section auth-support-section">
      <div className="auth-support-header">
        <h2 className="auth-settings-section-title">Support & Recommendations</h2>
        <p className="auth-settings-section-desc">
          Submit bug reports, feature suggestions, or questions directly to the development team.
        </p>
      </div>

      <form className="auth-settings-form auth-support-form" onSubmit={handleSubmit}>
        <div className="auth-support-row">
          <label className="auth-settings-field" style={{ flex: 1 }}>
            <span>Target Application</span>
            <select
              value={targetApp}
              onChange={(e) => setTargetApp(e.target.value)}
              className="auth-support-select"
            >
              {APPS_LIST.map((app) => (
                <option key={app.value} value={app.value}>
                  {app.label}
                </option>
              ))}
            </select>
          </label>

          <label className="auth-settings-field" style={{ flex: 1 }}>
            <span>Category</span>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value as SupportTicketType)}
              className="auth-support-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="auth-settings-field">
          <span>Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
            maxLength={160}
          />
        </label>

        <label className="auth-settings-field">
          <span>Description / Details</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="auth-support-textarea"
            placeholder="Provide details..."
            required
          />
        </label>

        {error ? <p className="auth-settings-error">{error}</p> : null}
        {success ? (
          <p className="auth-settings-success">
            Thank you! Your {ticketType === "bug_report" ? "bug report" : ticketType === "recommendation" ? "recommendation" : "support request"} has been submitted directly to the database.
          </p>
        ) : null}

        <button
          type="submit"
          className="auth-settings-btn auth-settings-btn--primary auth-support-submit-btn"
          disabled={submitting}
        >
          <Send size={15} />
          <span>
            {submitting ? "Submitting…" : ticketType === "bug_report" ? "Submit Bug Report" : ticketType === "recommendation" ? "Send Recommendation" : "Send Support Request"}
          </span>
        </button>
      </form>

      {tickets.length > 0 ? (
        <>
          <div className="auth-privacy-divider" style={{ margin: "var(--space-4) 0 var(--space-3)" }} />
          <div className="auth-support-history">
            <h3 className="auth-privacy-heading">Your Recent Submissions ({tickets.length})</h3>
            <div className="auth-support-tickets-list">
              {tickets.map((t) => (
                <div key={t.id} className="auth-support-ticket-item">
                  <div className="auth-support-ticket-top">
                    <span className="auth-support-ticket-type">
                      {t.type === "bug_report" ? (
                        <>
                          <Bug size={13} /> Bug
                        </>
                      ) : t.type === "recommendation" ? (
                        <>
                          <Lightbulb size={13} /> Suggestion
                        </>
                      ) : (
                        <>
                          <HelpCircle size={13} /> Support
                        </>
                      )}
                    </span>
                    <span className="auth-support-ticket-app">{t.app}</span>
                    <span className={`auth-support-status-badge auth-support-status-badge--${t.status}`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                  <h4 className="auth-support-ticket-subject">{t.subject}</h4>
                  <p className="auth-support-ticket-msg">{t.message}</p>
                  <span className="auth-support-ticket-date">
                    {new Date(t.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : loadingTickets ? (
        <p className="auth-settings-muted" style={{ marginTop: "var(--space-3)" }}>
          Loading your ticket history…
        </p>
      ) : null}
    </section>
  );
}
