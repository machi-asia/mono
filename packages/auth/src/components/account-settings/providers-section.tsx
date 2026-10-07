"use client";

import { useState, useCallback } from "react";
import type { User, UserIdentity } from "@supabase/supabase-js";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { createClient } from "../../client";
import { getAuthRedirectUrl } from "../../utils/redirect";
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

  async function handleLink(provider: string, promptSelect = false) {
    setError(null);
    setLinkingProvider(provider);
    try {
      const supabase = createClient();
      const options: { redirectTo: string; queryParams?: Record<string, string> } = {
        redirectTo: getAuthRedirectUrl(window.location.href),
      };

      if (promptSelect) {
        options.queryParams = { prompt: "select_account" };
      }

      const { data, error: linkError } = await supabase.auth.linkIdentity({
        provider: provider as "google" | "github" | "facebook" | "discord" | "twitter" | "apple",
        options,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link identity");
      setLinkingProvider(null);
    }
  }

  async function handleUnlink(identity: UserIdentity) {
    setError(null);
    setUnlinkingId(identity.id);
    try {
      const supabase = createClient();
      const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);
      setUnlinkingId(null);
      if (unlinkError) {
        setError(unlinkError.message);
      } else {
        await refreshIdentities();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlink identity");
      setUnlinkingId(null);
    }
  }

  return (
    <section className="auth-settings-section">
      <h2 className="auth-settings-section-title">Linked Providers</h2>
      <p className="auth-settings-section-desc">
        Connect, swap, or disconnect third-party authentication providers associated with your account.
      </p>
      {error && <p className="auth-settings-error">{error}</p>}
      <div className="auth-provider-list">
        {linkableProviders.map((provider) => {
          const isLinked = linkedProviders.has(provider);
          const identity = identities.find((i) => i.provider === provider);
          const idData = identity?.identity_data ?? {};
          const accountDetail =
            idData.email ||
            (idData.user_name ? `@${idData.user_name}` : undefined) ||
            idData.name ||
            idData.full_name;

          return (
            <div key={provider} className="auth-provider-item">
              <div className="auth-provider-info">
                <span className="auth-provider-id">
                  {provider === "google" ? <GoogleIcon size={18} /> : null}
                  {provider === "github" ? <GithubIcon size={18} /> : null}
                  <span className="auth-provider-name">
                    {providerLabels[provider] ?? provider}
                  </span>
                </span>
                {isLinked ? (
                  <div className="auth-provider-status-badge">
                    <CheckCircle2 size={12} className="auth-provider-status-icon" />
                    <span>{accountDetail || "Connected"}</span>
                  </div>
                ) : null}
              </div>

              <div className="auth-provider-actions">
                {isLinked && identity ? (
                  <>
                    <button
                      type="button"
                      className="auth-settings-btn auth-settings-btn--secondary auth-provider-swap-btn"
                      onClick={() => handleLink(provider, true)}
                      disabled={linkingProvider === provider || unlinkingId === identity.id}
                      title={`Swap to a different ${providerLabels[provider] ?? provider} account`}
                    >
                      <RefreshCw size={13} className={linkingProvider === provider ? "auth-spin" : ""} />
                      <span>{linkingProvider === provider ? "Swapping…" : "Swap Account"}</span>
                    </button>
                    <button
                      type="button"
                      className="auth-settings-btn auth-settings-btn--danger"
                      onClick={() => handleUnlink(identity)}
                      disabled={unlinkingId === identity.id || linkingProvider === provider}
                    >
                      {unlinkingId === identity.id ? "Unlinking…" : "Unlink"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="auth-settings-btn auth-settings-btn--secondary"
                    onClick={() => handleLink(provider, false)}
                    disabled={linkingProvider === provider}
                  >
                    {linkingProvider === provider ? "Linking…" : "Link"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

