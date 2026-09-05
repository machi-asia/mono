"use client";

import { useState, useCallback } from "react";
import type { User, UserIdentity } from "@supabase/supabase-js";
import { createClient } from "../client";
import { GoogleIcon } from "../icons/google";
import { GithubIcon } from "../icons/github";

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

export function ProvidersSection({ user }: { user: User }) {
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
