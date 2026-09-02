"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "./provider";
import "./sign-in-modal.css";

type Mode = "signin" | "signup";

export function SignInModal() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsGuest } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSubmitting(true);
    const result =
      mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
    }
  }

  async function handleGuest() {
    setError(null);
    const result = await signInAsGuest();
    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="auth-modal">
        <h1 className="auth-modal-title">Welcome to Machi Asia</h1>
        <p className="auth-modal-subtitle">
          Sign in or continue as a guest to access the app.
        </p>

        <div className="auth-modal-options">
          <button
            type="button"
            className="auth-modal-provider auth-modal-provider--google"
            onClick={handleGoogle}
            disabled={submitting}
          >
            Continue with Google
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
              setError(null);
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

        {error && <p className="auth-modal-error">{error}</p>}
      </div>
    </div>
  );
}
