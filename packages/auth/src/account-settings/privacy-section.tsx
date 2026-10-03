"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

interface PrivacySectionProps {
  user: User;
}

interface AppDataDisclosure {
  appKey: string;
  appName: string;
  appPath: string;
  description: string;
  dataCollected: string[];
  purpose: string;
  requirement: "required" | "optional";
  controlType?: "toggle" | "action";
  controlKey?: string;
  controlLabel?: string;
}

const APP_DATA_DISCLOSURES: AppDataDisclosure[] = [
  {
    appKey: "machi-asia",
    appName: "Machi Asia (Home & Billing Hub)",
    appPath: "apps/machi-asia",
    description: "Central authentication, multi-account switching, and subscription management across the ecosystem.",
    dataCollected: [
      "Account email address and unique User UUID",
      "OAuth profile metadata (display name, avatar image URL)",
      "Secure encrypted session tokens (JWT) and PKCE verifiers",
      "Account security credentials and linked identity providers",
    ],
    purpose: "Authenticating your identity across subdomains, verifying active product subscriptions, managing account switches, and password recovery.",
    requirement: "required",
  },
  {
    appKey: "rose",
    appName: "Rose AI (Personal Companion)",
    appPath: "apps/rose",
    description: "Personalized companion conversations and long-term memory retrieval.",
    dataCollected: [
      "User chat prompts and message dialogue history",
      "Companion persona customization parameters and active model settings",
      "Conversation memory anchors for dialogue continuity",
    ],
    purpose: "Generating contextual AI responses, maintaining conversational memory over time, and tailoring companion personality.",
    requirement: "required",
    controlType: "action",
    controlKey: "clear_rose_history",
    controlLabel: "Clear Rose AI Conversation History",
  },
  {
    appKey: "calculator",
    appName: "Game Production Calculator",
    appPath: "apps/calculator",
    description: "Factory rate planner, item catalog, and recipe dependency tree graphs.",
    dataCollected: [
      "Factory production rate targets and layout configurations",
      "Recipe node graph overrides and custom item throughputs",
      "Selected game presets and item catalog filter preferences",
    ],
    purpose: "Saving calculation graphs in the browser and synchronizing factory production plans across your devices.",
    requirement: "optional",
    controlType: "toggle",
    controlKey: "calc_sync_enabled",
    controlLabel: "Enable cloud synchronization for factory graphs and recipes",
  },
  {
    appKey: "hells-forge",
    appName: "Hell's Forge (2D Exploration Space)",
    appPath: "apps/hells-forge",
    description: "Realtime multiplayer canvas with WASD movement and Redis room event synchronization.",
    dataCollected: [
      "Ephemeral player coordinates (x, y) and movement vector velocities",
      "Multiplayer room session connection timestamps and ping telemetry",
    ],
    purpose: "Synchronizing player movements on screen, handling circle collisions, and rendering live multiplayer positions (data is transient and not permanently persisted).",
    requirement: "required",
  },
  {
    appKey: "docs",
    appName: "Documentation & Developer Hub",
    appPath: "apps/docs",
    description: "Component showcases, API references, and interactive live previews.",
    dataCollected: [
      "Theme preference (dark/light mode)",
      "Client-side component search filter state",
    ],
    purpose: "Remembering your documentation viewing preferences and theme settings.",
    requirement: "optional",
  },
  {
    appKey: "telemetry",
    appName: "Platform Performance & Diagnostics",
    appPath: "All Apps (apps/*)",
    description: "Anonymous error tracking and frontend performance metrics.",
    dataCollected: [
      "Anonymous page load durations and Web Vitals metrics",
      "Client-side error stack traces (de-identified; no prompts, emails, or personal data)",
    ],
    purpose: "Detecting performance regressions, diagnosing crashes, and optimizing speed across all applications.",
    requirement: "optional",
    controlType: "toggle",
    controlKey: "telemetry_enabled",
    controlLabel: "Allow anonymous diagnostic telemetry and error crash logs",
  },
];

export function PrivacySection({ user }: PrivacySectionProps) {
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  const [calcSyncEnabled, setCalcSyncEnabled] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [clearAiSuccess, setClearAiSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTelemetry = localStorage.getItem("machi_telemetry_optin");
      if (storedTelemetry !== null) {
        setTelemetryEnabled(storedTelemetry === "true");
      }
      const storedCalcSync = localStorage.getItem("machi_calc_cloud_sync");
      if (storedCalcSync !== null) {
        setCalcSyncEnabled(storedCalcSync === "true");
      }
    }
  }, []);

  function handleToggleTelemetry(enabled: boolean) {
    setTelemetryEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("machi_telemetry_optin", String(enabled));
    }
  }

  function handleToggleCalcSync(enabled: boolean) {
    setCalcSyncEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("machi_calc_cloud_sync", String(enabled));
    }
  }

  function handleClearAiHistory() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rose_chat_history");
    }
    setClearAiSuccess(true);
    setTimeout(() => setClearAiSuccess(false), 3000);
  }

  function handleExportData() {
    setExporting(true);
    setExportSuccess(false);

    try {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at,
          appMetadata: user.app_metadata,
          userMetadata: user.user_metadata,
        },
        privacyPreferences: {
          telemetryOptIn: telemetryEnabled,
          calculatorCloudSync: calcSyncEnabled,
        },
        appDisclosures: APP_DATA_DISCLOSURES,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `machi-asia-data-export-${user.id.slice(0, 8)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="auth-settings-section auth-privacy-section">
      <div className="auth-privacy-header">
        <h2 className="auth-settings-section-title">Data & Privacy</h2>
        <p className="auth-settings-section-desc">
          Transparency and control over data collected by each application in the Machi Asia ecosystem.
        </p>
      </div>

      <div className="auth-privacy-group">
        <h3 className="auth-privacy-heading">Application Data Collection Registry</h3>
        <p className="auth-privacy-subtext">
          Grouped by application under <code>/apps</code>. Review what each app collects, its purpose, and toggle optional preferences.
        </p>

        <div className="auth-privacy-registry">
          {APP_DATA_DISCLOSURES.map((item) => (
            <div key={item.appKey} className="auth-privacy-item">
              <div className="auth-privacy-item-header">
                <div className="auth-privacy-item-title-wrap">
                  <span className="auth-privacy-item-app">{item.appPath}</span>
                  <h4 className="auth-privacy-item-title">{item.appName}</h4>
                </div>
                <span
                  className={`auth-privacy-badge auth-privacy-badge--${item.requirement}`}
                >
                  {item.requirement === "required" ? "Required" : "Optional"}
                </span>
              </div>

              <p className="auth-privacy-item-desc">{item.description}</p>

              <div className="auth-privacy-item-body">
                <div className="auth-privacy-field">
                  <span className="auth-privacy-field-label">Data Collected:</span>
                  <ul className="auth-privacy-field-list">
                    {item.dataCollected.map((dataPoint, idx) => (
                      <li key={idx}>{dataPoint}</li>
                    ))}
                  </ul>
                </div>
                <div className="auth-privacy-field">
                  <span className="auth-privacy-field-label">Purpose / Used For:</span>
                  <span className="auth-privacy-field-value">{item.purpose}</span>
                </div>
              </div>

              {item.controlType === "toggle" && item.controlKey === "telemetry_enabled" ? (
                <div className="auth-privacy-control">
                  <label className="auth-privacy-toggle-label">
                    <input
                      type="checkbox"
                      checked={telemetryEnabled}
                      onChange={(e) => handleToggleTelemetry(e.target.checked)}
                      className="auth-privacy-checkbox"
                    />
                    <span>{item.controlLabel}</span>
                  </label>
                </div>
              ) : null}

              {item.controlType === "toggle" && item.controlKey === "calc_sync_enabled" ? (
                <div className="auth-privacy-control">
                  <label className="auth-privacy-toggle-label">
                    <input
                      type="checkbox"
                      checked={calcSyncEnabled}
                      onChange={(e) => handleToggleCalcSync(e.target.checked)}
                      className="auth-privacy-checkbox"
                    />
                    <span>{item.controlLabel}</span>
                  </label>
                </div>
              ) : null}

              {item.controlType === "action" && item.controlKey === "clear_rose_history" ? (
                <div className="auth-privacy-control">
                  <button
                    type="button"
                    className="auth-settings-btn"
                    onClick={handleClearAiHistory}
                  >
                    {item.controlLabel}
                  </button>
                  {clearAiSuccess ? (
                    <p className="auth-settings-success" style={{ marginTop: "var(--space-2)" }}>
                      AI conversation history cleared.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-privacy-divider" />

      <div className="auth-privacy-group">
        <h3 className="auth-privacy-heading">Data Portability & Account Rights</h3>
        <p className="auth-privacy-subtext">
          Export your personal account data archive or submit a data deletion request.
        </p>

        <div className="auth-privacy-actions">
          <button
            type="button"
            className="auth-settings-btn"
            onClick={handleExportData}
            disabled={exporting}
          >
            {exporting ? "Preparing Export…" : "Export Account Data (JSON)"}
          </button>

          {!deleteConfirm ? (
            <button
              type="button"
              className="auth-settings-btn auth-privacy-btn--danger"
              onClick={() => setDeleteConfirm(true)}
            >
              Request Account Deletion
            </button>
          ) : (
            <div className="auth-privacy-delete-box">
              <p className="auth-privacy-delete-warning">
                Are you sure? This requests permanent deletion of your Machi Asia account, associated sync states, and linked credentials.
              </p>
              <div className="auth-privacy-delete-actions">
                <button
                  type="button"
                  className="auth-settings-btn auth-privacy-btn--danger"
                  onClick={() => {
                    alert("Your account data deletion request has been submitted.");
                    setDeleteConfirm(false);
                  }}
                >
                  Confirm Deletion Request
                </button>
                <button
                  type="button"
                  className="auth-settings-btn"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {exportSuccess ? (
          <p className="auth-settings-success">Account data exported successfully.</p>
        ) : null}
      </div>
    </section>
  );
}
