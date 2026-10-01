"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "../provider/provider";
import { useToast } from "@mono/components";
import { GoogleIcon } from "../icons/google";
import { GithubIcon } from "../icons/github";
import "./sign-in-modal.css";

type Mode = "signin" | "signup";

interface SignInModalProps {
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export function SignInModal({
  onClose,
  title = "Welcome to Machi Asia",
  subtitle = "Sign in or continue as a guest to access the app.",
}: SignInModalProps = {}) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, signInAsGuest } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSubmitting(true);
    const result =
      mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
    setSubmitting(false);
    if (result.error) {
      toast("error", result.error);
    } else {
      onClose?.();
    }
  }

  async function handleGoogle() {
    const result = await signInWithGoogle();
    if (result.error) {
      toast("error", result.error);
    }
  }

  async function handleGithub() {
    const result = await signInWithGithub();
    if (result.error) {
      toast("error", result.error);
    }
  }

  async function handleGuest() {
    const result = await signInAsGuest();
    if (result.error) {
      toast("error", result.error);
    } else {
      onClose?.();
    }
  }

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      onClick={onClose}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-2)" }}>
          <h1 className="auth-modal-title">{title}</h1>
          {onClose ? (
            <button
              type="button"
              className="auth-settings-close"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "var(--space-1)",
              }}
            >
              ✕
            </button>
          ) : null}
        </div>
        <p className="auth-modal-subtitle">{subtitle}</p>

        <div className="auth-modal-options">
          <button
            type="button"
            className="auth-modal-provider auth-modal-provider--google"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            className="auth-modal-provider auth-modal-provider--github"
            onClick={handleGithub}
            disabled={submitting}
          >
            <GithubIcon />
            Continue with GitHub
          </button>

          <div className="auth-modal-divider">
            <span>or</span>
          </div>

          <form className="auth-modal-form" onSubmit={handleEmailSubmit}>
            <label className="auth-modal-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="auth-modal-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </label>

            <button type="submit" className="auth-modal-submit" disabled={submitting}>
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            className="auth-modal-toggle"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
            }}
          >
            {mode === "signin"
              ? "Don't have an account? Register"
              : "Already have an account? Sign in"}
          </button>

          <button
            type="button"
            className="auth-modal-guest"
            onClick={handleGuest}
            disabled={submitting}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
