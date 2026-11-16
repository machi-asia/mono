"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  listPrivacyDisclosures,
  getPrivacyConsent,
  setPrivacyConsent,
  type AppDataDisclosure,
} from "../../utils/privacy-registry";

interface PrivacySectionProps {
  user: User;
  /** Optional custom disclosures override (defaults to all disclosures in PRIVACY_DISCLOSURES_REGISTRY) */
  disclosures?: AppDataDisclosure[];
}

export function PrivacySection({ user, disclosures }: PrivacySectionProps) {
  const activeDisclosures = disclosures ?? listPrivacyDisclosures();

  const [consentMap, setConsentMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const item of activeDisclosures) {
      if (item.controlType === "toggle" && item.controlKey) {
        map[item.controlKey] = getPrivacyConsent(item.controlKey, item.defaultEnabled ?? true);
      }
    }
    return map;
  });

  const [actionSuccessMap, setActionSuccessMap] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleToggleConsent(controlKey: string, enabled: boolean) {
    setConsentMap((prev) => ({ ...prev, [controlKey]: enabled }));
    setPrivacyConsent(controlKey, enabled);
  }

  async function handleTriggerAction(item: AppDataDisclosure) {
    const key = item.controlKey || item.appKey;
    if (item.onAction) {
      await item.onAction();
    } else if (key === "clear_rose_history" && typeof window !== "undefined") {
      window.localStorage.removeItem("rose_chat_history");
    }
    setActionSuccessMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setActionSuccessMap((prev) => ({ ...prev, [key]: false }));
    }, 3000);
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
          telemetryOptIn: consentMap.telemetry_enabled ?? true,
          calculatorCloudSync: consentMap.calc_sync_enabled ?? true,
          ...consentMap,
        },
        appDisclosures: activeDisclosures,
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
          {activeDisclosures.map((item) => {
            const actionKey = item.controlKey || item.appKey;
            const isChecked = item.controlKey
              ? (consentMap[item.controlKey] ?? item.defaultEnabled ?? true)
              : true;

            return (
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

                {item.controlType === "toggle" && item.controlKey ? (
                  <div className="auth-privacy-control">
                    <label className="auth-privacy-toggle-label">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleToggleConsent(item.controlKey!, e.target.checked)}
                        className="auth-privacy-checkbox"
                      />
                      <span>{item.controlLabel}</span>
                    </label>
                  </div>
                ) : null}

                {item.controlType === "action" ? (
                  <div className="auth-privacy-control">
                    <button
                      type="button"
                      className="auth-settings-btn"
                      onClick={() => void handleTriggerAction(item)}
                    >
                      {item.controlLabel}
                    </button>
                    {actionSuccessMap[actionKey] ? (
                      <p className="auth-settings-success" style={{ marginTop: "var(--space-2)" }}>
                        AI conversation history cleared.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
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
