"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import type { User, Factor, UserIdentity } from "@supabase/supabase-js";
import { createClient } from "../client";
import { useAuth } from "../provider/provider";
import { GoogleIcon } from "../icons/google";
import { GithubIcon } from "../icons/github";
import "./account-settings.css";

interface AccountSettingsProps {
  open: boolean;
  onClose: () => void;
}

type SecuritySection = "password" | "passkeys" | "providers" | "mfa";

const sectionLabels: Record<SecuritySection, string> = {
  password: "Change Password",
  passkeys: "Passkeys",
  providers: "Linked Providers",
  mfa: "Multi-Factor Authentication",
};

const providerLabels: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  facebook: "Facebook",
  discord: "Discord",
  twitter: "X / Twitter",
  apple: "Apple",
  gitlab: "GitLab",
  slack: "Slack",
};

const linkableProviders = ["google", "github", "facebook", "discord", "twitter", "apple"];

export function AccountSettings({ open, onClose }: AccountSettingsProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SecuritySection>("password");

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
            ✕
          </button>
        </div>
        <div className="auth-settings-body">
          <nav className="auth-settings-sidebar" aria-label="Settings sections">
            <button
              type="button"
              className="auth-settings-tab auth-settings-tab--active"
              aria-current="page"
            >
              Security
            </button>
          </nav>
          <div className="auth-settings-content">
            <nav className="auth-security-nav" aria-label="Security sections">
              {(["password", "passkeys", "providers", "mfa"] as const).map((section) => (
                <button
                  key={section}
                  type="button"
                  className={`auth-security-nav-item${activeSection === section ? " auth-security-nav-item--active" : ""}`}
                  onClick={() => setActiveSection(section)}
                >
                  {sectionLabels[section]}
                </button>
              ))}
            </nav>
            <div className="auth-security-panel">
              {activeSection === "password" && <PasswordSection />}
              {activeSection === "passkeys" && <PasskeysSection />}
              {activeSection === "providers" && <ProvidersSection user={user} />}
              {activeSection === "mfa" && <MFASection />}
            </div>
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

function ProvidersSection({ user }: { user: User }) {
  const [identities, setIdentities] = useState<UserIdentity[]>(
    user.identities ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const linkedProviders = new Set(identities.map((i) => i.provider));

  const refreshIdentities = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setIdentities(data.user.identities ?? []);
    }
  }, []);

  async function handleLink(provider: string) {
    setError(null);
    setLinkingProvider(provider);
    const supabase = createClient();
    const { data, error: linkError } = await supabase.auth.linkIdentity({
      provider: provider as "google" | "github" | "facebook" | "discord" | "twitter" | "apple",
      options: { redirectTo: window.location.href },
    });
    if (linkError) {
      setError(linkError.message);
      setLinkingProvider(null);
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
      return;
    }
    setLinkingProvider(null);
    await refreshIdentities();
  }

  async function handleUnlink(identity: UserIdentity) {
    setError(null);
    setUnlinkingId(identity.id);
    const supabase = createClient();
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);
    setUnlinkingId(null);
    if (unlinkError) {
      setError(unlinkError.message);
    } else {
      await refreshIdentities();
    }
  }

  return (
    <section className="auth-settings-section">
      <h2 className="auth-settings-section-title">Linked Providers</h2>
      <p className="auth-settings-section-desc">
        Connect or disconnect third-party sign-in providers.
      </p>
      {error && <p className="auth-settings-error">{error}</p>}
      <div className="auth-provider-list">
        {linkableProviders.map((provider) => {
          const isLinked = linkedProviders.has(provider);
          const identity = identities.find((i) => i.provider === provider);
          return (
            <div key={provider} className="auth-provider-item">
              <span className="auth-provider-id">
                {provider === "google" ? <GoogleIcon size={18} /> : null}
                {provider === "github" ? <GithubIcon size={18} /> : null}
                <span className="auth-provider-name">
                  {providerLabels[provider] ?? provider}
                </span>
              </span>
              {isLinked && identity ? (
                <button
                  type="button"
                  className="auth-settings-btn auth-settings-btn--danger"
                  onClick={() => handleUnlink(identity)}
                  disabled={unlinkingId === identity.id}
                >
                  {unlinkingId === identity.id ? "Unlinking…" : "Unlink"}
                </button>
              ) : (
                <button
                  type="button"
                  className="auth-settings-btn auth-settings-btn--secondary"
                  onClick={() => handleLink(provider)}
                  disabled={linkingProvider === provider}
                >
                  {linkingProvider === provider ? "Linking…" : "Link"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MFASection() {
  const [factors, setFactors] = useState<{
    totp: Factor[];
    webauthn: Factor[];
  }>({ totp: [], webauthn: [] });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [enrolling, setEnrolling] = useState(false);
  const [enrollData, setEnrollData] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setError(factorsError.message);
    } else if (data) {
      setFactors({ totp: data.totp, webauthn: data.webauthn });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFactors();
  }, [loadFactors]);

  async function handleEnroll() {
    setError(null);
    setSuccess(null);
    setEnrolling(true);
    const supabase = createClient();
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator App",
    });
    setEnrolling(false);
    if (enrollError) {
      setError(enrollError.message);
    } else if (data) {
      setEnrollData({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!enrollData || !verifyCode) return;

    setVerifying(true);
    const supabase = createClient();
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: enrollData.factorId });
    if (challengeError) {
      setError(challengeError.message);
      setVerifying(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollData.factorId,
      challengeId: challengeData.id,
      code: verifyCode,
    });
    setVerifying(false);
    if (verifyError) {
      setError(verifyError.message);
    } else {
      setSuccess("Authenticator enrolled successfully.");
      setEnrollData(null);
      setVerifyCode("");
      loadFactors();
    }
  }

  async function handleUnenroll(factorId: string) {
    setError(null);
    setSuccess(null);
    setUnenrollingId(factorId);
    const supabase = createClient();
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId,
    });
    setUnenrollingId(null);
    if (unenrollError) {
      setError(unenrollError.message);
    } else {
      setSuccess("Factor removed.");
      loadFactors();
    }
  }

  return (
    <section className="auth-settings-section">
      <h2 className="auth-settings-section-title">
        Multi-Factor Authentication
      </h2>
      <p className="auth-settings-section-desc">
        Add an extra layer of security with multi-factor authentication.
      </p>

      {error && <p className="auth-settings-error">{error}</p>}
      {success && <p className="auth-settings-success">{success}</p>}

      {loading ? (
        <p className="auth-settings-muted">Loading factors…</p>
      ) : (
        <div className="auth-mfa-factors">
          {factors.totp.length === 0 && factors.webauthn.length === 0 ? (
            <p className="auth-settings-muted">No MFA factors configured.</p>
          ) : (
            <ul className="auth-mfa-factor-list">
              {factors.totp.map((factor) => (
                <li key={factor.id} className="auth-mfa-factor-item">
                  <div className="auth-mfa-factor-info">
                    <span className="auth-mfa-factor-name">
                      {factor.friendly_name || "Authenticator"}
                    </span>
                    <span className="auth-mfa-factor-type">TOTP</span>
                  </div>
                  <button
                    type="button"
                    className="auth-settings-btn auth-settings-btn--danger"
                    onClick={() => handleUnenroll(factor.id)}
                    disabled={unenrollingId === factor.id}
                  >
                    {unenrollingId === factor.id ? "Removing…" : "Remove"}
                  </button>
                </li>
              ))}
              {factors.webauthn.map((factor) => (
                <li key={factor.id} className="auth-mfa-factor-item">
                  <div className="auth-mfa-factor-info">
                    <span className="auth-mfa-factor-name">
                      {factor.friendly_name || "Security Key"}
                    </span>
                    <span className="auth-mfa-factor-type">WebAuthn</span>
                  </div>
                  <button
                    type="button"
                    className="auth-settings-btn auth-settings-btn--danger"
                    onClick={() => handleUnenroll(factor.id)}
                    disabled={unenrollingId === factor.id}
                  >
                    {unenrollingId === factor.id ? "Removing…" : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {enrollData ? (
        <div className="auth-mfa-enroll">
          <h3 className="auth-mfa-enroll-title">Set Up Authenticator</h3>
          <p className="auth-settings-section-desc">
            Scan this QR code with your authenticator app, then enter the
            6-digit code below.
          </p>
          <img
            src={`data:image/png;base64,${enrollData.qrCode}`}
            alt="QR code for MFA enrollment"
            className="auth-mfa-qr"
          />
          <p className="auth-mfa-secret">
            <span>Manual entry key:</span>
            <code>{enrollData.secret}</code>
          </p>
          <form className="auth-settings-form" onSubmit={handleVerify}>
            <label className="auth-settings-field">
              <span>Verification code</span>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="000000"
                required
                pattern="[0-9]{6}"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </label>
            <div className="auth-mfa-enroll-actions">
              <button
                type="button"
                className="auth-settings-btn"
                onClick={() => {
                  setEnrollData(null);
                  setVerifyCode("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="auth-settings-btn auth-settings-btn--primary"
                disabled={verifying}
              >
                {verifying ? "Verifying…" : "Verify & Enable"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          className="auth-settings-btn auth-settings-btn--primary"
          onClick={handleEnroll}
          disabled={enrolling}
        >
          {enrolling ? "Enrolling…" : "Add Authenticator"}
        </button>
      )}
    </section>
  );
}
