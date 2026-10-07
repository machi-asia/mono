"use client";

import { useState, useEffect, type FormEvent } from "react";
import { createClient } from "../../client";
import { useAuth } from "../provider/provider";
import {
  User,
  Shield,
  Palette,
  Image as ImageIcon,
  Lock,
  LifeBuoy,
  Key,
  Fingerprint,
  Link as LinkIcon,
  QrCode,
  X,
} from "lucide-react";
import { ProfileSection } from "./profile-section";
import { ProvidersSection } from "./providers-section";
import { MFASection } from "./mfa-section";
import { PrivacySection } from "./privacy-section";
import { DisplaySection } from "./display-section";
import { MediaSection } from "./media-section";
import { SupportSection } from "./support-section";
import "./account-settings.css";

export type TopLevelTab = "profile" | "security" | "display" | "media" | "privacy" | "support";

interface AccountSettingsProps {
  open: boolean;
  onClose: () => void;
  initialTab?: TopLevelTab;
}

type SecuritySection = "password" | "passkeys" | "providers" | "mfa";

const sectionLabels: Record<SecuritySection, string> = {
  password: "Change Password",
  passkeys: "Passkeys",
  providers: "Linked Providers",
  mfa: "Multi-Factor Authentication",
};

const sectionIcons: Record<
  SecuritySection,
  React.ComponentType<{ size?: number | string; className?: string }>
> = {
  password: Key,
  passkeys: Fingerprint,
  providers: LinkIcon,
  mfa: QrCode,
};

export function AccountSettings({ open, onClose, initialTab = "profile" }: AccountSettingsProps) {
  const { user } = useAuth();
  const [activeTopTab, setActiveTopTab] = useState<TopLevelTab>(initialTab);
  const [activeSection, setActiveSection] = useState<SecuritySection>("password");

  useEffect(() => {
    if (open && initialTab) {
      setActiveTopTab(initialTab);
    }
  }, [open, initialTab]);

  if (!open || !user) return null;

  return (
    <div
      className="auth-settings-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Account settings"
      onClick={onClose}
    >
      <div className="auth-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-settings-header">
          <h1 className="auth-settings-title">Account Settings</h1>
          <button
            type="button"
            className="auth-settings-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="auth-settings-body">
          <nav className="auth-settings-sidebar" aria-label="Settings sections">
            <button
              type="button"
              className={`auth-settings-tab${activeTopTab === "profile" ? " auth-settings-tab--active" : ""}`}
              aria-current={activeTopTab === "profile" ? "page" : undefined}
              onClick={() => setActiveTopTab("profile")}
              title="Profile"
              aria-label="Profile"
            >
              <User size={18} className="auth-settings-tab-icon" />
              <span className="auth-settings-tab-label">Profile</span>
            </button>
            <button
              type="button"
              className={`auth-settings-tab${activeTopTab === "security" ? " auth-settings-tab--active" : ""}`}
              aria-current={activeTopTab === "security" ? "page" : undefined}
              onClick={() => setActiveTopTab("security")}
              title="Security"
              aria-label="Security"
            >
              <Shield size={18} className="auth-settings-tab-icon" />
              <span className="auth-settings-tab-label">Security</span>
            </button>
            <button
              type="button"
              className={`auth-settings-tab${activeTopTab === "display" ? " auth-settings-tab--active" : ""}`}
              aria-current={activeTopTab === "display" ? "page" : undefined}
              onClick={() => setActiveTopTab("display")}
              title="Display"
              aria-label="Display"
            >
              <Palette size={18} className="auth-settings-tab-icon" />
              <span className="auth-settings-tab-label">Display</span>
            </button>
            <button
              type="button"
              className={`auth-settings-tab${activeTopTab === "media" ? " auth-settings-tab--active" : ""}`}
              aria-current={activeTopTab === "media" ? "page" : undefined}
              onClick={() => setActiveTopTab("media")}
              title="Media Library"
              aria-label="Media Library"
            >
              <ImageIcon size={18} className="auth-settings-tab-icon" />
              <span className="auth-settings-tab-label">Media Library</span>
            </button>
            <button
              type="button"
              className={`auth-settings-tab${activeTopTab === "privacy" ? " auth-settings-tab--active" : ""}`}
              aria-current={activeTopTab === "privacy" ? "page" : undefined}
              onClick={() => setActiveTopTab("privacy")}
              title="Data & Privacy"
              aria-label="Data & Privacy"
            >
              <Lock size={18} className="auth-settings-tab-icon" />
              <span className="auth-settings-tab-label">Data & Privacy</span>
            </button>
            <button
              type="button"
              className={`auth-settings-tab${activeTopTab === "support" ? " auth-settings-tab--active" : ""}`}
              aria-current={activeTopTab === "support" ? "page" : undefined}
              onClick={() => setActiveTopTab("support")}
              title="Support"
              aria-label="Support"
            >
              <LifeBuoy size={18} className="auth-settings-tab-icon" />
              <span className="auth-settings-tab-label">Support</span>
            </button>
          </nav>
          <div className="auth-settings-content">
            {activeTopTab === "profile" ? (
              <div className="auth-security-panel auth-profile-panel">
                <ProfileSection user={user} />
              </div>
            ) : activeTopTab === "security" ? (
              <>
                <nav className="auth-security-nav" aria-label="Security sections">
                  {(["password", "passkeys", "providers", "mfa"] as const).map((section) => {
                    const SectionIcon = sectionIcons[section];
                    return (
                      <button
                        key={section}
                        type="button"
                        className={`auth-security-nav-item${activeSection === section ? " auth-security-nav-item--active" : ""}`}
                        onClick={() => setActiveSection(section)}
                        title={sectionLabels[section]}
                        aria-label={sectionLabels[section]}
                      >
                        <SectionIcon size={16} className="auth-security-nav-icon" />
                        <span className="auth-security-nav-label">{sectionLabels[section]}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="auth-security-panel">
                  {activeSection === "password" && <PasswordSection />}
                  {activeSection === "passkeys" && <PasskeysSection />}
                  {activeSection === "providers" && <ProvidersSection user={user} />}
                  {activeSection === "mfa" && <MFASection />}
                </div>
              </>
            ) : activeTopTab === "display" ? (
              <div className="auth-security-panel auth-display-panel">
                <DisplaySection />
              </div>
            ) : activeTopTab === "media" ? (
              <div className="auth-security-panel auth-media-panel">
                <MediaSection user={user} />
              </div>
            ) : activeTopTab === "privacy" ? (
              <div className="auth-security-panel auth-privacy-panel">
                <PrivacySection user={user} />
              </div>
            ) : (
              <div className="auth-security-panel auth-support-panel">
                <SupportSection user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordSection() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSuccess(false);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <section className="auth-settings-section">
      <h2 className="auth-settings-section-title">Change Password</h2>
      <p className="auth-settings-section-desc">
        Update your password. Choose a strong password you don&apos;t use
        elsewhere.
      </p>
      <form className="auth-settings-form" onSubmit={handleSubmit}>
        <label className="auth-settings-field">
          <span>New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label className="auth-settings-field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error && <p className="auth-settings-error">{error}</p>}
        {success && (
          <p className="auth-settings-success">Password updated successfully.</p>
        )}
        <button
          type="submit"
          className="auth-settings-btn auth-settings-btn--primary"
          disabled={submitting}
        >
          {submitting ? "Updating…" : "Update Password"}
        </button>
      </form>
    </section>
  );
}

function PasskeysSection() {
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        window.PublicKeyCredential !== undefined,
    );
  }, []);

  async function handleAddPasskey() {
    setError(null);
    setSubmitting(true);
    const supabase = createClient();
    const { error: passkeyError } = await supabase.auth.signInWithPasskey();
    setSubmitting(false);
    if (passkeyError) {
      setError(passkeyError.message);
    }
  }

  return (
    <section className="auth-settings-section">
      <h2 className="auth-settings-section-title">Passkeys</h2>
      <p className="auth-settings-section-desc">
        Passkeys let you sign in with biometrics, a security key, or a device
        PIN instead of a password.
      </p>
      {!supported ? (
        <p className="auth-settings-muted">
          Passkeys are not supported in this browser.
        </p>
      ) : (
        <>
          <button
            type="button"
            className="auth-settings-btn auth-settings-btn--primary"
            onClick={handleAddPasskey}
            disabled={submitting}
          >
            {submitting ? "Adding…" : "Add Passkey"}
          </button>
          {error && <p className="auth-settings-error">{error}</p>}
          <p className="auth-settings-muted">
            Passkey support is experimental.
          </p>
        </>
      )}
    </section>
  );
}

