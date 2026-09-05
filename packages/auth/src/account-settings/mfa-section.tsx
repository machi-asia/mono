"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import type { Factor } from "@supabase/supabase-js";
import { createClient } from "../client";

export function MFASection() {
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